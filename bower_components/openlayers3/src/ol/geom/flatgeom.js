goog.provide('ol.geom.flat');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.math');
goog.require('goog.vec.Mat4');
goog.require('ol.extent');


/**
 * Returns the point on the 2D line segment flatCoordinates[offset1] to
 * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
 * dimensions are linearly interpolated.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset1 Offset 1.
 * @param {number} offset2 Offset 2.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 */
ol.geom.flat.closestPoint =
    function(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
  var x1 = flatCoordinates[offset1];
  var y1 = flatCoordinates[offset1 + 1];
  var dx = flatCoordinates[offset2] - x1;
  var dy = flatCoordinates[offset2 + 1] - y1;
  var i, offset;
  if (dx === 0 && dy === 0) {
    offset = offset1;
  } else {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      offset = offset2;
    } else if (t > 0) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = goog.math.lerp(flatCoordinates[offset1 + i],
            flatCoordinates[offset2 + i], t);
      }
      closestPoint.length = stride;
      return;
    } else {
      offset = offset1;
    }
  }
  for (i = 0; i < stride; ++i) {
    closestPoint[i] = flatCoordinates[offset + i];
  }
  closestPoint.length = stride;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflateCoordinate =
    function(flatCoordinates, offset, coordinate, stride) {
  goog.asserts.assert(coordinate.length == stride);
  var i, ii;
  for (i = 0, ii = coordinate.length; i < ii; ++i) {
    flatCoordinates[offset++] = coordinate[i];
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflateCoordinates =
    function(flatCoordinates, offset, coordinates, stride) {
  var i, ii;
  for (i = 0, ii = coordinates.length; i < ii; ++i) {
    var coordinate = coordinates[i];
    goog.asserts.assert(coordinate.length == stride);
    var j;
    for (j = 0; j < stride; ++j) {
      flatCoordinates[offset++] = coordinate[j];
    }
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<ol.Coordinate>>} coordinatess Coordinatess.
 * @param {number} stride Stride.
 * @param {Array.<number>=} opt_ends Ends.
 * @return {Array.<number>} Ends.
 */
ol.geom.flat.deflateCoordinatess =
    function(flatCoordinates, offset, coordinatess, stride, opt_ends) {
  var ends = goog.isDef(opt_ends) ? opt_ends : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatess.length; j < jj; ++j) {
    var end = ol.geom.flat.deflateCoordinates(
        flatCoordinates, offset, coordinatess[j], stride);
    ends[i++] = end;
    offset = end;
  }
  ends.length = i;
  return ends;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>} coordinatesss Coordinatesss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<number>>=} opt_endss Endss.
 * @return {Array.<Array.<number>>} Endss.
 */
ol.geom.flat.deflateCoordinatesss =
    function(flatCoordinates, offset, coordinatesss, stride, opt_endss) {
  var endss = goog.isDef(opt_endss) ? opt_endss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatesss.length; j < jj; ++j) {
    var ends = ol.geom.flat.deflateCoordinatess(
        flatCoordinates, offset, coordinatesss[j], stride, endss[i]);
    endss[i++] = ends;
    offset = ends[ends.length - 1];
  }
  endss.length = i;
  return endss;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {Array.<number>=} opt_dest Destination.
 * @param {number=} opt_destOffset Destination offset.
 * @return {Array.<number>} Flat coordinates.
 */
ol.geom.flat.flipXY =
    function(flatCoordinates, offset, end, stride, opt_dest, opt_destOffset) {
  var dest, destOffset;
  if (goog.isDef(opt_dest)) {
    dest = opt_dest;
    destOffset = goog.isDef(opt_destOffset) ? opt_destOffset : 0;
  } else {
    goog.asserts.assert(!goog.isDef(opt_destOffset));
    dest = [];
    destOffset = 0;
  }
  var j, k;
  for (j = offset; j < end; ) {
    var x = flatCoordinates[j++];
    dest[destOffset++] = flatCoordinates[j++];
    dest[destOffset++] = x;
    for (k = 2; k < stride; ++k) {
      dest[destOffset++] = flatCoordinates[j++];
    }
  }
  dest.length = destOffset;
  return dest;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {Array.<ol.Coordinate>=} opt_coordinates Coordinates.
 * @return {Array.<ol.Coordinate>} Coordinates.
 */
ol.geom.flat.inflateCoordinates =
    function(flatCoordinates, offset, end, stride, opt_coordinates) {
  var coordinates = goog.isDef(opt_coordinates) ? opt_coordinates : [];
  var i = 0;
  var j;
  for (j = offset; j < end; j += stride) {
    coordinates[i++] = flatCoordinates.slice(j, j + stride);
  }
  coordinates.length = i;
  return coordinates;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<Array.<ol.Coordinate>>=} opt_coordinatess Coordinatess.
 * @return {Array.<Array.<ol.Coordinate>>} Coordinatess.
 */
ol.geom.flat.inflateCoordinatess =
    function(flatCoordinates, offset, ends, stride, opt_coordinatess) {
  var coordinatess = goog.isDef(opt_coordinatess) ? opt_coordinatess : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = ends.length; j < jj; ++j) {
    var end = ends[j];
    coordinatess[i++] = ol.geom.flat.inflateCoordinates(
        flatCoordinates, offset, end, stride, coordinatess[i]);
    offset = end;
  }
  coordinatess.length = i;
  return coordinatess;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>=} opt_coordinatesss
 *     Coordinatesss.
 * @return {Array.<Array.<Array.<ol.Coordinate>>>} Coordinatesss.
 */
ol.geom.flat.inflateCoordinatesss =
    function(flatCoordinates, offset, endss, stride, opt_coordinatesss) {
  var coordinatesss = goog.isDef(opt_coordinatesss) ? opt_coordinatesss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = endss.length; j < jj; ++j) {
    var ends = endss[j];
    coordinatesss[i++] = ol.geom.flat.inflateCoordinatess(
        flatCoordinates, offset, ends, stride, coordinatesss[i]);
    offset = ends[ends.length - 1];
  }
  coordinatesss.length = i;
  return coordinatesss;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} fraction Fraction.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Destination.
 */
