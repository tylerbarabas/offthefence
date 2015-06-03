'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Photos',
	function($scope, $upload, $stateParams, $location, Authentication, Photos) {
		$scope.authentication = Authentication;

		$scope.photoPages = [0];
		$scope.currentPhotoPage = 0;
		$scope.onHighestPage = false;
		$scope.photoIndex = 0;

		// Create new Photo
		$scope.create = function() {

			if (typeof $scope.createPhotos == 'undefined' || $scope.createPhotos.length < 1) {

				$scope.error = 'Upload at least 1 image!';

			}

			angular.forEach($scope.createPhotos,function(elem,key){

				console.log("inside the foreach...",elem,key);

				// Create new Photo object
				var photo = new Photos ({
					filepath: elem.src,
					credit: $scope.credit,
					where: $scope.where,
					height: elem.naturalHeight,
					width: elem.naturalWidth
				});

				photo.$save(function(response) {
					//$location.path('photos/' + response._id);
					$scope.createPhotos = [];
					$scope.photoRow.innerHTML = '';

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			});
		};

		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
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

		// Find existing Photo
		$scope.findOne = function() {
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			});
		};

		$scope.onFileSelect = function($files) {
			//$files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.upload = $upload.upload({
				url: '/photos/upload', //upload.php script, node.js route, or servlet url
				method: 'POST',
				headers: {'moduleOrigin': 'photos'},
					//withCredentials: true,
				//data: {myObj: $scope.myModelObj},
				file: file // or list of files ($files) for html5 only
					//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
					// customize file formData name ('Content-Desposition'), server side file variable name.
					//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
					// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
					//formDataAppender: function(formData, key, val){}
				}).progress(function(evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config) {
					// file is uploaded successfully

					if (typeof $scope.createPhotos == 'undefined') $scope.createPhotos = [];

					var path = data.filepath,
						filename = path.replace(/^.*[\\\/]/, ''),
						relPath = '/modules/photos/img/' + filename;

					var img = document.createElement('IMG'),
						imgContainer = document.createElement('DIV'),
						frag = document.createDocumentFragment();
					$scope.photoRow = document.getElementById('photo-row');

					imgContainer.className = 'col-xs-3 photo-holder';

					img.src = relPath;
					img.className = 'img-responsive';

					imgContainer.appendChild(img);
					frag.appendChild(imgContainer);

					$scope.photoRow.appendChild(frag);
					$scope.createPhotos.push(img);


					$scope.error = '';
				})
				.error(function(err){
					console.log('Error: ', err);
				});
					//.then(success, error, progress);
					// access or attach event listeners to the underlying XMLHttpRequest.
					//.xhr(function(xhr){xhr.upload.addEventListener(...)})
			}
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
