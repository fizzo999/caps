'use strict';

const faker = require('faker');
const events = require('../lib/events.js');
require('dotenv').config();
const orderQueue = [];

// Vendor Module
// Declare your store name (perhaps in a .env file, so that this module is re-usable)
// Every 5 seconds, simulate a new customer order
// Create a fake order, as an object:
// storeName, orderId, customerName, address
// Emit a ‘pickup’ event and attach the fake order as payload
// HINT: Have some fun by using the faker library to make up phony information
// Monitor the system for events …
// Whenever the ‘delivered’ event occurs
// Log “thank you” to the console

// function handlePickup(payload) {
//   console.log('================ PICKUP FIRED ==================', payload);
// }

// events.on('pickup', handlePickup);

setInterval( () => {
  let pickupTime = Math.ceil(Math.random() * 5000);
  let customOrder = new CustomOrder();
  orderQueue.push(customOrder);
  // events.emit('pickup', {event: 'pickup', order:customOrder, time:pickupTime, numberOfOrdersLeft: orderQueue.length});
  console.log('================ PICKUP FIRED ==================', {event: 'pickup', order:customOrder, time:pickupTime, numberOfOrdersLeft: orderQueue.length});
  events.emit('pickup', customOrder);
}, Math.ceil(Math.random() * 5000));

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
  this.storename = process.env.STORE_NAME,
  this.orderId = faker.datatype.uuid(),
  this.customerName = faker.name.findName(),
  // this.customerAddressStreet = faker.Address.street_address(),
  this.customerAddressCity = faker.address.city(),
  // this.customerAddressZIP = faker.address.postalcode(),
  this.customerAddressState = faker.address.state(),
  // this.customerPhoneNumber = faker.Phone.EnUs.phone(),
  this.customerEmail = faker.internet.email()
};

module.exports = orderQueue;
