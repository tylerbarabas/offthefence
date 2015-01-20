'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var emailLists = require('../../app/controllers/email-lists.server.controller');

	// Email lists Routes
	app.route('/email-lists')
		.get(emailLists.list)
		.post(emailLists.create);

	app.route('/email-lists/:emailListId')
		.get(emailLists.read)
		.put(users.requiresLogin, emailLists.hasAuthorization, emailLists.update)
		.delete(users.requiresLogin, emailLists.hasAuthorization, emailLists.delete);

	// Finish by binding the Email list middleware
	app.param('emailListId', emailLists.emailListByID);
};
