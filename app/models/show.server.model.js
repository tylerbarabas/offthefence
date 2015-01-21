'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Show Schema
 */
var ShowSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Show name',
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

mongoose.model('Show', ShowSchema);