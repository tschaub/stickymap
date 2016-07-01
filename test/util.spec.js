var util = require('../src/util');
var expect = require('chai').expect;

describe('resolveDimensions', function() {
  it('resolves width and height given bbox and width', function() {
    var bbox = [0, 0, 1000, 2000];
    var width = 100;
    var height = 200;

    var dimensions = util.resolveDimensions({
      bbox: bbox,
      width: width
    });

    expect(dimensions.width).to.eql(width);
    expect(dimensions.height).to.eql(height);
    expect(dimensions.bbox).to.eql(bbox);
  });

  it('resolves width and height given bbox and height', function() {
    var bbox = [0, 0, 1000, 2000];
    var width = 100;
    var height = 200;

    var dimensions = util.resolveDimensions({
      bbox: bbox,
      height: height
    });

    expect(dimensions.width).to.eql(width);
    expect(dimensions.height).to.eql(height);
    expect(dimensions.bbox).to.eql(bbox);
  });

  it('resolves width and height given bbox, width, and height', function() {
    var bbox = [0, 0, 1000, 2000];
    var width = 100;
    var height = 200;
    var dimensions = util.resolveDimensions({
      bbox: bbox,
      width: width,
      height: height
    });

    expect(dimensions.width).to.eql(width);
    expect(dimensions.height).to.eql(height);
    expect(dimensions.bbox).to.eql(bbox);
  });

  it('throws if no width or height', function() {
    var call = function() {
      util.resolveDimensions({
        bbox: [0, 0, 1000, 2000]
      });
    };

    expect(call).to.throw(Error, /must be given a width or height/);
  });

  it('extends bbox width if image aspect ratio is higher', function() {
    var bbox = [0, 0, 1000, 2000];
    var width = 200;
    var height = 200;
    var dimensions = util.resolveDimensions({
      bbox: bbox,
      width: width,
      height: height
    });
    expect(dimensions.width).to.eql(width);
    expect(dimensions.height).to.eql(height);
    expect(dimensions.bbox).to.eql([-500, 0, 1500, 2000]);
  });

  it('extends bbox height if image aspect ratio is lower', function() {
    var bbox = [0, 0, 1000, 2000];
    var width = 50;
    var height = 200;
    var dimensions = util.resolveDimensions({
      bbox: bbox,
      width: width,
      height: height
    });
    expect(dimensions.width).to.eql(width);
    expect(dimensions.height).to.eql(height);
    expect(dimensions.bbox).to.eql([0, -1000, 1000, 3000]);
  });
});
