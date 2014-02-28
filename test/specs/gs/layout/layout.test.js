goog.require('goog.dom');
goog.require('gs.App');
goog.require('gs.grid.Datagrid');
goog.require('gs.layout.Layout');
goog.require('gs.layout.ToolsPanel');
goog.require('ol.Map');


/**
 * tartget div
 */
var target = goog.dom.createElement('div');
goog.style.setWidth(target, 1024);
goog.style.setHeight(target, 600);


/**
 * div id
 */
target.id = 'target';

goog.dom.getElementsByTagNameAndClass('body')[0].appendChild(target);

casper.test.begin('Create layout', 29, function suite(test) {

  var layout = new gs.layout.Layout({
    'target': 'target'
  });
  test.assertInstanceOf(layout, gs.layout.Layout, 'Layout created');

  var app = new gs.App({
    'map': {},
    'target': 'target',
    'lang': null
  });

  var toolspanel = new gs.layout.ToolsPanel({
    'map': app.getMap()
  });
  layout.setToolsPanel(toolspanel);

  layout.setMap(app.getMap());

  /*****************  tests ***************************/

  /*
   * test ol.Map available
   */
  test.assertInstanceOf(layout.map, ol.Map, 'There is map');
  test.assertInstanceOf(toolspanel.map, ol.Map, 'There is map');

  /*
   * test dom
   */
  test.assertTrue(goog.isDefAndNotNull(
      goog.dom.getElementsByTagNameAndClass('gs-toolspanel'),
      goog.dom.getElementByClass('gs-toolspanel-container')
      ), 'Toolspanel Container available');
  test.assertTrue(!!layout.getDiv(), 'There is div');

  /*
   * test toolspanel available
   */
  test.assertInstanceOf(layout.getToolsPanel(), gs.layout.ToolsPanel,
      'There is toolspanel');
  var toolselem = toolspanel.getElement();
  var layoutelem = goog.dom.getFirstElementChild(
      goog.dom.getElementByClass('gs-toolspanel-container', layout.getDiv()));
  test.assertTrue(toolselem == layoutelem, 'Toolspanel Element set');

  /*
   * test toolspanel events set
   */
  var events = goog.events.getListeners(toolspanel,
      gs.layout.ToolsPanel.EventType.STATE_CHANGE, false);
  test.assertEquals(events.length, 1, 'STATE_CHANGE event set');
  events = goog.events.getListeners(toolspanel.getLayerSwitcher(),
      gs.LayerSwitcher.EventType.GRID_CLICKED, false);
  test.assertEquals(events.length, 1, 'GRID_CLICKED event set');

  /*
   * test little grid and popup can be displayed
   */
  var grid = new gs.grid.LittleGrid({
    data: [{'id': 123, 'layer_id': 123, 'label': 'Label', 'text': 'text'}],
    map: layout.getMap()
  });
  test.assertFalse(goog.isDefAndNotNull(layout.popup),
      'Popup is not available');
  layout.displayLittleGrid(grid, [0, 0]);
  test.assertTrue(goog.isDefAndNotNull(layout.popup), 'Popup is available');
  test.assertTrue(layout.getMap().getOverlays().getArray()[1] == layout.popup,
      'Popup set to map');
  test.assertTrue(layout.popup.getPosition()[0] === 0 &&
                  layout.popup.getPosition()[1] === 0, 'popup position set');

  /*
   * test big data grid
   */
  var options = {
    columns: [{
      label: 'col2',
      property: 2,
      sortable: true
    }],
    layers: [new ol.layer.Vector({
      source: new ol.source.Vector(), id: '151'
    })],
    object_types: [],
    data: [
      {2: 'attr2', 'extent': [0, 0, 2, 2]}
    ]
  };
  grid = new gs.grid.Datagrid(options);
  layout.displayGrid(grid, options.layer);
  test.assertTrue(grid == layout.grid, 'Grid set');
  test.assertEquals(goog.events.getListeners(grid,
      gs.grid.DatagridEventType.TABLE_MAXIMIZED, false).length, 1,
      'TABLE_MAXIMIZED event set');
  test.assertEquals(goog.events.getListeners(grid,
      gs.grid.DatagridEventType.TABLE_MINIMIZED, false).length, 1,
      'TABLE_MINIMIZED event set');
  test.assertEquals(goog.events.getListeners(grid,
      gs.grid.DatagridEventType.TABLE_CLOSED, false).length, 1,
      'TABLE_CLOSED event set');
  test.assertEquals(goog.events.getListeners(grid,
      gs.grid.DatagridEventType.TABLE_NORMAL, false).length, 1,
      'TABLE_NORMAL event set');
  test.assertEquals(layout.getRightPanel().getLayout(),
      gs.layout.RightPanelLayout.normalized, 'Right panel layout normalized');
  test.assertTrue(layout.getRightPanel().getContent() ==
      grid.getElement(), 'Right panel filled with grid');

  /**
   * right panel size change
   */
  var orig = goog.events.getListeners(window,
      goog.events.EventType.RESIZE, false).length;
  var width = goog.style.getBorderBoxSize(
      layout.getRightPanel().getElement()).width;
  layout.maximizeRightPanel();
  test.assertEquals(goog.events.getListeners(toolspanel,
      gs.layout.ToolsPanel.EventType.STATE_CHANGE, false).length, 2,
      'STATE_CHANGE set');
  test.assertEquals(goog.events.getListeners(window,
      goog.events.EventType.RESIZE, false).length, orig + 1,
      'window RESIZE set');

  //test.skip(1);
  // test.assertTrue(width < goog.style.getBorderBoxSize(
  //     layout.getRightPanel().getElement()).width,
  //     'Right panel width changed');

  layout.unMaximizeRightPanel();
  test.assertEquals(goog.events.getListeners(toolspanel,
      gs.layout.ToolsPanel.EventType.STATE_CHANGE, false).length, 1,
      'STATE_CHANGE unset');
  test.assertEquals(goog.events.getListeners(window,
      goog.events.EventType.RESIZE, false).length, orig,
      'RESIZE unset');

  /**
   * get effective extent
   */
  // skipped

  /**
   * display feature detail
   */
  var feature = new ol.Feature({'foo': 'bar'});
  var fd = new gs.FeatureDetail({feature: feature, attributes: {'foo': 'bar'}});

  var feature2 = new ol.Feature({'foo': 'bar'});
  var fd2 = new gs.FeatureDetail({feature: feature2,
    attributes: {'foo': 'bar'}});

  layout.displayFeatureDetail(fd, feature);
  test.assertTrue(fd.render('Detail') == layout.getRightPanel().getContent(),
      'Feature detial set');
  test.assertEquals(layout.getRightPanel().getLayout(),
      gs.layout.RightPanelLayout.normalized,
      'Layout set');
  test.assertTrue(!goog.isDefAndNotNull(layout.grid), 'Grid unset');

  /*
   * test featureHighlight
   */
  // can not be tested
  //var styleFunction = options.layer.getStyleFunction();
  //test.assertEquals(styleFunction(feature)[1].getColor().value_,
  //    'red', 'feature highlited');

  layout.displayFeatureDetail(fd2, feature2);
  //test.assertNotEquals(styleFunction(feature)[1].getColor().value_,
  //    'red', 'feature unhighlited');
  //test.assertEquals(styleFunction(feature)[1].getColor().value_,
  //    'red', 'feature2 highlited');

  /**
   * close feature detail
   */
  layout.closeFeatureDetail({}, {}, feature2);
  test.assertFalse(goog.dom.getFirstElementChild(
      layout.getRightPanel().getElement()), 'element removed');
  test.assertEquals(layout.getRightPanel().getLayout(),
      gs.layout.RightPanelLayout.closed, 'panel set to closed');
  //test.assertNotEquals(styleFunction(feature)[1].getColor().value_,
  //    'red', 'feature2 unhighlited');
  test.done();
});
