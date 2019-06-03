<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
	</body>
	<script type="text/javascript">
		function mainFunction(){
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
		
		
			var P = 16, Q = P, R = 65536, S = R >>> 1, T = R * R, U = R - 1;
			var L = 1024;
			var M = new Array(1024), temp_O = new Array(1024);
			for (var nice = 0; nice <M.length; nice++){
				if (nice === 0){
					temp_O[nice] = 1;
					M[nice] = 0;
				}else{
					M[nice] = 0;
					temp_O[nice] = 0;
				}
			}
			var N = new e(1024), O = new e(1024);
			O.digits = temp_O;
			var V = (g(1e15),
			new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"))
			, W = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f")
			, X = new Array(0,32768,49152,57344,61440,63488,64512,65024,65280,65408,65472,65504,65520,65528,65532,65534,65535)
			, Y = new Array(0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535)
			, Z = {};
			Z.NoPadding = "NoPadding",
			Z.PKCS1Padding = "PKCS1Padding",
			Z.RawEncoding = "RawEncoding",
			Z.NumericEncoding = "NumericEncoding"
			var cr_in  = {};
			J.call(cr_in, "010001", "", "b93db4579a4bb3e1d635997a57f57b8f054ab37397ed7a4485eeaa85fbe08cf71921ef91c28b5a38ac82e74a6978968d6b500e72b7b4abda928cc5d69a40c04727dcbdf0a2d868d288e9a054deee61773973bb0e044c0fc5bad6a280b1f75660fd029c2219948a35135e212e9c80d90178d365760ab14ce1441f13e2d959ac79", 1024);
			var call_back = creatGuid(32);
			var cr = [];
			crValue = K.call(cr, cr_in, call_back, Z.NoPadding);
			ucCommonLogin = "ucCommonLogin_callback_" + creatGuid();
			return [{
			action:"reqsk",
			version:"1.0.1.13",
			cr: crValue, 
			callback: ucCommonLogin}, {t:call_back}];
		}
		function creatGuid() {
			var a = void 0 === arguments[0] ? 22 : arguments[0], b = +new Date + "", c = [], d = "0123456789ABCDEF";
			for (a = a - b.length - 1; a--; )
				c.push(d.charAt(16 * Math.random()));
			var e = c.join("");
		return b + "_" + e
		}
		
		var temp = {};
		temp = mainFunction.call(temp, );
		var jsonData = JSON.stringify(temp[0]);
		var jsonData1 = JSON.stringify(temp[1]);
		document.write("<p id=\"encryptData\">" + jsonData + "</p>")
		document.write("<p id=\"call_back\">" + jsonData1 + "</p>");
	</script>
</html>
