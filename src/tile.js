var xyz = require('./xyz');

function Tile(url, x, y, z) {
  this.url = url;
  this.x = x;
  this.y = y;
  this.z = z;
}

Tile.prototype.load = function() {
  var image = new Image();
  image.width = xyz.SIZE;
  image.height = xyz.SIZE;
  this.image = image;

  var url = this.url;
  return new Promise(function(resolve, reject) {
    image.addEventListener('load', resolve);
    image.addEventListener('error', function() {
      reject(new Error('Failed to load ' + url));
    });
    image.src = url;
  });
};

exports.load = function(url, x, y, z) {
  var tile = new Tile(url, x, y, z);
  return tile.load().then(function() {
    return tile;
  });
};

exports.Tile = Tile;
