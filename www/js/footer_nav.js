$(document).ready(function(){
	$(".footer_me").click(function() {
		$.mobile.changePage("#page_mystatistics", {
			transition : "none"
		});
	});

	$(".footer_overview").click(function() {
		$.mobile.changePage("#page_overview", {
			transition : "none"
		});
	});

	$(".footer_friends").click(function() {
		$.mobile.changePage("#page_my_friends", {
			transition : "none"
		});

	});

	$(".footer_settings").click(function() {
		$.mobile.changePage("#page_settings", {
			transition : "none"
		});

	});
});