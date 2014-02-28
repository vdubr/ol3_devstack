goog.require('gs.App');


var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile);


/**
 * setting path for language files
 */
gs.i18n.langUrl = curFilePath + '/../examples/lang/';


/**
 * tartget div
 */
var target = goog.dom.createElement('div');


/**
 * div id
 */
target.id = 'target';
goog.dom.getElementsByTagNameAndClass('body')[0].appendChild(target);
var app = new gs.App({target: 'target', lang: null});

casper.test.begin('Can create Application', 3, function suite(test) {

  test.assertEquals(app.getLang(), null, 'App language not set');

  /* test skipped
  app.setLang('eng');
  test.assertEquals(app.getLang(), 'eng', 'App language set to english');
  */
  test.skip(1, 'setLang skipped - XHR cannot load File://. ' +
      'Cross Origin requests are only supported for HTTP.');
  test.assertEquals(app.moo(), 'moo!', 'App moos');
  test.done();
});


/*
 *
 * Crate application with layers
 *
 */
var config = {
  'target': 'target',
  'lang': null,
  'map': /** @type {gs.MapOptions} */ ({
  }),
  'layers': [ /** @type {gs.LayerOptions} */ ({
    'type': 'wmts',
    'title': 'Ortofoto ČUZK',
    'projection': 'EPSG:3857',
    'options': {
      'matrixSet': 'googlemapscompatibleext2:epsg:3857',
      'url': 'http://geoportal.cuzk.cz/WMTS_ORTOFOTO_900913/WMTService.aspx',
      'layer': 'orto',
      'format': 'image/jpeg'
    }
  }),
  /** @type {gs.LayerOptions} */ ({
    'type': 'osm',
    'title': 'OSMap'
  })]
};

var app = new gs.App(config);

casper.test.begin('Can create Application with projection and layers',
    3, function suite(test) {

      proj = app.getMap().getView().getProjection();
      test.assertEquals(proj.getCode(), 'EPSG:3857', 'Test projection');

      var layers = app.getMap().getLayers();
      var layerArray = layers.getArray();
      test.assertEquals(layerArray.length, 2, 'Test layers count');

      var layerArray2 = app.getLayers();
      test.assertEquals(layerArray.length, layerArray2.length,
                    'Test layers count');

      test.done();
    });

casper.test.begin('Can create Application from configuration API url',
    1, function suite(test) {
      test.skip(1, 'Loading conf from API skipped');
      test.done();
    });
