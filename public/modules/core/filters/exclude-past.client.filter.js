'use strict';

angular.module('core').filter('excludePast', [
	function() {
		return function (Shows) {

			var filtered_list = [];

			for (var i = 0; i < Shows.length; i++) {

				var yesterday = new Date().getTime();
				var showDate = new Date(Shows[i].date).getTime();

				if (yesterday <= showDate) {
					filtered_list.push(Shows[i]);
				}
			}
			return filtered_list;
		}
	}
]);
