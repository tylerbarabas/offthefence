'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('Shows', ['$resource',
	function($resource) {
		return $resource('shows/:showId', { showId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);