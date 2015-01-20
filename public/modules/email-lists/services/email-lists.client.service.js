'use strict';

//Email lists service used to communicate Email lists REST endpoints
angular.module('email-lists').factory('EmailLists', ['$resource',
	function($resource) {
		return $resource('email-lists/:emailListId', { emailListId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);