var bbox = require('./bbox');

exports.resolveDimensions = function(config) {
  var minMapBbox = config.bbox;
  var minMapWidth = bbox.width(minMapBbox);
  var minMapHeight = bbox.height(minMapBbox);
  var width, height, widthResolution, heightResolution, resolution;
  if (config.width) {
    width = config.width;
    widthResolution = minMapWidth / width;
    if (config.height) {
      height = config.height;
      heightResolution = minMapHeight / height;
      resolution = Math.max(heightResolution, widthResolution);
    } else {
      resolution = widthResolution;
      height = minMapHeight / resolution;
    }
  } else if (config.height) {
    height = config.height;
    resolution = minMapHeight / height;
    width = minMapWidth / resolution;
  } else {
    throw new Error('Map must be given a width or height');
  }
  return {
    bbox: bbox.resize(minMapBbox, width * resolution, height * resolution),
    resolution: resolution,
    width: width,
    height: height
  };
};
