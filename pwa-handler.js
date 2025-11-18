// PWA 功能处理模块
class PWAHandler {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.swRegistration = null;
  }

  /**
   * 初始化 PWA 功能
   */
  async init() {
    // 检查浏览器是否支持 Service Worker
    if (!('serviceWorker' in navigator)) {
      console.warn('当前浏览器不支持 Service Worker');
      return;
    }

    // 注册 Service Worker
    await this.registerServiceWorker();

    // 设置安装提示
    this.setupInstallPrompt();

    // 检查是否已安装
    this.checkIfInstalled();

    // 监听应用安装事件
    this.listenForInstall();

    // 监听在线/离线状态
    this.setupOnlineOfflineHandlers();

    // 检查更新
    this.checkForUpdates();
  }

  /**
   * 注册 Service Worker
   */
  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker 注册成功:', this.swRegistration.scope);

      // 监听 Service Worker 状态变化
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration.installing;
        console.log('[PWA] 发现新的 Service Worker');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 有新版本可用
            this.showUpdateNotification();
          }
        });
      });

      // 定期检查更新（每小时）
      setInterval(() => {
        this.swRegistration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('[PWA] Service Worker 注册失败:', error);
    }
  }

  /**
   * 设置安装提示
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] 捕获到安装提示事件');
      
      // 阻止默认的安装提示
      e.preventDefault();
      
      // 保存事件，稍后可以触发
      this.deferredPrompt = e;
      
      // 显示自定义安装按钮
      this.showInstallButton();
    });
  }

  /**
   * 显示安装按钮
   */
  showInstallButton() {
    // 检查是否已经显示过安装按钮
    if (document.getElementById('pwa-install-banner')) {
      return;
    }

    // 创建安装横幅
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">📱</div>
        <div class="pwa-install-text">
          <strong>安装应用到桌面</strong>
          <p>获得更快的访问速度和离线使用能力</p>
        </div>
        <div class="pwa-install-actions">
          <button id="pwa-install-btn" class="btn btn-primary">安装</button>
          <button id="pwa-install-close" class="btn btn-secondary">稍后</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // 添加样式（如果还没有）
    this.addInstallBannerStyles();

    // 绑定按钮事件
    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('pwa-install-close').addEventListener('click', () => {
      banner.remove();
      // 记录用户关闭了安装提示
      localStorage.setItem('pwa-install-dismissed', Date.now());
    });

    // 显示动画
    setTimeout(() => banner.classList.add('show'), 100);
  }

  /**
   * 添加安装横幅样式
   */
  addInstallBannerStyles() {
    if (document.getElementById('pwa-install-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'pwa-install-styles';
    style.textContent = `
      .pwa-install-banner {
        position: fixed;
        bottom: -200px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
        border-radius: 12px 12px 0 0;
        padding: 20px;
        max-width: 600px;
        width: 90%;
        z-index: 10000;
        transition: bottom 0.3s ease;
      }
      
      .pwa-install-banner.show {
        bottom: 0;
      }
      
      .pwa-install-content {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .pwa-install-icon {
        font-size: 40px;
        flex-shrink: 0;
      }
      
      .pwa-install-text {
        flex: 1;
      }
      
      .pwa-install-text strong {
        display: block;
        color: #1f2937;
        font-size: 16px;
        margin-bottom: 4px;
      }
      
      .pwa-install-text p {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
      }
      
      .pwa-install-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }
      
      @media (max-width: 640px) {
        .pwa-install-content {
          flex-direction: column;
          text-align: center;
        }
        
        .pwa-install-actions {
          width: 100%;
        }
        
        .pwa-install-actions button {
          flex: 1;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * 安装应用
   */
  async installApp() {
    if (!this.deferredPrompt) {
      console.log('[PWA] 没有可用的安装提示');
      return;
    }

    // 显示安装提示
    this.deferredPrompt.prompt();

    // 等待用户响应
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log('[PWA] 用户安装选择:', outcome);

    if (outcome === 'accepted') {
      console.log('[PWA] 用户接受安装');
      // 可以显示感谢消息
      this.showInstallSuccessMessage();
    } else {
      console.log('[PWA] 用户拒绝安装');
    }

    // 清除 deferredPrompt
    this.deferredPrompt = null;

    // 移除安装横幅
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  /**
   * 显示安装成功消息
   */
  showInstallSuccessMessage() {
    if (window.app && typeof window.app.showNotification === 'function') {
      window.app.showNotification('应用安装成功！现在可以从桌面启动了 🎉', 'success');
    }
  }

  /**
   * 监听应用安装事件
   */
  listenForInstall() {
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] 应用已安装');
      this.isInstalled = true;
      
      // 移除安装横幅
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        banner.remove();
      }

      // 记录安装
      this.trackInstall();
    });
  }

  /**
   * 检查应用是否已安装
   */
  checkIfInstalled() {
    // 检查是否在独立模式下运行（已安装）
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      console.log('[PWA] 应用已安装并在独立模式下运行');
      this.isInstalled = true;
      return true;
    }
    return false;
  }

  /**
   * 设置在线/离线状态处理
   */
  setupOnlineOfflineHandlers() {
    window.addEventListener('online', () => {
      console.log('[PWA] 网络已连接');
      this.updateOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] 网络已断开');
      this.updateOnlineStatus(false);
    });

    // 初始化时检查网络状态
    this.updateOnlineStatus(navigator.onLine);
  }

  /**
   * 更新在线状态显示
   */
  updateOnlineStatus(isOnline) {
    if (window.app && typeof window.app.showNotification === 'function') {
      if (!isOnline) {
        window.app.showNotification('⚠️ 网络已断开，某些功能可能不可用', 'warning');
      } else {
        // 只在之前是离线状态时才显示
        if (!navigator.onLine) {
          window.app.showNotification('✅ 网络已恢复', 'success');
        }
      }
    }

    // 添加/移除离线指示器
    document.body.classList.toggle('offline', !isOnline);
  }

  /**
   * 检查更新
   */
  async checkForUpdates() {
    if (!this.swRegistration) {
      return;
    }

    try {
      await this.swRegistration.update();
      console.log('[PWA] 已检查更新');
    } catch (error) {
      console.error('[PWA] 检查更新失败:', error);
    }
  }

  /**
   * 显示更新通知
   */
  showUpdateNotification() {
    if (window.app && typeof window.app.showNotification === 'function') {
      // 创建更新横幅
      const banner = document.createElement('div');
      banner.className = 'pwa-update-banner';
      banner.innerHTML = `
        <div class="pwa-update-content">
          <span>🎉 新版本可用！</span>
          <button id="pwa-update-btn" class="btn btn-primary btn-sm">立即更新</button>
        </div>
      `;

      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .pwa-update-banner {
          position: fixed;
          top: 60px;
          right: 20px;
          background: #4f46e5;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: slideIn 0.3s ease;
        }
        
        .pwa-update-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .pwa-update-banner .btn-sm {
          padding: 6px 12px;
          font-size: 14px;
          background: white;
          color: #4f46e5;
        }
        
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @media (max-width: 640px) {
          .pwa-update-banner {
            right: 10px;
            left: 10px;
          }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(banner);

      // 绑定更新按钮
      document.getElementById('pwa-update-btn').addEventListener('click', () => {
        this.applyUpdate();
        banner.remove();
      });
    }
  }

  /**
   * 应用更新
   */
  async applyUpdate() {
    if (!this.swRegistration || !this.swRegistration.waiting) {
      return;
    }

    // 向等待的 Service Worker 发送消息，让它接管
    this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // 监听控制器变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Service Worker 已更新，刷新页面');
      window.location.reload();
    });
  }

  /**
   * 记录安装
   */
  trackInstall() {
    localStorage.setItem('pwa-installed', Date.now());
    console.log('[PWA] 安装已记录');
  }

  /**
   * 获取 Service Worker 版本
   */
  async getVersion() {
    if (!navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }
}

// 创建全局 PWA 处理器实例
const pwaHandler = new PWAHandler();

// 当 DOM 加载完成时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pwaHandler.init();
  });
} else {
  pwaHandler.init();
}

// 导出供全局使用
window.pwaHandler = pwaHandler;

console.log('[PWA] PWA 处理器已加载');

