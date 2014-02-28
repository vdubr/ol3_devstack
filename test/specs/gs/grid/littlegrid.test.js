goog.require('gs.grid.LittleGrid');

casper.test.begin('LittleGrid', 6, function suite(test) {
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

    var lg = new gs.grid.LittleGrid(options);

    /*
     * test littlegrid constructor
     */
    test.assertTrue(!!lg, 'Can create littlegrid');


    /*
     * test addEventToRows
     */
    //get the number of click listeners before addEvenToRows call
    var origListeners = goog.object.getValues(
        goog.object.filter(goog.events.listeners_,
            function(listener) {
              return (listener.type === 'click' &&
                  listener.src.tagName === goog.dom.TagName.TR);
            })).length;
    var rows = goog.dom.getElementsByTagNameAndClass('tr', null, lg.table_);
    lg.addEventToRows();
    //get the number of click listeners after addEvenToRows call
    var listeners = goog.object.getValues(
        goog.object.filter(goog.events.listeners_,
            function(listener) {
              return (listener.type === 'click' &&
                  listener.src.tagName === goog.dom.TagName.TR);
            })).length;
    test.assertEquals(listeners - origListeners, rows.length,
        'the expected number of click listeners has been registered');


    /*
     * test getData method
     */
    test.assertEquals(lg.getData(), options.data,
        'getData() returns the expected data');


    /*
     * test getElement method
     */
    var table = lg.getElement();
    test.assertEquals(goog.dom.getElementsByTagNameAndClass(
        'table', null, table).length,
        goog.dom.getElementsByTagNameAndClass(
            'table', null, lg.table_).length,
        'getElement() returns a table');
    test.assertEquals(table.id, lg.id_,
        'the table has the expected id');


    /*
     * test getId method
     */
    test.assertEquals(lg.getId(), lg.id_,
        'getId() returns the expected id');


  }).run(function() {
    test.done();
  });
});
