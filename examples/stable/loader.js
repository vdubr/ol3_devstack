(function() {
  var splitUrl = window.location.href.split('/');
  var exampleId = splitUrl[splitUrl.length - 1] ||
      splitUrl[splitUrl.length - 2];
  var splitExampleId = exampleId.split('.html')[0];
  var hostname = window.location.hostname || 'localhost';


  if (window.location.href.match(/mode=([a-z0-9\-]+)\&?/i) === null)
  {
    var mode = '?mode=RAW';
    window.location.search = mode;
  }
  else {
    var mode = window.location.href.match(/mode=([a-z0-9\-]+)\&?/i)[1];
  }
  var id = splitExampleId;
  var url = 'http://' + hostname + ':9810/compile?id=' + id + '&mode=' + mode;

  document.write('<script type="text/javascript" src="' + url + '"></script>');
}());
