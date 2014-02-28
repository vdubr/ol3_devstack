//goog.require('gs.tmpl.feature');

casper.test.begin('DOM elements tests', 1, function(test) {
  test.skip(1, 'feature not included, possibly goog.require here?');
  casper.start().then(function() {
    //feature.feature as String
    //var feature = gs.tmpl.feature.feature();

    //test.assertTrue(!!feature, 'feature.feature is defined');
  }).run(function() {
    test.done();
  });
});
