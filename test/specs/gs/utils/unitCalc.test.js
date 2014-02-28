casper.test.begin('UnitCalc transform values in metric', 12,
    function suite(test) {


      var mm = gs.utils.unitCalc.recalculateLengthToMeters(56, 'mm');
      test.assertEquals(mm.value, 0.056, 'Transform mm to m');

      var cm = gs.utils.unitCalc.recalculateLengthToMeters(56, 'cm');
      test.assertEquals(cm.value, 0.56, 'Transform cm to m');

      var dm = gs.utils.unitCalc.recalculateLengthToMeters(56, 'dm');
      test.assertEquals(dm.value, 5.6, 'Transform dm to m');

      var m = gs.utils.unitCalc.recalculateLengthToMeters(56, 'm');
      test.assertEquals(m.value, 56, 'Transform m to m');

      var km = gs.utils.unitCalc.recalculateLengthToMeters(56, 'km');
      test.assertEquals(km.value, 56000, 'Transform km to m');

      var mm2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'mm2');
      test.assertEquals(mm2.value, 0.000056, 'Transform mm2 to m2');

      var cm2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'cm2');
      test.assertEquals(cm2.value, 0.0056, 'Transform cm2 to m2');

      var dm2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'dm2');
      test.assertEquals(dm2.value, 0.56, 'Transform dm2 to m2');

      var m2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'm2');
      test.assertEquals(m2.value, 56, 'Transform m2 to m2');

      var a = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'a');
      test.assertEquals(a.value, 5600, 'Transform a to m2');

      var ha = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'ha');
      test.assertEquals(ha.value, 560000, 'Transform ha to m2');

      var km2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'km2');
      test.assertEquals(km2.value, 56000000, 'Transform km2 to m2');

      test.done();
    });


casper.test.begin('UnitCalc transform values in imperial', 11,
    function suite(test) {

      var inches = gs.utils.unitCalc.recalculateLengthToMeters(56, 'inches');
      inchesVal = goog.string.padNumber(inches.value, 0, 3);
      test.assertEquals(inchesVal, '1.422', 'Transform inches to m');

      var ft = gs.utils.unitCalc.recalculateLengthToMeters(56, 'ft');
      ftVal = goog.string.padNumber(ft.value, 0, 3);
      test.assertEquals(ftVal, '17.069', 'Transform ft to m');

      var yd = gs.utils.unitCalc.recalculateLengthToMeters(56, 'yd');
      ydVal = goog.string.padNumber(yd.value, 0, 3);
      test.assertEquals(ydVal, '51.206', 'Transform yd to m');

      var mi = gs.utils.unitCalc.recalculateLengthToMeters(56, 'mi');
      miVal = goog.string.padNumber(mi.value, 0, 3);
      test.assertEquals(miVal, '90123.264', 'Transform mi to m');

      var yd2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'yd2');
      yd2Val = goog.string.padNumber(yd2.value, 0, 3);
      test.assertEquals(yd2Val, '46.823', 'Transform yd2 to m2');

      var inches2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(
          56, 'inches2');
      inches2Val = goog.string.padNumber(inches2.value, 0, 3);
      test.assertEquals(inches2Val, '0.036', 'Transform inches2 to m2');

      var ft2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'ft2');
      ft2Val = goog.string.padNumber(ft2.value, 0, 3);
      test.assertEquals(ft2Val, '5.203', 'Transform ft2 to m2');

      var ac = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'ac');
      acVal = goog.string.padNumber(ac.value, 0, 3);
      test.assertEquals(acVal, '226623.960', 'Transform ac to m2');

      var mi2 = gs.utils.unitCalc.recalculateAreaToSquareMeters(56, 'mi2');
      mi2Val = goog.string.padNumber(mi2.value, 0, 3);
      test.assertEquals(mi2Val, '145039334.179', 'Transform mi2 to m2');

      var miToYd = gs.utils.unitCalc.convertUnits(56, 'mi', 'yd');
      miToYdVal = goog.string.padNumber(miToYd.value, 0, 3);
      test.assertEquals(miToYdVal, '98560.000', 'Transform mi to yd');

      var ftToInches = gs.utils.unitCalc.convertUnits(1, 'ft', 'inches');
      ftToInchesVal = goog.string.padNumber(ftToInches.value, 0, 3);
      test.assertEquals(ftToInchesVal, '12.000', 'Transform ft to inches');

      test.done();
    });
