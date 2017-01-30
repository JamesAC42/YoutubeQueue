var ytqueue = angular.module("ytQueue",[]);

ytqueue.controller("YtHistory", ['$scope', function($scope){
	var history = this;

	history.videos = chrome.storage.sync.get(['video_history'],function(items){
		if(items.video_history === undefined){
			chrome.storage.sync.set({'video_history':[]});
		}else{
			history.videos = items.video_history;
			if(history.videos.length > 0){
				$("#no-history").css("display","none");
			}else{
				$("#no-history").css("display","default");
			}
			$scope.$apply();
		}
	});

	history.removeVideo = function(video){
		var old_videos = history.videos;
		history.videos = [];
		for(var i = 0; i < old_videos.length; i++){
			if(i != video){
				history.videos.push(old_videos[i]);
			}
		}
		chrome.storage.sync.set({'video_history':history.videos})
	}

	$scope.reSort = function(old, video){
		var place = $('#' + video).index();
		var old_video = history.videos[old];
		var old_videos = history.videos;
		history.videos = [];
		for(var i = 0; i < history.length; i++){
			if(i != old){
				history.videos.push(old_videos[i]);
			}
		}
		history.videos.splice(place, 0, old_video);
		chrome.storage.sync.set({'video_history':queue.videos})
	    $scope.$apply(function() {
	        scope.controllerMethod(val);
	    })
	}

	$scope.removeAll = function(){
		if(history.videos.length > 0){
			if(confirm("Are you sure you want to delete all history?")){
				history.videos = [];
				chrome.storage.sync.set({'video_history':history.videos})
				$('#no-history').css("display","default");
				$scope.$apply(function() {
			        scope.controllerMethod(val);
			    })
			}
		}
	}

}]);

ytqueue.controller("YtQueue",['$scope', function($scope){

	var queue = this;

	queue.videos = chrome.storage.sync.get(['video_queue'], function(items){
		if(items.video_queue === undefined){
			chrome.storage.sync.set({'video_queue':[]});
			return;
		}else{
			queue.videos = items.video_queue;
			if(queue.videos.length > 0){
				$('#no-queue').css("display","none");
			}else{
				$('#no-queue').css("display","default");
			}
			$scope.$apply();
		}
	});
	
	queue.removeVideo = function(video){
		var old_videos = queue.videos;
		queue.videos = [];
		for(var i = 0; i < old_videos.length; i++){
			if(i != video){
				queue.videos.push(old_videos[i]);
			}
		}
		chrome.storage.sync.set({'video_queue':queue.videos})
	}

	$scope.reSort = function(old, video){
		var place = $('#' + video).index();
		var old_video = queue.videos[old];
		var old_videos = queue.videos;
		queue.videos = [];
		for(var i = 0; i < old_videos.length; i++){
			if(i != old){
				queue.videos.push(old_videos[i]);
			}
		}
		queue.videos.splice(place, 0, old_video);
		chrome.storage.sync.set({'video_queue':queue.videos})
	    $scope.$apply(function() {
	        scope.controllerMethod(val);
	    })
	}

	$scope.removeAll = function(){
		if(queue.videos.length > 0){
			if(confirm("Are you sure you want to clear the queue?")){
				queue.videos = [];
				chrome.storage.sync.set({'video_queue':queue.videos})
				$('#no-queue').css("display","default");
				$scope.$apply(function() {
			        scope.controllerMethod(val);
			    })
			}
		}
	}

}]);
