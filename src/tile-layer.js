var Tile = require('./tile');
var merc = require('./merc');
var xyz = require('./xyz');

function pick(urls, x, y, z) {
  var hash = (x << z) + y;
  return urls[hash % urls.length];
}

function TileLayer(config) {
  this.bbox = config.bbox;
  this.resolution = config.resolution;
  this.context = config.context;
  this.urls = config.urls;
  this.onTileLoad = config.onTileLoad;
  this.onLoad = config.onLoad;
  this.loadedTiles = [];
}

TileLayer.prototype.load = function() {
  var z = xyz.getZ(this.resolution);
  var range = xyz.getRange(this.bbox, z);
  this.loading = 0;
  var handleTileLoad = this.handleTileLoad.bind(this);
  for (var x = range.minX; x <= range.maxX; ++x) {
    for (var y = range.minY; y <= range.maxY; ++y) {
      var url = pick(this.urls, x, y, z);
      url = url.replace('{x}', x).replace('{y}', y).replace('{z}', z);
      ++this.loading;
      var tile = new Tile(url, x, y, z);
      tile.load(handleTileLoad);
    }
  }
};

TileLayer.prototype.handleTileLoad = function(err, tile) {
  --this.loading;
  if (tile) {
    this.loadedTiles.push(tile);
    this.onTileLoad();
  }
  if (!this.loading && this.onLoad) {
    this.onLoad();
  }
};

TileLayer.prototype.render = function() {
  var numLoadedTiles = this.loadedTiles.length;
  if (!numLoadedTiles) {
    return;
  }
  var z = xyz.getZ(this.resolution);
  var tileResolution = xyz.getResolution(z);
  var scale = tileResolution / this.resolution;
  this.context.save();
  this.context.scale(scale, scale);

  var offsetX = (this.bbox[0] + merc.EDGE) / tileResolution;
  var offsetY = (merc.EDGE - this.bbox[3]) / tileResolution;
  this.context.translate(-offsetX, -offsetY);

  for (var i = 0; i < numLoadedTiles; ++i) {
    var tile = this.loadedTiles[i];
    var dx = tile.x * xyz.SIZE;
    var dy = tile.y * xyz.SIZE;
    this.context.drawImage(tile.image, dx, dy);
  }
  this.context.restore();
};

module.exports = TileLayer;
