'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'off-the-fence';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || ['angularFileUpload']);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('email-lists');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('photos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('shows');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
//'use strict';

// Configuring the Articles module
//angular.module('articles').run(['Menus',
//	function(Menus) {
//		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
//		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
//		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
//	}
//]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
			state('bio', {
				url: '/bio',
				templateUrl: 'modules/core/views/bio.client.view.html'
			}).
			state('videos', {
				url: '/videos',
				templateUrl: 'modules/core/views/videos.client.view.html'
			}).
			state('photos', {
				url: '/photos',
				templateUrl: 'modules/core/views/photos.client.view.html'
			}).
			state('home', {
				url: '/',
				templateUrl: 'modules/core/views/home.client.view.html'
			}).
			state('shows', {
				url: '/shows',
				templateUrl: 'modules/core/views/shows.client.view.html'
			});

	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$rootScope','$location','$window','$scope', '$timeout', 'Authentication','EmailLists','Shows', 'Photos',
	function($rootScope,$location,$window,$scope, $timeout, Authentication, EmailLists, Shows, Photos) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.thankYou = false;
		$scope.mainPage = true;
		$scope.showPhotoPreview = false;

		$scope.loginAllowed = false;

		$scope.photoIndex = 0;
		$scope.photoPage = 1;
		$scope.numPerPage = 12;

		$rootScope.imagesPreloaded = false;

		$scope.sayThankYou = function() {
			$scope.mainPage = false;

			$timeout(function(){
				$scope.thankYou = true;
			}, 700);
			$timeout(function(){
				$scope.thankYou = false;
			}, 5800);
			$timeout(function(){
				$scope.mainPage = true;
			}, 6500);
		};

		$scope.saveToMailingList = function() {
			// Create new Email list object
			var emailList = new EmailLists ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				zip: this.zip
			});

			emailList.$save(function(response) {
				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.zip = '';

				//flash the thank you screen
				$scope.sayThankYou();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shows
		$scope.findShows = function() {
			$scope.shows = Shows.query();
		};

		//Find a list of photos
		$scope.findPhotos = function() {
			$scope.photos = Photos.query();
			$scope.photos.$promise.then(function(photos){
				if (photos.length > 0) {
					$scope.pages = Math.ceil(photos.length/12);
					//get number of pages
					$scope.filteredPhotos = photos.slice(0,12);

					var preload = [];
					//pre-load images
					for (var i=0;i<photos.length;i++) {
						preload[i] = new Image();
						preload[i].src = photos[i].filepath;
					}

				}


			});
		};

		$scope.showPreview = function(index) {

			if (typeof $scope.photos[index] == 'undefined' && index > 0)
				index = 0;
			else if (typeof $scope.photos[index] == 'undefined' && index < 0)
				index = $scope.photos.length - 1;

			$scope.photoIndex = index;

			$scope.showPhotoPreview = true;
			$scope.filepath = $scope.photos[index].filepath;

			var photoPreview = document.getElementById('photo-preview');

			//I know I want the height of the photo to be 80%
			var photoHeight = $window.innerHeight*.8;

			//Go ahead and set the height of the photo
			var displayPhoto = document.getElementById('display-photo');

			displayPhoto.addEventListener('load',function(){
				//calculate the center position
				var deadCenter = $window.innerWidth/2,
					halfOffset = displayPhoto.offsetWidth/2,
					centerPhoto = deadCenter - halfOffset;

				//center the photo
				photoPreview.style.left = centerPhoto+'px';
			});

			displayPhoto.style.height = photoHeight+'px';
			displayPhoto.src = $scope.filepath;


		};

		$rootScope.loginAllowed = false;
		//press q ten times to get the log in screen
		var timesPressed = 0;
		angular.element($window).on('keydown', function(e) {
			if (e.keyCode == 81) {
				timesPressed++;
				$window.setTimeout(function(){timesPressed = 0},10000);
			}

			if (timesPressed > 9) {
				$rootScope.loginAllowed = true;
				timesPressed = 0;
				$scope.$apply(function() {
					$location.path('/signin');
				});
			}

			if (e.keyCode == 37 && $scope.showPhotoPreview) {
				$scope.showPreview($scope.photoIndex - 1);
			}

			if (e.keyCode == 39 && $scope.showPhotoPreview) {
				$scope.showPreview($scope.photoIndex + 1);
			}
		});

		$scope.prevPage = function () {
			if ($scope.photoPage > 1) $scope.photoPage--;
		};

		$scope.nextPage = function () {
			if ($scope.photoPage < $scope.pages) $scope.photoPage++;
		};

		$scope.$watch('photoPage + numPerPage', function() {
			var begin = (($scope.photoPage - 1) * $scope.numPerPage),
				end = begin + $scope.numPerPage;

			$scope.filteredPhotos = $scope.photos.slice(begin, end);
		});

		$scope.findPhotos();
	}
]);

'use strict';

