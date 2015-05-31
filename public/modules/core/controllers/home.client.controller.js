'use strict';


angular.module('core').controller('HomeController', ['$rootScope','$location','$window','$scope', '$timeout', 'Authentication','EmailLists','Shows', 'Photos',
	function($rootScope,$location,$window,$scope, $timeout, Authentication, EmailLists, Shows, Photos) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.thankYou = false;
		$scope.mainPage = true;
		$scope.showPhotoPreview = false;

		$scope.loginAllowed = false;

		$scope.photoPages = [0];
		$scope.currentPhotoPage = 0;
		$scope.onHighestPage = false;

		$rootScope.imagesPreloaded = false;

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
				if (photos.length > 0) {
					$scope.preloadImg = [];
					//pre-load images
					for (var i=0;i<photos.length;i++) {
						$scope.preloadImg[i] = new Image();
						$scope.preloadImg[i].src = photos[i].filepath;
						$scope.preloadImg[i].className = 'img-responsive';
						$scope.preloadImg[i].origHeight = photos[i].height;
						$scope.preloadImg[i].origWidth = photos[i].width;
					}
				}

				$scope.showPhotoPage(0);

			});
		};

		$scope.showPhotoPage = function (page) {

			$scope.currentPhotoPage = page;

			var photoIndex = $scope.photoPages[page],
				photosContainer = document.getElementById('photos-container'),
				frag = document.createDocumentFragment();

			photosContainer.innerHTML = '';

			for (var rowsUsed = 0; rowsUsed < 3; rowsUsed++) {

				var row = document.createElement('DIV'),
					colsUsed = 0,
					colValue;

				row.className = "row";

				while (colsUsed < 12) {

					var imageContainer = document.createElement("DIV");

					if (photoIndex >= $scope.preloadImg.length) {
						$scope.onHighestPage = true;
					}

					//portrait
					if ($scope.preloadImg[photoIndex].origHeight > $scope.preloadImg[photoIndex].origWidth) {
						imageContainer.className = 'col-xs-3 photo-holder';
						colValue = 3;
					//landscape
					} else {
						imageContainer.className = 'col-xs-6 photo-holder';
						colValue = 6;
					}

					if (colsUsed+colValue > 12) {
						$scope.preloadImg.push($scope.preloadImg[photoIndex]);
						$scope.preloadImg.splice(photoIndex,1);
					} else {
						imageContainer.appendChild($scope.preloadImg[photoIndex]);
						row.appendChild(imageContainer);

						colsUsed += colValue;
						photoIndex++;
					}
				}

				frag.appendChild(row);
				photosContainer.appendChild(frag);
			}

			$scope.onHighestPage = (photoIndex >= $scope.preloadImg.length);
			console.log("onHighestPage", $scope.onHighestPage);

			if (typeof $scope.photoPages[$scope.currentPhotoPage+1] === 'undefined') {
				$scope.photoPages[$scope.currentPhotoPage+1] = photoIndex;
			}
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

			displayPhoto.addEventListener('load',function(){
				//calculate the center position
				var deadCenter = $window.innerWidth/2,
					halfOffset = displayPhoto.offsetWidth/2,
					centerPhoto = deadCenter - halfOffset;

				//center the photo
				photoPreview.style.left = centerPhoto+'px';
			});

			displayPhoto.style.height = photoHeight+'px';
			displayPhoto.src = $scope.filepath;


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
			if ($scope.currentPhotoPage > 0) {
				$scope.currentPhotoPage--;
				$scope.showPhotoPage($scope.currentPhotoPage);
			}
		};

		$scope.nextPage = function () {
			if (!$scope.onHighestPage) {
				$scope.currentPhotoPage++;
				$scope.showPhotoPage($scope.currentPhotoPage);
			}
		};

	}
]);
