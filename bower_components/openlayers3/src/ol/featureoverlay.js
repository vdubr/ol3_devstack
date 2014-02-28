goog.provide('ol.FeatureOverlay');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('ol.Collection');
goog.require('ol.CollectionEventType');
goog.require('ol.Feature');
goog.require('ol.feature');
goog.require('ol.render.EventType');



/**
 * @constructor
 * @param {olx.FeatureOverlayOptions=} opt_options Options.
 * @todo stability experimental
 */
ol.FeatureOverlay = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @private
   * @type {ol.Collection}
   */
  this.features_ = null;

  /**
   * @private
   * @type {Array.<goog.events.Key>}
   */
  this.featuresListenerKeys_ = null;

  /**
   * @private
   * @type {Object.<string, goog.events.Key>}
   */
  this.featureChangeListenerKeys_ = null;

  /**
   * @private
   * @type {ol.Map}
   */
  this.map_ = null;

  /**
   * @private
   * @type {goog.events.Key}
   */
  this.postComposeListenerKey_ = null;

  /**
   * @private
   * @type {ol.feature.StyleFunction|undefined}
   */
  this.styleFunction_ = undefined;

  if (goog.isDef(options.features)) {
    if (goog.isArray(options.features)) {
      this.setFeatures(new ol.Collection(goog.array.clone(options.features)));
    } else {
      goog.asserts.assertInstanceof(options.features, ol.Collection);
      this.setFeatures(options.features);
    }
  } else {
    this.setFeatures(new ol.Collection());
  }

  if (goog.isDef(options.styleFunction)) {
    this.setStyleFunction(options.styleFunction);
  }

  if (goog.isDef(options.map)) {
    this.setMap(options.map);
  }

};


/**
 * @param {ol.Feature} feature Feature.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.addFeature = function(feature) {
  this.features_.push(feature);
};


/**
 * @return {ol.Collection} Features collection.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.getFeatures = function() {
  return this.features_;
};


/**
 * @private
 */
ol.FeatureOverlay.prototype.handleFeatureChange_ = function() {
  this.requestRenderFrame_();
};


/**
 * @private
 * @param {ol.CollectionEvent} collectionEvent Collection event.
 */
ol.FeatureOverlay.prototype.handleFeaturesAdd_ =
    function(collectionEvent) {
  goog.asserts.assert(!goog.isNull(this.featureChangeListenerKeys_));
  var feature = /** @type {ol.Feature} */ (collectionEvent.element);
  this.featureChangeListenerKeys_[goog.getUid(feature).toString()] =
      goog.events.listen(feature, goog.events.EventType.CHANGE,
      this.handleFeatureChange_, false, this);
  this.requestRenderFrame_();
};


/**
 * @private
 * @param {ol.CollectionEvent} collectionEvent Collection event.
 */
ol.FeatureOverlay.prototype.handleFeaturesRemove_ =
    function(collectionEvent) {
  goog.asserts.assert(!goog.isNull(this.featureChangeListenerKeys_));
  var feature = /** @type {ol.Feature} */ (collectionEvent.element);
  var key = goog.getUid(feature).toString();
  goog.events.unlistenByKey(this.featureChangeListenerKeys_[key]);
  delete this.featureChangeListenerKeys_[key];
  this.requestRenderFrame_();
};


/**
 * @param {ol.render.Event} event Event.
 * @private
 */
ol.FeatureOverlay.prototype.handleMapPostCompose_ = function(event) {
  if (goog.isNull(this.features_) || !goog.isDef(this.styleFunction_)) {
    return;
  }
  var resolution = event.frameState.view2DState.resolution;
  var vectorContext = event.vectorContext;
  var i, ii, feature, styles;
  this.features_.forEach(function(feature) {
    styles = this.styleFunction_(feature, resolution);
    ii = styles.length;
    for (i = 0; i < ii; ++i) {
      vectorContext.drawFeature(feature, styles[i]);
    }
  }, this);
};


/**
 * @param {ol.Feature} feature Feature.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.removeFeature = function(feature) {
  this.features_.remove(feature);
};


/**
 * @private
 */
ol.FeatureOverlay.prototype.requestRenderFrame_ = function() {
  if (!goog.isNull(this.map_)) {
    this.map_.requestRenderFrame();
  }
};


/**
 * @param {ol.Collection} features Features collection.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.setFeatures = function(features) {
  if (!goog.isNull(this.featuresListenerKeys_)) {
    goog.array.forEach(this.featuresListenerKeys_, goog.events.unlistenByKey);
    this.featuresListenerKeys_ = null;
  }
  if (!goog.isNull(this.featureChangeListenerKeys_)) {
    goog.array.forEach(
        goog.object.getValues(this.featureChangeListenerKeys_),
        goog.events.unlistenByKey);
    this.featureChangeListenerKeys_ = null;
  }
  this.features_ = features;
  if (!goog.isNull(features)) {
    this.featuresListenerKeys_ = [
      goog.events.listen(features, ol.CollectionEventType.ADD,
          this.handleFeaturesAdd_, false, this),
      goog.events.listen(features, ol.CollectionEventType.REMOVE,
          this.handleFeaturesRemove_, false, this)
    ];
    this.featureChangeListenerKeys_ = {};
    var featuresArray = features.getArray();
    var i, ii = featuresArray.length;
    var feature;
    for (i = 0; i < ii; ++i) {
      feature = featuresArray[i];
      this.featureChangeListenerKeys_[goog.getUid(feature).toString()] =
          goog.events.listen(feature, goog.events.EventType.CHANGE,
          this.handleFeatureChange_, false, this);
    }
  }
  this.requestRenderFrame_();
};


/**
 * @param {ol.Map} map Map.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.setMap = function(map) {
  if (!goog.isNull(this.postComposeListenerKey_)) {
    goog.events.unlistenByKey(this.postComposeListenerKey_);
    this.postComposeListenerKey_ = null;
  }
  this.requestRenderFrame_();
  this.map_ = map;
  if (!goog.isNull(map)) {
    this.postComposeListenerKey_ = goog.events.listen(
        map, ol.render.EventType.POSTCOMPOSE, this.handleMapPostCompose_, false,
        this);
    map.requestRenderFrame();
  }
};


/**
 * @param {ol.feature.StyleFunction} styleFunction Style function.
 * @todo stability experimental
 */
ol.FeatureOverlay.prototype.setStyleFunction = function(styleFunction) {
  this.styleFunction_ = styleFunction;
  this.requestRenderFrame_();
};
