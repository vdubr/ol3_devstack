casper.test.begin('test Unip attribute', 8, function suite(test) {
  var options = {
    data_type: 'string',
    label: 'testAttributeLabel'
  };

  var attr = new gs.unip.Attribute(options);

  //initialization tests
  test.assertTrue(!!attr, 'gs.unip.Attribute is defined');
  test.assertEquals(attr.data_type, options.data_type,
      'data_type property set correctly');
  test.assertEquals(attr.label, options.label,
      'label property set correctly');
  test.assertEquals(attr.data_type, options.data_type,
      'type set correctly');

  //getFeatureAttribute method tests
  var value = 'testAttributeValue';
  var getFeatureAttr = attr.getFeatureAttribute(value);

  test.assertEquals(Object.keys(getFeatureAttr).length, 3,
      'getFeatureAttribute() method returns an object with the expected' +
      'number of properties');

  test.assertEquals(getFeatureAttr['label'], options.label,
      'getFeatureAttribute() method returns the xpected label');

  test.assertEquals(getFeatureAttr['value'], value,
      'getFeatureAttribute() method returns the expected value');

  test.assertEquals(getFeatureAttr['type'], options.data_type,
      'getFeatureAttribute() method returns the expected type');
  test.done();
});
