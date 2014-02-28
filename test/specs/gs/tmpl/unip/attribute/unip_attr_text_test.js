casper.test.begin('DOM elements tests', 13, function(test) {

  casper.start().then(function() {

    var options = {
      value: 'the text value',
      id: 'the text id',
      label: 'label'
    };


    //text.Detail as String
    var textDetail = gs.tmpl.unip.attr.text.Detail(options);

    test.assertTrue(!!textDetail, 'text.Detail is defined');


    //text.Detail as DOM element
    var textDetailEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.text.Detail,
        options);

    test.assertEquals(textDetailEl.children.length, 2,
        'text.Detail has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, textDetailEl);

    test.assertEquals(labelElements.length, 1,
        'text.Detail has 1 label child element'
    );

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'text.Detail\'s label element content set correctly'
    );


    //text.Table as String
    var textTable = gs.tmpl.unip.attr.text.Table(options);

    test.assertTrue(!!textTable, 'text.Table is defined');


    //text.Table as DOM element
    var textTableEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.text.Table,
        options);

    test.assertEquals(textTableEl.innerHTML, options.value,
        'text.Table\'s content set correctly'
    );


    //text.Edit as String
    var textEdit = gs.tmpl.unip.attr.text.Edit(options);

    test.assertTrue(!!textEdit, 'text.Edit is defined');


    //text.Edit as DOM element
    var textEditEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.text.Edit,
        options);

    test.assertEquals(textEditEl.children.length, 2,
        'text.Edit has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, textEditEl);

    test.assertEquals(labelElements.length, 1,
        'text.Edit has 1 label element'
    );

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'text.Edit\'s label content is set correctly'
    );


    var textareaElements = goog.dom.getElementsByTagNameAndClass(
        'textarea', null, textEditEl);

    test.assertEquals(textareaElements.length, 1,
        'text.Edit has 1 textarea element'
    );

    test.assertEquals(textareaElements[0].id, options.id,
        'text.Edit\'s textarea id is set correctly'
    );

    test.assertEquals(textareaElements[0].innerHTML,
        options.value,
        'text.Edit\'s textarea content is set correctly'
    );

  }).run(function() {
    test.done();
  });
});

