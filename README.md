# This is a utility to merge a MultiPolygon into a single Polygon

This tool reads in a GeoJSON file containing two disconnected polygons. It finds the closest points of each polygon and then redraws the polygons with a single line connecting the two.

# Setup

`yarn install`

## Example

`yarn run merge --input test.geojson --output out.json`
