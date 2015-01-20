'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	EmailList = mongoose.model('EmailList'),
	_ = require('lodash');

/**
 * Create a Email list
 */
exports.create = function(req, res) {
	var emailList = new EmailList(req.body);
	//emailList.user = req.user;

	emailList.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emailList);
		}
	});
};

/**
 * Show the current Email list
 */
exports.read = function(req, res) {
	res.jsonp(req.emailList);
};

/**
 * Update a Email list
 */
exports.update = function(req, res) {
	var emailList = req.emailList ;

	emailList = _.extend(emailList , req.body);

	emailList.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emailList);
		}
	});
};

/**
 * Delete an Email list
 */
exports.delete = function(req, res) {
	var emailList = req.emailList ;

	emailList.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emailList);
		}
	});
};

/**
 * List of Email lists
 */
exports.list = function(req, res) { 
	EmailList.find().sort('-created').populate('user', 'displayName').exec(function(err, emailLists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emailLists);
		}
	});
};

/**
 * Email list middleware
 */
exports.emailListByID = function(req, res, next, id) { 
	EmailList.findById(id).populate('user', 'displayName').exec(function(err, emailList) {
		if (err) return next(err);
		if (! emailList) return next(new Error('Failed to load Email list ' + id));
		req.emailList = emailList ;
		next();
	});
};

/**
 * Email list authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.emailList.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
