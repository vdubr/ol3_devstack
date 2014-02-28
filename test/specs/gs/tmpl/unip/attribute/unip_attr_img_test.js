casper.test.begin('assertExists() tests', 17, function(test) {

  casper.start().then(function() {

    var imgDetailOptions = {
      directory: 'http://dev.geosense.cz/gp-refs/unip/www/css/img',
      src: 'geosense.png',
      width: '114',
      height: '60',
      title: 'GS logo',
      label: 'img-label'
    };


    //img.Detail as String
    var imgDetail = gs.tmpl.unip.attr.img.Detail(imgDetailOptions);

    test.assertTrue(!!imgDetail, 'img.Detail is defined');


    //img.Detail as DOM element
    var imgDetailEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.img.Detail,
        imgDetailOptions);

    test.assertEquals(imgDetailEl.children.length, 2,
        'img.Detail has 2 children');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, imgDetailEl);

    test.assertEquals(labelElements.length, 1,
        'img.Detail has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        imgDetailOptions.label + ': ',
        'img.Detail\'s label element content set correctly');


    var imgElements = goog.dom.getElementsByTagNameAndClass(
        'img', null, imgDetailEl);

    test.assertEquals(imgElements.length, 1,
        'img.Detail has 1 img element');

    test.assertEquals(imgElements[0].src,
        imgDetailOptions.directory + '/' + imgDetailOptions.src,
        'img.Detail\'s img element src attribute is set correctly'
    );


    //img.Table as String
    var imgTable = gs.tmpl.unip.attr.img.Table(imgDetailOptions);

    test.assertTrue(!!imgTable, 'img.Table is defined');


    //img.Table as DOM element
    var imgTableEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.img.Table,
        imgDetailOptions);

    test.assertEquals(imgTableEl.children.length, 1, 'img.Table has 1 child');


    var imgElements = goog.dom.getElementsByTagNameAndClass(
        'img', null, imgTableEl);

    test.assertEquals(imgElements.length, 1,
        'img.Table has 1 img element');

    test.assertEquals(imgElements[0].src,
        imgDetailOptions.directory + '/t' + imgDetailOptions.src,
        'img.Table\'s img element src attribute is set correctly'
    );


    var imgEditOptions = {
      id: 'test_id',
      title: 'test_title',
      label: 'img-label'
    };


    //img.Edit as String
    var imgEdit = gs.tmpl.unip.attr.img.Edit(imgEditOptions);

    test.assertTrue(!!imgEdit, 'img.Edit is defined');


    //img.Edit as DOM element
    var imgEditEl = goog.soy.renderAsElement(gs.tmpl.unip.attr.img.Edit,
        imgEditOptions);

    test.assertEquals(imgEditEl.children.length, 2,
        'img.edit has 2 children');


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, imgEditEl);

    test.assertEquals(labelElements.length, 1,
        'img.Edit has 1 label element');

    test.assertEquals(labelElements[0].innerHTML,
        imgEditOptions.label + ': ',
        'img.Detail\'s label element content set correctly');


    var inputElements = goog.dom.getElementsByTagNameAndClass(
        'input', null, imgEditEl);

    test.assertEquals(inputElements.length, 2,
        'img.Edit has 2 input elements');

    test.assertEquals(
        inputElements[0].value,
        imgEditOptions.title,
        'img.Edit\'s first input element value attribute is set correctly'
    );

    test.assertEquals(
        inputElements[1].id,
        imgEditOptions.id,
        'img.Edit\'s second input element id attribute is set correctly'
    );

  }).run(function() {
    test.done();
  });
});
