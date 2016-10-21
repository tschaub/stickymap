var StickyMap = require('../src/map');
var expect = require('chai').expect;

describe('constructor', function() {

  it('creates a new sticky map', function() {
    var map = new StickyMap({
      fit: [-180, -90, 180, 90],
      width: 100,
      height: 100,
      layers: []
    });

    expect(map).to.be.an.instanceOf(StickyMap);
  });

  it('throws if bbox is missing', function() {
    var call = function() {
      return new StickyMap({
        width: 100,
        height: 100,
        layers: []
      });
    };

    expect(call).to.throw(Error, /must have fit or clip/);
  });

  it('throws if width and height are missing', function() {
    var call = function() {
      return new StickyMap({
        fit: [-180, -90, 180, 90],
        layers: []
      });
    };

    expect(call).to.throw(Error, /must be given a width or height/);
  });

});

describe('#canvas', function() {

  describe('#width', function() {

    it('is the pixel width of the map', function() {
      var map = new StickyMap({
        fit: [-180, -90, 180, 90],
        width: 150,
        height: 100,
        layers: []
      });

      expect(map.canvas.width).to.eql(150);
    });

    it('is calculated if not provided explicitly', function() {
      var map = new StickyMap({
        fit: [-180, -90, 180, 90],
        height: 100,
        layers: []
      });

      expect(map.canvas.width).to.eql(100);
    });

  });

  describe('#height', function() {

    it('is the pixel height of the map', function() {
      var map = new StickyMap({
        fit: [-180, -90, 180, 90],
        width: 150,
        height: 100,
        layers: []
      });

      expect(map.canvas.height).to.eql(100);
    });

    it('is calculated if not provided explicitly', function() {
      var map = new StickyMap({
        fit: [-180, 0, 0, 90],
        width: 200,
        layers: []
      });

      expect(map.canvas.height).to.eql(200);
    });

  });

});
