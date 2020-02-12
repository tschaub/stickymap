const merc = require('./merc');

function transform(obj) {
  let transformed;
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
        geometries: obj.geometries.map(transform)
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
        features: obj.features.map(transform)
      };
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return transformed;
}

exports.transform = transform;

function transformCoordinates(input) {
  let output;
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
    for (let i = 0, ii = input.length; i < ii; ++i) {
      output[i] = transformCoordinates(input[i]);
    }
  }
  return output;
}

function scaleBbox(bbox, factor) {
  if (factor === 1) {
    return bbox;
  }
  const halfWidth = (factor * (bbox[2] - bbox[0])) / 2;
  const halfHeight = (factor * (bbox[3] - bbox[1])) / 2;
  const midX = (bbox[0] + bbox[2]) / 2;
  const midY = (bbox[1] + bbox[3]) / 2;
  return [
    midX - halfWidth,
    midY - halfHeight,
    midX + halfWidth,
    midY + halfHeight
  ];
}

exports.scaleBbox = scaleBbox;

function getBbox(obj, bbox) {
  bbox = bbox || [Infinity, Infinity, -Infinity, -Infinity];
  switch (obj.type) {
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'MultiPoint':
    case 'MultiLineString':
    case 'MultiPolygon':
      getCoordinatesBbox(obj.coordinates, bbox);
      break;
    case 'GeometryCollection':
      obj.geometries.forEach(function(geometry) {
        getBbox(geometry, bbox);
      });
      break;
    case 'Feature':
      getBbox(obj.geometry, bbox);
      break;
    case 'FeatureCollection':
      obj.features.forEach(function(feature) {
        getBbox(feature.geometry, bbox);
      });
      break;
    default:
      throw new Error('GeoJSON type ' + obj.type + ' not supported');
  }
  return bbox;
}

exports.getBbox = getBbox;

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
    for (let i = 0, ii = input.length; i < ii; ++i) {
      getCoordinatesBbox(input[i], bbox);
    }
  }
}
