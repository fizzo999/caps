'use strict';

require('dotenv').config();
// const { Socket } = require('socket.io-client');
const io = require('socket.io-client');

const HOST = process.env.HOST || 'http://localhost:3000';

// const brainConnection = io.connect(HOST);
const digestiveConnection = io.connect(`${HOST}/digestive-system`);

digestiveConnection.emit('eat', {food: 'a healthy wholesome salad with lots of arugula and chopped nuts'});
digestiveConnection.emit('eat', {food: 'a bowl of brown rice with yams and beets'});
