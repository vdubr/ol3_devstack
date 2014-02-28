casper.test.begin('DOM elements tests', 16, function(test) {

  casper.start().then(function() {

    var options = {
      value: 'the list goes here',
      label: 'id-list label'
    };


    //idlist.Detail as String
    var idlistDetail = gs.tmpl.unip.attr.idlist.Detail(options);

    test.assertTrue(!!idlistDetail, 'idlist.Detail is defined');


    //idlist.Detail as DOM element
    var idlistDetailEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.idlist.Detail,
        options
        );

    test.assertEquals(idlistDetailEl.children.length, 2,
        'idlist.Detail has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, idlistDetailEl);

    test.assertEquals(labelElements.length, 1,
        'idlist.Detail has 1 label element'
    );

    test.assertEquals(labelElements[0].innerHTML,
        options.label + ': ',
        'idlist.Detail\'s label label content set correctly'
    );


    //idlist.Table as String
    var idlistTable = gs.tmpl.unip.attr.idlist.Table(options);

    test.assertTrue(!!idlistTable, 'idlist.Table is defined');


    //idlist.Table as DOM element
    var idlistTableEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.idlist.Table,
        options
        );

    test.assertEquals(idlistTableEl.innerHTML,
        options.value,
        'idlist.Table\'s content set correctly'
    );


    var idListEditOptions = {
      items: [
        {
          key: 'item1-key',
          value: 'item1-value'
        },
        {
          key: 'item2-key',
          value: 'item2-value'
        }
      ],
      label: 'id-list label'
    };


    //idlist.Edit as String
    var idlistEdit = gs.tmpl.unip.attr.idlist.Edit(idListEditOptions);

    test.assertTrue(!!idlistEdit, 'idlist.Table is defined');


    //idlist.Edit as DOM element
    var idlistEditEl = goog.soy.renderAsElement(
        gs.tmpl.unip.attr.idlist.Edit,
        idListEditOptions
        );

    test.assertEquals(idlistEditEl.children.length, 2,
        'idlist.Edit has 2 children'
    );


    var labelElements = goog.dom.getElementsByTagNameAndClass(
        'label', null, idlistEditEl);

    test.assertEquals(labelElements.length, 1,
        'idlist.Edit has 1 span element'
    );

    test.assertEquals(labelElements[0].innerHTML,
        idListEditOptions.label + ': ',
        'idlist.Edit\'s span element content set correctly'
    );


    var selectElements = goog.dom.getElementsByTagNameAndClass(
        'select', null, idlistEditEl);

    test.assertEquals(selectElements.length, 1,
        'idlist.Edit has 1 select element'
    );

    test.assertEquals(selectElements[0].options.length, 2,
        'idlist.Edit\'s select box has 2 options'
    );

    test.assertEquals(selectElements[0].options[0].value,
        idListEditOptions.items[0].key,
        'first option of idlist.Edit\'s select box has value set correctly'
    );

    test.assertEquals(selectElements[0].options[0].innerHTML,
        idListEditOptions.items[0].value,
        'first option of idlist.Edit\'s select box has innerHTML set correctly'
    );

    test.assertEquals(selectElements[0].options[1].value,
        idListEditOptions.items[1].key,
        'second option of idlist.Edit\'s select box has value set correctly'
    );

    test.assertEquals(selectElements[0].options[1].innerHTML,
        idListEditOptions.items[1].value,
        'second option of idlist.Edit\'s select box has innerHTML set correctly'
    );
  }).run(function() {
    test.done();
  });
});
