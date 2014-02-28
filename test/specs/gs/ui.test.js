goog.require('goog.dom');
goog.require('gs.Ui');

casper.test.begin('Test new button', 8, function(test) {
  var bId = 'testId';
  var bTransId = 'hello';
  var bClasses = ['btn-default', 'casper-test'];

  var firstButton = gs.Ui.button({
    'id': bId,
    'translateid': bTransId,
    'classes': bClasses,
    'attr': {'data-casper': 'thisIsDataAttr'},
    'innerHTML': '<span>test</span>'
  });

  //test ID
  test.assertEquals(firstButton.id, bId, 'ID');

  //test translate ID
  test.assertEquals(firstButton.getAttribute('data-gs-translateid'), bTransId,
      'translate ID');

  //test classes
  var getClass = firstButton.className;

  for (var i = 0; i < bClasses.length; i++) {
    test.assert(getClass.indexOf(bClasses[i]) >= 0, 'Test class');
  }
  test.assert(getClass.indexOf('gs-lang') >= 0, 'Test class');
  test.assert(getClass.indexOf('btn') >= 0, 'Test class');

  //test attr
  test.assertEquals(firstButton.getAttribute('data-casper'), 'thisIsDataAttr');

  //test inner HTML
  test.assertEquals(firstButton.innerHTML, '<span>test</span>',
      'Test innerHTML');

  test.done();
});


casper.test.begin('Test new button group', 5, function(test) {
  var bgId = 'testId';
  var bgClasses = ['gs-this-is-buttongroup', 'casper-test'];

  var buttonGroup = gs.Ui.buttonGroup({
    'id': bgId,
    'classes': bgClasses,
    'attr': {'data-casper': 'thisIsDataAttr'},
    'innerHTML': '<span>test buttonGroup</span>'
  });

  //test ID
  test.assertEquals(buttonGroup.id, bgId, 'ID');

  //test classes
  var getClass = buttonGroup.className;

  for (var i = 0; i < bgClasses.length; i++) {
    test.assert(getClass.indexOf(bgClasses[i]) >= 0, 'Test class');
  }

  //test attr
  test.assertEquals(buttonGroup.getAttribute('data-casper'), 'thisIsDataAttr');

  //test inner HTML -
  test.assertEquals(buttonGroup.textContent, '<span>test buttonGroup</span>',
      'Test innerHTML');

  test.done();
});



casper.test.begin('Test new dropdown', 32, function(test) {

  //dropdown
  var ddId = 'testId';
  var ddClasses = ['gs-this-is-buttongroup', 'casper-test'];

  //button
  var bId = 'testButtonId';
  var bTransId = 'hello';
  var bClasses = ['btn-default', 'casper-test'];

  var firstButton = {
    'id': bId,
    'translateid': bTransId,
    'classes': bClasses,
    'attr': {'data-casper': 'thisIsDataAttr'},
    'innerHTML': '<span>test</span>'
  };


  var componentsId = ['languageChooserCze', 'languageChooserEn',
    'languageChooserDe'];
  var componentsClasses = ['cze', 'en', 'de', 'gs-lang', 'gs-language-cz'];
  var dropdown = gs.Ui.dropDown({
    'id': ddId,
    'classes': ddClasses,
    'button': /** @type {gs.ui.DropDownButton} */ (firstButton),
    'components': [
      {
        'classes': ['gs-lang', 'gs-language-cz', 'cze'],
        'id': 'languageChooserCze',
        'translateid': 'cze'
      },
      {
        'classes': ['gs-lang', 'gs-language-cz', 'en'],
        'id': 'languageChooserEn',
        'translateid': 'en'
      },
      'divider',
      {
        'classes': ['gs-lang', 'gs-language-cz', 'de'],
        'id': 'languageChooserDe',
        'translateid': 'de'}
    ]
  }
  );

  //
  //test rdopdown div
  //
  //test dropdown ID
  test.assertEquals(dropdown.id, ddId, 'ID');

  //test dropdown classes
  var getClass = dropdown.className;

  for (var i = 0; i < ddClasses.length; i++) {
    test.assert(getClass.indexOf(ddClasses[i]) >= 0, 'Test class');
  }
  //test element counts
  test.assertEquals(dropdown.getElementsByTagName('button').length,
      1, 'Test button count');
  test.assertEquals(dropdown.getElementsByTagName('ul').length, 1,
      'Test list count');
  test.assertEquals(dropdown.getElementsByTagName('li').length, 4,
      'Test components count');

  //////////////////////
  //Test dropdown button
  //////////////////////
  var firstDDButton = dropdown.getElementsByTagName('button')[0];

  //test ID
  test.assertEquals(firstDDButton.id, bId, 'ID');

  //test translate ID
  test.assertEquals(firstDDButton.getAttribute('data-gs-translateid'),
      bTransId, 'translate ID');

  //test classes
  var getClassB = firstDDButton.className;

  for (var i = 0; i < bClasses.length; i++) {
    test.assert(getClassB.indexOf(bClasses[i]) >= 0, 'Test class');
  }
  test.assert(getClassB.indexOf('gs-lang') >= 0, 'Test class');
  test.assert(getClassB.indexOf('btn') >= 0, 'Test class');

  //test attr
  test.assertEquals(firstDDButton.getAttribute('data-casper'),
      'thisIsDataAttr', 'Test attr');

  //test inner HTML
  test.assertEquals(firstDDButton.innerHTML, '<span>test</span>',
      'Test innerHTML');

  ////////////////
  //test component
  ////////////////
  var DDcomponents = dropdown.getElementsByTagName('li');
  for (var i = 0; i < DDcomponents.length; i++)
  {
    if (DDcomponents[i].className.indexOf('divider') == -1)
    {
      var component = DDcomponents[i];
      test.assertEquals(component.getElementsByTagName('a').length, 1,
          'Test component anchor');
      var anchor = component.getElementsByTagName('a')[0];

      //test classes
      var getClassA = anchor.className.split(' ');
      for (var j = 0; j < getClassA.length; j++) {
        test.assert(componentsClasses.indexOf(getClassA[j]) >= 0,
            'Test class');
      }

      //test translate id
      //translate ID must be in classes (hack)
      test.assert(componentsClasses.indexOf(
          anchor.getAttribute('data-gs-translateid')) >= 0,
          'Test translate ID');

      //test id
      //ID must be in classes componentsId (hack)
      test.assert(componentsId.indexOf(anchor.id) >= 0, 'Test ID');
    }
  }
  test.done();
});
