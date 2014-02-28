goog.require('goog.dom');
goog.require('gs.control.Geolocation');


goog.dom.getElementsByTagNameAndClass('body')[0].appendChild(target);
// TODO tests
casper.test.begin('Geolocation', 1, function suite(test) {
  test.skip(1, 'skipped geolocation test');
  test.done();
});
