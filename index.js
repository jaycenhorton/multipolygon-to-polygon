const turf = require('@turf/turf');
const argv = require('yargs').argv;
const fs = require('fs');

const writeFile = ({ geoCollection }) => {
  console.log(
    '\nThe GeoJSON to be written to the output file is:\n\n',
    JSON.stringify(geoCollection)
  );
  fs.writeFile('out.json', JSON.stringify(geoCollection), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
};

const createGeoJSON = coordinates => {
  const feature = {
    type: 'Polygon',
    coordinates: [coordinates],
  };
  const collection = turf.geometryCollection([feature]);
  return collection;
};

const drawShortestPathBetweenPolys = ({ coordinates }) => {
  return turf.multiPolygon([coordinates]).geometry.coordinates.map(polygons => {
    const [poly1, poly2] = polygons;
    let shortest1 = 100000000000000000000;
    let shortest2 = turf.distance(poly1[0], poly2[0]);
    let closest1 = [poly1[0], poly2[0]];
    let closest2 = [poly1[0], poly2[0]];
    let closestIndex1 = 0;
    let closestIndex2 = 0;
    poly1.map((coordinates, i) => {
      for (let j = 0; j < poly2.length; j++) {
        const distance = turf.distance(poly1[i], poly2[j]);
        if (distance < shortest1) {
          closest1 = coordinates;
          shortest1 = distance;
          closestIndex1 = i;
        }
      }
    });
    console.log('\nThe closest point in polygon 1 to polygon 2 is', closest1);
    poly2.map((coordinates, i) => {
      for (let j = 0; j < poly1.length; j++) {
        const distance = turf.distance(poly1[j], poly2[i]);
        if (distance < shortest2) {
          closest2 = coordinates;
          shortest2 = distance;
          closestIndex2 = i;
        }
      }
    });
    console.log('The closest point in polygon 1 to polygon 2 is', closest2);
    const poly1End = poly1.splice(0, closestIndex1);
    const newPoly1 = poly1.concat(poly1End).concat([closest1]);
    const poly2End = poly2.splice(0, closestIndex2);
    const newPoly2 = poly2.concat(poly2End).concat([closest1]);
    const newGeo = [...newPoly1, ...newPoly2];
    console.log(
      'Polygons redrawn with connection between',
      closest1,
      'and',
      closest2
    );

    const collection = createGeoJSON(newGeo);
    return collection;
  });
};

if (argv.input && argv.output) {
  const {
    features: [
      {
        geometry: { coordinates },
      },
    ],
  } = JSON.parse(fs.readFileSync(argv.input, 'utf8'));
  const [geoCollection] = drawShortestPathBetweenPolys({ coordinates });
  writeFile({ geoCollection });
} else {
  console.log(
    'You must specify the input GeoJSON file and the output file location'
  );
}
