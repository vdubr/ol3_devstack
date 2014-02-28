goog.require('goog.math');
goog.require('gs.interaction.Measure');

casper.test.begin('Output area', 2, function suite(test) {

  var polygon = new ol.geom.Polygon([[
    [1770961.56829, 6467426.26286],
    [1770974.8788, 6467425.96924],
    [1770974.38944, 6467405.12264],
    [1770961.1768, 6467405.41626]
  ]]);
  var unit = new gs.unit.Unit();
  unit.setSystem('metric');

  var measure = new gs.interaction.Measure('Polygon', unit);
  var output = measure.getPolygonOutput_(polygon);

  test.assertEqual(output.area, '114 m2', 'Area is corect');

  test.assertEqual(output.perimeter, '43.8 m', 'Length is corect');

  casper.run(function() {
    test.done();
  });
});



casper.test.begin('Measure length', 1, function suite(test) {
  var unit = new gs.unit.Unit();
  unit.setSystem('metric');

  var line = new ol.geom.LineString([
    [1770961.56829, 6467426.26286],
    [1770974.8788, 6467425.96924]
  ]);
  var measure = new gs.interaction.Measure('LineString', unit);
  var output = measure.getLineOutput_(line);

  test.assertEqual(output.length, '8.55 m', 'Length is corect');

  casper.run(function() {
    test.done();
  });
});
