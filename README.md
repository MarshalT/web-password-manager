# 🔐 链上密码本管理器

一个基于区块链的密码管理工具，使用 Web3Modal 连接钱包，在 XLayer 网络上安全存储密码。

## ✨ 功能特性

- 🔐 **安全加密**：使用钱包签名生成加密密钥
- 🌐 **Web3 集成**：支持多种钱包连接
- 🔗 **链上存储**：密码数据存储在 XLayer 区块链上
- 📱 **响应式设计**：适配各种设备屏幕
- 🔍 **智能搜索**：支持按名称和分类搜索密码
- 🛡️ **隐私保护**：密码在本地加密后上链

## 🚀 快速开始

### 本地运行

1. 克隆项目
```bash
git clone <repository-url>
cd web-password-manager
```

2. 启动本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000 -c-1
```

3. 在浏览器中访问 `http://localhost:8000`

### GitHub Pages 部署

项目支持传统的 GitHub Pages 部署方式：

#### 方法一：使用部署脚本（推荐）

**Windows 用户：**
```cmd
双击运行 deploy-gh-pages.bat
```

**Linux/macOS 用户：**
```bash
chmod +x deploy-gh-pages.sh
./deploy-gh-pages.sh
```

#### 方法二：手动部署

1. 创建并切换到 gh-pages 分支：
```bash
git checkout -b gh-pages
git add .
git commit -m "部署到 GitHub Pages"
git push origin gh-pages
```

2. 在 GitHub 仓库设置中：
   - 进入 "Pages" 部分
   - 选择 "Deploy from a branch"
   - 选择 "gh-pages" 分支和 "/ (root)" 文件夹

3. 访问 `https://MarshalT.github.io/web-password-manager`

## 🔧 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **区块链**：Ethereum, XLayer Network
- **钱包连接**：Web3Modal
- **加密**：Web Crypto API (AES-GCM)
- **部署**：GitHub Pages

## 📋 使用说明

### 1. 连接钱包
- 点击页面右上角的钱包连接按钮
- 选择支持的钱包（MetaMask、WalletConnect 等）
- 确认连接请求

### 2. 添加密码
- 填写密码名称、密码、分类和描述
- 密码会自动使用您的钱包签名加密
- 确认交易以将加密后的密码存储到区块链

### 3. 管理密码
- 查看所有已存储的密码
- 使用搜索和分类筛选功能
- 编辑或删除现有密码

## 🔒 安全说明

- 密码在本地使用您的钱包签名生成的密钥加密
- 只有加密后的数据存储在区块链上
- 每次访问都需要重新连接钱包以生成解密密钥
- 私钥始终保存在您的钱包中，不会泄露

## 🛠️ 开发说明

### 项目结构
```
web-password-manager/
├── index.html          # 主页面
├── app.js              # 应用逻辑
├── styles.css          # 样式文件
├── 404.html            # 404错误页面
├── .github/workflows/  # GitHub Actions配置
└── README.md           # 项目说明
```

### 环境要求

- 现代浏览器（支持 ES6+ 和 Web Crypto API）
- 支持的钱包扩展（如 MetaMask）
- XLayer 网络配置

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。