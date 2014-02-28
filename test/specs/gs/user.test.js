goog.require('gs.User');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');

casper.test.begin('Can create User', 2, function suite(test) {
  var user = new gs.User({
    name: 'leknin@repanek.cz'
  });

  test.assertInstanceOf(user, gs.User, 'User instance created');
  test.assertEquals(user.getName(), 'leknin@repanek.cz', 'User name set');
  test.done();
});
