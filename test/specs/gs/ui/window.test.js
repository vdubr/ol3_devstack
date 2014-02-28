goog.require('goog.dom');
goog.require('gs.ui.Window');

casper.test.begin('Create ui.window', 9, function suite(test) {

  var win1 = new gs.ui.Window();
  test.assertInstanceOf(win1, gs.ui.Window, 'Window created');

  win1.show();

  var testWin1 = goog.dom.getElementsByTagNameAndClass(
      'div', 'modal-dialog', goog.dom.getElement('body'));
  var backDrop = goog.dom.getElementsByTagNameAndClass(
      'div', 'modal-backdrop', goog.dom.getElement('body'));

  test.assertEquals(testWin1.length, 1, 'Body contain window');
  test.assertEquals(backDrop.length, 1 , 'Body contain backdrop');

  win1.hide();

  testWin1 = goog.dom.getElementsByTagNameAndClass(
      'div', 'modal-dialog', goog.dom.getElement('body'));
  test.assertEquals(testWin1.length, 0 , 'Body do not contain window');


  var header = goog.dom.createDom('div', {class: 'test-header'},'header');
  var body = goog.dom.createDom('div', {class: 'test-body'},'This is content');
  var footer = goog.dom.createDom(
      'div', {class: 'test-footer'},'please close me');

  var win2 = new gs.ui.Window({header: header, body: body, footer: footer});
  win2.show();

  var testHeader = goog.dom.getElementsByTagNameAndClass(
      'div', 'test-header', goog.dom.getElement('body'));
  test.assertEquals(testHeader.length, 1 , 'Window header has content element');

  var testBody = goog.dom.getElementsByTagNameAndClass(
      'div', 'test-body', goog.dom.getElement('body'));
  test.assertEquals(testBody.length, 1 , 'Window body has content element');

  var testFooter = goog.dom.getElementsByTagNameAndClass(
      'div', 'test-footer', goog.dom.getElement('body'));
  test.assertEquals(testFooter.length, 1 , 'Window footer has content element');

  win2.hide();


  //test backdrop

  var win3 = new gs.ui.Window({backdrop: false});
  win3.show();
  var backDrop3 = goog.dom.getElementsByTagNameAndClass(
      'div', 'modal-backdrop', goog.dom.getElement('body'));
  test.assertEquals(backDrop3.length, 0 , 'Body do not contain backdrop');
  win3.hide();

  var win4 = new gs.ui.Window({backdrop: true});
  win4.show();
  var backDrop4 = goog.dom.getElementsByTagNameAndClass(
      'div', 'modal-backdrop', goog.dom.getElement('body'));
  test.assertEquals(backDrop4.length, 1 , 'Body contain backdrop');
  win4.hide();


  test.done();
});
