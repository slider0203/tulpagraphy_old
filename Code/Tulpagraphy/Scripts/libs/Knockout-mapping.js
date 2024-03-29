﻿// Knockout Mapping plugin v2.2.0
// (c) 2012 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function (d) { "function" === typeof require && "object" === typeof exports && "object" === typeof module ? d(require("knockout"), exports) : "function" === typeof define && define.amd ? define(["knockout", "exports"], d) : d(ko, ko.mapping = {}) })(function (d, e) {
    function u(a, c) { for (var b in c) c.hasOwnProperty(b) && c[b] && (b && a[b] && "array" !== e.getType(a[b]) ? u(a[b], c[b]) : a[b] = c[b]) } function E(a, c) { var b = {}; u(b, a); u(b, c); return b } function F(a, c) {
        a = a || {}; if (a.create instanceof Function || a.update instanceof Function || a.key instanceof
Function || a.arrayChanged instanceof Function) a = { "": a }; c && (a.ignore = i(c.ignore, a.ignore), a.include = i(c.include, a.include), a.copy = i(c.copy, a.copy)); a.ignore = i(a.ignore, g.ignore); a.include = i(a.include, g.include); a.copy = i(a.copy, g.copy); a.mappedProperties = a.mappedProperties || {}; return a
    } function i(a, c) { "array" !== e.getType(a) && (a = "undefined" === e.getType(a) ? [] : [a]); "array" !== e.getType(c) && (c = "undefined" === e.getType(c) ? [] : [c]); return a.concat(c) } function O(a, c) {
        var b = d.dependentObservable; d.dependentObservable =
function (b, c, f) { f = f || {}; b && "object" == typeof b && (f = b); var e = f.deferEvaluation, l = !1, k = function (b) { return G({ read: function () { l || (d.utils.arrayRemoveItem(a, b), l = !0); return b.apply(b, arguments) }, write: function (a) { return b(a) }, deferEvaluation: !0 }) }; f.deferEvaluation = !0; b = new G(b, c, f); e || (b = k(b), a.push(b)); return b }; d.dependentObservable.fn = G.fn; d.computed = d.dependentObservable; var f = c(); d.dependentObservable = b; d.computed = d.dependentObservable; return f
    } function A(a, c, b, f, I, g) {
        var z = "array" === e.getType(d.utils.unwrapObservable(c)),
g = g || ""; if (e.isMapped(a)) var j = d.utils.unwrapObservable(a)[o], b = E(j, b); var l = function () { return b[f] && b[f].create instanceof Function }, k = function (a) { return O(B, function () { return b[f].create({ data: a || c, parent: I }) }) }, v = function () { return b[f] && b[f].update instanceof Function }, r = function (a, e) { var h = { data: e || c, parent: I, target: d.utils.unwrapObservable(a) }; d.isWriteableObservable(a) && (h.observable = a); return b[f].update(h) }; if (j = C.get(c)) return j; f = f || ""; if (z) {
            var z = [], p = !1, h = function (a) { return a }; b[f] && b[f].key &&
(h = b[f].key, p = !0); d.isObservable(a) || (a = d.observableArray([]), a.mappedRemove = function (b) { var c = typeof b == "function" ? b : function (a) { return a === h(b) }; return a.remove(function (a) { return c(h(a)) }) }, a.mappedRemoveAll = function (b) { var c = x(b, h); return a.remove(function (a) { return d.utils.arrayIndexOf(c, h(a)) != -1 }) }, a.mappedDestroy = function (b) { var c = typeof b == "function" ? b : function (a) { return a === h(b) }; return a.destroy(function (a) { return c(h(a)) }) }, a.mappedDestroyAll = function (b) {
    var c = x(b, h); return a.destroy(function (a) {
        return d.utils.arrayIndexOf(c,
h(a)) != -1
    })
}, a.mappedIndexOf = function (b) { var c = x(a(), h), b = h(b); return d.utils.arrayIndexOf(c, b) }, a.mappedCreate = function (b) { if (a.mappedIndexOf(b) !== -1) throw Error("There already is an object with the key that you specified."); var c = l() ? k(b) : b; if (v()) { b = r(c, b); d.isWriteableObservable(c) ? c(b) : c = b } a.push(c); return c }); var j = x(d.utils.unwrapObservable(a), h).sort(), m = x(c, h); p && m.sort(); var p = d.utils.compareArrays(j, m), j = {}, i, w = d.utils.unwrapObservable(c), t = {}, u = !0, m = 0; for (i = w.length; m < i; m++) {
                var n = h(w[m]);
                if (n instanceof Object) { u = !1; break } t[n] = w[m]
            } w = []; m = 0; for (i = p.length; m < i; m++) {
                var n = p[m], q, s = g + "[" + m + "]"; switch (n.status) {
                    case "added": var y = u ? t[n.value] : D(d.utils.unwrapObservable(c), n.value, h); q = A(void 0, y, b, f, a, s); l() || (q = d.utils.unwrapObservable(q)); s = J(d.utils.unwrapObservable(c), y, j); w[s] = q; j[s] = !0; break; case "retained": y = u ? t[n.value] : D(d.utils.unwrapObservable(c), n.value, h); q = D(a, n.value, h); A(q, y, b, f, a, s); s = J(d.utils.unwrapObservable(c), y, j); w[s] = q; j[s] = !0; break; case "deleted": q = D(a, n.value,
h)
                } z.push({ event: n.status, item: q })
            } a(w); b[f] && b[f].arrayChanged && d.utils.arrayForEach(z, function (a) { b[f].arrayChanged(a.event, a.item) })
        } else if (K(c)) {
            a = d.utils.unwrapObservable(a); if (!a) { if (l()) return p = k(), v() && (p = r(p)), p; if (v()) return r(p); a = {} } v() && (a = r(a)); C.save(c, a); L(c, function (f) {
                var e = g.length ? g + "." + f : f; if (-1 == d.utils.arrayIndexOf(b.ignore, e)) if (-1 != d.utils.arrayIndexOf(b.copy, e)) a[f] = c[f]; else {
                    var h = C.get(c[f]) || A(a[f], c[f], b, f, a, e); if (d.isWriteableObservable(a[f])) a[f](d.utils.unwrapObservable(h));
                    else a[f] = h; b.mappedProperties[e] = !0
                } 
            })
        } else switch (e.getType(c)) { case "function": v() ? d.isWriteableObservable(c) ? (c(r(c)), a = c) : a = r(c) : a = c; break; default: d.isWriteableObservable(a) ? v() ? a(r(a)) : a(d.utils.unwrapObservable(c)) : (a = l() ? k() : d.observable(d.utils.unwrapObservable(c)), v() && a(r(a))) } return a
    } function J(a, c, b) { for (var d = 0, e = a.length; d < e; d++) if (!0 !== b[d] && a[d] === c) return d; return null } function M(a, c) { var b; c && (b = c(a)); "undefined" === e.getType(b) && (b = a); return d.utils.unwrapObservable(b) } function D(a,
c, b) { a = d.utils.arrayFirst(d.utils.unwrapObservable(a), function (a) { return M(a, b) === c }); if (null === a) throw Error("When calling ko.update*, the key '" + c + "' was not found!"); return a } function x(a, c) { return d.utils.arrayMap(d.utils.unwrapObservable(a), function (a) { return c ? M(a, c) : a }) } function L(a, c) { if ("array" === e.getType(a)) for (var b = 0; b < a.length; b++) c(b); else for (b in a) c(b) } function K(a) { var c = e.getType(a); return ("object" === c || "array" === c) && null !== a } function N() {
    var a = [], c = []; this.save = function (b, f) {
        var e =
d.utils.arrayIndexOf(a, b); 0 <= e ? c[e] = f : (a.push(b), c.push(f))
    }; this.get = function (b) { b = d.utils.arrayIndexOf(a, b); return 0 <= b ? c[b] : void 0 } 
} var o = "__ko_mapping__", G = d.dependentObservable, H = 0, B, C, t = { include: ["_destroy"], ignore: [], copy: [] }, g = t; e.isMapped = function (a) { return (a = d.utils.unwrapObservable(a)) && a[o] }; e.fromJS = function (a) {
    if (0 == arguments.length) throw Error("When calling ko.fromJS, pass the object you want to convert."); window.setTimeout(function () { H = 0 }, 0); H++ || (B = [], C = new N); var c, b; 2 == arguments.length &&
(arguments[1][o] ? b = arguments[1] : c = arguments[1]); 3 == arguments.length && (c = arguments[1], b = arguments[2]); b && (c = E(c, b[o])); c = F(c); var d = A(b, a, c); b && (d = b); --H || window.setTimeout(function () { for (; B.length; ) { var a = B.pop(); a && a() } }, 0); d[o] = E(d[o], c); return d
}; e.fromJSON = function (a) { var c = d.utils.parseJson(a); arguments[0] = c; return e.fromJS.apply(this, arguments) }; e.updateFromJS = function () {
    throw Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");
}; e.updateFromJSON = function () { throw Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!"); }; e.toJS = function (a, c) {
    g || e.resetDefaultOptions(); if (0 == arguments.length) throw Error("When calling ko.mapping.toJS, pass the object you want to convert."); if ("array" !== e.getType(g.ignore)) throw Error("ko.mapping.defaultOptions().ignore should be an array."); if ("array" !== e.getType(g.include)) throw Error("ko.mapping.defaultOptions().include should be an array.");
    if ("array" !== e.getType(g.copy)) throw Error("ko.mapping.defaultOptions().copy should be an array."); c = F(c, a[o]); return e.visitModel(a, function (a) { return d.utils.unwrapObservable(a) }, c)
}; e.toJSON = function (a, c) { var b = e.toJS(a, c); return d.utils.stringifyJson(b) }; e.defaultOptions = function () { if (0 < arguments.length) g = arguments[0]; else return g }; e.resetDefaultOptions = function () { g = { include: t.include.slice(0), ignore: t.ignore.slice(0), copy: t.copy.slice(0)} }; e.getType = function (a) {
    if (a && "object" === typeof a) {
        if (a.constructor ==
(new Date).constructor) return "date"; if ("[object Array]" === Object.prototype.toString.call(a)) return "array"
    } return typeof a
}; e.visitModel = function (a, c, b) {
    b = b || {}; b.visitedObjects = b.visitedObjects || new N; b.parentName || (b = F(b)); var f, g = d.utils.unwrapObservable(a); if (!K(g)) return c(a, b.parentName); c(a, b.parentName); f = "array" === e.getType(g) ? [] : {}; b.visitedObjects.save(a, f); var i = b.parentName; L(g, function (a) {
        if (!(b.ignore && -1 != d.utils.arrayIndexOf(b.ignore, a))) {
            var j = g[a], l = b, k = i || ""; "array" === e.getType(g) ?
i && (k += "[" + a + "]") : (i && (k += "."), k += a); l.parentName = k; if (!(-1 === d.utils.arrayIndexOf(b.copy, a) && -1 === d.utils.arrayIndexOf(b.include, a) && g[o] && g[o].mappedProperties && !g[o].mappedProperties[a] && "array" !== e.getType(g))) switch (e.getType(d.utils.unwrapObservable(j))) { case "object": case "array": case "undefined": l = b.visitedObjects.get(j); f[a] = "undefined" !== e.getType(l) ? l : e.visitModel(j, c, b); break; default: f[a] = c(j, b.parentName) } 
        } 
    }); return f
} 
});