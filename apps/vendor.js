'use strict';

const faker = require('faker');
// const events = require('../lib/events.js');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const io = require('socket.io-client');
const socket = io.connect(`${SERVER_URL}/caps`);

const STORE_ID = process.env.STORE_ID || '1-800-flowerZ';
const orderQueue = [];

// Emit that message to the CAPS server with an event called pickup
// Listen for the delivered event coming in from the CAPS server
// Log “thank you for delivering payload.id” to the console

socket.emit('join', STORE_ID);


setInterval( () => {
  let customOrder = new CustomOrder();
  orderQueue.push(customOrder);
  let obj = {order:customOrder, numberOfOrdersLeft: orderQueue.length};
  socket.emit('pickup', obj);
  console.log('================ PICKUP FIRED ==================', obj);
}, 5000);


socket.on('delivered', payload => {
  console.log(`thank you for delivering ${payload.order.orderId} from all of us at ${STORE_ID}`);
});


function CustomOrder() {
  this.timeStamp = new Date(),
  this.storename = process.env.STORE_ID,
  this.orderId = faker.datatype.uuid(),
  this.customerName = faker.name.findName(),
  // this.customerAddressStreet = faker.Address.streetAddress(),
  this.customerAddressCity = faker.address.city(),
  // this.customerAddressZIP = faker.address.zip(),
  this.customerAddressState = faker.address.state(),
  // this.customerPhoneNumber = faker.Phone.EnUs.phone(),
  this.customerEmail = faker.internet.email()
}

module.exports = orderQueue;
