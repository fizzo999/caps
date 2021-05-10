'use strict';

require('dotenv').config();
const io = require('socket.io-client');
const HUB_SERVER = process.env.HUB_SERVER || 'http://localhost:3030/hub';
const client = io.connect(HUB_SERVER);

client.emit('getAll', {store:'acme-widgets', event:'newOrder'});
client.emit('getAll', {store:'1-206-flowers', event:'newOrder'});

client.on('order', ({id, payload}) => {
  client.emit('received', {id, payload});
  console.log(`DRIVER: Package #${payload.orderId} is ready for pickup`);

  setTimeout(()=> {
    client.emit('delivered', () => {
      console.log('Your order has been delivered');
    });
  }, 5000);
});
