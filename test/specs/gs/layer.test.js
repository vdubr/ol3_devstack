goog.require('gs.layer');
goog.require('ol.layer.Vector');

casper.test.begin('Testing setLayerBaseConfig()', 6, function suite(test) {
  var options = {
    'transId': 'myTransId',
    'name': 'myname',
    'title': 'mytitle',
    'attributions': 'myattributions'
  };
  var layer = new ol.layer.Vector({
    source: new ol.source.Source({
      projection: ol.proj.get('EPSG:4326')
    })
  });

  gs.layer.setLayerBaseConfig(layer, options);

  test.assertEquals(layer.get('name'), options['name'],
      'setLayerBaseConfig() Name set');
  test.assertEquals(layer.get('transId'), options['transId'],
      'setLayerBaseConfig() transId');
  test.assertEquals(layer.get('title'), options['title'],
      'setLayerBaseConfig() title');
  test.assertEquals(layer.get('attributions'), options['attributions'],
      'setLayerBaseConfig() attribution');
  test.assertEquals(layer.get('visible'), false,
      'setLayerBaseConfig() not visible');
  test.assertEquals(layer.get('displayInLayerswitcher'), true,
      'setLayerBaseConfig() Display in layerswitcher');

  test.done();
});

casper.test.begin('Testing creation of layers', 10, function suite(test) {
  var osm_options = {
    title: 'osm1',
    type: 'osm',
    transId: 'topomap',
    visible: true,
    url: 'http://otile1.mqcdn.com/tiles/1.0.0/map'
  };

  var wmts_options = {
    type: 'wmts',
    title: 'Ortofoto ČUZK',
    transId: 'ortomap',
    visible: false,
    projection: 'EPSG:3857',
    options: {
      matrixSet: 'googlemapscompatibleext2:epsg:3857',
      url: 'http://geoportal.cuzk.cz/WMTS_ORTOFOTO_900913/WMTService.aspx',
      layer: 'orto',
      format: 'image/jpeg',
      extent: null
    }
  };

  var gp_wmts_options = {
    id: 368305,
    name: 'Ortofoto (ČÚZK)',
    type: 'layer_gp_wmts',
    projection: 'EPSG:3857',
    matrixset: 'jtsk:epsg:5514',
    url: 'http://geoportal.cuzk.cz\/WMTS_ORTOFOTO\/WMTService.aspx?',
    layer: 'orto',
    format: 'image/jpeg'
  };

  var mapbox_options = {
    title: 'mapbox',
    transId: 'mapbox',
    type: 'mapbox',
    visible: false,
    options: {
      url: 'http://api.tiles.mapbox.com/v3/jachym.map-i11cnoet.jsonp'
    }
  };

  // TODO
  var gp_wms_options = {
    id: 368316,
    name: 'Pětiletá voda',
    type: 'layer_gp_wms',
    projection: 'EPSG:4326',
    url: 'http://foo/bar',
    layerIndex: 'zapl_5',
    opacity: 0.6,
    transparent: true,
    scaleMax: null,
    scaleMin: null
  };

  /*
   * TESTS STARTS
   */
  var layer;

  // osm
  layer = gs.layer.getOSM(
      /** @type {gs.layer.OSMOptions} */ (osm_options));
  test.assertTrue(layer instanceof ol.layer.Tile,
      'getOSM_() creates layer');
  test.assertTrue(layer.getSource() instanceof ol.source.OSM,
      'getOSM_() has OSM source');

  // wmts
  layer = gs.layer.getWMTS(
      /** @type {gs.layer.WMTSOptions} */ (wmts_options));
  test.assertTrue(layer instanceof ol.layer.Tile,
      'getWMTS_() creates layer');
  test.assertTrue(layer.getSource() instanceof ol.source.WMTS,
      'getWMTS_() creates wmts source');

  // gp_wmts
  gp_wmts_options['options'] = {
    'url': gp_wmts_options['url'],
    'matrixSet': gp_wmts_options['matrixset'],
    'layer': gp_wmts_options['layer'],
    'format': gp_wmts_options['format']
  };
  layer = gs.layer.getWMTS(
      /** @type {gs.layer.WMTSOptions} */ (gp_wmts_options));
  test.assertTrue(layer instanceof ol.layer.Tile,
      'getWMTS_() creates layer');
  test.assertTrue(layer.getSource() instanceof ol.source.WMTS,
      'getWMTS_() creates wmts source');

  // mapbox
  layer = gs.layer.getMapBox(
      /** @type {gs.layer.MapBoxOptions} */ (mapbox_options));
  test.assertTrue(layer instanceof ol.layer.Tile,
      'getMapBox_() creates layer');
  test.assertTrue(layer.getSource() instanceof ol.source.TileJSON,
      'getMapBox_() creates TileJSON source');

  // gp_wms
  layer = gs.layer.getWMS(
      /** @type {gs.layer.WMSOptions} */ (gp_wms_options));
  test.assertTrue(layer instanceof ol.layer.Image,
      'getWMS_() creates layer');
  test.assertTrue(layer.getSource() instanceof ol.source.ImageWMS,
      'getWMS_() creates ImageWMS source');

  test.done();
});
