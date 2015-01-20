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
	name: {
		type: String,
		default: '',
		required: 'Please fill Email list name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('EmailList', EmailListSchema);