/* Rabbit Ear 0.9.32 alpha 2022-07-29 (c) Kraft, MIT License */
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).ear = t()
}(this, (function() {
        "use strict";
        const e = "undefined"
            , t = "number"
            , r = "object"
            , o = "index"
            , n = "vertices"
            , s = "edges"
            , c = "faces"
            , i = "boundaries"
            , a = "vertices_coords"
            , l = "edges_vertices"
            , d = "faces_edges"
            , u = "edges_assignment"
            , p = "edges_foldAngle"
            , g = "boundary"
            , m = "front"
            , h = "back"
            , v = "foldedForm"
            , _ = "black"
            , y = "white"
            , b = "none"
            , E = typeof window !== e && typeof window.document !== e;
        typeof process !== e && null != process.versions && process.versions.node;
        const x = typeof self === r && self.constructor && "DedicatedWorkerGlobalScope" === self.constructor.name
            , O = [];
        O[10] = '"error 010: window" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )';
        const k = {
            window: void 0
        };
        E && (k.window = window);
        const RabbitEarWindow = () => {
                if (void 0 === k.window)
                    throw O[10];
                return k.window
            }
        ;
        var A = Object.create(null);
        const typeOf = function(e) {
            switch (e.constructor.name) {
                case "vector":
                case "matrix":
                case "segment":
                case "ray":
                case "line":
                case "circle":
                case "ellipse":
                case "rect":
                case "polygon":
                    return e.constructor.name
            }
            if ("object" == typeof e) {
                if (null != e.radius)
                    return "circle";
                if (null != e.width)
                    return "rect";
                if (null != e.x || "number" == typeof e[0])
                    return "vector";
                if (null != e[0] && e[0].length && ("number" == typeof e[0].x || "number" == typeof e[0][0]))
                    return "segment";
                if (null != e.vector && null != e.origin)
                    return "line"
            }
        }
            , resize = (e, t) => t.length === e ? t : Array(e).fill(0).map(( (e, r) => t[r] ? t[r] : e))
            , resizeUp = (e, t) => {
            const r = e.length > t.length ? e.length : t.length;
            return [e, t].map((e => resize(r, e)))
        }
            , countPlaces = function(e) {
            const t = `${e}`.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0
        }
            , cleanNumber = function(e, t=15) {
            if ("number" != typeof e)
                return e;
            const r = parseFloat(e.toFixed(t));
            return countPlaces(r) === Math.min(t, countPlaces(e)) ? e : r
        }
            , isIterable = e => null != e && "function" == typeof e[Symbol.iterator]
            , semiFlattenArrays = function() {
            switch (arguments.length) {
                case void 0:
                case 0:
                    return Array.from(arguments);
                case 1:
                    return isIterable(arguments[0]) && "string" != typeof arguments[0] ? semiFlattenArrays(...arguments[0]) : [arguments[0]];
                default:
                    return Array.from(arguments).map((e => isIterable(e) ? [...semiFlattenArrays(e)] : e))
            }
        }
            , flattenArrays = function() {
            switch (arguments.length) {
                case void 0:
                case 0:
                    return Array.from(arguments);
                case 1:
                    return isIterable(arguments[0]) && "string" != typeof arguments[0] ? flattenArrays(...arguments[0]) : [arguments[0]];
                default:
                    return Array.from(arguments).map((e => isIterable(e) ? [...flattenArrays(e)] : e)).reduce(( (e, t) => e.concat(t)), [])
            }
        };
        var M = Object.freeze({
            __proto__: null,
            resize: resize,
            resizeUp: resizeUp,
            resizeDown: (e, t) => {
                const r = e.length > t.length ? t.length : e.length;
                return [e, t].map((e => resize(r, e)))
            }
            ,
            cleanNumber: cleanNumber,
            semiFlattenArrays: semiFlattenArrays,
            flattenArrays: flattenArrays
        })
            , j = Object.create(null);
        const P = 1e-6
            , w = 180 / Math.PI
            , S = Math.PI / 180
            , L = 2 * Math.PI;
        var C = Object.freeze({
            __proto__: null,
            EPSILON: P,
            R2D: w,
            D2R: S,
            TWO_PI: L
        });
        const fnTrue = () => !0
            , fnSquare = e => e * e
            , fnAdd = (e, t) => e + (t || 0)
            , fnNotUndefined = e => void 0 !== e
            , fnVec2Angle = e => Math.atan2(e[1], e[0])
            , fnToVec2 = e => [Math.cos(e), Math.sin(e)]
            , fnEpsilonEqual = (e, t, r=P) => Math.abs(e - t) < r
            , fnEpsilonSort = (e, t, r=P) => fnEpsilonEqual(e, t, r) ? 0 : Math.sign(t - e)
            , fnEpsilonEqualVectors = (e, t, r=P) => {
            for (let o = 0; o < Math.max(e.length, t.length); o += 1)
                if (!fnEpsilonEqual(e[o] || 0, t[o] || 0, r))
                    return !1;
            return !0
        }
            , include = (e, t=P) => e > -t
            , exclude = (e, t=P) => e > t
            , $ = fnTrue
            , N = fnTrue
            , z = include
            , F = exclude
            , includeS = (e, t=P) => e > -t && e < 1 + t
            , excludeS = (e, t=P) => e > t && e < 1 - t
            , rayLimiter = e => e < -P ? 0 : e
            , segmentLimiter = e => e < -P ? 0 : e > 1.000001 ? 1 : e;
        var I = Object.freeze({
            __proto__: null,
            fnTrue: fnTrue,
            fnSquare: fnSquare,
            fnAdd: fnAdd,
            fnNotUndefined: fnNotUndefined,
            fnAnd: (e, t) => e && t,
            fnCat: (e, t) => e.concat(t),
            fnVec2Angle: fnVec2Angle,
            fnToVec2: fnToVec2,
            fnEqual: (e, t) => e === t,
            fnEpsilonEqual: fnEpsilonEqual,
            fnEpsilonSort: fnEpsilonSort,
            fnEpsilonEqualVectors: fnEpsilonEqualVectors,
            include: include,
            exclude: exclude,
            includeL: $,
            excludeL: N,
            includeR: z,
            excludeR: F,
            includeS: includeS,
            excludeS: excludeS,
            lineLimiter: e => e,
            rayLimiter: rayLimiter,
            segmentLimiter: segmentLimiter
        });
        const magnitude = e => Math.sqrt(e.map(fnSquare).reduce(fnAdd, 0))
            , magnitude2 = e => Math.sqrt(e[0] * e[0] + e[1] * e[1])
            , magSquared = e => e.map(fnSquare).reduce(fnAdd, 0)
            , normalize = e => {
            const t = magnitude(e);
            return 0 === t ? e : e.map((e => e / t))
        }
            , normalize2 = e => {
            const t = magnitude2(e);
            return 0 === t ? e : [e[0] / t, e[1] / t]
        }
            , scale = (e, t) => e.map((e => e * t))
            , scale2 = (e, t) => [e[0] * t, e[1] * t]
            , add = (e, t) => e.map(( (e, r) => e + (t[r] || 0)))
            , add2 = (e, t) => [e[0] + t[0], e[1] + t[1]]
            , subtract = (e, t) => e.map(( (e, r) => e - (t[r] || 0)))
            , subtract2 = (e, t) => [e[0] - t[0], e[1] - t[1]]
            , dot = (e, t) => e.map(( (r, o) => e[o] * t[o])).reduce(fnAdd, 0)
            , dot2 = (e, t) => e[0] * t[0] + e[1] * t[1]
            , midpoint = (e, t) => e.map(( (e, r) => (e + t[r]) / 2))
            , average = function() {
            if (0 === arguments.length)
                return [];
            const e = arguments[0].length > 0 ? arguments[0].length : 0
                , t = Array(e).fill(0);
            return Array.from(arguments).forEach((e => t.forEach(( (r, o) => {
                    t[o] += e[o] || 0
                }
            )))),
                t.map((e => e / arguments.length))
        }
            , lerp = (e, t, r) => {
            const o = 1 - r;
            return e.map(( (e, n) => e * o + (t[n] || 0) * r))
        }
            , cross2 = (e, t) => e[0] * t[1] - e[1] * t[0]
            , cross3 = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]]
            , distance = (e, t) => Math.sqrt(e.map(( (r, o) => (e[o] - t[o]) ** 2)).reduce(fnAdd, 0))
            , distance2 = (e, t) => {
            const r = e[0] - t[0]
                , o = e[1] - t[1];
            return Math.sqrt(r * r + o * o)
        }
            , flip = e => e.map((e => -e))
            , rotate90 = e => [-e[1], e[0]]
            , rotate270 = e => [e[1], -e[0]]
            , degenerate = (e, t=P) => e.map((e => Math.abs(e))).reduce(fnAdd, 0) < t
            , parallel = (e, t, r=P) => 1 - Math.abs(dot(normalize(e), normalize(t))) < r;
        var V = Object.freeze({
            __proto__: null,
            magnitude: magnitude,
            magnitude2: magnitude2,
            magSquared: magSquared,
            normalize: normalize,
            normalize2: normalize2,
            scale: scale,
            scale2: scale2,
            add: add,
            add2: add2,
            subtract: subtract,
            subtract2: subtract2,
            dot: dot,
            dot2: dot2,
            midpoint: midpoint,
            midpoint2: (e, t) => scale2(add2(e, t), .5),
            average: average,
            lerp: lerp,
            cross2: cross2,
            cross3: cross3,
            distance: distance,
            distance2: distance2,
            distance3: (e, t) => {
                const r = e[0] - t[0]
                    , o = e[1] - t[1]
                    , n = e[2] - t[2];
                return Math.sqrt(r * r + o * o + n * n)
            }
            ,
            flip: flip,
            rotate90: rotate90,
            rotate270: rotate270,
            degenerate: degenerate,
            parallel: parallel,
            parallel2: (e, t, r=P) => Math.abs(cross2(e, t)) < r
        });
        const B = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1])
            , T = Object.freeze(B.concat(0, 0, 0))
            , isIdentity3x4 = e => T.map(( (t, r) => Math.abs(t - e[r]) < P)).reduce(( (e, t) => e && t), !0)
            , multiplyMatrix3Vector3 = (e, t) => [e[0] * t[0] + e[3] * t[1] + e[6] * t[2] + e[9], e[1] * t[0] + e[4] * t[1] + e[7] * t[2] + e[10], e[2] * t[0] + e[5] * t[1] + e[8] * t[2] + e[11]]
            , multiplyMatrix3Line3 = (e, t, r) => ({
                vector: [e[0] * t[0] + e[3] * t[1] + e[6] * t[2], e[1] * t[0] + e[4] * t[1] + e[7] * t[2], e[2] * t[0] + e[5] * t[1] + e[8] * t[2]],
                origin: [e[0] * r[0] + e[3] * r[1] + e[6] * r[2] + e[9], e[1] * r[0] + e[4] * r[1] + e[7] * r[2] + e[10], e[2] * r[0] + e[5] * r[1] + e[8] * r[2] + e[11]]
            })
            , multiplyMatrices3 = (e, t) => [e[0] * t[0] + e[3] * t[1] + e[6] * t[2], e[1] * t[0] + e[4] * t[1] + e[7] * t[2], e[2] * t[0] + e[5] * t[1] + e[8] * t[2], e[0] * t[3] + e[3] * t[4] + e[6] * t[5], e[1] * t[3] + e[4] * t[4] + e[7] * t[5], e[2] * t[3] + e[5] * t[4] + e[8] * t[5], e[0] * t[6] + e[3] * t[7] + e[6] * t[8], e[1] * t[6] + e[4] * t[7] + e[7] * t[8], e[2] * t[6] + e[5] * t[7] + e[8] * t[8], e[0] * t[9] + e[3] * t[10] + e[6] * t[11] + e[9], e[1] * t[9] + e[4] * t[10] + e[7] * t[11] + e[10], e[2] * t[9] + e[5] * t[10] + e[8] * t[11] + e[11]]
            , determinant3 = e => e[0] * e[4] * e[8] - e[0] * e[7] * e[5] - e[3] * e[1] * e[8] + e[3] * e[7] * e[2] + e[6] * e[1] * e[5] - e[6] * e[4] * e[2]
            , invertMatrix3 = e => {
                const t = determinant3(e);
                if (Math.abs(t) < 1e-6 || Number.isNaN(t) || !Number.isFinite(e[9]) || !Number.isFinite(e[10]) || !Number.isFinite(e[11]))
                    return;
                const r = [e[4] * e[8] - e[7] * e[5], -e[1] * e[8] + e[7] * e[2], e[1] * e[5] - e[4] * e[2], -e[3] * e[8] + e[6] * e[5], e[0] * e[8] - e[6] * e[2], -e[0] * e[5] + e[3] * e[2], e[3] * e[7] - e[6] * e[4], -e[0] * e[7] + e[6] * e[1], e[0] * e[4] - e[3] * e[1], -e[3] * e[7] * e[11] + e[3] * e[8] * e[10] + e[6] * e[4] * e[11] - e[6] * e[5] * e[10] - e[9] * e[4] * e[8] + e[9] * e[5] * e[7], e[0] * e[7] * e[11] - e[0] * e[8] * e[10] - e[6] * e[1] * e[11] + e[6] * e[2] * e[10] + e[9] * e[1] * e[8] - e[9] * e[2] * e[7], -e[0] * e[4] * e[11] + e[0] * e[5] * e[10] + e[3] * e[1] * e[11] - e[3] * e[2] * e[10] - e[9] * e[1] * e[5] + e[9] * e[2] * e[4]]
                    , o = 1 / t;
                return r.map((e => e * o))
            }
            , makeMatrix3Translate = (e=0, t=0, r=0) => B.concat(e, t, r)
            , singleAxisRotate = (e, t, r, o, n) => {
                const s = B.concat([0, 1, 2].map((e => t[e] || 0)))
                    , c = Math.cos(e)
                    , i = Math.sin(e);
                return s[3 * r + r] = c,
                    s[3 * r + o] = (n ? 1 : -1) * i,
                    s[3 * o + r] = (n ? -1 : 1) * i,
                    s[3 * o + o] = c,
                    s
            }
            , makeMatrix3RotateX = (e, t=[0, 0, 0]) => singleAxisRotate(e, t, 1, 2, !0)
            , makeMatrix3RotateY = (e, t=[0, 0, 0]) => singleAxisRotate(e, t, 0, 2, !1)
            , makeMatrix3RotateZ = (e, t=[0, 0, 0]) => singleAxisRotate(e, t, 0, 1, !0)
            , makeMatrix3Rotate = (e, t=[0, 0, 1], r=[0, 0, 0]) => {
                const o = [0, 1, 2].map((e => r[e] || 0))
                    , [n,s,c] = resize(3, normalize(t))
                    , i = Math.cos(e)
                    , a = Math.sin(e)
                    , l = 1 - i
                    , d = B.concat(-o[0], -o[1], -o[2])
                    , u = B.concat(o[0], o[1], o[2]);
                return multiplyMatrices3(u, multiplyMatrices3([l * n * n + i, l * s * n + c * a, l * c * n - s * a, l * n * s - c * a, l * s * s + i, l * c * s + n * a, l * n * c + s * a, l * s * c - n * a, l * c * c + i, 0, 0, 0], d))
            }
            , makeMatrix3Scale = (e=1, t=[0, 0, 0]) => [e, 0, 0, 0, e, 0, 0, 0, e, e * -t[0] + t[0], e * -t[1] + t[1], e * -t[2] + t[2]]
            , makeMatrix3ReflectZ = (e, t=[0, 0]) => {
                const r = Math.atan2(e[1], e[0])
                    , o = Math.cos(r)
                    , n = Math.sin(r)
                    , s = Math.cos(-r)
                    , c = Math.sin(-r)
                    , i = o * s + n * c
                    , a = o * -c + n * s
                    , l = n * s + -o * c
                    , d = n * -c + -o * s;
                return [i, a, 0, l, d, 0, 0, 0, 1, t[0] + i * -t[0] + -t[1] * l, t[1] + a * -t[0] + -t[1] * d, 0]
            }
        ;
        var q = Object.freeze({
            __proto__: null,
            identity3x3: B,
            identity3x4: T,
            isIdentity3x4: isIdentity3x4,
            multiplyMatrix3Vector3: multiplyMatrix3Vector3,
            multiplyMatrix3Line3: multiplyMatrix3Line3,
            multiplyMatrices3: multiplyMatrices3,
            determinant3: determinant3,
            invertMatrix3: invertMatrix3,
            makeMatrix3Translate: makeMatrix3Translate,
            makeMatrix3RotateX: makeMatrix3RotateX,
            makeMatrix3RotateY: makeMatrix3RotateY,
            makeMatrix3RotateZ: makeMatrix3RotateZ,
            makeMatrix3Rotate: makeMatrix3Rotate,
            makeMatrix3Scale: makeMatrix3Scale,
            makeMatrix3ReflectZ: makeMatrix3ReflectZ
        });
        const vectorOriginForm = (e, t) => ({
            vector: e || [],
            origin: t || []
        })
            , getVector = function() {
            if (arguments[0]instanceof j.vector)
                return arguments[0];
            let e = flattenArrays(arguments);
            return e.length > 0 && "object" == typeof e[0] && null !== e[0] && !Number.isNaN(e[0].x) && (e = ["x", "y", "z"].map((t => e[0][t])).filter(fnNotUndefined)),
                e.filter((e => "number" == typeof e))
        }
            , getVectorOfVectors = function() {
            return semiFlattenArrays(arguments).map((e => getVector(e)))
        }
            , getSegment = function() {
            if (arguments[0]instanceof j.segment)
                return arguments[0];
            const e = semiFlattenArrays(arguments);
            return 4 === e.length ? [[e[0], e[1]], [e[2], e[3]]] : e.map((e => getVector(e)))
        }
            , getLine$1 = function() {
            const e = semiFlattenArrays(arguments);
            return 0 === e.length ? vectorOriginForm([], []) : e[0]instanceof j.line || e[0]instanceof j.ray || e[0]instanceof j.segment ? e[0] : e[0].constructor === Object && void 0 !== e[0].vector ? vectorOriginForm(e[0].vector || [], e[0].origin || []) : "number" == typeof e[0] ? vectorOriginForm(getVector(e)) : vectorOriginForm(...e.map((e => getVector(e))))
        }
            , R = getLine$1
            , getRectParams = (e=0, t=0, r=0, o=0) => ({
            x: e,
            y: t,
            width: r,
            height: o
        })
            , getRect = function() {
            if (arguments[0]instanceof j.rect)
                return arguments[0];
            const e = flattenArrays(arguments);
            if (e.length > 0 && "object" == typeof e[0] && null !== e[0] && !Number.isNaN(e[0].width))
                return getRectParams(...["x", "y", "width", "height"].map((t => e[0][t])).filter(fnNotUndefined));
            const t = e.filter((e => "number" == typeof e))
                , r = t.length < 4 ? [, , ...t] : t;
            return getRectParams(...r)
        }
            , getCircleParams = (e=1, ...t) => ({
            radius: e,
            origin: [...t]
        })
            , getCircle = function() {
            if (arguments[0]instanceof j.circle)
                return arguments[0];
            const e = getVectorOfVectors(arguments)
                , t = flattenArrays(arguments).filter((e => "number" == typeof e));
            if (2 === arguments.length) {
                if (1 === e[1].length)
                    return getCircleParams(e[1][0], ...e[0]);
                if (1 === e[0].length)
                    return getCircleParams(e[0][0], ...e[1]);
                if (e[0].length > 1 && e[1].length > 1)
                    return getCircleParams(distance2(...e), ...e[0])
            } else
                switch (t.length) {
                    case 0:
                        return getCircleParams(1, 0, 0, 0);
                    case 1:
                        return getCircleParams(t[0], 0, 0, 0);
                    default:
                        return getCircleParams(t.pop(), ...t)
                }
            return getCircleParams(1, 0, 0, 0)
        }
            , G = [[0, 1, 3, 4, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, void 0, 3, 4, 5, void 0, 6, 7, 8, void 0, 9, 10, 11]];
        [11, 7, 3].forEach((e => delete G[2][e]));
        const matrixMap3x4 = e => {
            let t;
            return t = e < 8 ? 0 : e < 13 ? 1 : 2,
                G[t]
        }
            , getMatrix3x4 = function() {
            const e = flattenArrays(arguments)
                , t = [...T];
            return matrixMap3x4(e.length).forEach(( (r, o) => {
                    null != e[o] && (t[r] = e[o])
                }
            )),
                t
        };
        var U = Object.freeze({
            __proto__: null,
            getVector: getVector,
            getVectorOfVectors: getVectorOfVectors,
            getSegment: getSegment,
            getLine: getLine$1,
            getRay: R,
            getRectParams: getRectParams,
            getRect: getRect,
            getCircle: getCircle,
            getMatrix3x4: getMatrix3x4
        });
        const rayLineToUniqueLine = ({vector: e, origin: t}) => {
            const r = magnitude(e)
                , o = rotate90(e)
                , n = dot(t, o) / r;
            return {
                normal: scale(o, 1 / r),
                distance: n
            }
        }
            , uniqueLineToRayLine = ({normal: e, distance: t}) => ({
            vector: rotate270(e),
            origin: scale(e, t)
        });
        var D = Object.freeze({
            __proto__: null,
            rayLineToUniqueLine: rayLineToUniqueLine,
            uniqueLineToRayLine: uniqueLineToRayLine
        });
        const smallestComparisonSearch = (e, t, r) => {
            const o = t.map(( (t, o) => ({
                o: t,
                i: o,
                d: r(e, t)
            })));
            let n, s = 1 / 0;
            for (let e = 0; e < o.length; e += 1)
                o[e].d < s && (n = e,
                    s = o[e].d);
            return n
        }
            , minimum2DPointIndex = (e, t=P) => {
            const r = ( (e, t=fnEpsilonSort, r=P) => {
                    let o = [0];
                    for (let n = 1; n < e.length; n += 1)
                        switch (t(e[n][0], e[o[0]][0], r)) {
                            case 0:
                                o.push(n);
                                break;
                            case 1:
                                o = [n]
                        }
                    return o
                }
            )(e, fnEpsilonSort, t);
            let o = 0;
            for (let t = 1; t < r.length; t += 1)
                e[r[t]][1] < e[r[o]][1] && (o = t);
            return r[o]
        }
            , nearestPointOnLine = (e, t, r, o, n=P) => {
            t = resize(e.length, t),
                r = resize(e.length, r);
            const s = magSquared(e)
                , c = subtract(r, t)
                , i = o(dot(e, c) / s, n);
            return add(t, scale(e, i))
        }
            , nearestPointOnPolygon = (e, t) => {
            const r = e.map(( (e, t, r) => subtract(r[(t + 1) % r.length], e)));
            return e.map(( (e, o) => nearestPointOnLine(r[o], e, t, segmentLimiter))).map(( (e, r) => ({
                point: e,
                i: r,
                distance: distance(e, t)
            }))).sort(( (e, t) => e.distance - t.distance)).shift()
        }
            , nearestPointOnCircle = (e, t, r) => add(t, scale(normalize(subtract(r, t)), e));
        var W = Object.freeze({
            __proto__: null,
            smallestComparisonSearch: smallestComparisonSearch,
            minimum2DPointIndex: minimum2DPointIndex,
            nearestPoint2: (e, t) => {
                const r = smallestComparisonSearch(e, t, distance2);
                return void 0 === r ? void 0 : t[r]
            }
            ,
            nearestPoint: (e, t) => {
                const r = smallestComparisonSearch(e, t, distance);
                return void 0 === r ? void 0 : t[r]
            }
            ,
            nearestPointOnLine: nearestPointOnLine,
            nearestPointOnPolygon: nearestPointOnPolygon,
            nearestPointOnCircle: nearestPointOnCircle
        });
        const clusterIndicesOfSortedNumbers = (e, t=P) => {
                const r = [[0]];
                let o = 0;
                for (let n = 1; n < e.length; n += 1)
                    fnEpsilonEqual(e[n], e[n - 1], t) ? r[o].push(n) : (o = r.length,
                        r.push([n]));
                return r
            }
            , radialSortPointIndices = (e=[], t=P) => {
                const r = minimum2DPointIndex(e, t)
                    , o = e.map((t => subtract2(t, e[r]))).map((e => normalize2(e))).map((e => dot2([0, 1], e)))
                    , n = o.map(( (e, t) => ({
                    a: e,
                    i: t
                }))).sort(( (e, t) => e.a - t.a)).map((e => e.i)).filter((e => e !== r));
                return [[r]].concat(clusterIndicesOfSortedNumbers(n.map((e => o[e])), t).map((e => e.map((e => n[e])))).map((t => 1 === t.length ? t : t.map((t => ({
                    i: t,
                    len: distance2(e[t], e[r])
                }))).sort(( (e, t) => e.len - t.len)).map((e => e.i)))))
            }
        ;
        var Z = Object.freeze({
            __proto__: null,
            sortPointsAlongVector2: (e, t) => e.map((e => ({
                point: e,
                d: e[0] * t[0] + e[1] * t[1]
            }))).sort(( (e, t) => e.d - t.d)).map((e => e.point)),
            clusterIndicesOfSortedNumbers: clusterIndicesOfSortedNumbers,
            radialSortPointIndices: radialSortPointIndices
        });
        const H = [1, 0, 0, 1]
            , J = H.concat(0, 0)
            , determinant2 = e => e[0] * e[3] - e[1] * e[2]
            , makeMatrix2Rotate = (e, t=[0, 0]) => {
                const r = Math.cos(e)
                    , o = Math.sin(e);
                return [r, o, -o, r, t[0], t[1]]
            }
        ;
        var X = Object.freeze({
            __proto__: null,
            identity2x2: H,
            identity2x3: J,
            multiplyMatrix2Vector2: (e, t) => [e[0] * t[0] + e[2] * t[1] + e[4], e[1] * t[0] + e[3] * t[1] + e[5]],
            multiplyMatrix2Line2: (e, t, r) => ({
                vector: [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1]],
                origin: [e[0] * r[0] + e[2] * r[1] + e[4], e[1] * r[0] + e[3] * r[1] + e[5]]
            }),
            multiplyMatrices2: (e, t) => [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], e[0] * t[4] + e[2] * t[5] + e[4], e[1] * t[4] + e[3] * t[5] + e[5]],
            determinant2: determinant2,
            invertMatrix2: e => {
                const t = determinant2(e);
                if (!(Math.abs(t) < 1e-6 || Number.isNaN(t)) && Number.isFinite(e[4]) && Number.isFinite(e[5]))
                    return [e[3] / t, -e[1] / t, -e[2] / t, e[0] / t, (e[2] * e[5] - e[3] * e[4]) / t, (e[1] * e[4] - e[0] * e[5]) / t]
            }
            ,
            makeMatrix2Translate: (e=0, t=0) => H.concat(e, t),
            makeMatrix2Scale: (e, t, r=[0, 0]) => [e, 0, 0, t, e * -r[0] + r[0], t * -r[1] + r[1]],
            makeMatrix2Rotate: makeMatrix2Rotate,
            makeMatrix2Reflect: (e, t=[0, 0]) => {
                const r = Math.atan2(e[1], e[0])
                    , o = Math.cos(r)
                    , n = Math.sin(r)
                    , s = Math.cos(-r)
                    , c = Math.sin(-r)
                    , i = o * s + n * c
                    , a = o * -c + n * s
                    , l = n * s + -o * c
                    , d = n * -c + -o * s;
                return [i, a, l, d, t[0] + i * -t[0] + -t[1] * l, t[1] + a * -t[0] + -t[1] * d]
            }
        });
        const overlapConvexPolygonPoint = (e, t, r=exclude, o=P) => e.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => cross2(normalize(subtract(e[1], e[0])), subtract(t, e[0])))).map((e => r(e, o))).map(( (e, t, r) => e === r[0])).reduce(( (e, t) => e && t), !0)
            , linePointFromParameter = (e, t, r) => add(t, scale(e, r))
            , getIntersectParameters = (e, t, r, o, n) => e.map(( (e, t, r) => [subtract(r[(t + 1) % r.length], e), e])).map((e => ( (e, t, r, o, n=includeS, s=P) => {
                    const c = cross2(normalize(e), normalize(r));
                    if (Math.abs(c) < s)
                        return;
                    const i = cross2(e, r)
                        , a = -i
                        , l = subtract(o, t)
                        , d = flip(l)
                        , u = cross2(l, r) / i;
                    return n(cross2(d, e) / a, s / magnitude(r)) ? u : void 0
                }
            )(t, r, e[0], e[1], o, n))).filter(fnNotUndefined).sort(( (e, t) => e - t))
            , clipLineConvexPolygon = (e, t, r, o=include, n=$, s=P) => {
                const c = getIntersectParameters(e, t, r, includeS, s);
                if (c.length < 2)
                    return;
                const i = ( (e, t, r) => {
                        let o = 0
                            , n = e.length - 1;
                        for (; o < n && !t(e[o + 1] - e[o], r); )
                            o += 1;
                        for (; n > o && !t(e[n] - e[n - 1], r); )
                            n -= 1;
                        if (!(o >= n))
                            return [e[o], e[n]]
                    }
                )(c, o, 2 * s / magnitude(t));
                if (void 0 === i)
                    return;
                const a = i.map((e => n(e) ? e : e < .5 ? 0 : 1));
                if (Math.abs(a[0] - a[1]) < 2 * s / magnitude(t))
                    return;
                const l = linePointFromParameter(t, r, (a[0] + a[1]) / 2);
                return overlapConvexPolygonPoint(e, l, o, s) ? a.map((e => linePointFromParameter(t, r, e))) : void 0
            }
            , clockwiseAngleRadians = (e, t) => {
                for (; e < 0; )
                    e += L;
                for (; t < 0; )
                    t += L;
                for (; e > L; )
                    e -= L;
                for (; t > L; )
                    t -= L;
                const r = e - t;
                return r >= 0 ? r : L - (t - e)
            }
            , counterClockwiseAngleRadians = (e, t) => {
                for (; e < 0; )
                    e += L;
                for (; t < 0; )
                    t += L;
                for (; e > L; )
                    e -= L;
                for (; t > L; )
                    t -= L;
                const r = t - e;
                return r >= 0 ? r : L - (e - t)
            }
            , clockwiseAngle2 = (e, t) => {
                const r = t[0] * e[0] + t[1] * e[1]
                    , o = t[0] * e[1] - t[1] * e[0];
                let n = Math.atan2(o, r);
                return n < 0 && (n += L),
                    n
            }
            , counterClockwiseAngle2 = (e, t) => {
                const r = e[0] * t[0] + e[1] * t[1]
                    , o = e[0] * t[1] - e[1] * t[0];
                let n = Math.atan2(o, r);
                return n < 0 && (n += L),
                    n
            }
            , clockwiseBisect2 = (e, t) => fnToVec2(fnVec2Angle(e) - clockwiseAngle2(e, t) / 2)
            , counterClockwiseBisect2 = (e, t) => fnToVec2(fnVec2Angle(e) + counterClockwiseAngle2(e, t) / 2)
            , clockwiseSubsectRadians = (e, t, r) => {
                const o = clockwiseAngleRadians(t, r) / e;
                return Array.from(Array(e - 1)).map(( (e, r) => t + o * (r + 1)))
            }
            , counterClockwiseSubsectRadians = (e, t, r) => {
                const o = counterClockwiseAngleRadians(t, r) / e;
                return Array.from(Array(e - 1)).map(( (e, r) => t + o * (r + 1)))
            }
            , clockwiseSubsect2 = (e, t, r) => {
                const o = Math.atan2(t[1], t[0])
                    , n = Math.atan2(r[1], r[0]);
                return clockwiseSubsectRadians(e, o, n).map(fnToVec2)
            }
            , counterClockwiseSubsect2 = (e, t, r) => {
                const o = Math.atan2(t[1], t[0])
                    , n = Math.atan2(r[1], r[0]);
                return counterClockwiseSubsectRadians(e, o, n).map(fnToVec2)
            }
            , bisectLines2 = (e, t, r, o, n=P) => {
                const s = cross2(e, r)
                    , c = dot(e, r)
                    , i = s > -n ? [counterClockwiseBisect2(e, r)] : [clockwiseBisect2(e, r)];
                i[1] = s > -n ? rotate90(i[0]) : rotate270(i[0]);
                const a = ((o[0] - t[0]) * r[1] - r[0] * (o[1] - t[1])) / s
                    , l = [e, r].map((e => normalize(e)))
                    , d = Math.abs(cross2(...l)) < n
                    , u = d ? midpoint(t, o) : [t[0] + e[0] * a, t[1] + e[1] * a]
                    , p = i.map((e => ({
                    vector: e,
                    origin: u
                })));
                return d && delete p[c > -n ? 1 : 0],
                    p
            }
            , counterClockwiseOrderRadians = function() {
                const e = Array.from(arguments).flat()
                    , t = e.map(( (e, t) => t)).sort(( (t, r) => e[t] - e[r]));
                return t.slice(t.indexOf(0), t.length).concat(t.slice(0, t.indexOf(0)))
            }
            , counterClockwiseSectorsRadians = function() {
                const e = Array.from(arguments).flat()
                    , t = counterClockwiseOrderRadians(e).map((t => e[t]));
                return t.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => counterClockwiseAngleRadians(e[0], e[1])))
            }
            , threePointTurnDirection = (e, t, r, o=P) => {
                const n = normalize2(subtract2(t, e))
                    , s = normalize2(subtract2(r, e))
                    , c = cross2(n, s);
                return fnEpsilonEqual(c, 0, o) ? fnEpsilonEqual(distance2(e, t) + distance2(t, r), distance2(e, r)) ? 0 : void 0 : Math.sign(c)
            }
        ;
        var Y = Object.freeze({
            __proto__: null,
            isCounterClockwiseBetween: (e, t, r) => {
                for (; r < t; )
                    r += L;
                for (; e > t; )
                    e -= L;
                for (; e < t; )
                    e += L;
                return e < r
            }
            ,
            clockwiseAngleRadians: clockwiseAngleRadians,
            counterClockwiseAngleRadians: counterClockwiseAngleRadians,
            clockwiseAngle2: clockwiseAngle2,
            counterClockwiseAngle2: counterClockwiseAngle2,
            clockwiseBisect2: clockwiseBisect2,
            counterClockwiseBisect2: counterClockwiseBisect2,
            clockwiseSubsectRadians: clockwiseSubsectRadians,
            counterClockwiseSubsectRadians: counterClockwiseSubsectRadians,
            clockwiseSubsect2: clockwiseSubsect2,
            counterClockwiseSubsect2: counterClockwiseSubsect2,
            bisectLines2: bisectLines2,
            counterClockwiseOrderRadians: counterClockwiseOrderRadians,
            counterClockwiseOrder2: function() {
                return counterClockwiseOrderRadians(semiFlattenArrays(arguments).map(fnVec2Angle))
            },
            counterClockwiseSectorsRadians: counterClockwiseSectorsRadians,
            counterClockwiseSectors2: function() {
                return counterClockwiseSectorsRadians(getVectorOfVectors(arguments).map(fnVec2Angle))
            },
            threePointTurnDirection: threePointTurnDirection
        });
        const convexHullIndices = (e=[], t=!1, r=P) => {
            if (e.length < 2)
                return [];
            const o = radialSortPointIndices(e, r).map((e => 1 === e.length ? e : (e => e.concat(e.slice(0, -1).reverse()))(e))).flat();
            o.push(o[0]);
            const n = [o[0]];
            let s = 1;
            const c = {
                "-1": () => n.pop(),
                1: e => {
                    n.push(e),
                        s += 1
                }
                ,
                undefined: () => {
                    s += 1
                }
            };
            for (c[0] = t ? c[1] : c[-1]; s < o.length; ) {
                if (n.length < 2) {
                    n.push(o[s]),
                        s += 1;
                    continue
                }
                const t = n[n.length - 2]
                    , i = n[n.length - 1]
                    , a = o[s];
                c[threePointTurnDirection(...[t, i, a].map((t => e[t])), r)](a)
            }
            return n.pop(),
                n
        }
            , convexHull = (e=[], t=!1, r=P) => convexHullIndices(e, t, r).map((t => e[t]));
        var K = Object.freeze({
            __proto__: null,
            convexHullIndices: convexHullIndices,
            convexHull: convexHull
        });
        const intersectLineLine = (e, t, r, o, n=$, s=$, c=P) => {
                const i = cross2(normalize(e), normalize(r));
                if (Math.abs(i) < c)
                    return;
                const a = cross2(e, r)
                    , l = -a
                    , d = [o[0] - t[0], o[1] - t[1]]
                    , u = [-d[0], -d[1]]
                    , p = cross2(d, r) / a
                    , g = cross2(u, e) / l;
                return n(p, c / magnitude(e)) && s(g, c / magnitude(r)) ? add(t, scale(e, p)) : void 0
            }
        ;
        var Q = Object.freeze({
            __proto__: null,
            pleat: (e, t, r) => {
                const o = getLine$1(t)
                    , n = getLine$1(r);
                return parallel(o.vector, n.vector) ? ( (e, t, r) => {
                        const o = Array.from(Array(e - 1)).map(( (t, r) => (r + 1) / e)).map((e => lerp(t.origin, r.origin, e)))
                            , n = [...t.vector];
                        return o.map((e => ({
                            origin: e,
                            vector: n
                        })))
                    }
                )(e, o, n) : ( (e, t, r) => {
                        const o = intersectLineLine(t.vector, t.origin, r.vector, r.origin);
                        return (clockwiseAngle2(t.vector, r.vector) < counterClockwiseAngle2(t.vector, r.vector) ? clockwiseSubsect2(e, t.vector, r.vector) : counterClockwiseSubsect2(e, t.vector, r.vector)).map((e => ({
                            origin: o,
                            vector: e
                        })))
                    }
                )(e, o, n)
            }
        });
        const angleArray = e => Array.from(Array(Math.floor(e))).map(( (t, r) => L * (r / e)))
            , anglesToVecs = (e, t) => e.map((e => [t * Math.cos(e), t * Math.sin(e)])).map((e => e.map((e => cleanNumber(e, 14)))))
            , makePolygonCircumradius = (e=3, t=1) => anglesToVecs(angleArray(e), t)
            , makePolygonCircumradiusSide = (e=3, t=1) => {
                const r = Math.PI / e
                    , o = angleArray(e).map((e => e + r));
                return anglesToVecs(o, t)
            }
            , circumcircle = function(e, t, r) {
                const o = t[0] - e[0]
                    , n = t[1] - e[1]
                    , s = r[0] - e[0]
                    , c = r[1] - e[1]
                    , i = o * (e[0] + t[0]) + n * (e[1] + t[1])
                    , a = s * (e[0] + r[0]) + c * (e[1] + r[1])
                    , l = 2 * (o * (r[1] - t[1]) - n * (r[0] - t[0]));
                if (Math.abs(l) < P) {
                    const o = Math.min(e[0], t[0], r[0])
                        , n = Math.min(e[1], t[1], r[1])
                        , s = .5 * (Math.max(e[0], t[0], r[0]) - o)
                        , c = .5 * (Math.max(e[1], t[1], r[1]) - n);
                    return {
                        origin: [o + s, n + c],
                        radius: Math.sqrt(s * s + c * c)
                    }
                }
                const d = [(c * i - n * a) / l, (o * a - s * i) / l]
                    , u = d[0] - e[0]
                    , p = d[1] - e[1];
                return {
                    origin: d,
                    radius: Math.sqrt(u * u + p * p)
                }
            }
            , signedArea = e => .5 * e.map(( (e, t, r) => {
                    const o = r[(t + 1) % r.length];
                    return e[0] * o[1] - o[0] * e[1]
                }
            )).reduce(fnAdd, 0)
            , centroid = e => {
                const t = 1 / (6 * signedArea(e));
                return e.map(( (e, t, r) => {
                        const o = r[(t + 1) % r.length]
                            , n = e[0] * o[1] - o[0] * e[1];
                        return [(e[0] + o[0]) * n, (e[1] + o[1]) * n]
                    }
                )).reduce(( (e, t) => [e[0] + t[0], e[1] + t[1]]), [0, 0]).map((e => e * t))
            }
            , boundingBox = (e, t=0) => {
                const r = Array(e[0].length).fill(1 / 0)
                    , o = Array(e[0].length).fill(-1 / 0);
                e.forEach((e => e.forEach(( (e, n) => {
                        e < r[n] && (r[n] = e - t),
                        e > o[n] && (o[n] = e + t)
                    }
                ))));
                const n = o.map(( (e, t) => e - r[t]));
                return {
                    min: r,
                    max: o,
                    span: n
                }
            }
        ;
        var ee = Object.freeze({
            __proto__: null,
            makePolygonCircumradius: makePolygonCircumradius,
            makePolygonCircumradiusSide: makePolygonCircumradiusSide,
            makePolygonInradius: (e=3, t=1) => makePolygonCircumradius(e, t / Math.cos(Math.PI / e)),
            makePolygonInradiusSide: (e=3, t=1) => makePolygonCircumradiusSide(e, t / Math.cos(Math.PI / e)),
            makePolygonSideLength: (e=3, t=1) => makePolygonCircumradius(e, t / 2 / Math.sin(Math.PI / e)),
            makePolygonSideLengthSide: (e=3, t=1) => makePolygonCircumradiusSide(e, t / 2 / Math.sin(Math.PI / e)),
            makePolygonNonCollinear: (e, t=P) => {
                const r = e.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => subtract(e[1], e[0]))).map(( (e, t, r) => [e, r[(t + r.length - 1) % r.length]])).map((e => !parallel(e[1], e[0], t)));
                return e.filter(( (e, t) => r[t]))
            }
            ,
            circumcircle: circumcircle,
            signedArea: signedArea,
            centroid: centroid,
            boundingBox: boundingBox
        });
        const overlapLinePoint = (e, t, r, o=N, n=P) => {
                const s = subtract(r, t)
                    , c = magSquared(e)
                    , i = Math.sqrt(c);
                if (i < n)
                    return !1;
                const a = cross2(s, e.map((e => e / i)))
                    , l = dot(s, e) / c;
                return Math.abs(a) < n && o(l, n / i)
            }
            , splitConvexPolygon = (e, t, r) => {
                const o = e.map(( (e, o) => ({
                    point: overlapLinePoint(t, r, e, $) ? e : null,
                    at_index: o
                }))).filter((e => null != e.point))
                    , n = e.map(( (e, o, n) => ({
                    point: intersectLineLine(t, r, subtract(e, n[(o + 1) % n.length]), n[(o + 1) % n.length], N, excludeS),
                    at_index: o
                }))).filter((e => null != e.point));
                if (2 === n.length) {
                    const t = n.slice().sort(( (e, t) => e.at_index - t.at_index))
                        , r = e.slice(t[1].at_index + 1).concat(e.slice(0, t[0].at_index + 1));
                    r.push(t[0].point),
                        r.push(t[1].point);
                    const o = e.slice(t[0].at_index + 1, t[1].at_index + 1);
                    return o.push(t[1].point),
                        o.push(t[0].point),
                        [r, o]
                }
                if (1 === n.length && 1 === o.length) {
                    o[0].type = "v",
                        n[0].type = "e";
                    const t = o.concat(n).sort(( (e, t) => e.at_index - t.at_index))
                        , r = e.slice(t[1].at_index + 1).concat(e.slice(0, t[0].at_index + 1));
                    "e" === t[0].type && r.push(t[0].point),
                        r.push(t[1].point);
                    const s = e.slice(t[0].at_index + 1, t[1].at_index + 1);
                    return "e" === t[1].type && s.push(t[1].point),
                        s.push(t[0].point),
                        [r, s]
                }
                if (2 === o.length) {
                    const t = o.slice().sort(( (e, t) => e.at_index - t.at_index));
                    return [e.slice(t[1].at_index).concat(e.slice(0, t[0].at_index + 1)), e.slice(t[0].at_index, t[1].at_index + 1)]
                }
                return [e.slice()]
            }
            , recurseSkeleton = (e, t, r) => {
                const o = e.map(( (e, t) => ({
                    vector: r[t],
                    origin: e
                }))).map(( (e, t, r) => intersectLineLine(e.vector, e.origin, r[(t + 1) % r.length].vector, r[(t + 1) % r.length].origin, F, F)))
                    , n = t.map(( (e, t) => nearestPointOnLine(e.vector, e.origin, o[t], (e => e))));
                if (3 === e.length)
                    return e.map((e => ({
                        type: "skeleton",
                        points: [e, o[0]]
                    }))).concat([{
                        type: "perpendicular",
                        points: [n[0], o[0]]
                    }]);
                const s = o.map(( (e, t) => distance(e, n[t])));
                let c = 0;
                s.forEach(( (e, t) => {
                        e < s[c] && (c = t)
                    }
                ));
                const i = [{
                    type: "skeleton",
                    points: [e[c], o[c]]
                }, {
                    type: "skeleton",
                    points: [e[(c + 1) % e.length], o[c]]
                }, {
                    type: "perpendicular",
                    points: [n[c], o[c]]
                }]
                    , a = clockwiseBisect2(flip(t[(c + t.length - 1) % t.length].vector), t[(c + 1) % t.length].vector)
                    , l = c === e.length - 1;
                return e.splice(c, 2, o[c]),
                    t.splice(c, 1),
                    r.splice(c, 2, a),
                l && (e.splice(0, 1),
                    r.splice(0, 1),
                    t.push(t.shift())),
                    i.concat(recurseSkeleton(e, t, r))
            }
            , straightSkeleton = e => {
                const t = e.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => ({
                    vector: subtract(e[1], e[0]),
                    origin: e[0]
                })))
                    , r = e.map(( (e, t, r) => [(t - 1 + r.length) % r.length, t, (t + 1) % r.length].map((e => r[e])))).map((e => [subtract(e[0], e[1]), subtract(e[2], e[1])])).map((e => clockwiseBisect2(...e)));
                return recurseSkeleton([...e], t, r)
            }
        ;
        var te = Object.freeze({
            __proto__: null,
            collinearBetween: (e, t, r, o=!1, n=P) => {
                if ([e, r].map((e => fnEpsilonEqualVectors(t, e))).reduce(( (e, t) => e || t), !1))
                    return o;
                const s = [[e, t], [t, r]].map((e => subtract(e[1], e[0]))).map((e => normalize(e)));
                return fnEpsilonEqual(1, dot(...s), n)
            }
        });
        var re = Object.freeze({
            __proto__: null,
            enclosingBoundingBoxes: (e, t) => {
                const r = Math.min(e.min.length, t.min.length);
                for (let o = 0; o < r; o += 1)
                    if (t.min[o] < e.min[o] || t.max[o] > e.max[o])
                        return !1;
                return !0
            }
            ,
            enclosingPolygonPolygon: (e, t, r=include) => {
                const o = e.map((e => overlapConvexPolygonPoint(t, e, r))).reduce(( (e, t) => e || t), !1)
                    , n = t.map((e => overlapConvexPolygonPoint(t, e, r))).reduce(( (e, t) => e && t), !0);
                return !o && n
            }
        });
        const rotateVector2 = (e, t, r) => {
            const o = t[0] - e[0]
                , n = t[1] - e[1]
                , s = o * Math.cos(r) + n * Math.sin(r)
                , c = n * Math.cos(r) - o * Math.sin(r);
            return [e[0] + s, e[1] + c]
        }
            , intersectCircleCircle = (e, t, r, o, n=P) => {
            const s = e < r ? e : r
                , c = e < r ? r : e
                , i = e < r ? t : o
                , a = e < r ? o : t
                , l = [i[0] - a[0], i[1] - a[1]]
                , d = Math.sqrt(l[0] ** 2 + l[1] ** 2);
            if (d < n)
                return;
            const u = l.map(( (e, t) => e / d * c + a[t]));
            if (Math.abs(c + s - d) < n || Math.abs(c - (s + d)) < n)
                return [u];
            if (d + s < c || c + s < d)
                return;
            const p = (g = (s * s - d * d - c * c) / (-2 * d * c)) >= 1 ? 0 : g <= -1 ? Math.PI : Math.acos(g);
            var g;
            return [rotateVector2(a, u, +p), rotateVector2(a, u, -p)]
        }
            , intersectCircleLine = (e, t, r, o, n=$, s=P) => {
            const c = r[0] ** 2 + r[1] ** 2
                , i = Math.sqrt(c)
                , a = 0 === i ? r : r.map((e => e / i))
                , l = rotate90(a)
                , d = subtract(o, t)
                , u = cross2(d, a);
            if (Math.abs(u) > e + s)
                return;
            const p = Math.sqrt(e ** 2 - u ** 2)
                , f = (e, r) => t[r] - l[r] * u + a[r] * e
                , g = Math.abs(e - Math.abs(u)) < s ? [p].map((e => [e, e].map(f))) : [-p, p].map((e => [e, e].map(f)))
                , m = g.map((e => e.map(( (e, t) => e - o[t])))).map((e => e[0] * r[0] + r[1] * e[1])).map((e => e / c));
            return g.filter(( (e, t) => n(m[t], s)))
        }
            , getUniquePair = e => {
            for (let t = 1; t < e.length; t += 1)
                if (!fnEpsilonEqualVectors(e[0], e[t]))
                    return [e[0], e[t]]
        }
            , intersectConvexPolygonLineInclusive = (e, t, r, o=includeS, n=$, s=P) => {
            const c = e.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => intersectLineLine(subtract(e[1], e[0]), e[0], t, r, o, n, s))).filter((e => void 0 !== e));
            switch (c.length) {
                case 0:
                    return;
                case 1:
                    return [c];
                default:
                    return getUniquePair(c) || [c[0]]
            }
        }
            , intersectConvexPolygonLine = (e, t, r, o=includeS, n=N, s=P) => {
            const c = intersectConvexPolygonLineInclusive(e, t, r, o, n, s);
            let i;
            switch (n) {
                case F:
                    i = z;
                    break;
                case excludeS:
                    i = includeS;
                    break;
                default:
                    return c
            }
            const a = intersectConvexPolygonLineInclusive(e, t, r, includeS, i, s);
            if (void 0 === a)
                return;
            const l = getUniquePair(a);
            if (void 0 === l)
                switch (n) {
                    case F:
                        return overlapConvexPolygonPoint(e, r, exclude, s) ? a : void 0;
                    case excludeS:
                        return overlapConvexPolygonPoint(e, add(r, t), exclude, s) || overlapConvexPolygonPoint(e, r, exclude, s) ? a : void 0;
                    case N:
                    default:
                        return
                }
            return overlapConvexPolygonPoint(e, midpoint(...l), exclude, s) ? l : c
        }
            , oe = {
            polygon: e => [e],
            rect: e => [e],
            circle: e => [e.radius, e.origin],
            line: e => [e.vector, e.origin],
            ray: e => [e.vector, e.origin],
            segment: e => [e.vector, e.origin]
        }
            , ne = {
            polygon: {
                line: (e, t, r, o, n) => intersectConvexPolygonLine(...e, ...t, includeS, o, n),
                ray: (e, t, r, o, n) => intersectConvexPolygonLine(...e, ...t, includeS, o, n),
                segment: (e, t, r, o, n) => intersectConvexPolygonLine(...e, ...t, includeS, o, n)
            },
            circle: {
                circle: (e, t, r, o, n) => intersectCircleCircle(...e, ...t, n),
                line: (e, t, r, o, n) => intersectCircleLine(...e, ...t, o, n),
                ray: (e, t, r, o, n) => intersectCircleLine(...e, ...t, o, n),
                segment: (e, t, r, o, n) => intersectCircleLine(...e, ...t, o, n)
            },
            line: {
                polygon: (e, t, r, o, n) => intersectConvexPolygonLine(...t, ...e, includeS, r, n),
                circle: (e, t, r, o, n) => intersectCircleLine(...t, ...e, r, n),
                line: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n),
                ray: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n),
                segment: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n)
            },
            ray: {
                polygon: (e, t, r, o, n) => intersectConvexPolygonLine(...t, ...e, includeS, r, n),
                circle: (e, t, r, o, n) => intersectCircleLine(...t, ...e, r, n),
                line: (e, t, r, o, n) => intersectLineLine(...t, ...e, o, r, n),
                ray: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n),
                segment: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n)
            },
            segment: {
                polygon: (e, t, r, o, n) => intersectConvexPolygonLine(...t, ...e, includeS, r, n),
                circle: (e, t, r, o, n) => intersectCircleLine(...t, ...e, r, n),
                line: (e, t, r, o, n) => intersectLineLine(...t, ...e, o, r, n),
                ray: (e, t, r, o, n) => intersectLineLine(...t, ...e, o, r, n),
                segment: (e, t, r, o, n) => intersectLineLine(...e, ...t, r, o, n)
            }
        }
            , se = {
            polygon: "polygon",
            rect: "polygon",
            circle: "circle",
            line: "line",
            ray: "ray",
            segment: "segment"
        }
            , ce = {
            polygon: exclude,
            rect: exclude,
            circle: exclude,
            line: N,
            ray: F,
            segment: excludeS
        }
            , intersect$1 = function(e, t, r) {
            const o = typeOf(e)
                , n = typeOf(t)
                , s = se[o]
                , c = se[n]
                , i = oe[o](e)
                , a = oe[n](t)
                , l = e.domain_function || ce[o]
                , d = t.domain_function || ce[n];
            return ne[s][c](i, a, l, d, r)
        }
            , overlapConvexPolygons = (e, t, r=P) => {
            for (let o = 0; o < 2; o += 1) {
                const n = 0 === o ? e : t
                    , s = 0 === o ? t : e;
                for (let e = 0; e < n.length; e += 1) {
                    const t = n[e]
                        , o = rotate90(subtract(n[(e + 1) % n.length], n[e]))
                        , c = s.map((e => subtract(e, t))).map((e => dot(o, e)))
                        , i = n[(e + 2) % n.length]
                        , a = dot(o, subtract(i, t)) > 0;
                    if (c.map((e => a ? e < r : e > -r)).reduce(( (e, t) => e && t), !0))
                        return !1
                }
            }
            return !0
        }
            , overlapCirclePoint = (e, t, r, o=exclude, n=P) => o(e - distance2(t, r), n)
            , overlapLineLine = (e, t, r, o, n=N, s=N, c=P) => {
            const i = cross2(e, r)
                , a = -i
                , l = [o[0] - t[0], o[1] - t[1]];
            if (Math.abs(i) < c) {
                if (Math.abs(cross2(l, e)) > c)
                    return !1;
                const t = l
                    , o = add(t, r)
                    , n = dot(e, e)
                    , s = dot(t, e) / n
                    , i = dot(o, e) / n
                    , a = (s < i ? i : s) < c;
                return !((s < i ? s : i) > 1 - c) && !a
            }
            const d = [-l[0], -l[1]]
                , u = cross2(l, r) / i
                , p = cross2(d, e) / a;
            return n(u, c / magnitude(e)) && s(p, c / magnitude(r))
        }
            , ie = {
            polygon: e => [e],
            rect: e => [e],
            circle: e => [e.radius, e.origin],
            line: e => [e.vector, e.origin],
            ray: e => [e.vector, e.origin],
            segment: e => [e.vector, e.origin],
            vector: e => [e]
        }
            , ae = {
            polygon: {
                polygon: (e, t, r, o, n) => overlapConvexPolygons(...e, ...t, n),
                vector: (e, t, r, o, n) => overlapConvexPolygonPoint(...e, ...t, r, n)
            },
            circle: {
                vector: (e, t, r, o, n) => overlapCirclePoint(...e, ...t, exclude, n)
            },
            line: {
                line: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                ray: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                segment: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                vector: (e, t, r, o, n) => overlapLinePoint(...e, ...t, r, n)
            },
            ray: {
                line: (e, t, r, o, n) => overlapLineLine(...t, ...e, o, r, n),
                ray: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                segment: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                vector: (e, t, r, o, n) => overlapLinePoint(...e, ...t, r, n)
            },
            segment: {
                line: (e, t, r, o, n) => overlapLineLine(...t, ...e, o, r, n),
                ray: (e, t, r, o, n) => overlapLineLine(...t, ...e, o, r, n),
                segment: (e, t, r, o, n) => overlapLineLine(...e, ...t, r, o, n),
                vector: (e, t, r, o, n) => overlapLinePoint(...e, ...t, r, n)
            },
            vector: {
                polygon: (e, t, r, o, n) => overlapConvexPolygonPoint(...t, ...e, o, n),
                circle: (e, t, r, o, n) => overlapCirclePoint(...t, ...e, exclude, n),
                line: (e, t, r, o, n) => overlapLinePoint(...t, ...e, o, n),
                ray: (e, t, r, o, n) => overlapLinePoint(...t, ...e, o, n),
                segment: (e, t, r, o, n) => overlapLinePoint(...t, ...e, o, n),
                vector: (e, t, r, o, n) => fnEpsilonEqualVectors(...e, ...t, n)
            }
        }
            , le = {
            polygon: "polygon",
            rect: "polygon",
            circle: "circle",
            line: "line",
            ray: "ray",
            segment: "segment",
            vector: "vector"
        }
            , de = {
            polygon: exclude,
            rect: exclude,
            circle: exclude,
            line: N,
            ray: F,
            segment: excludeS,
            vector: N
        }
            , overlap$1 = function(e, t, r) {
            const o = typeOf(e)
                , n = typeOf(t)
                , s = le[o]
                , c = le[n]
                , i = ie[o](e)
                , a = ie[n](t)
                , l = e.domain_function || de[o]
                , d = t.domain_function || de[n];
            return ae[s][c](i, a, l, d, r)
        }
            , fe = {
            preserve: {
                magnitude: function() {
                    return magnitude(this)
                },
                isEquivalent: function() {
                    return fnEpsilonEqualVectors(this, getVector(arguments))
                },
                isParallel: function() {
                    return parallel(...resizeUp(this, getVector(arguments)))
                },
                isCollinear: function(e) {
                    return overlap$1(this, e)
                },
                dot: function() {
                    return dot(...resizeUp(this, getVector(arguments)))
                },
                distanceTo: function() {
                    return distance(...resizeUp(this, getVector(arguments)))
                },
                overlap: function(e) {
                    return overlap$1(this, e)
                }
            },
            vector: {
                copy: function() {
                    return [...this]
                },
                normalize: function() {
                    return normalize(this)
                },
                scale: function() {
                    return scale(this, arguments[0])
                },
                flip: function() {
                    return flip(this)
                },
                rotate90: function() {
                    return rotate90(this)
                },
                rotate270: function() {
                    return rotate270(this)
                },
                cross: function() {
                    return cross3(resize(3, this), resize(3, getVector(arguments)))
                },
                transform: function() {
                    return multiplyMatrix3Vector3(getMatrix3x4(arguments), resize(3, this))
                },
                add: function() {
                    return add(this, resize(this.length, getVector(arguments)))
                },
                subtract: function() {
                    return subtract(this, resize(this.length, getVector(arguments)))
                },
                rotateZ: function(e, t) {
                    return multiplyMatrix3Vector3(getMatrix3x4(makeMatrix2Rotate(e, t)), resize(3, this))
                },
                lerp: function(e, t) {
                    return lerp(this, resize(this.length, getVector(e)), t)
                },
                midpoint: function() {
                    return midpoint(...resizeUp(this, getVector(arguments)))
                },
                bisect: function() {
                    return counterClockwiseBisect2(this, getVector(arguments))
                }
            }
        }
            , ue = {};
        Object.keys(fe.preserve).forEach((e => {
                ue[e] = fe.preserve[e]
            }
        )),
            Object.keys(fe.vector).forEach((e => {
                    ue[e] = function() {
                        return j.vector(...fe.vector[e].apply(this, arguments))
                    }
                }
            ));
        const pe = {
            fromAngle: function(e) {
                return j.vector(Math.cos(e), Math.sin(e))
            },
            fromAngleDegrees: function(e) {
                return j.vector.fromAngle(e * S)
            }
        };
        var ge = {
            vector: {
                P: Array.prototype,
                A: function() {
                    this.push(...getVector(arguments))
                },
                G: {
                    x: function() {
                        return this[0]
                    },
                    y: function() {
                        return this[1]
                    },
                    z: function() {
                        return this[2]
                    }
                },
                M: ue,
                S: pe
            }
        }
            , me = {
            fromPoints: function() {
                const e = getVectorOfVectors(arguments);
                return this.constructor({
                    vector: subtract(e[1], e[0]),
                    origin: e[0]
                })
            },
            fromAngle: function() {
                const e = arguments[0] || 0;
                return this.constructor({
                    vector: [Math.cos(e), Math.sin(e)],
                    origin: [0, 0]
                })
            },
            perpendicularBisector: function() {
                const e = getVectorOfVectors(arguments);
                return this.constructor({
                    vector: rotate90(subtract(e[1], e[0])),
                    origin: average(e[0], e[1])
                })
            }
        };
        const he = {
            isParallel: function() {
                const e = resizeUp(this.vector, getLine$1(arguments).vector);
                return parallel(...e)
            },
            isCollinear: function() {
                const e = getLine$1(arguments);
                return overlapLinePoint(this.vector, this.origin, e.origin) && parallel(...resizeUp(this.vector, e.vector))
            },
            isDegenerate: function(e=P) {
                return degenerate(this.vector, e)
            },
            reflectionMatrix: function() {
                return j.matrix(makeMatrix3ReflectZ(this.vector, this.origin))
            },
            nearestPoint: function() {
                const e = getVector(arguments);
                return j.vector(nearestPointOnLine(this.vector, this.origin, e, this.clip_function))
            },
            transform: function() {
                const e = this.dimension
                    , t = multiplyMatrix3Line3(getMatrix3x4(arguments), resize(3, this.vector), resize(3, this.origin));
                return this.constructor(resize(e, t.vector), resize(e, t.origin))
            },
            translate: function() {
                const e = add(...resizeUp(this.origin, getVector(arguments)));
                return this.constructor(this.vector, e)
            },
            intersect: function() {
                return intersect$1(this, ...arguments)
            },
            overlap: function() {
                return overlap$1(this, ...arguments)
            },
            bisect: function(e, t) {
                const r = getLine$1(e);
                return bisectLines2(this.vector, this.origin, r.vector, r.origin, t).map((e => this.constructor(e)))
            }
        };
        var ve = {
            line: {
                P: Object.prototype,
                A: function() {
                    const e = getLine$1(...arguments);
                    this.vector = j.vector(e.vector),
                        this.origin = j.vector(resize(this.vector.length, e.origin));
                    const t = rayLineToUniqueLine({
                        vector: this.vector,
                        origin: this.origin
                    });
                    this.normal = t.normal,
                        this.distance = t.distance,
                        Object.defineProperty(this, "domain_function", {
                            writable: !0,
                            value: $
                        })
                },
                G: {
                    dimension: function() {
                        return [this.vector, this.origin].map((e => e.length)).reduce(( (e, t) => Math.max(e, t)), 0)
                    }
                },
                M: Object.assign({}, he, {
                    inclusive: function() {
                        return this.domain_function = $,
                            this
                    },
                    exclusive: function() {
                        return this.domain_function = N,
                            this
                    },
                    clip_function: e => e,
                    svgPath: function(e=2e4) {
                        const t = add(this.origin, scale(this.vector, -e / 2))
                            , r = scale(this.vector, e);
                        return `M${t[0]} ${t[1]}l${r[0]} ${r[1]}`
                    }
                }),
                S: Object.assign({
                    fromNormalDistance: function() {
                        return this.constructor(uniqueLineToRayLine(arguments[0]))
                    }
                }, me)
            }
        }
            , _e = {
            ray: {
                P: Object.prototype,
                A: function() {
                    const e = getLine$1(...arguments);
                    this.vector = j.vector(e.vector),
                        this.origin = j.vector(resize(this.vector.length, e.origin)),
                        Object.defineProperty(this, "domain_function", {
                            writable: !0,
                            value: z
                        })
                },
                G: {
                    dimension: function() {
                        return [this.vector, this.origin].map((e => e.length)).reduce(( (e, t) => Math.max(e, t)), 0)
                    }
                },
                M: Object.assign({}, he, {
                    inclusive: function() {
                        return this.domain_function = z,
                            this
                    },
                    exclusive: function() {
                        return this.domain_function = F,
                            this
                    },
                    flip: function() {
                        return j.ray(flip(this.vector), this.origin)
                    },
                    scale: function(e) {
                        return j.ray(this.vector.scale(e), this.origin)
                    },
                    normalize: function() {
                        return j.ray(this.vector.normalize(), this.origin)
                    },
                    clip_function: rayLimiter,
                    svgPath: function(e=1e4) {
                        const t = this.vector.scale(e);
                        return `M${this.origin[0]} ${this.origin[1]}l${t[0]} ${t[1]}`
                    }
                }),
                S: me
            }
        }
            , ye = {
            segment: {
                P: Array.prototype,
                A: function() {
                    const e = getSegment(...arguments);
                    this.push(...[e[0], e[1]].map((e => j.vector(e)))),
                        this.vector = j.vector(subtract(this[1], this[0])),
                        this.origin = this[0],
                        Object.defineProperty(this, "domain_function", {
                            writable: !0,
                            value: includeS
                        })
                },
                G: {
                    points: function() {
                        return this
                    },
                    magnitude: function() {
                        return magnitude(this.vector)
                    },
                    dimension: function() {
                        return [this.vector, this.origin].map((e => e.length)).reduce(( (e, t) => Math.max(e, t)), 0)
                    }
                },
                M: Object.assign({}, he, {
                    inclusive: function() {
                        return this.domain_function = includeS,
                            this
                    },
                    exclusive: function() {
                        return this.domain_function = excludeS,
                            this
                    },
                    clip_function: segmentLimiter,
                    transform: function(...e) {
                        const t = this.points[0].length
                            , r = getMatrix3x4(e)
                            , o = this.points.map((e => resize(3, e))).map((e => multiplyMatrix3Vector3(r, e))).map((e => resize(t, e)));
                        return j.segment(o)
                    },
                    translate: function() {
                        const e = getVector(arguments)
                            , t = this.points.map((t => add(...resizeUp(t, e))));
                        return j.segment(t)
                    },
                    midpoint: function() {
                        return j.vector(average(this.points[0], this.points[1]))
                    },
                    svgPath: function() {
                        const e = this.points.map((e => `${e[0]} ${e[1]}`));
                        return ["M", "L"].map(( (t, r) => `${t}${e[r]}`)).join("")
                    }
                }),
                S: {
                    fromPoints: function() {
                        return this.constructor(...arguments)
                    }
                }
            }
        };
        const pointOnEllipse = function(e, t, r, o, n, s) {
            const c = Math.cos(n)
                , i = Math.sin(n)
                , a = Math.cos(s)
                , l = Math.sin(s);
            return [e + c * r * a + -i * o * l, t + i * r * a + c * o * l]
        }
            , pathInfo = function(e, t, r, o, n, s, c) {
            let i = s;
            if (i < 0 && !Number.isNaN(i))
                for (; i < 0; )
                    i += 2 * Math.PI;
            const a = c > 2 * Math.PI ? 2 * Math.PI : c
                , l = pointOnEllipse(e, t, r, o, n, i)
                , d = pointOnEllipse(e, t, r, o, n, i + a / 2)
                , u = pointOnEllipse(e, t, r, o, n, i + a)
                , p = a / 2 > Math.PI ? 1 : 0
                , g = a / 2 > 0 ? 1 : 0;
            return {
                x1: l[0],
                y1: l[1],
                x2: d[0],
                y2: d[1],
                x3: u[0],
                y3: u[1],
                fa: p,
                fs: g
            }
        }
            , cln = e => cleanNumber(e, 4)
            , ellipticalArcTo = (e, t, r, o, n, s, c) => `A${cln(e)} ${cln(t)} ${cln(r)} ${cln(o)} ${cln(n)} ${cln(s)} ${cln(c)}`;
        var be = {
            circle: {
                A: function() {
                    const e = getCircle(...arguments);
                    this.radius = e.radius,
                        this.origin = j.vector(...e.origin)
                },
                G: {
                    x: function() {
                        return this.origin[0]
                    },
                    y: function() {
                        return this.origin[1]
                    },
                    z: function() {
                        return this.origin[2]
                    }
                },
                M: {
                    nearestPoint: function() {
                        return j.vector(nearestPointOnCircle(this.radius, this.origin, getVector(arguments)))
                    },
                    intersect: function(e) {
                        return intersect$1(this, e)
                    },
                    overlap: function(e) {
                        return overlap$1(this, e)
                    },
                    svgPath: function(e=0, t=2 * Math.PI) {
                        const r = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, e, t)
                            , o = ellipticalArcTo(this.radius, this.radius, 0, r.fa, r.fs, r.x2, r.y2)
                            , n = ellipticalArcTo(this.radius, this.radius, 0, r.fa, r.fs, r.x3, r.y3);
                        return `M${r.x1} ${r.y1}${o}${n}`
                    },
                    points: function(e=128) {
                        return Array.from(Array(e)).map(( (t, r) => 2 * Math.PI / e * r)).map((e => [this.origin[0] + this.radius * Math.cos(e), this.origin[1] + this.radius * Math.sin(e)]))
                    },
                    polygon: function() {
                        return j.polygon(this.points(arguments[0]))
                    },
                    segments: function() {
                        const e = this.points(arguments[0]);
                        return e.map(( (t, r) => {
                                const o = (r + 1) % e.length;
                                return [t, e[o]]
                            }
                        ))
                    }
                },
                S: {
                    fromPoints: function() {
                        if (3 === arguments.length) {
                            const e = circumcircle(...arguments);
                            return this.constructor(e.radius, e.origin)
                        }
                        return this.constructor(...arguments)
                    },
                    fromThreePoints: function() {
                        const e = circumcircle(...arguments);
                        return this.constructor(e.radius, e.origin)
                    }
                }
            }
        };
        const getFoci = function(e, t, r, o) {
            const n = t > r
                , s = n ? t ** 2 - r ** 2 : r ** 2 - t ** 2
                , c = Math.sqrt(s)
                , i = n ? Math.cos(o) : Math.sin(o)
                , a = n ? Math.sin(o) : Math.cos(o);
            return [j.vector(e[0] + c * i, e[1] + c * a), j.vector(e[0] - c * i, e[1] - c * a)]
        };
        var Ee = {
            ellipse: {
                A: function() {
                    const e = flattenArrays(arguments).filter((e => !Number.isNaN(e)))
                        , t = resize(5, e);
                    this.rx = t[0],
                        this.ry = t[1],
                        this.origin = j.vector(t[2], t[3]),
                        this.spin = t[4],
                        this.foci = getFoci(this.origin, this.rx, this.ry, this.spin)
                },
                G: {
                    x: function() {
                        return this.origin[0]
                    },
                    y: function() {
                        return this.origin[1]
                    }
                },
                M: {
                    svgPath: function(e=0, t=2 * Math.PI) {
                        const r = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, e, t)
                            , o = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, r.fa, r.fs, r.x2, r.y2)
                            , n = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, r.fa, r.fs, r.x3, r.y3);
                        return `M${r.x1} ${r.y1}${o}${n}`
                    },
                    points: function(e=128) {
                        return Array.from(Array(e)).map(( (t, r) => 2 * Math.PI / e * r)).map((e => pointOnEllipse(this.origin.x, this.origin.y, this.rx, this.ry, this.spin, e)))
                    },
                    polygon: function() {
                        return j.polygon(this.points(arguments[0]))
                    },
                    segments: function() {
                        const e = this.points(arguments[0]);
                        return e.map(( (t, r) => {
                                const o = (r + 1) % e.length;
                                return [t, e[o]]
                            }
                        ))
                    }
                },
                S: {}
            }
        };
        const xe = {
            area: function() {
                return signedArea(this)
            },
            centroid: function() {
                return j.vector(centroid(this))
            },
            boundingBox: function() {
                return boundingBox(this)
            },
            straightSkeleton: function() {
                return straightSkeleton(this)
            },
            scale: function(e, t=centroid(this)) {
                const r = this.map((e => [0, 1].map(( (r, o) => e[o] - t[o])))).map((r => r.map(( (o, n) => t[n] + r[n] * e))));
                return this.constructor.fromPoints(r)
            },
            rotate: function(e, t=centroid(this)) {
                const r = this.map((r => {
                        const o = [r[0] - t[0], r[1] - t[1]]
                            , n = Math.sqrt(o[0] ** 2 + o[1] ** 2)
                            , s = Math.atan2(o[1], o[0]);
                        return [t[0] + Math.cos(s + e) * n, t[1] + Math.sin(s + e) * n]
                    }
                ));
                return j.polygon(r)
            },
            translate: function() {
                const e = getVector(...arguments)
                    , t = this.map((t => t.map(( (t, r) => t + e[r]))));
                return this.constructor.fromPoints(t)
            },
            transform: function() {
                const e = getMatrix3x4(...arguments)
                    , t = this.map((t => multiplyMatrix3Vector3(e, resize(3, t))));
                return j.polygon(t)
            },
            nearest: function() {
                const e = getVector(...arguments)
                    , t = nearestPointOnPolygon(this, e);
                return void 0 === t ? void 0 : Object.assign(t, {
                    edge: this.sides[t.i]
                })
            },
            split: function() {
                const e = getLine$1(...arguments)
                    , t = splitConvexPolygon;
                return t(this, e.vector, e.origin).map((e => j.polygon(e)))
            },
            overlap: function() {
                return overlap$1(this, ...arguments)
            },
            intersect: function() {
                return intersect$1(this, ...arguments)
            },
            clip: function(e, t) {
                const r = e.domain_function ? e.domain_function : $
                    , o = clipLineConvexPolygon(this, e.vector, e.origin, this.domain_function, r, t);
                return o ? j.segment(o) : void 0
            },
            svgPath: function() {
                const e = Array(this.length).fill("L");
                return e[0] = "M",
                    `${this.map(( (t, r) => `${e[r]}${t[0]} ${t[1]}`)).join("")}z`
            }
        }
            , rectToPoints = e => [[e.x, e.y], [e.x + e.width, e.y], [e.x + e.width, e.y + e.height], [e.x, e.y + e.height]];
        var Oe = {
            rect: {
                P: Array.prototype,
                A: function() {
                    const e = getRect(...arguments);
                    this.width = e.width,
                        this.height = e.height,
                        this.origin = j.vector(e.x, e.y),
                        this.push(...rectToPoints(this)),
                        Object.defineProperty(this, "domain_function", {
                            writable: !0,
                            value: include
                        })
                },
                G: {
                    x: function() {
                        return this.origin[0]
                    },
                    y: function() {
                        return this.origin[1]
                    },
                    center: function() {
                        return j.vector(this.origin[0] + this.width / 2, this.origin[1] + this.height / 2)
                    }
                },
                M: Object.assign({}, xe, {
                    inclusive: function() {
                        return this.domain_function = include,
                            this
                    },
                    exclusive: function() {
                        return this.domain_function = exclude,
                            this
                    },
                    area: function() {
                        return this.width * this.height
                    },
                    segments: function() {
                        return [[[(e = this).x, e.y], [e.x + e.width, e.y]], [[e.x + e.width, e.y], [e.x + e.width, e.y + e.height]], [[e.x + e.width, e.y + e.height], [e.x, e.y + e.height]], [[e.x, e.y + e.height], [e.x, e.y]]];
                        var e
                    },
                    svgPath: function() {
                        return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`
                    }
                }),
                S: {
                    fromPoints: function() {
                        const e = boundingBox(getVectorOfVectors(arguments));
                        return j.rect(e.min[0], e.min[1], e.span[0], e.span[1])
                    }
                }
            }
        }
            , ke = {
            polygon: {
                P: Array.prototype,
                A: function() {
                    this.push(...semiFlattenArrays(arguments)),
                        this.sides = this.map(( (e, t, r) => [e, r[(t + 1) % r.length]])),
                        this.vectors = this.sides.map((e => subtract(e[1], e[0]))),
                        Object.defineProperty(this, "domain_function", {
                            writable: !0,
                            value: include
                        })
                },
                G: {
                    isConvex: function() {},
                    points: function() {
                        return this
                    }
                },
                M: Object.assign({}, xe, {
                    inclusive: function() {
                        return this.domain_function = include,
                            this
                    },
                    exclusive: function() {
                        return this.domain_function = exclude,
                            this
                    },
                    segments: function() {
                        return this.sides
                    }
                }),
                S: {
                    fromPoints: function() {
                        return this.constructor(...arguments)
                    },
                    regularPolygon: function() {
                        return this.constructor(makePolygonCircumradius(...arguments))
                    },
                    convexHull: function() {
                        return this.constructor(convexHull(...arguments))
                    }
                }
            }
        }
            , Ae = {
            polyline: {
                P: Array.prototype,
                A: function() {
                    this.push(...semiFlattenArrays(arguments))
                },
                G: {
                    points: function() {
                        return this
                    }
                },
                M: {
                    svgPath: function() {
                        const e = Array(this.length).fill("L");
                        return e[0] = "M",
                            `${this.map(( (t, r) => `${e[r]}${t[0]} ${t[1]}`)).join("")}`
                    }
                },
                S: {
                    fromPoints: function() {
                        return this.constructor(...arguments)
                    }
                }
            }
        };
        const array_assign = (e, t) => {
                for (let r = 0; r < 12; r += 1)
                    e[r] = t[r];
                return e
            }
        ;
        var Me = {
            matrix: {
                P: Array.prototype,
                A: function() {
                    getMatrix3x4(arguments).forEach((e => this.push(e)))
                },
                G: {},
                M: {
                    copy: function() {
                        return j.matrix(...Array.from(this))
                    },
                    set: function() {
                        return array_assign(this, getMatrix3x4(arguments))
                    },
                    isIdentity: function() {
                        return isIdentity3x4(this)
                    },
                    multiply: function(e) {
                        return array_assign(this, multiplyMatrices3(this, e))
                    },
                    determinant: function() {
                        return determinant3(this)
                    },
                    inverse: function() {
                        return array_assign(this, invertMatrix3(this))
                    },
                    translate: function(e, t, r) {
                        return array_assign(this, multiplyMatrices3(this, makeMatrix3Translate(e, t, r)))
                    },
                    rotateX: function(e) {
                        return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateX(e)))
                    },
                    rotateY: function(e) {
                        return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateY(e)))
                    },
                    rotateZ: function(e) {
                        return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateZ(e)))
                    },
                    rotate: function(e, t, r) {
                        const o = makeMatrix3Rotate(e, t, r);
                        return array_assign(this, multiplyMatrices3(this, o))
                    },
                    scale: function(e) {
                        return array_assign(this, multiplyMatrices3(this, makeMatrix3Scale(e)))
                    },
                    reflectZ: function(e, t) {
                        const r = makeMatrix3ReflectZ(e, t);
                        return array_assign(this, multiplyMatrices3(this, r))
                    },
                    transform: function(...e) {
                        return j.vector(multiplyMatrix3Vector3(this, resize(3, getVector(e))))
                    },
                    transformVector: function(e) {
                        return j.vector(multiplyMatrix3Vector3(this, resize(3, getVector(e))))
                    },
                    transformLine: function(...e) {
                        const t = getLine$1(e);
                        return j.line(multiplyMatrix3Line3(this, t.vector, t.origin))
                    }
                },
                S: {}
            }
        };
        const je = Object.assign({}, ge, ve, _e, ye, be, Ee, Oe, ke, Ae, Me)
            , create = function(e, t) {
            const r = Object.create(je[e].proto);
            return je[e].A.apply(r, t),
                r
        };
        Object.assign(j, {
            vector: function() {
                return create("vector", arguments)
            },
            line: function() {
                return create("line", arguments)
            },
            ray: function() {
                return create("ray", arguments)
            },
            segment: function() {
                return create("segment", arguments)
            },
            circle: function() {
                return create("circle", arguments)
            },
            ellipse: function() {
                return create("ellipse", arguments)
            },
            rect: function() {
                return create("rect", arguments)
            },
            polygon: function() {
                return create("polygon", arguments)
            },
            polyline: function() {
                return create("polyline", arguments)
            },
            matrix: function() {
                return create("matrix", arguments)
            }
        }),
            Object.keys(je).forEach((e => {
                    const t = {};
                    t.prototype = null != je[e].P ? Object.create(je[e].P) : Object.create(Object.prototype),
                        t.prototype.constructor = t,
                        j[e].prototype = t.prototype,
                        j[e].prototype.constructor = j[e],
                        Object.keys(je[e].G).forEach((r => Object.defineProperty(t.prototype, r, {
                            get: je[e].G[r]
                        }))),
                        Object.keys(je[e].M).forEach((r => Object.defineProperty(t.prototype, r, {
                            value: je[e].M[r]
                        }))),
                        Object.keys(je[e].S).forEach((t => Object.defineProperty(j[e], t, {
                            value: je[e].S[t].bind(j[e].prototype)
                        }))),
                        je[e].proto = t.prototype
                }
            ));
        const Pe = j;
        Pe.core = Object.assign(Object.create(null), C, M, U, I, V, Z, Y, K, Q, ee, Y, X, q, W, D, te, re, {
            intersectConvexPolygonLine: intersectConvexPolygonLine,
            intersectCircleCircle: intersectCircleCircle,
            intersectCircleLine: intersectCircleLine,
            intersectLineLine: intersectLineLine,
            overlapConvexPolygons: overlapConvexPolygons,
            overlapConvexPolygonPoint: overlapConvexPolygonPoint,
            overlapBoundingBoxes: (e, t) => {
                const r = Math.min(e.min.length, t.min.length);
                for (let o = 0; o < r; o += 1)
                    if (e.min[o] > t.max[o] || e.max[o] < t.min[o])
                        return !1;
                return !0
            }
            ,
            overlapLineLine: overlapLineLine,
            overlapLinePoint: overlapLinePoint,
            clipLineConvexPolygon: clipLineConvexPolygon,
            clipPolygonPolygon: (e, t, r=P) => {
                let o, n, s, c;
                const inside = e => (n[0] - o[0]) * (e[1] - o[1]) > (n[1] - o[1]) * (e[0] - o[0]) + r
                    , intersection = () => {
                        const e = [o[0] - n[0], o[1] - n[1]]
                            , t = [s[0] - c[0], s[1] - c[1]]
                            , r = o[0] * n[1] - o[1] * n[0]
                            , i = s[0] * c[1] - s[1] * c[0]
                            , a = 1 / (e[0] * t[1] - e[1] * t[0]);
                        return [(r * t[0] - i * e[0]) * a, (r * t[1] - i * e[1]) * a]
                    }
                ;
                let i = e;
                o = t[t.length - 1];
                for (let e in t) {
                    n = t[e];
                    const r = i;
                    i = [],
                        s = r[r.length - 1];
                    for (let e in r)
                        c = r[e],
                            inside(c) ? (inside(s) || i.push(intersection()),
                                i.push(c)) : inside(s) && i.push(intersection()),
                            s = c;
                    o = n
                }
                return 0 === i.length ? void 0 : i
            }
            ,
            splitConvexPolygon: splitConvexPolygon,
            straightSkeleton: straightSkeleton
        }),
            Pe.typeof = typeOf,
            Pe.intersect = intersect$1,
            Pe.overlap = overlap$1;
        const vertex_degree = function(e, t) {
            const r = this;
            Object.defineProperty(e, "degree", {
                get: () => r.vertices_vertices && r.vertices_vertices[t] ? r.vertices_vertices[t].length : null
            })
        }
            , edge_coords = function(e, t) {
            const r = this;
            Object.defineProperty(e, "coords", {
                get: () => {
                    if (r.edges_vertices && r.edges_vertices[t] && r.vertices_coords)
                        return r.edges_vertices[t].map((e => r.vertices_coords[e]))
                }
            })
        }
            , face_simple = function(e, t) {
            const r = this;
            Object.defineProperty(e, "simple", {
                get: () => {
                    if (!r.faces_vertices || !r.faces_vertices[t])
                        return null;
                    for (let o = 0; o < e.length - 1; o += 1)
                        for (let n = o + 1; n < e.length; n += 1)
                            if (r.faces_vertices[t][o] === r.faces_vertices[t][n])
                                return !1;
                    return !0
                }
            })
        }
            , face_coords = function(e, t) {
            const r = this;
            Object.defineProperty(e, "coords", {
                get: () => {
                    if (r.faces_vertices && r.faces_vertices[t] && r.vertices_coords)
                        return r.faces_vertices[t].map((e => r.vertices_coords[e]))
                }
            })
        };
        var we = {
            vertices: function(e, t) {
                return vertex_degree.call(this, e, t),
                    e
            },
            edges: function(e, t) {
                return edge_coords.call(this, e, t),
                    e
            },
            faces: function(e, t) {
                return face_simple.call(this, e, t),
                    face_coords.call(this, e, t),
                    e
            }
        };
        const Se = "Rabbit Ear"
            , Le = {
            file: ["file_spec", "file_creator", "file_author", "file_title", "file_description", "file_classes", "file_frames"],
            frame: ["frame_author", "frame_title", "frame_description", "frame_attributes", "frame_classes", "frame_unit", "frame_parent", "frame_inherit"],
            graph: ["vertices_coords", "vertices_vertices", "vertices_faces", "edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length", "faces_vertices", "faces_edges", "vertices_edges", "edges_edges", "faces_faces"],
            orders: ["edgeOrders", "faceOrders"]
        }
            , Ce = Object.freeze([].concat(Le.file).concat(Le.frame).concat(Le.graph).concat(Le.orders))
            , $e = Object.freeze(["edges_vector", "vertices_sectors", "faces_sectors", "faces_matrix"])
            , Ne = Array.from("MmVvBbFfUu")
            , ze = {
            vertices: "vertex",
            edges: "edge",
            faces: "face"
        }
            , Fe = {
            b: "boundary",
            m: "mountain",
            v: "valley",
            f: "flat",
            u: "unassigned"
        };
        Ne.forEach((e => {
                Fe[e.toUpperCase()] = Fe[e]
            }
        ));
        const Ie = {
            M: -180,
            m: -180,
            V: 180,
            v: 180,
            B: 0,
            b: 0,
            F: 0,
            f: 0,
            U: 0,
            u: 0
        }
            , edgeAssignmentToFoldAngle = e => Ie[e] || 0
            , edgeFoldAngleToAssignment = e => e > Pe.core.EPSILON ? "V" : e < -Pe.core.EPSILON ? "M" : "U"
            , edgeFoldAngleIsFlat = e => Pe.core.fnEpsilonEqual(0, e) || Pe.core.fnEpsilonEqual(-180, e) || Pe.core.fnEpsilonEqual(180, e)
            , edgesFoldAngleAreAllFlat = ({edges_foldAngle: e}) => {
            if (!e)
                return !0;
            for (let t = 0; t < e.length; t += 1)
                if (!edgeFoldAngleIsFlat(e[t]))
                    return !1;
            return !0
        }
            , filterKeysWithSuffix = (e, t) => Object.keys(e).map((e => e.substring(e.length - t.length, e.length) === t ? e : void 0)).filter((e => void 0 !== e))
            , filterKeysWithPrefix = (e, t) => Object.keys(e).map((e => e.substring(0, t.length) === t ? e : void 0)).filter((e => void 0 !== e))
            , getGraphKeysWithPrefix = (e, t) => filterKeysWithPrefix(e, `${t}_`)
            , getGraphKeysWithSuffix = (e, t) => filterKeysWithSuffix(e, `_${t}`)
            , transposeGraphArrays = (e, t) => {
            const r = getGraphKeysWithPrefix(e, t);
            if (0 === r.length)
                return [];
            const o = Math.max(...r.map((t => e[t].length)))
                , n = Array.from(Array(o)).map(( () => ({})));
            return r.forEach((t => n.forEach(( (r, o) => {
                    n[o][t] = e[t][o]
                }
            )))),
                n
        }
            , isFoldObject = (e={}) => 0 === Object.keys(e).length ? 0 : [].concat(Ce, $e).filter((t => e[t])).length / Object.keys(e).length;
        var Ve = Object.freeze({
            __proto__: null,
            singularize: ze,
            pluralize: {
                vertex: "vertices",
                edge: "edges",
                face: "faces"
            },
            edgesAssignmentNames: Fe,
            edgesAssignmentDegrees: Ie,
            edgeAssignmentToFoldAngle: edgeAssignmentToFoldAngle,
            edgeFoldAngleToAssignment: edgeFoldAngleToAssignment,
            edgeFoldAngleIsFlat: edgeFoldAngleIsFlat,
            edgesFoldAngleAreAllFlat: edgesFoldAngleAreAllFlat,
            filterKeysWithSuffix: filterKeysWithSuffix,
            filterKeysWithPrefix: filterKeysWithPrefix,
            getGraphKeysWithPrefix: getGraphKeysWithPrefix,
            getGraphKeysWithSuffix: getGraphKeysWithSuffix,
            transposeGraphArrays: transposeGraphArrays,
            transposeGraphArrayAtIndex: function(e, t, r) {
                const o = getGraphKeysWithPrefix(e, t);
                if (0 === o.length)
                    return;
                const n = {};
                return o.forEach((t => {
                        n[t] = e[t][r]
                    }
                )),
                    n
            },
            isFoldObject: isFoldObject
        });
        const are_vertices_equivalent = (e, t, r=Pe.core.EPSILON) => {
            const o = e.length;
            for (let n = 0; n < o; n += 1)
                if (Math.abs(e[n] - t[n]) > r)
                    return !1;
            return !0
        }
            , getVerticesClusters = ({vertices_coords: e}, t=Pe.core.EPSILON) => {
            if (!e)
                return [];
            const r = e.map(( () => []));
            for (let o = 0; o < e.length - 1; o += 1)
                for (let n = o + 1; n < e.length; n += 1)
                    r[o][n] = are_vertices_equivalent(e[o], e[n], t);
            const o = r.map((e => e.map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e))))
                , n = []
                , s = Array(e.length).fill(!1);
            let c = 0;
            const recurse = (t, r) => {
                    if (!s[r] && c !== e.length)
                        for (s[r] = !0,
                                 c += 1,
                             n[t] || (n[t] = []),
                                 n[t].push(r); o[r].length > 0; )
                            recurse(t, o[r][0]),
                                o[r].splice(0, 1)
                }
            ;
            for (let t = 0; t < e.length && (recurse(t, t),
            c !== e.length); t += 1)
                ;
            return n.filter((e => e.length))
        }
            , max_arrays_length = (...e) => Math.max(0, ...e.filter((e => void 0 !== e)).map((e => e.length)))
            , count = (e, t) => max_arrays_length(...getGraphKeysWithPrefix(e, t).map((t => e[t])));
        count.vertices = ({vertices_coords: e, vertices_faces: t, vertices_vertices: r}) => max_arrays_length(e, t, r),
            count.edges = ({edges_vertices: e, edges_edges: t, edges_faces: r}) => max_arrays_length(e, t, r),
            count.faces = ({faces_vertices: e, faces_edges: t, faces_faces: r}) => max_arrays_length(e, t, r);
        const uniqueIntegers = e => {
                const t = {};
                return e.forEach((e => {
                        t[e] = !0
                    }
                )),
                    Object.keys(t).map((e => parseInt(e, 10)))
            }
            , uniqueSortedIntegers = e => uniqueIntegers(e).sort(( (e, t) => e - t))
            , splitCircularArray = (e, t) => (t.sort(( (e, t) => e - t)),
                [e.slice(t[1]).concat(e.slice(0, t[0] + 1)), e.slice(t[0], t[1] + 1)])
            , removeSingleInstances = e => {
                const t = {};
                return e.forEach((e => {
                        void 0 === t[e] && (t[e] = 0),
                            t[e] += 1
                    }
                )),
                    e.filter((e => t[e] > 1))
            }
            , booleanMatrixToIndexedArray = e => e.map((e => e.map(( (e, t) => !0 === e ? t : void 0)).filter((e => void 0 !== e))))
            , booleanMatrixToUniqueIndexPairs = e => {
                const t = [];
                for (let r = 0; r < e.length - 1; r += 1)
                    for (let o = r + 1; o < e.length; o += 1)
                        e[r][o] && t.push([r, o]);
                return t
            }
        ;
        var Be = Object.freeze({
            __proto__: null,
            uniqueIntegers: uniqueIntegers,
            uniqueSortedIntegers: uniqueSortedIntegers,
            splitCircularArray: splitCircularArray,
            getLongestArray: e => {
                if (1 === e.length)
                    return e[0];
                const t = e.map((e => e.length));
                let r = 0;
                for (let o = 0; o < e.length; o += 1)
                    t[o] > t[r] && (r = o);
                return e[r]
            }
            ,
            removeSingleInstances: removeSingleInstances,
            booleanMatrixToIndexedArray: booleanMatrixToIndexedArray,
            booleanMatrixToUniqueIndexPairs: booleanMatrixToUniqueIndexPairs,
            makeSelfRelationalArrayClusters: e => {
                const t = []
                    , recurse = (r, o) => void 0 !== t[r] ? 0 : (t[r] = o,
                    e[r].forEach((e => recurse(e, o))),
                    1);
                for (let t = 0, r = 0; t < e.length; t += 1)
                    t in e && (r += recurse(t, r));
                return t
            }
            ,
            circularArrayValidRanges: e => {
                const t = e.map((e => void 0 !== e));
                if (t.reduce(( (e, t) => e && t), !0))
                    return [[0, e.length - 1]];
                const r = t.map(( (e, t, r) => e && !r[(t - 1 + r.length) % r.length]))
                    , o = r.reduce(( (e, t) => e + (t ? 1 : 0)), 0)
                    , n = Array(o)
                    , s = Array(o).fill(0);
                let c = t[0] && t[e.length - 1] ? 0 : o - 1;
                return t.forEach(( (e, o) => {
                        c = (c + (r[o] ? 1 : 0)) % s.length,
                            s[c] += t[o] ? 1 : 0,
                        r[o] && (n[c] = o)
                    }
                )),
                    n.map(( (t, r) => [t, (t + s[r] - 1) % e.length]))
            }
        });
        const removeGeometryIndices = (e, t, r) => {
                const o = count(e, t)
                    , n = uniqueSortedIntegers(r)
                    , s = [];
                let c, i, a;
                for (c = 0,
                         i = 0,
                         a = 0; c < o; c += 1,
                         i += 1) {
                    for (; c === n[a]; )
                        s[c] = void 0,
                            c += 1,
                            a += 1;
                    c < o && (s[c] = i)
                }
                return getGraphKeysWithSuffix(e, t).forEach((t => e[t].forEach(( (r, o) => e[t][o].forEach(( (r, n) => {
                        e[t][o][n] = s[r]
                    }
                )))))),
                    n.reverse(),
                    getGraphKeysWithPrefix(e, t).forEach((t => n.forEach((r => e[t].splice(r, 1))))),
                    s
            }
            , replaceGeometryIndices = (e, t, r) => {
                const o = count(e, t)
                    , n = Object.keys(r).map((e => parseInt(e, 10)))
                    , s = uniqueSortedIntegers(n)
                    , c = [];
                let i, a, l;
                for (i = 0,
                         a = 0,
                         l = 0; i < o; i += 1,
                         a += 1) {
                    for (; i === s[l]; )
                        c[i] = c[r[s[l]]],
                        void 0 === c[i] && console.log("replace() found an undefined", c),
                            i += 1,
                            l += 1;
                    i < o && (c[i] = a)
                }
                return getGraphKeysWithSuffix(e, t).forEach((t => e[t].forEach(( (r, o) => e[t][o].forEach(( (r, n) => {
                        e[t][o][n] = c[r]
                    }
                )))))),
                    s.reverse(),
                    getGraphKeysWithPrefix(e, t).forEach((t => s.forEach((r => e[t].splice(r, 1))))),
                    c
            }
            , getDuplicateVertices = (e, t) => getVerticesClusters(e, t).filter((e => e.length > 1))
            , getIsolatedVertices = ({vertices_coords: e, edges_vertices: t, faces_vertices: r}) => {
                if (!e)
                    return [];
                let o = e.length;
                const n = Array(o).fill(!1);
                return t && t.forEach((e => {
                        e.filter((e => !n[e])).forEach((e => {
                                n[e] = !0,
                                    o -= 1
                            }
                        ))
                    }
                )),
                r && r.forEach((e => {
                        e.filter((e => !n[e])).forEach((e => {
                                n[e] = !0,
                                    o -= 1
                            }
                        ))
                    }
                )),
                    n.map(( (e, t) => e ? void 0 : t)).filter((e => void 0 !== e))
            }
            , removeIsolatedVertices = (e, t) => (t || (t = getIsolatedVertices(e)),
                {
                    map: removeGeometryIndices(e, n, t),
                    remove: t
                })
            , removeDuplicateVertices = (e, t=Pe.core.EPSILON) => {
                const r = []
                    , o = []
                    , s = getVerticesClusters(e, t).filter((e => e.length > 1));
                return s.forEach((e => {
                        for (let t = 1; t < e.length; t += 1)
                            r[e[t]] = e[0],
                                o.push(e[t])
                    }
                )),
                    s.map((t => t.map((t => e.vertices_coords[t])))).map((e => Pe.core.average(...e))).forEach(( (t, r) => {
                            e.vertices_coords[s[r][0]] = t
                        }
                    )),
                    {
                        map: replaceGeometryIndices(e, n, r),
                        remove: o
                    }
            }
        ;
        var Te = Object.freeze({
            __proto__: null,
            getDuplicateVertices: getDuplicateVertices,
            getEdgeIsolatedVertices: ({vertices_coords: e, edges_vertices: t}) => {
                if (!e || !t)
                    return [];
                let r = e.length;
                const o = Array(r).fill(!1);
                return t.forEach((e => {
                        e.filter((e => !o[e])).forEach((e => {
                                o[e] = !0,
                                    r -= 1
                            }
                        ))
                    }
                )),
                    o.map(( (e, t) => e ? void 0 : t)).filter((e => void 0 !== e))
            }
            ,
            getFaceIsolatedVertices: ({vertices_coords: e, faces_vertices: t}) => {
                if (!e || !t)
                    return [];
                let r = e.length;
                const o = Array(r).fill(!1);
                return t.forEach((e => {
                        e.filter((e => !o[e])).forEach((e => {
                                o[e] = !0,
                                    r -= 1
                            }
                        ))
                    }
                )),
                    o.map(( (e, t) => e ? void 0 : t)).filter((e => void 0 !== e))
            }
            ,
            getIsolatedVertices: getIsolatedVertices,
            removeIsolatedVertices: removeIsolatedVertices,
            removeDuplicateVertices: removeDuplicateVertices
        });
        const qe = {
            edges: "edgeOrders",
            faces: "faceOrders"
        }
            , countImplied = (e, t) => Math.max((e => {
                let t = -1;
                return e.filter((e => void 0 !== e)).forEach((e => e.forEach((e => e.forEach((e => {
                        e > t && (t = e)
                    }
                )))))),
                    t
            }
        )(getGraphKeysWithSuffix(e, t).map((t => e[t]))), e[qe[t]] ? (e => {
                let t = -1;
                return e.forEach((e => {
                        e[0] > t && (t = e[0]),
                        e[1] > t && (t = e[1])
                    }
                )),
                    t
            }
        )(e[qe[t]]) : -1) + 1;
        countImplied.vertices = e => countImplied(e, n),
            countImplied.edges = e => countImplied(e, s),
            countImplied.faces = e => countImplied(e, c);
        const counterClockwiseWalk = ({vertices_vertices: e, vertices_sectors: t}, r, o, n={}) => {
            const s = {}
                , c = {
                vertices: [r],
                edges: [],
                angles: []
            };
            let i = r
                , a = o;
            for (; ; ) {
                const r = e[a]
                    , o = (r.indexOf(i) + r.length - 1) % r.length
                    , l = r[o]
                    , d = `${a} ${l}`;
                if (s[d])
                    return Object.assign(n, s),
                        c.vertices.pop(),
                        c;
                if (s[d] = !0,
                    n[d])
                    return;
                c.vertices.push(a),
                    c.edges.push(d),
                t && c.angles.push(t[a][o]),
                    i = a,
                    a = l
            }
        }
            , planarVertexWalk = ({vertices_vertices: e, vertices_sectors: t}) => {
            const r = {
                vertices_vertices: e,
                vertices_sectors: t
            }
                , o = {};
            return e.map(( (e, t) => e.map((e => counterClockwiseWalk(r, t, e, o))).filter((e => void 0 !== e)))).flat()
        }
            , filterWalkedBoundaryFace = e => e.filter((e => e.angles.map((e => Math.PI - e)).reduce(( (e, t) => e + t), 0) > 0));
        var Re = Object.freeze({
            __proto__: null,
            counterClockwiseWalk: counterClockwiseWalk,
            planarVertexWalk: planarVertexWalk,
            filterWalkedBoundaryFace: filterWalkedBoundaryFace
        });
        const sortVerticesCounterClockwise = ({vertices_coords: e}, t, r) => t.map((t => e[t])).map((t => Pe.core.subtract(t, e[r]))).map((e => Math.atan2(e[1], e[0]))).map((e => e > -Pe.core.EPSILON ? e : e + 2 * Math.PI)).map(( (e, t) => ({
            a: e,
            i: t
        }))).sort(( (e, t) => e.a - t.a)).map((e => e.i)).map((e => t[e]))
            , sortVerticesAlongVector = ({vertices_coords: e}, t, r) => t.map((t => ({
            i: t,
            d: Pe.core.dot(e[t], r)
        }))).sort(( (e, t) => e.d - t.d)).map((e => e.i));
        var Ge = Object.freeze({
            __proto__: null,
            sortVerticesCounterClockwise: sortVerticesCounterClockwise,
            sortVerticesAlongVector: sortVerticesAlongVector
        });
        const makeVerticesEdgesUnsorted = ({edges_vertices: e}) => {
            const t = [];
            return e.forEach(( (e, r) => e.forEach((e => {
                    void 0 === t[e] && (t[e] = []),
                        t[e].push(r)
                }
            )))),
                t
        }
            , makeVerticesEdges = ({edges_vertices: e, vertices_vertices: t}) => {
            const r = makeVerticesToEdgeBidirectional({
                edges_vertices: e
            });
            return t.map(( (e, t) => e.map((e => r[`${t} ${e}`]))))
        }
            , makeVerticesVertices = ({vertices_coords: e, vertices_edges: t, edges_vertices: r}) => {
            t || (t = makeVerticesEdgesUnsorted({
                edges_vertices: r
            }));
            const o = t.map(( (e, t) => e.map((e => r[e].filter((e => e !== t)))).reduce(( (e, t) => e.concat(t)), [])));
            return void 0 === e ? o : o.map(( (t, r) => sortVerticesCounterClockwise({
                vertices_coords: e
            }, t, r)))
        }
            , makeVerticesFacesUnsorted = ({vertices_coords: e, faces_vertices: t}) => {
            if (!t)
                return e.map(( () => []));
            const r = void 0 !== e ? e.map(( () => [])) : Array.from(Array(countImplied.vertices({
                faces_vertices: t
            }))).map(( () => []));
            return t.forEach(( (e, t) => {
                    const o = [];
                    e.forEach((e => {
                            o[e] = t
                        }
                    )),
                        o.forEach(( (e, t) => r[t].push(e)))
                }
            )),
                r
        }
            , makeVerticesFaces = ({vertices_coords: e, vertices_vertices: t, faces_vertices: r}) => {
            if (!r)
                return e.map(( () => []));
            if (!t)
                return makeVerticesFacesUnsorted({
                    vertices_coords: e,
                    faces_vertices: r
                });
            const o = makeVerticesToFace({
                faces_vertices: r
            });
            return t.map(( (e, t) => e.map(( (e, r, o) => [o[(r + 1) % o.length], t, e].join(" "))))).map((e => e.map((e => o[e]))))
        }
            , makeVerticesToEdgeBidirectional = ({edges_vertices: e}) => {
            const t = {};
            return e.map((e => e.join(" "))).forEach(( (e, r) => {
                    t[e] = r
                }
            )),
                e.map((e => `${e[1]} ${e[0]}`)).forEach(( (e, r) => {
                        t[e] = r
                    }
                )),
                t
        }
            , makeVerticesToEdge = ({edges_vertices: e}) => {
            const t = {};
            return e.map((e => e.join(" "))).forEach(( (e, r) => {
                    t[e] = r
                }
            )),
                t
        }
            , makeVerticesToFace = ({faces_vertices: e}) => {
            const t = {};
            return e.forEach(( (e, r) => e.map(( (t, r) => [0, 1, 2].map((t => (r + t) % e.length)).map((t => e[t])).join(" "))).forEach((e => {
                    t[e] = r
                }
            )))),
                t
        }
            , makeVerticesVerticesVector = ({vertices_coords: e, vertices_vertices: t, edges_vertices: r, edges_vector: o}) => {
            o || (o = makeEdgesVector({
                vertices_coords: e,
                edges_vertices: r
            }));
            const n = makeVerticesToEdge({
                edges_vertices: r
            });
            return t.map(( (e, r) => t[r].map((e => {
                    const t = n[`${r} ${e}`]
                        , s = n[`${e} ${r}`];
                    return void 0 !== t ? o[t] : void 0 !== s ? Pe.core.flip(o[s]) : void 0
                }
            ))))
        }
            , makeVerticesSectors = ({vertices_coords: e, vertices_vertices: t, edges_vertices: r, edges_vector: o}) => makeVerticesVerticesVector({
            vertices_coords: e,
            vertices_vertices: t,
            edges_vertices: r,
            edges_vector: o
        }).map((e => 1 === e.length ? [Pe.core.TWO_PI] : Pe.core.counterClockwiseSectors2(e)))
            , makeEdgesFacesUnsorted = ({edges_vertices: e, faces_edges: t}) => {
            const r = void 0 !== e ? e.map(( () => [])) : Array.from(Array(countImplied.edges({
                faces_edges: t
            }))).map(( () => []));
            return t.forEach(( (e, t) => {
                    const o = [];
                    e.forEach((e => {
                            o[e] = t
                        }
                    )),
                        o.forEach(( (e, t) => r[t].push(e)))
                }
            )),
                r
        }
            , makeEdgesFaces = ({vertices_coords: e, edges_vertices: t, edges_vector: r, faces_vertices: o, faces_edges: n, faces_center: s}) => {
            if (!t)
                return makeEdgesFacesUnsorted({
                    faces_edges: n
                });
            r || (r = makeEdgesVector({
                vertices_coords: e,
                edges_vertices: t
            }));
            const c = t.map((t => e[t[0]]));
            s || (s = makeFacesCenter({
                vertices_coords: e,
                faces_vertices: o
            }));
            const i = t.map(( () => []));
            return n.forEach(( (e, t) => {
                    const r = [];
                    e.forEach((e => {
                            r[e] = t
                        }
                    )),
                        r.forEach(( (e, t) => i[t].push(e)))
                }
            )),
                i.forEach(( (e, t) => {
                        const o = e.map((e => s[e])).map((e => Pe.core.subtract2(e, c[t]))).map((e => Pe.core.cross2(e, r[t])));
                        e.sort(( (e, t) => o[e] - o[t]))
                    }
                )),
                i
        }
            , Ue = {
            M: -180,
            m: -180,
            V: 180,
            v: 180
        }
            , makeEdgesFoldAngle = ({edges_assignment: e}) => e.map((e => Ue[e] || 0))
            , makeEdgesAssignment = ({edges_foldAngle: e}) => e.map((e => 0 === e ? "F" : e < 0 ? "M" : "V"))
            , makeEdgesCoords = ({vertices_coords: e, edges_vertices: t}) => t.map((t => t.map((t => e[t]))))
            , makeEdgesVector = ({vertices_coords: e, edges_vertices: t}) => makeEdgesCoords({
            vertices_coords: e,
            edges_vertices: t
        }).map((e => Pe.core.subtract(e[1], e[0])))
            , makeEdgesBoundingBox = ({vertices_coords: e, edges_vertices: t, edges_coords: r}, o=0) => (r || (r = makeEdgesCoords({
            vertices_coords: e,
            edges_vertices: t
        })),
            r.map((e => Pe.core.boundingBox(e, o))))
            , makePlanarFaces = ({vertices_coords: e, vertices_vertices: t, vertices_edges: r, vertices_sectors: o, edges_vertices: n, edges_vector: s}) => {
            t || (t = makeVerticesVertices({
                vertices_coords: e,
                edges_vertices: n,
                vertices_edges: r
            })),
            o || (o = makeVerticesSectors({
                vertices_coords: e,
                vertices_vertices: t,
                edges_vertices: n,
                edges_vector: s
            }));
            const c = makeVerticesToEdgeBidirectional({
                edges_vertices: n
            });
            return filterWalkedBoundaryFace(planarVertexWalk({
                vertices_vertices: t,
                vertices_sectors: o
            })).map((e => ({
                ...e,
                edges: e.edges.map((e => c[e]))
            })))
        }
            , makeFacesVerticesFromEdges = e => e.faces_edges.map((t => t.map((t => e.edges_vertices[t])).map(( (e, t, r) => {
                const o = r[(t + 1) % r.length];
                return e[0] === o[0] || e[0] === o[1] ? e[1] : e[0]
            }
        ))))
            , makeFacesEdgesFromVertices = e => {
            const t = makeVerticesToEdgeBidirectional(e);
            return e.faces_vertices.map((e => e.map(( (e, t, r) => [e, r[(t + 1) % r.length]].join(" "))))).map((e => e.map((e => t[e]))))
        }
            , makeFacesFaces = ({faces_vertices: e}) => {
            const t = e.map(( () => []))
                , r = {};
            return e.map(( (e, t) => e.map(( (o, n, s) => {
                    let c = s[(n + 1) % e.length];
                    c < o && ([o,c] = [c, o]);
                    const i = `${o} ${c}`;
                    void 0 === r[i] && (r[i] = {}),
                        r[i][t] = !0
                }
            )))),
                Object.values(r).map((e => Object.keys(e))).filter((e => e.length > 1)).forEach((e => {
                        t[e[0]].push(parseInt(e[1], 10)),
                            t[e[1]].push(parseInt(e[0], 10))
                    }
                )),
                t
        }
            , makeFacesPolygon = ({vertices_coords: e, faces_vertices: t}, r) => t.map((t => t.map((t => e[t])))).map((e => Pe.core.makePolygonNonCollinear(e, r)))
            , makeFacesCenter = ({vertices_coords: e, faces_vertices: t}) => t.map((t => t.map((t => e[t])))).map((e => Pe.core.centroid(e)))
            , makeFacesCenterQuick = ({vertices_coords: e, faces_vertices: t}) => t.map((t => t.map((t => e[t])).reduce(( (e, t) => [e[0] + t[0], e[1] + t[1]]), [0, 0]).map((e => e / t.length))));
        var De = Object.freeze({
            __proto__: null,
            makeVerticesEdgesUnsorted: makeVerticesEdgesUnsorted,
            makeVerticesEdges: makeVerticesEdges,
            makeVerticesVertices: makeVerticesVertices,
            makeVerticesFacesUnsorted: makeVerticesFacesUnsorted,
            makeVerticesFaces: makeVerticesFaces,
            makeVerticesToEdgeBidirectional: makeVerticesToEdgeBidirectional,
            makeVerticesToEdge: makeVerticesToEdge,
            makeVerticesToFace: makeVerticesToFace,
            makeVerticesVerticesVector: makeVerticesVerticesVector,
            makeVerticesSectors: makeVerticesSectors,
            makeEdgesEdges: ({edges_vertices: e, vertices_edges: t}) => e.map(( (e, r) => {
                    const o = t[e[0]].filter((e => e !== r))
                        , n = t[e[1]].filter((e => e !== r));
                    return o.concat(n)
                }
            )),
            makeEdgesFacesUnsorted: makeEdgesFacesUnsorted,
            makeEdgesFaces: makeEdgesFaces,
            makeEdgesFoldAngle: makeEdgesFoldAngle,
            makeEdgesAssignment: makeEdgesAssignment,
            makeEdgesCoords: makeEdgesCoords,
            makeEdgesVector: makeEdgesVector,
            makeEdgesLength: ({vertices_coords: e, edges_vertices: t}) => makeEdgesVector({
                vertices_coords: e,
                edges_vertices: t
            }).map((e => Pe.core.magnitude(e))),
            makeEdgesBoundingBox: makeEdgesBoundingBox,
            makePlanarFaces: makePlanarFaces,
            makeFacesVerticesFromEdges: makeFacesVerticesFromEdges,
            makeFacesEdgesFromVertices: makeFacesEdgesFromVertices,
            makeFacesFaces: makeFacesFaces,
            makeFacesPolygon: makeFacesPolygon,
            makeFacesPolygonQuick: ({vertices_coords: e, faces_vertices: t}) => t.map((t => t.map((t => e[t])))),
            makeFacesCenter: makeFacesCenter,
            makeFacesCenterQuick: makeFacesCenterQuick
        });
        const getCircularEdges = ({edges_vertices: e}) => {
                const t = [];
                for (let r = 0; r < e.length; r += 1)
                    e[r][0] === e[r][1] && t.push(r);
                return t
            }
            , getDuplicateEdges = ({edges_vertices: e}) => {
                if (!e)
                    return [];
                const t = []
                    , r = {};
                for (let o = 0; o < e.length; o += 1) {
                    const n = `${e[o][0]} ${e[o][1]}`
                        , s = `${e[o][1]} ${e[o][0]}`;
                    void 0 !== r[n] ? t[o] = r[n] : (r[n] = o,
                        r[s] = o)
                }
                return t
            }
            , removeCircularEdges = (e, t) => (t || (t = getCircularEdges(e)),
            t.length && ( (e, t, r) => {
                    const o = {};
                    r.forEach((e => {
                            o[e] = !0
                        }
                    )),
                        getGraphKeysWithSuffix(e, t).forEach((t => e[t].forEach(( (r, n) => {
                                for (let s = r.length - 1; s >= 0; s -= 1)
                                    !0 === o[r[s]] && e[t][n].splice(s, 1)
                            }
                        ))))
                }
            )(e, s, t),
                {
                    map: removeGeometryIndices(e, s, t),
                    remove: t
                })
            , removeDuplicateEdges = (e, t) => {
                t || (t = getDuplicateEdges(e));
                const r = Object.keys(t).map((e => parseInt(e, 10)))
                    , o = replaceGeometryIndices(e, s, t);
                return r.length && (e.vertices_edges || e.vertices_vertices || e.vertices_faces) && (e.vertices_edges = makeVerticesEdgesUnsorted(e),
                    e.vertices_vertices = makeVerticesVertices(e),
                    e.vertices_edges = makeVerticesEdges(e),
                    e.vertices_faces = makeVerticesFaces(e)),
                    {
                        map: o,
                        remove: r
                    }
            }
        ;
        var We = Object.freeze({
            __proto__: null,
            getCircularEdges: getCircularEdges,
            getDuplicateEdges: getDuplicateEdges,
            removeCircularEdges: removeCircularEdges,
            removeDuplicateEdges: removeDuplicateEdges
        });
        const mergeSimpleNextmaps = (...e) => {
                if (0 === e.length)
                    return [];
                const t = e[0].map(( (e, t) => t));
                return e.forEach((e => t.forEach(( (r, o) => {
                        t[o] = e[r]
                    }
                )))),
                    t
            }
            , mergeNextmaps = (...e) => {
                if (0 === e.length)
                    return [];
                const t = e[0].map(( (e, t) => [t]));
                return e.forEach((e => {
                        t.forEach(( (r, o) => r.forEach(( (r, n) => {
                                t[o][n] = e[r]
                            }
                        )))),
                            t.forEach(( (e, r) => {
                                    t[r] = e.reduce(( (e, t) => e.concat(t)), []).filter((e => void 0 !== e))
                                }
                            ))
                    }
                )),
                    t
            }
            , mergeBackmaps = (...e) => {
                if (0 === e.length)
                    return [];
                let r = e[0].reduce(( (e, t) => e.concat(t)), []).map(( (e, t) => [t]));
                return e.forEach((e => {
                        const o = [];
                        e.forEach(( (e, n) => {
                                o[n] = typeof e === t ? r[e] : e.map((e => r[e])).reduce(( (e, t) => e.concat(t)), [])
                            }
                        )),
                            r = o
                    }
                )),
                    r
            }
            , invertMap = e => {
                const r = [];
                return e.forEach(( (e, o) => {
                        null != e && (typeof e === t && (void 0 !== r[e] ? typeof r[e] === t ? r[e] = [r[e], o] : r[e].push(o) : r[e] = o),
                        e.constructor === Array && e.forEach((e => {
                                r[e] = o
                            }
                        )))
                    }
                )),
                    r
            }
            , invertSimpleMap = e => {
                const t = [];
                return e.forEach(( (e, r) => {
                        t[e] = r
                    }
                )),
                    t
            }
        ;
        var Ze = Object.freeze({
            __proto__: null,
            mergeSimpleNextmaps: mergeSimpleNextmaps,
            mergeNextmaps: mergeNextmaps,
            mergeSimpleBackmaps: (...e) => {
                if (0 === e.length)
                    return [];
                let t = e[0].map(( (e, t) => t));
                return e.forEach((e => {
                        const r = e.map((e => t[e]));
                        t = r
                    }
                )),
                    t
            }
            ,
            mergeBackmaps: mergeBackmaps,
            invertMap: invertMap,
            invertSimpleMap: invertSimpleMap
        });
        const clean = (e, t) => {
                const r = removeDuplicateVertices(e, t)
                    , o = removeCircularEdges(e)
                    , n = removeDuplicateEdges(e)
                    , s = removeIsolatedVertices(e)
                    , c = invertSimpleMap(r.map)
                    , i = s.remove.map((e => c[e]))
                    , a = invertSimpleMap(o.map)
                    , l = n.remove.map((e => a[e]));
                return {
                    vertices: {
                        map: mergeSimpleNextmaps(r.map, s.map),
                        remove: r.remove.concat(i)
                    },
                    edges: {
                        map: mergeSimpleNextmaps(o.map, n.map),
                        remove: o.remove.concat(l)
                    }
                }
            }
            , validate$1 = (e, t) => {
                const r = getDuplicateEdges(e)
                    , o = getCircularEdges(e)
                    , n = getIsolatedVertices(e)
                    , s = getDuplicateVertices(e, t)
                    , c = (e => {
                        const t = count.vertices(e)
                            , r = count.edges(e)
                            , o = count.faces(e);
                        return {
                            vertices: t >= countImplied.vertices(e),
                            edges: r >= countImplied.edges(e),
                            faces: o >= countImplied.faces(e)
                        }
                    }
                )(e);
                return {
                    summary: 0 === r.length && 0 === o.length && 0 === n.length && c.vertices && c.edges && c.faces ? "valid" : "problematic",
                    vertices: {
                        isolated: n,
                        duplicate: s,
                        references: c.vertices
                    },
                    edges: {
                        circular: o,
                        duplicate: r,
                        references: c.edges
                    },
                    faces: {
                        references: c.faces
                    }
                }
            }
            , populate = (e, t) => "object" != typeof e ? e : e.edges_vertices ? (e.vertices_edges = makeVerticesEdgesUnsorted(e),
                e.vertices_vertices = makeVerticesVertices(e),
                e.vertices_edges = makeVerticesEdges(e),
                (e => {
                        const t = e.edges_vertices.length;
                        if (e.edges_assignment || (e.edges_assignment = []),
                        e.edges_foldAngle || (e.edges_foldAngle = []),
                        e.edges_assignment.length > e.edges_foldAngle.length)
                            for (let t = e.edges_foldAngle.length; t < e.edges_assignment.length; t += 1)
                                e.edges_foldAngle[t] = edgeAssignmentToFoldAngle(e.edges_assignment[t]);
                        if (e.edges_foldAngle.length > e.edges_assignment.length)
                            for (let t = e.edges_assignment.length; t < e.edges_foldAngle.length; t += 1)
                                e.edges_assignment[t] = edgeFoldAngleToAssignment(e.edges_foldAngle[t]);
                        for (let r = e.edges_assignment.length; r < t; r += 1)
                            e.edges_assignment[r] = "U",
                                e.edges_foldAngle[r] = 0
                    }
                )(e),
                ( (e, t) => {
                        if (void 0 !== t || e.faces_vertices || e.faces_edges || (t = !0),
                        t && e.vertices_coords) {
                            const t = makePlanarFaces(e);
                            return e.faces_vertices = t.map((e => e.vertices)),
                                void (e.faces_edges = t.map((e => e.edges)))
                        }
                        e.faces_vertices && e.faces_edges || (e.faces_vertices && !e.faces_edges ? e.faces_edges = makeFacesEdgesFromVertices(e) : e.faces_edges && !e.faces_vertices ? e.faces_vertices = makeFacesVerticesFromEdges(e) : (e.faces_vertices = [],
                            e.faces_edges = []))
                    }
                )(e, t),
                e.vertices_faces = makeVerticesFaces(e),
                e.edges_faces = makeEdgesFacesUnsorted(e),
                e.faces_faces = makeFacesFaces(e),
                e) : e
            , getEdgesVerticesOverlappingSpan = (e, t=Pe.core.EPSILON) => makeEdgesBoundingBox(e, t).map((t => e.vertices_coords.map((e => e[0] > t.min[0] && e[1] > t.min[1] && e[0] < t.max[0] && e[1] < t.max[1]))))
            , getEdgesEdgesOverlapingSpans = ({vertices_coords: e, edges_vertices: t, edges_coords: r}, o=Pe.core.EPSILON) => {
                const n = makeEdgesBoundingBox({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_coords: r
                }, o)
                    , s = t.map(( () => []));
                for (let e = 0; e < t.length - 1; e += 1)
                    for (let r = e + 1; r < t.length; r += 1) {
                        const t = (n[e].max[0] < n[r].min[0] || n[r].max[0] < n[e].min[0]) && (n[e].max[1] < n[r].min[1] || n[r].max[1] < n[e].min[1]);
                        s[e][r] = !t,
                            s[r][e] = !t
                    }
                for (let e = 0; e < t.length; e += 1)
                    s[e][e] = !0;
                return s
            }
        ;
        var He = Object.freeze({
            __proto__: null,
            getEdgesVerticesOverlappingSpan: getEdgesVerticesOverlappingSpan,
            getEdgesEdgesOverlapingSpans: getEdgesEdgesOverlapingSpans
        });
        const isVertexCollinear = ({vertices_coords: e, vertices_edges: t, edges_vertices: r}, o, n=Pe.core.EPSILON) => {
                if (!e || !r)
                    return !1;
                t || (t = makeVerticesEdgesUnsorted({
                    edges_vertices: r
                }));
                const s = t[o];
                if (void 0 === s || 2 !== s.length)
                    return !1;
                const c = ( ({edges_vertices: e}, t, r) => (r.forEach((r => {
                        e[r][0] === t && e[r][1] === t && console.warn("removePlanarVertex circular edge")
                    }
                )),
                    r.map((r => e[r][0] === t ? e[r][1] : e[r][0]))))({
                    edges_vertices: r
                }, o, s)
                    , i = [c[0], o, c[1]].map((t => e[t]));
                return Pe.core.collinearBetween(...i, !1, n)
            }
            , getVerticesEdgesOverlap = ({vertices_coords: e, edges_vertices: t, edges_coords: r}, o=Pe.core.EPSILON) => {
                r || (r = t.map((t => t.map((t => e[t])))));
                const n = getEdgesVerticesOverlappingSpan({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_coords: r
                }, o);
                for (let t = 0; t < r.length; t += 1)
                    for (let s = 0; s < e.length; s += 1)
                        n[t][s] && (n[t][s] = Pe.core.overlapLinePoint(Pe.core.subtract(r[t][1], r[t][0]), r[t][0], e[s], Pe.core.excludeS, o));
                return n.map((e => e.map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e))))
            }
        ;
        var Je = Object.freeze({
            __proto__: null,
            isVertexCollinear: isVertexCollinear,
            getVerticesEdgesOverlap: getVerticesEdgesOverlap
        });
        const makeEdgesLineParallelOverlap = ({vertices_coords: e, edges_vertices: t}, r, o, n=Pe.core.EPSILON) => {
                const s = Pe.core.normalize2(r)
                    , c = t.map((t => e[t[0]]))
                    , i = t.map((t => t.map((t => e[t])))).map((e => Pe.core.subtract2(e[1], e[0]))).map((e => Pe.core.parallel2(e, r, n)));
                for (let e = 0; e < t.length; e += 1) {
                    if (!i[e])
                        continue;
                    if (Pe.core.fnEpsilonEqualVectors(c[e], o)) {
                        i[e] = !0;
                        continue
                    }
                    const t = Pe.core.normalize2(Pe.core.subtract2(c[e], o))
                        , r = Math.abs(Pe.core.dot2(t, s));
                    i[e] = Math.abs(1 - r) < n
                }
                return i
            }
            , makeEdgesSegmentIntersection = ({vertices_coords: e, edges_vertices: t, edges_coords: r}, o, n, s=Pe.core.EPSILON) => {
                r || (r = makeEdgesCoords({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const c = Pe.core.boundingBox([o, n], s)
                    , i = Pe.core.subtract2(n, o);
                return makeEdgesBoundingBox({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_coords: r
                }, s).map((e => Pe.core.overlapBoundingBoxes(c, e))).map(( (e, t) => e ? Pe.core.intersectLineLine(i, o, Pe.core.subtract2(r[t][1], r[t][0]), r[t][0], Pe.core.includeS, Pe.core.includeS, s) : void 0))
            }
            , makeEdgesEdgesIntersection = function({vertices_coords: e, edges_vertices: t, edges_vector: r, edges_origin: o}, n=Pe.core.EPSILON) {
                r || (r = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: t
                })),
                o || (o = t.map((t => e[t[0]])));
                const s = r.map(( () => []))
                    , c = getEdgesEdgesOverlapingSpans({
                    vertices_coords: e,
                    edges_vertices: t
                }, n);
                for (let e = 0; e < r.length - 1; e += 1)
                    for (let t = e + 1; t < r.length; t += 1)
                        !0 === c[e][t] ? (s[e][t] = Pe.core.intersectLineLine(r[e], o[e], r[t], o[t], Pe.core.excludeS, Pe.core.excludeS, n),
                            s[t][e] = s[e][t]) : s[e][t] = void 0;
                return s
            }
            , intersectConvexFaceLine = ({vertices_coords: e, edges_vertices: t, faces_vertices: r, faces_edges: o}, n, s, c, i=Pe.core.EPSILON) => {
                const a = r[n].map((t => e[t])).map((e => Pe.core.overlapLinePoint(s, c, e, ( () => !0), i))).map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e))
                    , l = a.map((e => r[n][e]));
                if (a.concat(a.map((e => e + r[n].length))).map(( (e, t, r) => r[t + 1] - e == 1)).reduce(( (e, t) => e || t), !1))
                    return;
                if (l.length > 1)
                    return {
                        vertices: l,
                        edges: []
                    };
                const d = o[n].map((r => t[r].map((t => e[t])))).map((e => Pe.core.intersectLineLine(s, c, Pe.core.subtract(e[1], e[0]), e[0], Pe.core.includeL, Pe.core.excludeS, i))).map(( (e, t) => ({
                    coords: e,
                    edge: o[n][t]
                }))).filter((e => void 0 !== e.coords)).filter((e => !l.map((r => t[e.edge].includes(r))).reduce(( (e, t) => e || t), !1)));
                return d.length + l.length === 2 ? {
                    vertices: l,
                    edges: d
                } : void 0
            }
        ;
        var Xe = Object.freeze({
            __proto__: null,
            makeEdgesLineParallelOverlap: makeEdgesLineParallelOverlap,
            makeEdgesSegmentIntersection: makeEdgesSegmentIntersection,
            makeEdgesEdgesIntersection: makeEdgesEdgesIntersection,
            intersectConvexFaceLine: intersectConvexFaceLine
        });
        const fragment_graph = (e, t=Pe.core.EPSILON) => {
                const r = e.edges_vertices.map((t => t.map((t => e.vertices_coords[t]))))
                    , o = r.map((e => Pe.core.subtract(e[1], e[0])))
                    , n = r.map((e => e[0]))
                    , s = makeEdgesEdgesIntersection({
                    vertices_coords: e.vertices_coords,
                    edges_vertices: e.edges_vertices,
                    edges_vector: o,
                    edges_origin: n
                }, 1e-6)
                    , c = getVerticesEdgesOverlap({
                    vertices_coords: e.vertices_coords,
                    edges_vertices: e.edges_vertices,
                    edges_coords: r
                }, t);
                if (0 === s.flat().filter((e => void 0 !== e)).length && 0 === c.flat().filter((e => void 0 !== e)).length)
                    return;
                const i = e.vertices_coords.length;
                s.forEach((t => t.filter((e => void 0 !== e)).filter((e => 2 === e.length)).forEach((t => {
                        const r = e.vertices_coords.length;
                        e.vertices_coords.push([...t]),
                            t.splice(0, 2),
                            t.push(r)
                    }
                )))),
                    s.forEach(( (e, t) => {
                            e.forEach(( (e, r) => {
                                    e && (s[t][r] = e[0])
                                }
                            ))
                        }
                    ));
                const a = s.map((e => e.filter((e => void 0 !== e))));
                e.edges_vertices.forEach(( (e, t) => e.push(...a[t], ...c[t]))),
                    e.edges_vertices.forEach(( (t, r) => {
                            e.edges_vertices[r] = sortVerticesAlongVector({
                                vertices_coords: e.vertices_coords
                            }, t, o[r])
                        }
                    ));
                const l = e.edges_vertices.map(( (e, t) => Array(e.length - 1).fill(t))).flat();
                if (e.edges_vertices = e.edges_vertices.map((e => Array.from(Array(e.length - 1)).map(( (t, r, o) => [e[r], e[r + 1]])))).flat(),
                e.edges_assignment && e.edges_foldAngle && e.edges_foldAngle.length > e.edges_assignment.length)
                    for (let t = e.edges_assignment.length; t < e.edges_foldAngle.length; t += 1)
                        e.edges_assignment[t] = edgeFoldAngleToAssignment(e.edges_foldAngle[t]);
                return e.edges_assignment && (e.edges_assignment = l.map((t => e.edges_assignment[t] || "U"))),
                e.edges_foldAngle && (e.edges_foldAngle = l.map((t => e.edges_foldAngle[t])).map(( (t, r) => void 0 === t ? edgeAssignmentToFoldAngle(e.edges_assignment[r]) : t))),
                    {
                        vertices: {
                            new: Array.from(Array(e.vertices_coords.length - i)).map(( (e, t) => i + t))
                        },
                        edges: {
                            backmap: l
                        }
                    }
            }
            , Ye = [a, l, u, p]
            , fragment = (e, t=Pe.core.EPSILON) => {
                e.vertices_coords = e.vertices_coords.map((e => e.slice(0, 2))),
                    [n, s, c].map((t => getGraphKeysWithPrefix(e, t))).flat().filter((e => !Ye.includes(e))).forEach((t => delete e[t]));
                const r = {
                    vertices: {},
                    edges: {}
                };
                let o;
                for (o = 0; o < 20; o += 1) {
                    const o = removeDuplicateVertices(e, t / 2)
                        , n = removeDuplicateEdges(e)
                        , s = removeCircularEdges(e)
                        , c = fragment_graph(e, t);
                    if (void 0 === c) {
                        r.vertices.map = void 0 === r.vertices.map ? o.map : mergeNextmaps(r.vertices.map, o.map),
                            r.edges.map = void 0 === r.edges.map ? mergeNextmaps(n.map, s.map) : mergeNextmaps(r.edges.map, n.map, s.map);
                        break
                    }
                    const i = invertMap(c.edges.backmap)
                        , a = mergeNextmaps(n.map, s.map, i);
                    r.vertices.map = void 0 === r.vertices.map ? o.map : mergeNextmaps(r.vertices.map, o.map),
                        r.edges.map = void 0 === r.edges.map ? a : mergeNextmaps(r.edges.map, a)
                }
                return 20 === o && console.warn("fragment reached max iterations"),
                    r
            }
            , getBoundaryVertices = ({edges_vertices: e, edges_assignment: t}) => uniqueIntegers(e.filter(( (e, r) => "B" === t[r] || "b" === t[r])).flat())
            , getBoundary = ({vertices_edges: e, edges_vertices: t, edges_assignment: r}) => {
                if (void 0 === r)
                    return {
                        vertices: [],
                        edges: []
                    };
                e || (e = makeVerticesEdgesUnsorted({
                    edges_vertices: t
                }));
                const o = r.map((e => "B" === e || "b" === e))
                    , n = []
                    , s = [];
                let c = -1;
                for (let e = 0; e < o.length; e += 1)
                    if (o[e]) {
                        c = e;
                        break
                    }
                if (-1 === c)
                    return {
                        vertices: [],
                        edges: []
                    };
                o[c] = !1,
                    n.push(c),
                    s.push(t[c][0]);
                let i = t[c][1];
                for (; s[0] !== i; ) {
                    if (s.push(i),
                        c = e[i].filter((e => o[e])).shift(),
                    void 0 === c)
                        return {
                            vertices: [],
                            edges: []
                        };
                    t[c][0] === i ? [,i] = t[c] : [i] = t[c],
                        o[c] = !1,
                        n.push(c)
                }
                return {
                    vertices: s,
                    edges: n
                }
            }
        ;
        var Ke = Object.freeze({
            __proto__: null,
            getBoundingBox: ({vertices_coords: e}, t) => Pe.core.boundingBox(e, t),
            getBoundaryVertices: getBoundaryVertices,
            getBoundary: getBoundary,
            getPlanarBoundary: ({vertices_coords: e, vertices_edges: t, vertices_vertices: r, edges_vertices: o}) => {
                r || (r = makeVerticesVertices({
                    vertices_coords: e,
                    vertices_edges: t,
                    edges_vertices: o
                }));
                const n = makeVerticesToEdgeBidirectional({
                    edges_vertices: o
                })
                    , s = []
                    , c = []
                    , i = {
                    vertices: c,
                    edges: s
                };
                let a = -1 / 0
                    , l = -1;
                if (e.forEach(( (e, t) => {
                        e[0] > a && (a = e[0],
                            l = t)
                    }
                )),
                -1 === l)
                    return i;
                c.push(l);
                const d = e[l]
                    , u = r[l]
                    , p = u.map((t => e[t])).map((e => [e[0] - d[0], e[1] - d[1]])).map((e => Math.atan2(e[1], e[0]))).map((e => e < 0 ? e + 2 * Math.PI : e)).map(( (e, t) => ({
                    a: e,
                    i: t
                }))).sort(( (e, t) => e.a - t.a)).shift().i
                    , g = u[p]
                    , m = n[l < g ? `${l} ${g}` : `${g} ${l}`];
                s.push(m);
                let h = l
                    , v = g
                    , _ = 0;
                for (; _ < 1e4; ) {
                    const e = r[v]
                        , t = e.indexOf(h)
                        , o = e[(t + 1) % e.length]
                        , a = n[v < o ? `${v} ${o}` : `${o} ${v}`];
                    if (a === s[0])
                        return i;
                    c.push(v),
                        s.push(a),
                        h = v,
                        v = o,
                        _ += 1
                }
                return console.warn("calculate boundary potentially entered infinite loop"),
                    i
            }
        });
        const apply_matrix_to_graph = function(e, t) {
            return filterKeysWithSuffix(e, "coords").forEach((r => {
                    e[r] = e[r].map((e => Pe.core.resize(3, e))).map((e => Pe.core.multiplyMatrix3Vector3(t, e)))
                }
            )),
                filterKeysWithSuffix(e, "matrix").forEach((r => {
                        e[r] = e[r].map((e => Pe.core.multiplyMatrices3(e, t)))
                    }
                )),
                e
        };
        var Qe = {
            scale: (e, t, ...r) => {
                const o = Pe.core.getVector(...r)
                    , n = Pe.core.resize(3, o)
                    , s = Pe.core.makeMatrix3Scale(t, n);
                return apply_matrix_to_graph(e, s)
            }
            ,
            translate: (e, ...t) => {
                const r = Pe.core.getVector(...t)
                    , o = Pe.core.resize(3, r)
                    , n = Pe.core.makeMatrix3Translate(...o);
                return apply_matrix_to_graph(e, n)
            }
            ,
            rotateZ: (e, t, ...r) => {
                const o = Pe.core.getVector(...r)
                    , n = Pe.core.resize(3, o)
                    , s = Pe.core.makeMatrix3RotateZ(t, ...n);
                return apply_matrix_to_graph(e, s)
            }
            ,
            transform: apply_matrix_to_graph
        };
        const getFaceFaceSharedVertices = (e, t) => {
                const r = {};
                t.forEach((e => {
                        r[e] = !0
                    }
                ));
                const o = e.map((e => !!r[e]))
                    , n = []
                    , s = o.indexOf(!1)
                    , c = {};
                for (let t = s + 1; t < o.length; t += 1)
                    o[t] && !c[e[t]] && (n.push(e[t]),
                        c[e[t]] = !0);
                for (let t = 0; t < s; t += 1)
                    o[t] && !c[e[t]] && (n.push(e[t]),
                        c[e[t]] = !0);
                return n
            }
            , makeFaceSpanningTree = ({faces_vertices: e, faces_faces: t}, r=0) => {
                if (t || (t = makeFacesFaces({
                    faces_vertices: e
                })),
                0 === t.length)
                    return [];
                const o = [[{
                    face: r
                }]]
                    , n = {};
                n[r] = !0;
                do {
                    const r = o[o.length - 1].map((e => t[e.face].map((t => ({
                        face: t,
                        parent: e.face
                    }))))).reduce(( (e, t) => e.concat(t)), [])
                        , s = {};
                    r.forEach(( (e, t) => {
                            n[e.face] && (s[t] = !0),
                                n[e.face] = !0
                        }
                    ));
                    const c = r.filter(( (e, t) => !s[t]));
                    c.map((t => getFaceFaceSharedVertices(e[t.face], e[t.parent]))).forEach(( (e, t) => {
                            const r = e.slice(0, 2);
                            c[t].edge_vertices = r
                        }
                    )),
                        o[o.length] = c
                } while (o[o.length - 1].length > 0);
                return o.length > 0 && 0 === o[o.length - 1].length && o.pop(),
                    o
            }
        ;
        var et = Object.freeze({
            __proto__: null,
            getFaceFaceSharedVertices: getFaceFaceSharedVertices,
            makeFaceSpanningTree: makeFaceSpanningTree
        });
        const multiplyVerticesFacesMatrix2 = ({vertices_coords: e, vertices_faces: t, faces_vertices: r}, o) => {
                t || (t = makeVerticesFaces({
                    faces_vertices: r
                }));
                const n = t.map((e => e.filter((e => null != e)).shift())).map((e => void 0 === e ? Pe.core.identity2x3 : o[e]));
                return e.map(( (e, t) => Pe.core.multiplyMatrix2Vector2(n[t], e)))
            }
            , tt = {
                U: !0,
                u: !0
            }
            , makeFacesMatrix = ({vertices_coords: e, edges_vertices: t, edges_foldAngle: r, edges_assignment: o, faces_vertices: n, faces_faces: s}, c=0) => {
                !o && r && (o = makeEdgesAssignment({
                    edges_foldAngle: r
                })),
                r || (r = o ? makeEdgesFoldAngle({
                    edges_assignment: o
                }) : Array(t.length).fill(0));
                const i = makeVerticesToEdgeBidirectional({
                    edges_vertices: t
                })
                    , a = n.map(( () => Pe.core.identity3x4));
                return makeFaceSpanningTree({
                    faces_vertices: n,
                    faces_faces: s
                }, c).slice(1).forEach((t => t.forEach((t => {
                        const n = t.edge_vertices.map((t => e[t]))
                            , s = t.edge_vertices.join(" ")
                            , c = i[s]
                            , l = tt[o[c]] ? Math.PI : r[c] * Math.PI / 180
                            , d = Pe.core.makeMatrix3Rotate(l, Pe.core.subtract(...Pe.core.resizeUp(n[1], n[0])), n[0]);
                        a[t.face] = Pe.core.multiplyMatrices3(a[t.parent], d)
                    }
                )))),
                    a
            }
            , rt = {
                M: !0,
                m: !0,
                V: !0,
                v: !0,
                U: !0,
                u: !0,
                F: !1,
                f: !1,
                B: !1,
                b: !1
            }
            , makeEdgesIsFolded = ({edges_vertices: e, edges_foldAngle: t, edges_assignment: r}) => void 0 === r ? void 0 === t ? e.map(( () => !0)) : t.map((e => e < -Pe.core.EPSILON || e > Pe.core.EPSILON)) : r.map((e => rt[e]))
            , makeFacesMatrix2 = ({vertices_coords: e, edges_vertices: t, edges_foldAngle: r, edges_assignment: o, faces_vertices: n, faces_faces: s}, c=0) => {
                r || (r = o ? makeEdgesFoldAngle({
                    edges_assignment: o
                }) : Array(t.length).fill(0));
                const i = makeEdgesIsFolded({
                    edges_vertices: t,
                    edges_foldAngle: r,
                    edges_assignment: o
                })
                    , a = makeVerticesToEdgeBidirectional({
                    edges_vertices: t
                })
                    , l = n.map(( () => Pe.core.identity2x3));
                return makeFaceSpanningTree({
                    faces_vertices: n,
                    faces_faces: s
                }, c).slice(1).forEach((t => t.forEach((t => {
                        const r = t.edge_vertices.map((t => e[t]))
                            , o = t.edge_vertices.join(" ")
                            , n = a[o]
                            , s = Pe.core.subtract2(r[1], r[0])
                            , c = r[0]
                            , d = i[n] ? Pe.core.makeMatrix2Reflect(s, c) : Pe.core.identity2x3;
                        l[t.face] = Pe.core.multiplyMatrices2(l[t.parent], d)
                    }
                )))),
                    l
            }
        ;
        var ot = Object.freeze({
            __proto__: null,
            multiplyVerticesFacesMatrix2: multiplyVerticesFacesMatrix2,
            makeFacesMatrix: makeFacesMatrix,
            makeEdgesIsFolded: makeEdgesIsFolded,
            makeFacesMatrix2: makeFacesMatrix2
        });
        const makeVerticesCoordsFolded = ({vertices_coords: e, vertices_faces: t, edges_vertices: r, edges_foldAngle: o, edges_assignment: n, faces_vertices: s, faces_faces: c, faces_matrix: i}, a) => {
                i = makeFacesMatrix({
                    vertices_coords: e,
                    edges_vertices: r,
                    edges_foldAngle: o,
                    edges_assignment: n,
                    faces_vertices: s,
                    faces_faces: c
                }, a),
                t || (t = makeVerticesFaces({
                    faces_vertices: s
                }));
                const l = t.map((e => e.filter((e => null != e)).shift())).map((e => void 0 === e ? Pe.core.identity3x4 : i[e]));
                return e.map((e => Pe.core.resize(3, e))).map(( (e, t) => Pe.core.multiplyMatrix3Vector3(l[t], e)))
            }
            , makeVerticesCoordsFlatFolded = ({vertices_coords: e, edges_vertices: t, edges_foldAngle: r, edges_assignment: o, faces_vertices: n, faces_faces: s}, c=0) => {
                const i = makeEdgesIsFolded({
                    edges_vertices: t,
                    edges_foldAngle: r,
                    edges_assignment: o
                })
                    , a = [];
                n[c].forEach((t => {
                        a[t] = [...e[t]]
                    }
                ));
                const l = [];
                l[c] = !1;
                const d = makeVerticesToEdgeBidirectional({
                    edges_vertices: t
                });
                return makeFaceSpanningTree({
                    faces_vertices: n,
                    faces_faces: s
                }, c).slice(1).forEach((r => r.forEach((r => {
                        const o = r.edge_vertices.join(" ")
                            , s = d[o]
                            , c = t[s].map((e => a[e]));
                        if (void 0 === c[0] || void 0 === c[1])
                            return;
                        const u = t[s].map((t => e[t]))
                            , p = u[0]
                            , g = Pe.core.normalize2(Pe.core.subtract2(u[1], u[0]))
                            , m = Pe.core.rotate90(g);
                        l[r.face] = i[s] ? !l[r.parent] : l[r.parent];
                        const h = Pe.core.normalize2(Pe.core.subtract2(c[1], c[0]))
                            , v = c[0]
                            , _ = l[r.face] ? Pe.core.rotate270(h) : Pe.core.rotate90(h);
                        n[r.face].filter((e => void 0 === a[e])).forEach((t => {
                                const r = Pe.core.subtract2(e[t], p)
                                    , o = Pe.core.dot(r, m)
                                    , n = Pe.core.dot(r, g)
                                    , s = Pe.core.scale2(h, n)
                                    , c = Pe.core.scale2(_, o)
                                    , i = Pe.core.add2(Pe.core.add2(v, s), c);
                                a[t] = i
                            }
                        ))
                    }
                )))),
                    a
            }
        ;
        var nt = Object.freeze({
            __proto__: null,
            makeVerticesCoordsFolded: makeVerticesCoordsFolded,
            makeVerticesCoordsFlatFolded: makeVerticesCoordsFlatFolded
        });
        const makeFacesWindingFromMatrix2 = e => e.map((e => e[0] * e[3] - e[1] * e[2])).map((e => e >= 0))
            , makeFacesWinding = ({vertices_coords: e, faces_vertices: t}) => t.map((t => t.map((t => e[t])).map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => (e[1][0] - e[0][0]) * (e[1][1] + e[0][1]))).reduce(( (e, t) => e + t), 0))).map((e => e < 0));
        var st = Object.freeze({
            __proto__: null,
            makeFacesWindingFromMatrix: e => e.map((e => e[0] * e[4] - e[1] * e[3])).map((e => e >= 0)),
            makeFacesWindingFromMatrix2: makeFacesWindingFromMatrix2,
            makeFacesWinding: makeFacesWinding
        });
        const explodeFaces = e => {
                const t = e.faces_vertices.map((t => t.map((t => e.vertices_coords[t])))).reduce(( (e, t) => e.concat(t)), []);
                let r = 0;
                const o = e.faces_vertices.map((e => e.map((e => r++))));
                return {
                    vertices_coords: JSON.parse(JSON.stringify(t)),
                    faces_vertices: o
                }
            }
            , explodeShrinkFaces = ({vertices_coords: e, faces_vertices: t}, r=.333) => {
                const o = explodeFaces({
                    vertices_coords: e,
                    faces_vertices: t
                })
                    , n = makeFacesWinding(o)
                    , s = o.faces_vertices.map((e => e.map((e => o.vertices_coords[e])))).map((e => e.map(( (e, t, r) => Pe.core.subtract2(e, r[(t + 1) % r.length])))))
                    , c = makeFacesCenterQuick({
                    vertices_coords: e,
                    faces_vertices: t
                })
                    , i = t.map((t => t.map((t => e[t])))).map(( (e, t) => e.map((e => Pe.core.distance2(e, c[t])))));
                console.log("faces_point_distances", i);
                const a = s.map(( (e, t) => e.map(( (e, t, r) => [e, Pe.core.flip(r[(t - 1 + r.length) % r.length])])).map((e => n[t] ? Pe.core.counterClockwiseBisect2(...e) : Pe.core.clockwiseBisect2(...e))))).map(( (e, t) => e.map(( (e, r) => Pe.core.scale(e, i[t][r])))));
                return o.faces_vertices.forEach(( (e, t) => e.forEach(( (e, n) => {
                        o.vertices_coords[e] = Pe.core.add2(o.vertices_coords[e], Pe.core.scale2(a[t][n], -r))
                    }
                )))),
                    o
            }
        ;
        var ct = Object.freeze({
            __proto__: null,
            explodeFaces: explodeFaces,
            explodeShrinkFaces: explodeShrinkFaces
        });
        const nearestVertex = ({vertices_coords: e}, t) => {
                if (!e)
                    return;
                const r = Pe.core.resize(e[0].length, t)
                    , o = e.map(( (e, t) => ({
                    d: Pe.core.distance(r, e),
                    i: t
                }))).sort(( (e, t) => e.d - t.d)).shift();
                return o ? o.i : void 0
            }
            , nearestEdge = ({vertices_coords: e, edges_vertices: t}, r) => {
                if (!e || !t)
                    return;
                const o = t.map((t => t.map((t => e[t])))).map((e => Pe.core.nearestPointOnLine(Pe.core.subtract(e[1], e[0]), e[0], r, Pe.core.segmentLimiter)));
                return Pe.core.smallestComparisonSearch(r, o, Pe.core.distance)
            }
            , faceContainingPoint = ({vertices_coords: e, faces_vertices: t}, r) => {
                if (!e || !t)
                    return;
                const o = t.map(( (t, r) => ({
                    face: t.map((t => e[t])),
                    i: r
                }))).filter((e => Pe.core.overlapConvexPolygonPoint(e.face, r))).shift();
                return void 0 === o ? void 0 : o.i
            }
            , nearestFace = (e, t) => {
                const r = faceContainingPoint(e, t);
                if (void 0 !== r)
                    return r;
                if (e.edges_faces) {
                    const r = nearestEdge(e, t)
                        , o = e.edges_faces[r];
                    if (1 === o.length)
                        return o[0];
                    if (o.length > 1) {
                        const r = makeFacesCenterQuick({
                            vertices_coords: e.vertices_coords,
                            faces_vertices: o.map((t => e.faces_vertices[t]))
                        }).map((e => Pe.core.distance(e, t)));
                        let n = 0;
                        for (let e = 0; e < r.length; e += 1)
                            r[e] < r[n] && (n = e);
                        return o[n]
                    }
                }
            }
        ;
        var it = Object.freeze({
            __proto__: null,
            nearestVertex: nearestVertex,
            nearestEdge: nearestEdge,
            faceContainingPoint: faceContainingPoint,
            nearestFace: nearestFace
        });
        const clone = function(e) {
            let t, o;
            if (typeof e !== r)
                return e;
            if (!e)
                return e;
            if ("[object Array]" === Object.prototype.toString.apply(e)) {
                for (t = [],
                         o = 0; o < e.length; o += 1)
                    t[o] = clone(e[o]);
                return t
            }
            for (o in t = {},
                e)
                e.hasOwnProperty(o) && (t[o] = clone(e[o]));
            return t
        }
            , addVertices = (e, t, r=Pe.core.EPSILON) => {
            e.vertices_coords || (e.vertices_coords = []),
            "number" == typeof t[0] && (t = [t]);
            const o = t.map((t => e.vertices_coords.map((e => Pe.core.distance(e, t) < r)).map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e)).shift()));
            let n = e.vertices_coords.length;
            const s = t.filter(( (e, t) => void 0 === o[t]));
            return e.vertices_coords.push(...s),
                o.map((e => void 0 === e ? n++ : e))
        }
            , splitEdge = (e, t, r, o=Pe.core.EPSILON) => {
            if (e.edges_vertices.length < t)
                return {};
            const n = e.edges_vertices[t];
            r || (r = Pe.core.midpoint(...n));
            const c = n.map((t => e.vertices_coords[t])).map((e => Pe.core.distance(e, r) < o));
            if (c[0])
                return {
                    vertex: n[0],
                    edges: {}
                };
            if (c[1])
                return {
                    vertex: n[1],
                    edges: {}
                };
            const i = e.vertices_coords.length;
            e.vertices_coords[i] = r;
            const a = [0, 1].map((t => t + e.edges_vertices.length));
            ( (e, t, r) => {
                    const o = e.edges_vertices[t]
                        , n = [{
                        edges_vertices: [o[0], r]
                    }, {
                        edges_vertices: [r, o[1]]
                    }];
                    if (n.forEach((r => [u, p].filter((r => e[r] && void 0 !== e[r][t])).forEach((o => {
                            r[o] = e[o][t]
                        }
                    )))),
                    e.vertices_coords && (e.edges_length || e.edges_vector)) {
                        const t = n.map((t => t.edges_vertices.map((t => e.vertices_coords[t]))));
                        e.edges_vector && n.forEach(( (e, r) => {
                                e.edges_vector = Pe.core.subtract(t[r][1], t[r][0])
                            }
                        )),
                        e.edges_length && n.forEach(( (e, r) => {
                                e.edges_length = Pe.core.distance2(...t[r])
                            }
                        ))
                    }
                    return n
                }
            )(e, t, i).forEach(( (t, r) => Object.keys(t).forEach((o => {
                    e[o][a[r]] = t[o]
                }
            )))),
                ( ({vertices_vertices: e}, t, r) => {
                        e && (e[t] = [...r],
                            r.forEach(( (r, o, n) => {
                                    const s = n[(o + 1) % n.length]
                                        , c = e[r].indexOf(s);
                                    e[r][c] = t
                                }
                            )))
                    }
                )(e, i, n),
                ( ({vertices_coords: e, vertices_vertices: t, vertices_sectors: r}, o) => {
                        r && (r[o] = 1 === t[o].length ? [Pe.core.TWO_PI] : Pe.core.counterClockwiseSectors2(t[o].map((t => Pe.core.subtract2(e[t], e[o])))))
                    }
                )(e, i),
                ( ({vertices_edges: e}, t, r, o, n) => {
                        e && (e[r] = [...n],
                            o.map((r => e[r].indexOf(t))).forEach(( (t, r) => {
                                    e[o[r]][t] = n[r]
                                }
                            )))
                    }
                )(e, t, i, n, a);
            const l = ( ({vertices_faces: e, edges_vertices: t, edges_faces: r, faces_edges: o, faces_vertices: n}, s) => {
                    if (r && r[s])
                        return r[s];
                    const c = t[s];
                    if (void 0 !== e) {
                        const t = [];
                        for (let r = 0; r < e[c[0]].length; r += 1)
                            for (let o = 0; o < e[c[1]].length; o += 1)
                                if (e[c[0]][r] === e[c[1]][o]) {
                                    if (void 0 === e[c[0]][r])
                                        continue;
                                    t.push(e[c[0]][r])
                                }
                        return t
                    }
                    if (o) {
                        const e = [];
                        for (let t = 0; t < o.length; t += 1)
                            for (let r = 0; r < o[t].length; r += 1)
                                o[t][r] === s && e.push(t);
                        return e
                    }
                    n && console.warn("todo: findAdjacentFacesToEdge")
                }
            )(e, t);
            l && (( ({vertices_faces: e}, t, r) => {
                    e && (e[t] = [...r])
                }
            )(e, i, l),
                ( ({edges_faces: e}, t, r) => {
                        e && t.forEach((t => {
                                e[t] = [...r]
                            }
                        ))
                    }
                )(e, a, l),
                ( ({faces_vertices: e}, t, r, o) => {
                        e && o.map((t => e[t])).forEach((e => e.map(( (e, t, o) => {
                                const n = (t + 1) % o.length;
                                return e === r[0] && o[n] === r[1] || e === r[1] && o[n] === r[0] ? n : void 0
                            }
                        )).filter((e => void 0 !== e)).sort(( (e, t) => t - e)).forEach((r => e.splice(r, 0, t)))))
                    }
                )(e, i, n, l),
                ( ({edges_vertices: e, faces_vertices: t, faces_edges: r}, o) => {
                        const n = makeVerticesToEdgeBidirectional({
                            edges_vertices: e
                        });
                        o.map((e => t[e].map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => n[e.join(" ")])))).forEach(( (e, t) => {
                                r[o[t]] = e
                            }
                        ))
                    }
                )(e, l));
            const d = removeGeometryIndices(e, s, [t]);
            return a.forEach(( (e, t) => {
                    a[t] = d[a[t]]
                }
            )),
                d.splice(-2),
                d[t] = a,
                {
                    vertex: i,
                    edges: {
                        map: d,
                        new: a,
                        remove: t
                    }
                }
        }
            , rebuild_edge = (e, t, r) => {
            const o = e.edges_vertices.length
                , n = ( ({vertices_coords: e}, t, r) => {
                    const o = t.map((t => e[t])).reverse();
                    return {
                        edges_vertices: [...t],
                        edges_foldAngle: 0,
                        edges_assignment: "U",
                        edges_length: Pe.core.distance2(...o),
                        edges_vector: Pe.core.subtract(...o),
                        edges_faces: [r, r]
                    }
                }
            )(e, r, t);
            return Object.keys(n).filter((t => void 0 !== e[t])).forEach((t => {
                    e[t][o] = n[t]
                }
            )),
                o
        }
            , build_faces = (e, t, r) => {
            const o = [0, 1].map((t => e.faces_vertices.length + t));
            return ( ({edges_vertices: e, faces_vertices: t, faces_edges: r}, o, n) => {
                    const s = n.map((e => t[o].indexOf(e)))
                        , c = splitCircularArray(t[o], s).map((e => ({
                        faces_vertices: e
                    })));
                    if (r) {
                        const t = makeVerticesToEdgeBidirectional({
                            edges_vertices: e
                        });
                        c.map((e => e.faces_vertices.map(( (e, t, r) => `${e} ${r[(t + 1) % r.length]}`)).map((e => t[e])))).forEach(( (e, t) => {
                                c[t].faces_edges = e
                            }
                        ))
                    }
                    return c
                }
            )(e, t, r).forEach(( (t, r) => Object.keys(t).forEach((n => {
                    e[n][o[r]] = t[n]
                }
            )))),
                o
        }
            , at = "splitFace potentially given a non-convex face"
            , splitFace = (e, t, r, o, n) => {
            const s = intersectConvexFaceLine(e, t, r, o, n);
            if (void 0 === s)
                return;
            const i = ( (e, {vertices: t, edges: r}) => {
                    let o;
                    const n = r.map((t => {
                            const r = splitEdge(e, o ? o[t.edge] : t.edge, t.coords);
                            return o = o ? mergeNextmaps(o, r.edges.map) : r.edges.map,
                                r
                        }
                    ));
                    let s;
                    return t.push(...n.map((e => e.vertex))),
                        n.forEach((e => {
                                e.edges.remove = s ? s[e.edges.remove] : e.edges.remove;
                                const t = invertSimpleMap(e.edges.map);
                                s = s ? mergeBackmaps(s, t) : t
                            }
                        )),
                        {
                            vertices: t,
                            edges: {
                                map: o,
                                remove: n.map((e => e.edges.remove))
                            }
                        }
                }
            )(e, s);
            i.edges.new = rebuild_edge(e, t, i.vertices),
                ( ({vertices_coords: e, vertices_vertices: t, edges_vertices: r}, o) => {
                        const n = r[o][0]
                            , s = r[o][1];
                        t[n] = sortVerticesCounterClockwise({
                            vertices_coords: e
                        }, t[n].concat(s), n),
                            t[s] = sortVerticesCounterClockwise({
                                vertices_coords: e
                            }, t[s].concat(n), s)
                    }
                )(e, i.edges.new),
                ( ({edges_vertices: e, vertices_edges: t, vertices_vertices: r}, o) => {
                        if (!t || !r)
                            return;
                        const n = e[o];
                        n.map((e => r[e])).map(( (e, t) => e.indexOf(n[(t + 1) % n.length]))).forEach(( (e, r) => t[n[r]].splice(e, 0, o)))
                    }
                )(e, i.edges.new);
            const a = build_faces(e, t, i.vertices);
            ( (e, t, r) => {
                    const o = {};
                    r.forEach((t => e.faces_vertices[t].forEach((e => {
                            o[e] || (o[e] = []),
                                o[e].push(t)
                        }
                    )))),
                        e.faces_vertices[t].forEach((r => {
                                const n = e.vertices_faces[r].indexOf(t)
                                    , s = o[r];
                                -1 !== n && s ? e.vertices_faces[r].splice(n, 1, ...s) : console.warn(at)
                            }
                        ))
                }
            )(e, t, a),
                ( (e, t, r, o) => {
                        const n = {};
                        o.forEach((t => e.faces_edges[t].forEach((e => {
                                n[e] || (n[e] = []),
                                    n[e].push(t)
                            }
                        )))),
                            [...e.faces_edges[t], r].forEach((r => {
                                    const o = n[r]
                                        , s = [];
                                    for (let o = 0; o < e.edges_faces[r].length; o += 1)
                                        e.edges_faces[r][o] === t && s.push(o);
                                    if (0 === s.length || !o)
                                        return void console.warn(at);
                                    s.reverse().forEach((t => e.edges_faces[r].splice(t, 1)));
                                    const c = s[s.length - 1];
                                    e.edges_faces[r].splice(c, 0, ...o)
                                }
                            ))
                    }
                )(e, t, i.edges.new, a),
                ( ({faces_vertices: e, faces_faces: t}, r, o) => {
                        const n = t[r]
                            , s = o.map((t => e[t]))
                            , c = n.map((t => {
                                const r = e[t]
                                    , n = [0, 0];
                                for (let e = 0; e < s.length; e += 1) {
                                    let t = 0;
                                    for (let o = 0; o < r.length; o += 1)
                                        -1 !== s[e].indexOf(r[o]) && (t += 1);
                                    n[e] = t
                                }
                                return n[0] >= 2 ? o[0] : n[1] >= 2 ? o[1] : void 0
                            }
                        ));
                        o.forEach(( (e, r, n) => {
                                t[e] = [n[(r + 1) % o.length]]
                            }
                        )),
                            n.forEach(( (e, o) => {
                                    for (let n = 0; n < t[e].length; n += 1)
                                        t[e][n] === r && (t[e][n] = c[o],
                                            t[c[o]].push(e))
                                }
                            ))
                    }
                )(e, t, a);
            const l = removeGeometryIndices(e, c, [t]);
            return a.forEach(( (e, t) => {
                    a[t] = l[a[t]]
                }
            )),
                l.splice(-2),
                l[t] = a,
                i.faces = {
                    map: l,
                    new: a,
                    remove: t
                },
                i
        }
            , lt = {};
        lt.prototype = Object.create(Object.prototype),
            lt.prototype.constructor = lt;
        const dt = Object.assign({
            clean: clean,
            validate: validate$1,
            populate: populate,
            fragment: fragment,
            addVertices: addVertices,
            splitEdge: splitEdge,
            faceSpanningTree: makeFaceSpanningTree,
            explodeFaces: explodeFaces,
            explodeShrinkFaces: explodeShrinkFaces
        }, Qe);
        Object.keys(dt).forEach((e => {
                lt.prototype[e] = function() {
                    return dt[e](this, ...arguments)
                }
            }
        )),
            lt.prototype.splitFace = function(e, ...t) {
                const r = Pe.core.getLine(...t);
                return splitFace(this, e, r.vector, r.origin)
            }
            ,
            lt.prototype.copy = function() {
                return Object.assign(Object.create(Object.getPrototypeOf(this)), clone(this))
            }
            ,
            lt.prototype.clear = function() {
                return Le.graph.forEach((e => delete this[e])),
                    Le.orders.forEach((e => delete this[e])),
                    delete this.file_frames,
                    this
            }
            ,
            lt.prototype.boundingBox = function() {
                return Pe.rect.fromPoints(this.vertices_coords)
            }
            ,
            lt.prototype.unitize = function() {
                if (!this.vertices_coords)
                    return this;
                const e = Pe.core.bounding_box(this.vertices_coords)
                    , t = Math.max(...e.span)
                    , r = 0 === t ? 1 : 1 / t
                    , o = e.min;
                return this.vertices_coords = this.vertices_coords.map((e => Pe.core.subtract(e, o))).map((e => e.map((e => e * r)))),
                    this
            }
            ,
            lt.prototype.folded = function() {
                const e = this.faces_matrix2 ? multiplyVerticesFacesMatrix2(this, this.faces_matrix2) : makeVerticesCoordsFolded(this, ...arguments);
                return Object.assign(Object.create(Object.getPrototypeOf(this)), Object.assign(clone(this), {
                    vertices_coords: e,
                    frame_classes: [v]
                }))
            }
            ,
            lt.prototype.flatFolded = function() {
                const e = this.faces_matrix2 ? multiplyVerticesFacesMatrix2(this, this.faces_matrix2) : makeVerticesCoordsFlatFolded(this, ...arguments);
                return Object.assign(Object.create(Object.getPrototypeOf(this)), Object.assign(clone(this), {
                    vertices_coords: e,
                    frame_classes: [v]
                }))
            }
        ;
        const shortenKeys = function(e) {
            const t = Object.create(null);
            return Object.keys(e).forEach((r => {
                    t[r.substring(this.length + 1)] = e[r]
                }
            )),
                t
        }
            , getComponent = function(e) {
            return transposeGraphArrays(this, e).map(shortenKeys.bind(e)).map(we[e].bind(this))
        };
        [n, s, c].forEach((e => Object.defineProperty(lt.prototype, e, {
            enumerable: !0,
            get: function() {
                return getComponent.call(this, e)
            }
        }))),
            Object.defineProperty(lt.prototype, g, {
                enumerable: !0,
                get: function() {
                    const e = getBoundary(this)
                        , t = e.vertices.map((e => this.vertices_coords[e]));
                    return Object.keys(e).forEach((r => {
                            t[r] = e[r]
                        }
                    )),
                        Object.assign(t, e)
                }
            });
        const ft = {
            vertices: nearestVertex,
            edges: nearestEdge,
            faces: nearestFace
        };
        lt.prototype.nearest = function() {
            const e = Pe.core.getVector(arguments)
                , t = Object.create(null)
                , r = {};
            return [n, s, c].forEach((o => {
                    Object.defineProperty(t, ze[o], {
                        enumerable: !0,
                        get: () => (void 0 !== r[o] || (r[o] = ft[o](this, e)),
                            r[o])
                    }),
                        filterKeysWithPrefix(this, o).forEach((e => Object.defineProperty(t, e, {
                            enumerable: !0,
                            get: () => this[e][t[ze[o]]]
                        })))
                }
            )),
                t
        }
        ;
        var ut = lt.prototype;
        const clip = function(e, t) {
                const r = getBoundary(e).vertices.map((t => e.vertices_coords[t]))
                    , o = t.vector ? t.vector : Pe.core.subtract2(t[1], t[0])
                    , n = t.origin ? t.origin : t[0]
                    , s = t.domain_function ? t.domain_function : Pe.core.includeL;
                return Pe.core.clipLineConvexPolygon(r, o, n, Pe.core.include, s)
            }
            , addEdges = (e, t) => {
                e.edges_vertices || (e.edges_vertices = []),
                "number" == typeof t[0] && (t = [t]);
                const r = t.map(( (t, r) => e.edges_vertices.length + r));
                e.edges_vertices.push(...t);
                const o = removeDuplicateEdges(e).map;
                return r.map((e => o[e]))
            }
            , addPlanarSegment = (e, t, r, o=Pe.core.EPSILON) => {
                e.vertices_sectors || (e.vertices_sectors = makeVerticesSectors(e));
                const n = [t, r].map((e => [e[0], e[1]]))
                    , s = Pe.core.subtract2(n[1], n[0])
                    , c = makeEdgesSegmentIntersection(e, n[0], n[1], o)
                    , i = c.map(( (e, t) => void 0 === e ? void 0 : t)).filter((e => void 0 !== e)).sort(( (e, t) => e - t))
                    , a = {};
                i.forEach((t => e.edges_faces[t].forEach((e => {
                        a[e] = !0
                    }
                ))));
                const l = Object.keys(a).map((e => parseInt(e, 10))).sort(( (e, t) => e - t))
                    , d = i.reverse().map((t => splitEdge(e, t, c[t], o))).map((e => e.vertex))
                    , u = addVertices(e, n, o)
                    , p = {};
                d.forEach((e => {
                        p[e] = !0
                    }
                )),
                    u.forEach((e => {
                            p[e] = !0
                        }
                    ));
                const g = Object.keys(p).map((e => parseInt(e, 10)))
                    , m = sortVerticesAlongVector(e, g, s)
                    , h = makeVerticesToEdgeBidirectional(e)
                    , v = ( (e, t, r) => {
                        const o = Array.from(Array(t.length - 1)).map(( (e, r) => [t[r], t[r + 1]]))
                            , n = o.map((e => e.join(" "))).map((e => void 0 === r[e]))
                            , s = o.filter(( (e, t) => n[t]))
                            , c = Array.from(Array(s.length)).map(( (t, r) => e.edges_vertices.length + r));
                        c.forEach(( (t, r) => {
                                e.edges_vertices[t] = s[r]
                            }
                        )),
                        e.edges_assignment && c.forEach((t => {
                                e.edges_assignment[t] = "U"
                            }
                        )),
                        e.edges_foldAngle && c.forEach((t => {
                                e.edges_foldAngle[t] = 0
                            }
                        ));
                        for (let r = 0; r < t.length; r += 1) {
                            const o = t[r]
                                , s = [n[r - 1] ? t[r - 1] : void 0, n[r] ? t[r + 1] : void 0].filter((e => void 0 !== e))
                                , c = (e.vertices_vertices[o] ? e.vertices_vertices[o] : []).concat(s);
                            e.vertices_vertices[o] = sortVerticesCounterClockwise(e, c, t[r])
                        }
                        const i = makeVerticesToEdgeBidirectional(e);
                        for (let r = 0; r < t.length; r += 1) {
                            const o = t[r];
                            e.vertices_edges[o] = e.vertices_vertices[o].map((e => i[`${o} ${e}`]))
                        }
                        return t.map((t => 1 === e.vertices_vertices[t].length ? [Pe.core.TWO_PI] : Pe.core.counterClockwiseSectors2(e.vertices_vertices[t].map((r => Pe.core.subtract2(e.vertices_coords[r], e.vertices_coords[t])))))).forEach(( (r, o) => {
                                e.vertices_sectors[t[o]] = r
                            }
                        )),
                            c
                    }
                )(e, m, h);
                v.forEach((t => {
                        const r = e.edges_vertices[t];
                        h[`${r[0]} ${r[1]}`] = t,
                            h[`${r[1]} ${r[0]}`] = t
                    }
                ));
                const _ = m.map((t => e.vertices_vertices[t].map((e => [[e, t], [t, e]])))).reduce(( (e, t) => e.concat(t)), []).reduce(( (e, t) => e.concat(t)), [])
                    , y = {}
                    , b = _.map((t => counterClockwiseWalk(e, t[0], t[1], y))).filter((e => void 0 !== e))
                    , E = filterWalkedBoundaryFace(b);
                removeGeometryIndices(e, "faces", l);
                const x = E.map(( (t, r) => e.faces_vertices.length + r));
                return e.faces_vertices && x.forEach(( (t, r) => {
                        e.faces_vertices[t] = E[r].vertices
                    }
                )),
                e.faces_edges && x.forEach(( (t, r) => {
                        e.faces_edges[t] = E[r].edges.map((e => h[e]))
                    }
                )),
                e.faces_angles && x.forEach(( (t, r) => {
                        e.faces_angles[t] = E[r].faces_angles
                    }
                )),
                e.vertices_faces && (e.vertices_faces = makeVerticesFaces(e)),
                e.edges_faces && (e.edges_faces = makeEdgesFacesUnsorted(e)),
                e.faces_faces && (e.faces_faces = makeFacesFaces(e)),
                e.vertices_coords.length === e.vertices_vertices.length && e.vertices_coords.length === e.vertices_edges.length && e.vertices_coords.length === e.vertices_faces.length || console.warn("vertices mismatch", JSON.parse(JSON.stringify(e))),
                e.edges_vertices.length === e.edges_faces.length && e.edges_vertices.length === e.edges_assignment.length || console.warn("edges mismatch", JSON.parse(JSON.stringify(e))),
                e.faces_vertices.length === e.faces_edges.length && e.faces_vertices.length === e.faces_faces.length || console.warn("faces mismatch", JSON.parse(JSON.stringify(e))),
                    v
            }
            , removePlanarEdge = (e, t) => {
                const r = [...e.edges_vertices[t]].sort(( (e, t) => t - e))
                    , o = [...e.edges_faces[t]];
                ( ({vertices_vertices: e}, t) => {
                        const r = [t[1], t[0]];
                        t.map(( (t, o) => e[t].indexOf(r[o]))).forEach(( (r, o) => e[t[o]].splice(r, 1)))
                    }
                )(e, r),
                    ( ({vertices_edges: e}, t, r) => {
                            r.map(( (r, o) => e[r].indexOf(t))).forEach(( (t, o) => e[r[o]].splice(t, 1)))
                        }
                    )(e, t, r);
                const n = r.map((t => 0 === e.vertices_vertices[t].length))
                    , s = r.filter(( (e, t) => n[t]));
                if (2 === o.length && o[0] !== o[1]) {
                    const n = e.faces_vertices.length
                        , s = ( (e, t, r, o) => {
                            const n = t.map((t => e.faces_edges[t].indexOf(r)))
                                , s = [];
                            t.forEach(( (t, r) => e.faces_vertices[t].forEach(( (e, t, n) => {
                                    const c = n[(t + 1) % n.length];
                                    (e === o[0] && c === o[1] || e === o[1] && c === o[0]) && (s[r] = t)
                                }
                            )))),
                            void 0 !== s[0] && void 0 !== s[1] || console.warn("removePlanarEdge error joining faces");
                            const c = t.map((t => e.faces_edges[t].length))
                                , i = t.map((t => e.faces_vertices[t].length))
                                , a = c.map((e => e - 1))
                                , l = i.map((e => e - 1))
                                , d = n.map(( (e, t) => (e + 1) % c[t]))
                                , u = s.map(( (e, t) => (e + 1) % i[t]))
                                , p = t.map(( (t, r) => Array.from(Array(a[r])).map(( (e, t) => (d[r] + t) % c[r])).map((r => e.faces_edges[t][r]))))
                                , g = t.map(( (t, r) => Array.from(Array(l[r])).map(( (e, t) => (u[r] + t) % i[r])).map((r => e.faces_vertices[t][r]))))
                                , m = t.map((t => e.faces_faces[t])).reduce(( (e, t) => e.concat(t)), []).filter((e => e !== t[0] && e !== t[1]));
                            return {
                                vertices: g[0].concat(g[1]),
                                edges: p[0].concat(p[1]),
                                faces: m
                            }
                        }
                    )(e, o, t, r);
                    e.faces_vertices.push(s.vertices),
                        e.faces_edges.push(s.edges),
                        e.faces_faces.push(s.faces),
                        e.vertices_faces.forEach(( (t, r) => {
                                let s = !1;
                                t.forEach(( (c, i) => {
                                        if (c === o[0] || c === o[1]) {
                                            e.vertices_faces[r][i] = n;
                                            const o = s ? [r, 1] : [r, 1, n];
                                            t.splice(...o),
                                                s = !0
                                        }
                                    }
                                ))
                            }
                        )),
                        e.edges_faces.forEach(( (t, r) => t.forEach(( (t, s) => {
                                t !== o[0] && t !== o[1] || (e.edges_faces[r][s] = n)
                            }
                        )))),
                        e.faces_faces.forEach(( (t, r) => t.forEach(( (t, s) => {
                                t !== o[0] && t !== o[1] || (e.faces_faces[r][s] = n)
                            }
                        )))),
                        e.faces_vertices.forEach((t => t.forEach((t => {
                                void 0 === t && console.log("FOUND ONE before remove", e.faces_vertices)
                            }
                        )))),
                        removeGeometryIndices(e, "faces", o)
                }
                if (2 === o.length && o[0] === o[1] && s.length) {
                    const r = o[0];
                    e.faces_vertices[r] = e.faces_vertices[r].filter((e => !s.includes(e))).filter(( (e, t, r) => e !== r[(t + 1) % r.length])),
                        e.faces_edges[r] = e.faces_edges[r].filter((e => e !== t))
                }
                removeGeometryIndices(e, "edges", [t]),
                    removeGeometryIndices(e, "vertices", s)
            }
            , removePlanarVertex = (e, t) => {
                const r = e.vertices_edges[t]
                    , o = uniqueSortedIntegers(e.vertices_faces[t].filter((e => null != e)));
                if (2 !== r.length || o.length > 2)
                    return void console.warn("cannot remove non 2-degree vertex yet (e,f)", r, o);
                const n = ( (e, t, r) => (r.forEach((r => {
                        e.edges_vertices[r][0] === t && e.edges_vertices[r][1] === t && console.warn("removePlanarVertex circular edge")
                    }
                )),
                    r.map((r => e.edges_vertices[r][0] === t ? e.edges_vertices[r][1] : e.edges_vertices[r][0]))))(e, t, r)
                    , s = n.slice().reverse();
                r.sort(( (e, t) => e - t)),
                    n.forEach((t => {
                            const o = e.vertices_edges[t].indexOf(r[1]);
                            -1 !== o && (e.vertices_edges[t][o] = r[0])
                        }
                    )),
                    n.forEach(( (r, o) => {
                            const n = e.vertices_vertices[r].indexOf(t);
                            -1 !== n ? e.vertices_vertices[r][n] = s[o] : console.warn("removePlanarVertex unknown vertex issue")
                        }
                    )),
                    e.edges_vertices[r[0]] = [...n],
                    o.forEach((r => {
                            const o = e.faces_vertices[r].indexOf(t);
                            -1 !== o ? e.faces_vertices[r].splice(o, 1) : console.warn("removePlanarVertex unknown face_vertex issue")
                        }
                    )),
                    o.forEach((t => {
                            const o = e.faces_edges[t].indexOf(r[1]);
                            -1 !== o ? e.faces_edges[t].splice(o, 1) : console.warn("removePlanarVertex unknown face_edge issue")
                        }
                    )),
                    removeGeometryIndices(e, "vertices", [t]),
                    removeGeometryIndices(e, "edges", [r[1]])
            }
            , alternatingSum = e => [0, 1].map((t => e.filter(( (e, r) => r % 2 === t)).reduce(( (e, t) => e + t), 0)))
            , kawasakiSolutionsRadians = e => e.map(( (e, t, r) => [e, r[(t + 1) % r.length]])).map((e => Pe.core.counterClockwiseAngleRadians(...e))).map(( (e, t, r) => r.slice(t + 1, r.length).concat(r.slice(0, t)))).map((e => alternatingSum(e).map((e => Math.PI - e)))).map(( (t, r) => e[r] + t[0])).map(( (t, r) => Pe.core.isCounterClockwiseBetween(t, e[r], e[(r + 1) % e.length]) ? t : void 0))
            , kawasakiSolutionsVectors = e => {
                const t = e.map((e => Math.atan2(e[1], e[0])));
                return kawasakiSolutionsRadians(t).map((e => void 0 === e ? void 0 : [Math.cos(e), Math.sin(e)]))
            }
        ;
        var pt = Object.freeze({
            __proto__: null,
            alternatingSum: alternatingSum,
            alternatingSumDifference: e => {
                const t = e.reduce(( (e, t) => e + t), 0) / 2;
                return alternatingSum(e).map((e => e - t))
            }
            ,
            kawasakiSolutionsRadians: kawasakiSolutionsRadians,
            kawasakiSolutionsVectors: kawasakiSolutionsVectors
        });
        const gt = {
                B: !0,
                b: !0,
                F: !0,
                f: !0,
                U: !0,
                u: !0
            }
            , vertices_flat = ({vertices_edges: e, edges_assignment: t}) => e.map((e => e.map((e => gt[t[e]])).reduce(( (e, t) => e && t), !0))).map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e))
            , mt = {
                M: !0,
                m: !0,
                V: !0,
                v: !0
            }
            , ht = {
                M: -1,
                m: -1,
                V: 1,
                v: 1
            }
            , validateMaekawa = ({edges_vertices: e, vertices_edges: t, edges_assignment: r}) => {
                t || (t = makeVerticesEdgesUnsorted({
                    edges_vertices: e
                }));
                const o = t.map((e => e.map((e => ht[r[e]])).filter((e => void 0 !== e)).reduce(( (e, t) => e + t), 0))).map((e => 2 === e || -2 === e));
                return getBoundaryVertices({
                    edges_vertices: e,
                    edges_assignment: r
                }).forEach((e => {
                        o[e] = !0
                    }
                )),
                    vertices_flat({
                        vertices_edges: t,
                        edges_assignment: r
                    }).forEach((e => {
                            o[e] = !0
                        }
                    )),
                    o.map(( (e, t) => e ? void 0 : t)).filter((e => void 0 !== e))
            }
            , validateKawasaki = ({vertices_coords: e, vertices_vertices: t, vertices_edges: r, edges_vertices: o, edges_assignment: n, edges_vector: s}, c=Pe.core.EPSILON) => {
                t || (t = makeVerticesVertices({
                    vertices_coords: e,
                    vertices_edges: r,
                    edges_vertices: o
                }));
                const i = makeVerticesVerticesVector({
                    vertices_coords: e,
                    vertices_vertices: t,
                    edges_vertices: o,
                    edges_vector: s
                }).map(( (e, t) => e.filter(( (e, o) => mt[n[r[t][o]]])))).map((e => e.length > 1 ? Pe.core.counterClockwiseSectors2(e) : [0, 0])).map((e => alternatingSum(e))).map((e => Math.abs(e[0] - e[1]) < c));
                return getBoundaryVertices({
                    edges_vertices: o,
                    edges_assignment: n
                }).forEach((e => {
                        i[e] = !0
                    }
                )),
                    vertices_flat({
                        vertices_edges: r,
                        edges_assignment: n
                    }).forEach((e => {
                            i[e] = !0
                        }
                    )),
                    i.map(( (e, t) => e ? void 0 : t)).filter((e => void 0 !== e))
            }
        ;
        var vt = Object.freeze({
            __proto__: null,
            validateMaekawa: validateMaekawa,
            validateKawasaki: validateKawasaki
        });
        const _t = {};
        _t.prototype = Object.create(ut),
            _t.prototype.constructor = _t;
        const make_edges_array = function(e) {
            return e.mountain = (t=-180) => (e.forEach((e => {
                    this.edges_assignment[e] = "M",
                        this.edges_foldAngle[e] = t
                }
            )),
                e),
                e.valley = (t=180) => (e.forEach((e => {
                        this.edges_assignment[e] = "V",
                            this.edges_foldAngle[e] = t
                    }
                )),
                    e),
                e.flat = () => (e.forEach((e => {
                        this.edges_assignment[e] = "F",
                            this.edges_foldAngle[e] = 0
                    }
                )),
                    e),
                e
        };
        ["line", "ray", "segment"].forEach((e => {
                _t.prototype[e] = function() {
                    const t = Pe[e](...arguments);
                    if (!t)
                        return;
                    const r = clip(this, t);
                    if (!r)
                        return;
                    const o = addPlanarSegment(this, r[0], r[1]);
                    return make_edges_array.call(this, o)
                }
            }
        )),
            ["circle", "ellipse", "rect", "polygon"].forEach((e => {
                    _t.prototype[e] = function() {
                        const t = Pe[e](...arguments);
                        if (!t)
                            return;
                        const r = t.segments(96).map((e => Pe.segment(e))).map((e => clip(this, e))).filter((e => void 0 !== e));
                        if (!r)
                            return;
                        const o = []
                            , n = [];
                        r.forEach((e => {
                                const t = addVertices(this, e);
                                o.push(...t),
                                    n.push(...addEdges(this, t))
                            }
                        ));
                        const {map: s} = fragment(this).edges;
                        return populate(this),
                            make_edges_array.call(this, n.map((e => s[e])).reduce(( (e, t) => e.concat(t)), []))
                    }
                }
            )),
            _t.prototype.removeEdge = function(e) {
                const t = this.edges_vertices[e];
                return removePlanarEdge(this, e),
                    t.map((e => isVertexCollinear(this, e))).map(( (e, r) => e ? t[r] : void 0)).filter((e => void 0 !== e)).sort(( (e, t) => t - e)).forEach((e => removePlanarVertex(this, e))),
                    !0
            }
            ,
            _t.prototype.validate = function(e) {
                const t = validate$1(this, e);
                return t.vertices.kawasaki = validateKawasaki(this, e),
                    t.vertices.maekawa = validateMaekawa(this),
                this.edges_foldAngle && (t.edges.not_flat = this.edges_foldAngle.map(( (e, t) => edgeFoldAngleIsFlat(e) ? void 0 : t)).filter((e => void 0 !== e))),
                "valid" === t.summary && (t.vertices.kawasaki.length || t.vertices.maekawa.length ? t.summary = "invalid" : t.edges.not_flat.length && (t.summary = "not flat")),
                    t
            }
        ;
        var yt = _t.prototype;
        const make_face_side = (e, t, r, o) => {
            const n = Pe.core.subtract2(r, t)
                , s = Pe.core.cross2(e, n);
            return o ? s > 0 : s < 0
        }
            , make_face_center = (e, t) => e.faces_vertices[t] ? e.faces_vertices[t].map((t => e.vertices_coords[t])).reduce(( (e, t) => [e[0] + t[0], e[1] + t[1]]), [0, 0]).map((r => r / e.faces_vertices[t].length)) : [0, 0]
            , bt = {
            F: !0,
            f: !0,
            U: !0,
            u: !0
        }
            , Et = {
            M: "V",
            m: "V",
            V: "M",
            v: "M"
        }
            , face_snapshot = (e, t) => ({
            center: e.faces_center[t],
            matrix: e.faces_matrix2[t],
            winding: e.faces_winding[t],
            crease: e.faces_crease[t],
            side: e.faces_side[t],
            layer: e.faces_layer[t]
        })
            , flatFold = (e, t, r, o="V", n=Pe.core.EPSILON) => {
            const s = Et[c = o] || c;
            var c;
            populate(e),
            e.faces_layer || (e.faces_layer = Array(e.faces_vertices.length).fill(0)),
                e.faces_center = e.faces_vertices.map(( (t, r) => make_face_center(e, r))),
            e.faces_matrix2 || (e.faces_matrix2 = makeFacesMatrix2(e, 0)),
                e.faces_winding = makeFacesWindingFromMatrix2(e.faces_matrix2),
                e.faces_crease = e.faces_matrix2.map(Pe.core.invertMatrix2).map((e => Pe.core.multiplyMatrix2Line2(e, t, r))),
                e.faces_side = e.faces_vertices.map(( (t, r) => make_face_side(e.faces_crease[r].vector, e.faces_crease[r].origin, e.faces_center[r], e.faces_winding[r])));
            const i = multiplyVerticesFacesMatrix2(e, e.faces_matrix2)
                , a = makeEdgesLineParallelOverlap({
                vertices_coords: i,
                edges_vertices: e.edges_vertices
            }, t, r, n).map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e)).filter((t => bt[e.edges_assignment[t]]));
            a.map((t => e.edges_faces[t].find((e => null != e)))).map((t => e.faces_winding[t])).map((e => e ? o : s)).forEach(( (t, r) => {
                    e.edges_assignment[a[r]] = t,
                        e.edges_foldAngle[a[r]] = edgeAssignmentToFoldAngle(t)
                }
            ));
            const l = face_snapshot(e, 0)
                , d = e.faces_vertices.map(( (e, t) => t)).reverse().map((t => {
                    const r = face_snapshot(e, t)
                        , c = splitFace(e, t, r.crease.vector, r.crease.origin, n);
                    if (void 0 === c)
                        return;
                    e.edges_assignment[c.edges.new] = r.winding ? o : s,
                        e.edges_foldAngle[c.edges.new] = edgeAssignmentToFoldAngle(e.edges_assignment[c.edges.new]);
                    return c.faces.map[c.faces.remove].forEach((t => {
                            e.faces_center[t] = make_face_center(e, t),
                                e.faces_side[t] = make_face_side(r.crease.vector, r.crease.origin, e.faces_center[t], r.winding),
                                e.faces_layer[t] = r.layer
                        }
                    )),
                        c
                }
            )).filter((e => void 0 !== e))
                , u = mergeNextmaps(...d.map((e => e.faces.map)))
                , p = mergeNextmaps(...d.map((e => e.edges.map)).filter((e => void 0 !== e)))
                , g = d.map((e => e.faces.remove)).reverse();
            e.faces_layer = ( (e, t) => {
                    const r = []
                        , o = e.map(( (e, t) => t))
                        , n = o.filter((e => t[e]))
                        , s = o.filter((e => !t[e]));
                    return s.sort(( (t, r) => e[t] - e[r])).forEach(( (e, t) => {
                            r[e] = t
                        }
                    )),
                        n.sort(( (t, r) => e[r] - e[t])).forEach(( (e, t) => {
                                r[e] = s.length + t
                            }
                        )),
                        r
                }
            )(e.faces_layer, e.faces_side);
            const m = u && u[0] && 2 === u[0].length
                , h = m ? u[0].filter((t => e.faces_side[t])).shift() : 0;
            let v = l.matrix;
            return o !== s && (v = m || e.faces_side[0] ? Pe.core.multiplyMatrices2(l.matrix, Pe.core.makeMatrix2Reflect(l.crease.vector, l.crease.origin)) : l.matrix),
                e.faces_matrix2 = makeFacesMatrix2(e, h).map((e => Pe.core.multiplyMatrices2(v, e))),
                delete e.faces_center,
                delete e.faces_winding,
                delete e.faces_crease,
                delete e.faces_side,
                {
                    faces: {
                        map: u,
                        remove: g
                    },
                    edges: {
                        map: p
                    }
                }
        }
            , xt = {};
        xt.prototype = Object.create(ut),
            xt.prototype.constructor = xt,
            xt.prototype.flatFold = function() {
                const e = Pe.core.getLine(arguments);
                return flatFold(this, e.vector, e.origin),
                    this
            }
        ;
        var Ot = xt.prototype;
        const isFoldedForm = e => e.frame_classes && e.frame_classes.includes("foldedForm") || e.file_classes && e.file_classes.includes("foldedForm");
        var kt = Object.freeze({
            __proto__: null,
            isFoldedForm: isFoldedForm
        });
        const makeEdgesEdgesSimilar = ({vertices_coords: e, edges_vertices: t, edges_coords: r}, o=Pe.core.EPSILON) => {
                r || (r = makeEdgesCoords({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const n = makeEdgesBoundingBox({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_coords: r
                })
                    , s = Array.from(Array(r.length)).map(( () => []))
                    , c = n.length ? n[0].min.length : 0;
                for (let e = 0; e < r.length - 1; e += 1)
                    for (let t = e + 1; t < r.length; t += 1) {
                        let r = !0;
                        for (let s = 0; s < c; s += 1)
                            Pe.core.fnEpsilonEqual(n[e].min[s], n[t].min[s], o) && Pe.core.fnEpsilonEqual(n[e].max[s], n[t].max[s], o) || (r = !1);
                        s[e][t] = r,
                            s[t][e] = r
                    }
                for (let e = 0; e < r.length - 1; e += 1)
                    for (let t = e + 1; t < r.length; t += 1) {
                        if (!s[e][t])
                            continue;
                        const n = Pe.core.fnEpsilonEqualVectors(r[e][0], r[t][0], o) && Pe.core.fnEpsilonEqualVectors(r[e][1], r[t][1], o)
                            , c = Pe.core.fnEpsilonEqualVectors(r[e][0], r[t][1], o) && Pe.core.fnEpsilonEqualVectors(r[e][1], r[t][0], o)
                            , i = n || c;
                        s[e][t] = i,
                            s[t][e] = i
                    }
                return booleanMatrixToIndexedArray(s)
            }
            , makeEdgesEdgesParallel = ({vertices_coords: e, edges_vertices: t, edges_vector: r}, o) => {
                r || (r = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const n = r.length
                    , s = r.map((e => Pe.core.normalize(e)))
                    , c = Array.from(Array(n)).map(( () => Array.from(Array(n))));
                for (let e = 0; e < n - 1; e += 1)
                    for (let t = e + 1; t < n; t += 1) {
                        const r = 1 - Math.abs(Pe.core.dot(s[e], s[t])) < o;
                        c[e][t] = r,
                            c[t][e] = r
                    }
                return c
            }
            , overwriteEdgesOverlaps = (e, t, r, o, n) => {
                for (let s = 0; s < e.length - 1; s += 1)
                    for (let c = s + 1; c < e.length; c += 1)
                        e[s][c] && (e[s][c] = Pe.core.overlapLineLine(t[s], r[s], t[c], r[c], o, o, n),
                            e[c][s] = e[s][c])
            }
            , makeEdgesEdgesParallelOverlap = ({vertices_coords: e, edges_vertices: t, edges_vector: r}, o) => {
                r || (r = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const n = t.map((t => e[t[0]]))
                    , s = makeEdgesEdgesParallel({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_vector: r
                }, o);
                return overwriteEdgesOverlaps(s, r, n, Pe.core.excludeS, o),
                    s
            }
        ;
        var At = Object.freeze({
            __proto__: null,
            makeEdgesEdgesSimilar: makeEdgesEdgesSimilar,
            makeEdgesEdgesParallel: makeEdgesEdgesParallel,
            makeEdgesEdgesCrossing: ({vertices_coords: e, edges_vertices: t, edges_vector: r}, o) => {
                r || (r = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const n = t.map((t => e[t[0]]))
                    , s = makeEdgesEdgesParallel({
                    vertices_coords: e,
                    edges_vertices: t,
                    edges_vector: r
                }, o).map((e => e.map((e => !e))));
                for (let e = 0; e < s.length; e += 1)
                    s[e][e] = void 0;
                return overwriteEdgesOverlaps(s, r, n, Pe.core.excludeS, o),
                    s
            }
            ,
            makeEdgesEdgesParallelOverlap: makeEdgesEdgesParallelOverlap
        });
        const makeEdgesFacesOverlap = ({vertices_coords: e, edges_vertices: t, edges_vector: r, edges_faces: o, faces_vertices: n}, s) => {
                r || (r = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: t
                }));
                const c = makeFacesWinding({
                    vertices_coords: e,
                    faces_vertices: n
                })
                    , i = t.map((t => e[t[0]]))
                    , a = t.map(( () => Array.from(Array(n.length))));
                o.forEach(( (e, t) => e.forEach((e => {
                        a[t][e] = !1
                    }
                ))));
                const l = makeEdgesEdgesSimilar({
                    vertices_coords: e,
                    edges_vertices: t
                })
                    , d = t.map((t => t.map((t => e[t]))))
                    , u = n.map((t => t.map((t => e[t]))));
                for (let e = 0; e < c.length; e += 1)
                    c[e] || u[e].reverse();
                const p = makeEdgesBoundingBox({
                    edges_coords: d
                })
                    , g = u.map((e => Pe.core.boundingBox(e)));
                for (let e = 0; e < a.length; e += 1)
                    for (let t = 0; t < a[e].length; t += 1)
                        !1 !== a[e][t] && (Pe.core.overlapBoundingBoxes(g[t], p[e]) || (a[e][t] = !1));
                const m = {};
                for (let e = 0; e < a.length; e += 1)
                    if (!m[e]) {
                        for (let t = 0; t < a[e].length; t += 1) {
                            if (void 0 !== a[e][t])
                                continue;
                            if (d[e].map((e => Pe.core.overlapConvexPolygonPoint(u[t], e, Pe.core.exclude, s))).reduce(( (e, t) => e || t), !1)) {
                                a[e][t] = !0;
                                continue
                            }
                            Pe.core.intersectConvexPolygonLine(u[t], r[e], i[e], Pe.core.excludeS, Pe.core.excludeS, s) ? a[e][t] = !0 : a[e][t] = !1
                        }
                        l[e].forEach((t => {
                                a[t] = a[e].slice(),
                                    m[t] = !0
                            }
                        ))
                    }
                return a
            }
            , makeFacesFacesOverlap = ({vertices_coords: e, faces_vertices: t}, r=Pe.core.EPSILON) => {
                const o = Array.from(Array(t.length)).map(( () => Array.from(Array(t.length))))
                    , n = t.map((t => t.map((t => e[t]))))
                    , s = n.map((e => Pe.core.boundingBox(e)));
                for (let e = 0; e < s.length - 1; e += 1)
                    for (let t = e + 1; t < s.length; t += 1)
                        Pe.core.overlapBoundingBoxes(s[e], s[t]) || (o[e][t] = !1,
                            o[t][e] = !1);
                const c = n.map((e => Pe.core.makePolygonNonCollinear(e, r)));
                for (let e = 0; e < t.length - 1; e += 1)
                    for (let n = e + 1; n < t.length; n += 1) {
                        if (!1 === o[e][n])
                            continue;
                        const t = Pe.core.overlapConvexPolygons(c[e], c[n], r);
                        o[e][n] = t,
                            o[n][e] = t
                    }
                return o
            }
        ;
        var Mt = Object.freeze({
            __proto__: null,
            makeEdgesFacesOverlap: makeEdgesFacesOverlap,
            makeFacesFacesOverlap: makeFacesFacesOverlap
        });
        var jt = Object.assign(Object.create(null), {
            count: count,
            countImplied: countImplied,
            validate: validate$1,
            clean: clean,
            populate: populate,
            remove: removeGeometryIndices,
            replace: replaceGeometryIndices,
            removePlanarVertex: removePlanarVertex,
            removePlanarEdge: removePlanarEdge,
            addVertices: addVertices,
            addEdges: addEdges,
            splitEdge: splitEdge,
            splitFace: splitFace,
            flatFold: flatFold,
            addPlanarSegment: addPlanarSegment,
            subgraph: (e, t) => {
                const r = {}
                    , o = {};
                [c, s, n].forEach((n => {
                        r[n] = Array.from(Array(count[n](e))).map(( (e, t) => t)),
                            o[n] = uniqueSortedIntegers(t[n] || []).reverse()
                    }
                )),
                    Object.keys(o).forEach((e => o[e].forEach((t => r[e].splice(t, 1)))));
                const i = JSON.parse(JSON.stringify(e));
                return Object.keys(r).forEach((e => removeGeometryIndices(i, e, r[e]))),
                    i
            }
            ,
            clip: clip,
            fragment: fragment,
            getVerticesClusters: getVerticesClusters,
            clone: clone
        }, De, Ke, Re, it, Ve, Ge, He, Ze, kt, Xe, Mt, Qe, Te, We, Je, At, nt, et, ot, st, ct, Be);
        const Pt = {}
            , make_rect_vertices_coords = (e, t) => [[0, 0], [e, 0], [e, t], [0, t]]
            , make_closed_polygon = e => populate({
            vertices_coords: e,
            edges_vertices: e.map(( (e, t, r) => [t, (t + 1) % r.length])),
            edges_assignment: Array(e.length).fill("B")
        });
        Pt.square = (e=1) => make_closed_polygon(make_rect_vertices_coords(e, e)),
            Pt.rectangle = (e=1, t=1) => make_closed_polygon(make_rect_vertices_coords(e, t)),
            Pt.polygon = (e=3, t=1) => make_closed_polygon(Pe.core.makePolygonCircumradius(e, t)),
            Pt.kite = () => populate({
                vertices_coords: [[0, 0], [Math.sqrt(2) - 1, 0], [1, 0], [1, 1 - (Math.sqrt(2) - 1)], [1, 1], [0, 1]],
                edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
                edges_assignment: Array.from("BBBBBBVVF")
            });
        const wt = Object.create(null)
            , St = {
            graph: ut,
            cp: yt,
            origami: Ot
        }
            , Lt = {
            graph: () => {}
            ,
            cp: Pt.square,
            origami: Pt.square
        }
            , Ct = {
            graph: () => ({
                file_spec: 1.1,
                file_creator: Se
            }),
            cp: () => ({
                file_spec: 1.1,
                file_creator: Se,
                frame_classes: ["creasePattern"]
            }),
            origami: () => ({
                file_spec: 1.1,
                file_creator: Se,
                frame_classes: ["foldedForm"]
            })
        };
        Object.keys(St).forEach((e => {
                wt[e] = function() {
                    const t = Array.from(arguments).filter((e => isFoldObject(e))).map((e => JSON.parse(JSON.stringify(e))));
                    return populate(Object.assign(Object.create(St[e]), t.length ? {} : Lt[e](), ...t, Ct[e]()))
                }
                    ,
                    wt[e].prototype = St[e],
                    wt[e].prototype.constructor = wt[e],
                    Object.keys(Pt).forEach((t => {
                            wt[e][t] = function() {
                                return wt[e](Pt[t](...arguments))
                            }
                        }
                    ))
            }
        )),
            Object.assign(wt.graph, jt);
        const cubrt = e => e < 0 ? -Math.pow(-e, 1 / 3) : Math.pow(e, 1 / 3)
            , normalAxiom6 = (e, t, r, o) => {
                if (Math.abs(1 - Pe.core.dot2(e.normal, r) / e.distance) < .02)
                    return [];
                const n = Pe.core.rotate90(e.normal)
                    , s = Pe.core.subtract2(Pe.core.add2(r, Pe.core.scale2(e.normal, e.distance)), Pe.core.scale2(o, 2))
                    , c = Pe.core.subtract2(Pe.core.scale2(e.normal, e.distance), r)
                    , i = Pe.core.dot2(o, t.normal) - t.distance
                    , a = 2 * Pe.core.dot2(c, n)
                    , l = Pe.core.dot2(c, c)
                    , d = Pe.core.dot2(Pe.core.add2(s, c), n)
                    , u = Pe.core.dot2(s, c)
                    , p = Pe.core.dot2(n, t.normal)
                    , g = Pe.core.dot2(c, t.normal)
                    , m = p
                    , h = i + d * p + g
                    , v = i * a + u * p + d * g
                    , _ = i * l + u * g;
                let y = 0;
                return Math.abs(v) > Pe.core.EPSILON && (y = 1),
                Math.abs(h) > Pe.core.EPSILON && (y = 2),
                Math.abs(m) > Pe.core.EPSILON && (y = 3),
                    ( (e, t, r, o, n) => {
                            switch (e) {
                                case 1:
                                    return [-n / o];
                                case 2:
                                {
                                    const e = Math.pow(o, 2) - 4 * r * n;
                                    if (e < -Pe.core.EPSILON)
                                        return [];
                                    const t = -o / (2 * r);
                                    if (e < Pe.core.EPSILON)
                                        return [t];
                                    const s = Math.sqrt(e) / (2 * r);
                                    return [t + s, t - s]
                                }
                                case 3:
                                {
                                    const e = r / t
                                        , s = o / t
                                        , c = n / t
                                        , i = (3 * s - Math.pow(e, 2)) / 9
                                        , a = (9 * e * s - 27 * c - 2 * Math.pow(e, 3)) / 54
                                        , l = Math.pow(i, 3) + Math.pow(a, 2)
                                        , d = -e / 3;
                                    if (l > 0) {
                                        const e = Math.sqrt(l);
                                        return [d + cubrt(a + e) + cubrt(a - e)]
                                    }
                                    if (Math.abs(l) < Pe.core.EPSILON) {
                                        const e = Math.pow(a, 1 / 3);
                                        return a < 0 ? [] : [d + 2 * e, d - e]
                                    }
                                    const u = Math.sqrt(-l)
                                        , p = Math.atan2(u, a) / 3
                                        , g = Math.pow(Math.pow(a, 2) - l, 1 / 6)
                                        , m = g * Math.cos(p)
                                        , h = g * Math.sin(p);
                                    return [d + 2 * m, d - m - Math.sqrt(3) * h, d - m + Math.sqrt(3) * h]
                                }
                                default:
                                    return []
                            }
                        }
                    )(y, m, h, v, _).map((t => Pe.core.add2(Pe.core.scale2(e.normal, e.distance), Pe.core.scale2(n, t)))).map((e => ({
                        p: e,
                        normal: Pe.core.normalize2(Pe.core.subtract2(e, r))
                    }))).map((e => ({
                        normal: e.normal,
                        distance: Pe.core.dot2(e.normal, Pe.core.midpoint2(e.p, r))
                    })))
            }
        ;
        var $t = Object.freeze({
            __proto__: null,
            normalAxiom1: (e, t) => {
                const r = Pe.core.normalize2(Pe.core.rotate90(Pe.core.subtract2(t, e)));
                return {
                    normal: r,
                    distance: Pe.core.dot2(Pe.core.add2(e, t), r) / 2
                }
            }
            ,
            normalAxiom2: (e, t) => {
                const r = Pe.core.normalize2(Pe.core.subtract2(t, e));
                return {
                    normal: r,
                    distance: Pe.core.dot2(Pe.core.add2(e, t), r) / 2
                }
            }
            ,
            normalAxiom3: (e, t) => {
                const r = ( (e, t) => {
                        const r = Pe.core.cross2(e.normal, t.normal);
                        if (Math.abs(r) < Pe.core.EPSILON)
                            return;
                        return [(e.distance * t.normal[1] - t.distance * e.normal[1]) / r, (t.distance * e.normal[0] - e.distance * t.normal[0]) / r]
                    }
                )(e, t);
                return void 0 === r ? [{
                    normal: e.normal,
                    distance: (e.distance + t.distance * Pe.core.dot2(e.normal, t.normal)) / 2
                }] : [Pe.core.add2, Pe.core.subtract2].map((r => Pe.core.normalize2(r(e.normal, t.normal)))).map((e => ({
                    normal: e,
                    distance: Pe.core.dot2(r, e)
                })))
            }
            ,
            normalAxiom4: (e, t) => {
                const r = Pe.core.rotate90(e.normal);
                return {
                    normal: r,
                    distance: Pe.core.dot2(t, r)
                }
            }
            ,
            normalAxiom5: (e, t, r) => {
                const o = Pe.core.dot2(t, e.normal)
                    , n = e.distance - o
                    , s = Pe.core.distance2(t, r);
                if (n > s)
                    return [];
                const c = Math.sqrt(s * s - n * n)
                    , i = Pe.core.scale2(e.normal, n)
                    , a = Pe.core.add2(t, i)
                    , l = Pe.core.scale2(Pe.core.rotate90(e.normal), c);
                return (c < Pe.core.EPSILON ? [a] : [Pe.core.add2(a, l), Pe.core.subtract2(a, l)]).map((e => Pe.core.normalize2(Pe.core.subtract2(r, e)))).map((e => ({
                    normal: e,
                    distance: Pe.core.dot2(t, e)
                })))
            }
            ,
            normalAxiom6: normalAxiom6,
            normalAxiom7: (e, t, r) => {
                const o = Pe.core.rotate90(e.normal)
                    , n = Pe.core.dot2(o, t.normal);
                if (Math.abs(n) < Pe.core.EPSILON)
                    return;
                const s = Pe.core.dot2(r, o)
                    , c = Pe.core.dot2(r, t.normal);
                return {
                    normal: o,
                    distance: (t.distance + 2 * s * n - c) / (2 * n)
                }
            }
        });
        var Nt = Object.freeze({
            __proto__: null,
            axiom1: (e, t) => ({
                vector: Pe.core.normalize2(Pe.core.subtract2(...Pe.core.resizeUp(t, e))),
                origin: e
            }),
            axiom2: (e, t) => ({
                vector: Pe.core.normalize2(Pe.core.rotate90(Pe.core.subtract2(...Pe.core.resizeUp(t, e)))),
                origin: Pe.core.midpoint2(e, t)
            }),
            axiom3: (e, t) => Pe.core.bisectLines2(e.vector, e.origin, t.vector, t.origin),
            axiom4: (e, t) => ({
                vector: Pe.core.rotate90(Pe.core.normalize2(e.vector)),
                origin: t
            }),
            axiom5: (e, t, r) => (Pe.core.intersectCircleLine(Pe.core.distance2(t, r), t, e.vector, e.origin, Pe.core.include_l) || []).map((e => ({
                vector: Pe.core.normalize2(Pe.core.rotate90(Pe.core.subtract2(...Pe.core.resizeUp(e, r)))),
                origin: Pe.core.midpoint2(r, e)
            }))),
            axiom6: (e, t, r, o) => normalAxiom6(Pe.core.rayLineToUniqueLine(e), Pe.core.rayLineToUniqueLine(t), r, o).map(Pe.core.uniqueLineToRayLine),
            axiom7: (e, t, r) => {
                const o = Pe.core.intersectLineLine(e.vector, e.origin, t.vector, r, Pe.core.include_l, Pe.core.include_l);
                return void 0 === o ? void 0 : {
                    vector: Pe.core.normalize2(Pe.core.rotate90(Pe.core.subtract2(...Pe.core.resizeUp(o, r)))),
                    origin: Pe.core.midpoint2(r, o)
                }
            }
        });
        const arrayify = (e, t) => {
                switch (e) {
                    case 3:
                    case "3":
                    case 5:
                    case "5":
                    case 6:
                    case "6":
                        return t;
                    case 7:
                    case "7":
                        return void 0 === t ? [] : [t];
                    default:
                        return [t]
                }
            }
            , reflectPoint = (e, t) => {
                const r = Pe.core.makeMatrix2Reflect(e.vector, e.origin);
                return Pe.core.multiplyMatrix2Vector2(r, t)
            }
            , validateAxiom1 = (e, t) => e.points.map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include))).reduce(( (e, t) => e && t), !0)
            , zt = validateAxiom1
            , validateAxiom3 = (e, t, r) => {
                const o = e.lines.map((e => Pe.core.clipLineConvexPolygon(t, e.vector, e.origin, Pe.core.include, Pe.core.includeL)));
                if (void 0 === o[0] || void 0 === o[1])
                    return [!1, !1];
                const n = r.map((e => void 0 === e ? void 0 : Pe.core.clipLineConvexPolygon(t, e.vector, e.origin, Pe.core.include, Pe.core.includeL)))
                    , s = [0, 1].map((e => void 0 !== n[e]))
                    , c = r.map((e => void 0 === e ? void 0 : [reflectPoint(e, o[0][0]), reflectPoint(e, o[0][1])])).map((e => void 0 !== e && (Pe.core.overlapLinePoint(Pe.core.subtract(o[1][1], o[1][0]), o[1][0], e[0], Pe.core.includeS) || Pe.core.overlapLinePoint(Pe.core.subtract(o[1][1], o[1][0]), o[1][0], e[1], Pe.core.includeS) || Pe.core.overlapLinePoint(Pe.core.subtract(e[1], e[0]), e[0], o[1][0], Pe.core.includeS) || Pe.core.overlapLinePoint(Pe.core.subtract(e[1], e[0]), e[0], o[1][1], Pe.core.includeS))));
                return [0, 1].map((e => !0 === c[e] && !0 === s[e]))
            }
            , validateAxiom4 = (e, t) => {
                const r = Pe.core.intersectLineLine(e.lines[0].vector, e.lines[0].origin, Pe.core.rotate90(e.lines[0].vector), e.points[0], Pe.core.includeL, Pe.core.includeL);
                return [e.points[0], r].filter((e => void 0 !== e)).map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include))).reduce(( (e, t) => e && t), !0)
            }
            , validateAxiom5 = (e, t, r) => {
                if (0 === r.length)
                    return [];
                const o = e.points.map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include))).reduce(( (e, t) => e && t), !0);
                return r.map((t => reflectPoint(t, e.points[1]))).map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include))).map((e => e && o))
            }
            , validateAxiom6 = function(e, t, r) {
                if (0 === r.length)
                    return [];
                if (!e.points.map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include))).reduce(( (e, t) => e && t), !0))
                    return r.map(( () => !1));
                const o = r.map((t => reflectPoint(t, e.points[0]))).map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include)))
                    , n = r.map((t => reflectPoint(t, e.points[1]))).map((e => Pe.core.overlapConvexPolygonPoint(t, e, Pe.core.include)));
                return r.map(( (e, t) => o[t] && n[t]))
            }
            , validateAxiom7 = (e, t, r) => {
                const o = Pe.core.overlapConvexPolygonPoint(t, e.points[0], Pe.core.include);
                if (void 0 === r)
                    return [!1];
                const n = reflectPoint(r, e.points[0])
                    , s = Pe.core.overlapConvexPolygonPoint(t, n, Pe.core.include)
                    , c = void 0 !== Pe.core.intersectConvexPolygonLine(t, e.lines[1].vector, e.lines[1].origin, Pe.core.includeS, Pe.core.includeL)
                    , i = Pe.core.intersectLineLine(e.lines[1].vector, e.lines[1].origin, r.vector, r.origin, Pe.core.includeL, Pe.core.includeL)
                    , a = !!i && Pe.core.overlapConvexPolygonPoint(t, i, Pe.core.include);
                return o && s && c && a
            }
        ;
        var Ft = Object.freeze({
            __proto__: null,
            validateAxiom1: validateAxiom1,
            validateAxiom2: zt,
            validateAxiom3: validateAxiom3,
            validateAxiom4: validateAxiom4,
            validateAxiom5: validateAxiom5,
            validateAxiom6: validateAxiom6,
            validateAxiom7: validateAxiom7,
            validate: (e, t, r, o) => arrayify(e, [null, validateAxiom1, zt, validateAxiom3, validateAxiom4, validateAxiom5, validateAxiom6, validateAxiom7][e](t, r, ( (e, t) => {
                    switch (e) {
                        case 3:
                        case "3":
                        case 5:
                        case "5":
                        case 6:
                        case "6":
                            return t;
                        default:
                            return t ? t[0] : void 0
                    }
                }
            )(e, o)))
        });
        const spreadParams = e => [...e.lines ? e.lines : [], ...e.points ? e.points : []]
            , axiomInBoundary = (e, t={}, r) => {
                const o = arrayify(e, Nt[`axiom${e}`](...spreadParams(t))).map((e => Pe.line(e)));
                return r && arrayify(e, Ft[`validateAxiom${e}`](t, r, o)).forEach(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e)).forEach((e => delete o[e])),
                    o
            }
        ;
        var It = Object.freeze({
            __proto__: null,
            axiomInBoundary: axiomInBoundary,
            normalAxiomInBoundary: (e, t={}, r) => {
                const o = arrayify(e, $t[`normalAxiom${e}`](...spreadParams(t))).map((e => Pe.line.fromNormalDistance(e)));
                return r && arrayify(e, Ft[`validateAxiom${e}`]((e => ({
                    points: e.points,
                    lines: e.lines.map(Pe.core.uniqueLineToRayLine)
                }))(t), r, o)).forEach(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e)).forEach((e => delete o[e])),
                    o
            }
        });
        const axiom = (e, t={}, r) => axiomInBoundary(e, t, r);
        Object.keys(Nt).forEach((e => {
                axiom[e] = Nt[e]
            }
        )),
            Object.keys($t).forEach((e => {
                    axiom[e] = $t[e]
                }
            )),
            Object.keys(It).forEach((e => {
                    axiom[e] = It[e]
                }
            )),
            Object.keys(Ft).forEach((e => {
                    axiom[e] = Ft[e]
                }
            ));
        const line_line_for_arrows = (e, t) => Pe.core.intersectLineLine(e.vector, e.origin, t.vector, t.origin, Pe.core.includeL, Pe.core.includeL)
            , diagram_reflect_point = (e, t) => {
            const r = Pe.core.makeMatrix2Reflect(e.vector, e.origin);
            return Pe.core.multiplyMatrix2Vector2(r, t)
        }
            , boundary_for_arrows$1 = ({vertices_coords: e}) => Pe.core.convexHull(e)
            , widest_perp = (e, t, r) => {
            const o = boundary_for_arrows$1(e);
            if (void 0 === r) {
                const e = Pe.core.clipLineConvexPolygon(o, t.vector, t.origin, Pe.core.exclude, Pe.core.includeL);
                r = Pe.core.midpoint(...e)
            }
            const n = Pe.core.rotate270(t.vector)
                , s = Pe.core.clipLineConvexPolygon(o, n, r, Pe.core.exclude, Pe.core.includeL).map((e => Pe.core.distance(r, e))).sort(( (e, t) => e - t)).shift()
                , c = Pe.core.scale(Pe.core.normalize(n), s);
            return Pe.segment(Pe.core.add(r, Pe.core.flip(c)), Pe.core.add(r, c))
        }
            , between_2_segments = (e, t, r) => {
            const o = t.map((e => Pe.core.midpoint(e[0], e[1])))
                , n = Pe.line.fromPoints(...o)
                , s = Pe.intersect(r, n)
                , c = Pe.line(r.vector.rotate90(), s);
            return Pe.segment(e.lines.map((e => Pe.intersect(e, c))))
        }
            , Vt = [null, (e, t) => axiom(1, e).map((e => [widest_perp(t, e)])), e => [[Pe.segment(e.points)]], (e, t) => {
            const r = boundary_for_arrows$1(t)
                , o = e.lines.map((e => Pe.core.clipLineConvexPolygon(r, e.vector, e.origin, Pe.core.exclude, Pe.core.includeL)))
                , n = o.map((e => Pe.core.subtract(e[1], e[0])))
                , s = Pe.core.intersectLineLine(n[0], o[0][0], n[1], o[1][0], Pe.core.excludeS, Pe.core.excludeS);
            return s ? axiom(3, e).map((t => ( (e, t, r, o) => {
                    const n = e.lines.map((e => e.vector))
                        , s = n.map(Pe.core.flip)
                        , c = n.concat(s).map((e => Pe.ray(e, t)))
                        , i = c.filter((e => Pe.core.dot(e.vector, r.vector) > 0 && Pe.core.cross2(e.vector, r.vector) > 0)).shift()
                        , a = c.filter((e => Pe.core.dot(e.vector, r.vector) > 0 && Pe.core.cross2(e.vector, r.vector) < 0)).shift()
                        , l = c.filter((e => Pe.core.dot(e.vector, r.vector) < 0 && Pe.core.cross2(e.vector, r.vector) > 0)).shift()
                        , d = c.filter((e => Pe.core.dot(e.vector, r.vector) < 0 && Pe.core.cross2(e.vector, r.vector) < 0)).shift()
                        , u = [i, a, l, d].map((e => Pe.core.intersectConvexPolygonLine(o, e.vector, e.origin, Pe.core.excludeS, Pe.core.excludeR).shift().shift()))
                        , p = u.map((e => Pe.core.distance(e, t)))
                        , g = p[0] < p[1] ? u[0] : u[1]
                        , m = p[0] < p[1] ? Pe.core.add(a.origin, a.vector.normalize().scale(p[0])) : Pe.core.add(i.origin, i.vector.normalize().scale(p[1]))
                        , h = p[2] < p[3] ? u[2] : u[3]
                        , v = p[2] < p[3] ? Pe.core.add(d.origin, d.vector.normalize().scale(p[2])) : Pe.core.add(l.origin, l.vector.normalize().scale(p[3]));
                    return [Pe.segment(g, m), Pe.segment(h, v)]
                }
            )(e, s, t, r))) : [between_2_segments(e, o, axiom(3, e).filter((e => void 0 !== e)).shift())]
        }
            , (e, t) => axiom(4, e).map((r => [widest_perp(t, r, line_line_for_arrows(r, e.lines[0]))])), e => axiom(5, e).map((t => [Pe.segment(e.points[1], diagram_reflect_point(t, e.points[1]))])), e => axiom(6, e).map((t => e.points.map((e => Pe.segment(e, diagram_reflect_point(t, e)))))), (e, t) => axiom(7, e).map((r => [Pe.segment(e.points[0], diagram_reflect_point(r, e.points[0])), widest_perp(t, r, line_line_for_arrows(r, e.lines[1]))]))];
        delete Vt[0];
        const axiomArrows = (e, t={}, ...r) => {
                const o = t.points ? t.points.map((e => Pe.core.getVector(e))) : void 0
                    , n = t.lines ? t.lines.map((e => Pe.core.getLine(e))) : void 0;
                return Vt[e]({
                    points: o,
                    lines: n
                }, ...r)
            }
        ;
        Object.keys(Vt).forEach((e => {
                axiomArrows[e] = (...t) => axiomArrows(e, ...t)
            }
        ));
        var Bt = Object.assign(Object.create(null), {
            axiom_arrows: axiomArrows,
            simple_arrow: (e, t) => {
                const r = ( ({vertices_coords: e}) => Pe.core.convexHull(e))(e)
                    , o = Pe.core.boundingBox(r)
                    , n = ( (e, t, r) => {
                        if (void 0 === r) {
                            const o = Pe.core.clipLineConvexPolygon(e, t.vector, t.origin, Pe.core.exclude, Pe.core.includeL);
                            if (void 0 === o)
                                return;
                            r = Pe.core.midpoint(...o)
                        }
                        const o = Pe.core.rotate90(t.vector)
                            , n = Pe.core.clipLineConvexPolygon(e, o, r, Pe.core.exclude, Pe.core.includeL).map((e => Pe.core.distance(r, e))).sort(( (e, t) => e - t)).shift()
                            , s = Pe.core.scale(Pe.core.normalize(o), n);
                        return Pe.segment(Pe.core.add(r, Pe.core.flip(s)), Pe.core.add(r, s))
                    }
                )(r, t);
                if (void 0 === n)
                    return;
                const s = Pe.core.subtract(n[1], n[0])
                    , c = Pe.core.magnitude(s)
                    , i = Pe.core.dot(s, [1, 0])
                    , a = o.span[0] < o.span[1] ? o.span[0] : o.span[1];
                return n.head = {
                    width: .1 * a,
                    height: .15 * a
                },
                    n.bend = i > 0 ? .3 : -.3,
                    n.padding = .05 * c,
                    n
            }
        });
        var Tt = Object.freeze({
            __proto__: null,
            flipFacesLayer: e => invertMap(invertMap(e).reverse()),
            facesLayerToEdgesAssignments: (e, t) => {
                const r = []
                    , o = makeFacesWinding(e);
                return (e.edges_faces ? e.edges_faces : makeEdgesFaces(e)).forEach(( (e, n) => {
                        if (1 === e.length && (r[n] = "B"),
                        2 === e.length) {
                            const s = e.map((e => o[e]));
                            if (s[0] === s[1])
                                return void (r[n] = "F");
                            const c = e.map((e => t[e]))
                                , i = c[0] < c[1]
                                , a = s[0] ? i : !i;
                            r[n] = a ? "V" : "M"
                        }
                    }
                )),
                    r
            }
            ,
            ordersToMatrix: e => {
                const t = Object.keys(e).map((e => e.split(" ").map((e => parseInt(e, 10)))))
                    , r = [];
                t.reduce(( (e, t) => e.concat(t)), []).forEach((e => {
                        r[e] = void 0
                    }
                ));
                const o = r.map(( () => []));
                return t.forEach(( ([t,r]) => {
                        o[t][r] = e[`${t} ${r}`],
                            o[r][t] = -e[`${t} ${r}`]
                    }
                )),
                    o
            }
        });
        const makeFoldedStripTacos = (e, t, r) => {
                const o = e.map((e => e ? (e[0] + e[1]) / 2 : void 0))
                    , n = [];
                return e.forEach(( (s, c) => {
                        if (!s)
                            return;
                        if (!t && c === e.length - 1)
                            return;
                        const i = s[1]
                            , a = i - 2 * r
                            , l = i + 2 * r
                            , d = [c, (c + 1) % e.length]
                            , u = d.map((e => o[e])).map((e => e > i))
                            , p = 1 * (!u[0] && !u[1]) + 2 * (u[0] && u[1])
                            , g = n.filter((e => e.min < i && e.max > i)).shift()
                            , m = {
                            faces: d,
                            taco_type: p
                        };
                        g ? g.pairs.push(m) : n.push({
                            min: a,
                            max: l,
                            pairs: [m]
                        })
                    }
                )),
                    n.map((e => e.pairs)).filter((e => e.length > 1)).map((e => ({
                        both: e.filter((e => 0 === e.taco_type)).map((e => e.faces)),
                        left: e.filter((e => 1 === e.taco_type)).map((e => e.faces)),
                        right: e.filter((e => 2 === e.taco_type)).map((e => e.faces))
                    })))
            }
            , between = (e, t, r) => t < r ? e.slice(t + 1, r) : e.slice(r + 1, t)
            , validateTacoTortillaStrip = (e, t, r=!0, o=Pe.core.EPSILON) => {
                const n = invertMap(t)
                    , s = e.map((e => e ? e[1] : void 0))
                    , c = e.map((e => e ? Math.min(...e) : void 0)).map((e => e + o))
                    , i = e.map((e => e ? Math.max(...e) : void 0)).map((e => e - o))
                    , a = n.length + (r ? 0 : -1);
                for (let e = 0; e < a; e += 1) {
                    const r = (e + 1) % n.length;
                    if (n[e] === n[r])
                        continue;
                    const o = between(t, n[e], n[r]).flat()
                        , a = o.map((t => s[e] < c[t])).reduce(( (e, t) => e && t), !0)
                        , l = o.map((t => s[e] > i[t])).reduce(( (e, t) => e && t), !0);
                    if (!a && !l)
                        return !1
                }
                return !0
            }
            , validateTacoTacoFacePairs = e => {
                const t = removeSingleInstances(e)
                    , r = {};
                let o = 0;
                for (let e = 0; e < t.length; e += 1)
                    if (void 0 === r[t[e]])
                        o += 1,
                            r[t[e]] = o;
                    else if (void 0 !== r[t[e]]) {
                        if (r[t[e]] !== o)
                            return !1;
                        o -= 1,
                            r[t[e]] = void 0
                    }
                return !0
            }
            , build_layers = (e, t) => e.map((e => t[e])).filter((e => void 0 !== e))
            , validateLayerSolver = (e, t, r, o, n) => {
                const s = Pe.core.flattenArrays(t);
                if (!validateTacoTortillaStrip(e, t, o, n))
                    return !1;
                for (let e = 0; e < r.length; e += 1) {
                    const t = build_layers(s, r[e]);
                    if (!validateTacoTacoFacePairs(t))
                        return !1
                }
                return !0
            }
            , qt = {
                V: !0,
                v: !0,
                M: !0,
                m: !0
            }
            , Rt = {
                V: 1,
                v: 1,
                M: -1,
                m: -1
            }
            , assignmentsToFacesVertical = e => {
                let t = 0;
                return e.slice(1).concat([e[0]]).map((e => {
                        const r = (o = e,
                            t % 2 == 0 ? Rt[o] || 0 : -(Rt[o] || 0));
                        var o;
                        return t += void 0 === Rt[e] ? 0 : 1,
                            r
                    }
                ))
            }
            , foldStripWithAssignments = (e, t) => {
                const r = (e => {
                        let t = 0;
                        const r = e.slice(1);
                        return [!1].concat(r.map((e => qt[e] ? ++t : t)).map((e => e % 2 == 1)))
                    }
                )(t).map(( (t, r) => e[r] * (t ? -1 : 1)))
                    , o = e.map(( () => {}
                ));
                o[0] = [0, r[0]];
                for (let n = 1; n < e.length && ("B" !== t[n] && "b" !== t[n]); n += 1) {
                    const t = o[(n - 1 + e.length) % e.length][1];
                    o[n] = [t, t + r[n]]
                }
                return o
            }
            , Gt = {
                B: !0,
                b: !0
            }
            , singleVertexSolver = (e, t, r=Pe.core.EPSILON) => {
                const o = foldStripWithAssignments(e, t)
                    , n = assignmentsToFacesVertical(t)
                    , s = t.map((e => !Gt[e])).reduce(( (e, t) => e && t), !0);
                if (s) {
                    const e = o[0][0]
                        , t = o[o.length - 1][1];
                    if (Math.abs(e - t) > r)
                        return []
                }
                const c = makeFoldedStripTacos(o, s, r).map((e => [e.left, e.right].map(invertMap).filter((e => e.length > 1)))).reduce(( (e, t) => e.concat(t)), [])
                    , recurse = (t=[0], i=0, a=0) => {
                        const l = i + 1
                            , d = n[i]
                            , u = i >= e.length - 1
                            , p = s && u;
                        if (!validateLayerSolver(o, t, c, p, r))
                            return [];
                        if (p) {
                            const e = invertMap(t)
                                , r = e[0]
                                , o = e[i];
                            if (d > 0 && o > r)
                                return [];
                            if (d < 0 && o < r)
                                return []
                        }
                        if (u)
                            return [t];
                        if (0 === d)
                            return t[a] = [l].concat(t[a]),
                                recurse(t, l, a);
                        const g = 1 === d ? Array.from(Array(t.length - a)).map(( (e, t) => a + t + 1)) : Array.from(Array(a + 1)).map(( (e, t) => t))
                            , m = g.map(( () => clone(t)));
                        return m.forEach(( (e, t) => e.splice(g[t], 0, l))),
                            m.map(( (e, t) => recurse(e, l, g[t]))).reduce(( (e, t) => e.concat(t)), [])
                    }
                ;
                return recurse().map(invertMap)
            }
            , maekawaAssignments = e => {
                const t = (r = e).map(( (e, t) => t)).filter((e => "U" === r[e] || "u" === r[e]));
                var r;
                const o = Array.from(Array(2 ** t.length)).map(( (e, t) => t.toString(2))).map((e => Array(t.length - e.length + 1).join("0") + e)).map((e => Array.from(e).map((e => "0" === e ? "V" : "M")))).map((r => {
                        const o = e.slice();
                        return t.forEach(( (e, t) => {
                                o[e] = r[t]
                            }
                        )),
                            o
                    }
                ));
                if (e.includes("B") || e.includes("b"))
                    return o;
                const n = o.map((e => e.filter((e => "M" === e || "m" === e)).length))
                    , s = o.map((e => e.filter((e => "V" === e || "v" === e)).length));
                return o.filter(( (e, t) => 2 === Math.abs(n[t] - s[t])))
            }
            , make_lookup = e => {
                const t = e[0].length
                    , r = Array.from(Array(t + 1)).map(( () => ({})));
                Array.from(Array(Math.pow(2, t))).map(( (e, t) => t.toString(2))).map((e => Array.from(e).map((e => parseInt(e, 10) + 1)).join(""))).map((e => `11111${e}`.slice(-t))).forEach((e => {
                        r[0][e] = !1
                    }
                )),
                    e.forEach((e => {
                            r[0][e] = !0
                        }
                    )),
                    Array.from(Array(t)).map(( (e, t) => t + 1)).map((e => Array.from(Array(Math.pow(3, t))).map(( (e, t) => t.toString(3))).map((e => `000000${e}`.slice(-t))).forEach((t => ( (e, t, r) => {
                            const o = Array.from(r).map((e => parseInt(e, 10)));
                            if (o.filter((e => 0 === e)).length !== t)
                                return;
                            e[t][r] = !1;
                            let n = !1;
                            for (let r = 0; r < o.length; r += 1) {
                                const s = [];
                                if (0 === o[r]) {
                                    for (let n = 1; n <= 2; n += 1)
                                        o[r] = n,
                                        !1 !== e[t - 1][o.join("")] && s.push([r, n]);
                                    o[r] = 0,
                                    s.length > 0 && !1 === n && (n = []),
                                    1 === s.length && n.push(s[0])
                                }
                            }
                            !1 !== n && 0 === n.length && (n = !0),
                                e[t][r] = n
                        }
                    )(r, e, t)))));
                let o = [];
                Array.from(Array(t + 1)).map(( (e, r) => t - r)).forEach((e => {
                        const t = [];
                        Object.keys(r[e]).forEach((o => {
                                let n = r[e][o];
                                n.constructor === Array && (n = n[0]),
                                    t.push([o, n])
                            }
                        )),
                            o = o.concat(t)
                    }
                )),
                    o.sort(( (e, t) => parseInt(e[0], 10) - parseInt(t[0], 10)));
                const n = {};
                return o.forEach((e => {
                        n[e[0]] = Object.freeze(e[1])
                    }
                )),
                    Object.freeze(n)
            }
            , Ut = {
                taco_taco: make_lookup(["111112", "111121", "111222", "112111", "121112", "121222", "122111", "122212", "211121", "211222", "212111", "212221", "221222", "222111", "222212", "222221"]),
                taco_tortilla: make_lookup(["112", "121", "212", "221"]),
                tortilla_tortilla: make_lookup(["11", "22"]),
                transitivity: make_lookup(["112", "121", "122", "211", "212", "221"])
            }
            , Dt = {
                taco_taco: e => [[e[0], e[2]], [e[1], e[3]], [e[1], e[2]], [e[0], e[3]], [e[0], e[1]], [e[2], e[3]]],
                taco_tortilla: e => [[e[0], e[2]], [e[0], e[1]], [e[1], e[2]]],
                tortilla_tortilla: e => [[e[0], e[2]], [e[1], e[3]]],
                transitivity: e => [[e[0], e[1]], [e[1], e[2]], [e[2], e[0]]]
            }
            , pairArrayToSortedPairString = e => e[0] < e[1] ? `${e[0]} ${e[1]}` : `${e[1]} ${e[0]}`
            , Wt = {
                taco_taco: e => [pairArrayToSortedPairString([e[0], e[2]]), pairArrayToSortedPairString([e[1], e[3]]), pairArrayToSortedPairString([e[1], e[2]]), pairArrayToSortedPairString([e[0], e[3]]), pairArrayToSortedPairString([e[0], e[1]]), pairArrayToSortedPairString([e[2], e[3]])],
                taco_tortilla: e => [pairArrayToSortedPairString([e[0], e[2]]), pairArrayToSortedPairString([e[0], e[1]]), pairArrayToSortedPairString([e[1], e[2]])],
                tortilla_tortilla: e => [pairArrayToSortedPairString([e[0], e[2]]), pairArrayToSortedPairString([e[1], e[3]])],
                transitivity: e => [pairArrayToSortedPairString([e[0], e[1]]), pairArrayToSortedPairString([e[1], e[2]]), pairArrayToSortedPairString([e[2], e[0]])]
            }
            , Zt = {
                0: 0,
                1: 1,
                2: -1
            }
            , unsignedToSignedOrders = e => (Object.keys(e).forEach((t => {
                    e[t] = Zt[e[t]]
                }
            )),
                e)
            , Ht = Object.freeze(Object.keys(Ut))
            , Jt = {
                0: 0,
                1: 2,
                2: 1
            }
            , buildRuleAndLookup = (e, t, ...r) => {
                const o = Dt[e](t)
                    , n = o.map((e => e[1] < e[0]))
                    , s = o.map(( (e, t) => n[t] ? `${e[1]} ${e[0]}` : `${e[0]} ${e[1]}`))
                    , c = s.map(( (e, t) => {
                        for (let o = 0; o < r.length; o += 1)
                            if (r[o][e])
                                return n[t] ? Jt[r[o][e]] : r[o][e];
                        return 0
                    }
                )).join("");
                if (!0 === Ut[e][c])
                    return !0;
                if (!1 === Ut[e][c])
                    return !1;
                const i = Ut[e][c];
                return [s[i[0]], n[i[0]] ? Jt[i[1]] : i[1]]
            }
            , getConstraintIndicesFromFacePairs = (e, t, r) => {
                const o = {};
                return Ht.forEach((n => {
                        const s = r.flatMap((e => t[n][e]));
                        o[n] = uniqueIntegers(s).filter((t => e[n][t]))
                    }
                )),
                    o
            }
            , propagate = (e, t, r, ...o) => {
                let n = r;
                const s = {};
                do {
                    const r = getConstraintIndicesFromFacePairs(e, t, n)
                        , c = {};
                    for (let t = 0; t < Ht.length; t += 1) {
                        const n = Ht[t]
                            , i = r[n];
                        for (let t = 0; t < i.length; t += 1) {
                            const r = buildRuleAndLookup(n, e[n][i[t]], ...o, s);
                            if (!0 !== r) {
                                if (!1 === r)
                                    return console.warn("invalid state found", n, e[n][i[t]]),
                                        !1;
                                if (s[r[0]]) {
                                    if (s[r[0]] !== r[1])
                                        return console.warn("order conflict", n, e[n][i[t]]),
                                            !1
                                } else {
                                    const [e,t] = r;
                                    c[e] = !0,
                                        s[r[0]] = t
                                }
                            }
                        }
                    }
                    n = Object.keys(c)
                } while (n.length);
                return s
            }
            , makeTortillaTortillaFacesCrossing = (e, t, r) => ( (e, t, r) => {
                    const o = makeFacesWinding(e)
                        , n = makeFacesPolygon(e, r);
                    for (let e = 0; e < n.length; e += 1)
                        o[e] || n[e].reverse();
                    const s = t.map((e => 2 === e.length && e[0] !== e[1])).map(( (e, t) => e ? t : void 0)).filter((e => void 0 !== e))
                        , c = s.map((t => e.edges_vertices[t])).map((t => t.map((t => e.vertices_coords[t]))))
                        , i = c.map((e => Pe.core.subtract2(e[1], e[0])))
                        , a = [];
                    return s.forEach((e => {
                            a[e] = []
                        }
                    )),
                        s.map(( (e, t) => n.map((e => Pe.core.clipLineConvexPolygon(e, i[t], c[t][0], Pe.core.exclude, Pe.core.excludeS, r))).map((e => void 0 !== e)))).forEach(( (e, t) => e.forEach(( (e, r) => {
                                e && a[s[t]].push(r)
                            }
                        )))),
                        a
                }
            )(e, t, r).map(( (t, r) => t.map((t => [e.edges_faces[r], [t, t]])))).reduce(( (e, t) => e.concat(t)), [])
            , classify_faces_pair = e => 1 === e[0] && -1 === e[1] || -1 === e[0] && 1 === e[1] ? "both" : 1 === e[0] && 1 === e[1] ? "right" : -1 === e[0] && -1 === e[1] ? "left" : void 0
            , makeTacosTortillas = (e, t=Pe.core.EPSILON) => {
                const r = makeFacesCenter(e)
                    , o = ( (e, t) => {
                        const r = e.edges_vertices.map((t => e.vertices_coords[t[0]]))
                            , o = e.edges_vertices.map((t => Pe.core.subtract2(e.vertices_coords[t[1]], e.vertices_coords[t[0]])));
                        return e.edges_faces.map(( (e, n) => e.map((e => Pe.core.cross2(Pe.core.subtract2(t[e], r[n]), o[n]))).map((e => Math.sign(e)))))
                    }
                )(e, r)
                    , n = makeEdgesEdgesParallelOverlap(e, t)
                    , s = booleanMatrixToUniqueIndexPairs(n).filter((t => t.map((t => e.edges_faces[t].length > 1)).reduce(( (e, t) => e && t), !0)))
                    , c = s.map((t => t.map((t => e.edges_faces[t]))))
                    , i = ( (e, t, r, o) => {
                        const n = r.map((t => e.edges_vertices[t[0]].map((t => e.vertices_coords[t]))))
                            , s = n.map((e => e[0]))
                            , c = n.map((e => Pe.core.subtract2(e[1], e[0])));
                        return o.map((e => e.map((e => e.map((e => t[e])))))).map(( (e, t) => e.map((e => e.map((e => Pe.core.cross2(Pe.core.subtract2(e, s[t]), c[t]))).map((e => Math.sign(e)))))))
                    }
                )(e, r, s, c)
                    , a = i.map((e => e.map(classify_faces_pair)))
                    , l = a.map(( (e, t) => {
                        return (r = e)[0] === r[1] && "both" !== r[0] ? c[t] : void 0;
                        var r
                    }
                )).filter((e => void 0 !== e))
                    , d = a.map(( (e, t) => {
                        return (r = e)[0] === r[1] && "both" === r[0] ? c[t] : void 0;
                        var r
                    }
                )).map(( (e, t) => ( (e, t) => {
                        if (void 0 !== e)
                            return t[0][0] === t[1][0] ? e : [e[0], [e[1][1], e[1][0]]]
                    }
                )(e, i[t]))).filter((e => void 0 !== e))
                    , u = makeTortillaTortillaFacesCrossing(e, o, t)
                    , p = d.concat(u)
                    , g = a.map(( (e, t) => {
                        return (r = e)[0] === r[1] || "both" !== r[0] && "both" !== r[1] ? void 0 : ( (e, t, r) => {
                                const o = "left" === t[0] || "left" === t[1] ? -1 : 1
                                    , n = "both" === t[0] ? [...e[1]] : [...e[0]]
                                    , s = "both" === t[0] ? 0 : 1;
                                return {
                                    taco: n,
                                    tortilla: r[s][0] === o ? e[s][0] : e[s][1]
                                }
                            }
                        )(c[t], a[t], i[t]);
                        var r
                    }
                )).filter((e => void 0 !== e))
                    , m = makeEdgesFacesOverlap(e, t)
                    , h = booleanMatrixToIndexedArray(m).map(( (e, t) => o[t].length > 1 && o[t][0] === o[t][1] ? e : [])).map(( (t, r) => ({
                    taco: e.edges_faces[r],
                    tortillas: t
                }))).filter((e => e.tortillas.length)).flatMap((e => e.tortillas.map((t => ({
                    taco: [...e.taco],
                    tortilla: t
                })))));
                return {
                    taco_taco: l,
                    tortilla_tortilla: p,
                    taco_tortilla: g.concat(h)
                }
            }
            , makeTransitivityTrios = (e, t, r, o=Pe.core.EPSILON) => {
                t || (t = makeFacesFacesOverlap(e, o)),
                r || (r = makeFacesWinding(e));
                const n = e.faces_vertices.map((t => t.map((t => e.vertices_coords[t]))));
                n.forEach(( (e, t) => {
                        r[t] || e.reverse()
                    }
                ));
                const s = e.faces_vertices.map(( () => []));
                for (let e = 0; e < s.length - 1; e += 1)
                    for (let r = e + 1; r < s.length; r += 1) {
                        if (!t[e][r])
                            continue;
                        const c = Pe.core.clipPolygonPolygon(n[e], n[r], o);
                        c && (s[e][r] = c)
                    }
                const c = [];
                for (let e = 0; e < s.length - 1; e += 1)
                    for (let r = e + 1; r < s.length; r += 1)
                        if (s[e][r])
                            for (let i = r + 1; i < s.length; i += 1) {
                                if (e === i || r === i)
                                    continue;
                                if (!t[e][i] || !t[r][i])
                                    continue;
                                Pe.core.clipPolygonPolygon(s[e][r], n[i], o) && c.push([e, r, i].sort(( (e, t) => e - t)))
                            }
                return c
            }
            , Xt = {
                0: 0,
                1: 2,
                2: 1
            }
            , Yt = {
                M: 1,
                m: 1,
                V: 2,
                v: 2
            }
            , makeFacePairs = (e, t) => (t || (t = makeFacesFacesOverlap(e)),
                booleanMatrixToUniqueIndexPairs(t).map((e => e.join(" "))))
            , solveEdgeAdjacentFacePairs = (e, t, r) => {
                r || (r = makeFacesWinding(e));
                const o = {};
                t.forEach((e => {
                        o[e] = !0
                    }
                ));
                const n = {};
                return e.edges_faces.forEach(( (t, s) => {
                        const c = e.edges_assignment[s]
                            , i = Yt[c];
                        if (t.length < 2 || void 0 === i)
                            return;
                        const a = r[t[0]] ? i : Xt[i]
                            , l = `${t[0]} ${t[1]}`
                            , d = `${t[1]} ${t[0]}`;
                        l in o && (n[l] = a),
                        d in o && (n[d] = Xt[a])
                    }
                )),
                    n
            }
        ;
        var Kt = Object.freeze({
            __proto__: null,
            makeFacePairs: makeFacePairs,
            solveEdgeAdjacentFacePairs: solveEdgeAdjacentFacePairs
        });
        const prepare = (e, t=1e-6) => {
                const r = makeFacesFacesOverlap(e, t)
                    , o = makeFacesWinding(e)
                    , n = makeTacosTortillas(e, t)
                    , s = ( (e, t) => {
                        const r = {};
                        return t.taco_taco.map((e => [e[0][0], e[0][1], e[1][0], e[1][1]].sort(( (e, t) => e - t)))).forEach((e => [`${e[0]} ${e[1]} ${e[2]}`, `${e[0]} ${e[1]} ${e[3]}`, `${e[0]} ${e[2]} ${e[3]}`, `${e[1]} ${e[2]} ${e[3]}`].forEach((e => {
                                r[e] = !0
                            }
                        )))),
                            t.taco_tortilla.map((e => [e.taco[0], e.taco[1], e.tortilla].sort(( (e, t) => e - t)).join(" "))).forEach((e => {
                                    r[e] = !0
                                }
                            )),
                            e.filter((e => void 0 === r[e.join(" ")]))
                    }
                )(makeTransitivityTrios(e, r, o, t), n)
                    , c = ( (e, t) => {
                        const r = {};
                        return r.taco_taco = e.taco_taco.map((e => [e[0][0], e[1][0], e[0][1], e[1][1]])),
                            r.taco_tortilla = e.taco_tortilla.map((e => [e.taco[0], e.tortilla, e.taco[1]])),
                            r.tortilla_tortilla = e.tortilla_tortilla.map((e => [e[0][0], e[0][1], e[1][0], e[1][1]])),
                            r.transitivity = t.map((e => [e[0], e[1], e[2]])),
                            r
                    }
                )(n, s)
                    , i = (e => {
                        const t = {};
                        return Object.keys(e).forEach((e => {
                                t[e] = {}
                            }
                        )),
                            Object.keys(e).forEach((r => {
                                    e[r].forEach(( (e, o) => Wt[r](e).forEach((e => {
                                            void 0 === t[r][e] && (t[r][e] = []),
                                                t[r][e].push(o)
                                        }
                                    ))))
                                }
                            )),
                            t
                    }
                )(c)
                    , a = makeFacePairs(e, r);
                return {
                    constraints: c,
                    constraintsLookup: i,
                    facePairs: a,
                    edgeAdjacentOrders: solveEdgeAdjacentFacePairs(e, a, o)
                }
            }
            , topologicalOrder = (e, t) => {
                if (!e)
                    return [];
                const r = [];
                Object.keys(e).forEach((t => {
                        const o = t.split(" ").map((e => parseInt(e, 10)));
                        -1 === e[t] && o.reverse(),
                        void 0 === r[o[0]] && (r[o[0]] = []),
                            r[o[0]].push(o[1])
                    }
                )),
                t && t.faces_vertices && t.faces_vertices.forEach(( (e, t) => {
                        void 0 === r[t] && (r[t] = [])
                    }
                ));
                const o = []
                    , n = [];
                let s = 0;
                for (let e = 0; e < r.length; e += 1) {
                    if (n[e])
                        continue;
                    const t = [e];
                    for (; t.length && s < 2 * r.length; ) {
                        const e = t[t.length - 1];
                        if (r[e] && r[e].length) {
                            const o = r[e].pop();
                            n[o] || t.push(o)
                        } else
                            o.push(e),
                                n[e] = !0,
                                t.pop(),
                                s += 1
                    }
                }
                return s >= 2 * r.length && console.warn("fix protection in topological order"),
                    o
            }
            , makePermutations = e => {
                const t = e.reduce(( (e, t) => e * t), 1)
                    , r = e.slice();
                for (let e = r.length - 2; e >= 0; e -= 1)
                    r[e] *= r[e + 1];
                return r.push(1),
                    r.shift(),
                    Array.from(Array(t)).map(( (t, o) => e.map(( (e, t) => Math.floor(o / r[t]) % e))))
            }
            , Qt = {
                count: function() {
                    return this.branches.map((e => e.length))
                },
                solution: function(...e) {
                    const t = Array(this.branches.length).fill(0).map(( (t, r) => null != e[r] ? e[r] : t))
                        , r = this.branches ? this.branches.map(( (e, r) => e[t[r]])) : [];
                    return Object.assign({}, this.root, ...r)
                },
                allSolutions: function() {
                    return makePermutations(this.count()).map((e => this.solution(...e)))
                },
                facesLayer: function(...e) {
                    return invertMap(topologicalOrder(this.solution(...e)))
                },
                allFacesLayers: function() {
                    return makePermutations(this.count()).map((e => this.facesLayer(...e)))
                },
                faceOrders: function(...e) {
                    return (e => {
                            const t = Object.keys(e)
                                , r = t.map((e => e.split(" ").map((e => parseInt(e, 10)))));
                            return r.map(( (r, o) => r.push(e[t[o]]))),
                                r
                        }
                    )(this.solution(...e))
                },
                allFaceOrders: function() {
                    return makePermutations(this.count()).map((e => this.faceOrders(...e)))
                }
            }
            , solveBranch = (e, t, r, ...o) => {
                if (!r.length)
                    return [];
                const n = r[0]
                    , s = []
                    , c = [];
                [1, 2].forEach((i => {
                        const a = propagate(e, t, [n], ...o, {
                            [n]: i
                        });
                        !1 !== a && (a[n] = i,
                            Object.keys(a).length === r.length ? s.push(a) : c.push(a))
                    }
                ));
                const i = c.map((n => solveBranch(e, t, r.filter((e => !(e in n))), ...o, n)));
                return s.map((e => [...o, e])).concat(...i)
            }
        ;
        var er = Object.assign(Object.create(null), {
            solver: (e, t=1e-6) => {
                const r = new Date
                    , {constraints: o, constraintsLookup: n, facePairs: s, edgeAdjacentOrders: c} = prepare(e, t)
                    , i = Date.now() - r
                    , a = new Date
                    , l = propagate(o, n, Object.keys(c), c);
                if (!l)
                    return;
                const d = ( (e, t, r) => {
                        const o = Object.keys(t)
                            , n = {};
                        e.forEach((e => {
                                n[e] = !0
                            }
                        ));
                        let s = 0;
                        const c = [];
                        for (; s < e.length; ) {
                            if (!n[e[s]]) {
                                s += 1;
                                continue
                            }
                            const i = []
                                , a = [e[s]]
                                , l = {
                                [e[s]]: !0
                            };
                            do {
                                const e = a.shift();
                                delete n[e],
                                    i.push(e);
                                const s = {};
                                o.forEach((o => {
                                        const n = r[o][e];
                                        n && n.map((e => t[o][e])).map((e => Wt[o](e).forEach((e => {
                                                s[e] = !0
                                            }
                                        ))))
                                    }
                                ));
                                const c = Object.keys(s).filter((e => n[e])).filter((e => !l[e]));
                                a.push(...c),
                                    c.forEach((e => {
                                            l[e] = !0
                                        }
                                    ))
                            } while (a.length);
                            s += 1,
                                c.push(i)
                        }
                        return c
                    }
                )(s.filter((e => !(e in c))).filter((e => !(e in l))), o, n).map((e => solveBranch(o, n, e, c, l))).map((e => e.map((e => Object.assign({}, ...e)))))
                    , u = {
                    ...c,
                    ...l
                };
                unsignedToSignedOrders(u),
                    d.forEach((e => e.forEach((e => unsignedToSignedOrders(e)))));
                const p = Date.now() - a;
                return p > 50 && console.log(`prep ${i}ms solver ${p}ms`),
                    Object.assign(Object.create(Qt), {
                        root: u,
                        branches: d
                    })
            }
            ,
            table: Ut,
            topologicalOrder: topologicalOrder,
            makeTacosTortillas: makeTacosTortillas,
            makeFoldedStripTacos: makeFoldedStripTacos,
            makeTransitivityTrios: makeTransitivityTrios,
            singleVertexSolver: singleVertexSolver,
            singleVertexAssignmentSolver: (e, t, r) => {
                null == t && (t = e.map(( () => "U")));
                const o = maekawaAssignments(t)
                    , n = o.map((t => singleVertexSolver(e, t, r)));
                return o.map(( (e, t) => t)).filter((e => n[e].length > 0)).map((e => ({
                    assignment: o[e],
                    layer: n[e]
                })))
            }
            ,
            validateLayerSolver: validateLayerSolver,
            validateTacoTacoFacePairs: validateTacoTacoFacePairs,
            validateTacoTortillaStrip: validateTacoTortillaStrip,
            foldStripWithAssignments: foldStripWithAssignments
        }, Tt, Kt);
        var tr = Object.freeze({
            __proto__: null,
            kawasakiSolutions: ({vertices_coords: e, vertices_edges: t, edges_vertices: r, edges_vectors: o}, n) => {
                o || (o = makeEdgesVector({
                    vertices_coords: e,
                    edges_vertices: r
                })),
                t || (t = makeVerticesEdgesUnsorted({
                    edges_vertices: r
                }));
                const s = t[n].map((e => o[e]))
                    , c = Pe.core.counterClockwiseOrder2(s).map((e => s[e]));
                return kawasakiSolutionsVectors(c)
            }
        })
            , rr = Object.assign(Object.create(null), {
            maekawaAssignments: maekawaAssignments,
            foldAngles4: (e, t, r=0) => {
                const o = (e => {
                        let t = 0
                            , r = 0;
                        for (let o = 0; o < e.length; o += 1)
                            "M" !== e[o] && "m" !== e[o] || (t += 1),
                            "V" !== e[o] && "v" !== e[o] || (r += 1);
                        for (let o = 0; o < e.length; o += 1) {
                            if (t > r && ("V" === e[o] || "v" === e[o]))
                                return o;
                            if (r > t && ("M" === e[o] || "m" === e[o]))
                                return o
                        }
                    }
                )(t);
                if (void 0 === o)
                    return;
                const n = e[(o + 1) % e.length]
                    , s = e[(o + 2) % e.length]
                    , c = Math.PI * r
                    , i = -Math.cos(n) * Math.cos(s) + Math.sin(n) * Math.sin(s) * Math.cos(Math.PI - c)
                    , a = Math.cos(Math.PI - c) - Math.sin(Math.PI - c) ** 2 * Math.sin(n) * Math.sin(s) / (1 - i)
                    , l = -Math.acos(a) + Math.PI;
                return o % 2 == 0 ? [l, c, l, c].map(( (e, t) => o === t ? -e : e)) : [c, l, c, l].map(( (e, t) => o === t ? -e : e))
            }
        }, pt, tr, vt)
            , or = {
            axioms: {
                ar: [null, "اصنع خطاً يمر بنقطتين", "اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى", "اصنع خطاً عن طريق طي خط واحد على آخر", "اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه", "اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط", "اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني", "اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه"],
                de: [null, "Falte eine Linie durch zwei Punkte", "Falte zwei Punkte aufeinander", "Falte zwei Linien aufeinander", "Falte eine Linie auf sich selbst, falte dabei durch einen Punkt", "Falte einen Punkt auf eine Linie, falte dabei durch einen anderen Punkt", "Falte einen Punkt auf eine Linie und einen weiteren Punkt auf eine weitere Linie", "Falte einen Punkt auf eine Linie und eine weitere Linie in sich selbst zusammen"],
                en: [null, "fold a line through two points", "fold two points together", "fold two lines together", "fold a line on top of itself, creasing through a point", "fold a point to a line, creasing through another point", "fold a point to a line and another point to another line", "fold a point to a line and another line onto itself"],
                es: [null, "dobla una línea entre dos puntos", "dobla dos puntos juntos", "dobla y une dos líneas", "dobla una línea sobre sí misma, doblándola hacia un punto", "dobla un punto hasta una línea, doblándola a través de otro punto", "dobla un punto hacia una línea y otro punto hacia otra línea", "dobla un punto hacia una línea y otra línea sobre sí misma"],
                fr: [null, "créez un pli passant par deux points", "pliez pour superposer deux points", "pliez pour superposer deux lignes", "rabattez une ligne sur elle-même à l'aide d'un pli qui passe par un point", "rabattez un point sur une ligne à l'aide d'un pli qui passe par un autre point", "rabattez un point sur une ligne et un autre point sur une autre ligne", "rabattez un point sur une ligne et une autre ligne sur elle-même"],
                hi: [null, "एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है", "एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ", "एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ", "एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है", "एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है", "एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है", "एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है"],
                jp: [null, "2点に沿って折り目を付けます", "2点を合わせて折ります", "2つの線を合わせて折ります", "点を通過させ、既にある線に沿って折ります", "点を線沿いに合わせ別の点を通過させ折ります", "線に向かって点を折り、同時にもう一方の線に向かってもう一方の点を折ります", "線に向かって点を折り、同時に別の線をその上に折ります"],
                ko: [null, "두 점을 통과하는 선으로 접으세요", "두 점을 함께 접으세요", "두 선을 함께 접으세요", "그 위에 선을 접으면서 점을 통과하게 접으세요", "점을 선으로 접으면서, 다른 점을 지나게 접으세요", "점을 선으로 접고 다른 점을 다른 선으로 접으세요", "점을 선으로 접고 다른 선을 그 위에 접으세요"],
                ms: [null, "lipat garisan melalui dua titik", "lipat dua titik bersama", "lipat dua garisan bersama", "lipat satu garisan di atasnya sendiri, melipat melalui satu titik", "lipat satu titik ke garisan, melipat melalui titik lain", "lipat satu titik ke garisan dan satu lagi titik ke garisan lain", "lipat satu titik ke garisan dan satu lagi garisan di atasnya sendiri"],
                pt: [null, "dobre uma linha entre dois pontos", "dobre os dois pontos para uni-los", "dobre as duas linhas para uni-las", "dobre uma linha sobre si mesma, criando uma dobra ao longo de um ponto", "dobre um ponto até uma linha, criando uma dobra ao longo de outro ponto", "dobre um ponto até uma linha e outro ponto até outra linha", "dobre um ponto até uma linha e outra linha sobre si mesma"],
                ru: [null, "сложите линию через две точки", "сложите две точки вместе", "сложите две линии вместе", "сверните линию сверху себя, сгибая через точку", "сложите точку в линию, сгибая через другую точку", "сложите точку в линию и другую точку в другую линию", "сложите точку в линию и другую линию на себя"],
                tr: [null, "iki noktadan geçen bir çizgi boyunca katla", "iki noktayı birbirine katla", "iki çizgiyi birbirine katla", "bir noktadan kıvırarak kendi üzerindeki bir çizgi boyunca katla", "başka bir noktadan kıvırarak bir noktayı bir çizgiye katla", "bir noktayı bir çizgiye ve başka bir noktayı başka bir çizgiye katla", "bir noktayı bir çizgiye ve başka bir çizgiyi kendi üzerine katla"],
                vi: [null, "tạo một nếp gấp đi qua hai điểm", "tạo nếp gấp bằng cách gấp một điểm này sang điểm khác", "tạo nếp gấp bằng cách gấp một đường lên một đường khác", "tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó", "tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng", "tạo một nếp gấp mang điểm đầu tiên đến đường đầu tiên và điểm thứ hai cho đường thứ hai", "tạo một nếp gấp mang lại một điểm cho một đường và đưa một đường thứ hai lên trên chính nó"],
                zh: [null, "通過兩點折一條線", "將兩點折疊起來", "將兩條線折疊在一起", "通過一個點折疊一條線在自身上面", "將一個點，通過另一個點折疊成一條線，", "將一個點折疊為一條線，再將另一個點折疊到另一條線", "將一個點折疊成一條線，另一條線折疊到它自身上"]
            },
            instructions: {
                fold: {
                    es: "doblez"
                },
                "valley fold": {
                    es: "doblez de valle",
                    zh: "谷摺"
                },
                "mountain fold": {
                    es: "doblez de montaña",
                    zh: "山摺"
                },
                "inside reverse fold": {
                    zh: "內中割摺"
                },
                "outside reverse fold": {
                    zh: "外中割摺"
                },
                sink: {},
                "open sink": {
                    zh: "開放式沉壓摺"
                },
                "closed sink": {
                    zh: "封閉式沉壓摺"
                },
                "rabbit ear": {
                    zh: "兔耳摺"
                },
                "double rabbit ear": {
                    zh: "雙兔耳摺"
                },
                "petal fold": {
                    zh: "花瓣摺"
                },
                blintz: {
                    zh: "坐墊基"
                },
                squash: {
                    zh: "壓摺"
                },
                "flip over": {
                    es: "dale la vuelta a tu papel"
                }
            }
        };
        const addClassToClassList = (e, ...t) => {
            if (!e)
                return;
            const r = {}
                , o = e.getAttribute("class")
                , n = o ? o.split(" ") : [];
            n.push(...t),
                n.forEach((e => {
                        r[e] = !0
                    }
                ));
            const s = Object.keys(r).join(" ");
            e.setAttribute("class", s)
        }
            , nr = {}
            , sr = {
            stroke: _
        }
            , cr = {}
            , ir = {
            M: {
                stroke: "red"
            },
            m: {
                stroke: "red"
            },
            V: {
                stroke: "blue"
            },
            v: {
                stroke: "blue"
            },
            F: {
                stroke: "lightgray"
            },
            f: {
                stroke: "lightgray"
            }
        }
            , edgesPathData = e => ( ({vertices_coords: e, edges_vertices: t}) => e && t ? t.map((t => t.map((t => e[t])))) : [])(e).map((e => {
                return `M${(t = e)[0][0]} ${t[0][1]}L${t[1][0]} ${t[1][1]}`;
                var t
            }
        )).join("")
            , edgesPathDataAssign = ({vertices_coords: e, edges_vertices: t, edges_assignment: r}) => {
            if (!e || !t)
                return {};
            if (!r)
                return {
                    u: edgesPathData({
                        vertices_coords: e,
                        edges_vertices: t
                    })
                };
            const o = (e => {
                    const t = {
                        u: [],
                        f: [],
                        v: [],
                        m: [],
                        b: []
                    }
                        , r = e[u].map((e => e.toLowerCase()));
                    return e.edges_vertices.map(( (e, t) => r[t] || "u")).forEach(( (e, r) => t[e].push(r))),
                        t
                }
            )({
                vertices_coords: e,
                edges_vertices: t,
                edges_assignment: r
            });
            return Object.keys(o).forEach((r => {
                    o[r] = edgesPathData({
                        vertices_coords: e,
                        edges_vertices: o[r].map((e => t[e]))
                    })
                }
            )),
                Object.keys(o).forEach((e => {
                        "" === o[e] && delete o[e]
                    }
                )),
                o
        }
            , applyEdgesStyle = (e, t={}) => Object.keys(t).forEach((r => e.setAttributeNS(null, r, t[r])))
            , edgesPaths = (e, t={}) => {
            const r = A.svg.g();
            if (!e)
                return r;
            const o = isFoldedForm(e)
                , n = ( ({vertices_coords: e, edges_vertices: t, edges_assignment: r}) => {
                    const o = edgesPathDataAssign({
                        vertices_coords: e,
                        edges_vertices: t,
                        edges_assignment: r
                    });
                    return Object.keys(o).forEach((e => {
                            const t = A.svg.path(o[e]);
                            addClassToClassList(t, Fe[e]),
                                o[e] = t
                        }
                    )),
                        o
                }
            )(e);
            return Object.keys(n).forEach((e => {
                    addClassToClassList(n[e], Fe[e]),
                        applyEdgesStyle(n[e], o ? cr[e] : ir[e]),
                        applyEdgesStyle(n[e], t[e]),
                        applyEdgesStyle(n[e], t[Fe[e]]),
                        r.appendChild(n[e]),
                        Object.defineProperty(r, Fe[e], {
                            get: () => n[e]
                        })
                }
            )),
                applyEdgesStyle(r, o ? nr : sr),
                applyEdgesStyle(r, t.stroke ? {
                    stroke: t.stroke
                } : {}),
                r
        }
            , edgesLines = (e, t={}) => {
            const r = A.svg.g();
            if (!e)
                return r;
            const o = isFoldedForm(e)
                , n = (e.edges_assignment ? e.edges_assignment : makeEdgesAssignment(e)).map((e => e.toLowerCase()))
                , s = {};
            ["b", "m", "v", "f", "u"].forEach((e => {
                    const n = A.svg.g();
                    r.appendChild(n),
                        addClassToClassList(n, Fe[e]),
                        applyEdgesStyle(n, o ? cr[e] : ir[e]),
                        applyEdgesStyle(n, t[Fe[e]]),
                        Object.defineProperty(r, Fe[e], {
                            get: () => n
                        }),
                        s[e] = n
                }
            ));
            const c = e.edges_vertices.map((t => t.map((t => e.vertices_coords[t])))).map((e => A.svg.line(e[0][0], e[0][1], e[1][0], e[1][1])));
            return e.edges_foldAngle && c.forEach(( (t, r) => {
                    const o = e.edges_foldAngle[r];
                    var n;
                    0 !== o && 180 !== o && -180 !== o && t.setAttributeNS(null, "opacity", (n = o,
                    Math.abs(n) / 180))
                }
            )),
                c.forEach(( (e, t) => s[n[t]].appendChild(e))),
                applyEdgesStyle(r, o ? nr : sr),
                applyEdgesStyle(r, t.stroke ? {
                    stroke: t.stroke
                } : {}),
                r
        }
            , ar = {
            back: {
                fill: y
            },
            front: {
                fill: "#ddd"
            }
        }
            , lr = {
            back: {
                opacity: .1
            },
            front: {
                opacity: .1
            }
        }
            , dr = {}
            , fr = {
            stroke: _,
            "stroke-linejoin": "bevel"
        }
            , ur = {
            stroke: b,
            fill: _,
            "stroke-linejoin": "bevel"
        }
            , pr = {
            fill: b
        }
            , applyFacesStyle = (e, t={}) => Object.keys(t).forEach((r => e.setAttributeNS(null, r, t[r])))
            , finalize_faces = (e, t, r, o) => {
            const n = isFoldedForm(e)
                , s = null != e.faces_layer
                , c = [[m], [h]]
                , i = makeFacesWinding(e);
            i.map((e => e ? c[0] : c[1])).forEach(( (e, r) => {
                    addClassToClassList(t[r], e),
                        applyFacesStyle(t[r], n ? s ? ar[e] : lr[e] : dr[e]),
                        applyFacesStyle(t[r], o[e])
                }
            ));
            return (s ? function(e, t) {
                const r = t.faces_vertices.length || t.faces_edges.length;
                return Array.from(Array(r)).map(( (e, t) => t)).filter((t => null == e[t])).concat(invertMap(e))
            }(e.faces_layer, e).map((e => t[e])) : t).forEach((e => r.appendChild(e))),
                Object.defineProperty(r, m, {
                    get: () => t.filter(( (e, t) => i[t]))
                }),
                Object.defineProperty(r, h, {
                    get: () => t.filter(( (e, t) => !i[t]))
                }),
                applyFacesStyle(r, n ? s ? fr : ur : pr),
                r
        }
            , gr = {
            fill: b
        }
            , mr = {
            stroke: _,
            fill: y
        }
            , hr = {
            vertices: (e, t={}) => {
                const r = A.svg.g();
                return e && e.vertices_coords ? (e.vertices_coords.map((e => A.svg.circle(e[0], e[1], .01))).forEach((e => r.appendChild(e))),
                    r.setAttributeNS(null, "fill", b),
                    Object.keys(t).forEach((e => r.setAttributeNS(null, e, t[e]))),
                    r) : r
            }
            ,
            edges: (e, t) => edgesFoldAngleAreAllFlat(e) ? edgesPaths(e, t) : edgesLines(e, t),
            faces: (e, t) => null != e && null != e.faces_vertices ? ( (e, t={}) => {
                    const r = A.svg.g();
                    if (!e || !e.vertices_coords || !e.faces_vertices)
                        return r;
                    const n = e.faces_vertices.map((t => t.map((t => [0, 1].map((r => e.vertices_coords[t][r])))))).map((e => A.svg.polygon(e)));
                    return n.forEach(( (e, t) => e.setAttributeNS(null, o, t))),
                        r.setAttributeNS(null, "fill", y),
                        finalize_faces(e, n, r, t)
                }
            )(e, t) : function(e, t={}) {
                const r = A.svg.g();
                if (!e || d in e == 0 || l in e == 0 || a in e == 0)
                    return r;
                const n = e.faces_edges.map((t => t.map((t => e.edges_vertices[t])).map(( (e, t, r) => {
                        const o = r[(t + 1) % r.length];
                        return e[1] === o[0] || e[1] === o[1] ? e[0] : e[1]
                    }
                )).map((t => [0, 1].map((r => e.vertices_coords[t][r])))))).map((e => A.svg.polygon(e)));
                return n.forEach(( (e, t) => e.setAttributeNS(null, o, t))),
                    r.setAttributeNS(null, "fill", "white"),
                    finalize_faces(e, n, r, t)
            }(e, t),
            boundaries: (e, t={}) => {
                const r = A.svg.g();
                if (!(e && e.vertices_coords && e.edges_vertices && e.edges_assignment))
                    return r;
                const o = getBoundary(e).vertices.map((t => [0, 1].map((r => e.vertices_coords[t][r]))));
                if (0 === o.length)
                    return r;
                const n = A.svg.polygon(o);
                return addClassToClassList(n, g),
                    r.appendChild(n),
                    ( (e, t={}) => {
                            Object.keys(t).forEach((r => e.setAttributeNS(null, r, t[r])))
                        }
                    )(r, isFoldedForm(e) ? gr : mr),
                    Object.keys(t).forEach((e => r.setAttributeNS(null, e, t[e]))),
                    r
            }
        }
            , drawGroup = (e, t, r) => {
            const o = !1 === r ? A.svg.g() : hr[e](t, r);
            return addClassToClassList(o, e),
                o
        }
            , DrawGroups = (e, t={}) => [i, c, s, n].map((r => drawGroup(r, e, t[r])));
        [i, c, s, n].forEach((e => {
                DrawGroups[e] = function(t, r={}) {
                    return drawGroup(e, t, r[e])
                }
            }
        ));
        const getBoundingRect = ({vertices_coords: e}) => {
            if (null == e || 0 === e.length)
                return;
            const t = Array(2).fill(1 / 0)
                , r = Array(2).fill(-1 / 0);
            e.forEach((e => {
                    e[0] < t[0] && (t[0] = e[0]),
                    e[0] > r[0] && (r[0] = e[0]),
                    e[1] < t[1] && (t[1] = e[1]),
                    e[1] > r[1] && (r[1] = e[1])
                }
            ));
            return Number.isNaN(t[0]) || Number.isNaN(t[1]) || Number.isNaN(r[0]) || Number.isNaN(r[1]) ? void 0 : [t[0], t[1], r[0] - t[0], r[1] - t[1]]
        }
            , findSVGInParents = e => "SVG" === (e.nodeName || "").toUpperCase() ? e : e.parentNode ? findSVGInParents(e.parentNode) : void 0
            , drawInto = (e, t, r={}) => {
            const o = DrawGroups(t, r);
            return o.filter((e => e.childNodes.length > 0)).forEach((t => e.appendChild(t))),
                ( (e, t, r, o) => {
                        const n = t[3] && t[3].childNodes.length;
                        if (!(o.strokeWidth || o.viewBox || n))
                            return;
                        const s = getBoundingRect(r)
                            , c = s ? Math.max(s[2], s[3]) : 1
                            , i = findSVGInParents(e);
                        if (i && o.viewBox) {
                            const e = s ? s.join(" ") : "0 0 1 1";
                            i.setAttributeNS(null, "viewBox", e)
                        }
                        if (o.strokeWidth || o["stroke-width"]) {
                            const t = o.strokeWidth ? o.strokeWidth : o["stroke-width"]
                                , r = "number" == typeof t ? c * t : .01 * c;
                            e.setAttributeNS(null, "stroke-width", r)
                        }
                        if (n) {
                            const e = o.vertices && null != o.vertices.radius ? o.vertices.radius : o.radius
                                , r = "string" == typeof e ? parseFloat(e) : e
                                , n = "number" != typeof r || Number.isNaN(r) ? .02 * c : c * r;
                            ( (e, t) => {
                                    for (let r = 0; r < e.childNodes.length; r += 1)
                                        e.childNodes[r].setAttributeNS(null, "r", t)
                                }
                            )(t[3], n)
                        }
                    }
                )(e, o, t, r),
                ( (e, t) => {
                        const r = [t.file_classes || [], t.frame_classes || []].flat();
                        r.length && addClassToClassList(e, ...r)
                    }
                )(e, t),
                Object.keys(DrawGroups).filter((t => null == e[t])).forEach(( (t, r) => Object.defineProperty(e, t, {
                    get: () => o[r]
                }))),
                e
        }
            , FOLDtoSVG = (e, t) => drawInto(A.svg(), e, t);
        Object.keys(DrawGroups).forEach((e => {
                FOLDtoSVG[e] = DrawGroups[e]
            }
        )),
            FOLDtoSVG.drawInto = drawInto,
            FOLDtoSVG.getViewBox = e => {
                const t = getBoundingRect(e);
                return void 0 === t ? "" : t.join(" ")
            }
            ,
            Object.defineProperty(FOLDtoSVG, "linker", {
                enumerable: !1,
                value: function(e) {
                    e.graph.svg = this;
                    const t = {
                        svg: this
                    };
                    Object.keys(t).forEach((r => {
                            e.graph.prototype[r] = function() {
                                return t[r](this, ...arguments)
                            }
                        }
                    ))
                }
                    .bind(FOLDtoSVG)
            });
        const vr = {
            init: () => {}
        };
        function SVG() {
            return vr.init(...arguments)
        }
        const _r = "class"
            , yr = "function"
            , br = "undefined"
            , Er = "number"
            , xr = "string"
            , Or = "object"
            , kr = "svg"
            , Ar = "path"
            , Mr = "id"
            , jr = "style"
            , Pr = "viewBox"
            , wr = "transform"
            , Sr = "points"
            , Lr = "stroke"
            , Cr = "none"
            , $r = "arrow"
            , Nr = "head"
            , zr = "tail"
            , Fr = typeof window !== br && typeof window.document !== br
            , Ir = typeof process !== br && null != process.versions && null != process.versions.node
            , Vr = [];
        Vr[10] = '"error 010: window" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )';
        const Br = {
            window: void 0
        };
        Fr && (Br.window = window);
        const SVGWindow = () => {
                if (void 0 === Br.window)
                    throw Vr[10];
                return Br.window
            }
        ;
        var Tr = "http://www.w3.org/2000/svg"
            , qr = {
            s: ["svg"],
            d: ["defs"],
            h: ["desc", "filter", "metadata", "style", "script", "title", "view"],
            c: ["cdata"],
            g: ["g"],
            v: ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"],
            t: ["text"],
            i: ["marker", "symbol", "clipPath", "mask"],
            p: ["linearGradient", "radialGradient", "pattern"],
            cT: ["textPath", "tspan"],
            cG: ["stop"],
            cF: ["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]
        };
        const svg_add2 = (e, t) => [e[0] + t[0], e[1] + t[1]]
            , svg_sub2 = (e, t) => [e[0] - t[0], e[1] - t[1]]
            , svg_scale2 = (e, t) => [e[0] * t, e[1] * t]
            , svg_magnitudeSq2 = e => e[0] ** 2 + e[1] ** 2
            , svg_magnitude2 = e => Math.sqrt(svg_magnitudeSq2(e))
            , svg_distanceSq2 = (e, t) => svg_magnitudeSq2(svg_sub2(e, t))
            , svg_distance2 = (e, t) => Math.sqrt(svg_distanceSq2(e, t))
            , svg_polar_to_cart = (e, t) => [Math.cos(e) * t, Math.sin(e) * t];
        var Rr = Object.freeze({
            __proto__: null,
            svg_add2: svg_add2,
            svg_sub2: svg_sub2,
            svg_scale2: svg_scale2,
            svg_magnitudeSq2: svg_magnitudeSq2,
            svg_magnitude2: svg_magnitude2,
            svg_distanceSq2: svg_distanceSq2,
            svg_distance2: svg_distance2,
            svg_polar_to_cart: svg_polar_to_cart
        });
        const arcPath = (e, t, r, o, n, s=!1) => {
            if (null == n)
                return "";
            const c = svg_polar_to_cart(o, r)
                , i = svg_polar_to_cart(n, r)
                , a = [i[0] - c[0], i[1] - c[1]]
                , l = c[0] * i[1] - c[1] * i[0]
                , d = c[0] * i[0] + c[1] * i[1]
                , u = Math.atan2(l, d) > 0 ? 0 : 1;
            let p = s ? `M ${e},${t} l ${c[0]},${c[1]} ` : `M ${e + c[0]},${t + c[1]} `;
            return p += ["a ", r, r, 0, u, 1, a[0], a[1]].join(" "),
            s && (p += " Z"),
                p
        }
            , arcArguments = (e, t, r, o, n) => [arcPath(e, t, r, o, n, !1)];
        var Gr = {
            arc: {
                nodeName: Ar,
                attributes: ["d"],
                args: arcArguments,
                methods: {
                    setArc: (e, ...t) => e.setAttribute("d", arcArguments(...t))
                }
            }
        };
        const wedgeArguments = (e, t, r, o, n) => [arcPath(e, t, r, o, n, !0)];
        var Ur = {
            wedge: {
                nodeName: Ar,
                args: wedgeArguments,
                attributes: ["d"],
                methods: {
                    setArc: (e, ...t) => e.setAttribute("d", wedgeArguments(...t))
                }
            }
        };
        const parabolaArguments = (e=-1, t=0, r=2, o=1) => Array.from(Array(129)).map(( (e, t) => (t - 128) / 128 * 2 + 1)).map((n => [e + (n + 1) * r * .5, t + n ** 2 * o]));
        var Dr = {
            parabola: {
                nodeName: "polyline",
                attributes: [Sr],
                args: (e, t, r, o) => [parabolaArguments(e, t, r, o).map((e => `${e[0]},${e[1]}`)).join(" ")]
            }
        };
        const regularPolygonArguments = (e, t, r, o) => {
                const n = [t, r];
                return Array.from(Array(e)).map(( (t, r) => 2 * Math.PI * (r / e))).map((e => [Math.cos(e), Math.sin(e)])).map((e => n.map(( (t, r) => t + o * e[r]))))
            }
        ;
        var Wr = {
            regularPolygon: {
                nodeName: "polygon",
                attributes: [Sr],
                args: (e, t=0, r=0, o=1) => [regularPolygonArguments(e, t, r, o).map((e => `${e[0]},${e[1]}`)).join(" ")]
            }
        };
        var Zr = {
            roundRect: {
                nodeName: Ar,
                attributes: ["d"],
                args: (e, t, r, o, n=0) => {
                    n > r / 2 && (n = r / 2),
                    n > o / 2 && (n = o / 2);
                    const s = r - 2 * n
                        , c = o - 2 * n
                        , i = `A${n} ${n} 0 0 1`;
                    return [[`M${e + (r - s) / 2},${t}`, `h${s}`, i, `${e + r},${t + (o - c) / 2}`, `v${c}`, i, `${e + r - n},${t + o}`, "h" + -s, i, `${e},${t + o - n}`, "v" + -c, i, `${e + n},${t}`].join(" ")]
                }
            }
        }
            , Hr = {
            toCamel: e => e.replace(/([-_][a-z])/gi, (e => e.toUpperCase().replace("-", "").replace("_", ""))),
            toKebab: e => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2").toLowerCase(),
            capitalized: e => e.charAt(0).toUpperCase() + e.slice(1)
        };
        const svg_is_iterable = e => null != e && typeof e[Symbol.iterator] === yr
            , svg_semi_flatten_arrays = function() {
            switch (arguments.length) {
                case void 0:
                case 0:
                    return Array.from(arguments);
                case 1:
                    return svg_is_iterable(arguments[0]) && typeof arguments[0] !== xr ? svg_semi_flatten_arrays(...arguments[0]) : [arguments[0]];
                default:
                    return Array.from(arguments).map((e => svg_is_iterable(e) ? [...svg_semi_flatten_arrays(e)] : e))
            }
        };
        var coordinates = (...e) => e.filter((e => typeof e === Er)).concat(e.filter((e => typeof e === Or && null !== e)).map((e => typeof e.x === Er ? [e.x, e.y] : typeof e[0] === Er ? [e[0], e[1]] : void 0)).filter((e => void 0 !== e)).reduce(( (e, t) => e.concat(t)), []));
        const Jr = [zr, Nr]
            , stringifyPoint = e => e.join(",")
            , pointsToPath = e => "M" + e.map((e => e.join(","))).join("L") + "Z"
            , setArrowheadOptions = (e, t, r) => {
            "boolean" == typeof t ? e.options[r].visible = t : typeof t === Or ? (Object.assign(e.options[r], t),
            null == t.visible && (e.options[r].visible = !0)) : null == t && (e.options[r].visible = !0)
        }
            , setArrowStyle = (e, t={}, r=Nr) => {
            const o = e.getElementsByClassName(`arrow-${r}`)[0];
            Object.keys(t).map((e => ({
                key: e,
                fn: o[Hr.toCamel(e)]
            }))).filter((e => typeof e.fn === yr && "class" !== e.key)).forEach((e => e.fn(t[e.key]))),
                Object.keys(t).filter((e => "class" === e)).forEach((e => o.classList.add(t[e])))
        }
            , redraw = e => {
            const t = function(e) {
                let t = [[0, 1], [2, 3]].map((t => t.map((t => e.points[t] || 0))))
                    , r = svg_sub2(t[1], t[0])
                    , o = svg_add2(t[0], svg_scale2(r, .5));
                const n = svg_magnitude2(r)
                    , s = Jr.map((t => e[t].visible ? (1 + e[t].padding) * e[t].height * 2.5 : 0)).reduce(( (e, t) => e + t), 0);
                if (n < s) {
                    const e = 0 === n ? [s, 0] : svg_scale2(r, s / n);
                    t = [svg_sub2, svg_add2].map((t => t(o, svg_scale2(e, .5)))),
                        r = svg_sub2(t[1], t[0])
                }
                let c = [r[1], -r[0]]
                    , i = svg_add2(o, svg_scale2(c, e.bend));
                const a = t.map((e => svg_sub2(i, e)))
                    , l = a.map((e => svg_magnitude2(e)))
                    , d = a.map(( (e, t) => 0 === l[t] ? e : svg_scale2(e, 1 / l[t])))
                    , u = d.map((e => svg_scale2(e, -1)))
                    , p = u.map((e => [e[1], -e[0]]))
                    , g = Jr.map(( (t, r) => e[t].padding ? e[t].padding : e.padding ? e.padding : 0))
                    , m = Jr.map(( (t, r) => e[t].height * (e[t].visible ? 1 : 0))).map(( (e, t) => e + g[t]))
                    , h = t.map(( (e, t) => svg_add2(e, svg_scale2(d[t], m[t]))));
                r = svg_sub2(h[1], h[0]),
                    c = [r[1], -r[0]],
                    o = svg_add2(h[0], svg_scale2(r, .5)),
                    i = svg_add2(o, svg_scale2(c, e.bend));
                const v = h.map(( (t, r) => svg_add2(t, svg_scale2(svg_sub2(i, t), e.pinch))))
                    , _ = Jr.map(( (t, r) => [svg_add2(h[r], svg_scale2(u[r], e[t].height)), svg_add2(h[r], svg_scale2(p[r], e[t].width / 2)), svg_add2(h[r], svg_scale2(p[r], -e[t].width / 2))]));
                return {
                    line: `M${stringifyPoint(h[0])}C${stringifyPoint(v[0])},${stringifyPoint(v[1])},${stringifyPoint(h[1])}`,
                    tail: pointsToPath(_[0]),
                    head: pointsToPath(_[1])
                }
            }(e.options);
            return Object.keys(t).map((t => ({
                path: t,
                element: e.getElementsByClassName(`arrow-${t}`)[0]
            }))).filter((e => e.element)).map((e => (e.element.setAttribute("d", t[e.path]),
                e))).filter((t => e.options[t.path])).forEach((t => t.element.setAttribute("visibility", e.options[t.path].visible ? "visible" : "hidden"))),
                e
        }
            , setPoints$3 = (e, ...t) => (e.options.points = coordinates(...svg_semi_flatten_arrays(...t)).slice(0, 4),
            redraw(e));
        var Xr = {
            setPoints: setPoints$3,
            points: setPoints$3,
            bend: (e, t) => (e.options.bend = t,
                redraw(e)),
            pinch: (e, t) => (e.options.pinch = t,
                redraw(e)),
            padding: (e, t) => (e.options.padding = t,
                redraw(e)),
            head: (e, t) => (setArrowheadOptions(e, t, Nr),
                setArrowStyle(e, t, Nr),
                redraw(e)),
            tail: (e, t) => (setArrowheadOptions(e, t, zr),
                setArrowStyle(e, t, zr),
                redraw(e)),
            getLine: e => e.getElementsByClassName("arrow-line")[0],
            getHead: e => e.getElementsByClassName(`arrow-${Nr}`)[0],
            getTail: e => e.getElementsByClassName(`arrow-${zr}`)[0]
        };
        const Yr = Object.keys({
            head: {
                visible: !1,
                width: 8,
                height: 10,
                padding: 0
            },
            tail: {
                visible: !1,
                width: 8,
                height: 10,
                padding: 0
            },
            bend: 0,
            padding: 0,
            pinch: .618,
            points: []
        });
        var Kr = {
            arrow: {
                nodeName: "g",
                attributes: [],
                args: () => [],
                methods: Xr,
                init: function(e, ...t) {
                    e.classList.add($r);
                    const r = ["line", zr, Nr].map((t => SVG.path().addClass(`arrow-${t}`).appendTo(e)));
                    r[0].setAttribute(jr, "fill:none;"),
                        r[1].setAttribute(Lr, Cr),
                        r[2].setAttribute(Lr, Cr),
                        e.options = {
                            head: {
                                visible: !1,
                                width: 8,
                                height: 10,
                                padding: 0
                            },
                            tail: {
                                visible: !1,
                                width: 8,
                                height: 10,
                                padding: 0
                            },
                            bend: 0,
                            padding: 0,
                            pinch: .618,
                            points: []
                        },
                        Xr.setPoints(e, ...t);
                    const o = ( (...e) => {
                            for (let t = 0; t < e.length; t += 1) {
                                if (typeof e[t] !== Or)
                                    continue;
                                const r = Object.keys(e[t]);
                                for (let o = 0; o < r.length; o += 1)
                                    if (Yr.includes(r[o]))
                                        return e[t]
                            }
                        }
                    )(...t);
                    return o && Object.keys(o).filter((e => Xr[e])).forEach((t => Xr[t](e, o[t]))),
                        e
                }
            }
        };
        const svg_flatten_arrays = function() {
                return svg_semi_flatten_arrays(arguments).reduce(( (e, t) => e.concat(t)), [])
            }
            , makeCurvePath = (e=[], t=0, r=.5) => {
                const o = [e[0] || 0, e[1] || 0]
                    , n = [e[2] || 0, e[3] || 0]
                    , s = svg_sub2(n, o)
                    , c = svg_add2(o, svg_scale2(s, .5))
                    , i = [s[1], -s[0]]
                    , a = svg_add2(c, svg_scale2(i, t))
                    , l = svg_add2(o, svg_scale2(svg_sub2(a, o), r))
                    , d = svg_add2(n, svg_scale2(svg_sub2(a, n), r));
                return `M${o[0]},${o[1]}C${l[0]},${l[1]} ${d[0]},${d[1]} ${n[0]},${n[1]}`
            }
            , getNumbersFromPathCommand = e => e.slice(1).split(/[, ]+/).map((e => parseFloat(e)))
            , getCurveEndpoints = e => {
                const t = (e => e.match(/[Mm][(0-9), .-]+/).map((e => getNumbersFromPathCommand(e))))(e).shift()
                    , r = (e => e.match(/[Cc][(0-9), .-]+/).map((e => getNumbersFromPathCommand(e))))(e).shift();
                return [...t ? [t[t.length - 2], t[t.length - 1]] : [0, 0], ...r ? [r[r.length - 2], r[r.length - 1]] : [0, 0]]
            }
            , setPoints$2 = (e, ...t) => {
                const r = coordinates(...svg_flatten_arrays(...t)).slice(0, 4);
                return e.setAttribute("d", makeCurvePath(r, e._bend, e._pinch)),
                    e
            }
        ;
        var Qr = {
            curve: {
                nodeName: Ar,
                attributes: ["d"],
                args: (...e) => [makeCurvePath(coordinates(...svg_flatten_arrays(...e)))],
                methods: {
                    setPoints: setPoints$2,
                    bend: (e, t) => (e._bend = t,
                        setPoints$2(e, ...getCurveEndpoints(e.getAttribute("d")))),
                    pinch: (e, t) => (e._pinch = t,
                        setPoints$2(e, ...getCurveEndpoints(e.getAttribute("d"))))
                }
            }
        };
        const eo = {};
        Object.assign(eo, Gr, Ur, Dr, Wr, Zr, Kr, Qr);
        const to = Object.keys(eo)
            , ro = [qr.h, qr.p, qr.i]
            , oo = [qr.g, qr.v, qr.t, to]
            , no = {
            svg: [qr.s, qr.d].concat(ro).concat(oo),
            g: oo,
            text: [qr.cT],
            linearGradient: [qr.cG],
            radialGradient: [qr.cG],
            defs: ro,
            filter: [qr.cF],
            marker: oo,
            symbol: oo,
            clipPath: oo,
            mask: oo
        }
            , so = Object.create(null);
        Object.keys(no).forEach((e => {
                so[e] = no[e].reduce(( (e, t) => e.concat(t)), [])
            }
        ));
        const viewBoxValue = function(e, t, r, o, n=0) {
            const s = r / 1 - r;
            return [e - s - n, t - s - n, r + 2 * s + 2 * n, o + 2 * s + 2 * n].join(" ")
        };
        function viewBox$1() {
            const e = coordinates(...svg_flatten_arrays(arguments));
            return 2 === e.length && e.unshift(0, 0),
                4 === e.length ? viewBoxValue(...e) : void 0
        }
        const cdata = e => (new (SVGWindow().DOMParser)).parseFromString("<root></root>", "text/xml").createCDATASection(`${e}`)
            , removeChildren = e => {
            for (; e.lastChild; )
                e.removeChild(e.lastChild);
            return e
        }
            , moveChildren = (e, t) => {
            for (; t.childNodes.length > 0; ) {
                const r = t.childNodes[0];
                t.removeChild(r),
                    e.appendChild(r)
            }
            return e
        }
            , assignSVG = (e, t) => (Array.from(t.attributes).forEach((t => e.setAttribute(t.name, t.value))),
            moveChildren(e, t));
        var co = {
            removeChildren: removeChildren,
            appendTo: (e, t) => (null != t && t.appendChild(e),
                e),
            setAttributes: (e, t) => Object.keys(t).forEach((r => e.setAttribute(Hr.toKebab(r), t[r])))
        };
        const filterWhitespaceNodes = e => {
            if (null === e)
                return e;
            for (let t = e.childNodes.length - 1; t >= 0; t -= 1) {
                const r = e.childNodes[t];
                3 === r.nodeType && r.data.match(/^\s*$/) && e.removeChild(r),
                1 === r.nodeType && filterWhitespaceNodes(r)
            }
            return e
        }
            , parse = e => (new (SVGWindow().DOMParser)).parseFromString(e, "text/xml")
            , checkParseError = e => {
            const t = e.getElementsByTagName("parsererror");
            if (t.length > 0)
                throw new Error(t[0]);
            return filterWhitespaceNodes(e.documentElement)
        }
            , sync = function(e) {
            if (typeof e === xr || e instanceof String)
                try {
                    return checkParseError(parse(e))
                } catch (e) {
                    return e
                }
            if (null != e.childNodes)
                return e
        }
            , Load = e => (e => typeof e === xr && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(e) && e.length < 1e4)(e) && Fr && typeof SVGWindow().fetch === yr ? function(e) {
            return new Promise(( (t, r) => {
                    if (typeof e === xr || e instanceof String)
                        fetch(e).then((e => e.text())).then((e => checkParseError(parse(e)))).then((e => e.nodeName === kr ? e : e.getElementsByTagName(kr)[0])).then((e => null == e ? r(new Error("valid XML found, but no SVG element")) : t(e))).catch((e => r(e)));
                    else if (e instanceof SVGWindow().Document)
                        return asyncDone(e)
                }
            ))
        }(e) : sync(e);
        const save = function(e, t) {
            if ((t = Object.assign({
                download: !1,
                output: xr,
                windowStyle: !1,
                filename: "image.svg"
            }, t)).windowStyle) {
                const t = SVGWindow().document.createElementNS(Tr, jr);
                t.setAttribute("type", "text/css"),
                    t.innerHTML = function() {
                        const e = [];
                        if (SVGWindow().document.styleSheets)
                            for (let t = 0; t < SVGWindow().document.styleSheets.length; t += 1) {
                                const r = SVGWindow().document.styleSheets[t];
                                try {
                                    const t = "cssRules"in r ? r.cssRules : r.rules;
                                    for (let r = 0; r < t.length; r += 1) {
                                        const o = t[r];
                                        "cssText"in o ? e.push(o.cssText) : e.push(`${o.selectorText} {\n${o.style.cssText}\n}\n`)
                                    }
                                } catch (e) {
                                    console.warn(e)
                                }
                            }
                        return e.join("\n")
                    }(),
                    e.appendChild(t)
            }
            const r = function vkXML(e, t) {
                const r = e.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").split("~::~")
                    , o = r.length;
                let n = !1
                    , s = 0
                    , c = "";
                const i = null != t && "string" == typeof t ? t : "\t"
                    , a = ["\n"];
                for (let e = 0; e < 100; e += 1)
                    a.push(a[e] + i);
                for (let e = 0; e < o; e += 1)
                    r[e].search(/<!/) > -1 ? (c += a[s] + r[e],
                        n = !0,
                    (r[e].search(/-->/) > -1 || r[e].search(/\]>/) > -1 || r[e].search(/!DOCTYPE/) > -1) && (n = !1)) : r[e].search(/-->/) > -1 || r[e].search(/\]>/) > -1 ? (c += r[e],
                        n = !1) : /^<\w/.exec(r[e - 1]) && /^<\/\w/.exec(r[e]) && /^<[\w:\-\.\,]+/.exec(r[e - 1]) == /^<\/[\w:\-\.\,]+/.exec(r[e])[0].replace("/", "") ? (c += r[e],
                    n || (s -= 1)) : r[e].search(/<\w/) > -1 && -1 === r[e].search(/<\//) && -1 === r[e].search(/\/>/) ? c = c += n ? r[e] : a[s++] + r[e] : r[e].search(/<\w/) > -1 && r[e].search(/<\//) > -1 ? c = c += n ? r[e] : a[s] + r[e] : r[e].search(/<\//) > -1 ? c = c += n ? r[e] : a[--s] + r[e] : r[e].search(/\/>/) > -1 ? c = c += n ? r[e] : a[s] + r[e] : r[e].search(/<\?/) > -1 || r[e].search(/xmlns\:/) > -1 || r[e].search(/xmlns\=/) > -1 ? c += a[s] + r[e] : c += r[e];
                return "\n" === c[0] ? c.slice(1) : c
            }((new (SVGWindow().XMLSerializer)).serializeToString(e));
            return t.download && Fr && !Ir && function(e, t) {
                const r = new (SVGWindow().Blob)([t],{
                    type: "text/plain"
                })
                    , o = SVGWindow().document.createElement("a");
                o.setAttribute("href", SVGWindow().URL.createObjectURL(r)),
                    o.setAttribute("download", e),
                    SVGWindow().document.body.appendChild(o),
                    o.click(),
                    SVGWindow().document.body.removeChild(o)
            }(t.filename, r),
                t.output === kr ? e : r
        }
            , setViewBox = (e, ...t) => {
            const r = 1 === t.length && typeof t[0] === xr ? t[0] : viewBox$1(...t);
            return r && e.setAttribute(Pr, r),
                e
        }
            , getViewBox = function(e) {
            const t = e.getAttribute(Pr);
            return null == t ? void 0 : t.split(" ").map((e => parseFloat(e)))
        }
            , convertToViewBox = function(e, t, r) {
            const o = e.createSVGPoint();
            o.x = t,
                o.y = r;
            const n = o.matrixTransform(e.getScreenCTM().inverse());
            return [n.x, n.y]
        };
        var io = Object.freeze({
            __proto__: null,
            setViewBox: setViewBox,
            getViewBox: getViewBox,
            convertToViewBox: convertToViewBox
        });
        const loadSVG = (e, t) => {
            const r = Load(t);
            if (null != r)
                return typeof r.then === yr ? r.then((t => assignSVG(e, t))) : assignSVG(e, r)
        }
            , getFrame = function(e) {
            const t = getViewBox(e);
            if (void 0 !== t)
                return t;
            if (typeof e.getBoundingClientRect === yr) {
                const t = e.getBoundingClientRect();
                return [t.x, t.y, t.width, t.height]
            }
            return []
        }
            , ao = "svg-background-rectangle"
            , stylesheet = function(e, t) {
            let r = function(e) {
                const t = e.getElementsByTagName(jr);
                return 0 === t.length ? void 0 : t[0]
            }(e);
            return null == r && (r = this.Constructor(jr),
                e.insertBefore(r, e.firstChild)),
                r.textContent = "",
                r.appendChild(cdata(t)),
                r
        };
        var lo = {
            clear: e => (Array.from(e.attributes).filter((e => "xmlns" !== e)).forEach((t => e.removeAttribute(t.name))),
                removeChildren(e)),
            size: setViewBox,
            setViewBox: setViewBox,
            getViewBox: getViewBox,
            padding: function(e, t) {
                const r = getViewBox(e);
                return void 0 !== r && setViewBox(e, ...[-t, -t, 2 * t, 2 * t].map(( (e, t) => r[t] + e))),
                    e
            },
            background: function(e, t) {
                let r = Array.from(e.childNodes).filter((e => e.getAttribute(_r) === ao)).shift();
                return null == r && (r = this.Constructor("rect", null, ...getFrame(e)),
                    r.setAttribute(_r, ao),
                    r.setAttribute(Lr, Cr),
                    e.insertBefore(r, e.firstChild)),
                    r.setAttribute("fill", t),
                    e
            },
            getWidth: e => getFrame(e)[2],
            getHeight: e => getFrame(e)[3],
            stylesheet: function(e, t) {
                return stylesheet.call(this, e, t)
            },
            load: loadSVG,
            save: save
        };
        const fo = {
            math: {
                vector: (...e) => [...e]
            }
        }
            , uo = {
            move: ["mousemove", "touchmove"],
            press: ["mousedown", "touchstart"],
            release: ["mouseup", "touchend"],
            leave: ["mouseleave", "touchcancel"]
        }
            , po = Object.values(uo).reduce(( (e, t) => e.concat(t)), [])
            , defineGetter = (e, t, r) => Object.defineProperty(e, t, {
            get: () => r,
            enumerable: !0,
            configurable: !0
        })
            , assignPress = (e, t) => {
            ["pressX", "pressY"].filter((t => !Object.prototype.hasOwnProperty.call(e, t))).forEach(( (r, o) => defineGetter(e, r, t[o]))),
            Object.prototype.hasOwnProperty.call(e, "press") || defineGetter(e, "press", fo.math.vector(...t))
        }
            , TouchEvents = function(e) {
            let t = [];
            const r = [];
            Object.keys(uo).forEach((e => {
                    uo[e].forEach((e => {
                            r[e] = []
                        }
                    ))
                }
            ));
            const o = {
                press: (e, r) => {
                    t = r,
                        assignPress(e, t)
                }
                ,
                release: () => {}
                ,
                leave: () => {}
                ,
                move: (e, r) => {
                    e.buttons > 0 && void 0 === t[0] ? t = r : 0 === e.buttons && void 0 !== t[0] && (t = []),
                        assignPress(e, t)
                }
            };
            Object.keys(uo).forEach((t => {
                    const n = `on${Hr.capitalized(t)}`;
                    Object.defineProperty(e, n, {
                        set: n => {
                            null != n ? uo[t].forEach((s => {
                                    const handlerFunc = r => {
                                            const s = null != r.touches ? r.touches[0] : r;
                                            if (void 0 !== s) {
                                                const n = convertToViewBox(e, s.clientX, s.clientY).map((e => Number.isNaN(e) ? void 0 : e));
                                                ["x", "y"].filter((e => !Object.prototype.hasOwnProperty.call(r, e))).forEach(( (e, t) => defineGetter(r, e, n[t]))),
                                                Object.prototype.hasOwnProperty.call(r, "position") || defineGetter(r, "position", fo.math.vector(...n)),
                                                    o[t](r, n)
                                            }
                                            n(r)
                                        }
                                    ;
                                    e.addEventListener && (r[s].push(handlerFunc),
                                        e.addEventListener(s, handlerFunc))
                                }
                            )) : (t => {
                                    uo[t].forEach((t => r[t].forEach((r => e.removeEventListener(t, r)))))
                                }
                            )(t)
                        }
                        ,
                        enumerable: !0
                    })
                }
            )),
                Object.defineProperty(e, "off", {
                    value: () => ( (e, t) => po.forEach((r => {
                            t[r].forEach((t => e.removeEventListener(r, t))),
                                t[r] = []
                        }
                    )))(e, r)
                })
        };
        var UUID = () => Math.random().toString(36).replace(/[^a-z]+/g, "").concat("aaaaa").substr(0, 5);
        const go = [["cx", "cy"], ["x", "y"]]
            , controlPoint = function(e, t={}) {
                const r = [0, 0]
                    , o = {
                    selected: !1,
                    svg: void 0,
                    updatePosition: e => e
                }
                    , updateSVG = () => {
                    o.svg && (o.svg.parentNode || e.appendChild(o.svg),
                        go.filter((e => null != o.svg[e[0]])).forEach((e => e.forEach(( (e, t) => {
                                o.svg.setAttribute(e, r[t])
                            }
                        )))))
                }
                    , n = new Proxy(r,{
                    set: (e, t, r) => (e[t] = r,
                        updateSVG(),
                        !0)
                })
                    , setPosition = function(...e) {
                    coordinates(...svg_flatten_arrays(...e)).forEach(( (e, t) => {
                            r[t] = e
                        }
                    )),
                        updateSVG(),
                    typeof r.delegate === yr && r.delegate.apply(r.pointsContainer, [n, r.pointsContainer])
                };
                return r.delegate = void 0,
                    r.setPosition = setPosition,
                    r.onMouseMove = e => o.selected ? setPosition(o.updatePosition(e)) : void 0,
                    r.onMouseUp = () => {
                        o.selected = !1
                    }
                    ,
                    r.distance = e => Math.sqrt(svg_distanceSq2(e, r)),
                    ["x", "y"].forEach(( (e, t) => Object.defineProperty(r, e, {
                        get: () => r[t],
                        set: e => {
                            r[t] = e
                        }
                    }))),
                    [kr, "updatePosition", "selected"].forEach((e => Object.defineProperty(r, e, {
                        get: () => o[e],
                        set: t => {
                            o[e] = t
                        }
                    }))),
                    Object.defineProperty(r, "remove", {
                        value: () => {
                            var e;
                            (e = o.svg) && e.parentNode && e.parentNode.removeChild(e),
                                r.delegate = void 0
                        }
                    }),
                    n
            }
            , controls = function(e, t, r) {
                let o, n;
                const s = Array.from(Array(t)).map(( () => controlPoint(e, r)))
                    , protocol = e => typeof n === yr ? n.call(s, e, o, s) : void 0;
                s.forEach((e => {
                        e.delegate = protocol,
                            e.pointsContainer = s
                    }
                ));
                e.onPress = function(e) {
                    s.length > 0 && (o = s.map(( (t, r) => ({
                        i: r,
                        d: svg_distanceSq2(t, [e.x, e.y])
                    }))).sort(( (e, t) => e.d - t.d)).shift().i,
                        s[o].selected = !0)
                }
                    ,
                    e.onMove = function(e) {
                        s.forEach((t => t.onMouseMove(e)))
                    }
                    ,
                    e.onRelease = function() {
                        s.forEach((e => e.onMouseUp())),
                            o = void 0
                    }
                    ,
                    Object.defineProperty(s, "selectedIndex", {
                        get: () => o
                    }),
                    Object.defineProperty(s, "selected", {
                        get: () => s[o]
                    }),
                    Object.defineProperty(s, "add", {
                        value: t => {
                            s.push(controlPoint(e, t))
                        }
                    }),
                    s.removeAll = () => {
                        for (; s.length > 0; )
                            s.pop().remove()
                    }
                ;
                const c = {
                    onChange: (e, t) => {
                        if (n = e,
                        !0 === t) {
                            const t = s.length - 1;
                            e.call(s, s[t], t, s)
                        }
                    }
                    ,
                    position: e => s.forEach(( (t, r) => t.setPosition(e.call(s, t, r, s)))),
                    svg: e => s.forEach(( (t, r) => {
                            t.svg = e.call(s, t, r, s)
                        }
                    ))
                };
                return Object.keys(c).forEach((e => {
                        s[e] = function() {
                            return typeof arguments[0] === yr && c[e](...arguments),
                                s
                        }
                    }
                )),
                    s.parent = function(e) {
                        return null != e && null != e.appendChild && s.forEach((t => {
                                e.appendChild(t.svg)
                            }
                        )),
                            s
                    }
                    ,
                    s
            }
            , applyControlsToSVG = e => {
                e.controls = (...t) => controls.call(e, e, ...t)
            }
        ;
        var mo = {
            svg: {
                args: (...e) => [viewBox$1(coordinates(...e))].filter((e => null != e)),
                methods: lo,
                init: (e, ...t) => {
                    t.filter((e => typeof e === xr)).forEach((t => loadSVG(e, t))),
                        t.filter((e => null != e)).filter((e => typeof e.appendChild === yr)).forEach((t => t.appendChild(e))),
                        TouchEvents(e),
                        function(e) {
                            let t;
                            const r = {};
                            let o, n = 0;
                            const removeHandlers = () => {
                                    SVGWindow().cancelAnimationFrame && SVGWindow().cancelAnimationFrame(o),
                                        Object.keys(r).forEach((e => delete r[e])),
                                        t = void 0,
                                        n = 0
                                }
                            ;
                            Object.defineProperty(e, "play", {
                                set: e => {
                                    if (removeHandlers(),
                                    null == e)
                                        return;
                                    const s = UUID();
                                    r[s] = c => {
                                        t || (t = c,
                                            n = 0),
                                            e({
                                                time: .001 * (c - t),
                                                frame: n
                                            }),
                                            n += 1,
                                        r[s] && (o = SVGWindow().requestAnimationFrame(r[s]))
                                    }
                                        ,
                                    SVGWindow().requestAnimationFrame && (o = SVGWindow().requestAnimationFrame(r[s]))
                                }
                                ,
                                enumerable: !0
                            }),
                                Object.defineProperty(e, "stop", {
                                    value: removeHandlers,
                                    enumerable: !0
                                })
                        }(e),
                        applyControlsToSVG(e)
                }
            }
        };
        const loadGroup = (e, ...t) => {
                const r = t.map((e => sync(e))).filter((e => void 0 !== e));
                return r.filter((e => e.tagName === kr)).forEach((t => moveChildren(e, t))),
                    r.filter((e => e.tagName !== kr)).forEach((t => e.appendChild(t))),
                    e
            }
        ;
        var ho = {
            g: {
                init: loadGroup,
                methods: {
                    load: loadGroup
                }
            }
        }
            , vo = Object.assign(Object.create(null), {
            svg: [Pr],
            line: ["x1", "y1", "x2", "y2"],
            rect: ["x", "y", "width", "height"],
            circle: ["cx", "cy", "r"],
            ellipse: ["cx", "cy", "rx", "ry"],
            polygon: [Sr],
            polyline: [Sr],
            path: ["d"],
            text: ["x", "y"],
            mask: [Mr],
            symbol: [Mr],
            clipPath: [Mr, "clip-rule"],
            marker: [Mr, "markerHeight", "markerUnits", "markerWidth", "orient", "refX", "refY"],
            linearGradient: ["x1", "x2", "y1", "y2"],
            radialGradient: ["cx", "cy", "r", "fr", "fx", "fy"],
            stop: ["offset", "stop-color", "stop-opacity"],
            pattern: ["patternContentUnits", "patternTransform", "patternUnits"]
        });
        const setRadius = (e, t) => (e.setAttribute(vo.circle[2], t),
            e)
            , setOrigin = (e, t, r) => ([...coordinates(...svg_flatten_arrays(t, r)).slice(0, 2)].forEach(( (t, r) => e.setAttribute(vo.circle[r], t))),
            e);
        var _o = {
            circle: {
                args: (e, t, r, o) => {
                    const n = coordinates(...svg_flatten_arrays(e, t, r, o));
                    switch (n.length) {
                        case 0:
                        case 1:
                            return [, , ...n];
                        case 2:
                        case 3:
                            return n;
                        default:
                            return ( (e, t, r, o) => [e, t, svg_distance2([e, t], [r, o])])(...n)
                    }
                }
                ,
                methods: {
                    radius: setRadius,
                    setRadius: setRadius,
                    origin: setOrigin,
                    setOrigin: setOrigin,
                    center: setOrigin,
                    setCenter: setOrigin,
                    position: setOrigin,
                    setPosition: setOrigin
                }
            }
        };
        const setRadii = (e, t, r) => ([, , t, r].forEach(( (t, r) => e.setAttribute(vo.ellipse[r], t))),
            e)
            , setCenter = (e, t, r) => ([...coordinates(...svg_flatten_arrays(t, r)).slice(0, 2)].forEach(( (t, r) => e.setAttribute(vo.ellipse[r], t))),
            e);
        var yo = {
            ellipse: {
                args: (e, t, r, o) => {
                    const n = coordinates(...svg_flatten_arrays(e, t, r, o)).slice(0, 4);
                    switch (n.length) {
                        case 0:
                        case 1:
                        case 2:
                            return [, , ...n];
                        default:
                            return n
                    }
                }
                ,
                methods: {
                    radius: setRadii,
                    setRadius: setRadii,
                    origin: setCenter,
                    setOrigin: setCenter,
                    center: setCenter,
                    setCenter: setCenter,
                    position: setCenter,
                    setPosition: setCenter
                }
            }
        };
        const Args$1 = (...e) => coordinates(...svg_semi_flatten_arrays(...e)).slice(0, 4);
        var bo = {
            line: {
                args: Args$1,
                methods: {
                    setPoints: (e, ...t) => (Args$1(...t).forEach(( (t, r) => e.setAttribute(vo.line[r], t))),
                        e)
                }
            }
        };
        const Eo = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g
            , xo = /-?[0-9]*\.?\d+/g
            , Oo = {
            m: "move",
            l: "line",
            v: "vertical",
            h: "horizontal",
            a: "ellipse",
            c: "curve",
            s: "smoothCurve",
            q: "quadCurve",
            t: "smoothQuadCurve",
            z: "close"
        };
        Object.keys(Oo).forEach((e => {
                const t = Oo[e];
                Oo[e.toUpperCase()] = t.charAt(0).toUpperCase() + t.slice(1)
            }
        ));
        const getD = e => {
            const t = e.getAttribute("d");
            return null == t ? "" : t
        }
            , appendPathCommand = (e, t, ...r) => (e.setAttribute("d", `${getD(e)}${t}${svg_flatten_arrays(...r).join(" ")}`),
            e)
            , getCommands = e => function(e) {
            const t = [];
            let r;
            for (; null !== (r = Eo.exec(e)); )
                t.push(r);
            return t.map((t => ({
                command: e[t.index],
                index: t.index
            }))).reduceRight(( (t, r) => {
                    const o = e.substring(r.index, t.length ? t[t.length - 1].index : e.length);
                    return t.concat([{
                        command: r.command,
                        index: r.index,
                        chunk: o.length > 0 ? o.substr(1, o.length - 1) : o
                    }])
                }
            ), []).reverse().map((e => {
                    const t = e.chunk.match(xo);
                    return e.en = Oo[e.command],
                        e.values = t ? t.map(parseFloat) : [],
                        delete e.chunk,
                        e
                }
            ))
        }(getD(e))
            , ko = {
            addCommand: appendPathCommand,
            appendCommand: appendPathCommand,
            clear: e => (e.removeAttribute("d"),
                e),
            getCommands: getCommands,
            get: getCommands,
            getD: e => e.getAttribute("d")
        };
        Object.keys(Oo).forEach((e => {
                ko[Oo[e]] = (t, ...r) => appendPathCommand(t, e, ...r)
            }
        ));
        var Ao = {
            path: {
                methods: ko
            }
        };
        const setRectSize = (e, t, r) => ([, , t, r].forEach(( (t, r) => e.setAttribute(vo.rect[r], t))),
            e)
            , setRectOrigin = (e, t, r) => ([...coordinates(...svg_flatten_arrays(t, r)).slice(0, 2)].forEach(( (t, r) => e.setAttribute(vo.rect[r], t))),
            e)
            , fixNegatives = function(e) {
            return [0, 1].forEach((t => {
                    e[2 + t] < 0 && (void 0 === e[0 + t] && (e[0 + t] = 0),
                        e[0 + t] += e[2 + t],
                        e[2 + t] = -e[2 + t])
                }
            )),
                e
        };
        var Mo = {
            rect: {
                args: (e, t, r, o) => {
                    const n = coordinates(...svg_flatten_arrays(e, t, r, o)).slice(0, 4);
                    switch (n.length) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            return fixNegatives([, , ...n]);
                        default:
                            return fixNegatives(n)
                    }
                }
                ,
                methods: {
                    origin: setRectOrigin,
                    setOrigin: setRectOrigin,
                    center: setRectOrigin,
                    setCenter: setRectOrigin,
                    size: setRectSize,
                    setSize: setRectSize
                }
            }
        }
            , jo = {
            style: {
                init: (e, t) => {
                    e.textContent = "",
                        e.appendChild(cdata(t))
                }
                ,
                methods: {
                    setTextContent: (e, t) => (e.textContent = "",
                        e.appendChild(cdata(t)),
                        e)
                }
            }
        }
            , Po = {
            text: {
                args: (e, t, r) => coordinates(...svg_flatten_arrays(e, t, r)).slice(0, 2),
                init: (e, t, r, o, n) => {
                    const s = [t, r, o, n].filter((e => typeof e === xr)).shift();
                    s && e.appendChild(SVGWindow().document.createTextNode(s))
                }
            }
        };
        const makeIDString = function() {
            return Array.from(arguments).filter((e => typeof e === xr || e instanceof String)).shift() || UUID()
        }
            , maskArgs = (...e) => [makeIDString(...e)];
        var wo = {
            mask: {
                args: maskArgs
            },
            clipPath: {
                args: maskArgs
            },
            symbol: {
                args: maskArgs
            },
            marker: {
                args: maskArgs,
                methods: {
                    size: setViewBox,
                    setViewBox: setViewBox
                }
            }
        };
        const getPoints = e => {
            const t = e.getAttribute(Sr);
            return null == t ? "" : t
        }
            , polyString = function() {
            return Array.from(Array(Math.floor(arguments.length / 2))).map(( (e, t) => `${arguments[2 * t + 0]},${arguments[2 * t + 1]}`)).join(" ")
        }
            , stringifyArgs = (...e) => [polyString(...coordinates(...svg_semi_flatten_arrays(...e)))]
            , setPoints = (e, ...t) => (e.setAttribute(Sr, stringifyArgs(...t)[0]),
            e)
            , addPoint = (e, ...t) => (e.setAttribute(Sr, [getPoints(e), stringifyArgs(...t)[0]].filter((e => "" !== e)).join(" ")),
            e)
            , Args = function(...e) {
            return 1 === e.length && typeof e[0] === xr ? [e[0]] : stringifyArgs(...e)
        };
        var So = {
            polyline: {
                args: Args,
                methods: {
                    setPoints: setPoints,
                    addPoint: addPoint
                }
            },
            polygon: {
                args: Args,
                methods: {
                    setPoints: setPoints,
                    addPoint: addPoint
                }
            }
        }
            , Lo = Object.assign({}, mo, ho, _o, yo, bo, Ao, Mo, jo, Po, wo, So)
            , Co = {
            presentation: ["color", "color-interpolation", "cursor", "direction", "display", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "image-rendering", "letter-spacing", "opacity", "overflow", "paint-order", "pointer-events", "preserveAspectRatio", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tabindex", "transform-origin", "user-select", "vector-effect", "visibility"],
            animation: ["accumulate", "additive", "attributeName", "begin", "by", "calcMode", "dur", "end", "from", "keyPoints", "keySplines", "keyTimes", "max", "min", "repeatCount", "repeatDur", "restart", "to", "values"],
            effects: ["azimuth", "baseFrequency", "bias", "color-interpolation-filters", "diffuseConstant", "divisor", "edgeMode", "elevation", "exponent", "filter", "filterRes", "filterUnits", "flood-color", "flood-opacity", "in", "in2", "intercept", "k1", "k2", "k3", "k4", "kernelMatrix", "lighting-color", "limitingConeAngle", "mode", "numOctaves", "operator", "order", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "primitiveUnits", "radius", "result", "seed", "specularConstant", "specularExponent", "stdDeviation", "stitchTiles", "surfaceScale", "targetX", "targetY", "type", "xChannelSelector", "yChannelSelector"],
            text: ["dx", "dy", "alignment-baseline", "baseline-shift", "dominant-baseline", "lengthAdjust", "method", "overline-position", "overline-thickness", "rotate", "spacing", "startOffset", "strikethrough-position", "strikethrough-thickness", "text-anchor", "text-decoration", "text-rendering", "textLength", "underline-position", "underline-thickness", "word-spacing", "writing-mode"],
            gradient: ["gradientTransform", "gradientUnits", "spreadMethod"]
        };
        Object.values(qr).reduce(( (e, t) => e.concat(t)), []).filter((e => void 0 === vo[e])).forEach((e => {
                vo[e] = []
            }
        )),
            [[[kr, "defs", "g"].concat(qr.v, qr.t), Co.presentation], [["filter"], Co.effects], [qr.cT.concat("text"), Co.text], [qr.cF, Co.effects], [qr.cG, Co.gradient]].forEach((e => e[0].forEach((t => {
                    vo[t] = vo[t].concat(e[1])
                }
            ))));
        const getClassList = e => {
                if (null == e)
                    return [];
                const t = e.getAttribute(_r);
                return null == t ? [] : t.split(" ").filter((e => "" !== e))
            }
        ;
        var $o = {
            addClass: (e, t) => {
                const r = getClassList(e).filter((e => e !== t));
                r.push(t),
                    e.setAttributeNS(null, _r, r.join(" "))
            }
            ,
            removeClass: (e, t) => {
                const r = getClassList(e).filter((e => e !== t));
                e.setAttributeNS(null, _r, r.join(" "))
            }
            ,
            setClass: (e, t) => {
                e.setAttributeNS(null, _r, t)
            }
            ,
            setId: (e, t) => {
                e.setAttributeNS(null, Mr, t)
            }
        };
        const getAttr = e => {
            const t = e.getAttribute(wr);
            return null == t || "" === t ? void 0 : t
        }
            , No = {
            clearTransform: e => (e.removeAttribute(wr),
                e)
        };
        ["translate", "rotate", "scale", "matrix"].forEach((e => {
                No[e] = (t, ...r) => t.setAttribute(wr, [getAttr(t), `${e}(${r.join(" ")})`].filter((e => void 0 !== e)).join(" "))
            }
        ));
        const zo = {};
        ["clip-path", "mask", "symbol", "marker-end", "marker-mid", "marker-start"].forEach((e => {
                zo[Hr.toCamel(e)] = (t, r) => t.setAttribute(e, function(e) {
                    if (null == e)
                        return "";
                    if (typeof e === xr)
                        return "url" === e.slice(0, 3) ? e : `url(#${e})`;
                    if (null != e.getAttribute)
                        return `url(#${e.getAttribute(Mr)})`;
                    return ""
                }(r))
            }
        ));
        const Fo = {};
        qr.v.push(...Object.keys(eo)),
            Object.keys(eo).forEach((e => {
                    eo[e].attributes = void 0 === eo[e].attributes ? [...Co.presentation] : eo[e].attributes.concat(Co.presentation)
                }
            )),
            Object.assign(Fo, Lo, eo),
            Object.keys(qr).forEach((e => qr[e].filter((e => void 0 === Fo[e])).forEach((e => {
                    Fo[e] = {}
                }
            ))));
        const passthrough = function() {
            return Array.from(arguments)
        };
        Object.keys(Fo).forEach((e => {
                Fo[e].nodeName || (Fo[e].nodeName = e),
                Fo[e].init || (Fo[e].init = passthrough),
                Fo[e].args || (Fo[e].args = passthrough),
                Fo[e].methods || (Fo[e].methods = {}),
                Fo[e].attributes || (Fo[e].attributes = vo[e] || [])
            }
        ));
        const assignMethods = (e, t) => {
                e.forEach((e => Object.keys(t).forEach((r => {
                        Fo[e].methods[r] = function() {
                            return t[r](...arguments),
                                arguments[0]
                        }
                    }
                ))))
            }
        ;
        assignMethods(svg_flatten_arrays(qr.t, qr.v, qr.g, qr.s, qr.p, qr.i, qr.h, qr.d), $o),
            assignMethods(svg_flatten_arrays(qr.t, qr.v, qr.g, qr.s, qr.p, qr.i, qr.h, qr.d), co),
            assignMethods(svg_flatten_arrays(qr.v, qr.g, qr.s), No),
            assignMethods(svg_flatten_arrays(qr.t, qr.v, qr.g), zo);
        const Io = {
                svg: {
                    version: "1.1",
                    xmlns: Tr
                },
                style: {
                    type: "text/css"
                }
            }
            , Vo = {}
            , constructor = (e, t, ...r) => {
                const o = SVGWindow().document.createElementNS(Tr, Fo[e].nodeName);
                return t && t.appendChild(o),
                    ( (e, t) => {
                            Io[t] && Object.keys(Io[t]).forEach((r => e.setAttribute(r, Io[t][r])))
                        }
                    )(o, e),
                    Fo[e].init(o, ...r),
                    Fo[e].args(...r).forEach(( (t, r) => {
                            null != Fo[e].attributes[r] && o.setAttribute(Fo[e].attributes[r], t)
                        }
                    )),
                    Fo[e].attributes.forEach((e => {
                            Object.defineProperty(o, Hr.toCamel(e), {
                                value: function() {
                                    return o.setAttribute(e, ...arguments),
                                        o
                                }
                            })
                        }
                    )),
                    Object.keys(Fo[e].methods).forEach((t => Object.defineProperty(o, t, {
                        value: function() {
                            return Fo[e].methods[t].call(Vo, o, ...arguments)
                        }
                    }))),
                so[e] && so[e].forEach((e => {
                        const value = function() {
                            return constructor(e, o, ...arguments)
                        };
                        Fo[e].static && Object.keys(Fo[e].static).forEach((t => {
                                value[t] = function() {
                                    return Fo[e].static[t](o, ...arguments)
                                }
                            }
                        )),
                            Object.defineProperty(o, e, {
                                value: value
                            })
                    }
                )),
                    o
            }
        ;
        Vo.Constructor = constructor;
        const Bo = {};
        Object.keys(qr).forEach((e => qr[e].forEach((e => {
                Bo[e] = (...t) => constructor(e, null, ...t)
            }
        ))));
        const link_rabbitear_math = (e, t) => {
            ["segment", "circle", "ellipse", "rect", "polygon"].filter((e => t[e] && t[e].prototype)).forEach((r => {
                    t[r].prototype.svg = function() {
                        return e.path(this.svgPath())
                    }
                }
            )),
                fo.math.vector = t.vector
        }
            , initialize = function(e, ...t) {
            t.filter((e => typeof e === yr)).forEach((t => t.call(e, e)))
        };
        vr.init = function() {
            const e = constructor(kr, null, ...arguments);
            return "loading" === SVGWindow().document.readyState ? SVGWindow().document.addEventListener("DOMContentLoaded", ( () => initialize(e, ...arguments))) : initialize(e, ...arguments),
                e
        }
            ,
            SVG.NS = Tr,
            SVG.linker = function(e) {
                e.graph && e.origami && (e.svg = this,
                    link_rabbitear_math(this, e),
                    ( (e, t) => {
                            const r = "origami";
                            Fo.origami = {
                                nodeName: "g",
                                init: function(e, ...r) {
                                    return t.graph.svg.drawInto(e, ...r)
                                },
                                args: () => [],
                                methods: Fo.g.methods,
                                attributes: Fo.g.attributes,
                                static: {}
                            },
                                Object.keys(t.graph.svg).forEach((e => {
                                        Fo.origami.static[e] = (r, ...o) => {
                                            const n = t.graph.svg[e](...o);
                                            return r.appendChild(n),
                                                n
                                        }
                                    }
                                )),
                                so.origami = [...so.g],
                                so.svg.push(r),
                                so.g.push(r),
                                e.origami = (...e) => constructor(r, null, ...e),
                                Object.keys(t.graph.svg).forEach((r => {
                                        e.origami[r] = t.graph.svg[r]
                                    }
                                ))
                        }
                    )(this, e))
            }
                .bind(SVG),
            Object.assign(SVG, Bo),
            SVG.core = Object.assign(Object.create(null), {
                load: Load,
                save: save,
                coordinates: coordinates,
                flatten: svg_flatten_arrays,
                attributes: vo,
                children: so,
                cdata: cdata
            }, Hr, $o, co, Rr, No, io),
            Object.defineProperty(SVG, "window", {
                enumerable: !1,
                set: e => {
                    var t;
                    (t = e).document || (t.document = (e => (new e.DOMParser).parseFromString("<!DOCTYPE html><title>.</title>", "text/html"))(t)),
                        Br.window = t,
                        Br.window
                }
            });
        var To = Object.freeze({
            __proto__: null,
            make_faces_geometry: e => {
                const {THREE: t} = RabbitEarWindow()
                    , r = e.vertices_coords.map((e => [e[0], e[1], e[2] || 0])).flat()
                    , o = e.vertices_coords.map(( () => [0, 0, 1])).flat()
                    , n = e.vertices_coords.map(( () => [1, 1, 1])).flat()
                    , s = e.faces_vertices.map((e => e.map(( (e, t, r) => [r[0], r[t + 1], r[t + 2]])).slice(0, e.length - 2))).flat(2)
                    , c = new t.BufferGeometry;
                return c.setAttribute("position", new t.Float32BufferAttribute(r,3)),
                    c.setAttribute("normal", new t.Float32BufferAttribute(o,3)),
                    c.setAttribute("color", new t.Float32BufferAttribute(n,3)),
                    c.setIndex(s),
                    c
            }
            ,
            make_edges_geometry: function({vertices_coords: e, edges_vertices: t, edges_assignment: r, edges_coords: o, edges_vector: n}, s=.002, c=0) {
                const {THREE: i} = RabbitEarWindow();
                o || (o = t.map((t => t.map((t => e[t]))))),
                n || (n = o.map((e => Pe.core.subtract(e[1], e[0])))),
                    o = o.map((e => e.map((e => Pe.core.resize(3, e))))),
                    n = n.map((e => Pe.core.resize(3, e)));
                const a = {
                    B: [0, 0, 0],
                    M: [0, 0, 0],
                    F: [0, 0, 0],
                    V: [0, 0, 0]
                }
                    , l = r.map((e => [a[e], a[e], a[e], a[e], a[e], a[e], a[e], a[e]])).flat(3)
                    , d = o.map(( (e, t) => ( (e, t, r, o=0) => {
                        if (Pe.core.magSquared(t) < Pe.core.EPSILON)
                            return [];
                        const n = Pe.core.normalize(t)
                            , s = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((e => Pe.core.cross3(e, n))).sort(( (e, t) => Pe.core.magnitude(t) - Pe.core.magnitude(e))).shift()
                            , c = [Pe.core.normalize(s)];
                        for (let e = 1; e < 4; e += 1)
                            c.push(Pe.core.cross3(c[e - 1], n));
                        const i = c.map((e => Pe.core.scale(e, r)))
                            , a = [-o, o].map((e => Pe.core.scale(n, e)));
                        return (0 === o ? e : e.map(( (e, t) => Pe.core.add(e, a[t])))).map((e => i.map((t => Pe.core.add(e, t))))).flat()
                    }
                )(e, n[t], s, c))).flat(2)
                    , u = n.map((e => {
                        if (Pe.core.magSquared(e) < Pe.core.EPSILON)
                            throw new Error("degenerate edge");
                        Pe.core.normalize(e);
                        const t = Pe.core.scale(Pe.core.normalize(Pe.core.cross3(e, [0, 0, -1])), s)
                            , r = Pe.core.scale(Pe.core.normalize(Pe.core.cross3(e, [0, 0, 1])), s);
                        return [t, [-t[2], t[1], t[0]], r, [-r[2], r[1], r[0]], t, [-t[2], t[1], t[0]], r, [-r[2], r[1], r[0]]]
                    }
                )).flat(2)
                    , p = o.map(( (e, t) => [8 * t + 0, 8 * t + 4, 8 * t + 1, 8 * t + 1, 8 * t + 4, 8 * t + 5, 8 * t + 1, 8 * t + 5, 8 * t + 2, 8 * t + 2, 8 * t + 5, 8 * t + 6, 8 * t + 2, 8 * t + 6, 8 * t + 3, 8 * t + 3, 8 * t + 6, 8 * t + 7, 8 * t + 3, 8 * t + 7, 8 * t + 0, 8 * t + 0, 8 * t + 7, 8 * t + 4, 8 * t + 0, 8 * t + 1, 8 * t + 3, 8 * t + 1, 8 * t + 2, 8 * t + 3, 8 * t + 5, 8 * t + 4, 8 * t + 7, 8 * t + 7, 8 * t + 6, 8 * t + 5])).flat()
                    , g = new i.BufferGeometry;
                return g.setAttribute("position", new i.Float32BufferAttribute(d,3)),
                    g.setAttribute("normal", new i.Float32BufferAttribute(u,3)),
                    g.setAttribute("color", new i.Float32BufferAttribute(l,3)),
                    g.setIndex(p),
                    g.computeVertexNormals(),
                    g
            }
        });
        const qo = Object.assign(A, wt, {
            math: Pe.core,
            axiom: axiom,
            diagram: Bt,
            layer: er,
            singleVertex: rr,
            text: or,
            webgl: To
        });
        return Object.keys(Pe).filter((e => "core" !== e)).forEach((e => {
                qo[e] = Pe[e]
            }
        )),
            Object.defineProperty(qo, "use", {
                enumerable: !1,
                value: function(e) {
                    null != e && "function" == typeof e.linker && e.linker(this)
                }
                    .bind(qo)
            }),
        x || (qo.use(FOLDtoSVG),
            qo.use(SVG)),
            Object.defineProperty(qo, "window", {
                enumerable: !1,
                set: e => {
                    var t;
                    (t = e).document || (t.document = (e => (new e.DOMParser).parseFromString("<!DOCTYPE html><title>.</title>", "text/html"))(t)),
                        k.window = t,
                        k.window,
                        SVG.window = e
                }
            }),
            qo
    }
));