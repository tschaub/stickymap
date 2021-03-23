import StickyMap from './StickyMap.js';

export default function(config) {
  const map = new StickyMap(config);
  map.load();
  return map.canvas;
}
