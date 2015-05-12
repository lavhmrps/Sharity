$(document).ready(function(){
	$(".footer_me").click(function() {
		$.mobile.changePage("#page_mystatistics", {
			transition : "fade"
		});
	});

	$(".footer_overview").click(function() {
		$.mobile.changePage("#page_overview", {
			transition : "fade"
		});
	});

	$(".footer_friends").click(function() {
		$.mobile.changePage("#page_my_friends", {
			transition : "fade"
		});

	});

	$(".footer_settings").click(function() {
		$.mobile.changePage("#page_settings", {
			transition : "fade"
		});

	});
});