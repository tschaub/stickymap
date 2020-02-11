const merc = require('./merc');

const SIZE = 256;
const R0 = (2 * merc.EDGE) / SIZE;

exports.getZ = function(resolution) {
  return Math.max(0, Math.ceil(Math.log(R0 / resolution) / Math.LN2));
};

const getResolution = (exports.getResolution = function(z) {
  return R0 / Math.pow(2, z);
});

exports.getRange = function(bbox, z) {
  const resolution = getResolution(z);
  const mapSize = SIZE * resolution;
  return {
    minX: Math.floor((bbox[0] + merc.EDGE) / mapSize),
    minY: Math.floor((merc.EDGE - bbox[3]) / mapSize),
    maxX: Math.ceil((bbox[2] + merc.EDGE) / mapSize) - 1,
    maxY: Math.ceil((merc.EDGE - bbox[1]) / mapSize) - 1
  };
};

exports.SIZE = SIZE;
exports.R0 = R0;
