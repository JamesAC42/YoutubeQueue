//Initialize variables
var moused;
var old_spot_queue;
var old_spot_history;

$(document).ready(function(){

	$(".action-left").mouseenter(function(){
		var inner_elem = $(this).children('.action-left-inner');
		moused = inner_elem.text();
		inner_elem.text("X").addClass('action-left-over');
	}).mouseleave(function(){
		var inner_elem = $(this).children('.action-left-inner');
		inner_elem.text(moused).removeClass('action-left-over');
	});

	$(".action-left").resizable({
		autoHide:true
	});

	$(".action-right").mouseenter(function(){
		$(this).children(".action-right-inner").addClass("action-right-inner-over");
	}).mouseleave(function(){
		$(this).children(".action-right-inner-over").removeClass("action-right-inner-over");
	});

	$("#queue-list").sortable({
		axis: "y",
		handle:".action-right-inner",
		start: function(event,ui){
			ui.item.addClass('vid-list-dragged',1000, "easeOutBounce");
			old_spot_queue = $('#' + ui.item.attr('id')).index();
		},
		update: function(event, ui){
			angular.element($('#vid-container')).scope().reSort(old_spot_queue, ui.item.attr('id'));
		}
	});
	$("#history-list").sortable({
		axis: "y",
		handle:".action-right-inner",
		start: function(event,ui){
			ui.item.addClass('vid-list-dragged',1000, "easeOutBounce");
			old_spot_history = $('#' + ui.item.attr('id')).index();
		},
		update: function(event, ui){
			angular.element($('#history-container')).scope().reSort(old_spot_history, ui.item.attr('id'));
		}
	});

	$("#history-container").slideUp();
	$("#history-header").click(function(){
		$("#history-container").slideToggle();
		$("#history-container, #vid-container").toggleClass("active-accord");
		if($("#history-container").hasClass("active-accord")){
			$("#remove-queue").css("display","none");
		}else{
			$("#remove-queue").css("display","default");
		}
	})

	$("#up-next-header, #history-header").click(function(){
		if($(this).hasClass('active-accord')){
			$(".inactive-accord").slideDown().removeClass("inactive-accord").addClass("active-accord");
			$(this).removeClass("active-accord").addClass("inactive-accord");
		}
	});

	$(".remove-all-btn").mouseenter(function(){
		$(this).animate({
			"width":"+=75px"
		},"fast").text("Remove All");
	}).mouseleave(function(){
		$(this).animate({
			"width":"-=75px"
		},"fast").text("X");
	});

	$(".menu-item").click(function(){
		if(!$(this).hasClass("menu-item-active")){
			$(".menu-item-active").removeClass("menu-item-active");
			$(this).addClass("menu-item-active");
			$(".window").toggleClass("window-inactive");
		}
	})
});