'use strict';


angular.module('core').controller('HomeController', ['$scope', '$timeout', 'Authentication','EmailLists','Shows',
	function($scope, $timeout, Authentication, EmailLists, Shows) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.thankYou = false;
		$scope.mainPage = true;

		$scope.sayThankYou = function() {
			$scope.mainPage = false;

			$timeout(function(){
				$scope.thankYou = true;
			}, 700);
			$timeout(function(){
				$scope.thankYou = false;
			}, 5800);
			$timeout(function(){
				$scope.mainPage = true;
			}, 6500);
		};

		$scope.saveToMailingList = function() {
			// Create new Email list object
			var emailList = new EmailLists ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				zip: this.zip
			});

			emailList.$save(function(response) {
				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.zip = '';

				//flash the thank you screen
				$scope.sayThankYou();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shows
		$scope.findShows = function() {
			$scope.shows = Shows.query();
		};
	}
]);