angular.module('core').directive('convertTime', [
	function() {
		return {
			restrict: 'E',
			scope: {
				time: '='
			},
			template: '{{time}}',
			controller: ["$scope", function ($scope) {

				var convertTime = function (time) {

					var split = time.toString().split(':'),
						hour = parseInt(split[0]),
						minute = split[1],
						ampm = 'AM';

					if (hour > 12) {
						ampm = 'PM';
						hour -= 12;
					}

					time = hour + ':' + minute + ' ' + ampm;

					return time;

				};

				$scope.time = convertTime($scope.time);

			}]
		};
	}
]);

'use strict';

angular.module('core').filter('excludePast', [
	function() {
		return function (Shows) {

			var filtered_list = [];

			for (var i = 0; i < Shows.length; i++) {

				var yesterday = new Date().getTime();
				var showDate = new Date(Shows[i].date).getTime();

				if (yesterday <= showDate) {
					filtered_list.push(Shows[i]);
				}
			}
			return filtered_list;
		}
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('email-lists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Email list', 'email-lists', 'dropdown', '/email-lists(/create)?');
		Menus.addSubMenuItem('topbar', 'email-lists', 'List emails', 'email-lists');
		Menus.addSubMenuItem('topbar', 'email-lists', 'Add email to list', 'email-lists/create');
	}
]);

'use strict';

//Setting up route
angular.module('email-lists').config(['$stateProvider',
	function($stateProvider) {
		// Email lists state routing
		$stateProvider.
		state('listEmailLists', {
			url: '/email-lists',
			templateUrl: 'modules/email-lists/views/list-email-lists.client.view.html'
		}).
		state('createEmailList', {
			url: '/email-lists/create',
			templateUrl: 'modules/email-lists/views/create-email-list.client.view.html'
		}).
		state('viewEmailList', {
			url: '/email-lists/:emailListId',
			templateUrl: 'modules/email-lists/views/view-email-list.client.view.html'
		}).
		state('editEmailList', {
			url: '/email-lists/:emailListId/edit',
			templateUrl: 'modules/email-lists/views/edit-email-list.client.view.html'
		});
	}
]);
'use strict';

