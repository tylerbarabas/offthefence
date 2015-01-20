'use strict';

// Email lists controller
angular.module('email-lists').controller('EmailListsController', ['$scope', '$stateParams', '$location', 'Authentication', 'EmailLists',
	function($scope, $stateParams, $location, Authentication, EmailLists) {
		$scope.authentication = Authentication;

		// Create new Email list
		$scope.create = function() {
			// Create new Email list object
			var emailList = new EmailLists ({
				name: this.name
			});

			// Redirect after save
			emailList.$save(function(response) {
				$location.path('email-lists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Email list
		$scope.remove = function(emailList) {
			if ( emailList ) { 
				emailList.$remove();

				for (var i in $scope.emailLists) {
					if ($scope.emailLists [i] === emailList) {
						$scope.emailLists.splice(i, 1);
					}
				}
			} else {
				$scope.emailList.$remove(function() {
					$location.path('email-lists');
				});
			}
		};

		// Update existing Email list
		$scope.update = function() {
			var emailList = $scope.emailList;

			emailList.$update(function() {
				$location.path('email-lists/' + emailList._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Email lists
		$scope.find = function() {
			$scope.emailLists = EmailLists.query();
		};

		// Find existing Email list
		$scope.findOne = function() {
			$scope.emailList = EmailLists.get({ 
				emailListId: $stateParams.emailListId
			});
		};
	}
]);