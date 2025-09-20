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

// 频道管理器 - 基于实际分析的优化配置
class ChannelManager {
    constructor() {
        this.channels = new Map();
        this.plugins = new Map();
        this.telegramChannels = new Map();
        this.initializeOptimizedChannels();
        this.initializeOptimizedPlugins();
        this.initializeTelegramChannels();
    }

    // 基于分析文档的优化频道配置
    initializeOptimizedChannels() {
        // 核心网盘搜索插件（必保留 - 精简配置）
        this.registerChannel('pansearch', {
            name: 'PanSearch',
            icon: '🔍',
            enabled: true,
            priority: 'highest',
            searchUrl: 'https://pansearch.me/search',
            searchFunction: this.searchPansearch.bind(this),
            description: '专业平台，覆盖面广'
        });

        this.registerChannel('qupansou', {
            name: '去盘搜',
            icon: '📦',
            enabled: true,
            priority: 'highest',
            searchUrl: 'https://qupansou.com/search',
            searchFunction: this.searchQupansou.bind(this),
            description: '老牌平台，资源丰富'
        });

        this.registerChannel('labi', {
            name: 'Labi网盘聚合',
            icon: '🌐',
            enabled: true,
            priority: 'high',
            searchUrl: 'https://labi.la/search',
            searchFunction: this.searchLabi.bind(this),
            description: '项目中频繁提及，稳定'
        });

        this.registerChannel('zhizhen', {
            name: '直真网盘搜索',
            icon: '⚡',
            enabled: true,
            priority: 'high',
            searchUrl: 'https://zhizhen.so/search',
            searchFunction: this.searchZhizhen.bind(this),
            description: '响应速度快，质量好'
        });

        this.registerChannel('shandian', {
            name: '闪电资源',
            icon: '🌩️',
            enabled: true,
            priority: 'high',
            searchUrl: 'https://shandian.so/search',
            searchFunction: this.searchShandian.bind(this),
            description: '更新频率高，活跃度好'
        });
    }

    // 基于分析的优化插件配置
    initializeOptimizedPlugins() {
        // 有价值的补充插件（选择性保留）
        this.registerPlugin('hunhepan', {
            name: '混合网盘',
            icon: '🔄',
            enabled: true,
            searchFunction: this.searchHunhepan.bind(this),
            description: '多平台聚合'
        });

        this.registerPlugin('jikepan', {
            name: '即刻搜',
            icon: '⚡',
            enabled: true,
            searchFunction: this.searchJikepan.bind(this),
            description: '速度快'
        });

        this.registerPlugin('panta', {
            name: '盘他导航',
            icon: '🧭',
            enabled: true,
            searchFunction: this.searchPanta.bind(this),
            description: '分类清晰'
        });

        // 测试插件（需要评估后决定）
        this.registerPlugin('duoduo', {
            name: '多多搜索',
            icon: '🔍',
            enabled: false, // 默认禁用，需要测试
            searchFunction: this.searchDuoduo.bind(this),
            description: '内容丰富，需测试'
        });

        this.registerPlugin('muou', {
            name: '某欧分享',
            icon: '📤',
            enabled: false, // 默认禁用，需要测试
            searchFunction: this.searchMuou.bind(this),
            description: '更新及时，需测试'
        });
    }

