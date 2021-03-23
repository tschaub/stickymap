/**
 * The map failed to load completely.
 * @param {string} message Error message.
 * @param {Array<LayerLoadError>} errors Layer load errors that resulted in the
 *     map not fully loading.
 * @constructor
 */
function MapLoadError(message, errors) {
  /**
   * A message providing details about the error.
   * @type {string}
   */
  this.message = message;

  /**
   * All layer load errors.
   * @type {Array<LayerLoadError}
   */
  this.errors = errors;

  /**
   * The stack trace for the error.
   * @type {string}
   */
  this.stack = new Error().stack;
}
MapLoadError.prototype = new Error();
MapLoadError.prototype.name = 'MapLoadError';

/**
 * The layer failed to load.
 * @param {string} message Error message.
 * @param {Object} layer The layer instance.
 * @constructor
 */
function LayerLoadError(message, layer) {
  /**
   * A message providing details about the error.
   * @type {string}
   */
  this.message = message;

  /**
   * The layer.
   * @type {Object}
   */
  this.layer = layer;

  /**
   * The stack trace for the error.
   * @type {string}
   */
  this.stack = new Error().stack;
}
LayerLoadError.prototype = new Error();
LayerLoadError.prototype.name = 'LayerLoadError';

/**
 * The untiled layer failed to load.
 * @param {string} message Error message.
 * @param {Object} layer The layer instance.
 * @constructor
 */
function ImageLayerLoadError(message, layer) {
  LayerLoadError.apply(this, arguments);
}
ImageLayerLoadError.prototype = new LayerLoadError();
ImageLayerLoadError.prototype.name = 'ImageLayerLoadError';

/**
 * The tile layer failed to load.
 * @param {string} message Error message.
 * @param {Object} layer The layer instance.
 * @constructor
 */
function TileLayerLoadError(message, layer) {
  LayerLoadError.apply(this, arguments);
}
TileLayerLoadError.prototype = new LayerLoadError();
TileLayerLoadError.prototype.name = 'TileLayerLoadError';

/**
 * The tile failed to load.
 * @param {string} message Error message.
 * @param {Object} tile The tile instance.
 * @constructor
 */
function TileLoadError(message, tile) {
  /**
   * A message providing details about the error.
   * @type {string}
   */
  this.message = message;

  /**
   * The tile.
   * @type {Object}
   */
  this.tile = tile;

  /**
   * The stack trace for the error.
   * @type {string}
   */
  this.stack = new Error().stack;
}
TileLoadError.prototype = new LayerLoadError();
TileLoadError.prototype.name = 'TileLoadError';

export {
  MapLoadError,
  LayerLoadError,
  ImageLayerLoadError,
  TileLayerLoadError,
  TileLoadError
};
