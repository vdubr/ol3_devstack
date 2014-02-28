goog.require('goog.json');
goog.require('gs.cookies');

casper.test.begin('Aplication READ/WRITE/CLEAN cookies', 2,
    function suite(test) {
      gs.cookies.clear('gs1');
      gs.cookies.set('gs1', {'test': 'foo'});
      var obj = gs.cookies.get('gs1');
      test.assertEquals(obj['test'], 'foo', 'Test content of cookies object');
      gs.cookies.clear('gs1');
      var cookies = gs.cookies.get('gs1');
      test.assertEquals(cookies, null, 'Test clear function');
      test.done();
    });
