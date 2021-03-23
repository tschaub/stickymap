import {TileLoadError} from './errors.js';
import {SIZE} from './xyz.js';

function pick(urls, x, y, z) {
  const hash = (x << z) + y;
  const length = urls.length;
  const index = hash % length;
  return urls[index < 0 ? index + length : index];
}

const BLANK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function mod(n, m) {
  return ((n % m) + m) % m;
}

function Tile(urls, x, y, z, options) {
  this.urls = urls;
  this.x = x;
  this.y = y;
  this.z = z;
  this.options = options || {};
}

Tile.prototype.load = function(callback) {
  const image = new Image();
  const tile = this;

  const max = Math.pow(2, this.z);
  const x = mod(this.x, max);
  const template = pick(this.urls, x, this.y, this.z);
  const url = template
    .replace('{x}', x)
    .replace('{y}', this.y)
    .replace('{z}', this.z);

  image.addEventListener('load', function() {
    callback(null, tile);
  });
  image.addEventListener('error', function() {
    callback(new TileLoadError('Failed to load ' + url, tile));
  });

  image.width = SIZE;
  image.height = SIZE;
  this.image = image;

  if (this.z < 0) {
    image.src = BLANK;
    return;
  }

  if (this.y < 0 || this.y >= max) {
    image.src = BLANK;
    return;
  }

  if (this.options.crossOrigin) {
    image.crossOrigin = this.options.crossOrigin;
  }
  image.src = url;
};

export default Tile;