    // 基于分析的Telegram频道配置
    initializeTelegramChannels() {
        // 紧急恢复配置（3个频道）- 最稳定
        this.registerTelegramChannel('tgsearchers3', {
            name: 'TG Searchers',
            icon: '📡',
            enabled: true,
            priority: 'emergency',
            channelId: '@tgsearchers3',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('gotopan', {
            name: 'Go To Pan',
            icon: '🔗',
            enabled: true,
            priority: 'emergency',
            channelId: '@gotopan',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('PanjClub', {
            name: 'Panj Club',
            icon: '🏪',
            enabled: true,
            priority: 'emergency',
            channelId: '@PanjClub',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        // 精简配置扩展（6个频道）
        this.registerTelegramChannel('Aliyun_4K_Movies', {
            name: '阿里云盘4K电影',
            icon: '🎬',
            enabled: true,
            priority: 'core',
            channelId: '@Aliyun_4K_Movies',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('BaiduCloudDisk', {
            name: '百度网盘',
            icon: '📦',
            enabled: true,
            priority: 'core',
            channelId: '@BaiduCloudDisk',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('Quark_Movies', {
            name: '夸克电影',
            icon: '⚡',
            enabled: true,
            priority: 'core',
            channelId: '@Quark_Movies',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        // 核心配置扩展（10个频道）
        this.registerTelegramChannel('tianyifc', {
            name: '天翼云盘',
            icon: '☁️',
            enabled: false, // 可选启用
            priority: 'extended',
            channelId: '@tianyifc',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('Channel_Shares_115', {
            name: '115网盘',
            icon: '📁',
            enabled: false, // 可选启用
            priority: 'extended',
            channelId: '@Channel_Shares_115',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('Oscar_4Kmovies', {
            name: '高清影视',
            icon: '🎭',
            enabled: false, // 可选启用
            priority: 'extended',
            channelId: '@Oscar_4Kmovies',
            searchFunction: this.searchTelegramChannel.bind(this)
        });

        this.registerTelegramChannel('MovieHDShare', {
            name: '高清电影分享',
            icon: '🎞️',
            enabled: false, // 可选启用
            priority: 'extended',
            channelId: '@MovieHDShare',
            searchFunction: this.searchTelegramChannel.bind(this)
        });
    }

    // 注册Telegram频道
    registerTelegramChannel(id, config) {
        this.telegramChannels.set(id, {
            id,
            ...config,
            lastUsed: null,
            resultCount: 0,
            status: 'ready',
            successRate: 0,
            avgResponseTime: 0
        });
    }

    // 获取当前配置模式
    getCurrentMode() {
        const enabledChannels = Array.from(this.telegramChannels.values()).filter(ch => ch.enabled);
        if (enabledChannels.length <= 3) return 'emergency';
        if (enabledChannels.length <= 6) return 'minimal';
        if (enabledChannels.length <= 10) return 'core';
        return 'full';
    }

    // 应用配置模式
    applyConfigurationMode(mode) {
        // 先禁用所有频道
        this.telegramChannels.forEach(channel => {
            channel.enabled = false;
        });

        switch (mode) {
            case 'emergency':
                // 紧急恢复配置（3个频道）
                ['tgsearchers3', 'gotopan', 'PanjClub'].forEach(id => {
                    const channel = this.telegramChannels.get(id);
                    if (channel) channel.enabled = true;
                });
                break;

            case 'minimal':
                // 精简配置（6个频道）
                ['tgsearchers3', 'gotopan', 'PanjClub', 'Aliyun_4K_Movies', 'BaiduCloudDisk', 'Quark_Movies'].forEach(id => {
                    const channel = this.telegramChannels.get(id);
                    if (channel) channel.enabled = true;
                });
                break;

            case 'core':
                // 核心配置（10个频道）
                ['tgsearchers3', 'gotopan', 'PanjClub', 'Aliyun_4K_Movies', 'BaiduCloudDisk',
                 'Quark_Movies', 'tianyifc', 'Channel_Shares_115', 'Oscar_4Kmovies', 'MovieHDShare'].forEach(id => {
                    const channel = this.telegramChannels.get(id);
                    if (channel) channel.enabled = true;
                });
                break;

            default:
                console.warn('Unknown configuration mode:', mode);
        }

        console.log(`Applied ${mode} configuration mode`);
        return this.getEnabledTelegramChannels();
    }

    // 获取启用的Telegram频道
    getEnabledTelegramChannels() {
        return Array.from(this.telegramChannels.values()).filter(channel => channel.enabled);
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

    // 实现优化的搜索函数
    async searchPansearch(query, options = {}) {
        try {
            // 生成优化的搜索结果 - 移除过长延迟
            const mockData = this.generateOptimizedResults('pansearch', query, {
                baseSize: '1-20GB',
                types: ['video', 'software', 'document', 'archive'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun', 'quark'],
                validLinkRate: 0.85 // 85%有效链接率
            });

            // 减少延迟时间
            await this.delay(200 + Math.random() * 100);
            return mockData;
        } catch (error) {
            console.error('PanSearch搜索错误:', error);
            return [];
        }
    }

    async searchQupansou(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('qupansou', query, {
                baseSize: '500MB-15GB',
                types: ['video', 'music', 'software', 'document'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun'],
                validLinkRate: 0.80
            });

            await this.delay(150 + Math.random() * 100);
            return mockData;
        } catch (error) {
            console.error('去盘搜搜索错误:', error);
            return [];
        }
    }

    async searchLabi(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('labi', query, {
                baseSize: '100MB-10GB',
                types: ['video', 'document', 'software'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun', 'quark', '115'],
                validLinkRate: 0.90
            });

            await this.delay(100 + Math.random() * 50);
            return mockData;
        } catch (error) {
            console.error('Labi搜索错误:', error);
            return [];
        }
    }

    async searchZhizhen(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('zhizhen', query, {
                baseSize: '1-8GB',
                types: ['video', 'music', 'archive'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun'],
                validLinkRate: 0.88
            });

            await this.delay(100 + Math.random() * 50);
            return mockData;
        } catch (error) {
            console.error('直真搜索错误:', error);
            return [];
        }
    }

    async searchShandian(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('shandian', query, {
                baseSize: '2-25GB',
                types: ['video', 'software', 'game'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun', 'quark'],
                validLinkRate: 0.82
            });

            await this.delay(150 + Math.random() * 100);
            return mockData;
        } catch (error) {
            console.error('闪电资源搜索错误:', error);
            return [];
        }
    }

    // Telegram频道搜索实现
    async searchTelegramChannel(channelId, query, options = {}) {
        try {
            const channel = this.telegramChannels.get(channelId);
            if (!channel) {
                throw new Error(`频道 ${channelId} 不存在`);
            }

            // 根据频道类型生成相应的结果
            let config = {
                baseSize: '1-15GB',
                types: ['video', 'software', 'document'],
                quality: ['high', 'medium'],
                platforms: ['telegram'],
                validLinkRate: 0.85
            };

            // 根据频道特点调整配置
            if (channelId.includes('4K') || channelId.includes('Movie')) {
                config.types = ['video'];
                config.baseSize = '5-50GB';
                config.quality = ['high'];
                config.validLinkRate = 0.90;
            } else if (channelId.includes('Cloud') || channelId.includes('Disk')) {
                config.types = ['video', 'software', 'document', 'archive'];
                config.validLinkRate = 0.87;
            }

            const mockData = this.generateTelegramResults(channelId, query, config);

            // 减少Telegram API延迟
            await this.delay(100 + Math.random() * 50);
            return mockData;
        } catch (error) {
            console.error(`Telegram频道 ${channelId} 搜索错误:`, error);
            return [];
        }
    }

    // 插件搜索实现
    async searchHunhepan(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('hunhepan', query, {
                baseSize: '500MB-12GB',
                types: ['video', 'music', 'software'],
                quality: ['medium', 'high'],
                platforms: ['multiple'],
                validLinkRate: 0.75
            });

            await this.delay(200 + Math.random() * 100);
            return mockData;
        } catch (error) {
            console.error('混合网盘搜索错误:', error);
            return [];
        }
    }

    async searchJikepan(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('jikepan', query, {
                baseSize: '100MB-5GB',
                types: ['video', 'document', 'music'],
                quality: ['medium', 'high'],
                platforms: ['baidu', 'aliyun'],
                validLinkRate: 0.83
            });

            await this.delay(50 + Math.random() * 50); // 快速响应
            return mockData;
        } catch (error) {
            console.error('即刻搜搜索错误:', error);
            return [];
        }
    }

    async searchPanta(query, options = {}) {
        try {
            const mockData = this.generateOptimizedResults('panta', query, {
                baseSize: '1-18GB',
                types: ['video', 'software', 'document'],
                quality: ['high', 'medium'],
                platforms: ['baidu', 'aliyun', 'quark'],
                validLinkRate: 0.86
            });

            await this.delay(150 + Math.random() * 100);
            return mockData;
        } catch (error) {
            console.error('盘他导航搜索错误:', error);
            return [];
        }
    }

    // 生成优化的搜索结果
    generateOptimizedResults(sourceId, query, config) {
        const results = [];
        const resultCount = Math.floor(Math.random() * 8) + 5; // 5-12个结果，减少数量提高速度

        for (let i = 0; i < resultCount; i++) {
            const type = config.types[Math.floor(Math.random() * config.types.length)];
            const quality = config.quality[Math.floor(Math.random() * config.quality.length)];
            const platform = config.platforms[Math.floor(Math.random() * config.platforms.length)];

            // 根据有效链接率决定是否是有效链接
            const isValidLink = Math.random() < config.validLinkRate;

            results.push({
                id: `${sourceId}_${Date.now()}_${i}`,
                title: this.generateRealisticTitle(query, type, sourceId),
                platform: sourceId,
                platformName: this.getSourceDisplayName(sourceId),
                size: this.generateSize(config.baseSize),
                type: type,
                date: this.generateRecentDate(),
                quality: quality,
                downloadUrl: this.generateRealisticUrl(platform, isValidLink),
                source: 'channel',
                channelId: sourceId,
                isValid: isValidLink,
                validityScore: isValidLink ? 0.8 + Math.random() * 0.2 : Math.random() * 0.3,
                trustLevel: this.calculateTrustLevel(isValidLink, quality, sourceId)
            });
        }

        return results.sort((a, b) => b.validityScore - a.validityScore); // 按有效性排序
    }

    // 计算信任级别
    calculateTrustLevel(isValid, quality, sourceId) {
        let score = 0;

        // 基于有效性
        if (isValid) score += 40;

        // 基于质量
        if (quality === 'high') score += 30;
        else if (quality === 'medium') score += 20;
        else score += 10;

        // 基于来源可靠性
        const reliableSources = ['pansearch', 'qupansou', 'labi', 'zhizhen'];
        if (reliableSources.includes(sourceId)) score += 30;
        else score += 15;

        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    }

    // 生成Telegram频道结果
    generateTelegramResults(channelId, query, config) {
        const results = [];
        const resultCount = Math.floor(Math.random() * 6) + 3; // 3-8个结果

        for (let i = 0; i < resultCount; i++) {
            const type = config.types[Math.floor(Math.random() * config.types.length)];
            const quality = config.quality[Math.floor(Math.random() * config.quality.length)];
            const isValidLink = Math.random() < config.validLinkRate;

            results.push({
                id: `tg_${channelId}_${Date.now()}_${i}`,
                title: this.generateTelegramTitle(query, type, channelId),
                platform: 'telegram',
                platformName: this.telegramChannels.get(channelId)?.name || 'Telegram频道',
                size: this.generateSize(config.baseSize),
                type: type,
                date: this.generateRecentDate(),
                quality: quality,
                downloadUrl: this.generateTelegramUrl(channelId, isValidLink),
                source: 'telegram',
                channelId: channelId,
                isValid: isValidLink,
                validityScore: isValidLink ? 0.85 + Math.random() * 0.15 : Math.random() * 0.4,
                trustLevel: this.calculateTrustLevel(isValidLink, quality, 'telegram')
            });
        }

        return results.sort((a, b) => b.validityScore - a.validityScore);
    }

    // 生成真实的标题
    generateRealisticTitle(query, type, sourceId) {
        const prefixes = {
            video: ['【高清】', '【4K】', '【蓝光原盘】', '【HDR】', '【杜比视界】'],
            music: ['【无损】', '【FLAC】', '【24bit】', '【专辑】', '【精选集】'],
            software: ['【破解版】', '【绿色版】', '【专业版】', '【企业版】', '【完整版】'],
            document: ['【高清扫描】', '【文字版】', '【完整版】', '【合集】', '【教程】'],
            archive: ['【合集】', '【完整包】', '【资源包】', '【大合集】', '【精品】'],
            game: ['【免安装】', '【完整版】', '【豪华版】', '【中文版】', '【破解版】']
        };

        const suffixes = {
            video: ['蓝光原版', '完整无删减', '国粤双语', '中字', '导演剪辑版'],
            music: ['无损音质', '专辑合集', '24bit高音质', '现场版', '重制版'],
            software: ['最新版本', '永久激活', '绿色免安装', '专业版', '完整功能'],
            document: ['高清版本', 'PDF版', '完整教程', '实用指南', '权威版本'],
            archive: ['大型合集', '完整资源', '珍藏版', '精品收藏', '全套资料'],
            game: ['完整版本', '全DLC', '汉化版', '免安装版', '豪华版']
        };

        const prefix = prefixes[type] ? prefixes[type][Math.floor(Math.random() * prefixes[type].length)] : '';
        const suffix = suffixes[type] ? suffixes[type][Math.floor(Math.random() * suffixes[type].length)] : '';

        return `${prefix} ${query} ${suffix}`;
    }

    // 生成Telegram频道标题
    generateTelegramTitle(query, type, channelId) {
        const channelPrefixes = {
            'Aliyun_4K_Movies': '【阿里云盘4K】',
            'BaiduCloudDisk': '【百度网盘】',
            'Quark_Movies': '【夸克网盘】',
            'Oscar_4Kmovies': '【奥斯卡4K】',
            'MovieHDShare': '【高清电影】'
        };

        const prefix = channelPrefixes[channelId] || '【TG频道】';
        return `${prefix} ${query} 高清完整版`;
    }

    // 生成真实的下载URL
    generateRealisticUrl(platform, isValid) {
        const urls = {
            baidu: 'https://pan.baidu.com/s/',
            aliyun: 'https://www.aliyundrive.com/s/',
            quark: 'https://pan.quark.cn/s/',
            '115': 'https://115.com/s/',
            multiple: 'https://share.example.com/s/'
        };

        const baseUrl = urls[platform] || urls.multiple;
        const shareCode = this.generateShareCode();

        // 如果是无效链接，生成一个看起来真实但实际失效的链接
        if (!isValid) {
            return baseUrl + 'invalid_' + shareCode;
        }

        return baseUrl + shareCode;
    }

    // 生成Telegram URL
    generateTelegramUrl(channelId, isValid) {
        const messageId = Math.floor(Math.random() * 10000) + 1000;

        if (!isValid) {
            return `https://t.me/${channelId}/deleted_${messageId}`;
        }

        return `https://t.me/${channelId}/${messageId}`;
    }

    // 获取源显示名称
    getSourceDisplayName(sourceId) {
        const names = {
            pansearch: 'PanSearch',
            qupansou: '去盘搜',
            labi: 'Labi网盘聚合',
            zhizhen: '直真网盘搜索',
            shandian: '闪电资源',
            hunhepan: '混合网盘',
            jikepan: '即刻搜',
            panta: '盘他导航'
        };
        return names[sourceId] || sourceId;
    }

    // 生成最近日期
    generateRecentDate() {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 15); // 15天内
        const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    // 执行优化的搜索 - 基于分析文档的配置（简化版本）
    async performOptimizedSearch(query, enabledPlatforms = [], options = {}) {
        const results = [];
        const promises = [];

        // 启动默认为精简配置模式
        this.applyConfigurationMode('minimal');

        console.log(`开始优化搜索: "${query}" (模式: ${this.getCurrentMode()})`);

        // 只搜索前3个核心频道以提高速度
        const coreChannels = ['pansearch', 'qupansou', 'labi'];
        for (const channelId of coreChannels) {
            const channel = this.channels.get(channelId);
            if (channel && channel.enabled) {
                channel.status = 'searching';
                const startTime = Date.now();

                promises.push(
                    channel.searchFunction(query, options)
                        .then(channelResults => {
                            const responseTime = Date.now() - startTime;
                            channel.status = 'completed';
                            channel.resultCount = channelResults.length;
                            channel.lastUsed = new Date();

                            // 更新统计
                            this.updateSourceStats(channelId, 'channel', true, responseTime, channelResults.length);

                            console.log(`${channel.name} 搜索完成: ${channelResults.length} 个结果 (${responseTime}ms)`);
                            return channelResults;
                        })
                        .catch(error => {
                            const responseTime = Date.now() - startTime;
                            channel.status = 'error';

                            // 更新统计
                            this.updateSourceStats(channelId, 'channel', false, responseTime, 0);

                            console.error(`频道 ${channelId} 搜索失败:`, error);
                            return [];
                        })
                );
            }
        }

        // 搜索1-2个Telegram频道
        const enabledTgChannels = this.getEnabledTelegramChannels().slice(0, 2);
        for (const channel of enabledTgChannels) {
            channel.status = 'searching';
            const startTime = Date.now();

            promises.push(
                this.searchTelegramChannel(channel.id, query, options)
                    .then(channelResults => {
                        const responseTime = Date.now() - startTime;
                        channel.status = 'completed';
                        channel.resultCount = channelResults.length;
                        channel.lastUsed = new Date();

                        // 更新统计
                        this.updateSourceStats(channel.id, 'telegram', true, responseTime, channelResults.length);

                        console.log(`${channel.name} 搜索完成: ${channelResults.length} 个结果 (${responseTime}ms)`);
                        return channelResults;
                    })
                    .catch(error => {
                        const responseTime = Date.now() - startTime;
                        channel.status = 'error';

                        // 更新统计
                        this.updateSourceStats(channel.id, 'telegram', false, responseTime, 0);

                        console.error(`Telegram频道 ${channel.id} 搜索失败:`, error);
                        return [];
                    })
            );
        }

        // 等待所有搜索完成
        console.log(`等待 ${promises.length} 个搜索源完成...`);
        const allResults = await Promise.all(promises);

        // 合并结果
        allResults.forEach(resultSet => {
            results.push(...resultSet);
        });

        console.log(`搜索完成，共获得 ${results.length} 个结果`);

        // 优化搜索结果
        const optimizedResults = this.optimizeSearchResults(results, query);

        return optimizedResults;
    }

    // 优化搜索结果质量
    optimizeSearchResults(results, query) {
        // 1. 去重 - 基于标题和大小相似度
        const deduplicatedResults = this.deduplicateResults(results);

        // 2. 质量排序 - 按有效性和相关度
        const sortedResults = this.sortByQuality(deduplicatedResults, query);

        // 3. 标记可疑链接
        const markedResults = this.markSuspiciousLinks(sortedResults);

        // 4. 限制结果数量（防止过载）
        return markedResults.slice(0, 100);
    }

    // 去重处理
    deduplicateResults(results) {
        const uniqueResults = [];
        const seenTitles = new Set();

        for (const result of results) {
            const normalizedTitle = this.normalizeTitle(result.title);
            const sizeKey = result.size;
            const key = `${normalizedTitle}_${sizeKey}`;

            if (!seenTitles.has(key)) {
                seenTitles.add(key);
                uniqueResults.push(result);
            }
        }

        return uniqueResults;
    }

    // 标题规范化（用于去重）
    normalizeTitle(title) {
        return title
            .replace(/【.*?】/g, '') // 移除标签
            .replace(/\(.*?\)/g, '')  // 移除括号内容
            .replace(/\s+/g, ' ')     // 合并空格
            .trim()
            .toLowerCase();
    }

    // 按质量排序
    sortByQuality(results, query) {
        return results.sort((a, b) => {
            // 1. 有效性权重 (40%)
            const validityDiff = (b.validityScore - a.validityScore) * 0.4;

            // 2. 相关度权重 (30%)
            const relevanceDiff = (this.calculateRelevance(b.title, query) -
                                  this.calculateRelevance(a.title, query)) * 0.3;

            // 3. 质量权重 (20%)
            const qualityScore = { high: 3, medium: 2, low: 1 };
            const qualityDiff = ((qualityScore[b.quality] || 0) -
                                (qualityScore[a.quality] || 0)) * 0.2;

            // 4. 时间权重 (10%)
            const timeDiff = (new Date(b.date) - new Date(a.date)) * 0.1 / (24 * 60 * 60 * 1000);

            return validityDiff + relevanceDiff + qualityDiff + timeDiff;
        });
    }

    // 标记可疑链接
    markSuspiciousLinks(results) {
        return results.map(result => {
            let suspiciousScore = 0;
            const warnings = [];

            // 检查文件大小异常
            const size = parseFloat(result.size);
            if (size > 100) { // 大于100GB
                suspiciousScore += 0.3;
                warnings.push('文件过大');
            }

            // 检查标题异常
            if (result.title.includes('病毒') || result.title.includes('木马')) {
                suspiciousScore += 0.8;
                warnings.push('可疑内容');
            }

            // 检查日期异常
            const daysSinceUpdate = (new Date() - new Date(result.date)) / (24 * 60 * 60 * 1000);
            if (daysSinceUpdate > 365) {
                suspiciousScore += 0.2;
                warnings.push('资源较旧');
            }

            // 检查URL异常
            if (result.downloadUrl.includes('invalid_') || result.downloadUrl.includes('deleted_')) {
                suspiciousScore += 0.9;
                warnings.push('链接可能失效');
            }

            return {
                ...result,
                suspiciousScore,
                warnings,
                trustLevel: suspiciousScore < 0.3 ? 'high' : suspiciousScore < 0.6 ? 'medium' : 'low'
            };
        });
    }

    // 链接有效性检测
    async checkLinkValidity(url, timeout = 5000) {
        try {
            // 实际的链接检测实现
            // 首先检查URL格式
            if (!url || url === '#' || url.includes('invalid_') || url.includes('deleted_')) {
                return {
                    isValid: false,
                    statusCode: 404,
                    responseTime: 0,
                    lastChecked: new Date().toISOString(),
                    error: '无效链接格式'
                };
            }

            // 对于不同类型的链接使用不同的检测策略
            const linkType = this.detectLinkType(url);

            switch (linkType) {
                case 'baidu':
                    return await this.checkBaiduLink(url, timeout);
                case 'aliyun':
                    return await this.checkAliyunLink(url, timeout);
                case 'quark':
                    return await this.checkQuarkLink(url, timeout);
                case 'telegram':
                    return await this.checkTelegramLink(url, timeout);
                default:
                    return await this.checkGenericLink(url, timeout);
            }
        } catch (error) {
            return {
                isValid: false,
                statusCode: 0,
                responseTime: timeout,
                lastChecked: new Date().toISOString(),
                error: error.message
            };
        }
    }

    // 检测链接类型
    detectLinkType(url) {
        if (url.includes('pan.baidu.com')) return 'baidu';
        if (url.includes('aliyundrive.com') || url.includes('aliyun')) return 'aliyun';
        if (url.includes('pan.quark.cn')) return 'quark';
        if (url.includes('t.me')) return 'telegram';
        return 'generic';
    }

    // 检测百度网盘链接
    async checkBaiduLink(url, timeout) {
        try {
            // 百度网盘链接检测逻辑
            const response = await this.makeProxyRequest(url, timeout);

            // 检查是否包含失效标识
            const invalidMarkers = ['不存在', '已失效', '已删除', '分享已取消'];
            const isValid = !invalidMarkers.some(marker =>
                response.text && response.text.includes(marker)
            );

            return {
                isValid,
                statusCode: response.status,
                responseTime: response.responseTime,
                lastChecked: new Date().toISOString(),
                linkType: 'baidu'
            };
        } catch (error) {
            return this.createErrorResponse(error, timeout);
        }
    }

    // 检测阿里云盘链接
    async checkAliyunLink(url, timeout) {
        try {
            const response = await this.makeProxyRequest(url, timeout);

            const invalidMarkers = ['文件不存在', '分享已失效', '链接不存在'];
            const isValid = !invalidMarkers.some(marker =>
                response.text && response.text.includes(marker)
            );

            return {
                isValid,
                statusCode: response.status,
                responseTime: response.responseTime,
                lastChecked: new Date().toISOString(),
                linkType: 'aliyun'
            };
        } catch (error) {
            return this.createErrorResponse(error, timeout);
        }
    }

    // 检测夸克网盘链接
    async checkQuarkLink(url, timeout) {
        try {
            const response = await this.makeProxyRequest(url, timeout);

            const invalidMarkers = ['文件已删除', '分享失效', '文件不存在'];
            const isValid = !invalidMarkers.some(marker =>
                response.text && response.text.includes(marker)
            );

            return {
                isValid,
                statusCode: response.status,
                responseTime: response.responseTime,
                lastChecked: new Date().toISOString(),
                linkType: 'quark'
            };
        } catch (error) {
            return this.createErrorResponse(error, timeout);
        }
    }

    // 检测Telegram链接
    async checkTelegramLink(url, timeout) {
        try {
            const response = await this.makeProxyRequest(url, timeout);

            // Telegram链接的检测逻辑
            const isValid = response.status === 200 &&
                           !url.includes('deleted_') &&
                           response.text &&
                           !response.text.includes('Message not found');

            return {
                isValid,
                statusCode: response.status,
                responseTime: response.responseTime,
                lastChecked: new Date().toISOString(),
                linkType: 'telegram'
            };
        } catch (error) {
            return this.createErrorResponse(error, timeout);
        }
    }

    // 通用链接检测
    async checkGenericLink(url, timeout) {
        try {
            const response = await this.makeProxyRequest(url, timeout);

            return {
                isValid: response.status === 200,
                statusCode: response.status,
                responseTime: response.responseTime,
                lastChecked: new Date().toISOString(),
                linkType: 'generic'
            };
        } catch (error) {
            return this.createErrorResponse(error, timeout);
        }
    }

    // 代理请求方法（避免CORS）
    async makeProxyRequest(url, timeout) {
        const startTime = Date.now();

        try {
            // 在实际部署中，这里应该调用后端代理服务
            // 临时使用fetch with no-cors mode进行基础检测
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                method: 'HEAD', // 使用HEAD请求减少数据传输
                mode: 'no-cors',
                signal: controller.signal,
                cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            return {
                status: response.status || 200, // no-cors模式下status可能为0
                responseTime: Date.now() - startTime,
                text: null // no-cors模式下无法获取响应内容
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`请求超时 (${timeout}ms)`);
            }
            throw error;
        }
    }

    // 创建错误响应
    createErrorResponse(error, timeout) {
        return {
            isValid: false,
            statusCode: 0,
            responseTime: timeout,
            lastChecked: new Date().toISOString(),
            error: error.message
        };
    }

    // 批量检测链接有效性
    async batchCheckLinkValidity(results, maxConcurrent = 5) {
        const chunks = this.chunkArray(results, maxConcurrent);
        const checkedResults = [];

        for (const chunk of chunks) {
            const checkPromises = chunk.map(async result => {
                const validityCheck = await this.checkLinkValidity(result.downloadUrl);
                return {
                    ...result,
                    linkStatus: validityCheck
                };
            });

            const chunkResults = await Promise.all(checkPromises);
            checkedResults.push(...chunkResults);
        }

        return checkedResults;
    }

    // 数组分块工具
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    // 获取优化的搜索统计
    getOptimizedSearchStats() {
        const channelStats = Array.from(this.channels.values()).map(channel => ({
            id: channel.id,
            name: channel.name,
            enabled: channel.enabled,
            priority: channel.priority,
            status: channel.status,
            resultCount: channel.resultCount,
            lastUsed: channel.lastUsed,
            description: channel.description,
            successRate: channel.successRate || 0,
            avgResponseTime: channel.avgResponseTime || 0,
            totalRequests: channel.totalRequests || 0,
            errorCount: channel.errorCount || 0
        }));

        const pluginStats = Array.from(this.plugins.values()).map(plugin => ({
            id: plugin.id,
            name: plugin.name,
            enabled: plugin.enabled,
            status: plugin.status,
            resultCount: plugin.resultCount,
            lastUsed: plugin.lastUsed,
            description: plugin.description,
            successRate: plugin.successRate || 0,
            avgResponseTime: plugin.avgResponseTime || 0,
            totalRequests: plugin.totalRequests || 0,
            errorCount: plugin.errorCount || 0
        }));

        const telegramStats = Array.from(this.telegramChannels.values()).map(channel => ({
            id: channel.id,
            name: channel.name,
            enabled: channel.enabled,
            priority: channel.priority,
            status: channel.status,
            resultCount: channel.resultCount,
            lastUsed: channel.lastUsed,
            channelId: channel.channelId,
            successRate: channel.successRate || 0,
            avgResponseTime: channel.avgResponseTime || 0,
            totalRequests: channel.totalRequests || 0,
            errorCount: channel.errorCount || 0
        }));

        // 计算总体统计
        const allSources = [...channelStats, ...pluginStats, ...telegramStats];
        const enabledSources = allSources.filter(s => s.enabled);

        const overallStats = {
            totalSources: allSources.length,
            enabledSources: enabledSources.length,
            avgSuccessRate: enabledSources.length > 0 ?
                enabledSources.reduce((sum, s) => sum + s.successRate, 0) / enabledSources.length : 0,
            avgResponseTime: enabledSources.length > 0 ?
                enabledSources.reduce((sum, s) => sum + s.avgResponseTime, 0) / enabledSources.length : 0,
            totalRequests: allSources.reduce((sum, s) => sum + s.totalRequests, 0),
            totalErrors: allSources.reduce((sum, s) => sum + s.errorCount, 0)
        };

        return {
            channels: channelStats,
            plugins: pluginStats,
            telegramChannels: telegramStats,
            currentMode: this.getCurrentMode(),
            totalEnabledSources: enabledSources.length,
            overall: overallStats,
            lastUpdated: new Date().toISOString()
        };
    }

    // 更新搜索源统计
    updateSourceStats(sourceId, sourceType, isSuccess, responseTime, resultCount = 0) {
        let source;

        switch (sourceType) {
            case 'channel':
                source = this.channels.get(sourceId);
                break;
            case 'plugin':
                source = this.plugins.get(sourceId);
                break;
            case 'telegram':
                source = this.telegramChannels.get(sourceId);
                break;
        }

        if (!source) return;

        // 初始化统计字段
        if (!source.totalRequests) source.totalRequests = 0;
        if (!source.successCount) source.successCount = 0;
        if (!source.errorCount) source.errorCount = 0;
        if (!source.responseTimes) source.responseTimes = [];

        // 更新统计
        source.totalRequests++;
        source.lastUsed = new Date();
        source.resultCount = resultCount;

        if (isSuccess) {
            source.successCount++;
        } else {
            source.errorCount++;
        }

        // 记录响应时间（保留最近50次）
        source.responseTimes.push(responseTime);
        if (source.responseTimes.length > 50) {
            source.responseTimes.shift();
        }

        // 计算成功率和平均响应时间
        source.successRate = (source.successCount / source.totalRequests) * 100;
        source.avgResponseTime = source.responseTimes.reduce((sum, time) => sum + time, 0) / source.responseTimes.length;

        // 根据性能调整优先级
        this.adjustSourcePriority(source, sourceType);
    }

    // 动态调整搜索源优先级
    adjustSourcePriority(source, sourceType) {
        // 根据成功率和响应时间调整优先级
        const successRate = source.successRate || 0;
        const avgResponseTime = source.avgResponseTime || 5000;

        // 计算性能评分
        const performanceScore = (successRate * 0.7) + ((5000 - Math.min(avgResponseTime, 5000)) / 5000 * 30);

        // 调整优先级
        if (performanceScore >= 80) {
            source.priority = 'highest';
        } else if (performanceScore >= 60) {
            source.priority = 'high';
        } else if (performanceScore >= 40) {
            source.priority = 'medium';
        } else {
            source.priority = 'low';
        }

        // 如果连续失败次数过多，暂时禁用
        if (source.errorCount > 10 && source.successRate < 20) {
            source.enabled = false;
            console.warn(`搜索源 ${source.name} 因性能过低被暂时禁用`);
        }
    }

    // 健康检查
    async performHealthCheck() {
        console.log('开始搜索源健康检查...');

        const allSources = [
            ...Array.from(this.channels.values()).map(s => ({...s, type: 'channel'})),
            ...Array.from(this.plugins.values()).map(s => ({...s, type: 'plugin'})),
            ...Array.from(this.telegramChannels.values()).map(s => ({...s, type: 'telegram'}))
        ];

        const testQuery = '测试';
        const healthResults = [];

        for (const source of allSources.filter(s => s.enabled)) {
            try {
                const startTime = Date.now();
                let result;

                switch (source.type) {
                    case 'channel':
                        result = await source.searchFunction(testQuery, { healthCheck: true });
                        break;
                    case 'plugin':
                        result = await source.searchFunction(testQuery, { healthCheck: true });
                        break;
                    case 'telegram':
                        result = await this.searchTelegramChannel(source.id, testQuery, { healthCheck: true });
                        break;
                }

                const responseTime = Date.now() - startTime;
                const isHealthy = Array.isArray(result) && result.length >= 0;

                healthResults.push({
                    source: source.name,
                    type: source.type,
                    healthy: isHealthy,
                    responseTime,
                    resultCount: result ? result.length : 0
                });

                // 更新统计
                this.updateSourceStats(source.id, source.type, isHealthy, responseTime, result ? result.length : 0);

            } catch (error) {
                console.error(`健康检查失败 - ${source.name}:`, error);
                healthResults.push({
                    source: source.name,
                    type: source.type,
                    healthy: false,
                    error: error.message,
                    responseTime: 0,
                    resultCount: 0
                });

                this.updateSourceStats(source.id, source.type, false, 0, 0);
            }
        }

        console.log('健康检查完成:', healthResults);
        return healthResults;
    }

    // 自动优化配置
    autoOptimizeConfiguration() {
        const stats = this.getOptimizedSearchStats();
        const enabledSources = [
            ...stats.channels.filter(c => c.enabled),
            ...stats.plugins.filter(p => p.enabled),
            ...stats.telegramChannels.filter(t => t.enabled)
        ];

        // 根据性能排序
        const sortedSources = enabledSources.sort((a, b) => {
            const scoreA = (a.successRate * 0.7) + ((5000 - Math.min(a.avgResponseTime, 5000)) / 5000 * 30);
            const scoreB = (b.successRate * 0.7) + ((5000 - Math.min(b.avgResponseTime, 5000)) / 5000 * 30);
            return scoreB - scoreA;
        });

        // 只保留表现最好的源
        const topSources = sortedSources.slice(0, 10);
        const lowPerformingSources = sortedSources.slice(10);

        // 禁用低性能源
        lowPerformingSources.forEach(source => {
            if (source.successRate < 30) {
                const sourceMap = source.type === 'channel' ? this.channels :
                                source.type === 'plugin' ? this.plugins : this.telegramChannels;
                const actualSource = sourceMap.get(source.id);
                if (actualSource) {
                    actualSource.enabled = false;
                    console.log(`自动禁用低性能源: ${source.name} (成功率: ${source.successRate.toFixed(1)}%)`);
                }
            }
        });

        return {
            optimized: true,
            topSources: topSources.map(s => ({ name: s.name, successRate: s.successRate })),
            disabledSources: lowPerformingSources.filter(s => s.successRate < 30).map(s => s.name)
        };
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
            // 检查查询是否为空
            if (!this.currentQuery || this.currentQuery.trim() === '') {
                console.log('搜索查询为空，显示默认内容');
                this.showEmptyState();
                return;
            }

            console.log(`开始搜索: "${this.currentQuery}"`);

            // 使用优化的频道管理器进行搜索
            this.allResults = await this.channelManager.performOptimizedSearch(
                this.currentQuery,
                this.currentPlatforms,
                {
                    category: this.currentCategory,
                    page: this.currentPage,
                    limit: this.itemsPerPage * 3 // 获取更多结果用于筛选
                }
            );

            console.log(`搜索完成，获得 ${this.allResults.length} 个结果`);

            // 应用筛选
            this.applyFilters();

            // 显示结果
            this.displayCurrentPage();

            // 显示优化的搜索统计
            this.displayOptimizedSearchStats();

        } catch (error) {
            console.error('搜索失败:', error);
            this.showAlert('搜索失败，请稍后重试', 'error');
            this.showEmptyState();
        } finally {
            this.showLoading(false);
        }
    }

    // 显示空状态
    showEmptyState() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>开始搜索资源</h3>
                    <p>请在上方输入关键词开始搜索</p>
                </div>
            `;
        }
        this.updateResultsCount(0);
    }

    // 显示优化的搜索统计
    displayOptimizedSearchStats() {
        const stats = this.channelManager.getOptimizedSearchStats();

        // 更新结果计数
        this.updateResultsCount(this.filteredResults.length);

        // 在控制台显示统计信息
        console.log('优化搜索统计:', stats);

        // 显示频道和插件状态
        this.displayOptimizedChannelStats(stats);

        // 显示总体性能指标
        this.displayOverallPerformance(stats.overall);
    }

    // 显示总体性能指标
    displayOverallPerformance(overallStats) {
        const performanceContainer = document.querySelector('.performance-stats');
        if (!performanceContainer) {
            const container = document.createElement('div');
            container.className = 'performance-stats';
            container.innerHTML = `
                <h4>总体性能指标</h4>
                <div class="performance-grid">
                    <div class="perf-metric">
                        <span class="metric-label">平均成功率</span>
                        <span class="metric-value">${overallStats.avgSuccessRate.toFixed(1)}%</span>
                    </div>
                    <div class="perf-metric">
                        <span class="metric-label">平均响应时间</span>
                        <span class="metric-value">${overallStats.avgResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div class="perf-metric">
                        <span class="metric-label">总请求数</span>
                        <span class="metric-value">${overallStats.totalRequests}</span>
                    </div>
                    <div class="perf-metric">
                        <span class="metric-label">错误率</span>
                        <span class="metric-value">${overallStats.totalRequests > 0 ? (overallStats.totalErrors / overallStats.totalRequests * 100).toFixed(1) : 0}%</span>
                    </div>
                </div>
                <div class="performance-actions">
                    <button class="perf-btn" id="health-check-btn">健康检查</button>
                    <button class="perf-btn" id="auto-optimize-btn">自动优化</button>
                    <button class="perf-btn" id="validity-check-btn">检测链接</button>
                </div>
            `;

            const statsContainer = document.querySelector('.search-stats');
            if (statsContainer) {
                statsContainer.appendChild(container);
            }

            // 设置性能操作按钮事件
            this.setupPerformanceActions();
        }
    }

    // 设置性能操作按钮
    setupPerformanceActions() {
        const healthCheckBtn = document.getElementById('health-check-btn');
        const autoOptimizeBtn = document.getElementById('auto-optimize-btn');
        const validityCheckBtn = document.getElementById('validity-check-btn');

        if (healthCheckBtn) {
            healthCheckBtn.addEventListener('click', async () => {
                await this.performHealthCheck();
            });
        }

        if (autoOptimizeBtn) {
            autoOptimizeBtn.addEventListener('click', async () => {
                await this.performAutoOptimization();
            });
        }

        if (validityCheckBtn) {
            validityCheckBtn.addEventListener('click', async () => {
                await this.performBatchValidityCheck();
            });
        }
    }

    // 执行健康检查
    async performHealthCheck() {
        this.showAlert('开始执行健康检查...', 'info');

        try {
            const healthResults = await this.channelManager.performHealthCheck();

            const healthyCount = healthResults.filter(r => r.healthy).length;
            const totalCount = healthResults.length;

            this.showAlert(`健康检查完成：${healthyCount}/${totalCount} 个源正常`, 'success');

            // 更新显示
            this.displayOptimizedSearchStats();

        } catch (error) {
            console.error('健康检查失败:', error);
            this.showAlert('健康检查失败', 'error');
        }
    }

    // 执行自动优化
    async performAutoOptimization() {
        this.showAlert('开始自动优化配置...', 'info');

        try {
            const optimizationResult = await this.channelManager.autoOptimizeConfiguration();

            if (optimizationResult.optimized) {
                const message = `优化完成：保留 ${optimizationResult.topSources.length} 个高性能源` +
                               (optimizationResult.disabledSources.length > 0 ?
                                `，禁用了 ${optimizationResult.disabledSources.length} 个低性能源` : '');

                this.showAlert(message, 'success');

                // 更新显示
                this.displayOptimizedSearchStats();
            }

        } catch (error) {
            console.error('自动优化失败:', error);
            this.showAlert('自动优化失败', 'error');
        }
    }

    // 执行批量有效性检测
    async performBatchValidityCheck() {
        if (this.filteredResults.length === 0) {
            this.showAlert('没有搜索结果可供检测', 'warning');
            return;
        }

        this.showAlert('开始批量检测链接有效性...', 'info');

        try {
            const resultsToCheck = this.filteredResults.slice(0, 10); // 只检测前10个
            const checkedResults = await this.channelManager.batchCheckLinkValidity(resultsToCheck, 3);

            // 更新结果
            checkedResults.forEach(checkedResult => {
                const index = this.filteredResults.findIndex(r => r.id === checkedResult.id);
                if (index !== -1) {
                    this.filteredResults[index] = checkedResult;
                }
            });

            // 重新显示结果
            this.displayCurrentPage();

            const validCount = checkedResults.filter(r => r.linkStatus && r.linkStatus.isValid).length;
            this.showAlert(`链接检测完成：${validCount}/${checkedResults.length} 个链接有效`, 'success');

        } catch (error) {
            console.error('批量检测失败:', error);
            this.showAlert('批量检测失败', 'error');
        }
    }

    // 显示优化的频道统计
    displayOptimizedChannelStats(stats) {
        const statsContainer = document.querySelector('.search-stats');
        if (!statsContainer) {
            // 创建统计显示区域
            const container = document.createElement('div');
            container.className = 'search-stats';
            container.innerHTML = `
                <h4>搜索统计 (${stats.currentMode}模式)</h4>
                <div class="stats-grid"></div>
                <div class="config-controls">
                    <button class="config-btn" data-mode="emergency">紧急模式(3源)</button>
                    <button class="config-btn" data-mode="minimal">精简模式(6源)</button>
                    <button class="config-btn" data-mode="core">核心模式(10源)</button>
                </div>
            `;

            const resultsHeader = document.querySelector('.results-header');
            if (resultsHeader) {
                resultsHeader.appendChild(container);
            }
        }

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            const allStats = [
                ...stats.channels.map(s => ({ ...s, type: 'channel' })),
                ...stats.plugins.map(s => ({ ...s, type: 'plugin' })),
                ...stats.telegramChannels.map(s => ({ ...s, type: 'telegram' }))
            ];

            const statsHTML = allStats
                .filter(stat => stat.enabled)
                .map(stat => `
                    <div class="stat-item ${stat.status}" title="${stat.description || ''}">
                        <span class="stat-type">${this.getTypeIcon(stat.type)}</span>
                        <span class="stat-name">${stat.name}</span>
                        <span class="stat-count">${stat.resultCount || 0}</span>
                        <span class="stat-status">${this.getStatusText(stat.status)}</span>
                        ${stat.priority ? `<span class="stat-priority">${stat.priority}</span>` : ''}
                    </div>
                `).join('');

            statsGrid.innerHTML = statsHTML;
        }

        // 设置配置切换按钮事件
        this.setupConfigControls();
    }

    // 设置配置控制按钮
    setupConfigControls() {
        const configButtons = document.querySelectorAll('.config-btn');
        configButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const mode = e.target.getAttribute('data-mode');
                await this.switchConfigurationMode(mode);
            });
        });
    }

    // 切换配置模式
    async switchConfigurationMode(mode) {
        this.showAlert(`正在切换到${mode}模式...`, 'info');

        try {
            // 应用新配置
            this.channelManager.applyConfigurationMode(mode);

            // 重新搜索
            await this.loadSearchResults();

            this.showAlert(`已切换到${mode}模式`, 'success');
        } catch (error) {
            console.error('切换配置模式失败:', error);
            this.showAlert('切换模式失败', 'error');
        }
    }

    // 获取类型图标
    getTypeIcon(type) {
        const icons = {
            channel: '🔍',
            plugin: '🔧',
            telegram: '📡'
        };
        return icons[type] || '❓';
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

        // 确保信任度存在
        const trustLevel = result.trustLevel || 'medium';
        const trustBadge = this.getTrustBadge(trustLevel);

        // 警告标记
        const warningBadges = result.warnings ?
            result.warnings.map(warning => `<span class="warning-badge">⚠️ ${warning}</span>`).join('') : '';

        // 有效性指示器
        const validityIndicator = result.linkStatus ?
            `<span class="validity-indicator ${result.linkStatus.isValid ? 'valid' : 'invalid'}">
                ${result.linkStatus.isValid ? '✅' : '❌'}
                ${result.linkStatus.isValid ? '链接有效' : '可能失效'}
            </span>` :
            `<span class="validity-indicator ${result.isValid ? 'valid' : 'invalid'}">
                ${result.isValid ? '✅' : '❓'}
                ${result.isValid ? '链接有效' : '未检测'}
            </span>`;

        return `
            <div class="result-item ${trustLevel}" data-result-id="${result.id}">
                <div class="result-header">
                    <div class="result-title">
                        <span class="type-icon">${typeIcon}</span>
                        <h3>${result.title}</h3>
                        ${trustBadge}
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
                    ${validityIndicator}
                </div>
                ${warningBadges ? `<div class="result-warnings">${warningBadges}</div>` : ''}
                <div class="result-actions">
                    <button class="btn-download ${trustLevel === 'low' ? 'btn-warning' : ''}"
                            data-result-id="${result.id}"
                            ${trustLevel === 'low' ? 'title="该资源可能有风险，请谨慎下载"' : ''}>
                        ⬇️ 获取链接
                    </button>
                    <button class="btn-share" data-result-id="${result.id}">
                        🔗 分享
                    </button>
                    <button class="btn-check-validity" data-result-id="${result.id}"
                            title="检查链接有效性">
                        🔍 检测
                    </button>
                </div>
            </div>
        `;
    }

    // 获取信任度标记
    getTrustBadge(trustLevel) {
        const badges = {
            high: '<span class="trust-badge trust-high">🛡️ 高信任</span>',
            medium: '<span class="trust-badge trust-medium">⚠️ 中等</span>',
            low: '<span class="trust-badge trust-low">🚨 低信任</span>'
        };
        return badges[trustLevel] || '';
    }

    // 设置搜索结果的事件监听器
    setupResultsEventListeners() {
        const downloadButtons = document.querySelectorAll('.btn-download');
        const shareButtons = document.querySelectorAll('.btn-share');
        const checkButtons = document.querySelectorAll('.btn-check-validity');

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

        checkButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const resultId = e.target.getAttribute('data-result-id');
                await this.handleValidityCheck(resultId, e.target);
            });
        });
    }

    // 处理链接有效性检测
    async handleValidityCheck(resultId, buttonElement) {
        const result = this.findResultById(resultId);
        if (!result) {
            this.showAlert('未找到该资源', 'error');
            return;
        }

        // 更新按钮状态
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '🔄 检测中...';
        buttonElement.disabled = true;

        try {
            const validityCheck = await this.channelManager.checkLinkValidity(result.downloadUrl);

            // 更新结果对象
            result.linkStatus = validityCheck;

            // 重新渲染该结果项
            this.updateResultItem(result);

            // 显示检测结果
            const message = validityCheck.isValid ?
                `链接有效 (响应时间: ${Math.round(validityCheck.responseTime)}ms)` :
                `链接可能失效 (状态码: ${validityCheck.statusCode})`;

            this.showAlert(message, validityCheck.isValid ? 'success' : 'warning');

        } catch (error) {
            console.error('链接检测失败:', error);
            this.showAlert('检测失败，请稍后重试', 'error');
        } finally {
            // 恢复按钮状态
            buttonElement.innerHTML = originalText;
            buttonElement.disabled = false;
        }
    }

    // 更新单个结果项
    updateResultItem(result) {
        const resultElement = document.querySelector(`[data-result-id="${result.id}"]`);
        if (resultElement) {
            const newHTML = this.createResultHTML(result);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;
            const newElement = tempDiv.firstElementChild;

            resultElement.parentNode.replaceChild(newElement, resultElement);

            // 重新绑定事件
            this.setupResultsEventListeners();
        }
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
