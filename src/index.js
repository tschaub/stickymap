const StickyMap = require('./map');

module.exports = function(config) {
  const map = new StickyMap(config);
  map.load();
  return map.canvas;
};
