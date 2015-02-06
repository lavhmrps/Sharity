$(document).ready(function() {

	$(".icon").click(function() {
		// do something...
	});

});

$(document).ready(function() {

	$("#page2").click(function() {
		parent.history.back();
	});

});

function goBack() {
	window.history.go(-1);
}

function toPage2() {
	window.location.href = "page2.html";
}
function toRegister1() {
	window.location.href = "pages/register1.html";
}

$(document)
		.on(
				"click",
				".show-page-loading-msg",
				function() {
					var $this = $(this), theme = $this.jqmData("theme")
							|| $.mobile.loader.prototype.options.theme, msgText = $this
							.jqmData("msgtext")
							|| $.mobile.loader.prototype.options.text, textVisible = $this
							.jqmData("textvisible")
							|| $.mobile.loader.prototype.options.textVisible, textonly = !!$this
							.jqmData("textonly");
					html = $this.jqmData("html") || "";
					$.mobile.loading('show', {
						text : msgText,
						textVisible : textVisible,
						theme : theme,
						textonly : textonly,
						html : html
					});
				}).on("click", ".hide-page-loading-msg", function() {
			$.mobile.loading("hide");
		});

$(document).on("click", "#page2", function() {
	window.history.go(-1);
});

$(document).on("focus", "input", function() {
	$.mobile.activePage.find("footer").hide();
});

$(document).on("blur", "input", function() {
	$.mobile.activePage.find("footer").show();
});

function validate() {
	
	alert("validate()");

	var name = document.getElementById("in_name").value;
	var phone = document.getElementById("in_phone").value;
	var email = document.getElementById("in_email").value;
	var password = document.getElementById("in_password").value;
	var password_rep = document.getElementById("in_password_repeat").value;
	var visa_number = document.getElementById("in_visa_number").value;
	var visa_expire_year = document.getElementById("in_visa_expire_year").value;
	var visa_expire_month = document.getElementById("in_visa_expire_month").value;
	var visa_ccv = document.getElementById("in_visa_ccv").value;

	alert("Navn: "+name + "\nTelefon: " + phone + "\nEpost: " + email + "\nPassord: " + password + "\nPassord_rep: "
			+ password_rep +"\nKortnr: "+visa_number+"\nUtlopsar: "+visa_expire_year+"\nUtlopsmaned: "+visa_expire_month+"\nCCV: "+visa_ccv);
}

$(document).on("click",".navmenu_me", function(){
		alert("ME clicked");
	}
);

$(document).on("click",".navmenu_overview",function(){
	alert("Overview clicked ");
});

$(document).on("click",".navmenu_friends",function(){
	alert("Friends clicked ");
});
$(document).on("click",".navmenu_settings",function(){
	alert("Settings clicked ");
});






























