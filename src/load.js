var loadTile = require('./tile').load;
var xyz = require('./xyz');

function pick(urls, x, y, z) {
  var hash = (x << z) + y;
  return urls[hash % urls.length];
}

module.exports = function(layer, bbox, resolution) {
  var z = xyz.getZ(resolution);
  var range = xyz.getRange(bbox, z);
  var loaders = [];
  for (var x = range.minX; x <= range.maxX; ++x) {
    for (var y = range.minY; y <= range.maxY; ++y) {
      var url;
      if (layer.urls) {
        url = pick(layer.urls, x, y, z);
      } else {
        url = layer.url;
      }
      url = url.replace('{x}', x).replace('{y}', y).replace('{z}', z);
      loaders.push(loadTile(url, x, y, z));
    }
  }
  return Promise.all(loaders);
};
