const RADIUS = 6378137;
const EDGE = RADIUS * Math.PI;

exports.forward = function(input, output) {
  output = output || [];
  let lat, y;
  for (let i = 0, ii = input.length; i < ii; i += 2) {
    output[i] = (EDGE * input[i]) / 180;
    lat = input[i + 1];
    if (lat > 90) {
      lat = 90;
    } else if (lat < -90) {
      lat = -90;
    }
    y = RADIUS * Math.log(Math.tan((Math.PI * (lat + 90)) / 360));
    if (y > EDGE) {
      y = EDGE;
    } else if (y < -EDGE) {
      y = -EDGE;
    }
    output[i + 1] = y;
  }
  return output;
};

exports.inverse = function(input, output) {
  output = output || [];
  for (let i = 0, ii = input.length; i < ii; i += 2) {
    output[i] = (180 * input[i]) / EDGE;
    output[i + 1] =
      (360 * Math.atan(Math.exp(input[i + 1] / RADIUS))) / Math.PI - 90;
  }
  return output;
};

exports.EDGE = EDGE;
