﻿/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */
(function (a) {
	"use strict";
	var b = a.Uint8Array,
		c = a.HTMLCanvasElement,
		d = /\s*;\s*base64\s*(?:;|$)/i,
		f,
		e = function (n) {
			var o = n.length, k = new b(o / 4 * 3 | 0), m = 0, q = 0, r = [0, 0], g = 0, p = 0, l, h, j;
			while (o--) {
				h = n.charCodeAt(m++); l = f[h - 43]; if (l !== 255 && l !== j) {
					r[1] = r[0]; r[0] = h; p = (p << 6) | l; g++; if (g === 4) {
						k[q++] = p >>> 16; if (r[1] !== 61)
						{ k[q++] = p >>> 8 } if (r[0] !== 61) { k[q++] = p } g = 0
					}
				}
			}
			return k.buffer
		};

	if (b) {
		f = new b([62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51])
	}
	if (c && !c.prototype.toBlob) {
		c.prototype.toBlob = function (p, m) {
			if (!m) {
				m = "image/png"
			}

			var l = Array.prototype.slice.call(arguments, 1),
				h = this.toDataURL.apply(this, l),
				n = h.indexOf(","),
				i = h.substring(n + 1),
				o = d.test(h.substring(0, n)),
				j = a.BlobBuilder || a.WebKitBlobBuilder || a.MozBlobBuilder,
				 k = new j,
				 g;

			if (j.fake) {
				g = k.getBlob(m);

				if (o) {
					g.encoding = "base64"
				} else {
					g.encoding = "URI"
				} g.data = i; g.size = i.length
			} else {
				if (b) {
					if (o) { k.append(e(i)) } else {
						k.append(decodeURIComponent(i))
					} g = k.getBlob(m)
				}
			} p(g)
		}
	}
})
(self);