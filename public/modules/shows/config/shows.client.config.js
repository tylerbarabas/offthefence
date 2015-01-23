'use strict';

// Configuring the Articles module
angular.module('shows').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Shows', 'shows', 'dropdown', 'admin/shows(/create)?');
        Menus.addSubMenuItem('topbar', 'shows', 'List Shows', 'admin/shows');
        Menus.addSubMenuItem('topbar', 'shows', 'New Shows', 'admin/shows/create');
    }
]);
