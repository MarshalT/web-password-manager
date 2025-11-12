# 链上密码本管理器 - Web3Modal 版本

## 🚀 快速开始

### 1. 获取 WalletConnect Project ID

由于使用了 Web3Modal，您需要先获取一个免费的 Project ID：

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 注册账号并创建新项目
3. 复制您的 Project ID
4. 在 `app-web3modal.js` 第 6 行替换 `YOUR_PROJECT_ID`

```javascript
const projectId = 'YOUR_PROJECT_ID' // 替换为您的 Project ID
```

### 2. 使用方法

#### 方法一：本地服务器运行（推荐）

由于使用了 ES6 模块，需要通过 HTTP 服务器运行：

```bash
# 使用 Python 启动服务器
cd web-password-manager
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server -p 8000
```

然后访问：`http://localhost:8000/index-web3modal.html`

#### 方法二：使用在线编辑器

直接将文件上传到 CodePen、JSFiddle 或 Stackblitz 等在线编辑器。

### 3. 文件说明

- **index-web3modal.html**: 使用 Web3Modal 的 HTML 页面
- **app-web3modal.js**: 使用 Web3Modal 的 JavaScript 代码
- **styles.css**: 样式文件（复用原有的）

## ✨ 功能特点

### Web3Modal 的优势

1. **🎯 自动检测钱包**
   - 自动检测浏览器中安装的所有钱包插件
   - 支持 MetaMask、OKX Wallet、Coinbase Wallet 等
   - 支持 WalletConnect 协议（移动端钱包）

2. **📱 移动端支持**
   - 通过 WalletConnect 连接移动端钱包
   - 扫码连接，安全便捷

3. **🔄 网络切换**
   - 自动提示切换到 XLayer 网络
   - 一键添加自定义网络

4. **💼 多钱包管理**
   - 在多个钱包之间轻松切换
   - 记住上次连接的钱包

5. **🎨 美观的 UI**
   - 专业的钱包连接界面
   - 支持明暗主题
   - 响应式设计

## 🔧 配置说明

### 网络配置

当前配置为 XLayer 主网（Chain ID: 196）：

```javascript
const xlayerMainnet = {
    chainId: 196,
    name: 'XLayer Mainnet',
    currency: 'OKB',
    explorerUrl: 'https://www.oklink.com/xlayer',
    rpcUrl: 'https://rpc.xlayer.tech'
}
```

### 合约地址

```javascript
this.contractAddress = '0x348CD0FFd4F40D2F3EE78D916B6ccbDF94120F05';
```

## 📦 支持的钱包

### 浏览器插件钱包
- ✅ MetaMask
- ✅ OKX Wallet
- ✅ Coinbase Wallet
- ✅ Trust Wallet
- ✅ 其他支持 EIP-6963 的钱包

### 移动端钱包（通过 WalletConnect）
- ✅ MetaMask Mobile
- ✅ OKX App
- ✅ Trust Wallet
- ✅ Rainbow
- ✅ 等 300+ 钱包

## 🎨 界面特点

### 连接钱包
- 点击 "连接钱包" 按钮
- 自动弹出钱包选择界面
- 选择您要使用的钱包
- 授权连接即可

### 钱包信息显示
- 显示钱包地址（缩写形式）
- 一键断开连接
- 网络状态指示

## 🔐 安全提示

1. **Project ID 安全**
   - Project ID 可以公开使用
   - 不包含任何私密信息
   - 仅用于 WalletConnect 服务

2. **私钥安全**
   - 应用不会接触您的私钥
   - 所有交易都通过钱包签名
   - 请勿在不安全的网络环境使用

3. **合约交互**
   - 每次交易前请仔细确认
   - 检查交易参数和 Gas 费用
   - 使用测试网进行测试

## 🐛 常见问题

### 1. 钱包连接失败

**问题**: 点击连接钱包没有反应

**解决方案**:
- 确保已安装钱包插件
- 检查是否填写了正确的 Project ID
- 检查浏览器控制台是否有错误信息
- 尝试刷新页面

### 2. 网络错误

**问题**: 提示网络不正确

**解决方案**:
- Web3Modal 会自动提示切换网络
- 点击切换按钮即可
- 如果没有自动添加，手动添加 XLayer 网络配置

### 3. 模块加载失败

**问题**: ES6 模块导入失败

**解决方案**:
- 必须通过 HTTP 服务器运行，不能直接打开 HTML 文件
- 使用推荐的本地服务器方法

### 4. 移动端无法连接

**问题**: 移动端钱包连接不上

**解决方案**:
- 确保 Project ID 正确
- 使用 WalletConnect 扫码连接
- 检查钱包应用是否支持 XLayer 网络

## 🆚 与原版本对比

| 特性 | 原版本 | Web3Modal 版本 |
|------|--------|----------------|
| 钱包检测 | 手动检测 | 自动检测所有钱包 |
| 移动端支持 | ❌ | ✅ WalletConnect |
| UI 美观度 | 基础 | 专业级 |
| 多钱包切换 | 需要刷新 | 无缝切换 |
| 网络切换 | 手动 | 自动提示 |
| 代码复杂度 | 较高 | 简化 |

## 📝 开发指南

### 修改主题

```javascript
const modal = createWeb3Modal({
    ethersConfig,
    chains: [xlayerMainnet],
    projectId,
    themeMode: 'dark', // 改为深色主题
    themeVariables: {
        '--w3m-accent': '#4f46e5', // 主题色
        '--w3m-background': '#000000' // 背景色
    }
})
```

### 添加更多网络

```javascript
const xlayerTestnet = {
    chainId: 195,
    name: 'XLayer Testnet',
    currency: 'OKB',
    explorerUrl: 'https://www.oklink.com/xlayer-test',
    rpcUrl: 'https://testrpc.xlayer.tech'
}

const modal = createWeb3Modal({
    ethersConfig,
    chains: [xlayerMainnet, xlayerTestnet], // 添加多个网络
    projectId
})
```

## 📚 参考资料

- [Web3Modal 文档](https://docs.walletconnect.com/web3modal/about)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Ethers.js 文档](https://docs.ethers.org/v5/)
- [XLayer 文档](https://docs.xlayer.tech/)

## 🤝 技术支持

如有问题，请：
1. 查看浏览器控制台错误信息
2. 检查网络连接
3. 确认 Project ID 配置正确
4. 参考本文档的常见问题部分

## 📄 许可证

MIT License

