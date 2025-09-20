class ZiyuansoSearch {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSearch();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        const hotKeywords = document.querySelectorAll('.hot-keyword');
        const categoryCards = document.querySelectorAll('.category-card');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e);
                }
            });

            searchInput.addEventListener('input', (e) => {
                this.handleSearchSuggestions(e.target.value);
            });
        }

        hotKeywords.forEach(keyword => {
            keyword.addEventListener('click', (e) => {
                e.preventDefault();
                const query = keyword.textContent.trim();
                this.performSearch(query);
            });
        });

        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('href').split('category=')[1];
                this.performCategorySearch(category);
            });
        });
    }

    handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get('q');
        const platforms = formData.getAll('platform');

        if (!query || query.trim() === '') {
            this.showAlert('请输入搜索关键词', 'warning');
            return;
        }

        this.performSearch(query, platforms);
    }

    performSearch(query, platforms = ['baidu', 'aliyun', 'quark']) {
        const searchParams = new URLSearchParams({
            q: query,
            platforms: platforms.join(',')
        });

        this.showLoading(true);

        setTimeout(() => {
            window.location.href = `/pages/search.html?${searchParams.toString()}`;
        }, 500);
    }

    performCategorySearch(category) {
        const searchParams = new URLSearchParams({
            category: category
        });

        this.showLoading(true);

        setTimeout(() => {
            window.location.href = `/pages/search.html?${searchParams.toString()}`;
        }, 500);
    }

    handleSearchSuggestions(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        const suggestions = this.getSuggestions(query);
        this.showSuggestions(suggestions);
    }

    getSuggestions(query) {
        const commonSuggestions = [
            '电影资源', '电视剧下载', '音乐专辑', '软件安装包',
            '教程视频', '文档资料', '游戏安装包', '动漫资源',
            '综艺节目', '纪录片', '有声书', '电子书',
            'Office办公软件', 'Adobe设计软件', '编程工具',
            '英语学习', '考试资料', '技术文档'
        ];

        return commonSuggestions
            .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);
    }

    showSuggestions(suggestions) {
        let suggestionBox = document.querySelector('.search-suggestions');

        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.className = 'search-suggestions';
            const searchContainer = document.querySelector('.search-input-wrapper');
            searchContainer.appendChild(suggestionBox);
        }

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionHTML = suggestions.map(suggestion =>
            `<div class="suggestion-item" data-suggestion="${suggestion}">
                <span class="suggestion-icon">🔍</span>
                <span class="suggestion-text">${suggestion}</span>
            </div>`
        ).join('');

        suggestionBox.innerHTML = suggestionHTML;
        suggestionBox.style.display = 'block';

        suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestion = item.dataset.suggestion;
                document.querySelector('.search-input').value = suggestion;
                this.performSearch(suggestion);
                this.hideSuggestions();
            });
        });
    }

    hideSuggestions() {
        const suggestionBox = document.querySelector('.search-suggestions');
        if (suggestionBox) {
            suggestionBox.style.display = 'none';
        }
    }

    showLoading(show = true) {
        let loadingOverlay = document.querySelector('.loading-overlay');

        if (show && !loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>正在搜索资源...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        } else if (!show && loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span class="alert-icon">${this.getAlertIcon(type)}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 100);

        const closeBtn = alertDiv.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            this.hideAlert(alertDiv);
        });

        setTimeout(() => {
            this.hideAlert(alertDiv);
        }, 5000);
    }

    hideAlert(alertDiv) {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }

    getAlertIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    initializeSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = query;
            }
        }
    }
}

// 频道管理器 - 管理各种搜索频道和插件
class ChannelManager {
    constructor() {
        this.channels = new Map();
        this.plugins = new Map();
        this.initializeChannels();
        this.initializePlugins();
    }

    // 初始化内置频道
    initializeChannels() {
        // 百度网盘频道
        this.registerChannel('baidu', {
            name: '百度网盘',
            icon: '📦',
            enabled: true,
            searchUrl: 'https://pan.baidu.com/s/',
            searchFunction: this.searchBaiduPan.bind(this)
        });

        // 阿里云盘频道
        this.registerChannel('aliyun', {
            name: '阿里云盘',
            icon: '☁️',
            enabled: true,
            searchUrl: 'https://www.aliyundrive.com/s/',
            searchFunction: this.searchAliyunPan.bind(this)
        });

        // 夸克网盘频道
        this.registerChannel('quark', {
            name: '夸克网盘',
            icon: '⚡',
            enabled: true,
            searchUrl: 'https://pan.quark.cn/s/',
            searchFunction: this.searchQuarkPan.bind(this)
        });

        // 迅雷网盘频道
        this.registerChannel('xunlei', {
            name: '迅雷网盘',
            icon: '⚡',
            enabled: false,
            searchUrl: 'https://pan.xunlei.com/s/',
            searchFunction: this.searchXunleiPan.bind(this)
        });
    }

