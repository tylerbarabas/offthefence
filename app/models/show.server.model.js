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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	venue: {
		type: String,
		default: '',
		required: 'Please fill venue name',
		trim: true
	},
	street: {
		type: String,
		default: ''
	},
	city: {
		type: String,
		default: ''
	},
	state: {
		type: String,
		default: ''
	},
	zip: {
		type: String,
		default: ''
	},
	doorsTime: {
		type: Date,
		required: 'Please fill time that doors open'
	},
	setTime: {
		type: Date,
		required: 'Please fill set time.'
	}
});

mongoose.model('Show', ShowSchema);
