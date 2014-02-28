goog.require('gs.worker.DataLoader');


var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile);
var arrived_data;
var postMessage = function(data) {
  arrived_data = data;
};

casper.test.begin('Data loader Worker testing', 1, function suite(test) {

  casper.start('http://localhost/dataloader');


  casper.then(function() {
    var url = curFilePath + '/../examples/data/unip/findLayers/11372';

    /*
     * test skipped

    // wait, till layers and data types are loaded and continue
    casper.waitFor(function() { return arrived_data;}, function() {
      test.assertEquals(arrived_data['status'], 'ok',
          'Data loaded, status is OK');
    });

    gs.worker.DataLoader.onmessage(goog.json.serialize({data: {url: url}}));
    */
    test.skip(1, 'Data loader Worker skipped - XHR cannot load File://. ' +
        'Cross Origin requests are only supported for HTTP. Url: ' + url);

  });

  casper.run(function() {
    test.done();
  });
});
