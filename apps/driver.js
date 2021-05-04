'use strict';

const events = require('../lib/events.js');
const orderQueue = require('./vendor.js');

// Drivers Module
// Monitor the system for events …
// On the ‘pickup’ event …
// Wait 1 second
// Log “DRIVER: picked up [ORDER_ID]” to the console.
// Emit an ‘in-transit’ event with the payload you received
// Wait 3 seconds
// Log “delivered” to the console
// Emit a ‘delivered’ event with the same payload

// function handleDriverPickup(payload) {
//   console.log('================ DriverPickup FIRED ==================', payload);
// }

// events.on('pickup', handleDriverPickup);

function handleDriverPickup(payload) {
  setTimeout( () => {
    // console.log('================ DriverPickup FIRED ==================', payload);
    console.log(`===================DRIVER: pick up order ${payload.orderId}`);
    events.emit('in-transit', payload);
  }, 2000);

  setTimeout( () => {
    console.log('===================DELIVERED SUCCESSFULLY================', payload);
    events.emit('delivery', payload);
  }, 3000);
}

events.on('pickup', handleDriverPickup);


module.exports = handleDriverPickup();