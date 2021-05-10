'use strict';

require('dotenv').config();
const faker = require('faker');
const io = require('socket.io-client');
const HUB_SERVER = process.env.HUB_SERVER || 'http://localhost:3030/hub';
const client = io.connect(HUB_SERVER);

const flowers = '1-206-flowers';
const acme = 'acme-widgets';
client.emit('join', flowers);
client.emit('join', acme);

setTimeout(() => {
  let fakeOrder = {
    store: flowers,
    orderId: faker.datatype.uuid(),
    customerName: faker.name.findName(),
    address: faker.address.streetAddress()
  };
  client.emit('newOrder', fakeOrder);
}, 5000 );

setTimeout(() => {
  let fakeOrder = {
    store: acme,
    orderId: faker.datatype.uuid(),
    customerName: faker.name.findName(),
    address: faker.address.streetAddress()
  };
  client.emit('newOrder', fakeOrder);
}, 5000 );

client.emit('delivered', () => {
  console.log('Your order has been delivered');
});