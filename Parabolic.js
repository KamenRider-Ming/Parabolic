'use strict';

var Parabolic = (function() {
	return function(el, ta, options) {
		var defaults = {
			speed: 166.67,
			curvature: 0.001
		};
		var params = {};
		options = options | {};
		for (var key in defaults) {
			params[key] = options[key] || defaults[key];
		}

		var module = {
			run: function() {
				return this;
			},
			move: function() {
				return this;
			},
		};

		var moveStyle = 'margin',
			insertDiv = document.createElement('div');
		if (!('ActiveXObject' in window)) {
			['', 'ms', 'webkit'].forEach(function(prefix) {
				var transform = prefix + (prefix ? 'T' : 't') + 'ransform';
				if (transform in insertDiv.style) {
					moveStyle = transform;
				}
			});
		}

		var a = params.curvature,
			b = 0,
			c = 0;

		var flagMove = true;

		if (el && ta && el.nodeType == 1 && ta.nodeType == 1) {
			var rectInit = {},
				rectTarget = {},
				centerInit = {},
				centerTarget = {},
				relativeInit = {},
				relativeTarget = {};

			module.getPosition = function() {
				if (!flagMove) return this;
				var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
					scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

				if (moveStyle === 'margin') {
					el.style.marginLeft = el.style.marginTop = '0px';
				} else {
					el.style[moveStyle] = "translate(0,0)";
				}

				rectInit = el.getBoundingClientRect();
				rectTarget = ta.getBoundingClientRect();
				//取相对位置可以不用这么复杂
				centerInit = {
					x: rectInit.left + (rectInit.right - rectInit.left) / 2 + scrollLeft,
					y: rectInit.top + (rectInit.bottom - rectInit.top) / 2 + scrollTop
				};

				centerTarget = {
					x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
					y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
				};



				relativeInit = {
					x: 0,
					y: 0
				};

				relativeTarget = {
					x: (centerTarget.x - centerInit.x),
					y: (centerTarget.y - centerInit.y)

				};


				b = (relativeTarget.y - a * relativeTarget.x * relativeTarget.x) / relativeTarget.x;
				return this;
			};

			module.move = function() {
				if (!flagMove) return this;

				var startx = 0,
					rate = relativeTarget.x ? 1 : -1;

				var everyStep = function() {
					var tangent = 2 * a * startx + b;

					startx += rate * Math.sqrt(params.speed / (tangent * tangent + 1));

					if (rate === 1 && startx > relativeTarget.x || rate === -1 && startx < relativeTarget.x) {
						startx = relativeTarget.x;
					}

					var x = startx,
						y = a * x * x + b * x;

					if (moveStyle === 'margin') {
						el.style.marginLeft = x + "px";
						el.style.marginTop = y + "px";
					} else {
						el.style[moveStyle] = "translate(" + x + "px, " + y + "px)";
					}

					if (startx !== relativeTarget.x) {
						window.requestAnimationFrame(everyStep);
					} else {
						flagMove = true;
					}
				};
				window.requestAnimationFrame(everyStep);
				flagMove = false;
				return this;
			};

			module.run = function() {
				this.getPosition().move();
			};
			return module;
		}
	};
})();