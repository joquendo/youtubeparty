injectPlayerScript();
 
var player=null,
	scope=null;
 
var app = angular.module("YouTube",[]);
app.controller("YouTubeCtrl", function($scope,$http){
	scope=$scope;
	$scope.term="";
	$scope.nowPlaying = [];
	$scope.people = [];
	$scope.currentSong=0;
	var isPlaying=false;
 
	$scope.search = function(term){
		$http.get("/search?q=" + term)
			 .success(function(data){
			 	$scope.results = data.items;
			 });	
	}
 
	$scope.play = function(item){
		var videoId = item.id.videoId;
		socket.emit('play', videoId);
		isPlaying=true;
		if(player==null){
			player = new YT.Player('player', {
      			width: 400,
      			height: 225,
      			videoId: videoId,
      			autoplay : 1,
      			playerVars: { 'autoplay': 1, 'controls': 1 },
      			events: {
        			'onReady': onPlayerReady,
        			'onStateChange': onPlayerStateChange
      			}
    		});
		}
		else {
			player.loadVideoById(videoId, 0);
		}
	}
  
	$scope.add = function(item){
		var video = {
			videoId : item.id.videoId,
			description : item.snippet.description
		};
		$scope.nowPlaying.push(video);
		if(!isPlaying){
			$scope.play(item);		
		}
		$http.post("/video",video);
	};
 
	$scope.remove = function(video){
		var index=$scope.nowPlaying.indexOf(video);
		scope.nowPlaying.splice(index,1);
		$http.delete("/video/" + video.videoId);
	};	
  
  $scope.selectNowPlaying = function(video,index){
  		player.loadVideoById(video.videoId, 0);	
  		$scope.emit('play', videoId);	
   		$scope.currentSong=index;		
  };
 
  $scope.join = function(person){
  	if(person.DisplayName != myName){
  		$scope.people.push(person);
  		$scope.$apply();
  	}
  };
 
  $scope.socketPlay = function(videoId){
  	if(player==null){
		player = new YT.Player('player', {
      		height: '190',
      		width: '340',
      		videoId: videoId,
      		autoplay : 1,
      		playerVars: { 'autoplay': 1, 'controls': 1 },
      		events: {
        		'onReady': onPlayerReady,
        		'onStateChange': onPlayerStateChange
      		}
    	});
	}
	else{
			player.loadVideoById(videoId, 0);
		}
  }; //end $scope.socketPlay function

  $scope.$on('end',function(e,value){
  	$scope.currentSong++;
	if($scope.currentSong < $scope.nowPlaying.length){
		isPlaying=true;
		player.loadVideoById($scope.nowPlaying[$scope.currentSong], 0);
	}
	else{
		isPlaying=false;
		return;
	}
  }); // end of video play

  $http.get("/video").success(function(data){
  	$scope.nowPlaying=data;

  	if(data.length > 0){
  		var video = data[0];
  		isPlaying=true;
 
		window.setTimeout(function(){
			player = new YT.Player('player', {
				height: '190',
				width: '340',
				videoId: video.videoId,
				autoplay : 1,
				playerVars: { 'autoplay': 1, 'controls': 1 },
				events: {
				  'onReady': onPlayerReady,
				  'onStateChange': onPlayerStateChange
				}
			});
		},100);
	}
  });
});
 
function onPlayerReady(event) {
  $('#player').addClass('embed-responsive-item');
  player.playVideo();
}
 
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    setTimeout(function(){
    	scope.$broadcast("end");
    }, 1);
  }
}
 
function injectPlayerScript(){
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}