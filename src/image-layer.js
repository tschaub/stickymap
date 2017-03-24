var Untile = require('./untile');
var ImageLayerLoadError = require('./errors').ImageLayerLoadError;
var bbox = require('./bbox');

function ImageLayer(config) {
  this.id = config.id;
  this.bbox = config.bbox;
  this.resolution = config.resolution;
  this.context = config.context;
  this.url = config.url;
  this.imageBbox = config.imageBbox || config.bbox;
  this.onLoad = config.onLoad;
}

ImageLayer.prototype.load = function() {
  var untile = new Untile(this.url, this.imageBbox);
  return untile.load(this.handleImageLoad.bind(this));
};

ImageLayer.prototype.handleImageLoad = function(error, untile) {
  this.untile = untile;
  if (this.onLoad) {
    var loadError;
    if (error) {
      loadError = new ImageLayerLoadError(error.message, this);
    }
    this.onLoad(loadError);
  }
};

ImageLayer.prototype.render = function() {
  if (!this.untile) {
    return;
  }
  var image = this.untile.image;
  var imageResolutionX = bbox.width(this.imageBbox) / image.width;
  var imageResolutionY = bbox.height(this.imageBbox) / image.height;
  var scaleX = imageResolutionX / this.resolution;
  var scaleY = imageResolutionY / this.resolution;

  this.context.save();
  this.context.scale(scaleX, scaleY);
  var dx = (this.imageBbox[0] - this.bbox[0]) / imageResolutionX;
  var dy = (this.bbox[3] - this.imageBbox[3]) / imageResolutionX;
  this.context.drawImage(image, dx, dy);
  this.context.restore();
};

module.exports = ImageLayer;
