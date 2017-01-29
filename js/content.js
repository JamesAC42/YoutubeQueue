//Append the add to queue buttons
$(".video-list-item .related-item-dismissable .content-wrapper").append("<div class='queue-btn'>+</div>");
//Add user controls to dashboard
$("#watch7-user-header").append("<div class='ytqueue-options'><div id='previous-video-btn' class='ytqueue-options-inner ytqueue-skip' title='Previous Video'>&#9665;</div><div id='toggle-auto-play-btn' class='ytqueue-options-inner' title='Toggle Auto-play'><div class='ytqueue-toggle-btn-outer'><div class='ytqueue-toggle-btn-inner'></div></div></div><div id='next-video-btn' class='ytqueue-options-inner ytqueue-skip' title='Next Video'>&#9655;</div></div>")

//Enable the extension on this page
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
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
		})
	}, 1500);
})

//Add to queue button functionality
$(".queue-btn").click(function(){
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
});

//Animate the toggle auto-play button
$('.ytqueue-toggle-btn-outer').click(function(){
	$(this).toggleClass('ytqueue-toggle-btn-outer-disabled');
	$('.ytqueue-toggle-btn-inner').toggleClass('ytqueue-toggle-btn-inner-disabled');
	if($(this).hasClass("ytqueue-toggle-btn-outer-disabled")){
		$("#toggle-auto-play-btn").attr("title", "Auto-play: Off");
	}else{
		$("#toggle-auto-play-btn").attr("title", "Auto-play: On");
	}
})

//Inject js to be able to detect when video has ended,
//so the page can be redirected to next in the queue
var injectsrc = chrome.extension.getURL('/js/playerinjection.js');
$("head").first().append("<script src='"+injectsrc+"'></script>");

//Listen for when the video is over
//When it is, remove it and then redirect to next in queue
document.addEventListener('videoFinished', function (e)
{
  	var video_done = e.detail;
  	chrome.storage.sync.get(['video_queue'],function(items){
		var videos = items.video_queue;
		if(videos.length === 0){
			return;
		}else{
			var next_video = videos[0].url;
			videos.splice(0,1);
			chrome.storage.sync.set({'video_queue':videos});
			$("head").first().append("<script>location.replace('" + next_video + "');</script>");
		}
	});
});