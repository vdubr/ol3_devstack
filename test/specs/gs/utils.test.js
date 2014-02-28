goog.require('gs.utils');

casper.test.begin('Utils getId', 5,
    function suite(test) {
      gs.utils.id_counter = 0;
      var id = gs.utils.getId('foo');
      test.assertEquals(id, 'gs-foo-1', 'first id is 1');
      id = gs.utils.getId('foo');
      test.assertEquals(id, 'gs-foo-2', 'second id is 2');
      id = gs.utils.getId('bar');
      test.assertEquals(id, 'gs-bar-3', '3rd id is 3');

      var elem = document.createElement('div');
      elem.id = 'gs-bar-4';
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(elem);
      id = gs.utils.getId('bar');
      test.assertEquals(id, 'gs-bar-5', 'next id is 5');
      test.assertEquals(gs.utils.getId(), 'gs-6', 'next id is 6');
      test.done();
    }
);

casper.test.begin('getWorkerUrl', 1,
    function suite(test) {
      gs.WORKERS_URL = '/workers/%s.js';
      test.assertEquals(
          gs.utils.getWorkerUrl('dataloader'),
          '/workers/dataloader.js',
          'worker url ok');
      test.done();
    }
);

casper.test.begin('getAbsUrl', 3,
    function suite(test) {

      casper.start('http://localhost');
      casper.then(function() {

        test.assertEquals(
            gs.utils.getAbsUrl('/foo/bar'),
            'file:/foo/bar',
            'path ok');

        test.assertEquals(gs.utils.getAbsUrl('http://foo/bar'),
            'http://foo/bar', '"http" url ok');

        test.assertTrue(gs.utils.getAbsUrl('fooxxx').search('fooxxx') > 0,
            '"http" url ok');
      });

      casper.run(function() {
        test.done();
      });
    }
);
