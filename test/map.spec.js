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

  it('is pixel width of the map', function() {
    var map = new StickyMap({
      bbox: [-180, -90, 180, 90],
      width: 150,
      height: 100
    });

    expect(map.width).to.eql(150);
  });

});
