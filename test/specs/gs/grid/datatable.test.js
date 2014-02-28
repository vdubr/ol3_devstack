goog.require('gs.grid.Datatable');

casper.test.begin('Datatable', 4, function suite(test) {
  casper.start().then(function() {

    var options = {
      data: [
        {
          col1: 'feature1', col2: '1',
          'extent': [0, 0, 2, 2], 'object_type_id': 1
        },
        {
          col1: 'feature21', col2: '2',
          'extent': [0, 3, 2, 2], 'object_type_id': 2
        },
        {
          col1: 'feature3', col2: '3',
          'extent': [0, 0, 2, 2], 'object_type_id': 2
        },
        {
          col1: 'feature4', col2: '4',
          'extent': [1, 1, 4, 4], 'object_type_id': 2
        }
      ]
    };

    var table = new gs.grid.Datatable(options);

    /*
     * test datatable constructor
     */
    test.assertTrue(!!table, 'Can create datatable');


    /*
     * test getData method
     */
    test.assertEquals(table.getData(), options.data,
        'getData() returns the expected data');


    /*
     * test getId method
     */
    test.assertEquals(table.getId(), table.id_,
        'getId() returns the expected id');


    /*
     * test getMap
     */
    test.assertEquals(table.getMap(), table.map_,
        'getMap() returns the expected map');


  }).run(function() {
    test.done();
  });
});
