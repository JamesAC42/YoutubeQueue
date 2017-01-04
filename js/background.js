chrome.runtime.onMessage.addListener(function (msg, sender,sendResponse) {
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name === "video_management");
	port.onMessage.addListener(function(msg) {
		chrome.storage.sync.get(['video_queue'],function(items){
			var videos = items.video_queue;
			videos.push(msg.video_info);
			chrome.storage.sync.set({'video_queue':videos});
		})
  	});
});

/* JSON video format
{
	"title":"Video1 adf asdf adsf adf ",
	"publisher":"person1",
	"thumbnail":"test.jpg",
	"url":"/watch?v=ieinaoihj",
	"views":123456
}
*/    