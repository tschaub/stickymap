var merc = require('./merc');
var xyz = require('./xyz');

module.exports = function(tileSets, config) {
  var bbox = config.bbox;
  var resolution = config.resolution;

  var canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;

  var context = canvas.getContext('2d');

  if (config.clip) {
    var transform = [
      1 / resolution,
      0,
      0,
      -1 / resolution,
      -bbox[0] / resolution,
      bbox[3] / resolution
    ];
    setClipPath(context, config.clip, transform);
  }

  var z = xyz.getZ(resolution);
  var tileResolution = xyz.getResolution(z);
  var scale = tileResolution / resolution;
  context.scale(scale, scale);

  var offsetX = (bbox[0] + merc.EDGE) / tileResolution;
  var offsetY = (merc.EDGE - bbox[3]) / tileResolution;
  context.translate(-offsetX, -offsetY);

  for (var i = 0, ii = tileSets.length; i < ii; ++i) {
    var tileSet = tileSets[i];
    for (var j = 0, jj = tileSet.length; j < jj; ++j) {
      var tile = tileSet[j];
      var dx = tile.x * xyz.SIZE;
      var dy = tile.y * xyz.SIZE;
      context.drawImage(tile.image, dx, dy);
    }
  }

  return canvas;
};

function setClipPath(context, obj, transform) {
  context.beginPath();
  switch (obj.type) {
    case 'Polygon':
      setPolygonPath(context, obj.coordinates, transform);
      break;
    case 'MultiPolygon':
      setMultiPolygonPath(context, obj.coordinates, transform);
      break;
    default:
      throw new Error('Unsupported type for clip path: ' + obj.type);
  }
  context.clip();
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
