'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const faker = require('faker');
const io = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

const socket = io.connect(`${SERVER_URL}/caps`);
const app = express();
const PORT2 = process.env.PORT2 || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

socket.on('connection', socket => {
  console.log('============HURRAY WE ARE CONNECTED TO==============', socket.id);

});

app.post('/pickup', (req, res) => {
  let package2Bprocessed = req.body || new CustomOrder;
  console.log('============================== package2Bprocessed', package2Bprocessed);

  socket.emit('pickup', package2Bprocessed);
  // res.status(200).send('EVENT: pickup scheduled', package2Bprocessed.orderID || 'no order number is available at this time');
  res.status(200).send('EVENT: pickup scheduled', package2Bprocessed);
});

app.get('/', (req, res) => {
  res.send('it works YAY ===========================');
});

app.use('*', (req, res) => res.status(404).send('sorry that route does NOT exist'));
app.use((err, req, res) => res.status(500).send('there was an error'));

function CustomOrder() {
  this.timeStamp = new Date(),
  this.storename = process.env.STORE_ID,
  this.orderId = faker.datatype.uuid(),
  this.customerName = faker.name.findName(),
  this.customerAddressStreet = faker.Address.streetAddress(),
  this.customerAddressCity = faker.address.city(),
  // this.customerAddressZIP = faker.address.zip(),
  this.customerAddressState = faker.address.state(),
  this.customerPhoneNumber = faker.phone_number(),
  this.customerEmail = faker.internet.email()
}
setTimeout(() => {
  console.log('=============== DriverDelivered FIRED =================');
  console.log(`DRIVER: delivered [ORDER_ID]:`);
  socket.emit('delivered');
  app.listen(PORT2, () => console.log(`API SERVER up at ${PORT2}`));

}, 4000);

