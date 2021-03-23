import {EDGE} from './merc.js';

export const SIZE = 256;
export const R0 = (2 * EDGE) / SIZE;

export function getZ(resolution) {
  return Math.max(0, Math.ceil(Math.log(R0 / resolution) / Math.LN2));
}

export function getResolution(z) {
  return R0 / Math.pow(2, z);
}

export function getRange(bbox, z) {
  const resolution = getResolution(z);
  const mapSize = SIZE * resolution;
  return {
    minX: Math.floor((bbox[0] + EDGE) / mapSize),
    minY: Math.floor((EDGE - bbox[3]) / mapSize),
    maxX: Math.ceil((bbox[2] + EDGE) / mapSize) - 1,
    maxY: Math.ceil((EDGE - bbox[1]) / mapSize) - 1
  };
}
