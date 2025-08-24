// Service Worker para Pasta Segura Bancária
const CACHE_NAME = 'pasta-segura-v1.0.0';
const STATIC_CACHE = 'pasta-segura-static-v1';
const DYNAMIC_CACHE = 'pasta-segura-dynamic-v1';

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cache estático criado');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('[SW] Erro ao criar cache estático:', error);
      })
  );
  
  // Forçar ativação imediata
  self.skipWaiting();
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remover caches antigos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker ativado');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorar deep links e WhatsApp
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Estratégia Cache First para recursos estáticos
  if (STATIC_FILES.some(file => request.url.includes(file))) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request);
        })
    );
    return;
  }

  // Estratégia Network First para conteúdo dinâmico
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clonar resposta para cache
        const responseClone = response.clone();
        
        // Cachear apenas respostas válidas
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback para cache em caso de erro de rede
        return caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Fallback para página offline
            if (request.destination === 'document') {
              return caches.match('/');
            }
            
            // Fallback para outros recursos
            return new Response('Recurso não disponível offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('[SW] Sincronização em background:', event.tag);
  
  if (event.tag === 'emergency-sync') {
    event.waitUntil(syncEmergencyData());
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  console.log('[SW] Notificação push recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação da Pasta Segura',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'pasta-segura-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Pasta Segura Bancária', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clique em notificação:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Funções auxiliares
async function syncEmergencyData() {
  try {
    console.log('[SW] Sincronizando dados de emergência...');
    
    // Aqui você pode implementar lógica para sincronizar
    // dados de emergência quando a conexão for restaurada
    
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Erro na sincronização:', error);
    throw error;
  }
}

// Limpeza periódica de cache
function cleanupCache() {
  caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      return cache.keys();
    })
    .then((requests) => {
      // Manter apenas os últimos 50 itens no cache dinâmico
      if (requests.length > 50) {
        const toDelete = requests.slice(0, requests.length - 50);
        return Promise.all(
          toDelete.map((request) => {
            return caches.delete(request);
          })
        );
      }
    })
    .catch((error) => {
      console.error('[SW] Erro na limpeza de cache:', error);
    });
}

// Executar limpeza a cada 24 horas
setInterval(cleanupCache, 24 * 60 * 60 * 1000);

