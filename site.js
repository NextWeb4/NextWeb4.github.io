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

    refreshCurrentYear();
    resolveWallpaperUrl().then(applyWallpaper).catch(showFallback);
}());
