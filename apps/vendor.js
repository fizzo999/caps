'use strict';

const faker = require('faker');
// const events = require('../lib/events.js');
require('dotenv').config();
const HOST = process.env.HOST || 'http://localhost:3000';
const io = require('socket.io-client');
const socket = io.connect(`${HOST}/caps`);

const STORE_ID = process.env.STORE_ID;
const orderQueue = [];

// Emit that message to the CAPS server with an event called pickup
// Listen for the delivered event coming in from the CAPS server
// Log “thank you for delivering payload.id” to the console

setInterval( () => {
  let customOrder = new CustomOrder();
  orderQueue.push(customOrder);
  let obj = {event: 'pickup', order:customOrder, time:new Date(), numberOfOrdersLeft: orderQueue.length}
  socket.emit('pickup', obj);
  console.log('================ PICKUP FIRED ==================', obj);
}, 500);

socket.on('delivered', payload => {
  console.log(`thank you for delivering ${payload.orderId}`);
});

// setInterval( () => {
//   let deliveryTime = Math.ceil(Math.random() * 8000);
//   let customOrder = orderQueue.splice(0,1);
//   events.emit('delivered', {event: 'delivered', order:customOrder, time:deliveryTime, numberOfOrdersLeft: orderQueue.length});
// }, 4000);

// function loggerDelivered(payload) {
//   console.log('================ DELIVERED FIRED ==================', payload);
// }

// events.on('delivered', loggerDelivered);

function CustomOrder() {
  this.timeStamp = new Date(),
  this.storename = process.env.STORE_ID,
  this.orderId = faker.datatype.uuid(),
  this.customerName = faker.name.findName(),
  // this.customerAddressStreet = faker.Address.street_address(),
  this.customerAddressCity = faker.address.city(),
  // this.customerAddressZIP = faker.address.postalcode(),
  this.customerAddressState = faker.address.state(),
  // this.customerPhoneNumber = faker.Phone.EnUs.phone(),
  this.customerEmail = faker.internet.email()
}

module.exports = orderQueue;
