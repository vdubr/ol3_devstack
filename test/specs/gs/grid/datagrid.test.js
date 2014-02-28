goog.require('goog.dom');
goog.require('gs.grid.Datagrid');

casper.test.begin('Datagrid', 59, function suite(test) {
  casper.start().then(function() {

    var options = {
      columns: [
        {
          label: 'col1',
          property: '5',
          sortable: true,
          data_type: 'string'
        },
        {
          label: 'col2',
          property: '4',
          sortable: true,
          data_type: 'int'
        }
      ],
      layers: [
        new ol.layer.Vector({
          source: new ol.source.Vector(),
          id: '151'
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector(),
          id: '153'
        })
      ],
      object_types: [
        {
          id: 1,
          attributes: [
            {id: '4'},
            {id: '5'}
          ]
        },
        {
          id: 2,
          attributes: [
            {id: '5'}
          ]
        }
      ],
      opt_step: 2,
      data: [
        {
          col1: 'feature1', col2: '1',
          'extent': [0, 0, 2, 2], 'object_type_id': 1
        },
        {
          col1: 'feature21', col2: '2',
          'extent': [0, 3, 2, 2], 'object_type_id': 2
        },
        {
          col1: 'feature3', col2: '3',
          'extent': [0, 0, 2, 2], 'object_type_id': 2
        },
        {
          col1: 'feature4', col2: '4',
          'extent': [1, 1, 4, 4], 'object_type_id': 2
        }
      ]
    };

    var dg = new gs.grid.Datagrid(options);

    /*
     * test datagrid constructor
     */
    test.assertTrue(!!dg, 'Can create datagrid');

    test.assertEquals(dg.getData(), options.data,
        'datagrid.data set as expected');
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, options.opt_step + 1,
        'datagrid has the expected number of rows');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'td', null, dg.getElement()).length, options.opt_step *
            (options.columns.length + 1),
        'datagrid has the expected number of cells');
    test.assertEquals(dg.getData2BRendered().length, options.data.length,
        'data_2B_rendered has the expected length');
    test.assertEquals(dg.getIndex(), options.opt_step,
        'data index is set as expected');

    /*
   * test header
   */
    var headerEl = goog.dom.getElementByClass('panel-header', dg.getElement());
    var countEl = goog.dom.getElementsByTagNameAndClass(
        goog.dom.TagName.SPAN, undefined, headerEl);
    var count = goog.string.toNumber(goog.dom.getTextContent(countEl[0]));
    test.assertEquals(count, options.data.length,
        'Datagrid header shows right count');

    /*
     * test displayData method
     */
    var opt_options = {
      columns: [
        {
          label: 'label',
          property: 1,
          sortable: true
        }
      ],
      data: [
        {1: 'feature1', 2: 'attr2', extent: [0, 0, 2, 2], object_type_id: '1'},
        {1: 'feature2', 2: 'attr1', extent: [1, 1, 2, 2], object_type_id: '1'}
      ],
      object_types: options.object_types,
      title: 'title'
    };
    dg.displayData(opt_options);

    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, opt_options.data.length + 1,
        'displayData() sets the expected number of rows');

    var cellsLength = opt_options.data.length *
        (opt_options.columns.length + 1);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'td', null, dg.getElement()).length, cellsLength,
        'displayData() sets the expected number of cells');

    /*
     * test loadData method
     */

    //test if loadData sets original properties to datagrid
    var table_build;
    goog.events.listen(dg, gs.grid.DatagridEventType.TABLE_BUILD, function(e) {
      table_build = e.data;
    });
    dg.loadData();
    test.assertTrue(goog.isDefAndNotNull(table_build),
        'loadData() fires TABLE_BUILD event');
    test.assertEquals(table_build.grid.id, dg.id,
        'the TABLE_BUILD event contains the expected grid');
    test.assertEquals(table_build.extent, dg.extent_,
        'the TABLE_BUILD event contains the expected extent');
    test.assertEquals(table_build.data, dg.getData(),
        'the TABLE_BUILD event contains the expected data');
    test.assertEquals(table_build.layers.length, dg.getLayers().length,
        'the TABLE_BUILD event contains expected layers');
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, options.opt_step + 1,
        'loadData without options returns table back to its original number' +
            ' of rows');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'td', null, dg.getElement()).length, options.opt_step *
            (options.columns.length + 1),
        'loadData without options returns the table back to its original' +
        ' number of cells');
    test.assertEquals(dg.getData2BRendered().length, options.data.length,
        'loadData without options resets the table to its original data');
    test.assertEquals(dg.getIndex(), options.opt_step,
        'loadData without options resets the data index');


    /*
     * test getDetailFromRow method
     */
    //manually set attributes that are normally set in soy template
    var rows = goog.dom.getElementsByTagNameAndClass('tr', null,
        dg.getElement());
    var row = rows[1];
    var row2 = rows[2];
    var testFeatureId = 5;
    var testFeatureId2 = 7;
    var testLayerId = 2;
    var testLayerId2 = 8;
    row.setAttribute('data-featureid', testFeatureId);
    row.setAttribute('data-layerid', testLayerId);
    row2.setAttribute('data-featureid', testFeatureId2);
    row2.setAttribute('data-layerid', testLayerId2);

    //initialize a map with a layer and a feature
    var feature = new ol.Feature();
    feature.setId(testFeatureId);
    var geometry = new ol.geom.Point([15, 50]);
    feature.setGeometry(geometry);
    var source = new ol.source.Vector();
    source.addFeatures([feature]);

    var feature2 = new ol.Feature();
    feature2.setId(testFeatureId2);
    var geometry2 = new ol.geom.Point([30, 45]);
    feature2.setGeometry(geometry2);
    var source2 = new ol.source.Vector();
    source2.addFeatures([feature2]);

    var layer = new ol.layer.Vector({
      'source' : source,
      'id' : testLayerId
    });
    var layer2 = new ol.layer.Vector({
      'source' : source2,
      'id' : testLayerId2
    });
    var map = new ol.Map({
      'layers': [layer, layer2]
    });
    dg.setMap(map);

    var rowDetail = dg.getRowDetailFromChild_(row);
    test.assertEquals(rowDetail.feature.getId(), testFeatureId,
        'rowDetail returns the expected feature');
    test.assertEquals(rowDetail.layer.id, layer.id,
        'rowDetail returns the expected layer');

    var rowDetail2 = dg.getRowDetailFromChild_(row2);
    test.assertEquals(rowDetail2.feature.getId(), testFeatureId2,
        'rowDetail2 returns the expected feature');
    test.assertEquals(rowDetail2.layer.id, layer2.id,
        'rowDetail2 returns the expected layer');


    /*
     * test addRows method
     */
    var rows_to_be_added = [
      {1: 'feature5', 2: 'attr2', 'extent': [1, 0, 2, 2]},
      {1: 'feature6', 2: 'attr2', 'extent': [1, 3, 4, 4]}
    ];
    var rowsLoadedEvt = false;
    goog.events.listen(dg, gs.grid.DatagridEventType.ROWS_LOADED,
        function(evt) {
          rowsLoadedEvt = true;
        });
    dg.addRows(rows_to_be_added);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, rows_to_be_added.length +
            options.opt_step + 1,
        'addRows() adds the expected number of rows');
    test.assertTrue(rowsLoadedEvt, 'ROWS_LOADED event is fired by addRows()');

    //reset original state for further testing
    dg.loadData();


    /*
     * test addmouselisteners method
     * check if events are registered
     */
    var mouseovers = goog.object.getValues(
        goog.object.filter(goog.events.listeners_,
            function(listener) {
              return (listener.type === 'mouseover');
            })).length;
    var mouseouts = goog.object.getValues(
        goog.object.filter(goog.events.listeners_,
            function(listener) {
              return (listener.type === 'mouseout');
            })).length;
    test.assertEquals(mouseovers, 1,
        'the expected number of mouseover listeners has been registered');
    test.assertEquals(mouseouts, 1,
        'the expected number of mouseout listeners has been registered');


    /*
     * test closeTableHandler
     */
    var closedEventFired = false;
    goog.events.listen(dg, gs.grid.DatagridEventType.TABLE_CLOSED,
        function() {
          closedEventFired = true;
        });

    dg.closeTableHandler();
    test.assertTrue(closedEventFired,
        'The TABLE_CLOSED event is fired by closeTableHandler');


    /*
     * test hideTableHandler
     */
    var hideEventFired = false;
    goog.events.listen(dg, gs.grid.DatagridEventType.TABLE_MINIMIZED,
        function() {
          hideEventFired = true;
        });

    dg.hideTableHandler();
    test.assertTrue(hideEventFired,
        'The TABLE_MINIMIZED event is fired by hideTableHandler');


    /*
     * test maximizeTableHandler
     */
    var maximizedEventFired = false;
    goog.events.listen(dg, gs.grid.DatagridEventType.TABLE_MAXIMIZED,
        function() {
          maximizedEventFired = true;
        });

    dg.maximizeTableHandler();
    test.assertTrue(maximizedEventFired,
        'The TABLE_MAXIMIZED event is fired by maximizeTableHandler');


    /*
     * test normalTableHandler
     */
    var normalEventFired = false;
    goog.events.listen(dg, gs.grid.DatagridEventType.TABLE_NORMAL,
        function() {
          normalEventFired = true;
        });

    dg.normalTableHandler();
    test.assertTrue(normalEventFired,
        'The TABLE_NORMAL event is fired by normalTableHandler');


    /*
     * test onGridObjTypeSelectHandler
     */
    var evt1 = {
      target: {
        value: '1'
      }
    };
    dg.onGridObjTypeSelectHandler(evt1);
    test.assertEquals(dg.getData2BRendered().length, 1,
        'object type selection displays the expected data for type_id 1');
    test.assertEquals(dg.rendered_columns_.length, 2,
        'object type selection renders the expected columns fot type_id 1');


    var evt2 = {
      target: {
        value: '2'
      }
    };
    dg.onGridObjTypeSelectHandler(evt2);
    test.assertEquals(dg.getData2BRendered().length, 3,
        'object type selection displays the expected data for type_id 2');
    test.assertEquals(dg.rendered_columns_.length, 1,
        'object type selection renders the expected columns fot type_id 2');

    var evtAll = {
      target: {
        value: 'all'
      }
    };
    dg.onGridObjTypeSelectHandler(evtAll);
    test.assertEquals(dg.getData2BRendered().length, 4,
        'object type selection displays all data upon selecting \'all\'');
    test.assertEquals(dg.rendered_columns_.length, options.columns.length,
        'object type selection renders the expected columns upon selecting ' +
        '\'all\'');

    /*
     * test onTableScrolled
     */
    var scrollEvt = {
      target: {
        scrollTop: 20,
        clientHeight: 5,
        scrollHeight: 25
      }
    };
    dg.onTableScrolled_(scrollEvt);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, 2 * options.opt_step + 1,
        'onTableScrolled() adds the expected number of rows');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'td', null, dg.getElement()).length, options.opt_step *
            (options.columns.length + 1) * 2,
        'onTableScrolled() adds the expected number of cells');
    test.assertEquals(dg.getIndex(), options.opt_step * 2,
        'onTableScrolled() increases the index as expected');


    /*
     * ?test rowClickHandler?
     * this method is not suitable for unit testing
     */


    /*
     * test searchHandler_
     */
    var searchKey1 = 'feature1';
    var searchKey2 = '1';
    var searchKey3 = '4';
    dg.searchHandler_(searchKey1);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, 2,
        'searchHandler_() displays the expected number of features on string' +
            'search');
    dg.searchHandler_(searchKey2);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, 3,
        'searchHandler_() displays the expected number of features on string' +
            'search with multiple results');
    dg.searchHandler_(searchKey3);
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'tr', null, dg.getElement()).length, 2,
        'searchHandler_() displays the expected number of features on int' +
            'search');


    /*
     * test searchData
     */
    var res1 = dg.searchData(options.data, options.columns, searchKey1);
    test.assertEquals(res1.length, 1, 'searchData() returns the expected ' +
        'number of features on string search');
    test.assertEquals(res1[0].col1, 'feature1', 'searchData() returns the ' +
        'expected feature on string search');
    var res2 = dg.searchData(options.data, options.columns, searchKey2);
    test.assertEquals(res2.length, 2, 'searchData() returns the expected ' +
        'number of features on string search with multiple results');
    test.assertEquals(res2[0].col1, 'feature1', 'searchData() returns the ' +
        'expected first feature on string search with multiple results');
    test.assertEquals(res2[1].col1, 'feature21', 'searchData() returns the ' +
        'expected second feature on string search with multiple results');
    var res3 = dg.searchData(options.data, options.columns, searchKey3);
    test.assertEquals(res3.length, 1, 'searchData() returns the expected ' +
        'number of features on int search');
    test.assertEquals(res3[0].col1, 'feature4', 'searchData() returns the ' +
        'expected feature on int search');


    /*
     * test setupSearch
     */
    var searchDiv = goog.dom.getElementsByTagNameAndClass(
        'div', 'gs-searchdiv', dg.getElement())[0];
    var searchButton = goog.dom.getElementsByTagNameAndClass(
        'button', null, searchDiv)[0];
    var searchField = goog.dom.getElementsByTagNameAndClass(
        'input', null, searchDiv)[0];
    var clickListeners = goog.events.getListeners(searchButton, 'click',
        false);
    //TODO why does it register two listeners?
    test.assertEquals(clickListeners.length, 1,
        'The searchButton click listener is registered');
    var keyListeners = goog.events.getListeners(searchField, 'keypress',
        false);
    test.assertEquals(keyListeners.length, 1,
        'The searchButton keypress listener is registered');


    /*
     * test calculateExtent
     */
    var extent = dg.calculateExtent_(dg.getData());
    test.assertEquals(extent.length, 4,
        'calculateExtent_() returns extent in the expected format');


    /*
     * test getColumns method
     */
    test.assertEquals(dg.getColumns(), dg.columns_,
        'getColumns() returns the expected data');


    /*
     * test getElement method
     */
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'table', null, dg.getElement()).length,
        goog.dom.getElementsByTagNameAndClass(
            'table', null, dg.getElement()).length,
        'getElement() returns a table');
    //TODO more thorough tests for getElement


    /*
     * test getElemtable
     */
    test.assertEquals(dg.getElemtable().className, dg.elemtable_.className,
        'getElemtable returns the expected table');


    /*
     * test getExtent
     */
    test.assertEquals(dg.getExtent(), dg.extent_,
        'getExtent returns the expected extent');


    /*
     * test getId method
     */
    test.assertEquals(dg.getId(), dg.id_,
        'getId() returns the expected id');


    /*
     * test getLayers
     */
    test.assertEquals(dg.getLayers()[0].id, dg.layers_[0].id,
        'getLayer returns the expected layer');


    /*
     * test getObjectTypes
     */
    test.assertEquals(dg.getObjectTypes(), dg.object_types_,
        'getObjectTypes returns the expected array');


  }).run(function() {
    test.done();
  });
});
