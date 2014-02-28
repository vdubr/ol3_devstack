goog.require('goog.net.XhrIo');
goog.require('gs.Unip');


var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile);

casper.test.begin('Unip testing', 9, function suite(test) {

  casper.start('http://localhost/unip');

  // this is the testing
  casper.then(function() {
    var url = curFilePath + '/../examples/data/unip/';
    var unip = new gs.Unip({'id': 11372, url: url, 'useWorkers': false});

    test.assertTrue(!!unip, 'Can create UNIP instance');
    test.assertEquals(unip.id, '11372', 'UNIP id set');
    test.assertEquals(unip.url, url, 'UNIP url set');
    test.assertEquals(unip.useWorkers, false, 'Use workers set to false');

    var layers = {'status': 'ok',
      'generated': '2013-10-25 09:03:41',
      'result' : [{
        'count': 600,
        'object_type_ids': [13],
        'module_type': null,
        'name': 'Lampy',
        'button': null,
        'type': 'base',
        'id' : 1
      },
      {
        'count': 199,
        'object_type_ids': [20],
        'module_type': null,
        'name': 'Dopravní značení',
        'button': null,
        'type': 'base',
        'id' : 1087
      }]
    };

    var data_types = {
      'status': 'ok',
      'generated': '2013-10-21 16:59:56',
      'result': [{
        'geometry_type': 'Point',
        'controlers': [{
          'name': 'popis', 'data_type': 'text', 'suffix': '',
          'public': true, 'id': 31, 'label': 'Popis',
          'prefix': '', 'items': []
        }, {
          'name': 'cena', 'data_type': 'float', 'suffix': 'Kč',
          'public': true, 'id': 32, 'label': 'Cena',
          'prefix': '', 'items': []
        }, {
          'name': 'pozn', 'data_type': 'text', 'suffix': '',
          'public': true, 'id': 8, 'label': 'Poznámka',
          'prefix': '', 'items': []
        }, {
          'name': 'foto', 'data_type': 'image', 'suffix': '',
          'public': true, 'id': 9, 'label': 'Foto',
          'prefix': '', 'items': []
        }],
        'label_mask': 'Veřejná studna', 'name': 'studna',
        'label': 'Veřejné studny', 'id': 13
      }]
    };

    unip.setLayerTypes(layers['result']);
    unip.setDataTypes(data_types['result']);

    test.assertTrue(!!unip.layerTypes, 'Layer types set');
    test.assertTrue(!!unip.objectTypes, 'Data types set');

    // get columns
    var columns = unip.getColumns(1);
    test.assertEquals(columns.length, 3, 'Number of collumns coresponds');
    // TODO Test columns content
    // TODO: test getGridData method
    // TODO: can not create layers because of projection EPSG:5514 and it's
    // testing
    // var grid_data = unip.getGridData();

    //test createLayer_()
    var unip_options = {
      url: null
    };
    // unip
    var layer = unip.createLayer(unip_options);
    test.assertTrue(layer instanceof ol.layer.Vector,
        'createLayer() unip creates layer');
    test.assertTrue(layer.getSource() instanceof gs.source.Unip,
        'createLayer() unip creates Unip source');

  });

  casper.run(function() {
    test.done();
  });
});
