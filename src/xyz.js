var merc = require('./merc');

var SIZE = 256;
var R0 = 2 * merc.EDGE / SIZE;

exports.getZ = function(resolution) {
  return Math.max(0, Math.ceil(Math.log(R0 / resolution) / Math.LN2));
};

exports.SIZE = SIZE;
exports.R0 = R0;
