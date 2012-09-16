/* File Created: September 11, 2012 */
tg = (function (_) {
	function ElementConstructor() {

	};

	ElementConstructor.prototype = {
		svg: function (tag, attrs) {
			var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
			for (var k in attrs)
				el.setAttribute(k, attrs[k]);
			return el;
		}
	};

	function Tulpagraphy() {
		this.make = new ElementConstructor();

		this.config = {}

		this.config.environment = 'dev';
		this.config.environment = 'wp';

		if (this.config.environment == 'dev') {
			
		}
	};

	Tulpagraphy.prototype = {
		log: function () {
			if (window.console) {
				window.console.log(Array.prototype.slice.call(arguments));
			}
		}
	}

	return new Tulpagraphy();
})(_);