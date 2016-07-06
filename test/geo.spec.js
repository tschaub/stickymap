var geo = require('../src/geo');
var merc = require('../src/merc');
var expect = require('chai').expect;

var DELTA = 1e-8;

function expectGeom(actual, expected) {
  expect(actual).to.be.an('object');
  expect(actual.type).to.equal(expected.type);
  if (expected.type === 'GeometryCollection') {
    expect(actual.geometries).to.be.an('array');
    expect(actual.geometries.length).to.equal(expected.geometries.length);
    for (var i = 0, ii = actual.geometries.length; i < ii; ++i) {
      expectGeom(actual.geometries[i], expected.geometries[i]);
    }
  } else {
    expectCoordinates(actual.coordinates, expected.coordinates);
  }
}

function expectCoordinates(actual, expected) {
  expect(actual).to.be.an('array');
  expect(actual.length).to.equal(expected.length);
  if (Array.isArray(expected[0])) {
    for (var i = 0, ii = expected.length; i < ii; ++i) {
      expectCoordinates(actual[i], expected[i]);
    }
  } else {
    expect(actual[0]).to.be.closeTo(expected[0], DELTA);
    expect(actual[1]).to.be.closeTo(expected[1], DELTA);
  }
}

describe('transform', function() {

  it('works for Point', function() {
    var gg = {
      type: 'Point',
      coordinates: [-180, 90]
    };
    expectGeom(geo.transform(gg), {
      type: 'Point',
      coordinates: [-merc.EDGE, merc.EDGE]
    });
  });

  it('works for LineString', function() {
    var gg = {
      type: 'LineString',
      coordinates: [[-180, 90], [180, -90]]
    };
    expectGeom(geo.transform(gg), {
      type: 'LineString',
      coordinates: [[-merc.EDGE, merc.EDGE], [merc.EDGE, -merc.EDGE]]
    });
  });

  it('works for Polygon', function() {
    var gg = {
      type: 'Polygon',
      coordinates: [
        [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
        [[-110, -45], [-110, 45], [110, 45], [110, -45], [-110, -45]]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'Polygon',
      coordinates: [
        [[-merc.EDGE, -merc.EDGE], [merc.EDGE, -merc.EDGE], [merc.EDGE, merc.EDGE], [-merc.EDGE, merc.EDGE], [-merc.EDGE, -merc.EDGE]],
        [[-12245143.987260092, -5621521.486192067], [-12245143.987260092, 5621521.486192066], [12245143.987260092, 5621521.486192066], [12245143.987260092, -5621521.486192067], [-12245143.987260092, -5621521.486192067]]
      ]
    });
  });

  it('works for MultiPoint', function() {
    var gg = {
      type: 'MultiPoint',
      coordinates: [[0, 0], [180, 90]]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiPoint',
      coordinates: [[0, 0], [merc.EDGE, merc.EDGE]]
    });
  });

  it('works for MultiLineString', function() {
    var gg = {
      type: 'MultiLineString',
      coordinates: [
        [[-180, 90], [180, -90]],
        [[180, -90], [-180, 90]]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiLineString',
      coordinates: [
        [[-merc.EDGE, merc.EDGE], [merc.EDGE, -merc.EDGE]],
        [[merc.EDGE, -merc.EDGE], [-merc.EDGE, merc.EDGE]]
      ]
    });
  });

  it('works for MultiPolygon', function() {
    var gg = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]
        ], [
          [[-110, -45], [110, -45], [110, 45], [-110, 45], [-110, -45]]
        ]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiPolygon',
      coordinates: [
        [
          [[-merc.EDGE, -merc.EDGE], [merc.EDGE, -merc.EDGE], [merc.EDGE, merc.EDGE], [-merc.EDGE, merc.EDGE], [-merc.EDGE, -merc.EDGE]]
        ], [
          [[-12245143.987260092, -5621521.486192067], [12245143.987260092, -5621521.486192066], [12245143.987260092, 5621521.486192066], [-12245143.987260092, 5621521.486192067], [-12245143.987260092, -5621521.486192067]]
        ]
      ]
    });
  });

  it('works for GeometryCollection', function() {

    var gg = {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [-180, 90]
        }, {
          type: 'LineString',
          coordinates: [[-180, 90], [180, -90]]
        }
      ]
    };

    expectGeom(geo.transform(gg), {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [-merc.EDGE, merc.EDGE]
        }, {
          type: 'LineString',
          coordinates: [[-merc.EDGE, merc.EDGE], [merc.EDGE, -merc.EDGE]]
        }
      ]
    });
  });

  it('works for Feature', function() {

    var gg = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-180, 90]
      },
      properties: {
        foo: 'bar'
      }
    };

    var wm = geo.transform(gg);

    expect(wm.type).to.equal('Feature');
    expect(wm.properties).to.eql(gg.properties);
    expectGeom(wm.geometry, {
      type: 'Point',
      coordinates: [-merc.EDGE, merc.EDGE]
    });

  });

  it('works for FeatureCollection', function() {

    var gg = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-180, 90]
          },
          properties: {
            foo: 'bar'
          }
        }
      ]
    };

    var wm = geo.transform(gg);

    expect(wm.type).to.equal('FeatureCollection');
    expect(wm.features).to.be.an('array');
    expectGeom(wm.features[0].geometry, {
      type: 'Point',
      coordinates: [-merc.EDGE, merc.EDGE]
    });

  });

});

