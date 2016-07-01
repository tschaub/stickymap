var loadTile = require('./tile').load;
var xyz = require('./xyz');

module.exports = function(layer, bbox, resolution) {
  var z = xyz.getZ(resolution);
  var range = xyz.getRange(bbox, z);
  var loaders = [];
  for (var x = range.minX; x <= range.maxX; ++x) {
    for (var y = range.minY; y <= range.maxY; ++y) {
      var url = layer.url.replace('{x}', x).replace('{y}', y).replace('{z}', z);
      loaders.push(loadTile(url, x, y, z));
    }
  }
  return Promise.all(loaders);
};
