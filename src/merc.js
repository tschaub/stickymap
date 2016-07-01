var radius = 6378137;
var edge = radius * Math.PI;

exports.forward = function(input, output) {
  output = output || [];
  var lat, y;
  for (var i = 0, ii = input.length; i < ii; i += 2) {
    output[i] = edge * input[i] / 180;
    lat = input[i + 1];
    if (lat > 90) {
      lat = 90;
    } else if (lat < -90) {
      lat = -90;
    }
    y = radius * Math.log(Math.tan(Math.PI * (lat + 90) / 360));
    if (y > edge) {
      y = edge;
    } else if (y < -edge) {
      y = -edge;
    }
    output[i + 1] = y;
  }
  return output;
};

exports.inverse = function(input, output) {
  output = output || [];
  for (var i = 0, ii = input.length; i < ii; i += 2) {
    output[i] = 180 * input[i] / edge;
    output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / radius)) / Math.PI - 90;
  }
  return output;
};

exports.edge = edge;
