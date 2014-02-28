goog.provide('ol.DrawEvent');
goog.provide('ol.interaction.Draw');

goog.require('goog.asserts');
goog.require('goog.events.Event');
goog.require('ol.Collection');
goog.require('ol.Coordinate');
goog.require('ol.Feature');
goog.require('ol.FeatureOverlay');
goog.require('ol.Map');
goog.require('ol.MapBrowserEvent');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.LineString');
goog.require('ol.geom.MultiLineString');
goog.require('ol.geom.MultiPoint');
goog.require('ol.geom.MultiPolygon');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.interaction.Interaction');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');


/**
 * @enum {string}
 */
ol.DrawEventType = {
  DRAWSTART: 'drawstart',
  DRAWEND: 'drawend'
};



/**
 * @constructor
 * @extends {goog.events.Event}
 * @implements {oli.DrawEvent}
 * @param {ol.DrawEventType} type Type.
 * @param {ol.Feature} feature The feature drawn.
 */
ol.DrawEvent = function(type, feature) {

  goog.base(this, type);

  /**
   * @type {ol.Feature}
   */
  this.feature = feature;

};
goog.inherits(ol.DrawEvent, goog.events.Event);



/**
 * Interaction that allows drawing geometries
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @param {olx.interaction.DrawOptions} options Options.
 * @todo stability experimental
 */
ol.interaction.Draw = function(options) {

  goog.base(this);

  /**
   * Target source for drawn features.
   * @type {ol.source.Vector}
   * @private
   */
  this.source_ = goog.isDef(options.source) ? options.source : null;

  /**
   * Pixel distance for snapping.
   * @type {number}
   * @private
   */
  this.snapTolerance_ = goog.isDef(options.snapTolerance) ?
      options.snapTolerance : 12;

  /**
   * Geometry type.
   * @type {ol.geom.GeometryType}
   * @private
   */
  this.type_ = options.type;

  /**
   * Drawing mode (derived from geometry type.
   * @type {ol.interaction.DrawMode}
   * @private
   */
  this.mode_ = ol.interaction.Draw.getMode_(this.type_);

  /**
   * Finish coordinate for the feature (first point for polygons, last point for
   * linestrings).
   * @type {ol.Coordinate}
   * @private
   */
  this.finishCoordinate_ = null;

  /**
   * Sketch feature.
   * @type {ol.Feature}
   * @private
   */
  this.sketchFeature_ = null;

  /**
   * Sketch point.
   * @type {ol.Feature}
   * @private
   */
  this.sketchPoint_ = null;

  /**
   * Sketch line. Used when drawing polygon.
   * @type {ol.Feature}
   * @private
   */
  this.sketchLine_ = null;

  /**
   * Sketch polygon. Used when drawing polygon.
   * @type {ol.geom.RawPolygon}
   * @private
   */
  this.sketchRawPolygon_ = null;

  /**
   * Squared tolerance for handling click events.  If the squared distance
   * between a down and click event is greater than this tolerance, click events
   * will not be handled.
   * @type {number}
   * @private
   */
  this.squaredClickTolerance_ = 4;

  /**
   * Draw overlay where are sketch features are drawn.
   * @type {ol.FeatureOverlay}
   * @private
   */
  this.overlay_ = new ol.FeatureOverlay();
  this.overlay_.setStyleFunction(goog.isDef(options.styleFunction) ?
      options.styleFunction : ol.interaction.Draw.defaultStyleFunction
  );
};
goog.inherits(ol.interaction.Draw, ol.interaction.Interaction);


/**
 * @param {ol.Feature} feature Feature.
 * @param {number} resolution Resolution.
 * @return {Array.<ol.style.Style>} Styles.
 */
