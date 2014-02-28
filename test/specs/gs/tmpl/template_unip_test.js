casper.test.begin('DOM elements tests', 12, function(test) {

  casper.start().then(function() {

    var attributes = {attributes: [{
      type: 'string',
      value: 'value',
      label: 'label'}]
    };

    //unip.featuredetail as String
    var featuredetail = gs.tmpl.unip.feature.Detail(attributes);

    test.assertTrue(!!featuredetail, 'unip.featuredetail is defined');


    //unip.featureform as String
    var featureform = gs.tmpl.unip.feature.Edit(attributes);

    test.assertTrue(!!featureform, 'unip.featureform is defined');


    var options = {
      label: 'testLabel',
      value: 'testValue'
    };

    //unip.attributeInput as String
    var attributeInput = gs.tmpl.unip.attributeInput(options);

    test.assertTrue(!!attributeInput, 'unip.attributeInput is defined');


    //unip.attributeInput as DOM element
    var attributeInputEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attributeInput,
        options);

    test.assertEquals(attributeInputEl.children.length, 1,
        'unip.attributeInput has 1 child');


    var inputElements = goog.dom.getElementsByTagNameAndClass(
        'input', null, attributeInputEl);

    test.assertEquals(inputElements.length, 1,
        'unip.attributeInput has 1  input element');

    test.assertEquals(inputElements[0].value, options.value,
        'unip.attributeInput\'s input has value set correctly');


    var substr = attributeInputEl.innerHTML.substr(
        0, attributeInput.indexOf('<input'));

    test.assertEquals(substr, options.label + ': ',
        'unip.attributeInput label set correctly');


    //unip.attribute as String
    var attribute = gs.tmpl.unip.attribute(options);

    test.assertTrue(!!attribute, 'unip.attribute is defined');


    //unip.attribute as DOM element
    var attributeEl = goog.soy.renderAsElement(gs.tmpl.unip.attribute,
        options);

    test.assertEquals(attributeEl.children.length, 1,
        'unip.attribute has 1 child');


    var strongElements = goog.dom.getElementsByTagNameAndClass(
        'strong', null, attributeEl);

    test.assertEquals(strongElements.length, 1,
        'unip.attribute contains 1 strong element');

    test.assertEquals(strongElements[0].innerHTML,
        options.label + ': ',
        'unip.attribute has value set correcty');

    var substr = attributeEl.innerHTML.substr(
        attributeEl.innerHTML.indexOf('</strong>') + 10);

    test.assertEquals(substr, options.value,
        'unip.attribute has value set correctly');

  }).run(function() {
    test.done();
  });
});
