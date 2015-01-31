'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shows',
	function($scope, $stateParams, $location, Authentication, Shows) {
		$scope.authentication = Authentication;

		// Create new Show
		$scope.create = function() {
			// Create new Show object
			var show = new Shows ({
				venue: this.venue,
				street: this.street,
				city: this.city,
				state: this.state,
				date: this.date,
				doorsTime: this.doorsTime,
				setTime: this.setTime,
				link: this.link
			});

			// Redirect after save
			show.$save(function(response) {
				$location.path('admin/shows/' + response._id);

				// Clear form fields
				$scope.venue = '';
				$scope.street = '';
				$scope.city = '';
				$scope.state = '';
				$scope.showDate = '';
				$scope.doorsTime = '';
				$scope.setTime = '';
				$scope.link = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Show
		$scope.remove = function(show) {
			if ( show ) { 
				show.$remove();

				for (var i in $scope.shows) {
					if ($scope.shows [i] === show) {
						$scope.shows.splice(i, 1);
					}
				}
			} else {
				$scope.show.$remove(function() {
					$location.path('admin/shows');
				});
			}
		};

		// Update existing Show
		$scope.update = function() {
			var show = $scope.show;

			show.$update(function() {
				$location.path('admin/shows/' + show._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shows
		$scope.find = function() {
			$scope.shows = Shows.query();
		};

		// Find existing Show
		$scope.findOne = function() {
			$scope.show = Shows.get({ 
				showId: $stateParams.showId
			});

			//convert times for 24hr to 12hr format
			$scope.show.$promise.then(function(show){
				show.setTimeConv = convertTime(show.setTime);
				show.doorsTimeConv = convertTime(show.doorsTime);
			});

		};

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

		}

	}
]);
