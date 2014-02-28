casper.test.begin('DOM elements tests', 13, function(test) {

  casper.start().then(function() {

    var options = {
      value: 'the string\'s value',
      label: 'the string\'s label',
      id: 'the string\'s id'
    };

    //str.Detail as String
    var strDetail = gs.tmpl.unip.attr.str.Detail(options);

    test.assertTrue(!!strDetail, 'str.Detail is defined');


    //str.Detail as DOM element
    var strDetailEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.str.Detail,
        options);

    test.assertEquals(strDetailEl.children.length, 2,
        'str.Detail has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, strDetailEl);

    test.assertEquals(labelElements.length, 1,
        'str.Detail has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'str.Detail has label set correctly');


    //str.Table as String
    var strTable = gs.tmpl.unip.attr.str.Table(options);

    test.assertTrue(!!strTable, 'str.Table is defined');


    //str.Table as DOM element
    var strTableEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.str.Table,
        options);

    test.assertEquals(strTableEl.innerHTML, options.value,
        'str.Table\'s content set correctly'
    );


    //str.Edit as String
    var strEdit = gs.tmpl.unip.attr.str.Edit(options);

    test.assertTrue(!!strEdit, 'str.Edit is defined');


    //str.Edit as DOM element
    var strEditEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.str.Edit,
        options);

    test.assertEquals(strEditEl.children.length, 2,
        'str.Edit has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, strEditEl);

    test.assertEquals(labelElements.length, 1,
        'str.Edit has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'str.Edit has label set correctly');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'input', null, strEditEl);

    test.assertEquals(labelElements.length, 1,
        'str.Edit has 1 child input element'
    );

    test.assertEquals(labelElements[0].id, options.id,
        'str.Edit\'s input id is set correctly'
    );

    test.assertEquals(labelElements[0].value, options.value,
        'str.Edit\'s input value is set correctly'
    );

  }).run(function() {
    test.done();
  });
});