// Email lists controller
angular.module('email-lists').controller('EmailListsController', ['$scope', '$stateParams', '$location', 'Authentication', 'EmailLists',
	function($scope, $stateParams, $location, Authentication, EmailLists) {
		$scope.authentication = Authentication;

		// Create new Email list
		$scope.create = function() {
			// Create new Email list object
			var emailList = new EmailLists ({
				name: this.name
			});

			// Redirect after save
			emailList.$save(function(response) {
				$location.path('email-lists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Email list
		$scope.remove = function(emailList) {
			if ( emailList ) { 
				emailList.$remove();

				for (var i in $scope.emailLists) {
					if ($scope.emailLists [i] === emailList) {
						$scope.emailLists.splice(i, 1);
					}
				}
			} else {
				$scope.emailList.$remove(function() {
					$location.path('email-lists');
				});
			}
		};

		// Update existing Email list
		$scope.update = function() {
			var emailList = $scope.emailList;

			emailList.$update(function() {
				$location.path('email-lists/' + emailList._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Email lists
		$scope.find = function() {
			$scope.emailLists = EmailLists.query();
		};

		// Find existing Email list
		$scope.findOne = function() {
			$scope.emailList = EmailLists.get({ 
				emailListId: $stateParams.emailListId
			});
		};
	}
]);
'use strict';

//Email lists service used to communicate Email lists REST endpoints
angular.module('email-lists').factory('EmailLists', ['$resource',
	function($resource) {
		return $resource('email-lists/:emailListId', { emailListId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('photos').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Photos', 'photos', 'dropdown', '/admin/photos(/create)?');
        Menus.addSubMenuItem('topbar', 'photos', 'List Photos', 'admin/photos');
        Menus.addSubMenuItem('topbar', 'photos', 'New Photos', 'admin/photos/create');
    }
]);

'use strict';

//Setting up route
angular.module('photos').config(['$stateProvider',
	function($stateProvider) {
		// Photos state routing
		$stateProvider.
		state('listPhotos', {
			url: '/admin/photos',
			templateUrl: 'modules/photos/views/list-photos.client.view.html'
		}).
		state('createPhoto', {
			url: '/admin/photos/create',
			templateUrl: 'modules/photos/views/create-photo.client.view.html'
		}).
		state('viewPhoto', {
			url: '/admin/photos/:photoId',
			templateUrl: 'modules/photos/views/view-photo.client.view.html'
		}).
		state('editPhoto', {
			url: '/admin/photos/:photoId/edit',
			templateUrl: 'modules/photos/views/edit-photo.client.view.html'
		});
	}
]);

'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Photos',
	function($scope, $upload, $stateParams, $location, Authentication, Photos) {
		$scope.authentication = Authentication;

		// Create new Photo
		$scope.create = function() {

			if (typeof $scope.createPhotos == 'undefined' || $scope.createPhotos.length < 1) {

				$scope.error = 'Upload at least 1 image!';

			}

			angular.forEach($scope.createPhotos,function(filepath,key){

				// Create new Photo object
				var photo = new Photos ({
					filepath: filepath,
					credit: $scope.credit,
					where: $scope.where
				});

				photo.$save(function(response) {
					//$location.path('photos/' + response._id);
					$scope.createPhotos = [];

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			});
		};

		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
			$scope.photos = Photos.query();
		};

		// Find existing Photo
		$scope.findOne = function() {
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			});
		};

		$scope.onFileSelect = function($files) {
			//$files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.upload = $upload.upload({
				url: '/photos/upload', //upload.php script, node.js route, or servlet url
				method: 'POST',
				headers: {'moduleOrigin': 'photos'},
					//withCredentials: true,
				//data: {myObj: $scope.myModelObj},
				file: file // or list of files ($files) for html5 only
					//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
					// customize file formData name ('Content-Desposition'), server side file variable name.
					//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
					// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
					//formDataAppender: function(formData, key, val){}
				}).progress(function(evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config) {
					// file is uploaded successfully

					if (typeof $scope.createPhotos == 'undefined') $scope.createPhotos = [];

					var path = data.filepath,
						filename = path.replace(/^.*[\\\/]/, ''),
						relPath = '/modules/photos/img/' + filename;

					$scope.createPhotos.push(relPath);
					$scope.error = '';
				})
				.error(function(err){
					console.log('Error: ', err);
				});
					//.then(success, error, progress);
					// access or attach event listeners to the underlying XMLHttpRequest.
					//.xhr(function(xhr){xhr.upload.addEventListener(...)})
			}
		};
	}
]);

'use strict';

//Photos service used to communicate Photos REST endpoints
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('shows').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Shows', 'shows', 'dropdown', 'admin/shows(/create)?');
        Menus.addSubMenuItem('topbar', 'shows', 'List Shows', 'admin/shows');
        Menus.addSubMenuItem('topbar', 'shows', 'New Shows', 'admin/shows/create');
    }
]);

'use strict';

//Setting up route
angular.module('shows').config(['$stateProvider',
	function($stateProvider) {
		// Shows state routing
		$stateProvider.
		state('listShows', {
			url: '/admin/shows',
			templateUrl: 'modules/shows/views/list-shows.client.view.html'
		}).
		state('createShow', {
			url: '/admin/shows/create',
			templateUrl: 'modules/shows/views/create-show.client.view.html'
		}).
		state('viewShow', {
			url: '/admin/shows/:showId',
			templateUrl: 'modules/shows/views/view-show.client.view.html'
		}).
		state('editShow', {
			url: '/admin/shows/:showId/edit',
			templateUrl: 'modules/shows/views/edit-show.client.view.html'
		});
	}
]);

'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shows',
	function($scope, $stateParams, $location, Authentication, Shows) {
		$scope.authentication = Authentication;

		// Create new Show
		$scope.create = function() {
			// Create new Show object
			var show = new Shows ({
				venue: this.venue,
				street: this.street,
				city: this.city,
				state: this.state,
				date: this.date,
				doorsTime: this.doorsTime,
				setTime: this.setTime,
				link: this.link
			});

			// Redirect after save
			show.$save(function(response) {
				$location.path('admin/shows/' + response._id);

				// Clear form fields
				$scope.venue = '';
				$scope.street = '';
				$scope.city = '';
				$scope.state = '';
				$scope.showDate = '';
				$scope.doorsTime = '';
				$scope.setTime = '';
				$scope.link = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Show
		$scope.remove = function(show) {
			if ( show ) { 
				show.$remove();

				for (var i in $scope.shows) {
					if ($scope.shows [i] === show) {
						$scope.shows.splice(i, 1);
					}
				}
			} else {
				$scope.show.$remove(function() {
					$location.path('admin/shows');
				});
			}
		};

		// Update existing Show
		$scope.update = function() {
			var show = $scope.show;

			show.$update(function() {
				$location.path('admin/shows/' + show._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shows
		$scope.find = function() {
			$scope.shows = Shows.query();
		};

		// Find existing Show
		$scope.findOne = function() {
			$scope.show = Shows.get({ 
				showId: $stateParams.showId
			});

			//convert times for 24hr to 12hr format
			$scope.show.$promise.then(function(show){
				show.setTimeConv = convertTime(show.setTime);
				show.doorsTimeConv = convertTime(show.doorsTime);
			});

		};

		var convertTime = function (time) {

			var split = time.toString().split(':'),
				hour = parseInt(split[0]),
				minute = split[1],
				ampm = 'AM';

			if (hour > 12) {
				ampm = 'PM';
				hour -= 12;
			}

			time = hour + ':' + minute + ' ' + ampm;

			return time;

		}

	}
]);

'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('Shows', ['$resource',
	function($resource) {
		return $resource('admin/shows/:showId', { showId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope','$scope', '$http', '$location', 'Authentication',
	function($rootScope,$scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user || !$rootScope.loginAllowed) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);