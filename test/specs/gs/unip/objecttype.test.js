casper.test.begin('test Unip objectType', 17, function suite(test) {
  var options1 = {
    data_type: 'image',
    label: 'testAttribute1Label',
    id: '1'
  };

  var attr1 = new gs.unip.Attribute(options1);

  var options2 = {
    data_type: 'string',
    label: 'testAttribute2Label',
    id: '2'
  };

  var attr2 = new gs.unip.Attribute(options2);

  var options = {
    id: '1',
    label: 'testLabel',
    controlers: [attr1, attr2]
  };

  var objType = new gs.unip.ObjectType(options);

  //inititlization tests
  test.assertTrue(!!objType, 'gs.unip.ObjectType is defined');
  test.assertEquals(Object.keys(objType).length, 7,
      'gs.unip.ObjectType has the expected number of properties');

  test.assertEquals(objType.id, options.id,
      'gs.unip.ObjectType has the expected id');

  test.assertEquals(objType.controlers.length, options.controlers.length,
      'gs.unip.ObjectType has the expected number of controlers');

  test.assertEquals(objType.controlers[0], options.controlers[0],
      'gs.unip.ObjectType has the first controler set correctly');

  test.assertEquals(objType.controlers[1], options.controlers[1],
      'gs.unip.ObjectType has the second controler set correctly');

  test.assertEquals(objType.attributes.length, options.controlers.length,
      'gs.unip.ObjectType has the expected number of attributes');

  test.assertEquals(objType.attributes[0].id, options.controlers[0].id,
      'gs.unip.ObjectType has the first attribute assigned correctly');

  test.assertEquals(objType.attributes[1].id, options.controlers[1].id,
      'gs.unip.ObjectType has the second attribute assigned correctly');

  //getAttributesIds() method tests
  var ids = objType.getAttributesIds();

  test.assertEquals(ids.length, 2,
      'getAttributeIds() method returns an array of the expected length');

  test.assertEquals(ids, [options1.id, options2.id],
      'getAttributesIds() method returns the expected values');

  //getGridColumns() method tests
  var gridCols = objType.getGridColumns();

  test.assertEquals(gridCols.length, 1,
      'getGridColumns() method returns an array of the expected length');

  test.assertEquals(gridCols[0].data_type, options2.data_type,
      'getGridColumns() method returns the expected data_type value in the ' +
      'array element');

  test.assertEquals(gridCols[0].label, options2.label,
      'getGridColumns() method returns the expected label value in the ' +
      'array element');

  test.assertEquals(gridCols[0].label, options2.label,
      'getGridColumns() method returns the expected label value in the ' +
      'array element');

  //getFeatureForm() method tests
  var featureOptions = {
    featureId_: 'feature1',
    geometryName_: 'path'
  };

  var feature = new ol.Feature(featureOptions);

  var form = objType.getFeatureForm(feature);

  test.assertEquals(form.nodeName, 'DIV',
      'getFeatureForm() method returns a div element');

  //getAttribute() method tests
  var attr = objType.getAttribute(1);

  test.assertEquals(attr, objType.attributes[0],
      'getAttribute() method returns the expected attribute');
  test.done();
});
