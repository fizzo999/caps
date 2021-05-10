'use strict';

require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const io = require('socket.io-client');
const capsSocket = io.connect(`${SERVER_URL}/caps`);
const driverSocket = io.connect(`${SERVER_URL}/driver`);
const DRIVER_ID = process.env.DRIVER_ID || '===== UPS 001 TONY ====';
const driverSideMessageQueue = [];
let intNumber = 1;

// extra step - have individual driver layout, to where this driverID_6054 joins a room personalized for him
capsSocket.emit('join', DRIVER_ID);
capsSocket.on('joinConfirmed', room => {
  console.log('YES WE JOINED THE ROOM: ', room);
});

capsSocket.on('pickup', payload => {

  setTimeout(() => {
    console.log('================ DriverPickup FIRED ==================');
    console.log(`DRIVER: picked up [ORDER_ID]: ${payload.order.orderId}`);
    capsSocket.emit('inTransit', payload);
  }, 2000);

  setTimeout(() => {
    console.log('++++++++++++++++ DriverDelivered FIRED ++++++++++++++++');
    console.log(`DRIVER: delivered [ORDER_ID]: ${payload.order.orderId}`);
    capsSocket.emit('delivered', payload);
  }, 4000);
});

// DRIVER ONLY SPECIFIC NAME_SPACE COMMUNICATION
driverSocket.emit('join', DRIVER_ID);
driverSocket.on('joinConfirmed', room => {
  console.log('==================== WE JOINED =====================', room);
});

capsSocket.on('send', payload => {
  driverSideMessageQueue.push(payload);
  console.log('HERE IS THE DRIVER RUNNING QUEUE Length', driverSideMessageQueue.length);
  driverSocket.emit('received', payload);
});

let getAllMessages = {
  event:'pickup',
  client_id: DRIVER_ID
};

setTimeout(() => {
  driverSocket.emit('getAll', getAllMessages);
}, 10000);


driverSocket.on('receiveAllMessages', payload => {
  console.log('===== HERE ARE THE OLD MESSAGES YOU MISSED ====', payload);
  if(vendorSideMessageQueue.contains(payload.id)) {
    console.log('already got that one ====');
  } else {
    vendorSideMessageQueue.push(payload);
  }  
  Object.keys(payload.id).forEach(id => {
    driverSocket.emit('confirmReceivedAll', {id, payload: payload})
  });
});



