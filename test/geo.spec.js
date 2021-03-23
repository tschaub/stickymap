import * as geo from '../src/geo.js';
import * as merc from '../src/merc.js';
import {expect} from 'chai';

const DELTA = 1e-8;

function expectGeom(actual, expected) {
  expect(actual).to.be.an('object');
  expect(actual.type).to.equal(expected.type);
  if (expected.type === 'GeometryCollection') {
    expect(actual.geometries).to.be.an('array');
    expect(actual.geometries.length).to.equal(expected.geometries.length);
    for (let i = 0, ii = actual.geometries.length; i < ii; ++i) {
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
    for (let i = 0, ii = expected.length; i < ii; ++i) {
      expectCoordinates(actual[i], expected[i]);
    }
  } else {
    expect(actual[0]).to.be.closeTo(expected[0], DELTA);
    expect(actual[1]).to.be.closeTo(expected[1], DELTA);
  }
}

describe('scaleBbox', function() {
  it('returns the same for scale of 1', function() {
    const bbox = [1, 2, 3, 4];
    expect(geo.scaleBbox(bbox, 1)).to.eql([1, 2, 3, 4]);
  });

  it('applies a scale factor', function() {
    const bbox = [-10, -5, 10, 5];
    expect(geo.scaleBbox(bbox, 2)).to.eql([-20, -10, 20, 10]);
  });
});

describe('transform', function() {
  it('works for Point', function() {
    const gg = {
      type: 'Point',
      coordinates: [-180, 90]
    };
    expectGeom(geo.transform(gg), {
      type: 'Point',
      coordinates: [-merc.EDGE, merc.EDGE]
    });
  });

  it('works for LineString', function() {
    const gg = {
      type: 'LineString',
      coordinates: [
        [-180, 90],
        [180, -90]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'LineString',
      coordinates: [
        [-merc.EDGE, merc.EDGE],
        [merc.EDGE, -merc.EDGE]
      ]
    });
  });

  it('works for Polygon', function() {
    const gg = {
      type: 'Polygon',
      coordinates: [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90]
        ],
        [
          [-110, -45],
          [-110, 45],
          [110, 45],
          [110, -45],
          [-110, -45]
        ]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'Polygon',
      coordinates: [
        [
          [-merc.EDGE, -merc.EDGE],
          [merc.EDGE, -merc.EDGE],
          [merc.EDGE, merc.EDGE],
          [-merc.EDGE, merc.EDGE],
          [-merc.EDGE, -merc.EDGE]
        ],
        [
          [-12245143.987260092, -5621521.486192067],
          [-12245143.987260092, 5621521.486192066],
          [12245143.987260092, 5621521.486192066],
          [12245143.987260092, -5621521.486192067],
          [-12245143.987260092, -5621521.486192067]
        ]
      ]
    });
  });

  it('works for MultiPoint', function() {
    const gg = {
      type: 'MultiPoint',
      coordinates: [
        [0, 0],
        [180, 90]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiPoint',
      coordinates: [
        [0, 0],
        [merc.EDGE, merc.EDGE]
      ]
    });
  });

  it('works for MultiLineString', function() {
    const gg = {
      type: 'MultiLineString',
      coordinates: [
        [
          [-180, 90],
          [180, -90]
        ],
        [
          [180, -90],
          [-180, 90]
        ]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiLineString',
      coordinates: [
        [
          [-merc.EDGE, merc.EDGE],
          [merc.EDGE, -merc.EDGE]
        ],
        [
          [merc.EDGE, -merc.EDGE],
          [-merc.EDGE, merc.EDGE]
        ]
      ]
    });
  });

  it('works for MultiPolygon', function() {
    const gg = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90],
            [-180, -90]
          ]
        ],
        [
          [
            [-110, -45],
            [110, -45],
            [110, 45],
            [-110, 45],
            [-110, -45]
          ]
        ]
      ]
    };
    expectGeom(geo.transform(gg), {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-merc.EDGE, -merc.EDGE],
            [merc.EDGE, -merc.EDGE],
            [merc.EDGE, merc.EDGE],
            [-merc.EDGE, merc.EDGE],
            [-merc.EDGE, -merc.EDGE]
          ]
        ],
        [
          [
            [-12245143.987260092, -5621521.486192067],
            [12245143.987260092, -5621521.486192066],
            [12245143.987260092, 5621521.486192066],
            [-12245143.987260092, 5621521.486192067],
            [-12245143.987260092, -5621521.486192067]
          ]
        ]
      ]
    });
  });

  it('works for GeometryCollection', function() {
    const gg = {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [-180, 90]
        },
        {
          type: 'LineString',
          coordinates: [
            [-180, 90],
            [180, -90]
          ]
        }
      ]
    };

    expectGeom(geo.transform(gg), {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [-merc.EDGE, merc.EDGE]
        },
        {
          type: 'LineString',
          coordinates: [
            [-merc.EDGE, merc.EDGE],
            [merc.EDGE, -merc.EDGE]
          ]
        }
      ]
    });
  });

  it('works for Feature', function() {
    const gg = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-180, 90]
      },
      properties: {
        foo: 'bar'
      }
    };

    const wm = geo.transform(gg);

    expect(wm.type).to.equal('Feature');
    expect(wm.properties).to.eql(gg.properties);
    expectGeom(wm.geometry, {
      type: 'Point',
      coordinates: [-merc.EDGE, merc.EDGE]
    });
  });

  it('works for FeatureCollection', function() {
    const gg = {
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

    const wm = geo.transform(gg);

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
    const bbox = geo.getBbox({
      type: 'Point',
      coordinates: [-110, 45]
    });
    expect(bbox).to.eql([-110, 45, -110, 45]);
  });

  it('works for LineString', function() {
    const bbox = geo.getBbox({
      type: 'LineString',
      coordinates: [
        [-110, 45],
        [110, -45]
      ]
    });
    expect(bbox).to.eql([-110, -45, 110, 45]);
  });

  it('works for Polygon', function() {
    const bbox = geo.getBbox({
      type: 'Polygon',
      coordinates: [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90]
        ],
        [
          [-110, -45],
          [-110, 45],
          [110, 45],
          [110, -45],
          [-110, -45]
        ]
      ]
    });
    expect(bbox).to.eql([-180, -90, 180, 90]);
  });

  it('works for MultiPoint', function() {
    const bbox = geo.getBbox({
      type: 'MultiPoint',
      coordinates: [
        [-110, 45],
        [0, 0]
      ]
    });
    expect(bbox).to.eql([-110, 0, 0, 45]);
  });

  it('works for MultiLineString', function() {
    const bbox = geo.getBbox({
      type: 'MultiLineString',
      coordinates: [
        [
          [-110, 45],
          [110, -45]
        ],
        [
          [-180, 45],
          [110, -55]
        ]
      ]
    });
    expect(bbox).to.eql([-180, -55, 110, 45]);
  });

  it('works for MultiPolygon', function() {
    const bbox = geo.getBbox({
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-180, -90],
            [0, -90],
            [0, 10],
            [-180, 10],
            [-180, -90]
          ]
        ],
        [
          [
            [-110, -45],
            [110, -45],
            [110, 45],
            [-110, 45],
            [-110, -45]
          ]
        ]
      ]
    });
    expect(bbox).to.eql([-180, -90, 110, 45]);
  });

  it('works for GeometryCollection', function() {
    const bbox = geo.getBbox({
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          coordinates: [
            [
              [-180, -90],
              [0, -90],
              [0, 10],
              [-180, 10],
              [-180, -90]
            ]
          ]
        },
        {
          type: 'Point',
          coordinates: [10, 23]
        }
      ]
    });
    expect(bbox).to.eql([-180, -90, 10, 23]);
  });

  it('works for Feature', function() {
    const bbox = geo.getBbox({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -90],
            [0, -90],
            [0, 10],
            [-180, 10],
            [-180, -90]
          ]
        ]
      }
    });
    expect(bbox).to.eql([-180, -90, 0, 10]);
  });

  it('works for FeatureCollection', function() {
    const bbox = geo.getBbox({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-180, -90],
                [0, -90],
                [0, 10],
                [-180, 10],
                [-180, -90]
              ]
            ]
          }
        },
        {
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
