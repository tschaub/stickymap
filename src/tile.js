var TileLoadError = require('./errors').TileLoadError;
var xyz = require('./xyz');

function pick(urls, x, y, z) {
  var hash = (x << z) + y;
  var length = urls.length;
  var index = hash % length;
  return urls[index < 0 ? index + length : index];
}

var BLANK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function mod(n, m) {
  return (n % m + m) % m;
}

function Tile(urls, x, y, z, options) {
  this.urls = urls;
  this.x = x;
  this.y = y;
  this.z = z;
  this.options = options || {};
}

Tile.prototype.load = function(callback) {
  var image = new Image();
  var tile = this;
  var url;
  image.addEventListener('load', function() {
    callback(null, tile);
  });
  image.addEventListener('error', function() {
    callback(new TileLoadError('Failed to load ' + url, tile));
  });

  image.width = xyz.SIZE;
  image.height = xyz.SIZE;
  this.image = image;

  if (this.z < 0) {
    image.src = BLANK;
    return;
  }

  var max = Math.pow(2, this.z);
  if (this.y < 0 || this.y >= max) {
    image.src = BLANK;
    return;
  }

  var x = mod(this.x, max);
  var template = pick(this.urls, x, this.y, this.z);
  url = template
    .replace('{x}', x)
    .replace('{y}', this.y)
    .replace('{z}', this.z);

  if (this.options.crossOrigin) {
    image.crossOrigin = this.options.crossOrigin;
  }
  image.src = url;
};

module.exports = Tile;
