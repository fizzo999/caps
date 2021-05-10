'use strict';

require('dotenv').config();
const PORT = process.env.PORT_SERVER || 3500;
const io = require('socket.io')(PORT);
const uuid = require('uuid').v4;

const hub = io.of('/hub');

const allLogons = [];
const queue = {};

hub.on('connection', socket => {
  console.log('User/Socket connected to general server: ', socket.id);
  socket.on('join', room => {
    console.log(`CLIENT: ${socket.id} just connected to room: ${room}`);
    let clientObj = {
      time: new Date(),
      client: socket.id,
      room: room,
      nameSpace: `========== HUB ===========`
    };
    allLogons.push(clientObj);
    console.log('');
    console.log('======= HERE IS THE LIST OF LOGON`s ====== :', allLogons);
    socket.join(room);
    socket.emit('joinConfirmed', room);
    if(!queue.hasOwnProperty(room)){
      queue[room] = {
        'newOrder': {},
        'received': {}
      };
    }
  });

  socket.on('newOrder', payload => {
    let id = uuid();
    queue[payload.store]['newOrder'][id] = payload;
    console.log('current order queue', queue[payload.store]);
    hub.emit('order', {id, payload});
    // socket.emit('added');
  });

  socket.on('getAll', payload =>{
    console.log('++++++++++++++++++++',payload);
    Object.keys(queue[payload.store][payload.event]).forEach(id => {
      hub.emit('order', {id , payload: queue[payload.store][payload.event][id]} );
    });
  });

  socket.on('received', ({ id, payload }) =>{
    delete queue[payload.store]['newOrder'][id];
    queue[payload.store]['received'][id] = payload;
    console.log('updated queue:', queue[payload.store]);
  });

  socket.on('delivered', payload =>{
    console.log('Your order has been delivered');
    hub.emit('send', payload);
    
  });
});