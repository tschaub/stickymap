var expect = require('chai').expect;
var merc = require('../src/merc');
var xyz = require('../src/xyz');

describe('getZ()', function() {
  it('returns a zoom level given a resolution', function() {
    expect(xyz.getZ(xyz.R0)).to.equal(0);
    expect(xyz.getZ(xyz.R0 / 2)).to.equal(1);
    expect(xyz.getZ(xyz.R0 / 4)).to.equal(2);
    expect(xyz.getZ(xyz.R0 / 8)).to.equal(3);
  });

  it('returns the zoom level that is better (lower) than the resolution', function() {
    expect(xyz.getZ(xyz.R0 - xyz.R0 / 10)).to.equal(1);
    expect(xyz.getZ(xyz.R0 / 2 - xyz.R0 / 10)).to.equal(2);
  });

  it('stops at zero', function() {
    expect(xyz.getZ(10 * xyz.R0)).to.equal(0);
  });
});

describe('getResolution()', function() {
  it('returns a resolution given a zoom level', function() {
    expect(xyz.getResolution(0)).to.equal(xyz.R0);
    expect(xyz.getResolution(1)).to.equal(xyz.R0 / 2);
    expect(xyz.getResolution(2)).to.equal(xyz.R0 / 4);
    expect(xyz.getResolution(3)).to.equal(xyz.R0 / 8);
  });
});

describe('getRange()', function() {

  it('returns a tile range given a bbox and z', function() {

    // whole world
    expect(xyz.getRange(merc.forward([-180, -90, 180, 90]), 0)).to.eql({
      minX: 0, minY: 0, maxX: 0, maxY: 0
    });

    expect(xyz.getRange(merc.forward([-180, -90, 180, 90]), 1)).to.eql({
      minX: 0, minY: 0, maxX: 1, maxY: 1
    });

    expect(xyz.getRange(merc.forward([-180, -90, 180, 90]), 2)).to.eql({
      minX: 0, minY: 0, maxX: 3, maxY: 3
    });

    // northwest
    expect(xyz.getRange(merc.forward([-180, 0, 0, 90]), 0)).to.eql({
      minX: 0, minY: 0, maxX: 0, maxY: 0
    });

    expect(xyz.getRange(merc.forward([-180, 0, 0, 90]), 1)).to.eql({
      minX: 0, minY: 0, maxX: 0, maxY: 0
    });

    expect(xyz.getRange(merc.forward([-180, 0, 0, 90]), 2)).to.eql({
      minX: 0, minY: 0, maxX: 1, maxY: 1
    });

    expect(xyz.getRange(merc.forward([-180, 0, 0, 90]), 3)).to.eql({
      minX: 0, minY: 0, maxX: 3, maxY: 3
    });

    // southeast
    expect(xyz.getRange(merc.forward([0, -90, 180, 0]), 0)).to.eql({
      minX: 0, minY: 0, maxX: 0, maxY: 0
    });

    expect(xyz.getRange(merc.forward([0, -90, 180, 0]), 1)).to.eql({
      minX: 1, minY: 1, maxX: 1, maxY: 1
    });

    expect(xyz.getRange(merc.forward([0, -90, 180, 0]), 2)).to.eql({
      minX: 2, minY: 2, maxX: 3, maxY: 3
    });

    expect(xyz.getRange(merc.forward([0, -90, 180, 0]), 3)).to.eql({
      minX: 4, minY: 4, maxX: 7, maxY: 7
    });

  });
});
