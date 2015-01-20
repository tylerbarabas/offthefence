'use strict';

// Configuring the Articles module
angular.module('email-lists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Email lists', 'email-lists', 'dropdown', '/email-lists(/create)?');
		Menus.addSubMenuItem('topbar', 'email-lists', 'List Email lists', 'email-lists');
		Menus.addSubMenuItem('topbar', 'email-lists', 'New Email list', 'email-lists/create');
	}
]);