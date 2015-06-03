'use strict';


angular.module('core').controller('HomeController', ['$rootScope','$location','$window','$scope', '$timeout', 'Authentication','EmailLists','Shows', 'Photos',
	function($rootScope,$location,$window,$scope, $timeout, Authentication, EmailLists, Shows, Photos) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.thankYou = false;
		$scope.mainPage = true;
		$scope.photoPreviewShowing = false;

		$scope.loginAllowed = false;

		$scope.photoPages = [0];
		$scope.currentPhotoPage = 0;
		$scope.onHighestPage = false;
		$scope.photoIndex = 0;

		$rootScope.imagesPreloaded = false;

		$scope.canDownload = false;

		$scope.sayThankYou = function() {

			$scope.mainPage = false;

			$timeout(function(){
				$scope.thankYou = true;
			}, 700);
			$timeout(function(){
				$scope.thankYou = false;
			}, 4800);
			$timeout(function(){
				$scope.mainPage = true;
				$scope.canDownload = true;
			}, 5500);
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
			var stopLooping = false;

			var photoIndex = $scope.photoPages[page],
				photosContainer = document.getElementById('photos-container'),
				frag = document.createDocumentFragment();

			photosContainer.innerHTML = '';

			for (var rowsUsed = 0; rowsUsed < 3; rowsUsed++) {

				if (stopLooping) return;

				var row = document.createElement('DIV'),
					colsUsed = 0,
					colValue;

				row.className = "row";

				var oi = 0;
				while (colsUsed < 12 && !stopLooping) {
					oi++;

					var imageContainer = document.createElement("DIV");

					if (photoIndex >= $scope.preloadImg.length-1) {
						$scope.onHighestPage = true;
						stopLooping = true;
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

					if (colsUsed+colValue > 12 && oi < 12) {
						$scope.preloadImg.push($scope.preloadImg[photoIndex]);
						$scope.preloadImg.splice(photoIndex,1);
					} else {

						$scope.preloadImg[photoIndex].setAttribute('data-index',photoIndex);
						$scope.preloadImg[photoIndex].addEventListener('click',$scope.showPreview);

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

			if (typeof $scope.photoPages[$scope.currentPhotoPage+1] === 'undefined') {
				$scope.photoPages[$scope.currentPhotoPage+1] = photoIndex;
			}
		};

		$scope.showPreview = function(e) {

			$scope.photoPreviewShowing = true;
			
			var index;
			if (typeof e.target === 'undefined') {
				index = e;
			} else {
				index = e.target.dataset.index;
			}

			if (typeof $scope.preloadImg[index] == 'undefined' && index > 0)
				index = 0;
			else if (typeof $scope.preloadImg[index] == 'undefined' && index < 0)
				index = $scope.preloadImg.length - 1;

			$scope.photoIndex = index;
			$scope.filepath = $scope.preloadImg[index].src;

			var photoPreview = document.getElementById('photo-preview'),
				photoSize,
				displayPhoto;

			photoPreview.style.visibility = "hidden";

			//portrait
			if ($scope.preloadImg[index].origHeight > $scope.preloadImg[index].origWidth) {
				photoSize = $window.innerHeight*.7;

				displayPhoto = document.getElementById('display-photo');
				displayPhoto.style.height = photoSize+'px';
				displayPhoto.style.width = "auto";

			//landscape
			} else {
				photoSize = $window.innerWidth*.6;

				displayPhoto = document.getElementById('display-photo');
				displayPhoto.style.width = photoSize+'px';
				displayPhoto.style.height = "auto";
			}

			displayPhoto.addEventListener('load',function(){
				//calculate the center position
				var deadCenter = $window.innerWidth/2,
					halfOffset = displayPhoto.offsetWidth/2,
					centerPhoto = deadCenter - halfOffset;

				//center the photo
				photoPreview.style.left = centerPhoto+'px';

				deadCenter = $window.innerHeight/2;
				halfOffset = displayPhoto.offsetHeight/2;
				centerPhoto = deadCenter - halfOffset;

				//center the photo
				photoPreview.style.top = centerPhoto+'px';
				photoPreview.style.visibility = "visible";
			});

			displayPhoto.src = $scope.filepath;

			$('#preview-container').show(100);

		};

		$scope.hidePhotoPreview = function() {
			$scope.photoPreviewShowing = false;
			$('#preview-container').hide(100);
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

			if (e.keyCode == 37 && $scope.photoPreviewShowing) {
				if ($scope.photoIndex == 0) $scope.photoIndex = $scope.preloadImg.length;
				$scope.showPreview($scope.photoIndex - 1);
			}

			if (e.keyCode == 39 && $scope.photoPreviewShowing) {
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

		$(window).resize(function(){
			if ($scope.photoPreviewShowing) {
				$scope.showPreview($scope.photoIndex);
			}

			if ($location.path() == '/videos') $scope.resizeVideos();
		});

		$scope.resizeVideos = function() {
			var videos = document.getElementsByClassName('band-video');
			for (var i=0;i<videos.length;i++) {
				var width = document.getElementById('video-jumbotron').offsetWidth*.8,
					height = width * .6;

				videos[i].setAttribute('width',width);
				videos[i].setAttribute('height',height);
			}
		};

	}
]);
