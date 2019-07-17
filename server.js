/*
* Copyright © 2019 Redis Labs, Inc.
* This program should be used for demo puposes only. The software
* is provided “as is”, without warranty of any kind.
*
* Usage: node server.js <HTTP port> <Redis port>
* Example: node server.js 3000 6379
*/

const app = require('express')();
const httpServer = require('http').Server(app);
const redis = require('redis');

const limiter = require('./limiter.js');

const httpPort = process.argv[2] || 3000;
const redisPort = process.argv[3] || 6379;

// set up Redis
redisClient = redis.createClient({
  port : redisPort,
  host : 'localhost'
});

// set up route
app.get('/', function(req, res) {
  limiter(redisClient, function(error, result) {
    if (error) {
      throw error;
    }
    if (result) {
      res.status(200).send('All good, go ahead.')
    } else {
      res.status(429).send('You are too fast, slow down!')
    }
  }); 
});

// start the HTTP server
httpServer.listen(httpPort, function(error, result) {
  if (error) {
    throw error;
  } else {
    console.log('HTTP listening on :' + httpPort);
  }
});