ol.geom.flat.lineStringInterpolate =
    function(flatCoordinates, offset, end, stride, fraction, opt_dest) {
  // FIXME interpolate extra dimensions
  goog.asserts.assert(0 <= fraction && fraction <= 1);
  var pointX = NaN;
  var pointY = NaN;
  var n = (end - offset) / stride;
  if (n === 0) {
    goog.asserts.fail();
  } else if (n == 1) {
    pointX = flatCoordinates[offset];
    pointY = flatCoordinates[offset + 1];
  } else if (n == 2) {
    pointX = (1 - fraction) * flatCoordinates[offset] +
        fraction * flatCoordinates[offset + stride];
    pointY = (1 - fraction) * flatCoordinates[offset + 1] +
        fraction * flatCoordinates[offset + stride + 1];
  } else {
    var x1 = flatCoordinates[offset];
    var y1 = flatCoordinates[offset + 1];
    var length = 0;
    var cumulativeLengths = [0];
    var i;
    for (i = offset + stride; i < end; i += stride) {
      var x2 = flatCoordinates[i];
      var y2 = flatCoordinates[i + 1];
      length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      cumulativeLengths.push(length);
      x1 = x2;
      y1 = y2;
    }
    var target = fraction * length;
    var index = goog.array.binarySearch(cumulativeLengths, target);
    if (index < 0) {
      var t = (target - cumulativeLengths[-index - 2]) /
          (cumulativeLengths[-index - 1] - cumulativeLengths[-index - 2]);
      var o = offset + (-index - 2) * stride;
      pointX = (1 - t) * flatCoordinates[o] + t * flatCoordinates[o + stride];
      pointY = (1 - t) * flatCoordinates[o + 1] +
          t * flatCoordinates[o + stride + 1];
    } else {
      pointX = flatCoordinates[offset + index * stride];
      pointY = flatCoordinates[offset + index * stride + 1];
    }
  }
  if (goog.isDefAndNotNull(opt_dest)) {
    opt_dest.push(pointX, pointY);
    return opt_dest;
  } else {
    return [pointX, pointY];
  }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Length.
 */
ol.geom.flat.lineStringLength = function(flatCoordinates, offset, end, stride) {
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  var length = 0;
  var i;
  for (i = offset + stride; i < end; i += stride) {
    var x2 = flatCoordinates[i];
    var y2 = flatCoordinates[i + 1];
    length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    x1 = x2;
    y1 = y2;
  }
  return length;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.linearRingArea = function(flatCoordinates, offset, end, stride) {
  var twiceArea = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    twiceArea += y1 * x2 - x1 * y2;
    x1 = x2;
    y1 = y2;
  }
  return twiceArea / 2;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.linearRingContainsXY =
    function(flatCoordinates, offset, end, stride, x, y) {
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var contains = false;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var intersect = ((y1 > y) != (y2 > y)) &&
        (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1);
    if (intersect) {
      contains = !contains;
    }
    x1 = x2;
    y1 = y2;
  }
  return contains;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {boolean} Is clockwise.
 */
ol.geom.flat.linearRingIsClockwise =
    function(flatCoordinates, offset, end, stride) {
  // http://tinyurl.com/clockwise-method
  // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
  var edge = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    edge += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  return edge > 0;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Perimeter.
 */
ol.geom.flat.linearRingPerimeter =
    function(flatCoordinates, offset, end, stride) {
  var perimeter =
      ol.geom.flat.lineStringLength(flatCoordinates, offset, end, stride);
  var dx = flatCoordinates[end - stride] - flatCoordinates[offset];
  var dy = flatCoordinates[end - stride + 1] - flatCoordinates[offset + 1];
  perimeter += Math.sqrt(dx * dx + dy * dy);
  return perimeter;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.linearRingsArea = function(flatCoordinates, offset, ends, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    area += ol.geom.flat.linearRingArea(flatCoordinates, offset, end, stride);
    offset = end;
  }
  return area;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.linearRingsContainsXY =
    function(flatCoordinates, offset, ends, stride, x, y) {
  goog.asserts.assert(ends.length > 0);
  if (ends.length === 0) {
    return false;
  }
  if (!ol.geom.flat.linearRingContainsXY(
      flatCoordinates, offset, ends[0], stride, x, y)) {
    return false;
  }
  var i, ii;
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.linearRingContainsXY(
        flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false;
    }
  }
  return true;
};


/**
 * Calculates a point that is likely to lie in the interior of the linear rings.
 * Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @param {number} flatCentersOffset Flat center offset.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Destination.
 */
ol.geom.flat.linearRingsGetInteriorPoint = function(flatCoordinates, offset,
    ends, stride, flatCenters, flatCentersOffset, opt_dest) {
  var i, ii, x, x1, x2, y1, y2;
  var y = flatCenters[flatCentersOffset + 1];
  /** @type {Array.<number>} */
  var intersections = [];
  // Calculate intersections with the horizontal line
  var end = ends[0];
  x1 = flatCoordinates[end - stride];
  y1 = flatCoordinates[end - stride + 1];
  for (i = offset; i < end; i += stride) {
    x2 = flatCoordinates[i];
    y2 = flatCoordinates[i + 1];
    if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
      x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
      intersections.push(x);
    }
    x1 = x2;
    y1 = y2;
  }
  // Find the longest segment of the horizontal line that has its center point
  // inside the linear ring.
  var pointX = NaN;
  var maxSegmentLength = -Infinity;
  intersections.sort();
  x1 = intersections[0];
  for (i = 1, ii = intersections.length; i < ii; ++i) {
    x2 = intersections[i];
    var segmentLength = Math.abs(x2 - x1);
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2;
      if (ol.geom.flat.linearRingsContainsXY(
          flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x;
        maxSegmentLength = segmentLength;
      }
    }
    x1 = x2;
  }
  if (isNaN(pointX)) {
    // There is no horizontal line that has its center point inside the linear
    // ring.  Use the center of the the linear ring's extent.
    pointX = flatCenters[flatCentersOffset];
  }
  if (goog.isDef(opt_dest)) {
    opt_dest.push(pointX, y);
    return opt_dest;
  } else {
    return [pointX, y];
  }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {boolean} `true` if all rings are correctly oriented, `false`
 *     otherwise.
 */
ol.geom.flat.linearRingsAreOriented =
    function(flatCoordinates, offset, ends, stride) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    if (i === 0 ? !isClockwise : isClockwise) {
      return false;
    }
    offset = end;
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {boolean} `true` if all rings are correctly oriented, `false`
 *     otherwise.
 */
ol.geom.flat.linearRingssAreOriented =
    function(flatCoordinates, offset, endss, stride) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    if (!ol.geom.flat.linearRingsAreOriented(
        flatCoordinates, offset, endss[i], stride)) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.linearRingssArea =
    function(flatCoordinates, offset, endss, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    area += ol.geom.flat.linearRingsArea(flatCoordinates, offset, ends, stride);
    offset = ends[ends.length - 1];
  }
  return area;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.linearRingssContainsXY =
    function(flatCoordinates, offset, endss, stride, x, y) {
  goog.asserts.assert(endss.length > 0);
  if (endss.length === 0) {
    return false;
  }
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (ol.geom.flat.linearRingsContainsXY(
        flatCoordinates, offset, ends, stride, x, y)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @return {Array.<number>} Interior points.
 */
ol.geom.flat.linearRingssGetInteriorPoints =
    function(flatCoordinates, offset, endss, stride, flatCenters) {
  goog.asserts.assert(2 * endss.length == flatCenters.length);
  var interiorPoints = [];
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    interiorPoints = ol.geom.flat.linearRingsGetInteriorPoint(flatCoordinates,
        offset, ends, stride, flatCenters, 2 * i, interiorPoints);
    offset = ends[ends.length - 1];
  }
  return interiorPoints;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {Array.<number>} Flat centers.
 */
ol.geom.flat.linearRingssGetFlatCenters =
    function(flatCoordinates, offset, endss, stride) {
  var flatCenters = [];
  var i, ii;
  var extent = ol.extent.createEmpty();
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    extent = ol.extent.createOrUpdateFromFlatCoordinates(
        flatCoordinates, offset, ends[0], stride);
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {number} End.
 */
ol.geom.flat.orientLinearRings =
    function(flatCoordinates, offset, ends, stride) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    var reverse = i === 0 ? !isClockwise : isClockwise;
    if (reverse) {
      ol.geom.flat.reverseCoordinates(flatCoordinates, offset, end, stride);
    }
    offset = end;
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {number} End.
 */
ol.geom.flat.orientLinearRingss =
    function(flatCoordinates, offset, endss, stride) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    offset = ol.geom.flat.orientLinearRings(
        flatCoordinates, offset, endss[i], stride);
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 */
ol.geom.flat.reverseCoordinates =
    function(flatCoordinates, offset, end, stride) {
  while (offset < end - stride) {
    var i;
    for (i = 0; i < stride; ++i) {
      var tmp = flatCoordinates[offset + i];
      flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
      flatCoordinates[end - stride + i] = tmp;
    }
    offset += stride;
    end -= stride;
  }
};


/**
 * Returns the square of the closest distance between the point (x, y) and the
 * line segment (x1, y1) to (x2, y2).
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.geom.flat.squaredSegmentDistance = function(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  return ol.geom.flat.squaredDistance(x, y, x1, y1);
};


/**
 * Returns the square of the distance between the points (x1, y1) and (x2, y2).
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.geom.flat.squaredDistance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} stride Stride.
 * @param {goog.vec.Mat4.Number} transform Transform.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform2D =
    function(flatCoordinates, stride, transform, opt_dest) {
  var m00 = goog.vec.Mat4.getElement(transform, 0, 0);
  var m10 = goog.vec.Mat4.getElement(transform, 1, 0);
  var m01 = goog.vec.Mat4.getElement(transform, 0, 1);
  var m11 = goog.vec.Mat4.getElement(transform, 1, 1);
  var m03 = goog.vec.Mat4.getElement(transform, 0, 3);
  var m13 = goog.vec.Mat4.getElement(transform, 1, 3);
  var dest = goog.isDef(opt_dest) ? opt_dest : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = flatCoordinates.length; j < jj; j += stride) {
    var x = flatCoordinates[j];
    var y = flatCoordinates[j + 1];
    dest[i++] = m00 * x + m01 * y + m03;
    dest[i++] = m10 * x + m11 * y + m13;
  }
  if (goog.isDef(opt_dest) && dest.length != i) {
    dest.length = i;
  }
  return dest;
};
