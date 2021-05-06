'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT);

const caps = io.of('/caps');
const vendor = io.of('/vendor');
const driver = io.of('/driver');

io.on('connection', socket => {
  console.log('User/Socket connected to general server: ', socket.id);
});

caps.on('connection', socket => {

  console.log('User/Socket connected to caps NameSpace: ', socket.id);

  socket.on('join', room => {
    // console.log('================TEST===========', socket.NameSpace);
    console.log(`CLIENT: ${socket.id} just connected to ${room}`);
    socket.join(room);
  });

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

// vendor.on('connection', socket => {
//   socket.on('join', room => {
//     console.log(`CLIENT: ${socket.id} just connected to ${room}`);
//   });
// });

// POST API route for handling pickup
// app.post('/pickup', (req, res) => {
  // test/mock delivery object if no delivery is actually being sent via the body
  // let delivery = req.body || {
  //   store: '1-206-flowers',
  //   orderID: faker.random.uuid(),
  //   customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
  //   address: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
  // };
  // emit a pickup event (managed in the server hub/caps hub)
  // socket.emit('pickup', delivery);
  // send a message to the client letting them know a pickup is scheduled
  // res.status(200).send('scheduled');
// });

