'use strict';

//Setting up route
angular.module('videos').config(['$stateProvider',
	function($stateProvider) {
		// Videos state routing
		$stateProvider.
		state('listVideos', {
			url: '/admin/videos',
			templateUrl: 'modules/videos/views/list-videos.client.view.html'
		}).
		state('createVideo', {
			url: '/admin/videos/create',
			templateUrl: 'modules/videos/views/create-video.client.view.html'
		}).
		state('viewVideo', {
			url: '/admin/videos/:videoId',
			templateUrl: 'modules/videos/views/view-video.client.view.html'
		}).
		state('editVideo', {
			url: '/admin/videos/:videoId/edit',
			templateUrl: 'modules/videos/views/edit-video.client.view.html'
		});
	}
]);
