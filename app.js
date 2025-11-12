// 导入 Web3Modal
import { createWeb3Modal, defaultConfig } from 'https://esm.sh/@web3modal/ethers5@3.5.1'
import { ethers } from 'https://esm.sh/ethers@5.7.2'

// 1. 配置项目信息
const projectId = 'YOUR_PROJECT_ID' // 从 https://cloud.walletconnect.com/ 获取

// 2. 定义 XLayer 网络
const xlayerMainnet = {
    chainId: 196,
    name: 'XLayer Mainnet',
    currency: 'OKB',
    explorerUrl: 'https://www.oklink.com/xlayer',
    rpcUrl: 'https://rpc.xlayer.tech'
}

// 3. 创建配置
const metadata = {
    name: '链上密码本管理器',
    description: '安全的链上密码管理工具',
    url: 'https://myapp.com',
    icons: ['https://avatars.myapp.com/']
}

const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true, // 支持多钱包检测
    enableInjected: true, // 支持浏览器注入的钱包
    enableCoinbase: true,
    rpcUrl: xlayerMainnet.rpcUrl,
    defaultChainId: 196
})

// 4. 创建 Web3Modal 实例
const modal = createWeb3Modal({
    ethersConfig,
    chains: [xlayerMainnet],
    projectId,
    enableAnalytics: false,
    themeMode: 'light',
    themeVariables: {
        '--w3m-accent': '#4f46e5'
    }
})

