$(".video-list-item .related-item-dismissable .content-wrapper").append("<div class='queue-btn'>+</div>");

chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

var port = chrome.runtime.connect({name: "video_management"});

$(".queue-btn").click(function(){
	var video_index = $(this).parent().parent().parent().index();
	var title = $(this).siblings('.content-link').children('.title').text();
	var vid_url = $(this).siblings('.content-link').attr('href');
	var publisher = $(this).siblings('.content-link').children('.attribution').children('.g-hovercard').text();
	var thumbnail = $(this).parent().siblings('.thumb-wrapper').children('.thumb-link').children('.yt-uix-simple-thumb-wrap').children('img').attr('src');
	var views = $(this).siblings('.content-link').children('.view-count').text();
	port.postMessage({
		"video_info": {
			"title": title,
			"publisher": publisher,
			"thumbnail": thumbnail,
			"url": vid_url,
			"views": views
		}
	});
	$(this).animate({
		"width":"+=10px"
	}).animate({
		"width":"-=10px"
	});
});

var injectsrc = chrome.extension.getURL('/js/playerinjection.js');
$("head").first().append("<script src='"+injectsrc+"'></script>");

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