    // 初始化插件系统
    initializePlugins() {
        // 磁力链接插件
        this.registerPlugin('magnet', {
            name: '磁力搜索',
            icon: '🧲',
            enabled: true,
            searchFunction: this.searchMagnet.bind(this)
        });

        // 电影资源插件
        this.registerPlugin('movie', {
            name: '电影资源',
            icon: '🎬',
            enabled: true,
            searchFunction: this.searchMovies.bind(this)
        });

        // 音乐资源插件
        this.registerPlugin('music', {
            name: '音乐资源',
            icon: '🎵',
            enabled: true,
            searchFunction: this.searchMusic.bind(this)
        });
    }

    // 注册频道
    registerChannel(id, config) {
        this.channels.set(id, {
            id,
            ...config,
            lastUsed: null,
            resultCount: 0,
            status: 'ready'
        });
    }

    // 注册插件
    registerPlugin(id, config) {
        this.plugins.set(id, {
            id,
            ...config,
            lastUsed: null,
            resultCount: 0,
            status: 'ready'
        });
    }

    // 获取启用的频道
    getEnabledChannels() {
        return Array.from(this.channels.values()).filter(channel => channel.enabled);
    }

    // 获取启用的插件
    getEnabledPlugins() {
        return Array.from(this.plugins.values()).filter(plugin => plugin.enabled);
    }

    // 百度网盘搜索实现
    async searchBaiduPan(query, options = {}) {
        try {
            // 这里应该连接到实际的百度网盘搜索API
            // 示例返回结构
            return this.generateChannelResults('baidu', query, {
                baseSize: '2-15GB',
                types: ['video', 'archive', 'software'],
                quality: ['high', 'medium']
            });
        } catch (error) {
            console.error('百度网盘搜索错误:', error);
            return [];
        }
    }

    // 阿里云盘搜索实现
    async searchAliyunPan(query, options = {}) {
        try {
            return this.generateChannelResults('aliyun', query, {
                baseSize: '1-8GB',
                types: ['video', 'document', 'music'],
                quality: ['high', 'medium']
            });
        } catch (error) {
            console.error('阿里云盘搜索错误:', error);
            return [];
        }
    }

    // 夸克网盘搜索实现
    async searchQuarkPan(query, options = {}) {
        try {
            return this.generateChannelResults('quark', query, {
                baseSize: '500MB-5GB',
                types: ['video', 'software', 'archive'],
                quality: ['medium', 'high']
            });
        } catch (error) {
            console.error('夸克网盘搜索错误:', error);
            return [];
        }
    }

    // 迅雷网盘搜索实现
    async searchXunleiPan(query, options = {}) {
        try {
            return this.generateChannelResults('xunlei', query, {
                baseSize: '1-10GB',
                types: ['video', 'game', 'software'],
                quality: ['medium', 'high']
            });
        } catch (error) {
            console.error('迅雷网盘搜索错误:', error);
            return [];
        }
    }

    // 磁力搜索插件
    async searchMagnet(query, options = {}) {
        try {
            return this.generatePluginResults('magnet', query, {
                baseSize: '100MB-50GB',
                types: ['video', 'music', 'software', 'game'],
                quality: ['high', 'medium', 'low']
            });
        } catch (error) {
            console.error('磁力搜索错误:', error);
            return [];
        }
    }

    // 电影搜索插件
    async searchMovies(query, options = {}) {
        try {
            return this.generatePluginResults('movie', query, {
                baseSize: '1-20GB',
                types: ['video'],
                quality: ['high', 'medium'],
                movieSpecific: true
            });
        } catch (error) {
            console.error('电影搜索错误:', error);
            return [];
        }
    }

