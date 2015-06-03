'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var photos = require('../../app/controllers/photos.server.controller');

	// Photos Routes
	app.route('/photos')
		.get(photos.list)
		.post(users.requiresLogin, photos.create);

	app.route('/photos/upload')
		.post(photos.upload);

	app.route('/photos/:photoId')
		.get(photos.read)
		.put(users.requiresLogin, photos.update)
		.delete(users.requiresLogin, photos.delete);

	// Finish by binding the Photo middleware
	app.param('photoId', photos.photoByID);
};
