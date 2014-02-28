goog.provide('Proj4js.Proj.krovak');

/**
   NOTES: According to EPSG the full Krovak projection method should have
          the following parameters.  Within PROJ.4 the azimuth, and pseudo
          standard parallel are hardcoded in the algorithm and can't be
          altered from outside.  The others all have defaults to match the
          common usage with Krovak projection.

  lat_0 = latitude of centre of the projection

  lon_0 = longitude of centre of the projection

  ** = azimuth (true) of the centre line passing through the centre of the projection

  ** = latitude of pseudo standard parallel

  k  = scale factor on the pseudo standard parallel

  x_0 = False Easting of the centre of the projection at the apex of the cone

  y_0 = False Northing of the centre of the projection at the apex of the cone

 **/

/**
 * @param {Proj4js.Proj} proj
 * @implements {Proj4js.Proj.transform}
 * @constructor
 */
Proj4js.Proj.krovak = function(proj) {

		/**
		 * @type {boolean}
		 */
		this.czech = true;

		/* we want Bessel as fixed ellipsoid */

		/**
		 * @type {number}
		 */
		this.a = proj.a || 6377397.155;

		/**
		 * @type {number}
		 */
		this.es = proj.es || 0.006674372230614;

		/**
		 * @type {number}
		 */
		this.e = (Math.sqrt(this.es));

		/**
		 * @type {number}
		 * if latitude of projection center is not set, use 49d30'N
		 */
		this.lat0 = proj.lat0 || 0.863937979737193;

		/**
		 * @type {number}
		 */
		this.long0 = proj.long0 || (0.7417649320975901 - 0.308341501185665);
		//this.long0 -= proj.from_greenwich;

		/**
		 * if scale not set default to 0.9999
		 * @type {number}
		 */
		this.k0 = proj.k0 || 0.9999;

		/**
		 * @type {number}
		 * 45�
		 */
		this.s45 = 0.785398163397448;

		/**
		 * @type {number}
		 */
		this.s90 = 2 * this.s45;

		/**
		 * @type {number}
		 * Latitude of projection centre 49� 30'
		 * Ellipsoid Bessel 1841 a = 6377397.155m 1/f = 299.1528128,
		 * e2=0.006674372230614;
		 */
		this.fi0 = this.lat0;

		/**
		 * @type {number}
		 * 0.006674372230614;
		 */
		this.e2 = this.es;

		/**
		 * @type {number}
		 */
		this.alfa = (Math.sqrt(1. +
			(this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1. - this.e2)));

		/**
		 * @type {number}
		 * DU(2, 59, 42, 42.69689)
		 */
		this.uq = 1.04216856380474;

		/**
		 * @type {number}
		 */
		this.u0 = (Math.asin(Math.sin(this.fi0) / this.alfa));

		/**
		 * @type {number}
		 */
		this.g = (Math.pow( (1. + this.e * Math.sin(this.fi0)) /
			(1. - this.e * Math.sin(this.fi0)) , this.alfa * this.e / 2. ));

		/**
		 * @type {number}
		 */
		this.k = (Math.tan( this.u0 / 2. + this.s45) / Math.pow
			(Math.tan(this.fi0 / 2. + this.s45) , this.alfa) * this.g);

		/**
		 * @type {number}
		 */
		this.k1 = this.k0;

		/**
		 * @type {number}
		 */
		this.n0 = (this.a * Math.sqrt(1. - this.e2) /
			(1. - this.e2 * Math.pow(Math.sin(this.fi0), 2)));

		/**
		 * @type {number}
		 * Latitude of pseudo standard parallel 78� 30'00" N
		 */
		this.s0 = 1.37008346281555;

		/**
		 * @type {number}
		 */
		this.n = (Math.sin(this.s0));

		/**
		 * @type {number}
		 */
		this.ro0 = (this.k1 * this.n0 / Math.tan(this.s0));

		/**
		 * @type {number}
		 */
		this.ad = (this.s90 - this.uq);
};

