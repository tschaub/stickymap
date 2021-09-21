export function setGeometryPath(context, obj, transform) {
  switch (obj.type) {
    case 'Point':
      setPointPath(context, obj, transform);
      break;
    case 'MultiPoint':
      setMultiPointPath(context, obj, transform);
      break;
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

function setPointPath(context, obj, transform) {
  const [x, y] = applyTransform(transform, obj.coordinates);
  // TODO: using a default radius of 8, find way to pass option
  context.arc.apply(context, [x, y, 8, 0, Math.PI * 2]);
}

function setMultiPointPath(context, obj, transform) {
  for (let i = 0, ii = obj.coordinates.length; i < ii; ++i) {
    setPointPath(context, { coordinates: obj.coordinates[i] }, transform);
  }
}

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
