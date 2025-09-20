// 频道和插件配置示例
// 复制此文件为 config.js 并根据需要修改

// 自定义频道配置
const customChannels = [
    {
        id: 'custom_baidu',
        name: '自定义百度网盘',
        icon: '🔧',
        enabled: false,
        searchUrl: 'https://your-custom-api.com/baidu/',
        searchFunction: async function(query, options) {
            // 自定义搜索逻辑
            const response = await fetch(`https://your-api.com/search/baidu?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            return data.results.map(item => ({
                id: item.id,
                title: item.title,
                platform: 'custom_baidu',
                platformName: this.name,
                size: item.size,
                type: item.type,
                date: item.date,
                quality: item.quality,
                downloadUrl: item.url,
                source: 'channel',
                channelId: this.id
            }));
        }
    }
];

// 自定义插件配置
const customPlugins = [
    {
        id: 'torrent_search',
        name: 'BT种子搜索',
        icon: '🌊',
        enabled: false,
        searchFunction: async function(query, options) {
            // 种子搜索逻辑
            const response = await fetch(`https://torrent-api.com/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            return data.torrents.map(torrent => ({
                id: torrent.hash,
                title: torrent.name,
                platform: 'torrent_search',
                platformName: this.name,
                size: torrent.size,
                type: 'torrent',
                date: torrent.date,
                quality: torrent.seeders > 10 ? 'high' : 'medium',
                downloadUrl: torrent.magnet,
                source: 'plugin',
                pluginId: this.id
            }));
        }
    },

    {
        id: 'subtitle_search',
        name: '字幕搜索',
        icon: '📝',
        enabled: false,
        searchFunction: async function(query, options) {
            // 字幕搜索逻辑
            return [
                {
                    id: `subtitle_${Date.now()}`,
                    title: `${query} 中英双语字幕`,
                    platform: 'subtitle_search',
                    platformName: this.name,
                    size: '1.2 MB',
                    type: 'subtitle',
                    date: new Date().toISOString().split('T')[0],
                    quality: 'high',
                    downloadUrl: `https://subtitle-site.com/download/${query}`,
                    source: 'plugin',
                    pluginId: this.id
                }
            ];
        }
    }
];

// 使用方法：
// 1. 在 main.js 加载后，调用以下函数注册自定义频道和插件
// 2. 可以通过管理界面动态启用/禁用

function registerCustomChannels(channelManager) {
    customChannels.forEach(channel => {
        channelManager.registerChannel(channel.id, channel);
    });
}

function registerCustomPlugins(channelManager) {
    customPlugins.forEach(plugin => {
        channelManager.registerPlugin(plugin.id, plugin);
    });
}

// 导出配置（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        customChannels,
        customPlugins,
        registerCustomChannels,
        registerCustomPlugins
    };
}

// 如果直接在浏览器中使用，可以将配置添加到全局对象
if (typeof window !== 'undefined') {
    window.customSearchConfig = {
        customChannels,
        customPlugins,
        registerCustomChannels,
        registerCustomPlugins
    };
}