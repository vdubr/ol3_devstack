goog.require('goog.dom');
goog.require('goog.style');
goog.require('gs.App');
goog.require('gs.Datagrid');
goog.require('gs.LayerSwitcher');
goog.require('gs.UItemp');
goog.require('gs.Ui');


/**
 * global configuration of WORKERS_URL variable
 */
gs.WORKERS_URL = '../build/workers/%s.js';


var app = new gs.App({
  'target': 'gs-app-1',
  'lang': 'cze',
  'map': /** @type {gs.MapOptions} */ ({
    'layers': [
      {
        'base': {
                    'type': 'wmts',
                    'title': 'Ortofoto ČUZK',
                    'transId': 'ortomap'
        },
        'projection': 'EPSG:3857',
        'matrixSet': 'googlemapscompatibleext2:epsg:3857',
        'url': 'http://geoportal.cuzk.cz/WMTS_ORTOFOTO_900913/WMTService.aspx',
        'layer': 'orto',
        'format': 'image/jpeg',
        'extent': null
      },
      {
        'base': {
                    'title': 'osm1',
                    'type': 'osm',
                    'transId': 'topomap',
                    'visible': false
        }
      }
    ],
    'center': [1604642, 6476872],
    'zoom': 14
  }), unip:/**@type {gs.UnipOptions} */ ({
    url: 'data/unip',
    id: '11372'
  })
});


goog.events.listen(app.unip, gs.unip.UnipEventType.LAYERS_LOADED, function(e) {
  app.unip.createLayers();
}, false, this);

//loadUnipData
app.unip.loadData();

//set app div size
var appEl = goog.dom.getElement('gs-app-1');
goog.style.setStyle(appEl, {
  'width': '100%',
  'height': '100%',
  'position': 'relative'
});


//add layerSwitcher
var ls = new gs.LayerSwitcher({
  'width': 300,
  'visible': true,
  'closeBtn': true
});

//add switcher to application
app.map.addControl(ls);
