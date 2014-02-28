casper.test.begin('Featuredetail testing', 6, function suite(test) {

  casper.start('http://localhost/unip');
  //TODO tests
  // this is the testing
  casper.then(function() {
    var feature = new ol.Feature({foo: 'bar'});
    var featureDetail = new gs.FeatureDetail({feature: feature,
      attributes: {'foo' : 'bar'}});

    test.assertTrue(!!featureDetail, 'Can create FeatureDetail instance');

    test.assertTrue(featureDetail.getFeature() == feature, 'Feature set');
    test.assertTrue(!!featureDetail.getElement(), 'Element created');

    var detailelem = featureDetail.render('Detail').firstChild;
    test.assertTrue(!!detailelem, 'Detail element set');

    var editelem = featureDetail.render('OpenEdit').firstChild;
    test.assertTrue(!!editelem, 'Detail element set');

    featureDetail.close();
    test.assertTrue(!featureDetail.getElement().parnetNode, 'Closed');

  });

  casper.run(function() {
    test.done();
  });
});
