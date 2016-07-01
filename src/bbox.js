exports.width = function(bbox) {
  return bbox[2] - bbox[0];
};

exports.height = function(bbox) {
  return bbox[3] - bbox[1];
};

exports.resize = function(bbox, width, height) {
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var centerX = (bbox[0] + bbox[2]) / 2;
  var centerY = (bbox[1] + bbox[3]) / 2;
  return [
    centerX - halfWidth,
    centerY - halfHeight,
    centerX + halfWidth,
    centerY + halfHeight
  ];
};
