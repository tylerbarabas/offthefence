'use strict';

angular.module('core').directive('resizeVideo', function() {
	return function(scope, element, attrs) {
			var width = $(window).width()*.6,
				height = width * .6;

			$('.band-video').attr('height',height).attr('width',width).parent().css('text-align','center');
	};
});