    // 音乐搜索插件
    async searchMusic(query, options = {}) {
        try {
            return this.generatePluginResults('music', query, {
                baseSize: '5-500MB',
                types: ['music', 'archive'],
                quality: ['high', 'medium'],
                musicSpecific: true
            });
        } catch (error) {
            console.error('音乐搜索错误:', error);
            return [];
        }
    }

    // 生成频道搜索结果
    generateChannelResults(channelId, query, config) {
        const channel = this.channels.get(channelId);
        const results = [];
        const resultCount = Math.floor(Math.random() * 20) + 5; // 5-25个结果

        for (let i = 0; i < resultCount; i++) {
            const type = config.types[Math.floor(Math.random() * config.types.length)];
            const quality = config.quality[Math.floor(Math.random() * config.quality.length)];

            results.push({
                id: `${channelId}_${Date.now()}_${i}`,
                title: this.generateTitle(query, type, config),
                platform: channelId,
                platformName: channel.name,
                size: this.generateSize(config.baseSize),
                type: type,
                date: this.generateDate(),
                quality: quality,
                downloadUrl: `${channel.searchUrl}${this.generateShareCode()}`,
                source: 'channel',
                channelId: channelId
            });
        }

        channel.resultCount = results.length;
        channel.lastUsed = new Date();

        return results;
    }

    // 生成插件搜索结果
    generatePluginResults(pluginId, query, config) {
        const plugin = this.plugins.get(pluginId);
        const results = [];
        const resultCount = Math.floor(Math.random() * 15) + 3; // 3-18个结果

        for (let i = 0; i < resultCount; i++) {
            const type = config.types[Math.floor(Math.random() * config.types.length)];
            const quality = config.quality[Math.floor(Math.random() * config.quality.length)];

            results.push({
                id: `${pluginId}_${Date.now()}_${i}`,
                title: this.generatePluginTitle(query, type, config),
                platform: pluginId,
                platformName: plugin.name,
                size: this.generateSize(config.baseSize),
                type: type,
                date: this.generateDate(),
                quality: quality,
                downloadUrl: this.generatePluginUrl(pluginId, query),
                source: 'plugin',
                pluginId: pluginId
            });
        }

        plugin.resultCount = results.length;
        plugin.lastUsed = new Date();

        return results;
    }

    // 生成标题
    generateTitle(query, type, config) {
        const prefixes = {
            video: ['【高清】', '【4K】', '【蓝光】', '【HDR】'],
            music: ['【无损】', '【FLAC】', '【320K】', '【专辑】'],
            software: ['【破解版】', '【绿色版】', '【完整版】', '【专业版】'],
            document: ['【完整版】', '【高清扫描】', '【文字版】', '【合集】'],
            archive: ['【合集】', '【打包】', '【完整版】', '【资源包】'],
            game: ['【破解版】', '【完整版】', '【汉化版】', '【免安装】']
        };

        const suffixes = {
            video: ['高清版', '完整版', '导演剪辑版', '加长版'],
            music: ['专辑合集', '精选集', '现场版', '重制版'],
            software: ['最新版', '专业版', '企业版', '完整版'],
            document: ['完整版', '高清版', '文字版', '扫描版'],
            archive: ['资源包', '合集', '大礼包', '完整版'],
            game: ['完整版', '豪华版', '年度版', '终极版']
        };

        const prefix = prefixes[type] ? prefixes[type][Math.floor(Math.random() * prefixes[type].length)] : '';
        const suffix = suffixes[type] ? suffixes[type][Math.floor(Math.random() * suffixes[type].length)] : '';

        return `${prefix}${query} ${suffix}`;
    }

    // 生成插件标题
    generatePluginTitle(query, type, config) {
        if (config.movieSpecific) {
            const years = ['2024', '2023', '2022', '2021'];
            const qualities = ['4K', '1080P', '720P', 'HDR'];
            const year = years[Math.floor(Math.random() * years.length)];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            return `${query}(${year}).${quality}.电影完整版`;
        }

        if (config.musicSpecific) {
            const formats = ['FLAC', 'APE', 'MP3-320K', 'DSD'];
            const format = formats[Math.floor(Math.random() * formats.length)];
            return `${query} 专辑合集 [${format}无损格式]`;
        }

        return this.generateTitle(query, type, config);
    }

