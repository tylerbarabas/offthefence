'use strict';

(function() {
	// Email lists Controller Spec
	describe('Email lists Controller Tests', function() {
		// Initialize global variables
		var EmailListsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Email lists controller.
			EmailListsController = $controller('EmailListsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Email list object fetched from XHR', inject(function(EmailLists) {
			// Create sample Email list using the Email lists service
			var sampleEmailList = new EmailLists({
				name: 'New Email list'
			});

			// Create a sample Email lists array that includes the new Email list
			var sampleEmailLists = [sampleEmailList];

			// Set GET response
			$httpBackend.expectGET('email-lists').respond(sampleEmailLists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emailLists).toEqualData(sampleEmailLists);
		}));

		it('$scope.findOne() should create an array with one Email list object fetched from XHR using a emailListId URL parameter', inject(function(EmailLists) {
			// Define a sample Email list object
			var sampleEmailList = new EmailLists({
				name: 'New Email list'
			});

			// Set the URL parameter
			$stateParams.emailListId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/email-lists\/([0-9a-fA-F]{24})$/).respond(sampleEmailList);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emailList).toEqualData(sampleEmailList);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EmailLists) {
			// Create a sample Email list object
			var sampleEmailListPostData = new EmailLists({
				name: 'New Email list'
			});

			// Create a sample Email list response
			var sampleEmailListResponse = new EmailLists({
				_id: '525cf20451979dea2c000001',
				name: 'New Email list'
			});

			// Fixture mock form input values
			scope.name = 'New Email list';

			// Set POST response
			$httpBackend.expectPOST('email-lists', sampleEmailListPostData).respond(sampleEmailListResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Email list was created
			expect($location.path()).toBe('/email-lists/' + sampleEmailListResponse._id);
		}));

		it('$scope.update() should update a valid Email list', inject(function(EmailLists) {
			// Define a sample Email list put data
			var sampleEmailListPutData = new EmailLists({
				_id: '525cf20451979dea2c000001',
				name: 'New Email list'
			});

			// Mock Email list in scope
			scope.emailList = sampleEmailListPutData;

			// Set PUT response
			$httpBackend.expectPUT(/email-lists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/email-lists/' + sampleEmailListPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid emailListId and remove the Email list from the scope', inject(function(EmailLists) {
			// Create new Email list object
			var sampleEmailList = new EmailLists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Email lists array and include the Email list
			scope.emailLists = [sampleEmailList];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/email-lists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmailList);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.emailLists.length).toBe(0);
		}));
	});
}());