exports.width = function(bbox) {
  return bbox[2] - bbox[0];
};

exports.height = function(bbox) {
  return bbox[3] - bbox[1];
};

var getCenter = exports.center = function(bbox) {
  return [
    (bbox[0] + bbox[2]) / 2,
    (bbox[1] + bbox[3]) / 2
  ];
};

exports.resize = function(bbox, width, height) {
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var center = getCenter(bbox);
  return [
    center[0] - halfWidth,
    center[1] - halfHeight,
    center[0] + halfWidth,
    center[1] + halfHeight
  ];
};

exports.intersect = function(bbox1, bbox2) {
  return [
    Math.max(bbox1[0], bbox2[0]),
    Math.max(bbox1[1], bbox2[1]),
    Math.min(bbox1[2], bbox2[2]),
    Math.min(bbox1[3], bbox2[3])
  ];
};

exports.isEmpty = function(bbox) {
  return bbox[0] >= bbox[2] || bbox[1] >= bbox[3];
};
