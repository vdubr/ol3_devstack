goog.provide('ol.style.Stroke');

goog.require('ol.color');



/**
 * @constructor
 * @param {olx.style.StrokeOptions=} opt_options Options.
 */
ol.style.Stroke = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @private
   * @type {ol.Color|string}
   */
  this.color_ = goog.isDef(options.color) ? options.color : null;

  /**
   * @private
   * @type {string|undefined}
   */
  this.lineCap_ = options.lineCap;

  /**
   * @private
   * @type {Array.<number>}
   */
  this.lineDash_ = goog.isDef(options.lineDash) ? options.lineDash : null;

  /**
   * @private
   * @type {string|undefined}
   */
  this.lineJoin_ = options.lineJoin;

  /**
   * @private
   * @type {number|undefined}
   */
  this.miterLimit_ = options.miterLimit;

  /**
   * @private
   * @type {number|undefined}
   */
  this.width_ = options.width;
};


/**
 * @return {ol.Color|string} Color.
 */
ol.style.Stroke.prototype.getColor = function() {
  return this.color_;
};


/**
 * @return {string|undefined} Line cap.
 */
ol.style.Stroke.prototype.getLineCap = function() {
  return this.lineCap_;
};


/**
 * @return {Array.<number>} Line dash.
 */
ol.style.Stroke.prototype.getLineDash = function() {
  return this.lineDash_;
};


/**
 * @return {string|undefined} Line join.
 */
ol.style.Stroke.prototype.getLineJoin = function() {
  return this.lineJoin_;
};


/**
 * @return {number|undefined} Miter limit.
 */
ol.style.Stroke.prototype.getMiterLimit = function() {
  return this.miterLimit_;
};


/**
 * @return {number|undefined} Width.
 */
ol.style.Stroke.prototype.getWidth = function() {
  return this.width_;
};
