export function width(bbox) {
  return bbox[2] - bbox[0];
}

export function height(bbox) {
  return bbox[3] - bbox[1];
}

export function center(bbox) {
  return [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
}

export function resize(bbox, width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const coord = center(bbox);
  return [
    coord[0] - halfWidth,
    coord[1] - halfHeight,
    coord[0] + halfWidth,
    coord[1] + halfHeight
  ];
}

export function intersect(bbox1, bbox2) {
  return [
    Math.max(bbox1[0], bbox2[0]),
    Math.max(bbox1[1], bbox2[1]),
    Math.min(bbox1[2], bbox2[2]),
    Math.min(bbox1[3], bbox2[3])
  ];
}

export function isEmpty(bbox) {
  return bbox[0] >= bbox[2] || bbox[1] >= bbox[3];
}
