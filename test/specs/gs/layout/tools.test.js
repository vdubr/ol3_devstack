goog.require('goog.dom');
goog.require('gs.LayerSwitcher');
goog.require('gs.layout.ToolsPanel');
goog.require('ol.Map');
goog.require('ol.layer.Image');
goog.require('ol.layer.Vector');
goog.require('ol.source.Tile');
goog.require('ol.source.Vector');


/**
 * tartget div
 */
var target = goog.dom.createElement('div');


/**
 * @type {string}
 */
target.id = 'target';

goog.dom.getElementsByTagNameAndClass('body')[0].appendChild(target);

var map = new ol.Map({target: 'target'});
var layer = new ol.layer.Image({source: new ol.source.Tile({ })});
var vlayer = new ol.layer.Vector({source: new ol.source.Vector({ }) });

map.addLayer(layer);
map.addLayer(vlayer);

casper.test.begin('Toolspanel', 9, function suite(test) {

  var toolspanel = new gs.layout.ToolsPanel({
    map: map
  });
  test.assertInstanceOf(toolspanel, gs.layout.ToolsPanel, 'ToolsPanel created');
  test.assertEquals(toolspanel.getState(),
      gs.layout.ToolsPanel.State.visible, 'ToolsPanel visible');
  test.assertTrue(!!toolspanel.getElement(), 'ToolsPanel has element');
  test.assertInstanceOf(toolspanel.getLayerSwitcher(),
      gs.LayerSwitcher, 'Has layerswitcher');
  test.assertInstanceOf(toolspanel.menu, gs.MainMenu, 'Has main menu');

  toolspanel.hideClickHandler({}, {});
  test.assertEquals(toolspanel.getState(),
      gs.layout.ToolsPanel.State.minimized, 'ToolsPanel minimized');
  toolspanel.hideClickHandler({}, {});
  test.assertEquals(toolspanel.getState(),
      gs.layout.ToolsPanel.State.visible, 'ToolsPanel visible');

  toolspanel.openMenu();
  var menu = goog.dom.getElementByClass('gs-mainmenu-container',
      toolspanel.getElement());
  test.assertFalse(goog.dom.classes.has(menu, 'pane'), 'Menu visible');
  toolspanel.closeMenu();
  test.assertTrue(goog.dom.classes.has(menu, 'pane'), 'Menu invisible');




  test.done();
});
