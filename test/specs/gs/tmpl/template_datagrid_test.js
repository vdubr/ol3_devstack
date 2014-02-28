casper.test.begin('DOM elements tests', 5, function(test) {
  casper.start().then(function() {
    var options = {
      layername: 'the layername',
      header: 'head layer',
      object_types: [
        {
          'id': 'id1',
          'label': 'label1'
        }
      ],
      columns: [
        {
          'property': 'property1',
          'label': 'label1'
        },
        {
          'property': 'property2',
          'label': 'label2'
        }
      ]
    };

    //Datagrid.table as String
    var table = gs.tmpl.Datagrid.table(options);

    test.assertTrue(!!table, 'Datagrid.table is defined');

    //Datagrid.table as DOM element
    var tableEl = goog.soy.renderAsElement(gs.tmpl.Datagrid.table, options);

    test.assertEquals(goog.dom.getElementsByTagNameAndClass('table', null,
        tableEl).length, 1,
        'Datagrid.table element has 1 child table element');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass('tr', null,
        tableEl).length, 1,
        'Datagrid.table\'s table has 1 row');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass('th', null,
        tableEl)[1].innerHTML,
        options.columns[0].label,
        'First column label correct');

    test.assertEquals(goog.dom.getElementsByTagNameAndClass('th', null,
        tableEl)[2].innerHTML,
        options.columns[1].label,
        'Second column label correct');

  }).run(function() {
    test.done();
  });
});
