import StickyMap from '../src/StickyMap.js';
import * as errors from '../src/errors.js';
import {expect} from 'chai';

describe('constructor', function() {
  it('creates a new sticky map', function() {
    const map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 100,
      height: 100,
      layers: []
    });

    expect(map).to.be.an.instanceOf(StickyMap);
  });

  it('throws if bbox is missing', function() {
    const call = function() {
      return new StickyMap({
        width: 100,
        height: 100,
        layers: []
      });
    };

    expect(call).to.throw(Error, /must have fit or clip/);
  });

  it('throws if bbox is empty', function() {
    const call = function() {
      return new StickyMap({
        fit: [10, -10, 10, -10],
        width: 100,
        height: 100,
        layers: []
      });
    };

    expect(call).to.throw(Error, /must have non-empty bbox/);
  });

  it('throws if width and height are missing', function() {
    const call = function() {
      return new StickyMap({
        fit: [-180, -90, 180, 90],
        layers: []
      });
    };

    expect(call).to.throw(Error, /must be given a width or height/);
  });
});

describe('onLoad', function() {
  it('is called after all layers load', function(done) {
    const map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 200,
      layers: [
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'
        }
      ],
      onLoad: function(error) {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    map.load();
  });

  it('is called with a MapLoadError if any layers fail to load', function(done) {
    const map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 200,
      layers: [
        {
          id: 'bad tile layer',
          url: 'bad:tile'
        },
        {
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'
        },
        {
          untiled: true,
          id: 'bad image layer',
          url: 'bad:image'
        }
      ],
      onLoad: function(error) {
        expect(error).to.be.an.instanceOf(errors.MapLoadError);
        expect(error.errors).to.have.lengthOf(2);

        const loadErrors = error.errors.slice().sort(function(a, b) {
          return a.layer.id < b.layer.id ? -1 : 1;
        });

        expect(loadErrors[0]).to.be.an.instanceOf(errors.LayerLoadError);
        expect(loadErrors[0]).to.be.an.instanceOf(errors.ImageLayerLoadError);
        expect(loadErrors[0].layer.id).to.equal('bad image layer');

        expect(loadErrors[1]).to.be.an.instanceOf(errors.LayerLoadError);
        expect(loadErrors[1]).to.be.an.instanceOf(errors.TileLayerLoadError);
        expect(loadErrors[1].layer.id).to.equal('bad tile layer');

        done();
      }
    });

    map.load();
  });

  it('is called with a MapLoadError for tiles that 404', function(done) {
    const map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 1024, // this will request zoom level 2, which are absent
      layers: [
        {
          id: 'bad tile layer',
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'
        }
      ],
      onLoad: function(error) {
        expect(error).to.be.an.instanceOf(errors.MapLoadError);
        expect(error.errors).to.have.lengthOf(1);

        expect(error.errors[0]).to.be.an.instanceOf(errors.LayerLoadError);
        expect(error.errors[0]).to.be.an.instanceOf(errors.TileLayerLoadError);
        expect(error.errors[0].layer.id).to.equal('bad tile layer');

        done();
      }
    });

    map.load();
  });
});

describe('maxZoom', function() {
  it('allows tile layers with limited zoom levels', function(done) {
    const map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 1024, // this will request zoom level 2, which are absent
      layers: [
        {
          maxZoom: 1, // this will make it so only level 0 and 1 are requested
          url: 'base/fixtures/layers/osm/{z}/{x}/{y}.png'
        }
      ],
      onLoad: function(error) {
        expect(error).to.be.an('undefined');
        done();
      }
    });

    map.load();
  });
});

describe('#canvas', function() {
  describe('#width', function() {
    it('is the pixel width of the map', function() {
      const map = new StickyMap({
        fit: [-180, -90, 180, 90],
        width: 150,
        height: 100,
        layers: []
      });

      expect(map.canvas.width).to.eql(150);
    });

    it('is calculated if not provided explicitly', function() {
      const map = new StickyMap({
        fit: [-180, -90, 180, 90],
        height: 100,
        layers: []
      });

      expect(map.canvas.width).to.eql(100);
    });
  });

  describe('#height', function() {
    it('is the pixel height of the map', function() {
      const map = new StickyMap({
        fit: [-180, -90, 180, 90],
        width: 150,
        height: 100,
        layers: []
      });

      expect(map.canvas.height).to.eql(100);
    });

    it('is calculated if not provided explicitly', function() {
      const map = new StickyMap({
        fit: [-180, 0, 0, 90],
        width: 200,
        layers: []
      });

      expect(map.canvas.height).to.eql(200);
    });
  });
});
