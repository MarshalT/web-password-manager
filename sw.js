// Service Worker for 链上密码管理器
// 版本号 - 更新此版本号将触发Service Worker更新
const VERSION = 'v1.0.0';
const CACHE_NAME = `password-manager-${VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 动态缓存的资源 (运行时缓存)
const RUNTIME_CACHE = `runtime-${VERSION}`;

// 最大缓存时间 (7天)
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;

// ==================== 安装事件 ====================
self.addEventListener('install', (event) => {
  console.log('[SW] 正在安装 Service Worker...', VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 缓存静态资源');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] 安装完成，跳过等待');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] 安装失败:', error);
      })
  );
});

// ==================== 激活事件 ====================
self.addEventListener('activate', (event) => {
  console.log('[SW] 正在激活 Service Worker...', VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // 删除旧版本的缓存
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] 激活完成，接管所有页面');
        return self.clients.claim();
      })
  );
});

// ==================== 获取事件 ====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过 chrome-extension 和其他协议
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 跳过 Web3Modal 和外部 CDN 资源（让它们始终从网络获取）
  if (url.hostname.includes('walletconnect.com') || 
      url.hostname.includes('walletconnect.org') ||
      url.hostname.includes('esm.sh') ||
      url.hostname === 'rpc.xlayer.tech') {
    // 网络优先策略
    event.respondWith(
      fetch(request)
        .catch(() => {
          // 如果网络失败，返回离线页面（可选）
          return new Response('离线模式下无法访问此资源', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // 对于应用本身的资源，使用缓存优先策略
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 如果缓存中有，返回缓存，同时在后台更新
          fetchAndCache(request);
          return cachedResponse;
        }

        // 如果缓存中没有，从网络获取
        return fetchAndCache(request);
      })
      .catch((error) => {
        console.error('[SW] 获取资源失败:', request.url, error);
        
        // 如果是 HTML 页面请求失败，返回离线页面
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
        
        return new Response('网络错误', {
          status: 408,
          statusText: 'Request Timeout'
        });
      })
  );
});

// ==================== 辅助函数 ====================

/**
 * 从网络获取资源并缓存
 */
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    // 只缓存成功的响应
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      // 克隆响应，因为响应流只能使用一次
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] 网络请求失败:', request.url, error);
    throw error;
  }
}

/**
 * 清理过期缓存
 */
async function cleanupOldCaches() {
  const cache = await caches.open(RUNTIME_CACHE);
  const requests = await cache.keys();
  const now = Date.now();

  for (const request of requests) {
    const response = await cache.match(request);
    const dateHeader = response.headers.get('date');
    
    if (dateHeader) {
      const cacheTime = new Date(dateHeader).getTime();
      if (now - cacheTime > MAX_CACHE_AGE) {
        console.log('[SW] 删除过期缓存:', request.url);
        await cache.delete(request);
      }
    }
  }
}

// ==================== 消息处理 ====================
self.addEventListener('message', (event) => {
  console.log('[SW] 收到消息:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(cleanupOldCaches());
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION });
  }
});

// ==================== 后台同步（可选） ====================
self.addEventListener('sync', (event) => {
  console.log('[SW] 后台同步事件:', event.tag);
  
  if (event.tag === 'sync-passwords') {
    event.waitUntil(syncPasswords());
  }
});

async function syncPasswords() {
  // 这里可以实现后台同步逻辑
  // 例如：同步本地待上传的密码到区块链
  console.log('[SW] 执行密码同步...');
}

// ==================== 推送通知（可选） ====================
self.addEventListener('push', (event) => {
  console.log('[SW] 收到推送通知:', event);
  
  const options = {
    body: event.data ? event.data.text() : '您有新的通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'password-manager-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('链上密码管理器', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 通知被点击:', event);
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] Service Worker 已加载', VERSION);

