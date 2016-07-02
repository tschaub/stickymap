var merc = require('./merc');
var xyz = require('./xyz');

module.exports = function(tileSets, bbox, resolution, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');

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
