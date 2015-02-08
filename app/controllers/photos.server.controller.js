'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash'),
	multiparty = require('multiparty'),
	path = require('path');

/**
 * Create a Photo
 */
exports.create = function(req, res) {
	var photo = new Photo(req.body);
	photo.user = req.user;

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
	res.jsonp(req.photo);
};

/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.upload = function(req, res) {
	var appDir = path.dirname(require.main.filename),
		moduleOrigin = req.get('moduleorigin'),
		dest = appDir + '/public/modules/' + moduleOrigin + '/img/';


	var form = new multiparty.Form({uploadDir: dest});
	form.on('error',function(err) {
		console.log('Error parsing form: ' + err.stack);
	});

	form.parse(req, function (err, fields, files){
		if (!err) {
			console.log('File loaded to:' + files.file[0].path);
			res.status(200).json({ 'filepath': files.file[0].path });
		} else {
			res.send(500);
		}
	});
};
