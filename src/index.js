var StickyMap = require('./map');

exports.img = function(config) {
  var map = new StickyMap(config);

  var image = new Image();
  image.width = map.width;
  image.height = map.height;

  map.load().then(function(dataUrl) {
    image.src = dataUrl;
  }).catch(function(err) {
    console.error(err);
  });

  return image;
};
