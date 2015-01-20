'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Email list Schema
 */
var EmailListSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill first name',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please fill last name',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill email',
		trim: true
	},
	zip: {
		type: String,
		default: '',
		required: 'Please fill zip code',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		default: null
	}
});

mongoose.model('EmailList', EmailListSchema);
