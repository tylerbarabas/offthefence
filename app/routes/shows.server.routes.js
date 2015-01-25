'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shows = require('../../app/controllers/shows.server.controller');

	// Shows Routes
	app.route('/admin/shows')
		.get(shows.list)
		.post(users.requiresLogin, shows.create);

	app.route('/admin/shows/:showId')
		.get(shows.read)
		.put(users.requiresLogin, shows.hasAuthorization, shows.update)
		.delete(users.requiresLogin, shows.hasAuthorization, shows.delete);

	// Finish by binding the Show middleware
	app.param('showId', shows.showByID);
};
