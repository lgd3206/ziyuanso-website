# 资源搜 - 网盘资源搜索网站

## 项目简介

资源搜 (ziyuanso.net) 是一个仿照 lzpanx.com 开发的网盘资源搜索网站，提供免费的网盘资源搜索服务。

## 功能特性

- 🔍 智能搜索：支持关键词快速搜索
- 🌐 多平台支持：百度网盘、阿里云盘、夸克网盘、迅雷网盘
- 💰 完全免费：所有功能免费使用
- ⚡ 实时更新：定期更新资源索引
- 📱 响应式设计：支持手机、平板、桌面端

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **样式**: 自定义 CSS，响应式设计
- **字体**: 系统字体栈 (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)

## 项目结构

```
ziyuanso-website/
├── index.html              # 主页
├── assets/
│   ├── css/
│   │   ├── style.css       # 主样式文件
│   │   └── search.css      # 搜索页面样式
│   ├── js/
│   │   └── main.js         # 主要 JavaScript 功能
│   └── images/             # 图片资源目录
└── pages/
    └── search.html         # 搜索结果页面
```

## 主要页面

### 1. 首页 (index.html)
- 网站介绍和品牌展示
- 搜索框和平台选择
- 热门关键词
- 功能特性介绍
- 热门分类快速入口

### 2. 搜索结果页 (pages/search.html)
- 搜索结果展示
- 高级筛选功能
- 分页导航
- 结果排序

## 功能模块

### 搜索功能
- 关键词搜索
- 平台筛选（百度网盘、阿里云盘、夸克网盘、迅雷网盘）
- 搜索建议
- 热门关键词

### 筛选功能
- 网盘平台筛选
- 文件类型筛选（视频、音乐、软件、文档等）
- 文件大小筛选
- 时间范围筛选

### 用户体验
- 响应式设计
- 加载动画
- 搜索建议
- 结果分页
- 移动端适配

## 部署说明

1. **本地开发**
   ```bash
   # 直接打开 index.html 或使用本地服务器
   python -m http.server 8000
   # 或使用 Node.js
   npx serve .
   ```

2. **生产部署**
   - 上传所有文件到 www.ziyuanso.net 域名对应的服务器
   - 确保服务器支持静态文件托管
   - 配置域名解析

## 自定义配置

### 修改网站信息
在 `index.html` 中修改：
- 网站标题和描述
- 联系信息
- 社交媒体链接

### 修改样式
在 `assets/css/style.css` 中修改：
- 颜色主题（CSS 变量）
- 布局和间距
- 响应式断点

### 修改功能
在 `assets/js/main.js` 中修改：
- 搜索逻辑
- 筛选功能
- 用户交互

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- 移动端浏览器

## 注意事项

1. **法律合规**: 本网站仅提供搜索服务，不存储任何文件内容
2. **版权保护**: 尊重版权，不提供盗版内容的直接下载
3. **用户隐私**: 不收集用户个人信息
4. **内容审核**: 建议添加内容审核机制

## 开发说明

这是一个静态网站项目，包含了完整的前端代码。主要功能：

- 搜索功能使用模拟数据展示（实际使用需要连接后端API）
- 响应式设计适配各种设备
- 现代化的UI设计，参考了流行的搜索引擎界面
- 包含完整的用户交互功能

## 🔧 频道和插件系统

### 频道管理
网站采用频道和插件架构，支持灵活扩展搜索源：

**内置频道**：
- 📦 百度网盘频道
- ☁️ 阿里云盘频道
- ⚡ 夸克网盘频道
- ⚡ 迅雷网盘频道（默认禁用）

**内置插件**：
- 🧲 磁力搜索插件
- 🎬 电影资源插件
- 🎵 音乐资源插件

### 自定义频道和插件

1. **创建自定义频道**：
   ```javascript
   // 在 config.js 中添加
   const customChannel = {
       id: 'my_channel',
       name: '我的网盘',
       icon: '🔧',
       enabled: true,
       searchUrl: 'https://my-api.com/search/',
       searchFunction: async function(query, options) {
           // 实现搜索逻辑
           const response = await fetch(`/api/search?q=${query}`);
           const data = await response.json();
           return data.results;
       }
   };
   ```

2. **创建自定义插件**：
   ```javascript
   const customPlugin = {
       id: 'my_plugin',
       name: '自定义搜索',
       icon: '🔍',
       enabled: true,
       searchFunction: async function(query, options) {
           // 插件搜索逻辑
           return await this.searchMyAPI(query);
       }
   };
   ```

3. **注册频道和插件**：
   ```javascript
   // 在页面加载后
   document.addEventListener('DOMContentLoaded', () => {
       if (window.searchPage) {
           const channelManager = window.searchPage.channelManager;
           channelManager.registerChannel('my_channel', customChannel);
           channelManager.registerPlugin('my_plugin', customPlugin);
       }
   });
   ```

### API 集成示例

要连接真实的搜索API，请修改频道的搜索函数：

```javascript
// 百度网盘真实API集成
async searchBaiduPan(query, options = {}) {
    try {
        const response = await fetch('/api/search/baidu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, ...options })
        });

        const data = await response.json();
        return data.results.map(item => ({
            id: item.id,
            title: item.title,
            platform: 'baidu',
            platformName: '百度网盘',
            size: item.size,
            type: item.type,
            date: item.date,
            quality: item.quality,
            downloadUrl: item.shareUrl,
            source: 'channel',
            channelId: 'baidu'
        }));
    } catch (error) {
        console.error('百度网盘搜索错误:', error);
        return [];
    }
}
```

## 后续开发建议

1. **后端开发**: 开发实际的搜索API接口
2. **数据爬取**: 实现网盘资源的爬取和索引
3. **用户系统**: 添加用户注册、登录功能
4. **收藏功能**: 允许用户收藏喜欢的资源
5. **举报机制**: 添加内容举报和审核功能

## 联系信息

- 网站: www.ziyuanso.net
- 项目创建时间: 2024年1月

---

**免责声明**: 本网站仅提供搜索服务，所有资源均来自互联网，版权归原作者所有。如有版权问题，请联系我们删除。