// 链上密码本管理器应用
class PasswordManagerApp {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = '0x348CD0FFd4F40D2F3EE78D916B6ccbDF94120F05';
        this.contractABI = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    }
                ],
                "name": "PasswordAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    }
                ],
                "name": "PasswordDeleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    }
                ],
                "name": "PasswordUpdated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedPassword",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    }
                ],
                "name": "addPassword",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    }
                ],
                "name": "deletePassword",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    }
                ],
                "name": "getPasswordById",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "encryptedPassword",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "category",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "description",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "createdAt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "updatedAt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "isActive",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct OnChainPasswordManager.Password",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getUserCategories",
                "outputs": [
                    {
                        "internalType": "string[]",
                        "name": "",
                        "type": "string[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getUserPasswords",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "encryptedPassword",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "category",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "description",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "createdAt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "updatedAt",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "isActive",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct OnChainPasswordManager.Password[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "passwordId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedPassword",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    }
                ],
                "name": "updatePassword",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        this.passwords = [];
        this.categories = [];
        this.encryptionKey = null; // 加密密钥
    }

    // 初始化应用
    async init() {
        this.bindEvents();
        this.setupWeb3ModalEvents();
    }

    // 生成加密密钥（使用钱包签名）
    async generateEncryptionKey() {
        try {
            if (this.encryptionKey) {
                return this.encryptionKey; // 如果已经生成过，直接返回
            }

            // 请求用户签名一个固定消息来生成密钥
            const message = "签名此消息以生成您的密码加密密钥。此操作是安全的，不会花费任何费用。";
            const signature = await this.signer.signMessage(message);
            
            // 使用签名的前32字节作为密钥材料
            const keyMaterial = signature.slice(0, 66); // 0x + 64个字符
            
            // 将签名转换为密钥
            const encoder = new TextEncoder();
            const keyData = encoder.encode(keyMaterial);
            
            // 生成AES密钥
            const key = await crypto.subtle.importKey(
                'raw',
                await crypto.subtle.digest('SHA-256', keyData),
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            
            this.encryptionKey = key;
            console.log('加密密钥生成成功');
            return key;
        } catch (error) {
            console.error('生成加密密钥失败:', error);
            throw new Error('生成加密密钥失败，请重试');
        }
    }

    // 加密密码
    async encryptPassword(password) {
        try {
            const key = await this.generateEncryptionKey();
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            
            // 生成随机IV（初始化向量）
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // 加密数据
            const encryptedData = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            
            // 将IV和加密数据组合并转换为base64
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encryptedData), iv.length);
            
            // 转换为base64字符串
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('加密失败:', error);
            throw new Error('密码加密失败');
        }
    }

    // 解密密码
    async decryptPassword(encryptedPassword) {
        try {
            if (!encryptedPassword) return '';
            
            const key = await this.generateEncryptionKey();
            
            // 从base64解码
            const combined = Uint8Array.from(atob(encryptedPassword), c => c.charCodeAt(0));
            
            // 提取IV和加密数据
            const iv = combined.slice(0, 12);
            const encryptedData = combined.slice(12);
            
            // 解密数据
            const decryptedData = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encryptedData
            );
            
            // 转换回字符串
            const decoder = new TextDecoder();
            return decoder.decode(decryptedData);
        } catch (error) {
            console.error('解密失败:', error);
            return '[解密失败]';
        }
    }

    // 设置 Web3Modal 事件监听
    setupWeb3ModalEvents() {
        // 监听钱包连接状态变化
        modal.subscribeProvider(async (state) => {
            console.log('Provider state changed:', state);
            
            if (state.isConnected) {
                await this.onWalletConnected();
            } else {
                this.onWalletDisconnected();
            }
        });
    }

    // 钱包连接成功时的处理
    async onWalletConnected() {
        try {
            const walletProvider = modal.getWalletProvider();
            
            if (!walletProvider) {
                console.error('钱包 provider 未找到');
                return;
            }

            // 创建 ethers provider
            this.provider = new ethers.providers.Web3Provider(walletProvider);
            this.signer = this.provider.getSigner();
            this.account = await this.signer.getAddress();

            console.log('连接的账户:', this.account);

            // 创建合约实例
            this.contract = new ethers.Contract(
                this.contractAddress,
                this.contractABI,
                this.signer
            );

            // 检查网络
            await this.checkNetwork();

            // 显示已连接状态
            this.showConnectedState();
            this.showNotification('钱包连接成功', 'success');

            // 加载密码数据
            await this.loadPasswords();
        } catch (error) {
            console.error('钱包连接处理失败:', error);
            this.showNotification('连接处理失败', 'error');
        }
    }

    // 钱包断开连接时的处理
    onWalletDisconnected() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.account = null;
        this.passwords = [];
        this.categories = [];

        this.showConnectPrompt();
        this.showNotification('钱包已断开连接', 'info');
    }

    // 绑定事件监听器
    bindEvents() {
        // 表单提交事件
        document.getElementById('addPasswordForm').addEventListener('submit', (e) => this.handleAddPassword(e));
        document.getElementById('editPasswordForm').addEventListener('submit', (e) => this.handleUpdatePassword(e));

        // 搜索和过滤事件
        document.getElementById('searchInput').addEventListener('input', () => this.filterPasswords());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterPasswords());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
        document.getElementById('refreshList').addEventListener('click', () => this.loadPasswords());

        // 删除密码事件
        document.getElementById('deletePassword').addEventListener('click', () => this.handleDeletePassword());

        // 密码显示/隐藏切换
        document.getElementById('togglePasswordAdd').addEventListener('click', () => this.togglePasswordVisibility('plainPassword', 'togglePasswordAdd'));
        document.getElementById('togglePasswordEdit').addEventListener('click', () => this.togglePasswordVisibility('editPlainPassword', 'togglePasswordEdit'));
        
        // 复制密码
        document.getElementById('copyPassword').addEventListener('click', () => this.copyPasswordToClipboard());

        // 模态框关闭事件
        document.querySelector('.close-btn').addEventListener('click', () => this.closeModal());

        // 点击模态框外部关闭
        document.getElementById('passwordModal').addEventListener('click', (e) => {
            if (e.target.id === 'passwordModal') {
                this.closeModal();
            }
        });
    }

    // 切换密码可见性
    togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    }

    // 复制密码到剪贴板
    async copyPasswordToClipboard() {
        const passwordInput = document.getElementById('editPlainPassword');
        const password = passwordInput.value;
        
        try {
            await navigator.clipboard.writeText(password);
            this.showNotification('密码已复制到剪贴板', 'success');
        } catch (error) {
            console.error('复制失败:', error);
            // 降级方案
            passwordInput.select();
            document.execCommand('copy');
            this.showNotification('密码已复制', 'success');
        }
    }

    // 检查网络配置
    async checkNetwork() {
        try {
            const network = await this.provider.getNetwork();
            const xlayerChainId = 196; // XLayer 主网 Chain ID

            if (network.chainId !== xlayerChainId) {
                this.showNotification('请切换到 XLayer 网络', 'error');
                
                // Web3Modal 会自动处理网络切换
                console.log('当前网络:', network.chainId, '需要:', xlayerChainId);
            }
        } catch (error) {
            console.error('检查网络失败:', error);
        }
    }

    // 显示连接提示
    showConnectPrompt() {
        document.getElementById('connectPrompt').style.display = 'block';
        document.getElementById('connectedContent').style.display = 'none';
    }

    // 显示已连接状态
    showConnectedState() {
        document.getElementById('connectPrompt').style.display = 'none';
        document.getElementById('connectedContent').style.display = 'block';
    }

    // 添加密码
    async handleAddPassword(e) {
        e.preventDefault();

        const name = document.getElementById('passwordName').value;
        const plainPassword = document.getElementById('plainPassword').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        if (!name || !plainPassword || !category) {
            this.showNotification('请填写所有必填字段', 'error');
            return;
        }

        try {
            this.showLoading(true);

            // 自动加密密码
            console.log('正在加密密码...');
            const encryptedPassword = await this.encryptPassword(plainPassword);
            console.log('密码加密成功');

            const tx = await this.contract.addPassword(
                name,
                encryptedPassword,
                category,
                description
            );

            console.log('交易已提交，等待确认...');
            await tx.wait();
            this.showNotification('密码添加成功', 'success');

            // 重置表单
            document.getElementById('addPasswordForm').reset();

            // 重新加载密码列表
            await this.loadPasswords();

        } catch (error) {
            console.error('添加密码失败:', error);
            
            if (error.message.includes('加密')) {
                this.showNotification('密码加密失败，请重试', 'error');
            } else if (error.code === 4001) {
                this.showNotification('用户取消了操作', 'warning');
            } else {
                this.showNotification('添加密码失败', 'error');
            }
        } finally {
            this.showLoading(false);
        }
    }

    // 加载密码列表
    async loadPasswords() {
        if (!this.contract) return;

        try {
            this.showLoading(true);

            // 获取用户所有密码
            const passwords = await this.contract.getUserPasswords();

            // 过滤活跃密码
            this.passwords = passwords.filter(p => p.isActive).map(p => ({
                id: p.id.toString(),
                name: p.name,
                encryptedPassword: p.encryptedPassword,
                category: p.category,
                description: p.description,
                createdAt: new Date(parseInt(p.createdAt) * 1000),
                updatedAt: new Date(parseInt(p.updatedAt) * 1000),
                isActive: p.isActive
            }));

            // 获取分类
            await this.loadCategories();

            // 渲染密码列表
            this.renderPasswordList();

        } catch (error) {
            console.error('加载密码失败:', error);
            this.showNotification('加载密码失败', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 加载分类
    async loadCategories() {
        if (!this.contract) return;

        try {
            const categories = await this.contract.getUserCategories();
            this.categories = categories;
            this.renderCategoryFilter();
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    }

    // 渲染分类过滤器
    renderCategoryFilter() {
        const filter = document.getElementById('categoryFilter');
        filter.innerHTML = '<option value="">所有分类</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filter.appendChild(option);
        });
    }

    // 渲染密码列表
    renderPasswordList() {
        const container = document.getElementById('passwordList');

        // 获取筛选后的密码列表
        const filteredPasswords = this.getFilteredPasswords();

        if (filteredPasswords.length === 0) {
            const searchTerm = document.getElementById('searchInput').value;
            const categoryFilter = document.getElementById('categoryFilter').value;
            
            if (searchTerm || categoryFilter) {
                container.innerHTML = '<div class="empty-state">没有找到匹配的密码</div>';
            } else {
                container.innerHTML = '<div class="empty-state">暂无密码记录</div>';
            }
            return;
        }

        container.innerHTML = filteredPasswords.map(password => `
            <div class="password-item" onclick="app.openPasswordModal('${password.id}')">
                <div class="password-header">
                    <div>
                        <div class="password-name">${this.escapeHtml(password.name)}</div>
                        <div class="password-category">${this.escapeHtml(password.category)}</div>
                    </div>
                    <div class="password-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); app.openPasswordModal('${password.id}')">编辑</button>
                    </div>
                </div>
                <div class="password-description">${this.escapeHtml(password.description || '无描述')}</div>
                <div class="password-meta">
                    <span>创建: ${password.createdAt.toLocaleDateString()}</span>
                    <span>更新: ${password.updatedAt.toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    // 获取筛选后的密码列表
    getFilteredPasswords() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const categoryFilter = document.getElementById('categoryFilter').value;

        return this.passwords.filter(password => {
            // 分类筛选
            if (categoryFilter && password.category !== categoryFilter) {
                return false;
            }

            // 搜索关键词筛选
            if (searchTerm) {
                const searchableText = [
                    password.name,
                    password.category,
                    password.description || ''
                ].join(' ').toLowerCase();

                return searchableText.includes(searchTerm);
            }

            return true;
        });
    }

    // 过滤密码
    filterPasswords() {
        this.renderPasswordList();
        this.updateFilterStatus();
    }

    // 更新筛选状态显示
    updateFilterStatus() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const clearBtn = document.getElementById('clearFilters');
        const filterStatus = document.getElementById('filterStatus');
        
        const filteredCount = this.getFilteredPasswords().length;
        const totalCount = this.passwords.length;
        
        // 显示/隐藏清除筛选按钮
        if (searchTerm || categoryFilter) {
            clearBtn.style.display = 'inline-block';
            
            // 显示筛选状态
            let statusText = `显示 ${filteredCount} / ${totalCount} 条密码`;
            if (searchTerm) {
                statusText += ` | 搜索: "${searchTerm}"`;
            }
            if (categoryFilter) {
                statusText += ` | 分类: ${categoryFilter}`;
            }
            filterStatus.textContent = statusText;
            filterStatus.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
            filterStatus.style.display = 'none';
        }
    }

    // 清除所有筛选条件
    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        this.filterPasswords();
        this.showNotification('已清除所有筛选条件', 'success');
    }

    // 打开密码编辑模态框
    async openPasswordModal(passwordId) {
        try {
            this.showLoading(true);
            const password = await this.contract.getPasswordById(passwordId);

            document.getElementById('editPasswordId').value = passwordId;
            document.getElementById('editPasswordName').value = password.name;
            document.getElementById('editCategory').value = password.category;
            document.getElementById('editDescription').value = password.description;

            // 解密密码并显示
            console.log('正在解密密码...');
            const decryptedPassword = await this.decryptPassword(password.encryptedPassword);
            console.log('密码解密成功');
            document.getElementById('editPlainPassword').value = decryptedPassword;
            
            // 重置密码输入框为隐藏状态
            document.getElementById('editPlainPassword').type = 'password';
            document.getElementById('togglePasswordEdit').textContent = '👁️';

            document.getElementById('passwordModal').style.display = 'block';
        } catch (error) {
            console.error('获取密码详情失败:', error);
            this.showNotification('获取密码详情失败', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 更新密码
    async handleUpdatePassword(e) {
        e.preventDefault();

        const passwordId = document.getElementById('editPasswordId').value;
        const name = document.getElementById('editPasswordName').value;
        const plainPassword = document.getElementById('editPlainPassword').value;
        const category = document.getElementById('editCategory').value;
        const description = document.getElementById('editDescription').value;

        try {
            this.showLoading(true);

            // 重新加密密码
            console.log('正在加密更新的密码...');
            const encryptedPassword = await this.encryptPassword(plainPassword);
            console.log('密码加密成功');

            const tx = await this.contract.updatePassword(
                passwordId,
                name,
                encryptedPassword,
                category,
                description
            );

            console.log('交易已提交，等待确认...');
            await tx.wait();
            this.showNotification('密码更新成功', 'success');

            this.closeModal();
            await this.loadPasswords();

        } catch (error) {
            console.error('更新密码失败:', error);
            
            if (error.message.includes('加密')) {
                this.showNotification('密码加密失败，请重试', 'error');
            } else if (error.code === 4001) {
                this.showNotification('用户取消了操作', 'warning');
            } else {
                this.showNotification('更新密码失败', 'error');
            }
        } finally {
            this.showLoading(false);
        }
    }

    // 删除密码
    async handleDeletePassword() {
        const passwordId = document.getElementById('editPasswordId').value;

        if (!confirm('确定要删除这个密码吗？')) {
            return;
        }

        try {
            this.showLoading(true);

            const tx = await this.contract.deletePassword(passwordId);
            await tx.wait();

            this.showNotification('密码删除成功', 'success');
            this.closeModal();
            await this.loadPasswords();

        } catch (error) {
            console.error('删除密码失败:', error);
            this.showNotification('删除密码失败', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 关闭模态框
    closeModal() {
        document.getElementById('passwordModal').style.display = 'none';
    }

    // 显示加载状态
    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    // 显示通知消息
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // HTML 转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 创建应用实例并初始化
const app = new PasswordManagerApp();

// 等待 DOM 加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// 导出供全局使用
window.app = app;

