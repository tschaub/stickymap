import * as bbox from '../src/bbox.js';
import {expect} from 'chai';

describe('width', function() {
  it('returns the width of a bbox', function() {
    expect(bbox.width([0, 0, 10, 15])).to.eql(10);
    expect(bbox.width([-10, 0, 10, 15])).to.eql(20);
  });
});

describe('height', function() {
  it('returns the height of a bbox', function() {
    expect(bbox.height([0, 0, 10, 15])).to.eql(15);
    expect(bbox.height([-10, -10, 10, 15])).to.eql(25);
  });
});

describe('center', function() {
  it('returns the center of a bbox', function() {
    expect(bbox.center([0, 0, 10, 15])).to.eql([5, 7.5]);
    expect(bbox.center([-10, -10, 10, 15])).to.eql([0, 2.5]);
  });
});

describe('resize', function() {
  it('returns a new bbox centered on the old one', function() {
    expect(bbox.resize([-10, -20, 10, 20], 30, 10)).to.eql([-15, -5, 15, 5]);
  });

  it('does not modify the old bbox', function() {
    const old = [-10, 5, 0, 15];
    const resized = bbox.resize(old, 20, 20);
    expect(resized).to.eql([-15, 0, 5, 20]);
    expect(old).to.eql([-10, 5, 0, 15]);
  });
});

describe('intersect', function() {
  it('retruns the intersection of two boxes', function() {
    const world = [-180, -90, 180, 90];
    const northwest = [-200, 0, 0, 190];
    const intersection = bbox.intersect(world, northwest);
    expect(intersection).to.eql([-180, 0, 0, 90]);
  });
});

describe('isEmpty', function() {
  it('tests for empty bbox', function() {
    const east = [0, -90, 180, 90];
    const west = [-180, 0, 0, 90];
    const intersection = bbox.intersect(east, west);
    expect(bbox.isEmpty(intersection)).to.eql(true);
  });
});
