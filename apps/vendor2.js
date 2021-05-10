'use strict';

const faker = require('faker');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const io = require('socket.io-client');
const capsSocket = io.connect(`${SERVER_URL}/caps`);
const vendorSocket = io.connect(`${SERVER_URL}/vendor`);

const VENDOR2_ID = process.env.VENDOR2_ID || 'acme-widgets';
const orderQueue = [];
const vendorSideMessageQueue = [];

capsSocket.emit('join', VENDOR2_ID);
capsSocket.on('joinConfirmed', room => {
  console.log('YES WE JOINED THE ROOM: ', room);
});
vendorSocket.emit('join', VENDOR2_ID);

capsSocket.on('send', payload => {
  vendorSideMessageQueue.push(payload);
  console.log('HERE IS THE VENDOR RUNNING QUEUE Length', vendorSideMessageQueue.length);
  vendorSocket.emit('received', payload);
});

let getAllMessages = {
  event:'pickup',
  client_id: VENDOR2_ID
};

vendorSocket.emit('getAll', getAllMessages);

vendorSocket.on('receiveAllMessages', payload => {
  console.log('===== HERE ARE THE OLD pickup MESSAGES YOU MISSED ====', payload);
  if(vendorSideMessageQueue.contains(payload.id)) {
    console.log('already got that one ====');
  } else {
    vendorSideMessageQueue.push(payload);
  }
  Object.keys(payload.id).forEach(id => {
    vendorSocket.emit('confirmReceivedAll', {id, payload: payload})
  });
});


generateNewOrder('acme-widgets');

capsSocket.on('delivered', payload => {
  console.log(`thank you for delivering ${payload.order.orderId} from all of us at ${payload.order.client_id}`);
});

function generateNewOrder(storeName) {
  setInterval( () => {
    let customOrder = new CustomOrder(storeName);
    orderQueue.push(customOrder);
    let obj = {order:customOrder, numberOfOrdersLeft: orderQueue.length};
    capsSocket.emit('pickup', obj);
    console.log('================ PICKUP FIRED ==================', obj);
  }, 5000);

}

function CustomOrder(storeName) {
  this.orderCreatedOn = new Date(),
  this.storename = storeName,
  this.orderId = faker.datatype.uuid(),
  this.Name = faker.name.findName(),
  this.Street = faker.address.streetAddress(),
  this.City = faker.address.city(),
  this.ZIP = faker.address.zipCode(),
  this.State = faker.address.state(),
  this.PhoneNumber = faker.phone.phoneNumber(),
  this.customerEmail = faker.internet.email()
}

module.exports = orderQueue;
