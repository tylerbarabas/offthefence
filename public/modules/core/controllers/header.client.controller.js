'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.soundReady = false;

		var sndList = [],
		sndIndex = 0,
		currentLoadedSound = '',
		sndPlaying = false;
		
		sndList.push({src:'modules/core/snd/howlatthemoon.mp3',id:'Howl at the Moon'});
		sndList.push({src:'modules/core/snd/beer.mp3',id:'Beer'});
		sndList.push({src:'modules/core/snd/longlongtime.mp3',id:'Long Long Time'});
		sndList.push({src:'modules/core/snd/hypnotized.mp3',id:'Hypnotized'});

		$('#sound-loading').show();
		createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
		createjs.Sound.alternateExtensions = ["mp3"];
		createjs.Sound.on("fileload", createjs.proxy(function(){
			$('#sound-loading').hide();
			$scope.soundReady = true;
		}));
		createjs.Sound.registerSounds(sndList);

		//prevent the sound controls from being highlighted when double clicked
		jQuery('.soundctrl').mousedown(function(e){ e.preventDefault(); });

		$scope.startMusic = function() {

			if ($scope.soundReady) {

				$('#play').removeClass('glyphicon-play').addClass('glyphicon-pause');

				var song = sndList[sndIndex];

				if (sndPlaying) {
					if (!$scope.sndInstance.getPaused()) {
						$scope.pauseMusic();
						$('#play').removeClass('glyphicon-pause').addClass('glyphicon-play');
					} else {
						$scope.sndInstance.play();
					}
				} else {
					$('#sound-loading').show();
					$('#sound-title').hide();

					$scope.playSound();


				}

			}
		};

		$scope.resetSoundJS = function () {
			createjs.Sound.activePlugin = null;
			createjs.Sound.pluginsRegistered = false;
			createjs.Sound.idHash = {};
			createjs.Sound.preloadHash = {};
			// now you must register the plugins again, for example with
			createjs.Sound.initializeDefaultPlugins();
		};

	
		$scope.playSound = function() {

			var musicIcon = '<i class="glyphicon glyphicon-music"></i>';

			$('#sound-loading').hide();
			$('#sound-title').html(musicIcon+'  '+sndList[sndIndex].id+'  '+musicIcon).show();
			
			if (!sndPlaying) {
				$scope.sndInstance = createjs.Sound.play(sndList[sndIndex].src);
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
