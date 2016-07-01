var merc = require('./merc');
var util = require('./util');

function StickyMap(config) {
  if (!config.bbox) {
    throw new Error('Map must have a bbox');
  }
  var dimensions = util.resolveDimensions({
    bbox: merc.forward(config.bbox),
    width: config.width,
    height: config.height
  });

  this.width = dimensions.width;
  this.height = dimensions.height;
  this._bbox = dimensions.bbox;
}

module.exports = StickyMap;
