// @ts-nocheck
// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
declare var self: ServiceWorkerGlobalScope;

const SW_VERSION = '1.0.0';
let CURRENT_PEER_HOST_CLIENT_ID = null;

class ResponseEvent extends EventTarget {
  reactResponse(eventId, data) {
    this.dispatchEvent(
      new CustomEvent(`RESPONSE-${eventId}`, { detail: data })
    );
  }
}
const responseBridge = new ResponseEvent();

// // // Choose a cache name
// const cacheName = 'cache-v1';
// // // List the files to precache
// const precacheResources = ['/', '/index.html'];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('sw install');
  //   event.waitUntil(
  //     caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  //   );
});

self.addEventListener('activate', (event) => {
  console.log('sw activate');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event: FetchEvent) => {
  const log = console.log.bind(this, 'sw.on(fetch)');
  log(
    'Fetch intercepted for:',
    event.request.url,
    'event.clientId',
    event.clientId,
    'event.resultingClientId',
    event.resultingClientId
  );

  /// this is a new page
  if (event.resultingClientId) {
    (async () => {
      const client = await self.clients.get(event.resultingClientId);
      log('new window', event.request.url, client);
    })();
  }

  if (!CURRENT_PEER_HOST_CLIENT_ID) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      (async () => {
        log('getting data...');
        // ------------ GET DATA ------------
        const peerHostClient: Client = await self.clients.get(
          CURRENT_PEER_HOST_CLIENT_ID
        );
        if (!peerHostClient) {
          log('peerHostClient is gone... opening a new one');
          return fetch(event.request);
        }

        log('getting demo data from peer host client', peerHostClient.id);

        const eventId = `${Date.now()}-${Math.floor(Math.random() * 10000000)}`;

        peerHostClient.postMessage({ type: 'GET_DEMO_DATA', eventId });

        const data = await new Promise((resolve, reject) => {
          responseBridge.addEventListener(
            `RESPONSE-${eventId}`,
            (e: CustomEvent) => {
              log(`RESPONSE-${eventId} received data`, e.detail);
              resolve(e.detail);
            }
          );
        });

        const { status, statusText, headers, body } = data;
        return new Response(body, { status, statusText, headers });
      })()
    );
  }
});

/// Main message router
self.addEventListener('message', (event: MessageEvent) => {
  const log = console.log.bind(this, 'sw.on(message)');
  const sourceClientId = event.source.id;

  log(event.data);

  if (event.data.type === 'GET_VERSION') {
    // event.ports[0].postMessage(SW_VERSION);
    event.source?.postMessage({ version: SW_VERSION });
  }

  if (event.data.type === 'SET_PEER_HOST') {
    if (CURRENT_PEER_HOST_CLIENT_ID === null) {
      log('setting new CURRENT_PEER_HOST_CLIENT_ID', sourceClientId);
    } else {
      log('updating CURRENT_PEER_HOST_CLIENT_ID to', sourceClientId);
    }
    CURRENT_PEER_HOST_CLIENT_ID = sourceClientId;
    event.source?.postMessage({
      type: 'RESPONSE',
      originalType: event.data.type,
      statusText: 'OK',
    });
  }

  if (event.data.type === 'CLEAR_PEER_HOST') {
    CURRENT_PEER_HOST_CLIENT_ID = null;
    event.source?.postMessage({
      type: 'RESPONSE',
      originalType: event.data.type,
      statusText: 'OK',
    });
  }

  if (event.data.type === 'RESPONSE') {
    const eventId = event.data.eventId;
    responseBridge.reactResponse(eventId, event.data);
    // self.dispatchEvent(new Event(`${event.data.type}-${eventId}`, event.data));
  }
});
