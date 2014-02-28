casper.test.begin('DOM elements tests', 10, function(test) {

  casper.start().then(function() {

    var options = {
      value: 'checked',
      label: 'label'
    };


    //bool.Detail as String
    var boolDetail = gs.tmpl.unip.attr.bool.Detail(options);

    test.assertTrue(!!boolDetail, 'bool.Detail is defined');


    //bool.Detail as DOM element
    var boolDetailEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.bool.Detail,
        options);

    test.assertEquals(boolDetailEl.children.length, 2,
        'boolean.Detail has 2 children');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, boolDetailEl);

    test.assertEquals(labelElements.length, 1,
        'boolean.Detail has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'boolean.Detail\'s label element has value set correctly');


    //bool.Table as String
    var boolTable = gs.tmpl.unip.attr.bool.Table(options);

    test.assertTrue(!!boolTable, 'bool.Table is defined');


    //bool.Table as DOM element
    var boolTableEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.bool.Table,
        options
        );

    test.assertEquals(boolTableEl.innerHTML, options.value,
        'bool.Table has value set correctly');


    //bool.Edit as String
    var boolEdit = gs.tmpl.unip.attr.bool.Edit(options);

    test.assertTrue(!!boolEdit, 'bool.Edit is defined');


    //bool.Detail as DOM element
    var boolEditEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.bool.Edit,
        options
        );

    test.assertEquals(boolEditEl.children.length, 2,
        'bool.Edit has 2 children');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, boolEditEl);

    test.assertEquals(
        labelElements[0].innerHTML,
        options.label + ': ',
        'bool.Edit\'s child label element has content set correctly');


    var inputElements = goog.dom.getElementsByTagNameAndClass(
        'input', null, boolEditEl);

    test.assertTrue(!!inputElements[0].checked,
        'bool.Edit\'s input element\'s checked attribute set correctly');

  }).run(function() {
    test.done();
  });
});
