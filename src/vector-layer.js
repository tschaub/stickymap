const setGeometryPath = require('./path').setGeometryPath;
const geo = require('./geo');

const defaultStyle = {
  lineWidth: 1.5,
  strokeStyle: 'orange'
};

function VectorLayer(config) {
  this.id = config.id;
  this.data = geo.transform(config.data);
  this.style = config.style || defaultStyle;
  this.context = config.context;
  this.transform = config.transform;
  this.onLoad = config.onLoad;
}

VectorLayer.prototype.load = function() {
  this.onLoad();
};

VectorLayer.prototype.render = function() {
  const context = this.context;

  for (const key in this.style) {
    context[key] = this.style[key];
  }

  context.beginPath();

  setGeometryPath(context, this.data, this.transform);

  if ('fillStyle' in this.style) {
    context.fill();
  }
  if ('strokeStyle' in this.style || 'lineWidth' in this.style) {
    context.stroke();
  }
};

module.exports = VectorLayer;
