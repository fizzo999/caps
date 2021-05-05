'use strict';

require('dotenv').config();
// const { Socket } = require('socket.io-client');
const io = require('socket.io-client');

const HOST = process.env.HOST || 'http://localhost:3000';

const brainConnection = io.connect(HOST);
const digestiveConnection = io.connect(`${HOST}/digestive-system`);
const healthConnection = io.connect(`${HOST}/health-system`);

brainConnection.emit('light', {level: 5});
brainConnection.emit('light', {level: 15});
brainConnection.emit('light', {level: 25});

brainConnection.emit('smell', {smellLevel: 'aweful'});
brainConnection.emit('smell', {smellLevel: 'fresh and clean'});
brainConnection.emit('smell', {smellLevel: 'a meadow full of wildflowers, roses and lilac'});

digestiveConnection.emit('eat', {food: 'fresh salad with chopped apple and nuts and avocado'});
digestiveConnection.emit('eat', {food: 'fresh salad with avocado and chicken'});
digestiveConnection.emit('eat', {food: 'cobb salad'});

healthConnection.emit('sick', {problem: 'just had to remember: I am always healthy. I am always well'});
healthConnection.emit('sick', {problem: 'it worked - I am feeling so much better. As always MIND first'});
