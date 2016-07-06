var merc = require('./merc');

var transform = exports.transform = function(obj) {
  var transformed;
  switch (obj.type) {
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'MultiPoint':
    case 'MultiLineString':
    case 'MultiPolygon':
      transformed = {
        type: obj.type,
        coordinates: transformCoordinates(obj.coordinates)
      };
      break;
    case 'GeometryCollection':
      transformed = {
        type: obj.type,
        geometries: obj.geometries.map(geometry => transform(geometry))
      };
      break;
    case 'Feature':
      transformed = {
        type: obj.type,
        properties: obj.properties,
        geometry: transform(obj.geometry)
      };
      break;
    case 'FeatureCollection':
      transformed = {
        type: obj.type,
        features: obj.features.map(feature => transform(feature))
      };
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return transformed;
};

function transformCoordinates(input) {
  var output;
  if (!Array.isArray(input)) {
    throw new Error('Invalid coordinates');
  }
  if (!Array.isArray(input[0])) {
    if (input.length < 2) {
      throw new Error('Invalid coordinates');
    }
    output = merc.forward(input);
  } else {
    output = input.slice();
    for (var i = 0, ii = input.length; i < ii; ++i) {
      output[i] = transformCoordinates(input[i]);
    }
  }
  return output;
}

exports.getBbox = function(obj) {
  var bbox = [Infinity, Infinity, -Infinity, -Infinity];
  switch (obj.type) {
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'MultiPoint':
    case 'MultiLineString':
    case 'MultiPolygon':
      getCoordinatesBbox(obj.coordinates, bbox);
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return bbox;
};

function getCoordinatesBbox(input, bbox) {
  if (!Array.isArray(input)) {
    throw new Error('Invalid coordinates');
  }
  if (!Array.isArray(input[0])) {
    if (input.length < 2) {
      throw new Error('Invalid coordinates');
    }
    bbox[0] = Math.min(bbox[0], input[0]);
    bbox[1] = Math.min(bbox[1], input[1]);
    bbox[2] = Math.max(bbox[2], input[0]);
    bbox[3] = Math.max(bbox[3], input[1]);
  } else {
    for (var i = 0, ii = input.length; i < ii; ++i) {
      getCoordinatesBbox(input[i], bbox);
    }
  }
}