/**
  * ellipsoid
  * calculate xy from lat/lon
  * Constants, identical to inverse transform function
  * @param {!Proj4js.Point|{x: !number,y: !number,z: ?number}} p the lat long input value
  * @return {Proj4js.Point|{x: !number,y: !number,z: ?number}} the point x,y transformed.
  */
Proj4js.Proj.krovak.prototype.forward = function(p) {
		var gfi, u, deltav, s, d, eps, ro;
		var lon = p.x;
		var lat = p.y;

		// Delta longitude
		var delta_lon = Proj4js.common.adjust_lon(lon - this.long0);

		/* Transformation */
		gfi = Math.pow ( ((1. + this.e * Math.sin(lat)) /
			(1. - this.e * Math.sin(lat))) , (this.alfa * this.e / 2.));
		u= 2. * (Math.atan(this.k *
			Math.pow( Math.tan(lat / 2. + this.s45), this.alfa) / gfi)
			- this.s45);

		deltav = - delta_lon * this.alfa;
		s = Math.asin(Math.cos(this.ad) * Math.sin(u) +
			Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));

		d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
		eps = this.n * d;
		ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2. + this.s45) , this.n) /
			Math.pow(Math.tan(s / 2. + this.s45) , this.n);

		/* x and y are reverted! */
		//p.y = ro * Math.cos(eps) / a;
		//p.x = ro * Math.sin(eps) / a;
		p.y = ro * Math.cos(eps) / 1.0;
		p.x = ro * Math.sin(eps) / 1.0;

		if(this.czech) {
			p.y *= -1.0;
			p.x *= -1.0;
		}
		return (p);
};

/**
 * calculate lat/lon from xy
 * @param {!Proj4js.Point|{x: !number,y: !number,z: ?number}} p the x,y input value
 * @return {Proj4js.Point|{x: !number,y: !number,z: ?number}} the lat long point transformed.
 */
Proj4js.Proj.krovak.prototype.inverse = function(p) {
		/* Constants, identisch wie in der Umkehrfunktion */
		var u, deltav, s, d, eps, ro, fi1;
		var ok;

		/* Transformation */
		/* revert y, x*/
		var tmp = p.x;
		p.x=p.y;
		p.y=tmp;
		if(this.czech) {
			p.y *= -1.0;
			p.x *= -1.0;
		}
		ro = Math.sqrt(p.x * p.x + p.y * p.y);
		eps = Math.atan2(p.y, p.x);
		d = eps / Math.sin(this.s0);
		s = 2. * (Math.atan(  Math.pow(this.ro0 / ro, 1. / this.n) *
			Math.tan(this.s0 / 2. + this.s45)) - this.s45);

		u = Math.asin(Math.cos(this.ad) * Math.sin(s)
			- Math.sin(this.ad) * Math.cos(s) * Math.cos(d));

		deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
		p.x = this.long0 - deltav / this.alfa;

		/* ITERATION FOR lat */
		fi1 = u;
		ok = 0;
		var iter = 0;
		do {
			p.y = 2. * ( Math.atan( Math.pow( this.k, -1. / this.alfa)  *
				Math.pow( Math.tan(u / 2. + this.s45) , 1. / this.alfa)  *
				Math.pow( (1. + this.e * Math.sin(fi1)) / (1. - this.e *
				Math.sin(fi1)) , this.e / 2.) )  - this.s45);
			if (Math.abs(fi1 - p.y) < 0.0000000001) ok=1;
			fi1 = p.y;
			iter += 1;
		} while (ok==0 && iter < 15);
		if (iter >= 15) {
			var e="PHI3Z-CONV:Latitude failed to converge after 15 iterations";
			Proj4js.reportError(e);
			//console.log('iter:', iter);
			return null;
		}

		return (p);

};

goog.exportSymbol('Proj4js.Proj.krovak', Proj4js.Proj.krovak);
goog.exportSymbol('Proj4js.Proj.krovak.forward',
	Proj4js.Proj.krovak.prototype.forward);
goog.exportSymbol('Proj4js.Proj.krovak.inverse',
	Proj4js.Proj.krovak.prototype.inverse);
