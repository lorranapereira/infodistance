self.addEventListener('install', function(event) {
    var indexPage = new Request('index.html');
    var planilha = new Request('planilha.html');
    var corrida = new Request('css/corrida.jpg');
    var icone = new Request('images/icons/icon-72x72.png');
 
    event.waitUntil(
      fetch(indexPage).then(function(response) {
        return caches.open('pwabuilder-offline').then(function(cache) {
          return cache.put(indexPage, response);
        });
    }));
    event.waitUntil(
      fetch(planilha).then(function(response) {
        return caches.open('pwabuilder-offline').then(function(cache) {
          return cache.put(planilha, response);
        });
    }));
    event.waitUntil(
        fetch(corrida).then(function(response) {
          return caches.open('pwabuilder-offline').then(function(cache) {
            return cache.put(corrida, response);
        });
    }));
    event.waitUntil(
      fetch(icone).then(function(response) {
        return caches.open('pwabuilder-offline').then(function(cache) {
          return cache.put(icone, response);
        });
    }));
  });

  self.addEventListener('fetch', function(event) {
    var updateCache = function(request){
      return caches.open('pwabuilder-offline').then(function (cache) {
        return fetch(request).then(function (response) {
          return cache.put(request, response);
        });
      });
  };
  
  event.waitUntil(updateCache(event.request));
  
  event.respondWith(
      fetch(event.request).catch(function(error) {
        return caches.open('pwabuilder-offline').then(function (cache) {
          return cache.match(event.request).then(function (matching) {
            var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
            return report
          });
        });
      })
    );
  })