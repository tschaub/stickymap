function Untile(url, bbox, options) {
  this.url = url;
  this.bbox = bbox;
  this.options = options || {};
}

Untile.prototype.load = function(callback) {
  const image = new Image();
  image.crossOrigin = this.options.crossOrigin || 'anonymous';
  this.image = image;

  const url = this.url;
  const untile = this;
  image.addEventListener('load', function() {
    callback(null, untile);
  });
  image.addEventListener('error', function() {
    callback(new Error('Failed to load ' + url));
  });
  image.src = url;
};

module.exports = Untile;
