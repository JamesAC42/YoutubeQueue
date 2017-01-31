
//Enable the extension on this page
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

//Append the add to queue buttons
$(".video-list-item .related-item-dismissable .content-wrapper").append("<div class='queue-btn'>+</div>");
$(".video-list .video-list-item .content-wrapper").append("<div class='queue-btn'>+</div>");
//Add user controls to dashboard
$("#watch7-user-header").append("<div class='ytqueue-options'><div id='previous-video-btn' class='ytqueue-options-inner ytqueue-skip' title='Previous Video'>&#9665;</div><div id='toggle-auto-play-btn' class='ytqueue-options-inner' title='Toggle Auto-play'><div class='ytqueue-toggle-btn-outer'><div class='ytqueue-toggle-btn-inner'></div></div></div><div id='next-video-btn' class='ytqueue-options-inner ytqueue-skip' title='Next Video'>&#9655;</div></div>")

//Initialize Autoplay 
var auto_play = true;

//Turns outoplay on or off; animates the switch and changes value of variable
function toggleAutoPlay(){
	$('.ytqueue-toggle-btn-outer').toggleClass('ytqueue-toggle-btn-outer-disabled');
	$('.ytqueue-toggle-btn-inner').toggleClass('ytqueue-toggle-btn-inner-disabled');
	if($('.ytqueue-toggle-btn-outer').hasClass("ytqueue-toggle-btn-outer-disabled")){
		$("#toggle-auto-play-btn").attr("title", "Auto-play: Off");
	}else{
		$("#toggle-auto-play-btn").attr("title", "Auto-play: On");
	}
	auto_play = !auto_play;
	chrome.storage.sync.set({"auto_play":auto_play});
}

//Add to queue button functionality/ animation
function addToQueue(){
	//Retrieving the video's information
	var video_index = $(this).parent().parent().parent().index();
	var title = $(this).siblings('.content-link').children('.title').text();
	var vid_url = $(this).siblings('.content-link').attr('href');
	var publisher = $(this).siblings('.content-link').children('.attribution').children('.g-hovercard').text();
	var thumbnail = $(this).parent().siblings('.thumb-wrapper').children('.thumb-link').children('.yt-uix-simple-thumb-wrap').children('img').attr('src');
	var views = $(this).siblings('.content-link').children('.view-count').text();
	//Post JSON
	port.postMessage({
		"video_info": {
			"title": title,
			"publisher": publisher,
			"thumbnail": thumbnail,
			"url": vid_url,
			"views": views
		}

	});
	//Animate the button when clicked
	$(this).animate({
		"width":"+=10px"
	}).animate({
		"width":"-=10px"
	});
}

//Returns JSON of current video information
function getCurrentVideoInfo(){
	var cvid_title = $("h1.watch-title-container span.watch-title").attr("title");
	var video_id = window.location.search.split('v=')[1];
	var ampersandPosition = video_id.indexOf('&');
	if(ampersandPosition != -1) {
	  video_id = video_id.substring(0, ampersandPosition);
	}
	var cvid_thumbnail = "https://img.youtube.com/vi/" + video_id + "/sddefault.jpg";
	var cvid_url = "https://www.youtube.com/watch?v=" + video_id;
	var cvid_publisher = $("div.yt-user-info a.g-hovercard").text();
	var cvid_views = $("div.watch-view-count").text();
	var current_video = {
		"title": cvid_title,
		"publisher": cvid_publisher,
		"thumbnail": cvid_thumbnail,
		"url": cvid_url,
		"views": cvid_views
	}
	return current_video;
}

//Adds current video to history, redirects to next video in the queue and removes it
function gotoNextVideo(){
	chrome.storage.sync.get(['video_queue'],function(items){
  		if(items.video_queue === undefined){
  			chrome.storage.sync.set({"video_queue":[]});
  			return;
  		}else{
			var videos = items.video_queue;
			if(videos.length === 0){
				return;
			}else{
				var next_video = videos[0];
				chrome.storage.sync.get(["video_history"],function(history){
					var current_video = getCurrentVideoInfo();
					if(history.video_history === undefined){
						chrome.sync.storage.set({"video_history":[current_video]})
					}else{
						var historylist = history.video_history;
						historylist.push(current_video);
						chrome.storage.sync.set({'video_history':historylist});
						videos.splice(0,1);
						chrome.storage.sync.set({'video_queue':videos});
						$("head").first().append("<script>location.replace('" + next_video.url + "');</script>");
					}
				});
			}
		}
	});
}

//Adds current video to the first position in the queue, redirects to
//last video in history and removes it
function gotoPreviousVideo(){
	chrome.storage.sync.get(['video_history'],function(history){
  		if(history.video_history === undefined){
  			chrome.storage.sync.set({"video_history":[]});
  			return;
  		}else{
			var historylist = history.video_history;
			if(historylist.length === 0){
				return;
			}else{
				var prev_video = historylist[historylist.length-1];
				chrome.storage.sync.get(["video_queue"],function(items){
					var current_video = getCurrentVideoInfo();
					if(items.video_queue === undefined){
						chrome.sync.storage.set({"video_queue":[current_video]})
					}else{
						var videos = items.video_queue;
						videos.splice(0,0,current_video);
						chrome.storage.sync.set({'video_queue':videos});
						historylist.splice(historylist.length-1,1);
						chrome.storage.sync.set({'video_history':historylist});
						$("head").first().append("<script>location.replace('" + prev_video.url + "');</script>");
					}
				});
			}
		}
	});
}

//Set the user preference of autoplay state
chrome.storage.sync.get(['auto_play'],function(items){
	if(items.auto_play === undefined){
		chrome.storage.sync.set({"auto_play":true});
	}else{
		if(!items.auto_play){
			toggleAutoPlay();
		}
	}
});

//Open port with background script that will send video information to queue
var port = chrome.runtime.connect({name: "video_management"});

//Add the add to queue button to the new videos that appear when the 'Show more videos' is clicked
$("#watch-more-related-button").mouseup(function(){
	setTimeout(function(){
		$(".video-list-item .related-item-dismissable .content-wrapper").each(function(){
			if(!$(this).children(".queue-btn").length){
				$(this).append("<div class='queue-btn'>+</div>");
			}
		});
		$(".queue-btn").click(addToQueue);
	}, 1500);
})

//Bind functionality to the buttons
$('.queue-btn').click(addToQueue);
$("#previous-video-btn").click(gotoPreviousVideo);
$("#next-video-btn").click(gotoNextVideo);
$('.ytqueue-toggle-btn-outer').click(toggleAutoPlay);

//Inject js to be able to detect when video has ended,
//so the page can be redirected to next in the queue
var injectsrc = chrome.extension.getURL('/js/playerinjection.js');
$("head").first().append("<script src='"+injectsrc+"'></script>");

//Listen for when the video is over
//When it is, remove it and then redirect to next in queue
document.addEventListener('videoFinished', function (e)
{
	if(auto_play)gotoNextVideo();
});