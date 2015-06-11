'use strict';

// Videos controller
angular.module('videos').controller('VideosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Videos', '$sce',
	function($scope, $stateParams, $location, Authentication, Videos, $sce) {
		$scope.authentication = Authentication;

		// Create new Video
		$scope.create = function() {

			this.url = this.url.replace("watch?v=", "embed/");

			// Create new Video object
			var video = new Videos ({
				url: this.url
			});

			// Redirect after save
			video.$save(function(response) {
				$location.path('admin/videos/' + response._id);

				// Clear form fields
				$scope.url = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Video
		$scope.remove = function(video) {
			if ( video ) { 
				video.$remove();

				for (var i in $scope.videos) {
					if ($scope.videos [i] === video) {
						$scope.videos.splice(i, 1);
					}
				}
			} else {
				$scope.video.$remove(function() {
					$location.path('admin/videos');
				});
			}
		};

		// Update existing Video
		$scope.update = function() {
			var video = $scope.video;

			video.url = video.url.replace("watch?v=", "embed/");

			video.$update(function() {
				$location.path('admin/videos/' + video._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Videos
		$scope.find = function() {
			$scope.videos = Videos.query();
			$scope.videos.$promise.then(function(videos){
				for (var i=0;i<$scope.videos.length;i++) {
					$scope.videos[i].iFrameUrl = $sce.trustAsResourceUrl($scope.videos[i].url);
				}
			});
		};

		// Find existing Video
		$scope.findOne = function() {
			$scope.video = Videos.get({ 
				videoId: $stateParams.videoId
			});
			$scope.video.$promise.then(function(video) {
				$scope.video.iFrameUrl = $sce.trustAsResourceUrl($scope.video.url);
			});
		};
	}
]);
