var bbox = require('../src/bbox');
var expect = require('code').expect;

describe('width', function() {
  it('returns the width of a bbox', function() {
    expect(bbox.width([0, 0, 10, 15])).to.equal(10);
    expect(bbox.width([-10, 0, 10, 15])).to.equal(20);
  });
});

describe('height', function() {
  it('returns the height of a bbox', function() {
    expect(bbox.height([0, 0, 10, 15])).to.equal(15);
    expect(bbox.height([-10, -10, 10, 15])).to.equal(25);
  });
});

describe('resize', function() {
  it('returns a new bbox centered on the old one', function() {
    expect(bbox.resize([-10, -20, 10, 20], 30, 10)).to.equal([-15, -5, 15, 5]);
  });

  it('does not modify the old bbox', function() {
    var old = [-10, 5, 0, 15];
    var resized = bbox.resize(old, 20, 20);
    expect(resized).to.equal([-15, 0, 5, 20]);
    expect(old).to.equal([-10, 5, 0, 15]);
  });
});
