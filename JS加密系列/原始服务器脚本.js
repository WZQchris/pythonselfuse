!function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i)
                    return i(g, !0);
                if (f)
                    return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND",
                j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)
        e(d[g]);
    return e
}({
    1: [function(a, b) {
        "use strict";
        function c(a) {
            this.el = document.getElementById(a)
        }
        c.prototype.getPassword = function() {
            return this.el.getPassword()
        }
        ,
        c.prototype.getVersion = function() {
            return this.el.getVersion()
        }
        ,
        c.prototype.sendCompleted = function() {
            return this.el.sendCompleted()
        }
        ,
        c.prototype.getSessionId = function() {
            return this.el.getSessionId()
        }
        ,
        c.prototype.sendEnvironmentInfo = function() {
            return this.el.sendEnvironmentInfo()
        }
        ,
        c.prototype.getLastErrorCode = function() {
            return this.el.getLastErrorCode()
        }
        ,
        c.prototype.getSendBackMessage = function() {
            return this.el.getSendBackMessage()
        }
        ,
        c.prototype.checkPassword = function() {
            return this.el.checkPassword()
        }
        ,
        c.prototype.requestSid = function() {
            return this.el.requestSid()
        }
        ,
        b.exports = c
    }
    , {}],
    2: [function(a, b) {
        "use strict";
        var c = c || function(a, b) {
            var c = {}
              , d = c.lib = {}
              , e = function() {}
              , f = d.Base = {
                extend: function(a) {
                    e.prototype = this;
                    var b = new e;
                    return a && b.mixIn(a),
                    b.hasOwnProperty("init") || (b.init = function() {
                        b.$super.init.apply(this, arguments)
                    }
                    ),
                    b.init.prototype = b,
                    b.$super = this,
                    b
                },
                create: function() {
                    var a = this.extend();
                    return a.init.apply(a, arguments),
                    a
                },
                init: function() {},
                mixIn: function(a) {
                    for (var b in a)
                        a.hasOwnProperty(b) && (this[b] = a[b]);
                    a.hasOwnProperty("toString") && (this.toString = a.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            }
              , g = d.WordArray = f.extend({
                init: function(a, c) {
                    a = this.words = a || [],
                    this.sigBytes = c != b ? c : 4 * a.length
                },
                toString: function(a) {
                    return (a || i).stringify(this)
                },
                concat: function(a) {
                    var b = this.words
                      , c = a.words
                      , d = this.sigBytes;
                    if (a = a.sigBytes,
                    this.clamp(),
                    d % 4)
                        for (var e = 0; a > e; e++)
                            b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4);
                    else if (65535 < c.length)
                        for (e = 0; a > e; e += 4)
                            b[d + e >>> 2] = c[e >>> 2];
                    else
                        b.push.apply(b, c);
                    return this.sigBytes += a,
                    this
                },
                clamp: function() {
                    var b = this.words
                      , c = this.sigBytes;
                    b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4),
                    b.length = a.ceil(c / 4)
                },
                clone: function() {
                    var a = f.clone.call(this);
                    return a.words = this.words.slice(0),
                    a
                },
                random: function(b) {
                    for (var c = [], d = 0; b > d; d += 4)
                        c.push(4294967296 * a.random() | 0);
                    return new g.init(c,b)
                }
            })
              , h = c.enc = {}
              , i = h.Hex = {
                stringify: function(a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var c = [], d = 0; a > d; d++) {
                        var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                        c.push((e >>> 4).toString(16)),
                        c.push((15 & e).toString(16))
                    }
                    return c.join("")
                },
                parse: function(a) {
                    for (var b = a.length, c = [], d = 0; b > d; d += 2)
                        c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8);
                    return new g.init(c,b / 2)
                }
            }
              , j = h.Latin1 = {
                stringify: function(a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var c = [], d = 0; a > d; d++)
                        c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                    return c.join("")
                },
                parse: function(a) {
                    for (var b = a.length, c = [], d = 0; b > d; d++)
                        c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4);
                    return new g.init(c,b)
                }
            }
              , k = h.Utf8 = {
                stringify: function(a) {
                    try {
                        return decodeURIComponent(escape(j.stringify(a)))
                    } catch (b) {
                        throw Error("Malformed UTF-8 data")
                    }
                },
                parse: function(a) {
                    return j.parse(unescape(encodeURIComponent(a)))
                }
            }
              , l = d.BufferedBlockAlgorithm = f.extend({
                reset: function() {
                    this._data = new g.init,
                    this._nDataBytes = 0
                },
                _append: function(a) {
                    "string" == typeof a && (a = k.parse(a)),
                    this._data.concat(a),
                    this._nDataBytes += a.sigBytes
                },
                _process: function(b) {
                    var c = this._data
                      , d = c.words
                      , e = c.sigBytes
                      , f = this.blockSize
                      , h = e / (4 * f)
                      , h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0);
                    if (b = h * f,
                    e = a.min(4 * b, e),
                    b) {
                        for (var i = 0; b > i; i += f)
                            this._doProcessBlock(d, i);
                        i = d.splice(0, b),
                        c.sigBytes -= e
                    }
                    return new g.init(i,e)
                },
                clone: function() {
                    var a = f.clone.call(this);
                    return a._data = this._data.clone(),
                    a
                },
                _minBufferSize: 0
            });
            d.Hasher = l.extend({
                cfg: f.extend(),
                init: function(a) {
                    this.cfg = this.cfg.extend(a),
                    this.reset()
                },
                reset: function() {
                    l.reset.call(this),
                    this._doReset()
                },
                update: function(a) {
                    return this._append(a),
                    this._process(),
                    this
                },
                finalize: function(a) {
                    return a && this._append(a),
                    this._doFinalize()
                },
                blockSize: 16,
                _createHelper: function(a) {
                    return function(b, c) {
                        return new a.init(c).finalize(b)
                    }
                },
                _createHmacHelper: function(a) {
                    return function(b, c) {
                        return new m.HMAC.init(a,c).finalize(b)
                    }
                }
            });
            var m = c.algo = {};
            return c
        }(Math);
        !function() {
            var a = c
              , b = a.lib.WordArray;
            a.enc.Base64 = {
                stringify: function(a) {
                    var b = a.words
                      , c = a.sigBytes
                      , d = this._map;
                    a.clamp(),
                    a = [];
                    for (var e = 0; c > e; e += 3)
                        for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && c > e + .75 * g; g++)
                            a.push(d.charAt(f >>> 6 * (3 - g) & 63));
                    if (b = d.charAt(64))
                        for (; a.length % 4; )
                            a.push(b);
                    return a.join("")
                },
                parse: function(a) {
                    var c = a.length
                      , d = this._map
                      , e = d.charAt(64);
                    e && (e = a.indexOf(e),
                    -1 != e && (c = e));
                    for (var e = [], f = 0, g = 0; c > g; g++)
                        if (g % 4) {
                            var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4)
                              , i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4);
                            e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4),
                            f++
                        }
                    return b.create(e, f)
                },
                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            }
        }(),
        function(a) {
            function b(a, b, c, d, e, f, g) {
                return a = a + (b & c | ~b & d) + e + g,
                (a << f | a >>> 32 - f) + b
            }
            function d(a, b, c, d, e, f, g) {
                return a = a + (b & d | c & ~d) + e + g,
                (a << f | a >>> 32 - f) + b
            }
            function e(a, b, c, d, e, f, g) {
                return a = a + (b ^ c ^ d) + e + g,
                (a << f | a >>> 32 - f) + b
            }
            function f(a, b, c, d, e, f, g) {
                return a = a + (c ^ (b | ~d)) + e + g,
                (a << f | a >>> 32 - f) + b
            }
            for (var g = c, h = g.lib, i = h.WordArray, j = h.Hasher, h = g.algo, k = [], l = 0; 64 > l; l++)
                k[l] = 4294967296 * a.abs(a.sin(l + 1)) | 0;
            h = h.MD5 = j.extend({
                _doReset: function() {
                    this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878])
                },
                _doProcessBlock: function(a, c) {
                    for (var g = 0; 16 > g; g++) {
                        var h = c + g
                          , i = a[h];
                        a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
                    }
                    var g = this._hash.words
                      , h = a[c + 0]
                      , i = a[c + 1]
                      , j = a[c + 2]
                      , l = a[c + 3]
                      , m = a[c + 4]
                      , n = a[c + 5]
                      , o = a[c + 6]
                      , p = a[c + 7]
                      , q = a[c + 8]
                      , r = a[c + 9]
                      , s = a[c + 10]
                      , t = a[c + 11]
                      , u = a[c + 12]
                      , v = a[c + 13]
                      , w = a[c + 14]
                      , x = a[c + 15]
                      , y = g[0]
                      , z = g[1]
                      , A = g[2]
                      , B = g[3]
                      , y = b(y, z, A, B, h, 7, k[0])
                      , B = b(B, y, z, A, i, 12, k[1])
                      , A = b(A, B, y, z, j, 17, k[2])
                      , z = b(z, A, B, y, l, 22, k[3])
                      , y = b(y, z, A, B, m, 7, k[4])
                      , B = b(B, y, z, A, n, 12, k[5])
                      , A = b(A, B, y, z, o, 17, k[6])
                      , z = b(z, A, B, y, p, 22, k[7])
                      , y = b(y, z, A, B, q, 7, k[8])
                      , B = b(B, y, z, A, r, 12, k[9])
                      , A = b(A, B, y, z, s, 17, k[10])
                      , z = b(z, A, B, y, t, 22, k[11])
                      , y = b(y, z, A, B, u, 7, k[12])
                      , B = b(B, y, z, A, v, 12, k[13])
                      , A = b(A, B, y, z, w, 17, k[14])
                      , z = b(z, A, B, y, x, 22, k[15])
                      , y = d(y, z, A, B, i, 5, k[16])
                      , B = d(B, y, z, A, o, 9, k[17])
                      , A = d(A, B, y, z, t, 14, k[18])
                      , z = d(z, A, B, y, h, 20, k[19])
                      , y = d(y, z, A, B, n, 5, k[20])
                      , B = d(B, y, z, A, s, 9, k[21])
                      , A = d(A, B, y, z, x, 14, k[22])
                      , z = d(z, A, B, y, m, 20, k[23])
                      , y = d(y, z, A, B, r, 5, k[24])
                      , B = d(B, y, z, A, w, 9, k[25])
                      , A = d(A, B, y, z, l, 14, k[26])
                      , z = d(z, A, B, y, q, 20, k[27])
                      , y = d(y, z, A, B, v, 5, k[28])
                      , B = d(B, y, z, A, j, 9, k[29])
                      , A = d(A, B, y, z, p, 14, k[30])
                      , z = d(z, A, B, y, u, 20, k[31])
                      , y = e(y, z, A, B, n, 4, k[32])
                      , B = e(B, y, z, A, q, 11, k[33])
                      , A = e(A, B, y, z, t, 16, k[34])
                      , z = e(z, A, B, y, w, 23, k[35])
                      , y = e(y, z, A, B, i, 4, k[36])
                      , B = e(B, y, z, A, m, 11, k[37])
                      , A = e(A, B, y, z, p, 16, k[38])
                      , z = e(z, A, B, y, s, 23, k[39])
                      , y = e(y, z, A, B, v, 4, k[40])
                      , B = e(B, y, z, A, h, 11, k[41])
                      , A = e(A, B, y, z, l, 16, k[42])
                      , z = e(z, A, B, y, o, 23, k[43])
                      , y = e(y, z, A, B, r, 4, k[44])
                      , B = e(B, y, z, A, u, 11, k[45])
                      , A = e(A, B, y, z, x, 16, k[46])
                      , z = e(z, A, B, y, j, 23, k[47])
                      , y = f(y, z, A, B, h, 6, k[48])
                      , B = f(B, y, z, A, p, 10, k[49])
                      , A = f(A, B, y, z, w, 15, k[50])
                      , z = f(z, A, B, y, n, 21, k[51])
                      , y = f(y, z, A, B, u, 6, k[52])
                      , B = f(B, y, z, A, l, 10, k[53])
                      , A = f(A, B, y, z, s, 15, k[54])
                      , z = f(z, A, B, y, i, 21, k[55])
                      , y = f(y, z, A, B, q, 6, k[56])
                      , B = f(B, y, z, A, x, 10, k[57])
                      , A = f(A, B, y, z, o, 15, k[58])
                      , z = f(z, A, B, y, v, 21, k[59])
                      , y = f(y, z, A, B, m, 6, k[60])
                      , B = f(B, y, z, A, t, 10, k[61])
                      , A = f(A, B, y, z, j, 15, k[62])
                      , z = f(z, A, B, y, r, 21, k[63]);
                    g[0] = g[0] + y | 0,
                    g[1] = g[1] + z | 0,
                    g[2] = g[2] + A | 0,
                    g[3] = g[3] + B | 0
                },
                _doFinalize: function() {
                    var b = this._data
                      , c = b.words
                      , d = 8 * this._nDataBytes
                      , e = 8 * b.sigBytes;
                    c[e >>> 5] |= 128 << 24 - e % 32;
                    var f = a.floor(d / 4294967296);
                    for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8),
                    c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                    b.sigBytes = 4 * (c.length + 1),
                    this._process(),
                    b = this._hash,
                    c = b.words,
                    d = 0; 4 > d; d++)
                        e = c[d],
                        c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8);
                    return b
                },
                clone: function() {
                    var a = j.clone.call(this);
                    return a._hash = this._hash.clone(),
                    a
                }
            }),
            g.MD5 = j._createHelper(h),
            g.HmacMD5 = j._createHmacHelper(h)
        }(Math),
        function() {
            var a = c
              , b = a.lib
              , d = b.Base
              , e = b.WordArray
              , b = a.algo
              , f = b.EvpKDF = d.extend({
                cfg: d.extend({
                    keySize: 4,
                    hasher: b.MD5,
                    iterations: 1
                }),
                init: function(a) {
                    this.cfg = this.cfg.extend(a)
                },
                compute: function(a, b) {
                    for (var c = this.cfg, d = c.hasher.create(), f = e.create(), g = f.words, h = c.keySize, c = c.iterations; g.length < h; ) {
                        i && d.update(i);
                        var i = d.update(a).finalize(b);
                        d.reset();
                        for (var j = 1; c > j; j++)
                            i = d.finalize(i),
                            d.reset();
                        f.concat(i)
                    }
                    return f.sigBytes = 4 * h,
                    f
                }
            });
            a.EvpKDF = function(a, b, c) {
                return f.create(c).compute(a, b)
            }
        }(),
        c.lib.Cipher || function(a) {
            var b = c
              , d = b.lib
              , e = d.Base
              , f = d.WordArray
              , g = d.BufferedBlockAlgorithm
              , h = b.enc.Base64
              , i = b.algo.EvpKDF
              , j = d.Cipher = g.extend({
                cfg: e.extend(),
                createEncryptor: function(a, b) {
                    return this.create(this._ENC_XFORM_MODE, a, b)
                },
                createDecryptor: function(a, b) {
                    return this.create(this._DEC_XFORM_MODE, a, b)
                },
                init: function(a, b, c) {
                    this.cfg = this.cfg.extend(c),
                    this._xformMode = a,
                    this._key = b,
                    this.reset()
                },
                reset: function() {
                    g.reset.call(this),
                    this._doReset()
                },
                process: function(a) {
                    return this._append(a),
                    this._process()
                },
                finalize: function(a) {
                    return a && this._append(a),
                    this._doFinalize()
                },
                keySize: 4,
                ivSize: 4,
                _ENC_XFORM_MODE: 1,
                _DEC_XFORM_MODE: 2,
                _createHelper: function(a) {
                    return {
                        encrypt: function(b, c, d) {
                            return ("string" == typeof c ? p : o).encrypt(a, b, c, d)
                        },
                        decrypt: function(b, c, d) {
                            return ("string" == typeof c ? p : o).decrypt(a, b, c, d)
                        }
                    }
                }
            });
            d.StreamCipher = j.extend({
                _doFinalize: function() {
                    return this._process(!0)
                },
                blockSize: 1
            });
            var k = b.mode = {}
              , l = function(b, c, d) {
                var e = this._iv;
                e ? this._iv = a : e = this._prevBlock;
                for (var f = 0; d > f; f++)
                    b[c + f] ^= e[f]
            }
              , m = (d.BlockCipherMode = e.extend({
                createEncryptor: function(a, b) {
                    return this.Encryptor.create(a, b)
                },
                createDecryptor: function(a, b) {
                    return this.Decryptor.create(a, b)
                },
                init: function(a, b) {
                    this._cipher = a,
                    this._iv = b
                }
            })).extend();
            m.Encryptor = m.extend({
                processBlock: function(a, b) {
                    var c = this._cipher
                      , d = c.blockSize;
                    l.call(this, a, b, d),
                    c.encryptBlock(a, b),
                    this._prevBlock = a.slice(b, b + d)
                }
            }),
            m.Decryptor = m.extend({
                processBlock: function(a, b) {
                    var c = this._cipher
                      , d = c.blockSize
                      , e = a.slice(b, b + d);
                    c.decryptBlock(a, b),
                    l.call(this, a, b, d),
                    this._prevBlock = e
                }
            }),
            k = k.CBC = m,
            m = (b.pad = {}).Pkcs7 = {
                pad: function(a, b) {
                    for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, e = [], g = 0; c > g; g += 4)
                        e.push(d);
                    c = f.create(e, c),
                    a.concat(c)
                },
                unpad: function(a) {
                    a.sigBytes -= 255 & a.words[a.sigBytes - 1 >>> 2]
                }
            },
            d.BlockCipher = j.extend({
                cfg: j.cfg.extend({
                    mode: k,
                    padding: m
                }),
                reset: function() {
                    j.reset.call(this);
                    var a = this.cfg
                      , b = a.iv
                      , a = a.mode;
                    if (this._xformMode == this._ENC_XFORM_MODE)
                        var c = a.createEncryptor;
                    else
                        c = a.createDecryptor,
                        this._minBufferSize = 1;
                    this._mode = c.call(a, this, b && b.words)
                },
                _doProcessBlock: function(a, b) {
                    this._mode.processBlock(a, b)
                },
                _doFinalize: function() {
                    var a = this.cfg.padding;
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        a.pad(this._data, this.blockSize);
                        var b = this._process(!0)
                    } else
                        b = this._process(!0),
                        a.unpad(b);
                    return b
                },
                blockSize: 4
            });
            var n = d.CipherParams = e.extend({
                init: function(a) {
                    this.mixIn(a)
                },
                toString: function(a) {
                    return (a || this.formatter).stringify(this)
                }
            })
              , k = (b.format = {}).OpenSSL = {
                stringify: function(a) {
                    var b = a.ciphertext;
                    return a = a.salt,
                    (a ? f.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(h)
                },
                parse: function(a) {
                    a = h.parse(a);
                    var b = a.words;
                    if (1398893684 == b[0] && 1701076831 == b[1]) {
                        var c = f.create(b.slice(2, 4));
                        b.splice(0, 4),
                        a.sigBytes -= 16
                    }
                    return n.create({
                        ciphertext: a,
                        salt: c
                    })
                }
            }
              , o = d.SerializableCipher = e.extend({
                cfg: e.extend({
                    format: k
                }),
                encrypt: function(a, b, c, d) {
                    d = this.cfg.extend(d);
                    var e = a.createEncryptor(c, d);
                    return b = e.finalize(b),
                    e = e.cfg,
                    n.create({
                        ciphertext: b,
                        key: c,
                        iv: e.iv,
                        algorithm: a,
                        mode: e.mode,
                        padding: e.padding,
                        blockSize: a.blockSize,
                        formatter: d.format
                    })
                },
                decrypt: function(a, b, c, d) {
                    return d = this.cfg.extend(d),
                    b = this._parse(b, d.format),
                    a.createDecryptor(c, d).finalize(b.ciphertext)
                },
                _parse: function(a, b) {
                    return "string" == typeof a ? b.parse(a, this) : a
                }
            })
              , b = (b.kdf = {}).OpenSSL = {
                execute: function(a, b, c, d) {
                    return d || (d = f.random(8)),
                    a = i.create({
                        keySize: b + c
                    }).compute(a, d),
                    c = f.create(a.words.slice(b), 4 * c),
                    a.sigBytes = 4 * b,
                    n.create({
                        key: a,
                        iv: c,
                        salt: d
                    })
                }
            }
              , p = d.PasswordBasedCipher = o.extend({
                cfg: o.cfg.extend({
                    kdf: b
                }),
                encrypt: function(a, b, c, d) {
                    return d = this.cfg.extend(d),
                    c = d.kdf.execute(c, a.keySize, a.ivSize),
                    d.iv = c.iv,
                    a = o.encrypt.call(this, a, b, c.key, d),
                    a.mixIn(c),
                    a
                },
                decrypt: function(a, b, c, d) {
                    return d = this.cfg.extend(d),
                    b = this._parse(b, d.format),
                    c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt),
                    d.iv = c.iv,
                    o.decrypt.call(this, a, b, c.key, d)
                }
            })
        }(),
        function() {
            for (var a = c, b = a.lib.BlockCipher, d = a.algo, e = [], f = [], g = [], h = [], i = [], j = [], k = [], l = [], m = [], n = [], o = [], p = 0; 256 > p; p++)
                o[p] = 128 > p ? p << 1 : p << 1 ^ 283;
            for (var q = 0, r = 0, p = 0; 256 > p; p++) {
                var s = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4
                  , s = s >>> 8 ^ 255 & s ^ 99;
                e[q] = s,
                f[s] = q;
                var t = o[q]
                  , u = o[t]
                  , v = o[u]
                  , w = 257 * o[s] ^ 16843008 * s;
                g[q] = w << 24 | w >>> 8,
                h[q] = w << 16 | w >>> 16,
                i[q] = w << 8 | w >>> 24,
                j[q] = w,
                w = 16843009 * v ^ 65537 * u ^ 257 * t ^ 16843008 * q,
                k[s] = w << 24 | w >>> 8,
                l[s] = w << 16 | w >>> 16,
                m[s] = w << 8 | w >>> 24,
                n[s] = w,
                q ? (q = t ^ o[o[o[v ^ t]]],
                r ^= o[o[r]]) : q = r = 1
            }
            var x = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
              , d = d.AES = b.extend({
                _doReset: function() {
                    for (var a = this._key, b = a.words, c = a.sigBytes / 4, a = 4 * ((this._nRounds = c + 6) + 1), d = this._keySchedule = [], f = 0; a > f; f++)
                        if (c > f)
                            d[f] = b[f];
                        else {
                            var g = d[f - 1];
                            f % c ? c > 6 && 4 == f % c && (g = e[g >>> 24] << 24 | e[g >>> 16 & 255] << 16 | e[g >>> 8 & 255] << 8 | e[255 & g]) : (g = g << 8 | g >>> 24,
                            g = e[g >>> 24] << 24 | e[g >>> 16 & 255] << 16 | e[g >>> 8 & 255] << 8 | e[255 & g],
                            g ^= x[f / c | 0] << 24),
                            d[f] = d[f - c] ^ g
                        }
                    for (b = this._invKeySchedule = [],
                    c = 0; a > c; c++)
                        f = a - c,
                        g = c % 4 ? d[f] : d[f - 4],
                        b[c] = 4 > c || 4 >= f ? g : k[e[g >>> 24]] ^ l[e[g >>> 16 & 255]] ^ m[e[g >>> 8 & 255]] ^ n[e[255 & g]]
                },
                encryptBlock: function(a, b) {
                    this._doCryptBlock(a, b, this._keySchedule, g, h, i, j, e)
                },
                decryptBlock: function(a, b) {
                    var c = a[b + 1];
                    a[b + 1] = a[b + 3],
                    a[b + 3] = c,
                    this._doCryptBlock(a, b, this._invKeySchedule, k, l, m, n, f),
                    c = a[b + 1],
                    a[b + 1] = a[b + 3],
                    a[b + 3] = c
                },
                _doCryptBlock: function(a, b, c, d, e, f, g, h) {
                    for (var i = this._nRounds, j = a[b] ^ c[0], k = a[b + 1] ^ c[1], l = a[b + 2] ^ c[2], m = a[b + 3] ^ c[3], n = 4, o = 1; i > o; o++)
                        var p = d[j >>> 24] ^ e[k >>> 16 & 255] ^ f[l >>> 8 & 255] ^ g[255 & m] ^ c[n++]
                          , q = d[k >>> 24] ^ e[l >>> 16 & 255] ^ f[m >>> 8 & 255] ^ g[255 & j] ^ c[n++]
                          , r = d[l >>> 24] ^ e[m >>> 16 & 255] ^ f[j >>> 8 & 255] ^ g[255 & k] ^ c[n++]
                          , m = d[m >>> 24] ^ e[j >>> 16 & 255] ^ f[k >>> 8 & 255] ^ g[255 & l] ^ c[n++]
                          , j = p
                          , k = q
                          , l = r;
                    p = (h[j >>> 24] << 24 | h[k >>> 16 & 255] << 16 | h[l >>> 8 & 255] << 8 | h[255 & m]) ^ c[n++],
                    q = (h[k >>> 24] << 24 | h[l >>> 16 & 255] << 16 | h[m >>> 8 & 255] << 8 | h[255 & j]) ^ c[n++],
                    r = (h[l >>> 24] << 24 | h[m >>> 16 & 255] << 16 | h[j >>> 8 & 255] << 8 | h[255 & k]) ^ c[n++],
                    m = (h[m >>> 24] << 24 | h[j >>> 16 & 255] << 16 | h[k >>> 8 & 255] << 8 | h[255 & l]) ^ c[n++],
                    a[b] = p,
                    a[b + 1] = q,
                    a[b + 2] = r,
                    a[b + 3] = m
                },
                keySize: 8
            });
            a.AES = b._createHelper(d)
        }(),
        c.pad.ZeroPadding = {
            pad: function(a, b) {
                var c = 4 * b;
                a.clamp(),
                a.sigBytes += c - (a.sigBytes % c || c)
            },
            unpad: function(a) {
                for (var b = a.words, c = a.sigBytes - 1; !(b[c >>> 2] >>> 24 - c % 4 * 8 & 255); )
                    c--;
                a.sigBytes = c + 1
            }
        },
        b.exports = c
    }
    , {}],
    3: [function(a, b) {
        "use strict";
        function c(a) {
            var b = document.createElement("link");
            b.setAttribute("rel", "stylesheet"),
            b.setAttribute("type", "text/css"),
            b.setAttribute("href", a),
            document.getElementsByTagName("head")[0].appendChild(b)
        }
        var d = a("./dom")
          , e = ['<div id="ucsl-dialog" class="ucsl-dialog" style="display:none;">', '<div class="ucsl-dialog-title">', '<span id="dialog-close" class="ucsl-dialog-title-close"></span>', '<span id="dialog-title" class="ucsl-dialog-title-word">安全控件提示</span>', "</div>", '<div class="ucsl-dialog-content">', '<div id="dialog-content" class="orange">', "安装安全控件后，请重启浏览器", "</div>", "</div>", "</div>", '<div class="ucsl-layerMask" id="layerMask"></div>'];
        c("//cas.*****.com/ucsl/ucsl.css"),
        d.addHTML(document.body, e.join(""));
        var f = document.getElementById("ucsl-dialog")
          , g = document.getElementById("layerMask")
          , h = document.getElementById("dialog-title")
          , i = document.getElementById("dialog-content")
          , j = null
          , k = {
            show: function() {
                var a = void 0 === arguments[0] ? {} : arguments[0]
                  , b = a.title
                  , c = void 0 === b ? "安全控件提示" : b
                  , e = a.msg
                  , k = void 0 === e ? "安装安全控件后，请重启浏览器" : e
                  , l = document.documentElement || document.body
                  , m = Math.max(l.scrollWidth, l.clientWidth)
                  , n = Math.max(l.scrollHeight, l.clientHeight);
                return h.innerHTML = c,
                i.innerHTML = k,
                d.setStyle(f, "left", parseInt(m / 2, 10) - 288 + "px"),
                d.setStyle(g, "width", m + "px"),
                d.setStyle(g, "height", n + "px"),
                g.style.display = f.style.display = "block",
                j && (j.style.cssText = "position:absolute;left:-99999999px")
            },
            hide: function() {
                return d.setStyle(f, "left", "-3000px"),
                g.style.display = f.style.display = "none",
                j && (j.style.cssText = "")
            },
            setPlugin: function(a) {
                j = a
            }
        };
        d.addEvent(document.getElementById("dialog-close"), "click", k.hide),
        b.exports = k
    }
    , {
        "./dom": 4
    }],
    4: [function(a, b) {
        "use strict";
        b.exports = {
            addHTML: function(a, b) {
                if (window.ActiveXObject)
                    return a.insertAdjacentHTML("BeforeEnd", b);
                var c = a.ownerDocument.createRange();
                c.setStartBefore(a);
                var d = c.createContextualFragment(b);
                a.appendChild(d)
            },
            addEvent: function(a, b, c) {
                null !== a && (a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener ? a.addEventListener(b, c, !1) : a["on" + b] = c)
            },
            setStyle: function(a, b, c) {
                a.style[b] = c
            }
        }
    }
    , {}],
    5: [function(a, b) {
        "use strict";
        b.exports = {
            error98: ['<div style="text-align:left">', '<div style="display:inline-block;margin: 4px 0;">本次登录失败可能由于以下情况导致，请尝试：</div>', '<div style="display:inline-block;margin: 4px 0;">', "(1) 您电脑的日期设置有误，请调准您电脑的日期设置。", "</div>", '<div style="display:inline-block;margin: 4px 0;">', "(2) 您尚未安装控件证书，请", '<a style="color: #5277c7;font-weight:normal;" href="http://aq.*****.com/Downloads/*****SafeRoot.zip">', "点击安装", "</a>。", "</div>", '<div style="display:inline-block;margin: 4px 0 20px;">', "(3) 控件可能被某些安全软件拦截，请在相应安全软件中将控件设置为信任。", "</div>", '<div style="display:inline-block;margin: 4px 0;color: #999;font-size: 12px;font-weight:normal;">', "控件安装或使用过程中有其它疑问，请", '<a style="color: #5277c7;" href="http://aq.*****.com/Downloads/*****SafeFaq.doc">点击下载FAQ</a>', "</div>", "</div>"].join(""),
            errorCommon: "安全控件加载失败，请刷新页面后重试。错误码：",
            notLoad: ['<p style="text-align:left;">', "请检查地址栏右侧图标,点击后选择一直允许运行<br>", "刷新浏览器后即可使用安全控件", "</p>"].join(""),
            timeOut: ['<p style="text-align:left;">', "请检查浏览器是否有设置代理或自动配置脚本<br>", "(打开IE->工具->internet选项->连接->局域网设置)<br><br>", "如设置，请关闭代理设置与自动配置后刷新页面重试<br>", "如没有设置，请直接联系客户排查isafe.*****.com网络问题", "</p>"].join("")
        }
    }
    , {}],
    6: [function(a, b) {
        "use strict";
        function c(a) {
            return h.call(a).replace(/\[object\s(\w+)\]/g, "$1")
        }
        function d(a, b) {
            if ("String" === c(a) && "Object" === c(b)) {
                var d = [];
                for (var e in b)
                    b.hasOwnProperty(e) && d.push(e + "=" + b[e]);
                return a += (a.indexOf("?") > 0 ? "&" : "?") + d.join("&")
            }
            return null
        }
        function e() {
            return "ucCommonLogin_callback_" + g.createGuid()
        }
        var f = arguments
          , g = a("./util")
          , h = Object.prototype.toString;
        b.exports = function(a, b, g) {
            if (f.length < 2)
                throw new Error("url and callback should not be empty!");
            2 === f.length && (g = b,
            b = {});
            var h = e()
              , i = document.createElement("script");
            b.callback = h,
            i.src = d(a, b),
            window[h] = function() {
                for (var a = arguments.length, b = Array(a), d = 0; a > d; d++)
                    b[d] = arguments[d];
                "Function" === c(g) && g.apply(void 0, b),
                window[h] = null;
                try {
                    delete window[h]
                } catch (e) {}
                document.getElementsByTagName("head")[0].removeChild(i)
            }
            ,
            document.getElementsByTagName("head")[0].appendChild(i)
        }
    }
    , {
        "./util": 11
    }],
    7: [function(a, b) {
        "use strict";
        function c() {
            var a = navigator.userAgent
              , b = /windows/i.test(a)
              , c = a.match(/msie ([\d.]+)/i)
              , d = c && +c[1].slice(0, 2) <= 10
              , e = a.match(/chrome\/([\d.]+)/i)
              , f = e && +e[1].slice(0, 2) < 42;
            return b && (f || d) ? !0 : !1
        }
        var d = a("./dialog");
        b.exports = {
            init: function(b) {
                var d = void 0;
                "standard" === b.type ? (d = a("./standard"),
                this.type = "standard") : (this.type = c() ? "NPAPI" : "standard",
                d = a(c() ? "./npapi" : "./standard")),
                d.init.call(d, b),
                this.verify = d.verify,
                this.isInstall = d.isInstall,
                this.reload = d.reload
            },
            dialog: d.showDialog,
            support: function() {
                return !0
            }
        }
    }
    , {
        "./dialog": 3,
        "./npapi": 8,
        "./standard": 10
    }],
    8: [function(a, b) {
        "use strict";
        function c() {
            D.value = t.getSessionId(),
            E.value = t.getPassword()
        }
        function d() {
            return t.sendCompleted()
        }
        function e() {
            switch (y) {
            case 0:
            case 2e4:
                return B(),
                !0;
            case -3:
            case 19997:
                z.is360 = z.is360 || t.getSendBackMessage(),
                w.show({
                    msg: z.is360
                });
                break;
            case -98:
            case 19902:
                w.show({
                    msg: z.error98
                });
                break;
            case null:
                w.show({
                    msg: z.notLoad
                });
                break;
            case -999999:
                w.show({
                    msg: z.timeOut
                });
                break;
            default:
                w.show({
                    msg: z.errorCommon + y
                })
            }
            return C(),
            !1
        }
        function f() {
            y = +t.getLastErrorCode(),
            e()
        }
        function g(a) {
            0 === a ? p() : (y = -999999,
            e())
        }
        function h(a, b) {
            var c = void 0 === arguments[2] ? 8e3 : arguments[2]
              , d = !1
              , e = window.setInterval(function() {
                0 === a() && (d = !0,
                clearInterval(e),
                clearTimeout(f),
                b(0))
            }, 200)
              , f = window.setTimeout(function() {
                d || (clearInterval(e),
                b(a())),
                clearTimeout(f)
            }, c)
        }
        function i() {
            h(d, g, 5e3)
        }
        function j() {
            for (var a = t.getVersion(), b = F.length; b--; )
                if (a === F[b])
                    return !0;
            return !1
        }
        function k() {
            return t.getVersion().replace(/\.\d+$/, "") !== G
        }
        function l() {
            if (window.ActiveXObject) {
                if (navigator.plugins["*****.Medusa"])
                    return !0;
                try {
                    new window.ActiveXObject("*****.Medusa")
                } catch (a) {
                    return !1
                }
                return !0
            }
            var b = navigator.mimeTypes["application/x-*****-safe"];
            return b ? b.enabledPlugin : !1
        }
        function m() {
            var a = void 0 === arguments[0] ? "" : arguments[0]
              , b = void 0 === arguments[1] ? "请点此安装控件" : arguments[1]
              , c = "http://aq.*****.com/nologin/aqplugindownload/?a=3&v=" + a
              , d = '<a id="ucsl-link-install" class="install-plug" href="' + c + '">' + b + "</a>";
            x.innerHTML = d,
            v.addEvent(document.getElementById("ucsl-link-install"), "click", function() {
                w.show({
                    msg: "安装安全控件后，请刷新或重启浏览器"
                })
            }),
            C()
        }
        function n() {
            var a = void 0 === arguments[0] ? {
                width: "100%",
                height: "100%",
                tabindex: 2
            } : arguments[0];
            a.id = "ucsl-password-edit";
            var b = ['<input name="sid" type="hidden" id="ucsl-input-sid" />', '<input name="pwd" type="hidden" id="ucsl-input-pwd" />'];
            b.push('<object type="application/x-*****-safe" ');
            for (var c in a)
                b.push(" " + c + '="' + a[c] + '"');
            b.push("/>"),
            v.addHTML(x, b.join("")),
            t = new u("ucsl-password-edit"),
            w.setPlugin(t.el)
        }
        function o(a) {
            n(a.style),
            setTimeout(function() {
                return D = document.getElementById("ucsl-input-sid"),
                E = document.getElementById("ucsl-input-pwd"),
                k() ? void m(t.getVersion(), "升级百度安全控件") : j() ? void m(t.getVersion(), "升级百度安全控件") : void i()
            }, 10)
        }
        function p() {
            t.sendEnvironmentInfo(),
            h(d, f)
        }
        function q(a) {
            return x = document.getElementById(a.fid),
            l() ? (B = a.ready || B,
            C = a.fail || C,
            void o(a)) : m()
        }
        function r() {
            return t.checkPassword() ? (c(),
            e()) : !1
        }
        function s() {
            t.requestSid(),
            i()
        }
        var t = null
          , u = a("./*****SafeInput")
          , v = a("./dom")
          , w = a("./dialog")
          , x = null
          , y = null
          , z = a("./error")
          , A = a("./util")
          , B = A.noop
          , C = A.noop
          , D = null
          , E = null
          , F = ["1.0.1.9"]
          , G = "1.0.1";
        b.exports = {
            init: q,
            verify: r,
            reload: s,
            isInstall: l()
        }
    }
    , {
        "./*****SafeInput": 1,
        "./dialog": 3,
        "./dom": 4,
        "./error": 5,
        "./util": 11
    }],
    9: [function(a, b, c) {
        "use strict";
        function d(a) {
            L = a,
            M = new Array(L);
            for (var b = 0; b < M.length; b++)
                M[b] = 0;
            N = new e,
            O = new e,
            O.digits[0] = 1
        }
        function e(a) {
            this.digits = "boolean" == typeof a && 1 == a ? null : M.slice(0),
            this.isNeg = !1
        }
        function f(a) {
            var b = new e(!0);
            return b.digits = a.digits.slice(0),
            b.isNeg = a.isNeg,
            b
        }
        function g(a) {
            var b = new e;
            b.isNeg = 0 > a,
            a = Math.abs(a);
            for (var c = 0; a > 0; )
                b.digits[c++] = a & U,
                a >>= P;
            return b
        }
        function h(a) {
            for (var b = "", c = a.length - 1; c > -1; --c)
                b += a.charAt(c);
            return b
        }
        function i(a, b) {
            var c = new e;
            c.digits[0] = b;
            for (var d = D(a, c), f = V[d[1].digits[0]]; 1 == C(d[0], N); )
                d = D(d[0], c),
                digit = d[1].digits[0],
                f += V[d[1].digits[0]];
            return (a.isNeg ? "-" : "") + h(f)
        }
        function j(a) {
            for (var b = 15, c = "", d = 0; 4 > d; ++d)
                c += W[a & b],
                a >>>= 4;
            return h(c)
        }
        function k(a) {
            for (var b = "", c = (s(a),
            s(a)); c > -1; --c)
                b += j(a.digits[c]);
            return b
        }
        function l(a) {
            var b, c = 48, d = c + 9, e = 97, f = e + 25, g = 65, h = 90;
            return b = a >= c && d >= a ? a - c : a >= g && h >= a ? 10 + a - g : a >= e && f >= a ? 10 + a - e : 0
        }
        function m(a) {
            for (var b = 0, c = Math.min(a.length, 4), d = 0; c > d; ++d)
                b <<= 4,
                b |= l(a.charCodeAt(d));
            return b
        }
        function n(a) {
            for (var b = new e, c = a.length, d = c, f = 0; d > 0; d -= 4,
            ++f)
                b.digits[f] = m(a.substr(Math.max(d - 4, 0), Math.min(d, 4)));
            return b
        }
        function o(a) {
            for (var b = "", c = s(a); c > -1; --c)
                b += p(a.digits[c]);
            return b
        }
        function p(a) {
            var b = String.fromCharCode(255 & a);
            a >>>= 8;
            var c = String.fromCharCode(255 & a);
            return c + b
        }
        function q(a, b) {
            var c;
            if (a.isNeg != b.isNeg)
                b.isNeg = !b.isNeg,
                c = r(a, b),
                b.isNeg = !b.isNeg;
            else {
                c = new e;
                for (var d, f = 0, g = 0; g < a.digits.length; ++g)
                    d = a.digits[g] + b.digits[g] + f,
                    c.digits[g] = 65535 & d,
                    f = Number(d >= R);
                c.isNeg = a.isNeg
            }
            return c
        }
        function r(a, b) {
            var c;
            if (a.isNeg != b.isNeg)
                b.isNeg = !b.isNeg,
                c = q(a, b),
                b.isNeg = !b.isNeg;
            else {
                c = new e;
                var d, f;
                f = 0;
                for (var g = 0; g < a.digits.length; ++g)
                    d = a.digits[g] - b.digits[g] + f,
                    c.digits[g] = 65535 & d,
                    c.digits[g] < 0 && (c.digits[g] += R),
                    f = 0 - Number(0 > d);
                if (-1 == f) {
                    f = 0;
                    for (var g = 0; g < a.digits.length; ++g)
                        d = 0 - c.digits[g] + f,
                        c.digits[g] = 65535 & d,
                        c.digits[g] < 0 && (c.digits[g] += R),
                        f = 0 - Number(0 > d);
                    c.isNeg = !a.isNeg
                } else
                    c.isNeg = a.isNeg
            }
            return c
        }
        function s(a) {
            for (var b = a.digits.length - 1; b > 0 && 0 == a.digits[b]; )
                --b;
            return b
        }
        function t(a) {
            var b, c = s(a), d = a.digits[c], e = (c + 1) * Q;
            for (b = e; b > e - Q && 0 == (32768 & d); --b)
                d <<= 1;
            return b
        }
        function u(a, b) {
            for (var c, d, f, g = new e, h = s(a), i = s(b), j = 0; i >= j; ++j) {
                c = 0,
                f = j;
                for (var k = 0; h >= k; ++k,
                ++f)
                    d = g.digits[f] + a.digits[k] * b.digits[j] + c,
                    g.digits[f] = d & U,
                    c = d >>> P;
                g.digits[j + h + 1] = c
            }
            return g.isNeg = a.isNeg != b.isNeg,
            g
        }
        function v(a, b) {
            var c, d, f, g = new e;
            c = s(a),
            d = 0;
            for (var h = 0; c >= h; ++h)
                f = g.digits[h] + a.digits[h] * b + d,
                g.digits[h] = f & U,
                d = f >>> P;
            return g.digits[1 + c] = d,
            g
        }
        function w(a, b, c, d, e) {
            for (var f = Math.min(b + e, a.length), g = b, h = d; f > g; ++g,
            ++h)
                c[h] = a[g]
        }
        function x(a, b) {
            var c = Math.floor(b / Q)
              , d = new e;
            w(a.digits, 0, d.digits, c, d.digits.length - c);
            for (var f = b % Q, g = Q - f, h = d.digits.length - 1, i = h - 1; h > 0; --h,
            --i)
                d.digits[h] = d.digits[h] << f & U | (d.digits[i] & X[f]) >>> g;
            return d.digits[0] = d.digits[h] << f & U,
            d.isNeg = a.isNeg,
            d
        }
        function y(a, b) {
            var c = Math.floor(b / Q)
              , d = new e;
            w(a.digits, c, d.digits, 0, a.digits.length - c);
            for (var f = b % Q, g = Q - f, h = 0, i = h + 1; h < d.digits.length - 1; ++h,
            ++i)
                d.digits[h] = d.digits[h] >>> f | (d.digits[i] & Y[f]) << g;
            return d.digits[d.digits.length - 1] >>>= f,
            d.isNeg = a.isNeg,
            d
        }
        function z(a, b) {
            var c = new e;
            return w(a.digits, 0, c.digits, b, c.digits.length - b),
            c
        }
        function A(a, b) {
            var c = new e;
            return w(a.digits, b, c.digits, 0, c.digits.length - b),
            c
        }
        function B(a, b) {
            var c = new e;
            return w(a.digits, 0, c.digits, 0, b),
            c
        }
        function C(a, b) {
            if (a.isNeg != b.isNeg)
                return 1 - 2 * Number(a.isNeg);
            for (var c = a.digits.length - 1; c >= 0; --c)
                if (a.digits[c] != b.digits[c])
                    return a.isNeg ? 1 - 2 * Number(a.digits[c] > b.digits[c]) : 1 - 2 * Number(a.digits[c] < b.digits[c]);
            return 0
        }
        function D(a, b) {
            var c, d, g = t(a), h = t(b), i = b.isNeg;
            if (h > g)
                return a.isNeg ? (c = f(O),
                c.isNeg = !b.isNeg,
                a.isNeg = !1,
                b.isNeg = !1,
                d = r(b, a),
                a.isNeg = !0,
                b.isNeg = i) : (c = new e,
                d = f(a)),
                new Array(c,d);
            c = new e,
            d = a;
            for (var j = Math.ceil(h / Q) - 1, k = 0; b.digits[j] < S; )
                b = x(b, 1),
                ++k,
                ++h,
                j = Math.ceil(h / Q) - 1;
            d = x(d, k),
            g += k;
            for (var l = Math.ceil(g / Q) - 1, m = z(b, l - j); -1 != C(d, m); )
                ++c.digits[l - j],
                d = r(d, m);
            for (var n = l; n > j; --n) {
                var o = n >= d.digits.length ? 0 : d.digits[n]
                  , p = n - 1 >= d.digits.length ? 0 : d.digits[n - 1]
                  , u = n - 2 >= d.digits.length ? 0 : d.digits[n - 2]
                  , w = j >= b.digits.length ? 0 : b.digits[j]
                  , A = j - 1 >= b.digits.length ? 0 : b.digits[j - 1];
                c.digits[n - j - 1] = o == w ? U : Math.floor((o * R + p) / w);
                for (var B = c.digits[n - j - 1] * (w * R + A), D = o * T + (p * R + u); B > D; )
                    --c.digits[n - j - 1],
                    B = c.digits[n - j - 1] * (w * R | A),
                    D = o * R * R + (p * R + u);
                m = z(b, n - j - 1),
                d = r(d, v(m, c.digits[n - j - 1])),
                d.isNeg && (d = q(d, m),
                --c.digits[n - j - 1])
            }
            return d = y(d, k),
            c.isNeg = a.isNeg != i,
            a.isNeg && (c = i ? q(c, O) : r(c, O),
            b = y(b, k),
            d = r(b, d)),
            0 == d.digits[0] && 0 == s(d) && (d.isNeg = !1),
            new Array(c,d)
        }
        function E(a, b) {
            return D(a, b)[0]
        }
        function F(a) {
            this.modulus = f(a),
            this.k = s(this.modulus) + 1;
            var b = new e;
            b.digits[2 * this.k] = 1,
            this.mu = E(b, this.modulus),
            this.bkplus1 = new e,
            this.bkplus1.digits[this.k + 1] = 1,
            this.modulo = G,
            this.multiplyMod = H,
            this.powMod = I
        }
        function G(a) {
            var b = A(a, this.k - 1)
              , c = u(b, this.mu)
              , d = A(c, this.k + 1)
              , e = B(a, this.k + 1)
              , f = u(d, this.modulus)
              , g = B(f, this.k + 1)
              , h = r(e, g);
            h.isNeg && (h = q(h, this.bkplus1));
            for (var i = C(h, this.modulus) >= 0; i; )
                h = r(h, this.modulus),
                i = C(h, this.modulus) >= 0;
            return h
        }
        function H(a, b) {
            var c = u(a, b);
            return this.modulo(c)
        }
        function I(a, b) {
            var c = new e;
            c.digits[0] = 1;
            for (var d = a, f = b; ; ) {
                if (0 != (1 & f.digits[0]) && (c = this.multiplyMod(c, d)),
                f = y(f, 1),
                0 == f.digits[0] && 0 == s(f))
                    break;
                d = this.multiplyMod(d, d)
            }
            return c
        }
        function J(a, b, c, d) {
            this.e = n(a),
            this.d = n(b),
            this.m = n(c),
            this.chunkSize = "number" != typeof d ? 2 * s(this.m) : d / 8,
            this.radix = 16,
            this.barrett = new F(this.m)
        }
        function K(a, b, c, d) {
            var f, g, h, j, l, m, n, p, q, r, s = new Array, t = b.length, u = "";
            for (j = "string" == typeof c ? c == Z.NoPadding ? 1 : c == Z.PKCS1Padding ? 2 : 0 : 0,
            l = "string" == typeof d && d == Z.RawEncoding ? 1 : 0,
            1 == j ? t > a.chunkSize && (t = a.chunkSize) : 2 == j && t > a.chunkSize - 11 && (t = a.chunkSize - 11),
            f = 0,
            g = 2 == j ? t - 1 : a.chunkSize - 1; t > f; )
                j ? s[g] = b.charCodeAt(f) : s[f] = b.charCodeAt(f),
                f++,
                g--;
            for (1 == j && (f = 0),
            g = a.chunkSize - t % a.chunkSize; g > 0; ) {
                if (2 == j) {
                    for (m = Math.floor(256 * Math.random()); !m; )
                        m = Math.floor(256 * Math.random());
                    s[f] = m
                } else
                    s[f] = 0;
                f++,
                g--
            }
            for (2 == j && (s[t] = 0,
            s[a.chunkSize - 2] = 2,
            s[a.chunkSize - 1] = 0),
            n = s.length,
            f = 0; n > f; f += a.chunkSize) {
                for (p = new e,
                g = 0,
                h = f; h < f + a.chunkSize; ++g)
                    p.digits[g] = s[h++],
                    p.digits[g] += s[h++] << 8;
                q = a.barrett.powMod(p, a.e),
                r = 1 == l ? o(q) : 16 == a.radix ? k(q) : i(q, a.radix),
                u += r
            }
            return u
        }
        var L, M, N, O, P = 16, Q = P, R = 65536, S = R >>> 1, T = R * R, U = R - 1;
        d(20);
        var V = (g(1e15),
        new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"))
          , W = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f")
          , X = new Array(0,32768,49152,57344,61440,63488,64512,65024,65280,65408,65472,65504,65520,65528,65532,65534,65535)
          , Y = new Array(0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535)
          , Z = {};
        Z.NoPadding = "NoPadding",
        Z.PKCS1Padding = "PKCS1Padding",
        Z.RawEncoding = "RawEncoding",
        Z.NumericEncoding = "NumericEncoding",
        c.setMaxDigits = d,
        c.RSAKeyPair = J,
        c.encryptedString = K
    }
    , {}],
    10: [function(a, b) {
        "use strict";
        function c(a) {
            for (var b = [], c = 0; c < a.length; c++)
                b.push("0x" + a[c] + a[++c]);
            return String.fromCharCode.apply(null, b)
        }
        function d(a) {
            for (var b = "", c = 0; c < a.length; c++)
                b += a[c].charCodeAt().toString(16);
            return b
        }
        function e() {
            var a = void 0 === arguments[0] ? m.noop : arguments[0];
            t = m.createGuid(32);
            var b = l.encryptedString(r, t, "NoPadding");
            k("https://cas.*****.com/?action=reqsk", {
                action: "reqsk",
                version: "1.0.1.13",
                cr: b
            }, function(b) {
                var e = n.enc.Hex.parse(d(t))
                  , f = n.enc.Hex.parse(b.sr);
                f = n.enc.Base64.stringify(f),
                s = n.AES.decrypt(f, e, {
                    iv: y,
                    padding: n.pad.ZeroPadding
                }),
                s = c(s + ""),
                w.value = b.sid,
                a()
            })
        }
        function f() {
            var a = ['<input name="sid" type="hidden" id="ucsl-input-sid" />', '<input name="pwd" type="hidden" id="ucsl-input-pwd" />'];
            a.push(["<input", 'id="ucsl-password-edit"', 'type="password"', 'autocomplete="off"', 'placeholder="密码"', 'tabindex="2"', 'style="box-sizing:border-box;width:100%;height:100%;padding-left:0;', '"/>'].join(" ")),
            o.addHTML(x, a.join("")),
            u = document.getElementById("ucsl-password-edit"),
            v = document.getElementById("ucsl-input-pwd"),
            w = document.getElementById("ucsl-input-sid")
        }
        function g() {
            for (var a = "", b = 0; b < t.length; b++) {
                var c = (t[b].charCodeAt() ^ s[b].charCodeAt()).toString(16) + "";
                a += c.length > 1 ? c : "0" + c
            }
            return a
        }
        function h(a) {
            x = document.getElementById(a.fid),
            f(),
            e()
        }
        function i() {
            var a = u.value;
            if (!a.replace(/\s/g, "").length)
                return !1;
            var b = n.enc.Hex.parse(g())
              , c = n.AES.encrypt(a, b, {
                iv: y,
                padding: n.pad.ZeroPadding,
                format: n.enc.Hex
            }).ciphertext + "";
            return c = l.encryptedString(r, c, "NoPadding"),
            v.value = c,
            !0
        }
        function j() {
            v.value = "",
            w.value = "",
            e()
        }
        var k = a("./jsonp")
          , l = a("./rsaJSEncrypt")
          , m = a("./util")
          , n = a("./cryptoJS")
          , o = a("./dom")
          , p = "b93db4579a4bb3e1d635997a57f57b8f054ab37397ed7a4485eeaa85fbe08cf71921ef91c28b5a38ac82e74a6978968d6b500e72b7b4abda928cc5d69a40c04727dcbdf0a2d868d288e9a054deee61773973bb0e044c0fc5bad6a280b1f75660fd029c2219948a35135e212e9c80d90178d365760ab14ce1441f13e2d959ac79"
          , q = "010001";
        l.setMaxDigits(1024);
        for (var r = new l.RSAKeyPair(q,"",p,1024), s = null, t = null, u = null, v = null, w = null, x = null, y = "", z = 0; 128 > z; z++)
            y += "0";
        y = n.enc.Hex.parse(y),
        b.exports = {
            init: h,
            verify: i,
            reload: j,
            isInstall: !0
        }
    }
    , {
        "./cryptoJS": 2,
        "./dom": 4,
        "./jsonp": 6,
        "./rsaJSEncrypt": 9,
        "./util": 11
    }],
    11: [function(a, b, c) {
        "use strict";
        c.createGuid = function() {
            var a = void 0 === arguments[0] ? 22 : arguments[0]
              , b = +new Date + ""
              , c = []
              , d = "0123456789ABCDEF";
            for (a = a - b.length - 1; a--; )
                c.push(d.charAt(16 * Math.random()));
            var e = c.join("");
            return b + "_" + e
        }
        ,
        c.noop = function() {}
    }
    , {}],
    12: [function(a) {
        function b() {
            "use strict";
            p.init({
                fid: "uc-safe-pwd-input",
                style: {
                    width: "100%",
                    height: "100%",
                    tabindex: 2
                },
                tabout: "token",
                type: 316 === o.appid ? "standard" : null
            }),
            q.isIE && q.ieVersion < 10 && j.init()
        }
        function c(a) {
            "use strict";
            a = decodeURI(a || ""),
            a = q.encodeData(a),
            "验证码错误" === a ? $("#token-error").html("<span></span>验证码错误").addClass("visible-show").attr("title", a) : $.trim(a) && $("#account-error").html("<span></span>" + a).addClass("visible-show").attr("title", a)
        }
        function d(a) {
            "use strict";
            a = a || window.event;
            var b = a.target || a.srcElement;
            if ("IMG" !== b.tagName)
                return $("#token-img").trigger("click"),
                !1;
            var c = l.baseTokenUrl + o.appid + "&key=" + +new Date;
            $("#token-img").prop("src", c)
        }
        function e(a) {
            "use strict";
            var b = q.encodeData(a.un);
            $("#uc-common-account").val($.trim(b))
        }
        function f(a) {
            "use strict";
            clearTimeout(h),
            r = !1,
            $("#submit-form").val("登录"),
            p.reload(),
            $("#uc-login-iframe").remove(),
            a.errno && a.e ? (c(a.e),
            $("#submit-form").val("登录"),
            $("#token-img").trigger("click"),
            $("#uc-common-token").val(""),
            o.failCallback()) : a.redirecturl && o.successCallback(a.redirecturl),
            window.ucCallback = null;
            try {
                delete window.ucCallback
            } catch (b) {}
        }
        function g() {
            "use strict";
            return r ? r : (m.checkAll().done(function() {
                if (o.beforeSubmit()) {
                    r = !0,
                    $("#submit-form").val("登录中..."),
                    window.ucCallback = f,
                    h = setTimeout(function() {
                        $("#uc-login-iframe").remove(),
                        $("#submit-form").val("登录"),
                        c("登录超时，请稍后再试"),
                        r = !1
                    }, 15e3),
                    $("#uc-login-iframe").remove();
                    var a = $('<iframe name="uc-login-iframe" id="uc-login-iframe"></iframe>').hide();
                    $("body").append(a),
                    $("#uc-login").trigger("submit")
                }
            }),
            !1)
        }
        var h, i = a("../ucCommon/templator"), j = a("../ucCommon/placeholder"), k = a("../ucCommon/cache"), l = a("../ucCommon/config"), m = a("../ucCommon/loginChecker"), n = a("../ucCommon/tpl"), o = a("../ucCommon/initInfo"), p = a("../../dep/ucsl/dist/main"), q = a("../ucCommon/util"), r = !1, s = document.getElementById(o.container) || document.body;
        n = i(n, o);
        var t = document.createElement("div");
        t.className = "uc-common-login",
        t.innerHTML = '<div id="uc-common-login-mask"></div>' + n,
        t.style.cssText = "display:none;",
        o.isLayer ? document.body.appendChild(t) : (s.className = s.className + " uc-common-login",
        s.innerHTML = n),
        $("#change-login").on("click", "a", function() {
            "use strict";
            var a = $(this).hasClass("passport-account") ? !0 : !1;
            $(this).addClass("select").siblings().removeClass("select"),
            a ? ($("#passport-login").show(),
            $("#uc-login").hide()) : ($("#passport-login").hide(),
            $("#uc-login").show())
        }),
        $("#close-common-login-layer").on("click", function() {
            "use strict";
            window.ucCommonLogin.hide()
        }),
        window.ucCommonLogin.PubSub.on("show", function() {
            "use strict";
            $("#token-img").trigger("click"),
            t.style.cssText = "",
            k.get("isInitSafeInput") || "uc" !== o.defaultLogin || setTimeout(function() {
                k.set("isInitSafeInput", !0),
                b()
            }, 10)
        }),
        window.ucCommonLogin.PubSub.on("hide", function() {
            "use strict";
            t.style.cssText = "display:none;"
        }),
        o.multiLogin ? a("../ucCommon/passport").init() : o.rendered();
        var u = location.search.substr(1);
        k.set("isInitSafeInput", !1),
        function() {
            "use strict";
            if (!k.get("isInitSafeInput"))
                return "passport" === o.defaultLogin ? void $("#choose-uc-login").one("click", function() {
                    setTimeout(function() {
                        b(),
                        k.set("isInitSafeInput", !0)
                    }, 10)
                }) : o.isLayer || "uc" !== o.defaultLogin ? void 0 : void setTimeout(function() {
                    b(),
                    k.set("isInitSafeInput", !0)
                }, 10)
        }();
        var v = q.queryToJson(u);
        c(v.err),
        e(v),
        $(".js-change-token").on("click", d),
        $("#uc-login").on("submit", g),
        $("#uc-common-account").on("focus", function() {
            "use strict";
            $("#account-error").removeClass("visible-show").removeAttr("title")
        }),
        $("#uc-common-password").on("focus", function() {
            "use strict";
            $("#password-error").removeClass("visible-show").removeAttr("title")
        }),
        $("#uc-common-token").on("focus", function() {
            "use strict";
            $("#token-error").removeClass("visible-show").removeAttr("title")
        })
    }
    , {
        "../../dep/ucsl/dist/main": 7,
        "../ucCommon/cache": 14,
        "../ucCommon/config": 15,
        "../ucCommon/initInfo": 16,
        "../ucCommon/loginChecker": 17,
        "../ucCommon/passport": 18,
        "../ucCommon/placeholder": 19,
        "../ucCommon/templator": 20,
        "../ucCommon/tpl": 21,
        "../ucCommon/util": 22
    }],
    13: [function(a, b) {
        function c() {
            "use strict";
            this.checkers = {}
        }
        var d = {
            value: function() {
                "use strict"
            },
            check: function() {
                "use strict"
            },
            done: function() {
                "use strict"
            },
            fail: function() {
                "use strict"
            }
        };
        c.prototype.setChecker = function(a, b) {
            "use strict";
            b = $.extend(!0, {}, d, b),
            this.checkers[a] = b
        }
        ,
        c.prototype.check = function(a) {
            "use strict";
            var b = this.checkers[a]
              , c = b.value();
            return $.when(b.check(c)).done(function(a) {
                b.done(a)
            }).fail(function(a) {
                b.fail(a)
            })
        }
        ,
        c.prototype.checkAll = function() {
            "use strict";
            var a = [];
            for (var b in this.checkers)
                a.push(this.check(b));
            return $.when.apply($, a)
        }
        ,
        c.prototype.getValue = function(a) {
            "use strict";
            return this.checkers[a].value()
        }
        ,
        c.prototype.getAllValues = function() {
            "use strict";
            var a = {};
            for (var b in this.checkers)
                a[b] = this.getValue(b);
            return a
        }
        ,
        b.exports = c
    }
    , {}],
    14: [function(a, b) {
        function c(a, b) {
            "use strict";
            e[a] = b
        }
        function d(a) {
            "use strict";
            return e[a]
        }
        var e = {};
        b.exports = {
            set: c,
            get: d
        }
    }
    , {}],
    15: [function(a, b) {
        var c = "online"
          , d = {
            online: {
                http: "//cas.*****.com/",
                https: "//cas.*****.com/",
                passport: "//passport.*****.com/"
            },
            rd: {
                http: "//mycas.*****.com:8477/",
                https: "//mycas.*****.com:8443/",
                passport: "//passport.rdtest.*****.com/"
            },
            qa: {
                http: "//cas-off.*****.com:8477/",
                https: "//cas-off.*****.com:8443/",
                passport: "//passport.qatest.*****.com/"
            }
        }
          , e = location.protocol.slice(0, -1)
          , f = {
            baseTokenUrl: d[c][e] + "?action=image2&appid=",
            sourceSrc: "//cas.*****.com/?action=needPlugin&method=callback&appid=",
            form: "https:" + d[c].https + "?action=login",
            forgetPassword: {
                fengchao: "https://cas.*****.com/?controller=user&action=retrivepwd",
                aq: "http://aq.*****.com/new/#/findpwd",
                union: "http://union.*****.com/findPassword!input.action"
            },
            fengchaoList: [1],
            unionList: [283],
            passportUrl: location.protocol + d[c].passport + "passApi/js/wrapper.js?cdnversion=" + +new Date
        };
        b.exports = f
    }
    , {}],
    16: [function(a, b) {
        function c(a) {
            "use strict";
            var b = a.split("?");
            return b.length <= 2 ? a : (a = a.replace("?" + b[2], ""),
            -1 !== a.indexOf("castk=") ? a.replace(/castk[^&#]+/g, b[2]) : -1 === a.indexOf("#") ? a = "&" === a[a.length - 1] ? a + b[2] : a + "&" + b[2] : -1 !== a.indexOf("#") ? a.split("?").join("?" + b[2] + "&") : a)
        }
        function d(a) {
            "use strict";
            var b = new RegExp(h.staticPage)
              , d = new RegExp(encodeURIComponent(h.staticPage) + "(%3Fcastk%3D\\w+)?")
              , e = new RegExp(encodeURIComponent(encodeURIComponent(h.staticPage)) + "(%253Fcastk%253D\\w+)?");
            return a = a.replace(b, h.successPath),
            a = a.replace(d, encodeURIComponent(h.successPath)),
            a = a.replace(e, encodeURIComponent(encodeURIComponent(h.successPath))),
            c(a)
        }
        var e = a("./util")
          , f = a("./config")
          , g = {
            type: "uc"
        }
          , h = $.extend(!0, {}, window.ucCommonLogin.initData);
        try {
            delete window.ucCommonLogin.initData
        } catch (i) {}
        var j = location.search && location.search.split("?")[1];
        j = e.queryToJson(j);
        for (var k = "appid,staticPage".split(","), l = 0; l < k.length; l++)
            if (!h[k[l]])
                throw new Error(k[l] + " is required ,but not define!");
        h.passportTitle = h.passportTitle || "百度帐号",
        h.ucTitle = h.ucTitle || "推广帐号",
        h.successPath = h.fromu || j.fromu || location.href,
        h.fromu = h.selfu = h.staticPage,
        h.appscope = h.appscope || [],
        h.isLayer = h.isLayer || 0,
        h.isSmall = h.isLayer ? 0 : h.isSmall,
        h.isSmall = h.isSmall || 0,
        h.multiLogin = h.multiLogin || 0,
        h.defaultLogin = h.defaultLogin || "passport",
        h.defaultLogin = h.multiLogin ? h.defaultLogin : "uc",
        h.isQuickUser = h.isQuickUser || 0,
        h.memberPass = !!h.memberPass,
        h.safeFlag = h.safeFlag || 0,
        h.registerPassLink = h.registerPassLink || "",
        h.registerUcLink = h.registerUcLink || "",
        h.hasRegUrl = !!h.registerPassLink || !1,
        h.charset = h.charset || "utf-8",
        h.AUTO = 0,
        h.isAutoLogin = h.isAutoLogin || 0,
        h.form = f.form,
        h.baseTokenUrl = f.baseTokenUrl,
        h.rendered = h.rendered || function() {
            "use strict"
        }
        ,
        h.beforeSubmit = h.beforeSubmit || function() {
            "use strict";
            return !0
        }
        ,
        h.forgetPassword = function() {
            "use strict";
            return -1 !== $.inArray(h.appid, f.fengchaoList) ? f.forgetPassword.fengchao : -1 !== $.inArray(h.appid, f.unionList) ? f.forgetPassword.union : f.forgetPassword.aq
        }(),
        h.successCallback = function(a) {
            "use strict";
            a = decodeURIComponent(a);
            var b = decodeURIComponent(a);
            return b = decodeURIComponent(b),
            -1 === b.indexOf(h.fromu) ? void (location.href = a) : "function" == typeof h.success ? void h.success(g) : void location.replace(d(a))
        }
        ,
        h.failCallback = function() {
            "use strict";
            "function" == typeof h.fail && h.fail(g)
        }
        ,
        b.exports = h
    }
    , {
        "./config": 15,
        "./util": 22
    }],
    17: [function(a, b) {
        var c = a("./FormChecker")
          , d = a("../../dep/ucsl/dist/main")
          , e = a("./validator/main")
          , f = new c;
        f.setChecker("account", {
            value: function() {
                "use strict";
                return $("#uc-common-account").val()
            },
            check: function(a) {
                "use strict";
                var b = new $.Deferred
                  , c = $("#uc-common-account").attr("placeholder");
                return e(a).isEmpty() || a === c ? b.reject("用户名不能为空") : b.resolve(),
                b.promise()
            },
            done: function() {
                "use strict";
                $("#account-error").removeClass("visible-show").removeAttr("title")
            },
            fail: function(a) {
                "use strict";
                $("#account-error").html("<span></span>" + a).addClass("visible-show").attr("title", a)
            }
        }),
        f.setChecker("password", {
            value: function() {
                "use strict";
                return $("#uc-common-password").val()
            },
            check: function() {
                "use strict";
                var a = new $.Deferred;
                return d.isInstall ? d.verify() ? a.resolve() : a.reject("密码不能为空") : a.reject("请点击链接安装安全控件"),
                a.promise()
            },
            done: function() {
                "use strict";
                $("#password-error").removeClass("visible-show").removeAttr("title")
            },
            fail: function(a) {
                "use strict";
                $("#password-error").html("<span></span>" + a).addClass("visible-show").attr("title", a)
            }
        }),
        f.setChecker("token", {
            value: function() {
                "use strict";
                return $("#uc-common-token").val()
            },
            check: function(a) {
                "use strict";
                var b = new $.Deferred
                  , c = $("#uc-common-token").attr("placeholder");
                return e(a).isEmpty() || a === c ? b.reject("验证码不能为空") : b.resolve(),
                b.promise()
            },
            done: function() {
                "use strict";
                $("#token-error").removeClass("visible-show").removeAttr("title")
            },
            fail: function(a) {
                "use strict";
                $("#token-error").html("<span></span>" + a).addClass("visible-show").attr("title", a)
            }
        }),
        b.exports = f
    }
    , {
        "../../dep/ucsl/dist/main": 7,
        "./FormChecker": 13,
        "./validator/main": 24
    }],
    18: [function(a, b, c) {
        function d() {
            "use strict";
            var b = a("./initInfo")
              , c = a("./config");
            $.getScript(c.passportUrl, function() {
                window.passport.use("login", {
                    tangram: !0
                }, function(a) {
                    var c = new a.passport.login({
                        product: b.product,
                        staticPage: b.staticPage,
                        loginMerge: !0,
                        hasPlaceholder: !0,
                        u: b.successPath,
                        charset: b.charset,
                        isQuickUser: b.isQuickUser,
                        memberPass: b.memberPass,
                        safeFlag: b.safeFlag,
                        registerLink: b.registerPassLink,
                        hasRegUrl: b.hasRegUrl
                    })
                      , d = {
                        type: "passport"
                    };
                    b.success && c.on("loginSuccess", function(a) {
                        b.success(d),
                        a.returnValue = !1
                    }),
                    b.fail && c.on("loginError", function() {
                        b.fail(d)
                    }),
                    c.render($("#passport-login")[0]),
                    $(".pass-fgtpwd").html("忘记密码"),
                    b.rendered()
                })
            })
        }
        c.init = d
    }
    , {
        "./config": 15,
        "./initInfo": 16
    }],
    19: [function(a, b) {
        function c(a) {
            "use strict";
            return $(a).val()
        }
        function d(a, b) {
            "use strict";
            $(a).val(b)
        }
        function e(a) {
            "use strict";
            return $(a).attr("placeholder")
        }
        function f(a) {
            "use strict";
            var b = c(a);
            return 0 === b.length || b === e(a)
        }
        function g(a) {
            "use strict";
            d(a, e(a)),
            $(a).addClass("placeholder")
        }
        function h(a) {
            "use strict";
            d(a, ""),
            $(a).removeClass("placeholder")
        }
        function i() {
            "use strict";
            f(this) && h(this)
        }
        function j() {
            "use strict";
            f(this) && g(this)
        }
        function k(a) {
            "use strict";
            var b = a.outerHTML;
            return b = b.replace(/type=["']?password["']?/, 'type="text" data-action="placeholder"').replace(/id=["']?\w+["']?/, "").replace(/name=["']?\w+["']?/, "").replace(/placeholder=['"]?[^'">]+['"]?/, "")
        }
        function l() {
            "use strict";
            var a = $(k(this));
            return a.val(e(this)),
            a
        }
        var m = {
            init: function() {
                "use strict";
                $("[placeholder]").each(function(a, b) {
                    if ("password" !== $(this).attr("type"))
                        $(b).on("focus", i),
                        $(b).on("blur", j);
                    else {
                        var c = l.call(this);
                        $(b).after(c.hide().addClass("placeholder")),
                        c.on("focus", function() {
                            $(this).hide(),
                            $(b).show().trigger("focus")
                        }),
                        $(b).on("blur", function() {
                            f(this) && ($(this).hide(),
                            c.show())
                        })
                    }
                    $(b).trigger("blur")
                })
            }
        };
        b.exports = m
    }
    , {}],
    20: [function(a, b) {
        function c(a, b) {
            "use strict";
            b = d.encodeData(b);
            var c = new Function("obj","var p=[];with(obj){   p.push('" + a.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "   ');};return p.join('');");
            return c(b)
        }
        var d = a("./util");
        b.exports = c
    }
    , {
        "./util": 22
    }],
    21: [function(a, b) {
        b.exports = ['<div id="common-login" class="login <% if (isSmall){ %>uc-common-login-small<% } %><% if (isLayer){ %> uc-common-login-layer<% } %>">', "<% if (!isLayer){ %>", '<div class="login-shadow"></div>', '<span class="watermark"></span>', "<% } %>", '<% if (isLayer){ %><div id="close-common-login-layer" class="close-common-login-layer"></div><% } %>', "<% if (multiLogin){ %>", '<div id="change-login" class="change-login">', "<div>", '<a href="javascript:void(0);" class="passport-account<%if(defaultLogin===\'passport\'){%> select<% } %>"><%=passportTitle%><span></span></a>', '<a id="choose-uc-login" href="javascript:void(0);"<%if(defaultLogin===\'uc\'){%> class="select"<% } %>><%=ucTitle%><span></span></a>', "</div>", "</div>", '<div id="passport-login"<% if (multiLogin&&defaultLogin===\'uc\'){ %> style="display:none;"<% } %>></div>', "<% } %>", '<form id="uc-login" target="uc-login-iframe" action="<%=form%>" method="post"<% if (multiLogin&&defaultLogin===\'passport\'){ %> style="display:none;"<% } %>>', '<div class="login-info">', "<% if (!multiLogin){ %><h2>登录</h2><% } %>", '<div class="account">', "<span></span>", '<input type="text" id="uc-common-account" name="entered_login" autocomplete="off" placeholder="用户名" tabindex="1" maxlength="100" />', "</div>", '<p id="account-error" class="error"></p>', '<div class="password">', "<span></span>", '<input type="hidden" id="uc-common-password" name="entered_password" style="display:none;" />', '<div id="uc-safe-pwd-input" class="safe-input"></div>', "</div>", '<p id="password-error" class="error"></p>', '<div class="token">', '<input id="uc-common-token" type="text" placeholder="验证码" autocomplete="off" tabindex="3" maxlength="4" name="entered_imagecode" />', '<img id="token-img" class="js-change-token" title="验证码" width="99" height="39" alt="验证码" src="<%=baseTokenUrl%><%=appid%>" />', '<a href="javascript:void(0);" class="js-change-token">换一张</a>', "</div>", '<p id="token-error" class="error"></p>', "</div>", '<div class="login-action">', "<% if (isAutoLogin) { %>", '<p id="is-auto-login-container" class="is-auto-login">', '<input id="is-auto-login" name="isAutoLogin" type="checkbox" checked value="1" />', '<label for="is-auto-login">30天内免登录</label>', "</p>", "<% } %>", '<input id="submit-form" class="submit" type="submit" value="登录" />', '<div class="other">', '<div class="fl">', '<span></span><a href="http://aq.*****.com/new/#/school" target="_blank">安全控件常见问题</a>', "</div>", '<div class="fr">', "<% if (!!registerUcLink){ %>", '<a class="uc-register" href="<%=registerUcLink%>" target="_blank">注册</a>', "<% } %>", '<a href="<%=forgetPassword%>" target="_blank">忘记密码</a>', "</div>", "</div>", "</div>", '<input type="hidden" name="charset" value="utf-8" />', '<input type="hidden" name="appid" id="appid" value="<%=appid%>" />', '<input type="hidden" id="selfu" name="selfu" value="<%=selfu%>" />', '<input type="hidden" id="fromu" name="fromu" value="<%=fromu%>" />', '<input type="hidden" id="isajax" name="isajax" value="1" />', '<input type="hidden" value="1" name="senderr" />', "<% for (var i=appscope.length;i--;){%>", '<input type="hidden" name="appscope[]" value="<%=appscope[i]%>">', "<% } %>", "</form>", "</div>"].join("")
    }
    , {}],
    22: [function(a, b) {
        function c(a) {
            "use strict";
            a = a || "";
            var b = /[\w\d_]+\=[^&]*(\&[\w\d_]+\=[^&]*)*/
              , c = a.match(b);
            a = c ? c[0] : "";
            var d = a.split("&")
              , e = d.length;
            c = {};
            for (var f, g, h, i, j = 0; e > j; j++)
                d[j] && (i = d[j].split("="),
                f = i[0],
                g = decodeURIComponent(i[1]),
                h = c[f],
                "undefined" == typeof h ? c[f] = g : "array" === $.type(h) ? h.push(g) : c[f] = [h, g]);
            return c
        }
        function d(a) {
            "use strict";
            return "string" !== $.type(a) ? a : (a = a.replace(/</g, "&lt;"),
            a = a.replace(/>/g, "&gt;"),
            a = a.replace(/\"/g, "&quot;"),
            a = a.replace(/ /g, "&nbsp;"))
        }
        function e(a) {
            "use strict";
            var b, c, f;
            if ("array" === $.type(a)) {
                for (f = [],
                b = 0,
                c = a.length; c > b; b++)
                    f[b] = e(a[b]);
                return f
            }
            if ("object" === $.type(a)) {
                f = {};
                for (b in a)
                    f[b] = e(a[b]);
                return f
            }
            return d(a)
        }
        function f() {
            "use strict";
            var a = navigator.userAgent.toLowerCase()
              , b = /(msie) ([\w.]+)/
              , c = b.exec(a) || {};
            return {
                browser: c[1] || "",
                version: c[2] || "0"
            }
        }
        var g = f();
        b.exports = {
            queryToJson: c,
            covertTag: d,
            encodeData: e,
            isIE: "msie" === g.browser,
            ieVersion: +g.version
        }
    }
    , {}],
    23: [function(a, b) {
        b.exports = {
            isEmpty: function() {
                "use strict";
                var a = this.value;
                return a = void 0 === a ? "" : a,
                a = null === a ? "" : a,
                "" === $.trim(a)
            }
        }
    }
    , {}],
    24: [function(a, b) {
        function c(a) {
            "use strict";
            return new c.prototype.init(a)
        }
        var d = a("./commonRules");
        c.prototype.init = function(a) {
            "use strict";
            return this.value = a,
            this
        }
        ,
        c.prototype.init.prototype = c.prototype,
        c.setRule = function(a, b) {
            "use strict";
            c.prototype[a] = function() {
                return b.apply(this, arguments)
            }
        }
        ;
        for (var e in d)
            c.setRule(e, d[e]);
        b.exports = c
    }
    , {
        "./commonRules": 23
    }]
}, {}, [12]);
