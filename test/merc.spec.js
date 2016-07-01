var merc = require('../src/merc');
var expect = require('chai').expect;

var DELTA = 1e-8;

var ALT_GEO = [-5.625, 52.4827802220782];
var ALT_MERC = [-626172.13571216376, 6887893.4928337997];

function expectCoord(actual, expected) {
  expect(actual).to.be.an('array');
  expect(actual).to.have.lengthOf(2);
  expect(actual[0]).to.be.closeTo(expected[0], DELTA);
  expect(actual[1]).to.be.closeTo(expected[1], DELTA);
}

function expectBbox(actual, expected) {
  expect(actual).to.be.an('array');
  expect(actual).to.have.lengthOf(4);
  expect(actual[0]).to.be.closeTo(expected[0], DELTA);
  expect(actual[1]).to.be.closeTo(expected[1], DELTA);
  expect(actual[2]).to.be.closeTo(expected[2], DELTA);
  expect(actual[3]).to.be.closeTo(expected[3], DELTA);
}

describe('forward', function() {
  it('transforms geographic to web mercator', function() {
    expectCoord(merc.forward([0, 0]), [0, 0]);
    expectCoord(merc.forward([-180, 0]), [-merc.edge, 0]);
    expectCoord(merc.forward([180, 0]), [merc.edge, 0]);
    expectCoord(merc.forward(ALT_GEO), ALT_MERC);
  });

  it('works for bboxes', function() {
    expectBbox(merc.forward([0, 0, 0, 0]), [0, 0, 0, 0]);
    expectBbox(merc.forward([-180, 0, 180, 0]), [-merc.edge, 0, merc.edge, 0]);
    expectBbox(merc.forward(ALT_GEO.concat(ALT_GEO)), ALT_MERC.concat(ALT_MERC));
  });

  it('does not modify the original', function() {
    var original = [1, 2];
    merc.forward(original);
    expect(original).to.eql([1, 2]);
  });

  it('accepts an optional output array', function() {
    var output = [];
    merc.forward([-180, 0], output);
    expectCoord(output, [-merc.edge, 0]);
  });
});

describe('inverse', function() {
  it('transforms web mercator to geographic', function() {
    expectCoord(merc.inverse([0, 0]), [0, 0]);
    expectCoord(merc.inverse([-merc.edge, 0]), [-180, 0]);
    expectCoord(merc.inverse([merc.edge, 0]), [180, 0]);
    expectCoord(merc.inverse(ALT_MERC), ALT_GEO);
  });

  it('works for bboxes', function() {
    expectBbox(merc.inverse([0, 0, 0, 0]), [0, 0, 0, 0]);
    expectBbox(merc.inverse([-merc.edge, 0, merc.edge, 0]), [-180, 0, 180, 0]);
    expectBbox(merc.inverse(ALT_MERC.concat(ALT_MERC)), ALT_GEO.concat(ALT_GEO));
  });

  it('does not modify the original', function() {
    var original = [1, 2];
    merc.inverse(original);
    expect(original).to.eql([1, 2]);
  });

  it('accepts an optional output array', function() {
    var output = [];
    merc.inverse([-merc.edge, 0], output);
    expectCoord(output, [-180, 0]);
  });
});