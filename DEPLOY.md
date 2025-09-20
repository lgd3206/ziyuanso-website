# 部署指南

## 🚀 部署到 Vercel

### 方法一：通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录下部署
vercel

# 生产环境部署
vercel --prod
```

### 方法二：通过 Vercel 网站
1. 访问 [vercel.com](https://vercel.com)
2. 连接你的 GitHub 仓库
3. 选择项目目录：`ziyuanso-website`
4. 框架预设：选择 `Other`
5. 构建命令：留空或填写 `echo "Static site"`
6. 输出目录：`.` (项目根目录)
7. 点击部署

### 方法三：拖放部署
1. 将整个 `ziyuanso-website` 文件夹拖放到 Vercel 部署页面
2. 等待部署完成

## 🌐 部署到 Netlify

### 方法一：通过 Netlify CLI
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录 Netlify
netlify login

# 部署
netlify deploy

# 生产环境部署
netlify deploy --prod
```

### 方法二：通过 Netlify 网站
1. 访问 [netlify.com](https://netlify.com)
2. 将 `ziyuanso-website` 文件夹拖放到部署区域
3. 或者连接 GitHub 仓库进行自动部署

## 🔧 部署到其他平台

### GitHub Pages
```bash
# 在 GitHub 仓库中启用 Pages
# 选择 source: Deploy from a branch
# 分支: main
# 文件夹: / (root)
```

### 自己的服务器
```bash
# 上传所有文件到网站根目录
# 确保服务器支持静态文件服务
# 配置域名 www.ziyuanso.net 指向服务器
```

## ⚙️ 配置文件说明

### vercel.json
- 配置 Vercel 部署规则
- 设置路由转发
- 支持静态文件服务

### netlify.toml
- 配置 Netlify 部署设置
- 设置重定向规则
- 支持 SPA 路由

### package.json
- 包含部署脚本
- 定义项目元信息
- 指定支持的 Node.js 版本

## 🐛 常见部署问题

### 1. Vercel "No Output Directory" 错误
**解决方案**：
- 确保 `vercel.json` 文件存在
- 使用 `@vercel/static` 构建器
- 输出目录设置为项目根目录

### 2. 路径问题
**解决方案**：
- 检查 HTML 中的资源路径
- 使用相对路径而非绝对路径
- 确保 `assets/` 和 `pages/` 目录正确

### 3. MIME 类型错误
**解决方案**：
- 确保 CSS 和 JS 文件有正确的扩展名
- 检查服务器配置

## 📋 部署检查清单

部署前请确认：
- [ ] 所有文件路径正确
- [ ] CSS 和 JS 文件可正常加载
- [ ] 图片资源路径正确
- [ ] 移动端适配正常
- [ ] 搜索功能正常工作
- [ ] 所有页面链接有效

## 🌟 推荐部署平台

1. **Vercel** - 最适合前端项目，速度快，CDN 全球分布
2. **Netlify** - 功能丰富，支持表单处理和无服务器函数
3. **GitHub Pages** - 免费，适合开源项目
4. **自己的服务器** - 完全控制，适合企业使用

选择 Vercel 或 Netlify 可以获得最佳的部署体验和性能。