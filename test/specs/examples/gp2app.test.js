casper.test.begin('Tests example gp2app', 1, function(test) {


  casper.start('build/examples/gp2app.html', function() {
    test.assertExists('div#gs-app', 'main div application is found');

  });

  casper.run(function() {
    test.done();
  });

});
