var load = require('./load');
var merc = require('./merc');
var render = require('./render');
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

  this._resolution = dimensions.resolution;
  this._bbox = dimensions.bbox;

  this.layers = config.layers;
}

StickyMap.prototype.load = function() {
  var bbox = this._bbox;
  var resolution = this._resolution;

  return Promise.all(this.layers.map(function(layer) {
    return load(layer, bbox, resolution);
  })).then(function(tileSets) {
    return render(tileSets);
  });
};

module.exports = StickyMap;
