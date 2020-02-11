function setGeometryPath(context, obj, transform) {
  switch (obj.type) {
    case 'Polygon':
      setPolygonPath(context, obj.coordinates, transform);
      break;
    case 'MultiPolygon':
      setMultiPolygonPath(context, obj.coordinates, transform);
      break;
    case 'GeometryCollection':
      obj.geometries.forEach(function(geometry) {
        setGeometryPath(context, geometry, transform);
      });
      break;
    case 'Feature':
      setGeometryPath(context, obj.geometry, transform);
      break;
    case 'FeatureCollection':
      obj.features.forEach(function(feature) {
        setGeometryPath(context, feature.geometry, transform);
      });
      break;
    default:
    // do nothing
  }
}

exports.setGeometryPath = setGeometryPath;

function setPolygonPath(context, coordinates, transform) {
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    const ring = coordinates[i];
    for (let j = 0, jj = ring.length; j < jj; ++j) {
      const coord = ring[j];
      if (j === 0) {
        context.moveTo.apply(context, applyTransform(transform, coord));
      } else {
        context.lineTo.apply(context, applyTransform(transform, coord));
      }
    }
  }
}

function setMultiPolygonPath(context, coordinates, transform) {
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    setPolygonPath(context, coordinates[i], transform);
  }
}

function applyTransform(transform, coordinate) {
  const x = coordinate[0];
  const y = coordinate[1];
  return [
    transform[0] * x + transform[2] * y + transform[4],
    transform[1] * x + transform[3] * y + transform[5]
  ];
}
