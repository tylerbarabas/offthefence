'use strict';

// Configuring the Articles module
angular.module('photos').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Photos', 'photos', 'dropdown', '/admin/photos(/create)?');
        Menus.addSubMenuItem('topbar', 'photos', 'List Photos', 'admin/photos');
        Menus.addSubMenuItem('topbar', 'photos', 'New Photos', 'admin/photos/create');
    }
]);
