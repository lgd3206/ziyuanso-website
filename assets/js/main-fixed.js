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
            if (searchContainer) {
                searchContainer.appendChild(suggestionBox);
            }
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
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = suggestion;
                }
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

// 简化版搜索结果页面
class SimpleSearchResultsPage {
    constructor() {
        console.log('SimpleSearchResultsPage 构造函数开始');
        this.currentQuery = '';
        this.allResults = [];
        this.filteredResults = [];
        this.isSearching = false;

        // 延迟初始化确保DOM完全加载
        setTimeout(() => {
            this.initialize();
        }, 100);
    }

    initialize() {
        console.log('初始化搜索页面...');

        // 更强健的搜索页面检测
        const isSearchPage = window.location.href.includes('search') ||
                             window.location.pathname.includes('search') ||
                             document.querySelector('.search-results') ||
                             document.querySelector('.results-container') ||
                             document.title.includes('搜索结果');

        console.log('页面检测结果:', {
            href: window.location.href,
            pathname: window.location.pathname,
            hasSearchResults: !!document.querySelector('.search-results'),
            hasResultsContainer: !!document.querySelector('.results-container'),
            title: document.title,
            isSearchPage: isSearchPage
        });

        if (!isSearchPage) {
            console.log('不在搜索页面，跳过初始化');
            return;
        }

        try {
            // 确保DOM元素存在
            this.ensureRequiredElements();

            // 解析URL参数
            this.parseUrlParameters();

            // 如果有查询参数，立即开始搜索
            if (this.currentQuery && this.currentQuery.trim()) {
                console.log('发现查询参数，开始自动搜索:', this.currentQuery);
                this.startSearch();
            } else {
                console.log('没有查询参数，显示空状态');
                this.showEmptyState();
            }

        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('初始化失败: ' + error.message);
        }
    }

    ensureRequiredElements() {
        console.log('检查必需的DOM元素...');

        // 检查搜索结果容器
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            console.log('创建搜索结果容器...');
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';

            // 尝试找到合适的父容器
            const mainContainer = document.querySelector('.results-main') ||
                                document.querySelector('.search-page') ||
                                document.querySelector('main') ||
                                document.body;

            mainContainer.appendChild(resultsContainer);
            console.log('搜索结果容器已创建');
        }