ol.interaction.Draw.defaultStyleFunction = (function() {
  /** @type {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} */
  var styles = {};
  styles[ol.geom.GeometryType.POLYGON] = [
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.5]
      })
    })
  ];
  styles[ol.geom.GeometryType.MULTI_POLYGON] =
      styles[ol.geom.GeometryType.POLYGON];

  styles[ol.geom.GeometryType.LINE_STRING] = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 153, 255, 1],
        width: 3
      })
    })
  ];
  styles[ol.geom.GeometryType.MULTI_LINE_STRING] =
      styles[ol.geom.GeometryType.LINE_STRING];

  styles[ol.geom.GeometryType.POINT] = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [0, 153, 255, 1]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 255, 255, 0.75],
          width: 1.5
        })
      }),
      zIndex: 100000
    })
  ];
  styles[ol.geom.GeometryType.MULTI_POINT] =
      styles[ol.geom.GeometryType.POINT];

  return function(feature, resolution) {
    return styles[feature.getGeometry().getType()];
  };
})();


/**
 * @inheritDoc
 */
ol.interaction.Draw.prototype.setMap = function(map) {
  if (goog.isNull(map)) {
    // removing from a map, clean up
    this.abortDrawing_();
  }
  this.overlay_.setMap(map);
  goog.base(this, 'setMap', map);
};


/**
 * @inheritDoc
 */
ol.interaction.Draw.prototype.handleMapBrowserEvent = function(event) {
  var map = event.map;
  if (!map.isDef()) {
    return true;
  }
  var pass = true;
  if (event.type === ol.MapBrowserEvent.EventType.CLICK) {
    pass = this.handleClick_(event);
  } else if (event.type === ol.MapBrowserEvent.EventType.MOUSEMOVE) {
    pass = this.handleMove_(event);
  } else if (event.type === ol.MapBrowserEvent.EventType.DBLCLICK) {
    pass = false;
  }
  return pass;
};


/**
 * Handle click events.
 * @param {ol.MapBrowserEvent} event A click event.
 * @return {boolean} Pass the event to other interactions.
 * @private
 */
ol.interaction.Draw.prototype.handleClick_ = function(event) {
  var downPx = event.map.getEventPixel(event.target.getDown());
  var clickPx = event.pixel;
  var dx = downPx[0] - clickPx[0];
  var dy = downPx[1] - clickPx[1];
  var squaredDistance = dx * dx + dy * dy;
  var pass = true;
  if (squaredDistance <= this.squaredClickTolerance_) {
    if (goog.isNull(this.finishCoordinate_)) {
      this.startDrawing_(event);
    } else if (this.mode_ === ol.interaction.DrawMode.POINT ||
        this.atFinish_(event)) {
      this.finishDrawing_(event);
    } else {
      this.addToDrawing_(event);
    }
    pass = false;
  }
  return pass;
};


/**
 * Handle mousemove events.
 * @param {ol.MapBrowserEvent} event A mousemove event.
 * @return {boolean} Pass the event to other interactions.
 * @private
 */
ol.interaction.Draw.prototype.handleMove_ = function(event) {
  if (this.mode_ === ol.interaction.DrawMode.POINT &&
      goog.isNull(this.finishCoordinate_)) {
    this.startDrawing_(event);
  } else if (!goog.isNull(this.finishCoordinate_)) {
    this.modifyDrawing_(event);
  }
  return true;
};


/**
 * Determine if an event is within the snapping tolerance of the start coord.
 * @param {ol.MapBrowserEvent} event Event.
 * @return {boolean} The event is within the snapping tolerance of the start.
 * @private
 */
ol.interaction.Draw.prototype.atFinish_ = function(event) {
  var at = false;
  if (!goog.isNull(this.sketchFeature_)) {
    var geometry = this.sketchFeature_.getGeometry();
    var potentiallyDone = false;
    var potentiallyFinishCoordinates = [this.finishCoordinate_];
    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
      goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
      potentiallyDone = geometry.getCoordinates().length > 2;
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
      goog.asserts.assertInstanceof(geometry, ol.geom.Polygon);
      potentiallyDone = geometry.getCoordinates()[0].length > 2;
      potentiallyFinishCoordinates = [this.sketchRawPolygon_[0][0],
        this.sketchRawPolygon_[0][this.sketchRawPolygon_[0].length - 2]];
    }
    if (potentiallyDone) {
      var map = event.map;
      for (var i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
        var finishCoordinate = potentiallyFinishCoordinates[i];
        var finishPixel = map.getPixelFromCoordinate(finishCoordinate);
        var pixel = event.pixel;
        var dx = pixel[0] - finishPixel[0];
        var dy = pixel[1] - finishPixel[1];
        at = Math.sqrt(dx * dx + dy * dy) <= this.snapTolerance_;
        if (at) {
          this.finishCoordinate_ = finishCoordinate;
          break;
        }
      }
    }
  }
  return at;
};


