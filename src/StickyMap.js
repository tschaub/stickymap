import {MapLoadError} from './errors.js';
import TileLayer from './TileLayer.js';
import ImageLayer from './ImageLayer.js';
import VectorLayer from './VectorLayer.js';
import {transform as geoTransform, getBbox, scaleBbox} from './geo.js';
import {forward} from './merc.js';
import {resolveDimensions, expandUrl} from './util.js';
import {setGeometryPath} from './path.js';

function StickyMap(config) {
  let bbox;
  if (config.fit) {
    if (Array.isArray(config.fit)) {
      bbox = config.fit;
    } else {
      bbox = getBbox(config.fit);
    }
  } else {
    if (config.clip) {
      bbox = getBbox(config.clip);
    } else {
      throw new Error('Map must have fit or clip');
    }
  }

  const dimensions = resolveDimensions({
    bbox: scaleBbox(forward(bbox), config.scale || 1),
    width: config.width,
    height: config.height
  });

  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext('2d');

  const transform = [
    1 / dimensions.resolution,
    0,
    0,
    -1 / dimensions.resolution,
    -dimensions.bbox[0] / dimensions.resolution,
    dimensions.bbox[3] / dimensions.resolution
  ];
  if (config.clip) {
    setClipPath(context, geoTransform(config.clip), transform);
  }

  const render = this._render.bind(this);

  const errors = [];
  let loaded = 0;
  const layers = config.layers.map(function(layerConfig) {
    if (layerConfig.vector) {
      return new VectorLayer({
        id: layerConfig.id,
        context: context,
        data: layerConfig.vector,
        style: layerConfig.style,
        transform: transform,
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
    }

    if (layerConfig.untiled) {
      return new ImageLayer({
        id: layerConfig.id,
        context: context,
        resolution: dimensions.resolution,
        bbox: dimensions.bbox,
        imageBbox: layerConfig.bbox ? forward(layerConfig.bbox) : null,
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
    }

    const bbox = dimensions.bbox;
    let layerBbox = layerConfig.bbox;
    if (layerBbox) {
      if (!Array.isArray(layerBbox)) {
        layerBbox = getBbox(layerBbox);
      }
    }
    let urls = layerConfig.urls;
    if (!urls) {
      urls = expandUrl(layerConfig.url);
    }

    return new TileLayer({
      id: layerConfig.id,
      context: context,
      resolution: dimensions.resolution,
      bbox: bbox,
      layerBbox: layerBbox ? forward(layerBbox) : bbox,
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
  setGeometryPath(context, obj, transform);
  context.clip();
}

export default StickyMap;