describe('getBbox()', function() {

  it('works for Point', function() {
    var bbox = geo.getBbox({
      type: 'Point',
      coordinates: [-110, 45]
    });
    expect(bbox).to.eql([-110, 45, -110, 45]);
  });

  it('works for LineString', function() {
    var bbox = geo.getBbox({
      type: 'LineString',
      coordinates: [[-110, 45], [110, -45]]
    });
    expect(bbox).to.eql([-110, -45, 110, 45]);
  });

  it('works for Polygon', function() {
    var bbox = geo.getBbox({
      type: 'Polygon',
      coordinates: [
        [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
        [[-110, -45], [-110, 45], [110, 45], [110, -45], [-110, -45]]
      ]
    });
    expect(bbox).to.eql([-180, -90, 180, 90]);
  });

  it('works for MultiPoint', function() {
    var bbox = geo.getBbox({
      type: 'MultiPoint',
      coordinates: [[-110, 45], [0, 0]]
    });
    expect(bbox).to.eql([-110, 0, 0, 45]);
  });

  it('works for MultiLineString', function() {
    var bbox = geo.getBbox({
      type: 'MultiLineString',
      coordinates: [
        [[-110, 45], [110, -45]],
        [[-180, 45], [110, -55]]
      ]
    });
    expect(bbox).to.eql([-180, -55, 110, 45]);
  });

  it('works for MultiPolygon', function() {
    var bbox = geo.getBbox({
      type: 'MultiPolygon',
      coordinates: [
        [
          [[-180, -90], [0, -90], [0, 10], [-180, 10], [-180, -90]]
        ], [
          [[-110, -45], [110, -45], [110, 45], [-110, 45], [-110, -45]]
        ]
      ]
    });
    expect(bbox).to.eql([-180, -90, 110, 45]);
  });

  it('works for GeometryCollection', function() {
    var bbox = geo.getBbox({
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          coordinates: [
            [[-180, -90], [0, -90], [0, 10], [-180, 10], [-180, -90]]
          ]
        }, {
          type: 'Point',
          coordinates: [10, 23]
        }
      ]
    });
    expect(bbox).to.eql([-180, -90, 10, 23]);
  });

  it('works for Feature', function() {
    var bbox = geo.getBbox({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-180, -90], [0, -90], [0, 10], [-180, 10], [-180, -90]]
        ]
      }
    });
    expect(bbox).to.eql([-180, -90, 0, 10]);
  });

  it('works for FeatureCollection', function() {
    var bbox = geo.getBbox({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [[-180, -90], [0, -90], [0, 10], [-180, 10], [-180, -90]]
            ]
          }
        }, {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [10, 23]
          }
        }
      ]
    });
    expect(bbox).to.eql([-180, -90, 10, 23]);
  });

});