/**
 * Start the drawing.
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw.prototype.startDrawing_ = function(event) {
  var start = event.coordinate;
  this.finishCoordinate_ = start;
  var geometry;
  if (this.mode_ === ol.interaction.DrawMode.POINT) {
    geometry = new ol.geom.Point(start.slice());
  } else {
    this.sketchPoint_ = new ol.Feature(new ol.geom.Point(start.slice()));

    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
      geometry = new ol.geom.LineString([start.slice(), start.slice()]);
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
      this.sketchLine_ = new ol.Feature(new ol.geom.LineString([start.slice(),
            start.slice()]));
      this.sketchRawPolygon_ = [[start.slice(), start.slice()]];
      geometry = new ol.geom.Polygon(this.sketchRawPolygon_);
    }
  }
  goog.asserts.assert(goog.isDef(geometry));
  this.sketchFeature_ = new ol.Feature(geometry);
  this.updateSketchFeatures_();
  this.dispatchEvent(new ol.DrawEvent(ol.DrawEventType.DRAWSTART,
      this.sketchFeature_));
};


/**
 * Modify the drawing.
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw.prototype.modifyDrawing_ = function(event) {
  var coordinate = event.coordinate;
  var geometry = this.sketchFeature_.getGeometry();
  var coordinates, last;
  if (this.mode_ === ol.interaction.DrawMode.POINT) {
    goog.asserts.assertInstanceof(geometry, ol.geom.Point);
    last = geometry.getCoordinates();
    last[0] = coordinate[0];
    last[1] = coordinate[1];
    geometry.setCoordinates(last);
  } else {
    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
      goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
      coordinates = geometry.getCoordinates();
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
      goog.asserts.assertInstanceof(geometry, ol.geom.Polygon);
      coordinates = this.sketchRawPolygon_[0];
    }
    if (this.atFinish_(event)) {
      // snap to finish
      coordinate = this.finishCoordinate_.slice();
    }
    var sketchPointGeom = this.sketchPoint_.getGeometry();
    goog.asserts.assertInstanceof(sketchPointGeom, ol.geom.Point);
    sketchPointGeom.setCoordinates(coordinate);
    last = coordinates[coordinates.length - 1];
    last[0] = coordinate[0];
    last[1] = coordinate[1];
    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
      goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
      geometry.setCoordinates(coordinates);
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
      var sketchLineGeom = this.sketchLine_.getGeometry();
      goog.asserts.assertInstanceof(sketchLineGeom, ol.geom.LineString);
      sketchLineGeom.setCoordinates(coordinates);
      goog.asserts.assertInstanceof(geometry, ol.geom.Polygon);
      geometry.setCoordinates(this.sketchRawPolygon_);
    }
  }
  this.updateSketchFeatures_();
};


/**
 * Add a new coordinate to the drawing.
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw.prototype.addToDrawing_ = function(event) {
  var coordinate = event.coordinate;
  var geometry = this.sketchFeature_.getGeometry();
  var coordinates, last;
  if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
    this.finishCoordinate_ = coordinate.slice();
    goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
    coordinates = geometry.getCoordinates();
    coordinates.push(coordinate.slice());
    geometry.setCoordinates(coordinates);
  } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
    this.sketchRawPolygon_[0].push(coordinate.slice());
    goog.asserts.assertInstanceof(geometry, ol.geom.Polygon);
    geometry.setCoordinates(this.sketchRawPolygon_);
  }
  this.updateSketchFeatures_();
};


/**
 * Stop drawing and add the sketch feature to the target layer.
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw.prototype.finishDrawing_ = function(event) {
  var sketchFeature = this.abortDrawing_();
  goog.asserts.assert(!goog.isNull(sketchFeature));
  var coordinates;
  var geometry = sketchFeature.getGeometry();
  if (this.mode_ === ol.interaction.DrawMode.POINT) {
    goog.asserts.assertInstanceof(geometry, ol.geom.Point);
    coordinates = geometry.getCoordinates();
  } else if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
    goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
    coordinates = geometry.getCoordinates();
    // remove the redundant last point
    coordinates.pop();
    geometry.setCoordinates(coordinates);
  } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
    goog.asserts.assertInstanceof(geometry, ol.geom.Polygon);
    // When we finish drawing a polygon on the last point,
    // the last coordinate is duplicated as for LineString
    // we force the replacement by the first point
    this.sketchRawPolygon_[0].pop();
    this.sketchRawPolygon_[0].push(this.sketchRawPolygon_[0][0]);
    geometry.setCoordinates(this.sketchRawPolygon_);
    coordinates = geometry.getCoordinates();
  }

  // cast multi-part geometries
  if (this.type_ === ol.geom.GeometryType.MULTI_POINT) {
    sketchFeature.setGeometry(new ol.geom.MultiPoint([coordinates]));
  } else if (this.type_ === ol.geom.GeometryType.MULTI_LINE_STRING) {
    sketchFeature.setGeometry(new ol.geom.MultiLineString([coordinates]));
  } else if (this.type_ === ol.geom.GeometryType.MULTI_POLYGON) {
    sketchFeature.setGeometry(new ol.geom.MultiPolygon([coordinates]));
  }

  if (!goog.isNull(this.source_)) {
    this.source_.addFeature(sketchFeature);
  }
  this.dispatchEvent(new ol.DrawEvent(ol.DrawEventType.DRAWEND, sketchFeature));
};


/**
 * Stop drawing without adding the sketch feature to the target layer.
 * @return {ol.Feature} The sketch feature (or null if none).
 * @private
 */
