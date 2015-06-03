'use strict';

// Configuring the Articles module
angular.module('email-lists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Email list', 'email-lists', 'dropdown', '/admin/email-lists(/create)?');
		Menus.addSubMenuItem('topbar', 'email-lists', 'List emails', 'admin/email-lists');
		Menus.addSubMenuItem('topbar', 'email-lists', 'Add email to list', 'admin/email-lists/create');
	}
]);
