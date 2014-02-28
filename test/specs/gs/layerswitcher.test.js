goog.require('gs.LayerSwitcher');
goog.require('gs.LayerSwitcherEvents');
goog.require('gs.source.Unip');


var ls;

casper.test.begin('Can create layerswitcher', 10, function suite(test) {

  var app = new gs.App({'target': 'target-layerswitcher', 'lang': null});

  var layer = new ol.layer.Image({id: 'image',
    source: new ol.source.Tile({ })});
  var vlayer = new ol.layer.Vector({id: 'vector',
    source: new ol.source.Vector({ }) });
  var ulayer = new ol.layer.Vector({id: 'unip',
    source: new gs.source.Unip({ }) });

  app.getMap().addLayer(layer);
  app.getMap().addLayer(vlayer);

  // TODO rewrite so that layerswitcher is created directly,
  var ls = app.get('layout').getToolsPanel().getLayerSwitcher();
  test.assertInstanceOf(ls, gs.LayerSwitcher, 'LayerSwitcher created');

  test.assertTrue(!!ls.id, 'ID Set');
  test.assertTrue(!!ls.getElement(), 'Layerswitcher has custom div');
  test.assertTrue(!!ls.getElement(), 'Layerswitcher has custom div');

  test.assertEquals(
      goog.dom.getElementsByTagNameAndClass('li', 'gs-layerList',
      ls.getElement()).length, 2, 'Two layers in the switcher');

  test.assertEquals(
      goog.dom.getElementsByTagNameAndClass('button', 'gs-layer-visible',
      ls.getElement()).length, 2, 'Two layers visible');

  vlayer.setVisible(false);

  test.assertEquals(
      goog.dom.getElementsByTagNameAndClass('button', 'gs-layer-visible',
      ls.getElement()).length, 1, 'One layers visible');

  app.getMap().addLayer(ulayer);
  test.assertEquals(
      goog.dom.getElementsByTagNameAndClass('li', 'gs-layerList',
      ls.getElement()).length, 3, 'Three layers in the switcher');
  var buttons = goog.dom.getElementsByTagNameAndClass('button',
      'gs-layer-grid-button', ls.getElement());
  test.assertEquals(buttons.length, 1, 'One overlay in the switcher');

  ls.cleanlayersClickHandler();
  var visible = app.getMap().getLayers().getArray().filter(function(l) {
    return l.getVisible();
  });

  test.assertEquals(visible.length, 1,
      'cleanlayersClickHandler() layers switched off');
  test.done();
});
