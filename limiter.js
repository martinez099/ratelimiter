const uuid = require('uuid/v4');

const KEY_NAME = 'rate-limiter:' + uuid();
const MAX_REQ = 5;
const PER_MS = 1000;

module.exports = function(redis, cb) {

  // record current request
  redis.zadd(KEY_NAME, Date.now(), uuid());

  // count number of requests in the last PER_MS milliseconds
  redis.zcount(KEY_NAME, Date.now() - PER_MS, Date.now(), function(error, result) {
    if (error) {
      cb(error);
    } else {

      // remove outdated requests, i.e. older than PER_MS milliseconds
      redis.zremrangebyscore(KEY_NAME, 0, Date.now() - PER_MS);

      // deny access if more than MAX_REQ requests
      if (result > MAX_REQ) {
        cb(undefined, false);
      } else {
        cb(undefined, true);
      }
    }
  });

};
