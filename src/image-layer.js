const Untile = require('./untile');
const ImageLayerLoadError = require('./errors').ImageLayerLoadError;
const bbox = require('./bbox');

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
  const untile = new Untile(this.url, this.imageBbox);
  return untile.load(this.handleImageLoad.bind(this));
};

ImageLayer.prototype.handleImageLoad = function(error, untile) {
  this.untile = untile;
  if (this.onLoad) {
    let loadError;
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
  const image = this.untile.image;
  const imageResolutionX = bbox.width(this.imageBbox) / image.width;
  const imageResolutionY = bbox.height(this.imageBbox) / image.height;
  const scaleX = imageResolutionX / this.resolution;
  const scaleY = imageResolutionY / this.resolution;

  this.context.save();
  this.context.scale(scaleX, scaleY);
  const dx = (this.imageBbox[0] - this.bbox[0]) / imageResolutionX;
  const dy = (this.bbox[3] - this.imageBbox[3]) / imageResolutionX;
  this.context.drawImage(image, dx, dy);
  this.context.restore();
};

module.exports = ImageLayer;