        // 检查结果计数元素
        let resultsCount = document.querySelector('.results-count');
        if (!resultsCount) {
            console.log('创建结果计数元素...');
            resultsCount = document.createElement('p');
            resultsCount.className = 'results-count';
            resultsCount.textContent = '正在初始化...';

            const resultsInfo = document.querySelector('.results-info');
            if (resultsInfo) {
                resultsInfo.appendChild(resultsCount);
            }
            console.log('结果计数元素已创建');
        }
    }

    parseUrlParameters() {
        console.log('解析URL参数...');
        const urlParams = new URLSearchParams(window.location.search);
        this.currentQuery = urlParams.get('q') || '';

        console.log('解析到的查询:', this.currentQuery);

        // 更新搜索框
        const searchInput = document.querySelector('.search-input');
        if (searchInput && this.currentQuery) {
            searchInput.value = this.currentQuery;
            console.log('已更新搜索框内容');
        }
    }

    async startSearch() {
        console.log('开始搜索流程...');

        if (this.isSearching) {
            console.log('已在搜索中，跳过重复搜索');
            return;
        }

        this.isSearching = true;

        try {
            // 显示加载状态
            this.showLoading();

            // 更新状态文本
            this.updateStatusText('正在搜索资源...');

            // 生成快速测试结果
            console.log('生成测试结果...');
            this.allResults = this.generateQuickResults(this.currentQuery);
            this.filteredResults = this.allResults;

            console.log('生成了', this.allResults.length, '个测试结果');

            // 短暂延迟模拟真实搜索
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 显示结果
            this.displaySearchResults();

            // 更新计数
            this.updateResultCount(this.allResults.length);

            console.log('搜索流程完成');

        } catch (error) {
            console.error('搜索过程出错:', error);
            this.showError('搜索失败: ' + error.message);
        } finally {
            this.isSearching = false;
        }
    }

    generateQuickResults(query) {
        console.log('生成快速测试结果:', query);
        const results = [];
        const sources = ['PanSearch', '去盘搜', 'Labi网盘', '夸克网盘', '直真搜索', '闪电资源'];
        const types = ['video', 'software', 'document', 'music'];

        for (let i = 0; i < 15; i++) {
            const source = sources[i % sources.length];
            const type = types[i % types.length];

            results.push({
                id: `quick_${i + 1}`,
                title: `【高清】${query} ${this.getTypeText(type)}资源 第${i + 1}个`,
                platform: source.toLowerCase(),
                platformName: source,
                size: `${(Math.random() * 8 + 0.5).toFixed(1)} GB`,
                type: type,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                quality: Math.random() > 0.3 ? 'high' : 'medium',
                downloadUrl: `https://${source.toLowerCase().replace(' ', '')}.com/s/${this.generateRandomCode()}`,
                source: 'channel',
                trustLevel: Math.random() > 0.2 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low'),
                isValid: Math.random() > 0.15
            });
        }

        console.log(`生成了 ${results.length} 个测试结果`);
        return results;
    }

    getTypeText(type) {
        const texts = {
            video: '视频',
            software: '软件',
            document: '文档',
            music: '音乐'
        };
        return texts[type] || type;
    }

    generateRandomCode() {
        return Math.random().toString(36).substring(2, 10);
    }

    showLoading() {
        console.log('显示加载状态...');
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="results-loading">
                    <div class="spinner"></div>
                    <p>正在搜索资源...</p>
                </div>
            `;
        } else {
            console.error('未找到搜索结果容器!');
        }
    }

    showEmptyState() {
        console.log('显示空状态...');
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>开始搜索资源</h3>
                    <p>请在上方输入关键词开始搜索</p>
                </div>
            `;
        }
        this.updateStatusText('请输入搜索关键词');
    }

    showError(message) {
        console.log('显示错误状态:', message);
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 3rem; color: #e74c3c;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                    <h3>搜索出错</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        重新加载
                    </button>
                </div>
            `;
        }
        this.updateStatusText('搜索失败');
    }

    displaySearchResults() {
        console.log('显示搜索结果...');
        const resultsContainer = document.querySelector('.search-results');

        if (!resultsContainer) {
            console.error('未找到结果容器!');
            return;
        }

        if (this.allResults.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3>未找到相关结果</h3>
                    <p>请尝试其他关键词</p>
                </div>
            `;
            return;
        }

        const resultsHTML = this.allResults.map(result => this.createResultCard(result)).join('');
        resultsContainer.innerHTML = resultsHTML;

        console.log('结果显示完成，共', this.allResults.length, '条');
    }

    createResultCard(result) {
        const trustBadgeColors = {
            high: '#27ae60',
            medium: '#f39c12',
            low: '#e74c3c'
        };

        const trustBadgeTexts = {
            high: '🛡️ 高信任',
            medium: '⚠️ 中等',
            low: '🚨 低信任'
        };

        return `
            <div class="result-item" style="padding: 1.5rem; margin-bottom: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid ${trustBadgeColors[result.trustLevel]};">
                <div class="result-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div class="result-title" style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.1rem;">
                            🎬 ${result.title}
                        </h3>
                        <span style="background: ${trustBadgeColors[result.trustLevel]}; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
                            ${trustBadgeTexts[result.trustLevel]}
                        </span>
                    </div>
                    <div class="result-platform" style="background: #f8f9fa; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">
                        📦 ${result.platformName}
                    </div>
                </div>
                <div class="result-meta" style="display: flex; gap: 1rem; margin-bottom: 1rem; color: #7f8c8d; font-size: 0.9rem;">
                    <span>📁 ${result.size}</span>
                    <span>📅 ${result.date}</span>
                    <span>⭐ ${result.quality === 'high' ? '高质量' : '中等'}</span>
                    <span style="color: ${result.isValid ? '#27ae60' : '#e74c3c'};">
                        ${result.isValid ? '✅ 链接有效' : '❓ 未检测'}
                    </span>
                </div>
                <div class="result-actions" style="display: flex; gap: 1rem;">
                    <button onclick="window.showDownloadDialog('${result.downloadUrl}', '${result.title}')"
                            style="padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                        ⬇️ 获取链接
                    </button>
                    <button onclick="navigator.clipboard.writeText('${result.title} - ${result.downloadUrl}').then(() => alert('分享信息已复制到剪贴板')).catch(() => prompt('分享信息:', '${result.title} - ${result.downloadUrl}'))"
                            style="padding: 0.5rem 1rem; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                        🔗 分享
                    </button>
                </div>
            </div>
        `;
    }

    updateResultCount(count) {
        console.log('更新结果计数:', count);
        const countElement = document.querySelector('.results-count');
        if (countElement) {
            countElement.textContent = count > 0 ? `找到 ${count} 个相关结果` : '未找到结果';
        }
    }

    updateStatusText(text) {
        console.log('更新状态文本:', text);
        const countElement = document.querySelector('.results-count');
        if (countElement) {
            countElement.textContent = text;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化...');

    try {
        // 总是初始化主搜索功能
        if (typeof ZiyuansoSearch !== 'undefined') {
            new ZiyuansoSearch();
            console.log('主搜索功能初始化完成');
        } else {
            console.warn('ZiyuansoSearch 类未定义，跳过主搜索功能初始化');
        }

        // 检查是否在搜索页面并初始化搜索结果页面
        const shouldInitializeSearchPage = window.location.href.includes('search') ||
                                         window.location.pathname.includes('search') ||
                                         document.querySelector('.search-results') ||
                                         document.querySelector('.results-container') ||
                                         document.title.includes('搜索结果');

        console.log('搜索页面检查结果:', {
            href: window.location.href,
            pathname: window.location.pathname,
            hasSearchResults: !!document.querySelector('.search-results'),
            hasResultsContainer: !!document.querySelector('.results-container'),
            title: document.title,
            shouldInitialize: shouldInitializeSearchPage
        });

        if (shouldInitializeSearchPage) {
            console.log('创建搜索结果页面实例...');
            window.simpleSearchPage = new SimpleSearchResultsPage();
            console.log('搜索结果页面初始化完成');
        } else {
            console.log('不在搜索页面，跳过搜索结果页面初始化');
        }

    } catch (error) {
        console.error('初始化过程中出错:', error);

        // 显示错误信息给用户
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #e74c3c;">
                    <h3>❌ 初始化失败</h3>
                    <p>错误信息: ${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        重新加载页面
                    </button>
                </div>
            `;
        }
    }
});

// 额外的容错机制 - 如果DOM已经加载但事件没有触发
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM已经准备就绪，立即执行初始化...');
    setTimeout(() => {
        if (!window.simpleSearchPage && (window.location.href.includes('search') || document.querySelector('.search-results'))) {
            console.log('补充初始化搜索页面...');
            try {
                window.simpleSearchPage = new SimpleSearchResultsPage();
                console.log('补充初始化完成');
            } catch (error) {
                console.error('补充初始化失败:', error);
            }
        }
    }, 500);
}

console.log('修复版搜索脚本加载完成');

// 全局函数：显示下载对话框
window.showDownloadDialog = function(downloadUrl, title) {
    // 移除已存在的对话框
    const existingDialog = document.querySelector('.download-dialog-overlay');
    if (existingDialog) {
        existingDialog.remove();
    }

    // 创建对话框覆盖层
    const dialogOverlay = document.createElement('div');
    dialogOverlay.className = 'download-dialog-overlay';
    dialogOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    // 创建对话框内容
    const dialog = document.createElement('div');
    dialog.className = 'download-dialog';
    dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        position: relative;
    `;

    dialog.innerHTML = `
        <div style="text-align: center;">
            <h3 style="margin: 0 0 1rem 0; color: #2c3e50;">🔗 资源链接</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; border-left: 4px solid #3498db;">
                <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #2c3e50;">资源名称：</p>
                <p style="margin: 0 0 1rem 0; color: #7f8c8d; word-break: break-all;">${title}</p>
                <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #2c3e50;">下载链接：</p>
                <p style="margin: 0; color: #3498db; word-break: break-all;">${downloadUrl}</p>
            </div>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 0.75rem; margin-bottom: 1rem;">
                <p style="margin: 0; font-size: 0.85rem; color: #856404;">
                    <strong>💡 提示：</strong>这是演示链接，实际使用时会连接到真实的网盘资源
                </p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.copyToClipboard('${downloadUrl}')"
                        style="padding: 0.75rem 1.5rem; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    📋 复制链接
                </button>
                <button onclick="window.showLinkInfo('${downloadUrl}', '${title}')"
                        style="padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    ℹ️ 链接信息
                </button>
                <button onclick="window.closeDownloadDialog()"
                        style="padding: 0.75rem 1.5rem; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    ❌ 关闭
                </button>
            </div>
        </div>
    `;

    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);

    // 点击覆盖层关闭对话框
    dialogOverlay.addEventListener('click', (e) => {
        if (e.target === dialogOverlay) {
            window.closeDownloadDialog();
        }
    });

    // ESC键关闭对话框
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            window.closeDownloadDialog();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

// 全局函数：显示链接信息
window.showLinkInfo = function(downloadUrl, title) {
    window.showToast('这是演示环境，实际使用时将跳转到真实网盘页面', 'info');

    // 显示详细信息
    const infoDialog = document.createElement('div');
    infoDialog.className = 'info-dialog-overlay';
    infoDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10002;
    `;

    const infoContent = document.createElement('div');
    infoContent.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    infoContent.innerHTML = `
        <div style="text-align: center;">
            <h3 style="margin: 0 0 1.5rem 0; color: #2c3e50;">📋 使用说明</h3>
            <div style="text-align: left; line-height: 1.6;">
                <h4 style="color: #3498db; margin-bottom: 0.5rem;">🔗 关于链接：</h4>
                <p style="margin-bottom: 1rem; color: #7f8c8d;">
                    当前显示的是演示链接，实际部署后会连接到真实的网盘资源页面。
                </p>

                <h4 style="color: #3498db; margin-bottom: 0.5rem;">📥 如何下载：</h4>
                <ul style="margin-bottom: 1rem; color: #7f8c8d; padding-left: 1.5rem;">
                    <li>复制链接地址</li>
                    <li>在浏览器中打开链接</li>
                    <li>根据网盘平台要求进行下载</li>
                    <li>部分资源可能需要提取码</li>
                </ul>

                <h4 style="color: #3498db; margin-bottom: 0.5rem;">⚠️ 注意事项：</h4>
                <ul style="margin-bottom: 1rem; color: #7f8c8d; padding-left: 1.5rem;">
                    <li>请确保网络连接稳定</li>
                    <li>大文件建议使用下载工具</li>
                    <li>注意文件安全性扫描</li>
                    <li>遵守相关法律法规</li>
                </ul>

                <div style="background: #e8f5e8; padding: 1rem; border-radius: 4px; border-left: 4px solid #27ae60;">
                    <p style="margin: 0; font-size: 0.9rem; color: #2d5016;">
                        <strong>💡 开发提示：</strong>实际部署时，这里会显示真实的网盘下载页面
                    </p>
                </div>
            </div>
            <button onclick="this.closest('.info-dialog-overlay').remove()"
                    style="margin-top: 1.5rem; padding: 0.75rem 2rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                我知道了
            </button>
        </div>
    `;

    infoDialog.appendChild(infoContent);
    document.body.appendChild(infoDialog);

    // 点击覆盖层关闭
    infoDialog.addEventListener('click', (e) => {
        if (e.target === infoDialog) {
            infoDialog.remove();
        }
    });
};

// 全局函数：关闭下载对话框
window.closeDownloadDialog = function() {
    const dialog = document.querySelector('.download-dialog-overlay');
    if (dialog) {
        dialog.remove();
    }
};

// 全局函数：复制到剪贴板
window.copyToClipboard = function(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            // 显示成功提示
            window.showToast('链接已复制到剪贴板', 'success');
        }).catch(() => {
            // 降级方案
            window.fallbackCopyToClipboard(text);
        });
    } else {
        window.fallbackCopyToClipboard(text);
    }
};

// 降级复制方案
window.fallbackCopyToClipboard = function(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        window.showToast('链接已复制到剪贴板', 'success');
    } catch (err) {
        console.error('复制失败:', err);
        window.showToast('复制失败，请手动复制', 'error');
    }

    document.body.removeChild(textArea);
};

// 全局函数：显示提示消息
window.showToast = function(message, type = 'info') {
    // 移除已存在的提示
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';

    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        font-size: 0.9rem;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease-in-out;
    `;

    toast.textContent = message;
    document.body.appendChild(toast);

    // 动画显示
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
};
