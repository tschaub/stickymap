import pixelmatch from 'pixelmatch';
import stickymap from '../src/index.js';
import montana from './fixtures/vector/montana.json';

function expectPixelMatch(mapConfig, expectedPath, matchOptions) {
  matchOptions = matchOptions || {threshold: 0.1};
  const render = location.search.indexOf('render') >= 0;

  return new Promise(function(resolve, reject) {
    let map = null;

    function fail(message) {
      if (render && map) {
        document.body.appendChild(map);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(document.createTextNode(expectedPath));
      }
      reject(new Error(message));
    }

    const img = new Image();
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
      const width = img.width;
      const height = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      const expected = context.getImageData(0, 0, width, height).data;
      const got = map.getContext('2d').getImageData(0, 0, width, height).data;
      const mismatched = pixelmatch(
        expected,
        got,
        null,
        width,
        height,
        matchOptions
      );
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
    const config = {
      width: 200,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-200.png');
  });

  it('wraps in x when more than one world wide', function() {
    const config = {
      width: 200,
      height: 150,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-200x150.png');
  });

  it('shows blank in y when more than one world tall', function() {
    const config = {
      width: 150,
      height: 200,
      fit: [-180, -90, 180, 90],
      layers: [{url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'}]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/osm-150x200.png');
  });

  it('oversamples when maxZoom is set', function() {
    const config = {
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

  it('renders vector data', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 1
        },
        {
          vector: montana
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector.png');
  });

  it('supports vector stroke', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 1
        },
        {
          vector: montana,
          style: {
            lineWidth: 2,
            strokeStyle: 'blue'
          }
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector-stroke.png');
  });

  it('supports vector fill', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 1
        },
        {
          vector: montana,
          style: {
            fillStyle: 'blue'
          }
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector-fill.png');
  });

  it('supports vector fill and stroke together', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 1
        },
        {
          vector: montana,
          style: {
            strokeStyle: 'blue',
            lineWidth: 1.5,
            lineJoin: 'round',
            fillStyle: 'orange'
          }
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector-combo.png');
  });

  it('renders a vector layer without other layers', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      layers: [
        {
          vector: montana
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector-solo.png');
  });

  it('supports a scale factor', function() {
    const config = {
      width: 200,
      fit: [-140, 30, -85, 60],
      scale: 2,
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png',
          maxZoom: 1
        },
        {
          vector: montana
        }
      ]
    };
    return expectPixelMatch(config, 'base/fixtures/expected/vector-scale.png', {
      threshold: 0.2
    });
  });
});
