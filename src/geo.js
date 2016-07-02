var merc = require('./merc');

exports.transform = function(obj) {
  var transformed;
  switch (obj.type) {
    case 'Polygon':
      transformed = {
        type: obj.type,
        coordinates: transformPolygonCoords(obj.coordinates)
      };
      break;
    case 'MultiPolygon':
      transformed = {
        type: obj.type,
        coordinates: transformMultiPolygonCoords(obj.coordinates)
      };
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return transformed;
};

function transformPolygonCoords(coordinates) {
  coordinates = coordinates.slice();
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    var ring = coordinates[i].slice();
    for (var j = 0, jj = ring.length; j < jj; ++j) {
      ring[j] = merc.forward(ring[j]);
    }
    coordinates[i] = ring;
  }
  return coordinates;
}

function transformMultiPolygonCoords(coordinates) {
  coordinates = coordinates.slice();
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    coordinates[i] = transformPolygonCoords(coordinates[i]);
  }
  return coordinates;
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
