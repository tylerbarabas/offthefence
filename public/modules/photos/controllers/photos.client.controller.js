'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Photos',
	function($scope, $upload, $stateParams, $location, Authentication, Photos) {
		$scope.authentication = Authentication;

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
	}
]);
