var expect = require('chai').expect;
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
