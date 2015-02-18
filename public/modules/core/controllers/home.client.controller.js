'use strict';


angular.module('core').controller('HomeController', ['$rootScope','$location','$window','$scope', '$timeout', 'Authentication','EmailLists','Shows', 'Photos',
	function($rootScope,$location,$window,$scope, $timeout, Authentication, EmailLists, Shows, Photos) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.thankYou = false;
		$scope.mainPage = true;
		$scope.showPhotoPreview = false;

		$scope.loginAllowed = false;

		$scope.photoIndex = 0;
		$scope.photoPage = 1;
		$scope.numPerPage = 12;

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

		//Find a list of photos
		$scope.findPhotos = function() {
			$scope.photos = Photos.query();

			$scope.photos.$promise.then(function(photos){

				$scope.pages = Math.ceil(photos.length/12);

				//get number of pages
				$scope.filteredPhotos = photos.slice(0,12);

			});
		};

		$scope.showPreview = function(index) {

			if (typeof $scope.photos[index] == 'undefined' && index > 0)
				index = 0;
			else if (typeof $scope.photos[index] == 'undefined' && index < 0)
				index = $scope.photos.length - 1;

			$scope.photoIndex = index;

			$scope.showPhotoPreview = true;
			$scope.filepath = $scope.photos[index].filepath;

			var photoPreview = document.getElementById('photo-preview');

			//I know I want the height of the photo to be 80%
			var photoHeight = $window.innerHeight*.8;

			//Go ahead and set the height of the photo
			var displayPhoto = document.getElementById('display-photo');
				displayPhoto.style.height = photoHeight+'px';
				displayPhoto.src = $scope.filepath;

			//get the dimensions of the thumbnail
			var thumbnail = document.getElementById('thumbnail'+index),
				thumbnailWidth = thumbnail.offsetWidth,
				thumnailHeight = thumbnail.offsetHeight;

			//If the thumbnail was x wide at thumbnail height, how wide will it be now?
			var photoWidth = (photoHeight/thumnailHeight) * thumbnailWidth;

			//calculate the center position
			var deadCenter = $window.innerWidth/2,
				halfOffset = photoWidth/2,
				centerPhoto = deadCenter - halfOffset;

			//center the photo
			photoPreview.style.left = centerPhoto+'px';

		};

		$rootScope.loginAllowed = false;
		//press q ten times to get the log in screen
		var timesPressed = 0;
		angular.element($window).on('keydown', function(e) {
			if (e.keyCode == 81) {
				timesPressed++;
				$window.setTimeout(function(){timesPressed = 0},10000);
			}

			if (timesPressed > 9) {
				$rootScope.loginAllowed = true;
				timesPressed = 0;
				$scope.$apply(function() {
					$location.path('/signin');
				});
			}

			if (e.keyCode == 37 && $scope.showPhotoPreview) {
				$scope.showPreview($scope.photoIndex - 1);
			}

			if (e.keyCode == 39 && $scope.showPhotoPreview) {
				$scope.showPreview($scope.photoIndex + 1);
			}
		});

		$scope.prevPage = function () {
			if ($scope.photoPage > 1) $scope.photoPage--;
		};

		$scope.nextPage = function () {
			if ($scope.photoPage < $scope.pages) $scope.photoPage++;
		};

		$scope.$watch('photoPage + numPerPage', function() {
			var begin = (($scope.photoPage - 1) * $scope.numPerPage),
				end = begin + $scope.numPerPage;

			$scope.filteredPhotos = $scope.photos.slice(begin, end);
		});
	}
]);
