'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		var sndList = [],
		sndIndex = 0,
		currentLoadedSnd = '',
		sndPlaying = false;
		
		sndList.push({path:'modules/core/snd/Howl_At_The_Moon.mp3',title:'Howl at the Moon'});

		$scope.startMusic = function() {
			
			$('#play').removeClass('glyphicon-play').addClass('glyphicon-pause');
	
			var path = sndList[sndIndex];			
			
			if (sndPlaying) {
				if (!$scope.sndInstance.getPaused()) {
					$scope.pauseMusic();
					$('#play').removeClass('glyphicon-pause').addClass('glyphicon-play');
					return;
				} else {
					$scope.sndInstance.play();
				}
			} else {
				$('#sound-loading').show();
				$('#sound-title').hide();
				if (currentLoadedSnd != path) {
						createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
						createjs.Sound.alternateExtensions = ["mp3"];
						createjs.Sound.on("fileload", createjs.proxy($scope.playSound));
						createjs.Sound.registerSound(sndList[sndIndex].path, "sound");
				} else {
						$scope.playSound();
				}

			}
			
			currentLoadedSnd = path;
		 };

	
		$scope.playSound = function() {

			var musicIcon = '<i class="glyphicon glyphicon-music"></i>';

			$('#sound-loading').hide();
			$('#sound-title').html(musicIcon+'  '+sndList[sndIndex].title+'  '+musicIcon).show();
			
			if (!sndPlaying) {
				$scope.sndInstance = createjs.Sound.play("sound");
				$scope.sndInstance.volume = 1;
				sndPlaying = true;
				$scope.sndInstance.on("complete", createjs.proxy($scope.sndFinished));
			}
                };

		$scope.sndFinished = function() {
			$('#sound-title').hide();
			sndPlaying = false;
			$('#play').removeClass('glyphicon-pause').addClass('glyphicon-play');
		};

                $scope.stopMusic = function() {
                        createjs.Sound.stop("sound");
			$scope.sndFinished();
                };

		$scope.changeSong = function(index){
			if (angular.isNumber(index)) {
				sndIndex = index;
			} else if (index == 'next') {
				sndIndex++;
			} else if (index == 'prev') {
				sndIndex--;
			}
			if (sndIndex >= sndList.length) { 
				sndIndex = 0;
			} else if (sndIndex < 0) {
				sndIndex = sndList.length - 1;
			}
		
			if (sndPlaying) {
				$scope.stopMusic();
				$scope.startMusic();
			}
		};

		$scope.pauseMusic = function() {
			$scope.sndInstance.pause();
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
