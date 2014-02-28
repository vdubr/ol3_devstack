goog.require('gs.App');
goog.require('gs.Ui');
goog.require('gs.cookies');
goog.require('gs.i18n');


var currentFile = require('system').args[3];
var curFilePath = fs.absolute(currentFile);


/**
 * setting path for language files
 */
gs.i18n.langUrl = curFilePath + '/../examples/lang/';

/* XHR cannot load File:// - load skipped
gs.i18n.loadLang('eng');
gs.i18n.loadLang('ger');
gs.i18n.loadLang('cze');
*/


/**
 * function which makes sure, all languages are loaded
 * @return {Boolean}
 */
var languages_loaded = function() {
  if (gs.i18n.langMap['eng'] &&
      gs.i18n.langMap['ger'] &&
      gs.i18n.langMap['cze']) {
    return true;
  }
};

/*
* finally test functions
*/
casper.test.begin('Can translate', 3, function suite(test) {

  casper.start('http://localhost');
  casper.then(function() {
    /* test skipped
    casper.waitFor(languages_loaded, function() {
      test.assertEquals(gs.i18n.trans('hello', 'cze'), 'Ahoj');
      test.assertEquals(gs.i18n.trans('hello', 'ger'), 'Hallo');
      test.assertEquals(gs.i18n.trans('hello', 'eng'), 'Hello');


    });
    */
    test.skip(3, 'translate skipped - XHR cannot load File://. ' +
        'Cross Origin requests are only supported for HTTP.');
  });
  casper.run(function() {
    test.done();
  });

});

casper.test.begin('Can translate element', 5, function suite(test) {

  casper.start('http://localhost');
  casper.then(function() {
    /* test skipped
    casper.waitFor(languages_loaded, function() {
      var button = gs.Ui.button({id: 'hello', classes: ['btn-default']});
      body = goog.dom.getElementsByTagNameAndClass('body')[0];
      goog.dom.appendChild(body, button);

      var node = goog.dom.createElement('div');
      node.setAttribute('gs-data-translateId', 'hello');
      gs.i18n.elem(node, 'hello', 'eng');

      test.assertEquals(goog.dom.getTextContent(node),
          'Hello', 'Element translated');
      test.assertTrue(goog.dom.classes.has(node, 'gs-lang-eng'),
          'Element class set');

      gs.i18n.elem(node, 'hello', 'ger');
      test.assertEquals(goog.dom.getTextContent(node), 'Hallo',
          'Element translated');
      classes = goog.dom.classes.get(node);
      test.assertFalse(goog.dom.classes.has(node, 'gs-lang-eng'),
          'Element class unset');
      test.assertTrue(goog.dom.classes.has(node, 'gs-lang-ger'),
          'Element class set');

    });
    */
    test.skip(5, 'translate element skipped - XHR cannot load File://. ' +
        'Cross Origin requests are only supported for HTTP.');
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin('Can translate app', 1, function suite(test) {

  casper.start('http://localhost');
  casper.then(function() {
    /* test skipped
    casper.waitFor(languages_loaded, function() {

      gs.cookies.set('app', {'lang': null});
      var app = new gs.App({'id': 'app'});
      app.setLang('eng');
      test.assertEquals(app.getLang(), 'eng', 'App language set to english');
      test.done();
    });
    */
    test.skip(1, 'translate app skipped - XHR cannot load File://. ' +
        'Cross Origin requests are only supported for HTTP.');
  });
  casper.run(function() {
    test.done();
  });
});
