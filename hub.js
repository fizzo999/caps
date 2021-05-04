'use strict';

// hub.js manages the event queue and live handling of all inbound events. Clients (stores and drivers) never talk to each other directly, they work through the hub, like a switchboard

const events = require('./lib/events');
require('./apps/vendor.js');
require('./apps/driver.js');

function handleEvent(payload) {
  console.log(`EVENT: ${JSON.stringify(payload)}`);
}

events.on('pickup', handleEvent);
events.on('in-transit', handleEvent);
events.on('delivery', handleEvent);

module.exports = handleEvent();