'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.startMusic = function() {
                        console.log('startMusic');
                        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
                        createjs.Sound.alternateExtensions = ["mp3"];
                        createjs.Sound.on("fileload", createjs.proxy($scope.loadHandler));
                        createjs.Sound.registerSound("modules/core/snd/thisseemstobeworking.mp3", "sound");
                };

                $scope.loadHandler = function() {
                        var instance = createjs.Sound.play("sound");
                        instance.volume = 1;
                };

                $scope.stopMusic = function() {
                        createjs.Sound.stop("sound");
                };


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
