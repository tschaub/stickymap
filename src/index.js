var StickyMap = require('./map');

module.exports = function(config) {
  var map = new StickyMap(config);
  map.load();
  return map.canvas;
};
