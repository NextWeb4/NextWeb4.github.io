(function () {
    'use strict';

    const CACHE_KEY = 'dailyWallpaperCache.v1';
    const FALLBACK_COLOR = '#1a1a1e';
    const API_ORIGIN = 'https://bing.biturl.top/';

    function refreshCurrentYear() {
        const year = String(new Date().getFullYear());
        document.querySelectorAll('[data-archive-year]').forEach(function (element) {
            element.dataset.archiveYear = year;
        });
        document.querySelectorAll('[data-current-year]').forEach(function (element) {
            element.textContent = year;
        });
    }

    function localDateKey() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function wallpaperResolution() {
        return window.matchMedia('(max-width: 768px)').matches ? 1366 : 1920;
    }

    function validateWallpaperUrl(value) {
        try {
            const url = new URL(String(value || ''));
            const trustedHost = url.hostname === 'bing.com' || url.hostname.endsWith('.bing.com');
            return url.protocol === 'https:' && trustedHost ? url.href : '';
        } catch (error) {
            return '';
        }
    }

    function readCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (!cached || typeof cached !== 'object') return null;
            const url = validateWallpaperUrl(cached.url);
            if (!url) return null;
            return {
                date: String(cached.date || ''),
                resolution: Number(cached.resolution),
                url,
            };
        } catch (error) {
            return null;
        }
    }

    function writeCache(value) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(value));
        } catch (error) {
            // Private browsing or storage policy may disable localStorage.
        }
    }

    function clearCache() {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (error) {
            // Storage access can be disabled without affecting the fallback.
        }
    }

    async function resolveWallpaperUrl() {
        const connection = navigator.connection;
        if (connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType))) {
            throw new Error('Wallpaper disabled on a constrained connection');
        }
        const resolution = wallpaperResolution();
        const date = localDateKey();
        const cached = readCache();
        if (cached && cached.date === date && cached.resolution === resolution) {
            return cached.url;
        }

        const apiUrl = new URL(API_ORIGIN);
        apiUrl.searchParams.set('resolution', String(resolution));
        apiUrl.searchParams.set('format', 'json');
        apiUrl.searchParams.set('index', '0');
        apiUrl.searchParams.set('mkt', 'zh-CN');

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        try {
            const response = await fetch(apiUrl, {
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                signal: controller.signal,
            });
            if (!response.ok) throw new Error(`Wallpaper API returned ${response.status}`);
            const payload = await response.json();
            const url = validateWallpaperUrl(payload && payload.url);
            if (!url) throw new Error('Wallpaper API returned an untrusted URL');
            writeCache({ date, resolution, url });
            return url;
        } catch (error) {
            if (cached) return cached.url;
            throw error;
        } finally {
            window.clearTimeout(timeout);
        }
    }

    function applyWallpaper(url, allowRetry = true) {
        const image = new Image();
        image.decoding = 'async';
        image.fetchPriority = 'low';
        image.referrerPolicy = 'no-referrer';
        image.onload = function () {
            document.body.style.backgroundImage = `url("${url}")`;
            document.documentElement.dataset.wallpaper = 'ready';
        };
        image.onerror = function () {
            if (allowRetry) {
                clearCache();
                resolveWallpaperUrl().then(function (replacementUrl) {
                    applyWallpaper(replacementUrl, false);
                }).catch(showFallback);
                return;
            }
            showFallback();
        };
        image.src = url;
    }

    function showFallback() {
        // Set only the color: the shorthand `background` would reset the
        // shared cover/position/repeat wallpaper geometry on every page.
        document.body.style.backgroundColor = FALLBACK_COLOR;
        document.documentElement.dataset.wallpaper = 'fallback';
    }

    const DEVTOOLS_THRESHOLD = 240;
    const DEVTOOLS_MIN_VIEWPORT = 720;

    function hasDockedDevtoolsViewportDelta(widthDelta, heightDelta, innerWidth) {
        const dimensions = [widthDelta, heightDelta, innerWidth];
        return dimensions.every(Number.isFinite)
            && innerWidth >= DEVTOOLS_MIN_VIEWPORT
            && (widthDelta > DEVTOOLS_THRESHOLD || heightDelta > DEVTOOLS_THRESHOLD);
    }

    function createProtectionShield() {
        const shield = document.createElement('div');
        const panel = document.createElement('div');
        const title = document.createElement('strong');
        const message = document.createElement('span');
        shield.className = 'site-protection-shield';
        shield.setAttribute('role', 'status');
        shield.setAttribute('aria-live', 'polite');
        shield.setAttribute('aria-hidden', 'true');
        title.textContent = '页面保护已启用';
        message.textContent = '此操作不可用，请使用页面提供的点击与输入功能。';
        panel.append(title, message);
        shield.appendChild(panel);
        document.body.appendChild(shield);
        return { shield, title, message };
    }

    function protectPublicPage() {
        const body = document.body;
        if (!body) return;
        const protection = createProtectionShield();
        const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)');
        const isEmbeddedPreview = window.self !== window.top;
        let noticeTimer = 0;
        let viewportFrame = 0;
        let noticeVisible = false;
        let dockedDevtoolsDetected = false;
        let baselinePixelRatio = window.devicePixelRatio;
        let baselineWidthDelta = Math.max(0, window.outerWidth - window.innerWidth);
        let baselineHeightDelta = Math.max(0, window.outerHeight - window.innerHeight);

        const updateProtectionState = function () {
            body.classList.toggle('is-protection-notice', noticeVisible && !dockedDevtoolsDetected);
            body.classList.toggle('is-devtools-detected', dockedDevtoolsDetected);
            protection.title.textContent = dockedDevtoolsDetected ? '页面已进入保护模式' : '页面保护已启用';
            protection.message.textContent = dockedDevtoolsDetected
                ? '请关闭开发者工具后继续浏览。'
                : '此操作不可用，请使用页面提供的点击与输入功能。';
            protection.shield.setAttribute(
                'aria-hidden',
                noticeVisible || dockedDevtoolsDetected ? 'false' : 'true'
            );
        };

        const showProtectionNotice = function () {
            window.clearTimeout(noticeTimer);
            noticeVisible = true;
            updateProtectionState();
            noticeTimer = window.setTimeout(function () {
                noticeVisible = false;
                updateProtectionState();
            }, 1600);
        };

        ['contextmenu', 'copy', 'cut', 'paste', 'dragstart'].forEach(function (eventName) {
            document.addEventListener(eventName, function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                showProtectionNotice();
            }, true);
        });

        document.addEventListener('selectstart', function (event) {
            const target = event.target;
            const editable = target && target.closest
                ? target.closest('input, textarea, select, [contenteditable="true"]')
                : null;
            if (!editable) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, true);

        document.querySelectorAll('img').forEach(function (image) {
            image.draggable = false;
        });

        document.addEventListener('keydown', function (event) {
            const key = String(event.key || '').toLowerCase();
            const devtoolsKey = new Set(['i', 'j', 'c', 'k']).has(key);
            const blockedCommand = new Set(['c', 'p', 's', 'u', 'v', 'x']).has(key);
            const blocked = event.key === 'F12'
                || event.code === 'F12'
                || key === 'contextmenu'
                || (event.shiftKey && key === 'f10')
                || (event.ctrlKey && event.shiftKey && devtoolsKey)
                || (event.metaKey && event.altKey && devtoolsKey)
                || ((event.ctrlKey || event.metaKey) && blockedCommand);
            if (blocked) {
                event.preventDefault();
                event.stopImmediatePropagation();
                showProtectionNotice();
            }
        }, true);

        const checkDockedDevtools = function () {
            viewportFrame = 0;
            const pixelRatioChanged = Number.isFinite(window.devicePixelRatio)
                && Number.isFinite(baselinePixelRatio)
                && Math.abs(window.devicePixelRatio - baselinePixelRatio) > 0.01;
            if (pixelRatioChanged) {
                baselinePixelRatio = window.devicePixelRatio;
                baselineWidthDelta = Math.max(0, window.outerWidth - window.innerWidth);
                baselineHeightDelta = Math.max(0, window.outerHeight - window.innerHeight);
            }
            const widthDelta = Math.max(0, window.outerWidth - window.innerWidth - baselineWidthDelta);
            const heightDelta = Math.max(0, window.outerHeight - window.innerHeight - baselineHeightDelta);
            const detected = !isEmbeddedPreview
                && !pixelRatioChanged
                && !coarsePointer.matches
                && hasDockedDevtoolsViewportDelta(widthDelta, heightDelta, window.innerWidth);
            if (detected !== dockedDevtoolsDetected) {
                dockedDevtoolsDetected = detected;
                updateProtectionState();
            }
        };

        const scheduleDockedDevtoolsCheck = function () {
            if (viewportFrame) window.cancelAnimationFrame(viewportFrame);
            viewportFrame = window.requestAnimationFrame(checkDockedDevtools);
        };

        window.addEventListener('resize', scheduleDockedDevtoolsCheck, { passive: true });
        window.addEventListener('pageshow', scheduleDockedDevtoolsCheck);
        coarsePointer.addEventListener?.('change', scheduleDockedDevtoolsCheck);
        scheduleDockedDevtoolsCheck();
    }

    refreshCurrentYear();
    protectPublicPage();
    resolveWallpaperUrl().then(applyWallpaper).catch(showFallback);
}());
