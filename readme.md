# stickymap

Sticky maps are maps that are not slippy maps.  Meaning, if you want to use tiles or imagery that are typically rendered in a slippy map, but you don't need users to be able to interact with the rendered map, create a sticky map.

For example, if you wanted to embed a map of the state of Montana in a web page using imagery from Mapbox, you could do this:

```js
const map = stickymap({
  width: 500,
  clip: geoJson, // <- GeoJSON representing the state of Montana
  layers: [{
    url: 'https://{a-d}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-jul/{z}/{x}/{y}.png'
  }]
});

document.body.appendChild(map); // map is a Canvas element
```
![sticky map](https://cloud.githubusercontent.com/assets/41094/22658668/230c3834-ec58-11e6-8cc4-99314378075f.png)

## API

The `stickymap` function takes a map configuration and returns a `Canvas` element with the rendered map.  The map configuration properties are described below.

### `width`

The width (in pixels) of the map.  Either `width` or `height` (or both) must be provided.

### `height`

The height (in pixels) of the map.  Either `width` or `height` (or both) must be provided.

### `fit`

A GeoJSON object (of any type) or bounding box ([minLon, minLat, maxLon, maxLat] array) that will be used to calculate the extent of the map.  Either `fit` or `clip` must be provided.

### `clip`

A GeoJSON object (of any type) used as a clip path when rendering the map.  Areas outside `clip` will not be rendered.

### `scale`

An optional scale factor to apply.  If provided, the extent of the rendered map will be the extent of the `fit` or `clip` data multiplied by this factor (e.g. `scale: 2` will render twice the extent of the provided data).

### `onLoad`

Optional callback that will be called when the map finishes rendering.  The callback will be called with an `Error` if any resources failed to load during map rendering.

### `layers`

An array of layer configurations.  Layers are rendered from tiled imagery, from a single image, or from vector data (GeoJSON).

#### Tiled layer properties

Tiled layers must have a `url` or `urls` property.  An array of `urls` can be provided to fetch tiles from more than one subdomain (for example).  URLs must include `{x}`, `{y}`, and `{z}` placeholders.  If a single `url` is provided, it can include a range of numbers or characters that will be used to expand the URL into an array of URLs (`{0-4}` or `{a-d}` for example).

Tiled layers can have an optional `maxZoom` property to configure the maximum zoom level for requesting tiles.  For example, if a tile set is only available up to zoom level 15, set `maxZoom: 15`.

#### Image layer properties

Layers can be rendered from a single image by setting `untiled: true`.  Image layers must have a `bbox` property that describes the bounding box (`[minLon, minLat, maxLon, maxLat]`) of the image.  In addition, untiled layers must have a `url` property with the URL of the image to be rendered.

#### Vector layer properties

Vector layers must have a `vector` property whose value is any GeoJSON object.  Vector layers can have an optional `style` property to configure how the vector data is rendered.  Any canvas 2D context styling properties are supported.  For example, the config below would render the data with an aqua stroke and a partially transparent azure fill:

```js
style: {
  lineWidth: 1.5,
  strokeStyle: 'aqua',
  fillStyle: 'rgba(240, 255, 255, 0.5)'
}
```


[![Statys](https://github.com/tschaub/stickymap/actions/workflows/test.yml/badge.svg)](https://github.com/tschaub/stickymap/actions/workflows/test.yml)
