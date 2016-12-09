var xyz = require('./xyz');

function Tile(url, x, y, z, options) {
  this.url = url;
  this.x = x;
  this.y = y;
  this.z = z;
  this.options = options || {};
}

Tile.prototype.load = function(callback) {
  var image = new Image();
  if (this.options.crossOrigin) {
    image.crossOrigin = this.options.crossOrigin;
  }
  image.width = xyz.SIZE;
  image.height = xyz.SIZE;
  this.image = image;

  var url = this.url;
  var tile = this;
  image.addEventListener('load', function() {
    callback(null, tile);
  });
  image.addEventListener('error', function() {
    callback(new Error('Failed to load ' + url));
  });
  image.src = url;
};

module.exports = Tile;
