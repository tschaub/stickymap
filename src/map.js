var geo = require('./geo');
var load = require('./load');
var merc = require('./merc');
var render = require('./render');
var util = require('./util');

function StickyMap(config) {
  var bbox;
  if (config.fit) {
    if (Array.isArray(config.fit)) {
      bbox = config.fit;
    } else {
      bbox = geo.getBbox(config.fit);
    }
  } else {
    if (config.clip) {
      bbox = geo.getBbox(config.clip);
    } else {
      throw new Error('Map must have fit or clip');
    }
  }

  var dimensions = util.resolveDimensions({
    bbox: merc.forward(bbox),
    width: config.width,
    height: config.height
  });

  var canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  this._resolution = dimensions.resolution;
  this._bbox = dimensions.bbox;
  if (config.clip) {
    this._clip = geo.transform(config.clip);
  }
  this._layers = config.layers;

  this.canvas = canvas;
}

StickyMap.prototype.load = function() {
  var bbox = this._bbox;
  var resolution = this._resolution;

  var renderConfig = {
    bbox: bbox,
    resolution: resolution,
    canvas: this.canvas,
    clip: this._clip
  };

  return Promise.all(this._layers.map(function(layer) {
    return load(layer, bbox, resolution);
  })).then(function(tileSets) {
    var canvas = render(tileSets, renderConfig);
    return canvas;
  });
};

module.exports = StickyMap;
