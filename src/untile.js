function Untile(url, bbox, options) {
  this.url = url;
  this.bbox = bbox;
  this.options = options || {};
}

Untile.prototype.load = function(callback) {
  var image = new Image();
  image.crossOrigin = this.options.crossOrigin || 'anonymous';
  this.image = image;

  var url = this.url;
  var untile = this;
  image.addEventListener('load', function() {
    callback(null, untile);
  });
  image.addEventListener('error', function() {
    callback(new Error('Failed to load ' + url));
  });
  image.src = url;
};

module.exports = Untile;
