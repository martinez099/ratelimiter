const limiter = require('./limiter.js');

module.exports = function(app, redis) {

  app.get('/', function(req, res) {
    limiter.rate(redis, function(error, result) {
      if (error) {
        throw error;
      }
      if (result) {
        res.render('index.ejs');
      } else {
        res.render('limited.ejs');
      }
    }); 
  });

};
