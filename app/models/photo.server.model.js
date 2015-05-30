'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
	filepath: {
		type: String,
		default: '',
		required: 'No file path',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	where: {
		type: String
	},
	credit: {
		type: String
	},
	height: {
		type: Number,
		default: 0
	},
	width: {
		type: Number,
		default: 0
	}
});

mongoose.model('Photo', PhotoSchema);
