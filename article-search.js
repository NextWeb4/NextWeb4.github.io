(function () {
    'use strict';

    const script = document.currentScript;

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayArticleTitle(title, date) {
        return String(title || '');
    }

    function parseModuleLabels(value) {
        if (!value) return Object.create(null);
        try {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return Object.create(null);
            const labels = Object.create(null);
            Object.entries(parsed).forEach(([key, label]) => {
                if (typeof label === 'string') labels[String(key)] = label;
            });
            return labels;
        } catch (error) {
            return Object.create(null);
        }
    }

    function displayModuleName(moduleKey, labels) {
        const key = String(moduleKey || '');
        return labels && Object.prototype.hasOwnProperty.call(labels, key) ? labels[key] : key;
    }

    function normalizeSearchText(value) {
        return String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function tokenizeSearchQuery(value) {
        const normalized = normalizeSearchText(value).slice(0, 200);
        const terms = normalized.match(/[\u4e00-\u9fff]+|[a-z0-9]+/gi) || [];
        const tokens = [];
        const seen = new Set();
        const addToken = token => {
            if (tokens.length >= 32 || seen.has(token)) return;
            seen.add(token);
            tokens.push(token);
        };
        terms.some(term => {
            addToken(term);
            if (/^[\u4e00-\u9fff]{3,}$/.test(term)) {
                for (let index = 0; index < term.length - 1 && tokens.length < 32; index += 1) {
                    addToken(term.slice(index, index + 2));
                }
            }
            return tokens.length >= 32;
        });
        if (!tokens.length && normalized) addToken(normalized);
        return tokens;
    }

    function nextSuggestionIndex(currentIndex, direction, itemCount) {
        if (!Number.isInteger(itemCount) || itemCount <= 0) return -1;
        if (currentIndex < 0) return direction > 0 ? 0 : itemCount - 1;
        return (currentIndex + direction + itemCount) % itemCount;
    }

    function decodeSearchBits(value, size) {
        if (value === '' && size === 0) return null;
        if (typeof value !== 'string' || !Number.isInteger(size) || size <= 0) {
            throw new Error('Search content record has invalid Bloom fields');
        }
        try {
            const binary = atob(value);
            if (binary.length * 8 !== size) throw new Error('Search Bloom length mismatch');
            return Uint8Array.from(binary, character => character.charCodeAt(0));
        } catch (error) {
            throw new Error('Search content record has invalid Bloom data', { cause: error });
        }
    }

    async function hashSearchTokens(tokens) {
        if (!globalThis.crypto || !globalThis.crypto.subtle) return new Map();
        const encoder = new TextEncoder();
        const entries = await Promise.all(tokens.map(async token => {
            const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(token));
            const view = new DataView(digest);
            return [token, Array.from({ length: 7 }, (_, index) => view.getUint32(index * 4, false))];
        }));
        return new Map(entries);
    }

    function searchIdentity(item) {
        return JSON.stringify([
            String(item && item.title || ''),
            String(item && item.date || ''),
            String(item && item.module || ''),
        ]);
    }

    function prepareMetadata(items, moduleLabels) {
        if (!Array.isArray(items)) throw new Error('Search metadata must be an array');
        return items.map(item => ({
            ...item,
            _searchTitle: normalizeSearchText(item.title),
            _searchModule: normalizeSearchText(
                `${item.module || ''} ${displayModuleName(item.module, moduleLabels)}`
            ),
            _searchDate: normalizeSearchText(item.date),
            _searchBits: null,
            searchSize: 0,
            searchSalt: 0,
        }));
    }

    function mergeSearchContent(metadata, records) {
        if (!Array.isArray(records)) throw new Error('Search content must be an array');
        const prepared = new Map();
        records.forEach(record => {
            const key = searchIdentity(record);
            if (prepared.has(key)) throw new Error('Search content contains duplicate article identities');
            const size = record.searchSize;
            const salt = record.searchSalt;
            if (!Number.isInteger(salt) || salt < 0 || salt > 0xffffffff) {
                throw new Error('Search content record has an invalid Bloom salt');
            }
            prepared.set(key, {
                bits: decodeSearchBits(record.searchBits, size),
                size,
                salt,
            });
        });
        if (prepared.size !== metadata.length) throw new Error('Search metadata and content counts differ');
        metadata.forEach(item => {
            const content = prepared.get(searchIdentity(item));
            if (!content) throw new Error('Search content is missing an article identity');
        });
        return metadata.map(item => {
            const content = prepared.get(searchIdentity(item));
            return {
                ...item,
                _searchBits: content.bits,
                searchSize: content.size,
                searchSalt: content.salt,
            };
        });
    }

    function fetchJson(url, label) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error(`${label} returned ${response.status}`);
            return response.json();
        });
    }

    function createSearchLoader(metadataUrl, contentUrl, moduleLabels) {
        if (!metadataUrl || !contentUrl) throw new Error('Search loader requires both index URLs');
        let searchMetadataPromise = null;
        let searchContentPromise = null;

        function loadMetadata() {
            if (!searchMetadataPromise) {
                searchMetadataPromise = fetchJson(metadataUrl, 'Search metadata')
                    .then(items => prepareMetadata(items, moduleLabels))
                    .catch(error => {
                        searchMetadataPromise = null;
                        throw error;
                    });
            }
            return searchMetadataPromise;
        }

        function loadContent() {
            if (!searchContentPromise) {
                const recordsPromise = fetchJson(contentUrl, 'Search content');
                searchContentPromise = Promise.all([loadMetadata(), recordsPromise])
                    .then(([metadata, records]) => mergeSearchContent(metadata, records))
                    .catch(error => {
                        searchContentPromise = null;
                        throw error;
                    });
            }
            return searchContentPromise;
        }

        return Object.freeze({ loadMetadata, loadContent });
    }

    async function prepareSearchQuery(rawQuery) {
        const tokens = tokenizeSearchQuery(rawQuery);
        const tokenHashes = await hashSearchTokens(tokens);
        return Object.freeze({
            phrase: normalizeSearchText(rawQuery).slice(0, 200),
            tokens,
            tokenHashes,
            canSearchContent: tokenHashes.size > 0,
        });
    }

    function mixSearchHash(value, salt, index) {
        let mixed = (value ^ salt ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
        mixed = Math.imul(mixed ^ (mixed >>> 16), 0x7feb352d) >>> 0;
        mixed = Math.imul(mixed ^ (mixed >>> 15), 0x846ca68b) >>> 0;
        return (mixed ^ (mixed >>> 16)) >>> 0;
    }

    function bloomIncludes(item, hashes) {
        const bits = item._searchBits;
        const size = Number(item.searchSize) || 0;
        const salt = Number(item.searchSalt) || 0;
        if (!bits || !size || !hashes) return false;
        return hashes.every((hash, index) => {
            const position = mixSearchHash(hash, salt, index) % size;
            return Boolean(bits[position >> 3] & (1 << (position & 7)));
        });
    }

    function scoreSearchItem(item, query) {
        let score = 1;
        const matched = new Set();
        let phraseHit = false;
        const fields = [
            [item._searchTitle, { exact: 800, phrase: 360, token: 150 }],
            [item._searchModule, { exact: 120, phrase: 110, token: 55 }],
            [item._searchDate, { exact: 80, phrase: 70, token: 35 }],
        ];
        fields.forEach(([field, weights]) => {
            if (query.phrase && field.includes(query.phrase)) {
                phraseHit = true;
                score += weights.phrase;
                if (field === query.phrase) score += weights.exact;
            }
            query.tokens.forEach(token => {
                if (field.includes(token)) {
                    matched.add(token);
                    score += weights.token;
                }
            });
        });
        query.tokens.forEach(token => {
            if (bloomIncludes(item, query.tokenHashes.get(token))) {
                matched.add(token);
                score += 14;
            }
        });
        if (!phraseHit && matched.size === 0) return 0;
        if (query.tokens.length) {
            const coverage = matched.size / query.tokens.length;
            score += Math.round(coverage * 80);
            if (matched.size === query.tokens.length) score += 80;
            else if (query.tokens.length >= 3 && matched.size >= 2) score += 30;
        }
        if (phraseHit) score += 70;
        if (item.sticky) score += 5;
        return score;
    }

    function rankSearchItems(items, query, limit) {
        const ranked = items
            .map(item => ({ item, score: scoreSearchItem(item, query) }))
            .filter(entry => entry.score > 0)
            .sort((left, right) => (
                right.score - left.score
                || String(right.item.date || '').localeCompare(String(left.item.date || ''))
            ))
            .map(entry => entry.item);
        return Number.isFinite(limit) ? ranked.slice(0, Math.max(0, Math.trunc(limit))) : ranked;
    }

    const searchApi = Object.freeze({
        createSearchLoader,
        displayArticleTitle,
        displayModuleName,
        escapeHtml,
        prepareSearchQuery,
        rankSearchItems,
        nextSuggestionIndex,
    });
    globalThis.NextWebSearch = searchApi;

    const searchIndexUrl = script && script.dataset.searchIndex;
    const searchContentUrl = script && script.dataset.searchContent;
    if (!searchIndexUrl || !searchContentUrl) return;
    const moduleLabels = parseModuleLabels(script.dataset.moduleLabels);

    function initSearchSuggestions() {
        const searchInput = document.getElementById('global-search');
        const suggestions = document.getElementById('suggestions');
        const clearButton = document.querySelector('.clear-btn');
        const searchContainer = document.querySelector('.search-container');
        const searchWrapper = document.querySelector('.search-wrapper');
        const searchStatus = document.getElementById('search-status');
        if (!searchInput || !suggestions || !searchContainer || !searchWrapper) return;

        const loader = createSearchLoader(searchIndexUrl, searchContentUrl, moduleLabels);
        let activeSuggestion = -1;
        let searchRequestId = 0;
        let searchTimer = null;

        function setSuggestionsOpen(open) {
            suggestions.style.display = open ? 'block' : 'none';
            searchInput.setAttribute('aria-expanded', String(open));
            if (!open) {
                activeSuggestion = -1;
                searchInput.removeAttribute('aria-activedescendant');
                suggestions.querySelectorAll('.suggestion-item').forEach(item => item.setAttribute('aria-selected', 'false'));
            }
        }

        function dismissSearch() {
            searchRequestId += 1;
            window.clearTimeout(searchTimer);
            searchTimer = null;
            suggestions.removeAttribute('aria-busy');
            setSuggestionsOpen(false);
        }

        function announceSearch(message) {
            if (searchStatus) searchStatus.textContent = message;
        }

        function renderMatches(matches) {
            if (!matches.length) {
                setSuggestionsOpen(false);
                announceSearch('未找到匹配文章');
                return;
            }
            const selectedIdentity = activeSuggestion >= 0
                ? suggestions.querySelectorAll('.suggestion-item')[activeSuggestion]?.dataset.searchIdentity || ''
                : '';
            suggestions.innerHTML = matches.map((item, index) => `
                <a class="suggestion-item" id="search-option-${index}" role="option" aria-selected="false" tabindex="-1" data-search-identity="${escapeHtml(searchIdentity(item))}" href="../article/${encodeURIComponent(item.title)}.html">
                    <span class="suggestion-main">
                        <span class="suggestion-title">${escapeHtml(displayArticleTitle(item.title, item.date))}</span>
                        <span class="suggestion-excerpt">${escapeHtml(item.excerpt || item.module || '')}</span>
                    </span>
                    <span class="suggestion-date">${escapeHtml(displayModuleName(item.module, moduleLabels))} · ${escapeHtml(item.date || '')}</span>
                </a>
            `).join('');
            const items = Array.from(suggestions.querySelectorAll('.suggestion-item'));
            activeSuggestion = selectedIdentity
                ? items.findIndex(item => item.dataset.searchIdentity === selectedIdentity)
                : -1;
            items.forEach((item, index) => item.setAttribute('aria-selected', String(index === activeSuggestion)));
            if (activeSuggestion >= 0) {
                searchInput.setAttribute('aria-activedescendant', items[activeSuggestion].id);
            } else {
                searchInput.removeAttribute('aria-activedescendant');
            }
            setSuggestionsOpen(true);
            announceSearch(`找到 ${matches.length} 篇文章`);
        }

        function moveSuggestion(direction) {
            const items = Array.from(suggestions.querySelectorAll('.suggestion-item'));
            if (!items.length) return;
            activeSuggestion = nextSuggestionIndex(activeSuggestion, direction, items.length);
            items.forEach((item, index) => item.setAttribute('aria-selected', String(index === activeSuggestion)));
            const selected = items[activeSuggestion];
            searchInput.setAttribute('aria-activedescendant', selected.id);
            selected.scrollIntoView({ block: 'nearest' });
        }

        searchInput.addEventListener('input', function (event) {
            const keyword = event.target.value.trim().slice(0, 200);
            const requestId = ++searchRequestId;
            window.clearTimeout(searchTimer);
            setSuggestionsOpen(false);
            if (!keyword) {
                searchContainer.classList.remove('has-text');
                suggestions.removeAttribute('aria-busy');
                announceSearch('');
                return;
            }
            searchContainer.classList.add('has-text');
            suggestions.setAttribute('aria-busy', 'true');
            announceSearch('正在搜索…');
            searchTimer = window.setTimeout(async function () {
                let metadataMatches = [];
                try {
                    const queryPromise = prepareSearchQuery(keyword);
                    const metadataPromise = loader.loadMetadata();
                    const [metadata, query] = await Promise.all([metadataPromise, queryPromise]);
                    if (requestId !== searchRequestId || searchInput.value.trim().slice(0, 200) !== keyword) return;
                    metadataMatches = rankSearchItems(metadata, query, 8);
                    if (metadataMatches.length) renderMatches(metadataMatches);

                    if (globalThis.crypto && globalThis.crypto.subtle && query.canSearchContent) {
                        try {
                            // Let metadata results render before starting the substantially larger
                            // Bloom payload, and give a dismissal/new query a chance to cancel it.
                            await new Promise(resolve => window.setTimeout(resolve, 0));
                            if (requestId !== searchRequestId || searchInput.value.trim().slice(0, 200) !== keyword) return;
                            const completeIndex = await loader.loadContent();
                            if (requestId !== searchRequestId || searchInput.value.trim().slice(0, 200) !== keyword) return;
                            renderMatches(rankSearchItems(completeIndex, query, 8));
                        } catch (contentError) {
                            console.warn('正文搜索数据加载失败，已保留标题搜索结果', contentError);
                            if (!metadataMatches.length) {
                                setSuggestionsOpen(false);
                                announceSearch('搜索数据加载失败，请稍后重试');
                            }
                        }
                    } else if (!metadataMatches.length) {
                        renderMatches([]);
                    }
                } catch (error) {
                    if (requestId !== searchRequestId) return;
                    console.error('搜索失败', error);
                    setSuggestionsOpen(false);
                    announceSearch('搜索失败，请稍后重试');
                } finally {
                    if (requestId === searchRequestId) suggestions.removeAttribute('aria-busy');
                }
            }, 160);
        });

        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (suggestions.style.display !== 'block') return;
                event.preventDefault();
                moveSuggestion(event.key === 'ArrowDown' ? 1 : -1);
            } else if (event.key === 'Enter' && activeSuggestion >= 0) {
                event.preventDefault();
                suggestions.querySelectorAll('.suggestion-item')[activeSuggestion]?.click();
            } else if (event.key === 'Escape') {
                dismissSearch();
            }
        });

        if (clearButton) {
            clearButton.addEventListener('click', function () {
                searchInput.value = '';
                searchContainer.classList.remove('has-text');
                dismissSearch();
                announceSearch('');
                searchInput.focus();
            });
        }

        document.addEventListener('click', function (event) {
            if (!searchWrapper.contains(event.target)) dismissSearch();
        });

        searchWrapper.addEventListener('focusout', function () {
            requestAnimationFrame(function () {
                if (!searchWrapper.contains(document.activeElement)) dismissSearch();
            });
        });
    }

    initSearchSuggestions();
}());
