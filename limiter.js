const uuid = require('uuid/v4');

module.exports.rate = function(redis, cb) {

  redis.zadd('rate-limiter', Date.now(), uuid());
  redis.zcount('rate-limiter', Date.now() - 1000, Date.now(), function(err, res) {
    if (err) {
      cb(err);
    } else {
      redis.zremrangebyscore('rate-limiter', 0, Date.now() - 1000);
      if (res > 5) {
        cb(undefined, false);
      } else {
        cb(undefined, true);
      }
    }
  });

};
