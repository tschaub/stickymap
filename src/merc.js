var radius = 6378137;
var edge = radius * Math.PI;

exports.forward = function(input, output) {
  output = output || [];
  for (var i = 0, ii = input.length; i < ii; i += 2) {
    output[i] = edge * input[i] / 180;
    output[i + 1] = radius * Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
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
