const MapLoadError = require('./errors').MapLoadError;
const TileLayer = require('./tile-layer');
const ImageLayer = require('./image-layer');
const geo = require('./geo');
const merc = require('./merc');
const util = require('./util');

function StickyMap(config) {
  let bbox;
  if (config.fit) {
    if (Array.isArray(config.fit)) {
      bbox = config.fit;
    } else {
      bbox = geo.getBbox(config.fit);
    }
  } else {
    if (config.clip) {
      bbox = geo.getBbox(config.clip);
    } else {
      throw new Error('Map must have fit or clip');
    }
  }

  const dimensions = util.resolveDimensions({
    bbox: merc.forward(bbox),
    width: config.width,
    height: config.height
  });

  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext('2d');

  if (config.clip) {
    const transform = [
      1 / dimensions.resolution,
      0,
      0,
      -1 / dimensions.resolution,
      -dimensions.bbox[0] / dimensions.resolution,
      dimensions.bbox[3] / dimensions.resolution
    ];
    setClipPath(context, geo.transform(config.clip), transform);
  }

  const render = this._render.bind(this);

  const errors = [];
  let loaded = 0;
  const layers = config.layers.map(function(layerConfig) {
    if (layerConfig.untiled) {
      return new ImageLayer({
        id: layerConfig.id,
        context: context,
        resolution: dimensions.resolution,
        bbox: dimensions.bbox,
        imageBbox: layerConfig.bbox ? merc.forward(layerConfig.bbox) : null,
        url: layerConfig.url,
        onLoad: function(error) {
          loaded += 1;
          if (!error) {
            render();
          } else {
            errors.push(error);
          }
          if (loaded === layers.length && config.onLoad) {
            let loadError;
            if (errors.length > 0) {
              loadError = new MapLoadError('Map failed to load', errors);
            }
            config.onLoad(loadError);
          }
        }
      });
    } else {
      const bbox = dimensions.bbox;
      let layerBbox = layerConfig.bbox;
      if (layerBbox) {
        if (!Array.isArray(layerBbox)) {
          layerBbox = geo.getBbox(layerBbox);
        }
      }
      let urls = layerConfig.urls;
      if (!urls) {
        urls = util.expandUrl(layerConfig.url);
      }
      return new TileLayer({
        id: layerConfig.id,
        context: context,
        resolution: dimensions.resolution,
        bbox: bbox,
        layerBbox: layerBbox ? merc.forward(layerBbox) : bbox,
        urls: urls,
        maxZoom: layerConfig.maxZoom,
        onTileLoad: function(error) {
          if (!error) {
            render();
          }
        },
        onLoad: function(error) {
          loaded += 1;
          if (error) {
            errors.push(error);
          }
          if (loaded === layers.length && config.onLoad) {
            let loadError;
            if (errors.length > 0) {
              loadError = new MapLoadError('Map failed to load', errors);
            }
            config.onLoad(loadError);
          }
        }
      });
    }
  });

  this.layers = layers;
  this.canvas = canvas;
}

StickyMap.prototype.load = function() {
  this.layers.forEach(function(layer) {
    layer.load();
  });
};

StickyMap.prototype._render = function() {
  this.layers.forEach(function(layer) {
    layer.render();
  });
};

function setClipPath(context, obj, transform) {
  context.beginPath();
  setGeoClipPath(context, obj, transform);
  context.clip();
}

function setGeoClipPath(context, obj, transform) {
  switch (obj.type) {
    case 'Polygon':
      setPolygonPath(context, obj.coordinates, transform);
      break;
    case 'MultiPolygon':
      setMultiPolygonPath(context, obj.coordinates, transform);
      break;
    case 'GeometryCollection':
      obj.geometries.forEach(function(geometry) {
        setGeoClipPath(context, geometry, transform);
      });
      break;
    case 'Feature':
      setGeoClipPath(context, obj.geometry, transform);
      break;
    case 'FeatureCollection':
      obj.features.forEach(function(feature) {
        setGeoClipPath(context, feature.geometry, transform);
      });
      break;
    default:
    // do nothing
  }
}

function setPolygonPath(context, coordinates, transform) {
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    const ring = coordinates[i];
    for (let j = 0, jj = ring.length; j < jj; ++j) {
      const coord = ring[j];
      if (j === 0) {
        context.moveTo.apply(context, applyTransform(transform, coord));
      } else {
        context.lineTo.apply(context, applyTransform(transform, coord));
      }
    }
  }
}

function setMultiPolygonPath(context, coordinates, transform) {
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    setPolygonPath(context, coordinates[i], transform);
  }
}

function applyTransform(transform, coordinate) {
  const x = coordinate[0];
  const y = coordinate[1];
  return [
    transform[0] * x + transform[2] * y + transform[4],
    transform[1] * x + transform[3] * y + transform[5]
  ];
}

module.exports = StickyMap;
