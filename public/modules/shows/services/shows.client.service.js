'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('Shows', ['$resource',
	function($resource) {
		return $resource('admin/shows/:showId', { showId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
