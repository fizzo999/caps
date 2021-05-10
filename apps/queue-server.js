'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);
const caps = io.of('/caps');
const vendor = io.of('/vendor');
const driver = io.of('/driver');
const uuid = require('uuid').v4;
const allLogons = [];

const queue = {
  '1-206-flowers': {
    pickup: {},
    inTransit: {},
    delivered: {}
  },
  'acme-widgets': {
    pickup: {},
    inTransit: {},
    delivered: {}
  }
};

caps.on('connection', socket => {
  joinAndConfirm (socket, 'CAPS');
  socket.on('received', payload => {
    if (payload.client_id && payload.event && payload.id) {
      delete queue[payload.client_id][payload.event][payload.id];
      console.log('we deleted the message from our storage Queue');
    }
  });

  socket.on('getAll', payload => {
    Object.keys(queue[payload.client_id][payload.event]).forEach(id => {
      vendor.emit('receiveAllMessages', {id, payload: payload});
      driver.emit('receiveAllMessages', {id, payload: payload});
    });
  });

  socket.on('delivered', payload => {
    let id = uuid();
    let capsMsgObjSmall = {
      id: id,
      msgTime: new Date(),
      payload: payload
    };
    socket.emit('send', capsMsgObjSmall);
    // save info to queue
    queue[payload.order.storename][event][id] = capsMsgObjSmall;
  });

});

vendor.on('connection', socket => {
  joinAndConfirm (socket, 'VENDOR');
  socket.on('confirmReceivedAll', payload => {
    if (payload.client_id && payload.event && payload.id) {
      delete queue[payload.client_id][payload.event][payload.id];
      console.log('we deleted the message from our storage Queue');
    } else {
      console.log('something went wrong with confirmRecaivedAll');
    }
  });
});

driver.on('connection', socket => {
  joinAndConfirm (socket, 'DRIVER');
  socket.on('confirmReceivedAll', payload => {
    if (payload.client_id && payload.event && payload.id) {
      delete queue[payload.client_id][payload.event][payload.id];
      console.log('we deleted the message from our storage Queue');
    } else {
      console.log('something went wrong with confirmRecaivedAll');
    }
  });
});

function joinAndConfirm (socket, nameSpace) {
  console.log('User/Socket connected to general server: ', socket.id);
  socket.on('join', room => {
    console.log(`CLIENT: ${socket.id} just connected to room: ${room}`);
    let clientObj = {
      time: new Date(),
      client: socket.id,
      room: room,
      nameSpace: `========== ${nameSpace} ===========`
    };
    allLogons.push(clientObj);
    console.log('');
    console.log('======= HERE IS THE LIST OF LOGON`s ====== :', allLogons);
    socket.join(room);
    socket.emit('joinConfirmed', room);
  });
}