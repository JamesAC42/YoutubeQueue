setInterval(function(){
	var ytplayer = document.getElementById('movie_player');
	var duration = ytplayer.getDuration();
	var current = ytplayer.getCurrentTime();
	if((duration - current) < 1.0){
		var over_event = document.createEvent("customEvent");
		over_event.initCustomEvent("videoFinished", true, true, true);
		document.dispatchEvent(over_event);
	}
},1000);