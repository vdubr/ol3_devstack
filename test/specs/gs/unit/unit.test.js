casper.test.begin('Can transform units', 5, function suite(test) {
  var unit = new gs.unit.Unit();

  var systemsIds = unit.getSystemsId();

  var fId = goog.array.contains(systemsIds, 'metric');
  var sId = goog.array.contains(systemsIds, 'imperial');
  test.assertEquals(fId && sId, true, 'Systems Id contain right values');

  var systems = unit.getSystems();
  test.assertEquals(systems.length, 2, 'Systems contain two objects');

  var metricSystem = unit.getSystemById('metric');
  var imperialSystem = unit.getSystemById('imperial');

  test.assertEquals(metricSystem.name, 'metric', 'Unit contain metric systems');
  test.assertEquals(
      imperialSystem.name, 'imperial', 'Unit contain imperial systems');


  ///TEST for system
  unit.setSystem('metric');
  var actSys1 = unit.getActualSystem();
  test.assertEquals(actSys1.name, 'metric', 'Actual system is set right');

  test.done();
});

casper.test.begin('Can set custom unit system', 7, function suite(test) {
  var custom = {
    name: 'custom',
    ranges: {
      Area: [
        {
          min: 0,
          max: 0.1,
          unit: 'm2',
          decimal: 2
        }, {
          min: 0.1,
          max: 10,
          unit: 'm2',
          decimal: 1
        }, {
          min: 10,
          max: 100000,
          unit: 'm2',
          decimal: 0
        },
        {
          min: 100000,
          max: 10000000,
          unit: 'km2',
          decimal: 2
        },
        {
          min: 1000000,
          max: null,
          unit: 'km2',
          decimal: 0
        }
      ],
      Length: [
        {
          min: 0,
          max: 1,
          unit: 'cm',
          decimal: 1
        }, {
          min: 1,
          max: 10,
          unit: 'm',
          decimal: 2
        },
        {
          min: 10,
          max: 1000,
          unit: 'm',
          decimal: 1
        },
        {
          min: 1000,
          max: 10000,
          unit: 'km',
          decimal: 2
        },{
          min: 10000,
          max: 100000,
          unit: 'km',
          decimal: 1
        }, {
          min: 100000,
          max: null,
          unit: 'km',
          decimal: 0
        }
      ]
    }
  };



  var unit = new gs.unit.Unit();
  unit.addSystem(custom);
  unit.setSystem('custom');

  var systemsIds = unit.getSystemsId();

  var cId = goog.array.contains(systemsIds, 'custom');
  test.assertEquals(cId, true, 'Systems Id contain right values');

  var systems = unit.getSystems();
  test.assertEquals(systems.length, 3, 'Systems contain three objects');

  var customSystem = unit.getSystemById('custom');
  test.assertEquals(customSystem.name, 'custom', 'Unit contain custom system');

  test.assertEquals(
      customSystem.ranges.Area.length, 5, 'system has area renges');
  test.assertEquals(customSystem.ranges.Length.length, 6,
      'system has length renges');

  //set custom ranges
  var customRanges = {
    Area: [
      {
        min: 0,
        max: 0.1,
        unit: 'm2',
        decimal: 2
      }, {
        min: 0.1,
        max: 10,
        unit: 'm2',
        decimal: 1
      }
    ],
    Length: [
      {
        min: 0,
        max: 1,
        unit: 'cm',
        decimal: 1
      }, {
        min: 1,
        max: 10,
        unit: 'm',
        decimal: 2
      },
      {
        min: 10,
        max: 1000,
        unit: 'm',
        decimal: 1
      }
    ]
  };

  unit.setRange(customRanges);
  var customSystem2 = unit.getSystemById('custom');

  test.assertEquals(
      customSystem2.ranges.Area.length, 2, 'system has area ranges');
  test.assertEquals(customSystem2.ranges.Length.length, 3,
      'system has length renges');
  test.done();
});




casper.test.begin('Unit class transform values in metric', 2,
    function suite(test) {

      var unit = new gs.unit.Unit();
      unit.setSystem('metric');

      var km2base = unit.getInBaseUnit(56, 'km2');
      test.assertEquals(km2base.value, 56000000, 'Transform km2 base unit');

      var kmbase = unit.getInBaseUnit(56, 'km');
      test.assertEquals(kmbase.value, 56000, 'Transform km base unit');

      test.done();
    });



casper.test.begin('Get best values', 9, function suite(test) {

  var unit = new gs.unit.Unit();
  unit.setSystem('metric');

  var v1 = unit.getBestAreaValue(0.000001);
  test.assertEquals(v1.value, '0.00', 'Best value 0.000001 m');

  var v2 = unit.getBestAreaValue(0);
  test.assertEquals(v2.value, '0.00', 'Best value 0 m');

  var v3 = unit.getBestAreaValue(0.1);
  test.assertEquals(v3.value, '0.1', 'Best value 0.1 m');

  var v4 = unit.getBestAreaValue(8);
  test.assertEquals(v4.value, '8.0', 'Best value 8 m');

  var v5 = unit.getBestAreaValue(100);
  test.assertEquals(v5.value, '100', 'Best value 100 m');

  var v6 = unit.getBestAreaValue(140000);
  test.assertEquals(v6.value, '0.14', 'Best value 140000 m');

  var v7 = unit.getBestAreaValue(10000000);
  test.assertEquals(v7.value, '10', 'Best value 10000000 m');

  var v8 = unit.getBestAreaValue(1000000000000);
  test.assertEquals(v8.value, '1000000', 'Best value 1000000000000 m');

  unit.setSystem('imperial');


  var i1 = unit.getBestLengthValue(4000);
  test.assertEquals(i1.value, '2.5', 'Best value 4000 m');

  test.done();
});
