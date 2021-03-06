import {width as getWidth, height as getHeight, resize} from './bbox.js';

export function resolveDimensions(config) {
  const minMapBbox = config.bbox;
  const minMapWidth = getWidth(minMapBbox);
  const minMapHeight = getHeight(minMapBbox);
  if (minMapWidth <= 0 || minMapHeight <= 0) {
    throw new Error('Map must have non-empty bbox');
  }
  let width, height, widthResolution, heightResolution, resolution;
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
    bbox: resize(minMapBbox, width * resolution, height * resolution),
    resolution: resolution,
    width: width,
    height: height
  };
}

const URL_RANGE = /{([0-9a-zA-Z])-([0-9a-zA-Z])}/;

export function expandUrl(url) {
  let urls;
  const match = url.match(URL_RANGE);
  if (match) {
    const start = match[1].charCodeAt(0);
    const end = match[2].charCodeAt(0);
    if (!(end > start)) {
      throw new Error(
        'Invalid range in URL template: ' + match[1] + '-' + match[2]
      );
    }
    urls = [];
    for (let i = start; i <= end; ++i) {
      urls.push(url.replace(match[0], String.fromCharCode(i)));
    }
  } else {
    urls = [url];
  }
  return urls;
}
