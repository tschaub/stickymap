var StickyMap = require('./map');

exports.img = function(config) {
  var map = new StickyMap(config);

  var image = new Image();
  image.width = map.width;
  image.height = map.height;

  map.load().then(function(canvas) {
    image.src = canvas.toDataURL();
  }).catch(function(err) {
    image.src = err;
  });

  return image;
};
