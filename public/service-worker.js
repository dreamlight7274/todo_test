self.addEventListener("install", (event)=>{
    console.log("Service worker installing...");
});
self.addEventListener('push', function(event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: 'logo192.png', 

  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});