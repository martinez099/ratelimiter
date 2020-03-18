const uuid = require('uuid/v4');

const KEY_NAME = 'rate-limiter:' + uuid();
const MAX_REQ = 5;
const PER_MS = 1000;

module.exports = function(redis, cb) {

  var now = Date.now()

  redis.multi([
    ['zadd', KEY_NAME, now, uuid()],                 // record current request in  a sorted set
    ['zremrangebyscore', KEY_NAME, 0, now - PER_MS], // remove outdated requests, i.e. older than PER_MS milliseconds
    ['zcard', KEY_NAME]                              // count number of remaining requests in the sorted set
  ]).exec(function(error, results) {
    if (error) {
      cb(error);
    } else {
      if (results[2] > MAX_REQ) {
        cb(undefined, false);                        // return false if more than MAX_REQ requests
      } else {
        cb(undefined, true);                         // return true if less or equal than MAX_REQ requests
      }
    }
  })

};
