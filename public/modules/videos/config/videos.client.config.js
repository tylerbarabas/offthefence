'use strict';

// Configuring the Articles module
angular.module('videos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Videos', 'videos', 'dropdown', '/admin/videos(/create)?');
		Menus.addSubMenuItem('topbar', 'videos', 'List Videos', 'admin/videos');
		Menus.addSubMenuItem('topbar', 'videos', 'New Video', 'admin/videos/create');
	}
]);
