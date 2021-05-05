'use strict';

// const events = require('./lib/queue.js');

//  Main Hub Application
// Manages the state of every package (ready for pickup, in transit, delivered, etc)
// Logs every event to the console with a timestamp and the event payload
// i.e. “EVENT {}”;
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const caps = io.of('/caps');
const vendor = io.of('/vendor');
const driver = io.of('/driver');

io.on('connection', socket => {
  console.log('Socket connected: ', socket.id);
});

caps.on('connection', socket => {

  console.log('Socket connected: ', socket.id);

  socket.on('pickup', (payload) => {
    // all clients in the pickup namespace will see this
    // emit to all in this namespace
    let time = new Date();
    console.log('EVENT: pickup', time, payload);
    caps.emit('pickup', payload);
  });
    // in-transit and delivered supposed to be heard by right vendor ONLY
  socket.on('in-transit', payload => {
    let time = new Date();
    console.log('EVENT: in-transit', time, payload);
    caps.emit('in-transit', payload);
  });

  socket.on('delivered', payload => {
    let time = new Date();
    console.log('EVENT: delivered', time, payload);
    caps.emit('delivered', payload);
  });

});

