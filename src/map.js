var TileLayer = require('./tile-layer');
var UntiledLayer = require('./untiled-layer');
var geo = require('./geo');
var merc = require('./merc');
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

  var context = canvas.getContext('2d');

  if (config.clip) {
    var transform = [
      1 / dimensions.resolution,
      0,
      0,
      -1 / dimensions.resolution,
      -dimensions.bbox[0] / dimensions.resolution,
      dimensions.bbox[3] / dimensions.resolution
    ];
    setClipPath(context, geo.transform(config.clip), transform);
  }

  var render = this._render.bind(this);

  this._layers = config.layers.map(function(layerConfig) {
    if (layerConfig.untiled) {
      return new UntiledLayer({
        context: context,
        resolution: dimensions.resolution,
        bbox: dimensions.bbox,
        imageBbox: layerConfig.bbox ? merc.forward(layerConfig.bbox) : null,
        url: layerConfig.url,
        onLoad: render
      });
    } else {
      var bbox = dimensions.bbox;
      var layerBbox = layerConfig.bbox;
      if (layerBbox) {
        if (!Array.isArray(layerBbox)) {
          layerBbox = geo.getBbox(layerBbox);
        }
      }
      return new TileLayer({
        context: context,
        resolution: dimensions.resolution,
        bbox: bbox,
        layerBbox: layerBbox ? merc.forward(layerBbox) : bbox,
        urls: layerConfig.urls || [layerConfig.url],
        onTileLoad: render
      });
    }
  });

  this.canvas = canvas;
}

StickyMap.prototype.load = function() {
  this._layers.forEach(function(layer) {
    layer.load();
  });
};

StickyMap.prototype._render = function() {
  this._layers.forEach(function(layer) {
    layer.render();
  });
};

function setClipPath(context, obj, transform) {
  context.beginPath();
  setGeoClipPath(context, obj, transform);
  context.clip();
}

function setGeoClipPath(context, obj, transform) {
  switch (obj.type) {
    case 'Polygon':
      setPolygonPath(context, obj.coordinates, transform);
      break;
    case 'MultiPolygon':
      setMultiPolygonPath(context, obj.coordinates, transform);
      break;
    case 'GeometryCollection':
      obj.geometries.forEach(function(geometry) {
        setGeoClipPath(context, geometry, transform);
      });
      break;
    case 'Feature':
      setGeoClipPath(context, obj.geometry, transform);
      break;
    case 'FeatureCollection':
      obj.features.forEach(function(feature) {
        setGeoClipPath(context, feature.geometry, transform);
      });
      break;
    default:
      // do nothing
  }
}

function setPolygonPath(context, coordinates, transform) {
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    var ring = coordinates[i];
    for (var j = 0, jj = ring.length; j < jj; ++j) {
      var coord = ring[j];
      if (j === 0) {
        context.moveTo.apply(context, applyTransform(transform, coord));
      } else {
        context.lineTo.apply(context, applyTransform(transform, coord));
      }
    }
  }
}

function setMultiPolygonPath(context, coordinates, transform) {
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    setPolygonPath(context, coordinates[i], transform);
  }
}

function applyTransform(transform, coordinate) {
  var x = coordinate[0];
  var y = coordinate[1];
  return [
    transform[0] * x + transform[2] * y + transform[4],
    transform[1] * x + transform[3] * y + transform[5]
  ];
}

module.exports = StickyMap;
