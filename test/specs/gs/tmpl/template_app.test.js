goog.require('gs.tmpl.App');

casper.test.begin('assertExists() tests', 9, function(test) {

  casper.start().then(function() {

    //get dom as string
    var appgrid = gs.tmpl.App.appUx({'id': 'gs-app-1'});

    //set content of casper page
    this.setContent(appgrid);

    //tests on casper page
    test.assertExists('.gs-app');


    //get template as a dom
    var appgridEl = goog.soy.renderAsElement(gs.tmpl.App.appUx,
        {'id': 'gs-app-1'});

    //tests on dom object

    //testint child
    test.assertEquals(appgridEl.children.length, 6, 'app div has 5 childrens');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-top', appgridEl).length,
        1, 'app div contain top children');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-left', appgridEl).length,
        1, 'app div contain left children');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-center', appgridEl).length,
        1, 'app div contain center children');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-right', appgridEl).length,
        1, 'app div right right children');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-bottom', appgridEl).length,
        1, 'app div contain bottom children');

    test.assertEquals(
        goog.dom.getElementsByClass('gs-hidden-container', appgridEl).length,
        1, 'app div contain hidden-container children');


    //test id root div
    test.assertEquals(appgridEl.getAttribute('id'),
        'gs-app-1', 'app div has right id');

  }).run(function() {
    test.done();
  });
});
