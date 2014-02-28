casper.test.begin('DOM elements tests', 18, function(test) {

  casper.start().then(function() {

    var options = {
      directory: 'http://dev.geosense.cz/dir/',
      src: 'doc.doc',
      title: 'document',
      label: 'docLabel'
    };

    //doc.docDetail as String
    var docDetail = gs.tmpl.unip.attr.doc.Detail(options);

    test.assertTrue(!!docDetail, 'doc.Detail is defined');


    //docDetail as DOM element
    var docDetailEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.doc.Detail,
        options);

    test.assertEquals(docDetailEl.children.length, 1,
        'doc.Detail has 1 child');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, docDetailEl);

    test.assertEquals(labelElements.length, 1,
        'doc.Detail has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'doc.Detail\'s label is set correctly');


    var aElements = goog.dom.getElementsByTagNameAndClass(
        'a', null, docDetailEl);

    test.assertEquals(aElements.length, 1,
        'doc.Detail has 1 anchor element');

    test.assertEquals(aElements[0].href,
        options.directory + options.src,
        'doc.Detail\'s link target set correctly');

    test.assertEquals(aElements[0].innerHTML,
        options.title,
        'doc.Detail\'s link description set correctly');


    //docTable as String
    var docTable = gs.tmpl.unip.attr.doc.Table(options);

    test.assertTrue(!!docTable, 'doc.Table is defined');


    //docTable as DOM element
    var docTableEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.doc.Table,
        options);

    test.assertEquals(docTableEl.children.length, 1,
        'doc.Table has 1 child');


    var aElements = goog.dom.getElementsByTagNameAndClass(
        'a', null, docTableEl);

    test.assertEquals(aElements.length, 1,
        'doc.Table has 1 anchor element');

    test.assertEquals(aElements[0].href,
        options.directory + options.src,
        'doc.Table\'s link target set correctly');

    test.assertEquals(aElements[0].innerHTML,
        options.title,
        'doc.Table\'s link description set correctly');


    var docEditOptions = {
      title: 'document',
      label: 'doc-edit label'
    };


    //doc.Edit as String
    var docEdit = gs.tmpl.unip.attr.doc.Edit(docEditOptions);

    test.assertTrue(!!docEdit, 'doc.Edit is defined');


    //doc.Edit as DOM element
    var docEditEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.doc.Edit,
        docEditOptions);

    test.assertEquals(docEditEl.children.length, 2,
        'doc.Edit has 2 children');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, docEditEl);

    test.assertEquals(labelElements.length, 1,
        'doc.Edit has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        docEditOptions.label + ': ',
        'doc.Edit has label set correctly');


    var inputElements = goog.dom.getElementsByTagNameAndClass(
        'input', null, docEditEl);

    test.assertEquals(inputElements.length, 2,
        'doc.Edit has 2 input elements');

    test.assertEquals(inputElements[0].value,
        docEditOptions.title,
        'doc.Edit\'s input field value set correctly');

  }).run(function() {
    test.done();
  });
});
