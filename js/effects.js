var moused;
var old_spot;
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
	$(".vid-list").sortable({
		axis: "y",
		handle:".action-right-inner",
		start: function(event,ui){
			old_spot = $('#' + ui.item.attr('id')).index();
		},
		update: function(event, ui){
			angular.element($('#vid-container')).scope().reSort(old_spot, ui.item.attr('id'));
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
	}).mousedown(function(){
		$(this).css("top","1.2em");
	}).mouseup(function(){
		$(this).css("top","1em");
	})
});