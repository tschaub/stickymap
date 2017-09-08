var pixelmatch = require('pixelmatch');
var stickymap = require('../src');

function expectPixelMatch(mapConfig, expectedPath, matchOptions) {
  matchOptions = matchOptions || {threshold: 0.1};
  var render = location.search.indexOf('render') >= 0;

  return new Promise(function(resolve, reject) {
    var map;

    function fail(message) {
      if (render && map) {
        document.body.appendChild(map);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(document.createTextNode(expectedPath));
      }
      reject(new Error(message));
    }

    var img = new Image();
    img.onerror = function() {
      fail('Failed to load ' + expectedPath);
    };

    img.onload = function() {
      if (img.width !== map.width) {
        fail('Unexpected width ' + img.width + ', expected ' + map.width);
        return;
      }
      if (img.height !== map.height) {
        fail('Unexpected height ' + img.height + ', expected ' + map.height);
        return;
      }
      var width = img.width;
      var height = img.height;
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      var expected = context.getImageData(0, 0, width, height);
      var got = map.getContext('2d').getImageData(0, 0, width, height);
      var mismatched = pixelmatch(expected, got, width, height, matchOptions);
      if (mismatched > 0) {
        fail('Got mismatched pixels: ' + mismatched);
      } else {
        resolve(true);
      }
    };

    mapConfig.onLoad = function(error) {
      if (error) {
        return reject(error);
      }
      img.src = expectedPath;
    };

    map = stickymap(mapConfig);
  });
}

describe('map rendering', function() {
  it('fits the world in a 200px square', function() {
    var config = {
      width: 200,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-200.png');
  });

  it('wraps in x when more than one world wide', function() {
    var config = {
      width: 200,
      height: 150,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-200x150.png');
  });

  it('shows blank in y when more than one world tall', function() {
    var config = {
      width: 150,
      height: 200,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-150x200.png');
  });

  it('oversamples when maxZoom is set', function() {
    var config = {
      width: 200,
      fit: [-180, 0, 0, 90],
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 0
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-max-zoom.png');
  });
});