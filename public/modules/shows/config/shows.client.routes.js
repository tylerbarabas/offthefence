'use strict';

//Setting up route
angular.module('shows').config(['$stateProvider',
	function($stateProvider) {
		// Shows state routing
		$stateProvider.
		state('listShows', {
			url: '/admin/shows',
			templateUrl: 'modules/shows/views/list-shows.client.view.html'
		}).
		state('createShow', {
			url: '/admin/shows/create',
			templateUrl: 'modules/shows/views/create-show.client.view.html'
		}).
		state('viewShow', {
			url: '/admin/shows/:showId',
			templateUrl: 'modules/shows/views/view-show.client.view.html'
		}).
		state('editShow', {
			url: '/admin/shows/:showId/edit',
			templateUrl: 'modules/shows/views/edit-show.client.view.html'
		});
	}
]);