ol.interaction.Draw.prototype.abortDrawing_ = function() {
  this.finishCoordinate_ = null;
  var sketchFeature = this.sketchFeature_;
  if (!goog.isNull(sketchFeature)) {
    this.sketchFeature_ = null;
    this.sketchPoint_ = null;
    this.sketchLine_ = null;
    this.overlay_.getFeatures().clear();
  }
  return sketchFeature;
};


/**
 * Redraw the skecth features.
 * @private
 */
ol.interaction.Draw.prototype.updateSketchFeatures_ = function() {
  var sketchFeatures = [this.sketchFeature_];
  if (!goog.isNull(this.sketchLine_)) {
    sketchFeatures.push(this.sketchLine_);
  }
  if (!goog.isNull(this.sketchPoint_)) {
    sketchFeatures.push(this.sketchPoint_);
  }
  this.overlay_.setFeatures(new ol.Collection(sketchFeatures));
};


/**
 * Get the drawing mode.  The mode for mult-part geometries is the same as for
 * their single-part cousins.
 * @param {ol.geom.GeometryType} type Geometry type.
 * @return {ol.interaction.DrawMode} Drawing mode.
 * @private
 */
ol.interaction.Draw.getMode_ = function(type) {
  var mode;
  if (type === ol.geom.GeometryType.POINT ||
      type === ol.geom.GeometryType.MULTI_POINT) {
    mode = ol.interaction.DrawMode.POINT;
  } else if (type === ol.geom.GeometryType.LINE_STRING ||
      type === ol.geom.GeometryType.MULTI_LINE_STRING) {
    mode = ol.interaction.DrawMode.LINE_STRING;
  } else if (type === ol.geom.GeometryType.POLYGON ||
      type === ol.geom.GeometryType.MULTI_POLYGON) {
    mode = ol.interaction.DrawMode.POLYGON;
  }
  goog.asserts.assert(goog.isDef(mode));
  return mode;
};


/**
 * Draw mode.  This collapses multi-part geometry types with their single-part
 * cousins.
 * @enum {string}
 */
ol.interaction.DrawMode = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon'
};
