'use strict';

angular.module('core').directive('convertTime', [
	function() {
		return {
			restrict: 'E',
			scope: {
				time: '='
			},
			template: '{{time}}',
			controller: function ($scope) {

				var convertTime = function (time) {

					var split = time.toString().split(':'),
						hour = parseInt(split[0]),
						minute = split[1],
						ampm = 'AM';

					if (hour > 12) {
						ampm = 'PM';
						hour -= 12;
					}

					time = hour + ':' + minute + ' ' + ampm;

					return time;

				};

				$scope.time = convertTime($scope.time);

			}
		};
	}
]);
