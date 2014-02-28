goog.require('gs.source.Unip');
goog.require('ol.layer.Vector');

var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile);

casper.test.begin('Can create UNIP source', 3, function suite(test) {

  casper.start('http://localhost/unip');

  // this is the testing
  casper.then(function() {
    var unip = new gs.source.Unip({
      unipId: 11372,
      layerId: 45,
      useWorkers: false//,
      //url: curFilePath + '/../examples/data/unip/'
    });

    test.assertInstanceOf(unip, gs.source.Unip, 'Unip source instance created');
    test.assertEquals(unip.unipId, '11372', 'UnipID set');
    test.assertEquals(unip.layerId, '45', 'Layer Id set');
    test.done();
  });

  casper.run(function() {
    test.done();
  });
});
