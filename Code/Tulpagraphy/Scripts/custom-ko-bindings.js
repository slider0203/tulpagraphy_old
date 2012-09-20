/* File Created: September 19, 2012 */
ko.bindingHandlers.accordion = {
	init: function (element, valueAccessor) {
		var options = valueAccessor() || {};
		setTimeout(function () {
			$(element).accordion(options);
		}, 0);

		//handle disposal (if KO removes by the template binding)
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			$(element).accordion("destroy");
		});
	},
	update: function (element, valueAccessor) {
		var options = valueAccessor() || {};
		$(element).accordion("destroy").accordion(options);
	}
};

ko.bindingHandlers.slider = {
	init: function (element, valueAccessor) {
		var options = valueAccessor() || {};
		var $element = $(element);

		var moddedOptions = {
			slide: function (e, ui) {
				options.value(ui.value ? ui.value : .01);
			}
		};

		for (var i in options) { moddedOptions[i] = options[i]; }

		if (moddedOptions.value) { moddedOptions.value = ko.utils.unwrapObservable(moddedOptions.value); }

		setTimeout(function () {
			$element.slider(moddedOptions);
		}, 0);

		//handle disposal (if KO removes by the template binding)
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			$element.slider('destroy');
		});
	},
	update: function (element, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor().value);
		$(element).slider('value', value);
	}
};