casper.test.begin('Tests example datagrid', 19, function(test) {


  // test visible controls map
  testVisibleMap = function(test) {
    test.assertVisible('div.gs-button-home button',
        'button home map is visible');
    test.assertVisible('div.gs-button-geolocation button',
        'button geolocation map is visible');
  };


  casper.start('build/examples/datagrid.html', function() {
    test.assertExists('div#gs-app', 'main div application is found');

    // toolspanel
    test.assertExists('div.gs-toolspanel', 'div toolspanel is found');
    test.assertExists('div.gs-hide-button', 'div close button is found');

    // map container
    test.assertVisible('div.gs-map-container', 'div map container is visible');
    testVisibleMap(test);
  });

  // test minimalized toolspanel
  casper.then(function() {
    this.click('div.gs-toolspanel div.gs-hide-button button');
    test.assertExists('div.gs-panel-minimized', 'div toolspanel is minimized');
    testVisibleMap(test);
  });

  // test minimalized toolspanel
  casper.then(function() {
    this.click('div.gs-toolspanel div.gs-hide-button button');
    test.assertDoesntExist('div.gs-panel-minimized',
        'div toolspanel is not minimized');
    testVisibleMap(test);
  });

  // test show datagrid
  casper.then(function() {
    test.assertDoesntExist('div.gs-right div.panel', 'div datagrid is hidden');
    this.click('button.gs-layer-grid-button span');
    this.waitForSelector('div.gs-right div.panel', function() {
      test.assertExists('div.gs-right div.panel', 'div datagrid is show');
      test.assertVisible('div.gs-searchdiv', 'div search is visible');
      test.assertVisible('div.gs-datagrid-footer button.gs-datagrid-maximize',
          'button maximize in footer is visible');
      test.assertVisible('div.gs-datagrid-footer button.gs-datagrid-minimize',
          'button minimize in footer is visible');
      testVisibleMap(test);
    }, function() {
      this.die('timeout load api data').exit();
    }, 1000);
  });


  casper.run(function() {
    test.done();
  });

});
