var ytqueue = angular.module("ytQueue",[]);
ytqueue.controller("YtQueue",['$scope', function($scope){

	var queue = this;

	queue.videos = chrome.storage.sync.get(['video_queue'], function(items){
		if(items.video_queue === undefined){
			chrome.storage.sync.set({'video_queue':[]});
			return;
		}else{
			queue.videos = items.video_queue;
			if(queue.videos.length > 0){
				$('.no-videos-container').css("display","none");
			}else{
				$('.no-videos-container').css("display","default");
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
			if(confirm("Are you sure?")){
				queue.videos = [];
				chrome.storage.sync.set({'video_queue':queue.videos})
				$('.no-videos-container').css("display","default");
				$scope.$apply(function() {
			        scope.controllerMethod(val);
			    })
			}
		}else{
			alert("You have no videos in the queue.");
		}
	}

}]);
