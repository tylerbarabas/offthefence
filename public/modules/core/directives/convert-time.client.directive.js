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

					var split = $scope.time.split(':'),
						hour = parseInt(split[0]),
						minute = split[1],
						ampm = 'AM';

					if (hour > 12) {
						ampm = 'PM';
						hour -= 12;
					}
				
					$scope.time = hour + ':' + minute + ' ' + ampm;
			}
		};
	}
]);