    // 生成文件大小
    generateSize(baseSize) {
        const sizes = baseSize.split('-');
        if (sizes.length === 2) {
            const min = parseFloat(sizes[0]);
            const max = parseFloat(sizes[1]);
            const size = (Math.random() * (max - min) + min).toFixed(1);
            const unit = sizes[1].includes('GB') ? 'GB' : 'MB';
            return `${size} ${unit}`;
        }
        return baseSize;
    }

    // 生成日期
    generateDate() {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // 30天内
        const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }

    // 生成分享码
    generateShareCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 生成插件URL
    generatePluginUrl(pluginId, query) {
        const urls = {
            magnet: `magnet:?xt=urn:btih:${this.generateShareCode()}`,
            movie: `https://movie-source.example.com/watch/${encodeURIComponent(query)}`,
            music: `https://music-source.example.com/listen/${encodeURIComponent(query)}`
        };
        return urls[pluginId] || '#';
    }

    // 执行搜索
    async performSearch(query, enabledPlatforms = [], options = {}) {
        const results = [];
        const promises = [];

        // 搜索频道
        for (const platform of enabledPlatforms) {
            const channel = this.channels.get(platform);
            if (channel && channel.enabled) {
                channel.status = 'searching';
                promises.push(
                    channel.searchFunction(query, options)
                        .then(channelResults => {
                            channel.status = 'completed';
                            return channelResults;
                        })
                        .catch(error => {
                            channel.status = 'error';
                            console.error(`频道 ${platform} 搜索失败:`, error);
                            return [];
                        })
                );
            }
        }

        // 搜索插件
        const enabledPlugins = this.getEnabledPlugins();
        for (const plugin of enabledPlugins) {
            plugin.status = 'searching';
            promises.push(
                plugin.searchFunction(query, options)
                    .then(pluginResults => {
                        plugin.status = 'completed';
                        return pluginResults;
                    })
                    .catch(error => {
                        plugin.status = 'error';
                        console.error(`插件 ${plugin.id} 搜索失败:`, error);
                        return [];
                    })
            );
        }

        // 等待所有搜索完成
        const allResults = await Promise.all(promises);

        // 合并结果
        allResults.forEach(resultSet => {
            results.push(...resultSet);
        });

        // 按相关度和质量排序
        return this.sortResults(results, query);
    }

    // 结果排序
    sortResults(results, query) {
        return results.sort((a, b) => {
            // 按标题相关度排序
            const aRelevance = this.calculateRelevance(a.title, query);
            const bRelevance = this.calculateRelevance(b.title, query);

            if (aRelevance !== bRelevance) {
                return bRelevance - aRelevance;
            }

            // 按质量排序
            const qualityScore = { high: 3, medium: 2, low: 1 };
            const aQuality = qualityScore[a.quality] || 0;
            const bQuality = qualityScore[b.quality] || 0;

            if (aQuality !== bQuality) {
                return bQuality - aQuality;
            }

            // 按日期排序
            return new Date(b.date) - new Date(a.date);
        });
    }

    // 计算相关度
    calculateRelevance(title, query) {
        const titleLower = title.toLowerCase();
        const queryLower = query.toLowerCase();

        if (titleLower.includes(queryLower)) {
            return 100;
        }

        const queryWords = queryLower.split(' ');
        let score = 0;

        queryWords.forEach(word => {
            if (titleLower.includes(word)) {
                score += 10;
            }
        });

        return score;
    }

    // 获取搜索统计
    getSearchStats() {
        const channelStats = Array.from(this.channels.values()).map(channel => ({
            id: channel.id,
            name: channel.name,
            enabled: channel.enabled,
            status: channel.status,
            resultCount: channel.resultCount,
            lastUsed: channel.lastUsed
        }));

        const pluginStats = Array.from(this.plugins.values()).map(plugin => ({
            id: plugin.id,
            name: plugin.name,
            enabled: plugin.enabled,
            status: plugin.status,
            resultCount: plugin.resultCount,
            lastUsed: plugin.lastUsed
        }));

        return { channels: channelStats, plugins: pluginStats };
    }
}

