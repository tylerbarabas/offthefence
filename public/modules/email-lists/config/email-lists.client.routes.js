'use strict';

//Setting up route
angular.module('email-lists').config(['$stateProvider',
	function($stateProvider) {
		// Email lists state routing
		$stateProvider.
		state('listEmailLists', {
			url: '/email-lists',
			templateUrl: 'modules/email-lists/views/list-email-lists.client.view.html'
		}).
		state('createEmailList', {
			url: '/email-lists/create',
			templateUrl: 'modules/email-lists/views/create-email-list.client.view.html'
		}).
		state('viewEmailList', {
			url: '/email-lists/:emailListId',
			templateUrl: 'modules/email-lists/views/view-email-list.client.view.html'
		}).
		state('editEmailList', {
			url: '/email-lists/:emailListId/edit',
			templateUrl: 'modules/email-lists/views/edit-email-list.client.view.html'
		});
	}
]);