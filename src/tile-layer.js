var Tile = require('./tile');
var TileLayerLoadError = require('./errors').TileLayerLoadError;
var bbox = require('./bbox');
var merc = require('./merc');
var xyz = require('./xyz');

function TileLayer(config) {
  this.id = config.id;
  this.bbox = config.bbox;
  this.layerBbox = config.layerBbox;
  this.resolution = config.resolution;
  this.context = config.context;
  this.urls = config.urls;
  this.onTileLoad = config.onTileLoad;
  this.onLoad = config.onLoad;
  this.maxZoom = config.maxZoom;
  this.loadedTiles = [];
  this.errors = [];
}

TileLayer.prototype.load = function() {
  var z = xyz.getZ(this.resolution);
  if (!isNaN(this.maxZoom) && z > this.maxZoom) {
    z = this.maxZoom;
  }
  var range = xyz.getRange(bbox.intersect(this.bbox, this.layerBbox), z);
  this.loading = 0;
  var handleTileLoad = this.handleTileLoad.bind(this);
  for (var x = range.minX; x <= range.maxX; ++x) {
    for (var y = range.minY; y <= range.maxY; ++y) {
      ++this.loading;
      var tile = new Tile(this.urls, x, y, z);
      tile.load(handleTileLoad);
    }
  }
};

TileLayer.prototype.handleTileLoad = function(error, tile) {
  if (error) {
    this.errors.push(error);
  }
  --this.loading;
  if (tile) {
    this.loadedTiles.push(tile);
    if (this.onTileLoad) {
      this.onTileLoad(error);
    }
  }
  if (this.loading <= 0 && this.onLoad) {
    var loadError;
    if (this.errors.length > 0) {
      loadError = new TileLayerLoadError(
        'Layer failed to load completely',
        this
      );
    }
    this.onLoad(loadError);
  }
};

TileLayer.prototype.render = function() {
  var numLoadedTiles = this.loadedTiles.length;
  if (!numLoadedTiles) {
    return;
  }
  var z = xyz.getZ(this.resolution);
  if (!isNaN(this.maxZoom) && z > this.maxZoom) {
    z = this.maxZoom;
  }
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
