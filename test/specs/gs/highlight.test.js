goog.require('gs.FeatureHighlight');
goog.require('ol.FeatureOverlay');
goog.require('ol.Map');

casper.test.begin('gs.FeatureHighlight', 6,
    function suite(test) {
      var map = new ol.Map({});
      var highlight = new gs.FeatureHighlight({});
      highlight.setMap(map);

      test.assertTrue(map == highlight.get('map'), 'Map set');
      test.assertTrue(!!highlight.getOverlay(), 'Overlay set');

      var point_feature = new ol.Feature(new ol.geom.Point([0, 0]));
      var icon_feature = new ol.Feature(new ol.geom.Point([1, 1]));

      point_feature.setStyleFunction(function(feature, resolution) {
        return [new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'blue'
          })
        })];
      });

      /*
       * simple vector highlight
       */
      highlight.highlight(point_feature);
      // NOTE: using private variables here, might be broken in future
      var point_feature_style =
          highlight.getOverlay().styleFunction_(point_feature)[0];

      test.assertEquals(point_feature_style.getFill().getColor(),
          'red', 'point feature highlighted');

      icon_feature.setStyleFunction(function(feature, resolution) {

        var icon = new ol.style.Icon({
          src: 'http://foo/bar',
          size: [10, 10]
        });

        return [
          new ol.style.Style({
            image: icon
          })
        ];
      });


      /*
       * image feature highlight
       */
      highlight.highlight(icon_feature, undefined,
          gs.FeatureHighlight.type.ICON);
      // NOTE: using private variables here, might be broken in future
      var icon_feature_style =
          highlight.getOverlay().styleFunction_(icon_feature)[0];

      test.assertEquals(icon_feature_style.getImage().getSize()[0],
          20, 'icon feature highlighted');

      test.assertEquals(highlight.getOverlay().getFeatures().getArray().length,
          1, 'Everything highlighted');

      /*
       * unhighlight
       */
      highlight.unHighlight(point_feature);
      highlight.unHighlight(icon_feature);
      test.assertEquals(highlight.getOverlay().getFeatures().getArray().length,
          0, 'Only one highlight');

      test.done();
    });
