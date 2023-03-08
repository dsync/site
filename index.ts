async function onLoad() {
  const log = console.log.bind('index.on("load")');
  
  window.location = /.*redirect=([^&]*).*/.exec(document.location.href)[1];
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just
  // random
  // bs
  //. nothing
  // really
  // mean 
  // anything
  // I'm 
  // just

  // Try to register the service worker.
  try {
    const reg = await navigator.serviceWorker.register(
      new URL('./sw', import.meta.url),
      { scope: '../' }
    );
    console.log('sw registered 😎');
    (window as any).reg = reg;

    navigator.serviceWorker.addEventListener('message', async (e) => {
      console.log('index.on(message)', e.data);

      if (e.data.type === 'RESPONSE') {
        switch (e.data.originalType) {
          case 'SET_PEER_HOST':
            log('opening a new page');
            window.open('./', '_blank');
          default:
            log('response default', e.data);
        }
      }

      // How about using Redux style actions?
      if (e.data.type === 'GET_DEMO_DATA') {
        e.source?.postMessage({
          type: 'RESPONSE',
          eventId: e.data.eventId,
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
          },
          body: `{"hello": "demo data"}`,
        });
      }
    });

    reg.active?.postMessage({ type: 'SET_PEER_HOST' });
    console.log('This host is now a PEER host');

    window.addEventListener('close', () => {
      reg.active?.postMessage({ type: 'CLEAR_PEER_HOST' });
    });
  } catch (err) {
    console.log('😥 Service worker registration failed: ', err);
  }
}

// Register the service worker
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', onLoad);
}

console.log('I am index.ts');
