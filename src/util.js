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

var URL_RANGE = /{([0-9a-zA-Z])-([0-9a-zA-Z])}/;
exports.expandUrl = function(url) {
  var urls;
  var match = url.match(URL_RANGE);
  if (match) {
    var start = match[1].charCodeAt(0);
    var end = match[2].charCodeAt(0);
    if (!(end > start)) {
      throw new Error('Invalid range in URL template: ' + match[1] + '-' + match[2]);
    }
    urls = [];
    for (var i = start; i <= end; ++i) {
      urls.push(url.replace(match[0], String.fromCharCode(i)));
    }
  } else {
    urls = [url];
  }
  return urls;
};
