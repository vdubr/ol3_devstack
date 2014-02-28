goog.require('Proj4js.Proj');

casper.test.begin('Testing points transform', 4, function suite(test) {

  /*
   * test edit and copy from library proj4js
   *    http://github.com/proj4js/proj4js
   */

  var wgs84 = new Proj4js.Proj('WGS84');
  var xyEPSLN = 1.0e-2;
  var llEPSLN = 1.0e-6;

  var testPoints = [
    {
      code: 'EPSG:3857',
      xy: [-8531595.34908, 6432756.94421],
      ll: [-76.640625, 49.921875]
    },
    {
      code: 'EPSG:5514',
      xy: [-868208.61, -1095793.64],
      ll: [12.806988, 49.452262]
    }
  ];


  var testTransform = function(from, to, point, result, EPSLN) {

    var xyResult = Proj4js.transform(from, to, new Proj4js.Point(point));

    if (xyResult) {
      var deltaX = Math.abs(xyResult.x - result[0]);
      var deltaY = Math.abs(xyResult.y - result[1]);
      test.assert(deltaX < EPSLN && deltaY < EPSLN,
          'transform from ' + from.code + ' to ' + to.code + ' is ok');
    } else {
      test.fail('proj ' + (from && from.code) + ' or ' +
          (to && to.code) + ' undefined');
    }

  };


  for (var i = 0; i < testPoints.length; ++i) {

    var point = testPoints[i];
    var proj = new Proj4js.Proj(point.code);

    testTransform(wgs84, proj, point.ll, point.xy, xyEPSLN);
    testTransform(proj, wgs84, point.xy, point.ll, llEPSLN);

  }


  test.done();
});
