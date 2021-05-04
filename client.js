'use strict';

// For these, the client.js will be the app that runs constantly, monitoring and handling events. They’ll use the queue.js to subscribe to the hub server using a common library

// Client applications will “subscribe” to the hub server’s queue for a given event. Subscribing means that the client intends for the hub server to save all messages until the client confirms receipt. Subscribing through the queue library should look like this:

//   queue.connect();
//   queue.subscribe('delivered', (payload) => {
//     // do something with the returned data (payload)
//   })

