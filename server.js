/*
* Copyright © 2019 Redis Labs, Inc.
* This program should be used for demo puposes only. The software
* is provided “as is”, without warranty of any kind.
*
* Usage: node server.js <HTTP port> <Redis port>
* Example: node server.js 3000 6379
*/

const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const redis = require('redis');

const httpPort = process.argv[2] || 3000;
const redisPort = process.argv[3] || 6379;

// Redis client to query and publish to a channel
const redisClient = redis.createClient({
  port : redisPort,
  host : 'localhost'
});

// All static files are under $HOME/public
app.use(express.static('public'))
app.set('view engine', 'ejs');
require('./routes.js')(app, redisClient);

// Start the HTTP server
httpServer.listen(httpPort, function(){
  console.log('HTTP listening on :' + httpPort);
});
