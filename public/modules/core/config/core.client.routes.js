'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
			state('bio', {
				url: '/bio',
				templateUrl: 'modules/core/views/bio.client.view.html'
			}).
			state('videos', {
				url: '/videos',
				templateUrl: 'modules/core/views/videos.client.view.html'
			}).
			state('photos', {
				url: '/photos',
				templateUrl: 'modules/core/views/photos.client.view.html'
			}).
			state('home', {
				url: '/',
				templateUrl: 'modules/core/views/home.client.view.html'
			}).
			state('shows', {
				url: '/shows',
				templateUrl: 'modules/core/views/shows.client.view.html'
			});

	}
]);
