var StickyMap = require('../src/map');
var expect = require('chai').expect;

describe('constructor', function() {

  it('creates a new sticky map', function() {
    var map = new StickyMap({
      bbox: [-180, -90, 180, 90],
      width: 100,
      height: 100
    });

    expect(map).to.be.an.instanceOf(StickyMap);
  });

  it('throws if bbox is missing', function() {
    var call = function() {
      return new StickyMap({
        width: 100,
        height: 100
      });
    };

    expect(call).to.throw(Error, /must have a bbox/);
  });

  it('throws if width and height are missing', function() {
    var call = function() {
      return new StickyMap({
        bbox: [-180, -90, 180, 90]
      });
    };

    expect(call).to.throw(Error, /must be given a width or height/);
  });

});

describe('#width', function() {

  it('is the pixel width of the map', function() {
    var map = new StickyMap({
      bbox: [-180, -90, 180, 90],
      width: 150,
      height: 100
    });

    expect(map.width).to.eql(150);
  });

  it('is calculated if not provided explicitly', function() {
    var map = new StickyMap({
      bbox: [-180, -90, 180, 90],
      height: 100
    });

    expect(map.width).to.eql(100);
  });

});

describe('#height', function() {

  it('is the pixel height of the map', function() {
    var map = new StickyMap({
      bbox: [-180, -90, 180, 90],
      width: 150,
      height: 100
    });

    expect(map.height).to.eql(100);
  });

  it('is calculated if not provided explicitly', function() {
    var map = new StickyMap({
      bbox: [-180, 0, 0, 90],
      width: 200
    });

    expect(map.width).to.eql(200);
  });

});

describe('#load()', function() {

  it('returns a promise', function() {

    var map = new StickyMap({
      bbox: [-120, 40, -100, 60],
      layers: [
        {url: 'http://example.com/{z}/{x}/{y}.png'}
      ],
      width: 200,
      height: 150
    });

    var promise = map.load();
    expect(promise).to.be.an.instanceOf(Promise);

  });

});