class SearchResultsPage {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.totalItems = 0;
        this.currentQuery = '';
        this.currentPlatforms = [];
        this.channelManager = new ChannelManager();
        this.allResults = [];
        this.filteredResults = [];
        this.init();
    }

    init() {
        if (window.location.pathname.includes('search.html')) {
            this.parseUrlParams();
            this.setupFilters();
            this.loadSearchResults();
            this.setupPagination();
        }
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentQuery = urlParams.get('q') || '';
        this.currentPlatforms = urlParams.get('platforms') ?
            urlParams.get('platforms').split(',') : ['baidu', 'aliyun', 'quark'];
        this.currentCategory = urlParams.get('category') || '';
    }

    async loadSearchResults() {
        this.showLoading(true);

        try {
            // 使用频道管理器进行搜索
            this.allResults = await this.channelManager.performSearch(
                this.currentQuery,
                this.currentPlatforms,
                {
                    category: this.currentCategory,
                    page: this.currentPage,
                    limit: this.itemsPerPage * 3 // 获取更多结果用于筛选
                }
            );

            // 应用筛选
            this.applyFilters();

            // 显示结果
            this.displayCurrentPage();

            // 显示搜索统计
            this.displaySearchStats();

        } catch (error) {
            console.error('搜索失败:', error);
            this.showAlert('搜索失败，请稍后重试', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 应用筛选条件
    applyFilters() {
        let results = [...this.allResults];

        // 文件类型筛选
        const fileType = this.getSelectedFilter('filetype');
        if (fileType && fileType !== 'all') {
            results = results.filter(result => result.type === fileType);
        }

        // 文件大小筛选
        const fileSize = this.getSelectedFilter('filesize');
        if (fileSize && fileSize !== 'all') {
            results = results.filter(result => {
                const size = parseFloat(result.size);
                const unit = result.size.includes('GB') ? 'GB' : 'MB';
                const sizeInMB = unit === 'GB' ? size * 1024 : size;

                switch (fileSize) {
                    case 'small': return sizeInMB < 100;
                    case 'medium': return sizeInMB >= 100 && sizeInMB <= 1024;
                    case 'large': return sizeInMB > 1024;
                    default: return true;
                }
            });
        }

        // 时间范围筛选
        const timeRange = this.getSelectedFilter('timerange');
        if (timeRange && timeRange !== 'all') {
            const now = new Date();
            results = results.filter(result => {
                const resultDate = new Date(result.date);
                const daysDiff = (now - resultDate) / (1000 * 60 * 60 * 24);

                switch (timeRange) {
                    case 'day': return daysDiff <= 1;
                    case 'week': return daysDiff <= 7;
                    case 'month': return daysDiff <= 30;
                    default: return true;
                }
            });
        }

        this.filteredResults = results;
        this.totalItems = results.length;
    }

    // 获取选中的筛选条件
    getSelectedFilter(filterName) {
        const selectedFilter = document.querySelector(`input[name="${filterName}"]:checked`);
        return selectedFilter ? selectedFilter.value : null;
    }

    // 显示当前页面的结果
    displayCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResults = this.filteredResults.slice(startIndex, endIndex);

        this.displayResults(pageResults);
        this.updatePagination();
    }

    // 显示搜索统计
    displaySearchStats() {
        const stats = this.channelManager.getSearchStats();

        // 更新结果计数
        this.updateResultsCount(this.filteredResults.length);

        // 在控制台显示统计信息（可选）
        console.log('搜索统计:', stats);

        // 可以在页面上显示统计信息
        this.displayChannelStats(stats);
    }

    // 显示频道统计
    displayChannelStats(stats) {
        const statsContainer = document.querySelector('.search-stats');
        if (!statsContainer) {
            // 创建统计显示区域
            const container = document.createElement('div');
            container.className = 'search-stats';
            container.innerHTML = `
                <h4>搜索统计</h4>
                <div class="stats-grid"></div>
            `;

            const resultsHeader = document.querySelector('.results-header');
            if (resultsHeader) {
                resultsHeader.appendChild(container);
            }
        }

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            const allStats = [...stats.channels, ...stats.plugins];
            const statsHTML = allStats.map(stat => `
                <div class="stat-item ${stat.status}">
                    <span class="stat-name">${stat.name}</span>
                    <span class="stat-count">${stat.resultCount || 0}</span>
                    <span class="stat-status">${this.getStatusText(stat.status)}</span>
                </div>
            `).join('');

            statsGrid.innerHTML = statsHTML;
        }
    }

    // 获取状态文本
    getStatusText(status) {
        const statusTexts = {
            ready: '准备',
            searching: '搜索中',
            completed: '完成',
            error: '错误'
        };
        return statusTexts[status] || status;
    }

    // 设置筛选器事件监听
    setupFilters() {
        const filterInputs = document.querySelectorAll('.filter-option input');
        const applyButton = document.querySelector('.apply-filters-btn');

        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
                this.displayCurrentPage();
            });
        });

        if (applyButton) {
            applyButton.addEventListener('click', () => {
                this.applyFilters();
                this.displayCurrentPage();
            });
        }

        // 排序选择器
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortResults(e.target.value);
                this.displayCurrentPage();
            });
        }
    }

    // 排序结果
    sortResults(sortBy) {
        switch (sortBy) {
            case 'relevance':
                this.filteredResults.sort((a, b) =>
                    this.channelManager.calculateRelevance(b.title, this.currentQuery) -
                    this.channelManager.calculateRelevance(a.title, this.currentQuery)
                );
                break;
            case 'date':
                this.filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'size':
                this.filteredResults.sort((a, b) => {
                    const aSize = this.getSizeInMB(a.size);
                    const bSize = this.getSizeInMB(b.size);
                    return bSize - aSize;
                });
                break;
            case 'name':
                this.filteredResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    // 转换文件大小为MB
    getSizeInMB(sizeStr) {
        const size = parseFloat(sizeStr);
        const unit = sizeStr.includes('GB') ? 'GB' : 'MB';
        return unit === 'GB' ? size * 1024 : size;
    }

    // 更新分页
    updatePagination() {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        if (!paginationContainer) return;

        const prevBtn = paginationContainer.querySelector('.prev-btn');
        const nextBtn = paginationContainer.querySelector('.next-btn');
        const pageNumbers = paginationContainer.querySelector('.page-numbers');

        // 更新上一页按钮
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
            prevBtn.onclick = () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayCurrentPage();
                }
            };
        }

        // 更新下一页按钮
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
            nextBtn.onclick = () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.displayCurrentPage();
                }
            };
        }

        // 更新页码
        if (pageNumbers) {
            const pageButtonsHTML = this.generatePageButtons(totalPages);
            pageNumbers.innerHTML = pageButtonsHTML;
            // 设置新页码按钮的事件监听器
            this.setupPaginationEventListeners();
        }
    }

    // 生成页码按钮
    generatePageButtons(totalPages) {
        let buttons = '';
        const maxButtons = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        if (startPage > 1) {
            buttons += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                buttons += `<span class="page-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            buttons += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons += `<span class="page-dots">...</span>`;
            }
            buttons += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        return buttons;
    }

    // 设置分页事件监听器
    setupPaginationEventListeners() {
        const pageButtons = document.querySelectorAll('.page-btn[data-page]');
        pageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = parseInt(e.target.getAttribute('data-page'));
                this.goToPage(page);
            });
        });
    }

    // 跳转到指定页面
    goToPage(page) {
        this.currentPage = page;
        this.displayCurrentPage();
    }

    displayResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) return;

        const resultsHTML = results.map(result => this.createResultHTML(result)).join('');
        resultsContainer.innerHTML = resultsHTML;

        // 添加按钮事件监听器
        this.setupResultsEventListeners();

        this.updateResultsCount(results.length);
    }

    // 设置搜索结果的事件监听器
    setupResultsEventListeners() {
        const downloadButtons = document.querySelectorAll('.btn-download');
        const shareButtons = document.querySelectorAll('.btn-share');

        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const resultId = e.target.getAttribute('data-result-id');
                this.handleDownload(resultId);
            });
        });

        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const resultId = e.target.getAttribute('data-result-id');
                this.handleShare(resultId);
            });
        });
    }

    // 处理下载按钮点击
    handleDownload(resultId) {
        const result = this.findResultById(resultId);
        if (!result) {
            this.showAlert('未找到该资源', 'error');
            return;
        }

        // 根据不同的平台处理下载
        switch (result.source) {
            case 'channel':
                // 频道资源，跳转到网盘页面
                window.open(result.downloadUrl, '_blank');
                this.showAlert(`正在跳转到 ${result.platformName}...`, 'info');
                break;
            case 'plugin':
                // 插件资源，可能需要特殊处理
                if (result.platform === 'magnet') {
                    // 磁力链接
                    navigator.clipboard.writeText(result.downloadUrl).then(() => {
                        this.showAlert('磁力链接已复制到剪贴板:\n' + result.downloadUrl, 'success');
                    }).catch(() => {
                        prompt('磁力链接:', result.downloadUrl);
                    });
                } else {
                    window.open(result.downloadUrl, '_blank');
                    this.showAlert(`正在获取 ${result.title} 的下载链接...`, 'info');
                }
                break;
            default:
                window.open(result.downloadUrl, '_blank');
                this.showAlert(`正在获取 ${result.title} 的下载链接...`, 'info');
        }
    }

    // 处理分享按钮点击
    handleShare(resultId) {
        const result = this.findResultById(resultId);
        if (!result) {
            this.showAlert('未找到该资源', 'error');
            return;
        }

        const shareUrl = `${window.location.origin}/resource/${resultId}?title=${encodeURIComponent(result.title)}`;
        const shareText = `推荐资源: ${result.title}\n大小: ${result.size}\n平台: ${result.platformName}\n链接: ${shareUrl}`;

        navigator.clipboard.writeText(shareText).then(() => {
            this.showAlert('分享信息已复制到剪贴板', 'success');
        }).catch(() => {
            prompt('分享信息:', shareText);
        });
    }

    // 显示提示消息
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span class="alert-icon">${this.getAlertIcon(type)}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 100);

        const closeBtn = alertDiv.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            this.hideAlert(alertDiv);
        });

        setTimeout(() => {
            this.hideAlert(alertDiv);
        }, 5000);
    }

    // 隐藏提示消息
    hideAlert(alertDiv) {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }

    // 获取提示图标
    getAlertIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    createResultHTML(result) {
        const platformIcon = this.getPlatformIcon(result.platform);
        const typeIcon = this.getTypeIcon(result.type);

        return `
            <div class="result-item" data-result-id="${result.id}">
                <div class="result-header">
                    <div class="result-title">
                        <span class="type-icon">${typeIcon}</span>
                        <h3>${result.title}</h3>
                    </div>
                    <div class="result-platform">
                        <span class="platform-icon">${platformIcon}</span>
                        <span class="platform-name">${this.getPlatformName(result.platform)}</span>
                    </div>
                </div>
                <div class="result-meta">
                    <span class="result-size">📁 ${result.size}</span>
                    <span class="result-date">📅 ${result.date}</span>
                    <span class="result-quality quality-${result.quality}">
                        ${this.getQualityText(result.quality)}
                    </span>
                </div>
                <div class="result-actions">
                    <button class="btn-download" data-result-id="${result.id}">
                        ⬇️ 获取链接
                    </button>
                    <button class="btn-share" data-result-id="${result.id}">
                        🔗 分享
                    </button>
                </div>
            </div>
        `;
    }

    getPlatformIcon(platform) {
        const icons = {
            baidu: '📦',
            aliyun: '☁️',
            quark: '⚡',
            xunlei: '⚡'
        };
        return icons[platform] || '📁';
    }

    getPlatformName(platform) {
        const names = {
            baidu: '百度网盘',
            aliyun: '阿里云盘',
            quark: '夸克网盘',
            xunlei: '迅雷网盘'
        };
        return names[platform] || platform;
    }

    getTypeIcon(type) {
        const icons = {
            video: '🎬',
            music: '🎵',
            software: '💻',
            document: '📄',
            archive: '📦',
            image: '🖼️'
        };
        return icons[type] || '📁';
    }

    getQualityText(quality) {
        const texts = {
            high: '高质量',
            medium: '中等',
            low: '标准'
        };
        return texts[quality] || '未知';
    }

    updateResultsCount(count) {
        const countElement = document.querySelector('.results-count');
        if (countElement) {
            countElement.textContent = `找到 ${count} 个相关结果`;
        }
    }

    // 根据ID查找结果
    findResultById(resultId) {
        return this.allResults.find(result => result.id === resultId);
    }

    showLoading(show = true) {
        let loadingDiv = document.querySelector('.results-loading');
        if (show && !loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'results-loading';
            loadingDiv.innerHTML = '<div class="spinner"></div><p>正在搜索...</p>';
            document.querySelector('.search-results').appendChild(loadingDiv);
        } else if (!show && loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// 全局搜索页面实例
let searchPage;

document.addEventListener('DOMContentLoaded', () => {
    new ZiyuansoSearch();
    searchPage = new SearchResultsPage();
    window.searchPage = searchPage; // 提供全局访问
});

window.addEventListener('beforeunload', () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
});
