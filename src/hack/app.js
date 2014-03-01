goog.require('Proj4js');
goog.require('ol.Map');
goog.provide('hack.App');



/**
 * @class
 * @constructor
 */
hack.App = function() {
  var map = new ol.Map({
    'renderer': ol.RendererHint.CANVAS,
    'view': new ol.View2D({
      'center': [1111111, 2222222],
      'zoom': 4
    })
  });
  map.set('aaa', 'aaa');
};


/**
* function
*/
hack.App.prototype.start = function() {
  window['console']['log']('jo');
  window['console']['log']('joasdfjknasůdj');
  
};
