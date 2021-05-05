'use strict';

const PORT = process.env.PORT || 3000;
require('dotenv').config();
const io = require('socket.io')(PORT);

const guts = io.of('/digestive-system');
const health = io.of('/health-system');

io.on('connection', socket => {
  console.log('client: ', socket.id);
  
  socket.broadcast.emit('eat', {data: 'this is supposed to fire in the client'});

  socket.on('light', payload => {
    console.log('HERE IS THE CONSOLE>LOG FOR LIGHT EVENT', payload);
    io.sockets.emit('light', {data: 'man this is bright', payload: payload});
    // setTimeout( ()=> {
    //   socket.broadcast.emit('light', {data: 'it`s dawn and the sun is rising', payload: payload});
    // }, 2000);
  });

  socket.on('eat', payload => {
    console.log('EAT EVENT FIRED: ', payload);
  });
});


guts.on('connection', socket => {
  socket.on('eat', payload => {
    console.log('eat event fired', payload);
  });
});

health.on('connection', socket => {
  socket.on('sick', payload => {
    console.log('sick', payload);
  });
});



