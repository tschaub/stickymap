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
  var bbox;
  switch (obj.type) {
    case 'Polygon':
      bbox = getPolygonBbox(obj);
      break;
    case 'MultiPolygon':
      bbox = getMultiPolygonBbox(obj);
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return bbox;
};

function getPolygonBbox(poly, bbox) {
  bbox = bbox || [Infinity, Infinity, -Infinity, -Infinity];
  var minX = bbox[0];
  var minY = bbox[1];
  var maxX = bbox[2];
  var maxY = bbox[3];
  for (var i = 0, ii = poly.coordinates.length; i < ii; ++i) {
    var ring = poly.coordinates[i];
    for (var j = 0, jj = ring.length; j < jj; ++j) {
      var coord = ring[j];
      var x = coord[0];
      var y = coord[1];
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
  }
  bbox[0] = minX;
  bbox[1] = minY;
  bbox[2] = maxX;
  bbox[3] = maxY;
  return bbox;
}

function getMultiPolygonBbox(multi) {
  var bbox = [Infinity, Infinity, -Infinity, -Infinity];
  for (var i = 0, ii = multi.coordinates.length; i < ii; ++i) {
    getPolygonBbox(multi.coordinates[i], bbox);
  }
  return bbox;
}
