/**
 * todo cover all methods
 */


casper.test.begin('Calculate area', 1, function suite(test) {

  var polygon = new ol.geom.Polygon([[
    [1770961.56829, 6467426.26286],
    [1770974.8788, 6467425.96924],
    [1770974.38944, 6467405.12264],
    [1770961.1768, 6467405.41626]
  ]]);

  var area = gs.utils.geographyCalc.getGeodesicArea(polygon);

  area = goog.string.padNumber(area, 0, 5);
  area = goog.string.toNumber(area);

  test.assertEqual(area, 113.70017, 'Area is corect');

  casper.run(function() {
    test.done();
  });
});



casper.test.begin('Calculate length', 1, function suite(test) {

  var line = new ol.geom.LineString([
    [1770961.56829, 6467426.26286],
    [1770974.8788, 6467425.96924]
  ]);

  var length = gs.utils.geographyCalc.getGeodesicLength(line);

  length = goog.string.padNumber(length, 0, 5);
  length = goog.string.toNumber(length);

  test.assertEqual(length, 8.55305, 'Length is corect');

  casper.run(function() {
    test.done();
  });
});
