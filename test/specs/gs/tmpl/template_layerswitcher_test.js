casper.test.begin('DOM elements tests', 16, function(test) {
  casper.start().then(function() {
    var options = {
      'base': [],
      'unip': []
    };

    // TODO layerswitcher is completely rebuild
    test.skip(15);
    //LayerSwitcher.layerswitcher as String
    var ls = gs.tmpl.LayerSwitcher.layerswitcher(options);

    test.assertTrue(!!ls, 'LayerSwicther.layerswitcher is defined');

    //LayerSwitcher.layerswitcher as DOM element
    //var lsEl = goog.soy.renderAsElement(gs.tmpl.LayerSwitcher.layerswitcher,
    //    options);

  }).run(function() {
    test.done();
  });
});
