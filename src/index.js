var StickyMap = require('./map');

module.exports = function(config) {
  var map = new StickyMap(config);
  map.load().then(function() {
    if (config.callback) {
      config.callback();
    }
  }, function(err) {
    if (config.callback) {
      config.callback(err);
    }
  });
  return map.canvas;
};
