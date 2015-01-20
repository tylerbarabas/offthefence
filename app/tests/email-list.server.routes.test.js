'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EmailList = mongoose.model('EmailList'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, emailList;

/**
 * Email list routes tests
 */
describe('Email list CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Email list
		user.save(function() {
			emailList = {
				name: 'Email list Name'
			};

			done();
		});
	});

	it('should be able to save Email list instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email list
				agent.post('/email-lists')
					.send(emailList)
					.expect(200)
					.end(function(emailListSaveErr, emailListSaveRes) {
						// Handle Email list save error
						if (emailListSaveErr) done(emailListSaveErr);

						// Get a list of Email lists
						agent.get('/email-lists')
							.end(function(emailListsGetErr, emailListsGetRes) {
								// Handle Email list save error
								if (emailListsGetErr) done(emailListsGetErr);

								// Get Email lists list
								var emailLists = emailListsGetRes.body;

								// Set assertions
								(emailLists[0].user._id).should.equal(userId);
								(emailLists[0].name).should.match('Email list Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Email list instance if not logged in', function(done) {
		agent.post('/email-lists')
			.send(emailList)
			.expect(401)
			.end(function(emailListSaveErr, emailListSaveRes) {
				// Call the assertion callback
				done(emailListSaveErr);
			});
	});

	it('should not be able to save Email list instance if no name is provided', function(done) {
		// Invalidate name field
		emailList.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email list
				agent.post('/email-lists')
					.send(emailList)
					.expect(400)
					.end(function(emailListSaveErr, emailListSaveRes) {
						// Set message assertion
						(emailListSaveRes.body.message).should.match('Please fill Email list name');
						
						// Handle Email list save error
						done(emailListSaveErr);
					});
			});
	});

	it('should be able to update Email list instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email list
				agent.post('/email-lists')
					.send(emailList)
					.expect(200)
					.end(function(emailListSaveErr, emailListSaveRes) {
						// Handle Email list save error
						if (emailListSaveErr) done(emailListSaveErr);

						// Update Email list name
						emailList.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Email list
						agent.put('/email-lists/' + emailListSaveRes.body._id)
							.send(emailList)
							.expect(200)
							.end(function(emailListUpdateErr, emailListUpdateRes) {
								// Handle Email list update error
								if (emailListUpdateErr) done(emailListUpdateErr);

								// Set assertions
								(emailListUpdateRes.body._id).should.equal(emailListSaveRes.body._id);
								(emailListUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Email lists if not signed in', function(done) {
		// Create new Email list model instance
		var emailListObj = new EmailList(emailList);

		// Save the Email list
		emailListObj.save(function() {
			// Request Email lists
			request(app).get('/email-lists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Email list if not signed in', function(done) {
		// Create new Email list model instance
		var emailListObj = new EmailList(emailList);

		// Save the Email list
		emailListObj.save(function() {
			request(app).get('/email-lists/' + emailListObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', emailList.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Email list instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Email list
				agent.post('/email-lists')
					.send(emailList)
					.expect(200)
					.end(function(emailListSaveErr, emailListSaveRes) {
						// Handle Email list save error
						if (emailListSaveErr) done(emailListSaveErr);

						// Delete existing Email list
						agent.delete('/email-lists/' + emailListSaveRes.body._id)
							.send(emailList)
							.expect(200)
							.end(function(emailListDeleteErr, emailListDeleteRes) {
								// Handle Email list error error
								if (emailListDeleteErr) done(emailListDeleteErr);

								// Set assertions
								(emailListDeleteRes.body._id).should.equal(emailListSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Email list instance if not signed in', function(done) {
		// Set Email list user 
		emailList.user = user;

		// Create new Email list model instance
		var emailListObj = new EmailList(emailList);

		// Save the Email list
		emailListObj.save(function() {
			// Try deleting Email list
			request(app).delete('/email-lists/' + emailListObj._id)
			.expect(401)
			.end(function(emailListDeleteErr, emailListDeleteRes) {
				// Set message assertion
				(emailListDeleteRes.body.message).should.match('User is not logged in');

				// Handle Email list error error
				done(emailListDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EmailList.remove().exec();
		done();
	});
});