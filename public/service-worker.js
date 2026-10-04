const CACHE_NAME = "todo-v1";

//saat service worker di-install
self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll([
                "/",
                "/manifest.json",
                "/icon-192.png",
                "/icon-512.png"
            ]);
        })
    );
});

//saat website meminta file/data
self.addEventListener("fetch",function(event){
    event.respondWith(
        fetch(event.request).then(function(response){
            //simpan hasil dari internet ke cache
            const salinanResponse= response.clone();
            caches.open(CACHE_NAME).then(function(cache){
                cache.put(event.request, salinanResponse);
            });
            return response;
        })
        .catch(function(){
            //jika internet gagal, cari dari cache
            return caches.match(event.request);
        })
    );
});