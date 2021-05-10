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
  ['acme-widgets']: {
    pickup: {},
    inTransit: {},
    delivered: {}
  },
  ['1-206-flowers']: {
    pickup: {},
    inTransit: {},
    delivered: {}
  },
  driverID_6054: {
    pickup: {},
    inTransit: {},
    delivered: {}
  },
  ['onlineOrder']: {
    pickup: {},
    inTransit: {},
    delivered: {}
  },

};

// io.on('connection', socket => {
//   console.log('User/Socket connected to general server: ', socket.id);
// });

caps.on('connection', socket => {
  joinAndConfirm (socket, 'CAPS');

  socket.on('pickup', (payload) => {
    helperLoggerFunction('pickup', payload);
  });

  socket.on('inTransit', payload => {
    helperLoggerFunction('inTransit', payload);
  });

  socket.on('delivered', payload => {
    helperLoggerFunction('delivered', payload);
  });

});

function helperLoggerFunction (event, payload) {
  let time = new Date();
  console.log(`+++++++++ ${event.toUpperCase()} +++++++++`, time, payload);
  // all clients in the pickup namespace will see this - emit to all in this namespace
  caps.emit(event, payload);
  // setting up saving of all incoming messages to queue
  let id = uuid();
  let capsMsgObjSmall = {
    msgTime: time,
    payload: payload
  };
  let capsMsgObjlarge = {
    id: id,
    event: event,
    msgTime: time,
    client_id: payload.order.storename,
    payload: payload
  };
  caps.emit('send', capsMsgObjlarge);
  // save info to queue

  queue[payload.order.storename][event][id] = capsMsgObjSmall;
}

// setting up special communication with ONLY the VENDOR NameSpace
vendor.on('connection', socket => {
  joinAndConfirm (socket, 'VENDOR');
  socket.on('received', payload => {
    receivedAndDelete (payload);
  });
  socket.on('getAll', payload => {
  getTheMessagesFromTheQueue (payload);
  });
});


// setting up special communication with ONLY the DRIVER NameSpace
driver.on('connection', socket => {
  joinAndConfirm (socket, 'DRIVER');
  socket.on('received', payload => {
    receivedAndDelete (payload);
  });
  socket.on('getAll', payload => {
    setTimeout(() => {
      getTheMessagesFromTheQueue (payload);
    }, 10000);
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

function receivedAndDelete (payload) {
  console.log('THEY GOT THE MESSAGE !!!!!!!!!', payload);
  console.log('BEFORE', queue[payload.client_id][payload.event]);
  delete queue[payload.client_id][payload.event][payload.id];
  console.log('AFTER', queue[payload.client_id][payload.event]);
}


function getTheMessagesFromTheQueue (payload) {
  setTimeout(() => {
  console.log('~~~~~~~~~~~~~~~ HERE IS THE PAYLOAD ~~~~~~~~~~', payload.client_id, payload.event, payload);
  if (queue[payload.client_id][payload.event]) {
    // Object.keys(queue[payload.client_id][payload.event].forEach(id => {
    //   socket.emit('getAllMessages', {id, payload: queue[payload.client_id][payload.event][id] });
    // }));
    console.log(queue[payload.client_id][payload.event]);
  } else {
    console.log('===+++=== no data in the queue yet ===+++===');
  }
  }, 10000);
}

