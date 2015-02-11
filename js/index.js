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

	alert("Navn: " + name + "\nTelefon: " + phone + "\nEpost: " + email
			+ "\nPassord: " + password + "\nPassord_rep: " + password_rep
			+ "\nKortnr: " + visa_number + "\nUtlopsar: " + visa_expire_year
			+ "\nUtlopsmaned: " + visa_expire_month + "\nCCV: " + visa_ccv);
}

$(document).on("click", ".navmenu_me", function() {
	alert("ME clicked");
});

$(document).on("click", ".navmenu_overview", function() {
	alert("Overview clicked ");
});

$(document).on("click", ".navmenu_friends", function() {
	alert("Friends clicked ");
});
$(document).on("click", ".navmenu_settings", function() {
	alert("Settings clicked ");
});

// Store registration-data
var data = {
	firstname : '',
	lastname : '',
	email : '',
	phone : '',
	adress : '',
	zip : '',
	monthly_amount : '',
	cardnr : '',
	expire_year : '',
	expire_month : '',
	ccv : ''
};

function toRegister2() {
	data.firstname = $("#in_firstname").val();
	data.lastname = $("#in_lastname").val();
	data.email = $("#in_email").val();
	data.phone = $("#in_phone").val();
	data.adress = $("#in_adress").val();
	data.zip = $("#in_zip").val();

	$.mobile.changePage("#page_register2", {
		transition : "slide"
	});
};

$(".radio_amount").click(function() {
	$("#in_custom_amount").val("");
	$("#in_custom_amount").blur();
});

function uncheckRadiobuttons() {
	$("input[type='radio']").attr("checked", false).checkboxradio("refresh");
}

function toRegister3() {
	var radio_val = "default";
	radio_val = $(" input[name='in_monthly_amount']:checked").val();
	var custom_val = "default2"
	custom_val = $("#in_custom_amount").val();

	if (radio_val == undefined && custom_val == ""){
		alert("Velg beløp");
		return;
	}
	else if (isNaN(custom_val)) {
		alert("Ugyldig beløp");
		return;
	} else if (radio_val == undefined)
		data.monthly_amount = custom_val;

	else
		data.monthly_amount = radio_val;

	// alert("Beløp: "+data.monthly_amount);
	$.mobile.changePage("#page_register3", {
		transition : "slide"
	});
}

function toSummary() {

	data.cardnr = $("#in_visa_number").val();
	var monthdrop = document.getElementById("in_visa_expire_month");
	data.expire_month = monthdrop.options[monthdrop.selectedIndex].value; // date
																			// of
																			// expiration

	var yeardrop = document.getElementById("in_visa_expire_year");
	data.expire_year = yeardrop.options[yeardrop.selectedIndex].value; // date
																		// of
																		// expiration
	data.ccv = $("#in_visa_ccv").val();

	$.mobile.changePage("#page_reg_summary", {
		transition : "slide"
	});
};

$(document).on("pageinit", "#page_reg_summary", function() {

	$("#reg_summary_name").append(data.firstname + " " + data.lastname);
	$("#reg_summary_email").append(data.email);
	$("#reg_summary_phone").append(data.phone);
	$("#reg_summary_address").append(data.adress);
	$("#reg_summary_zip").append(data.zip);
	$("#reg_summary_monthly_amount").append(data.monthly_amount);
	$("#reg_summary_visanr").append(data.cardnr);
	$("#reg_summary_exp_year").append(data.expire_year);
	$("#reg_summary_exp_month").append(data.expire_month);
	$("#reg_summary_ccv").append(data.ccv);

});

function reloadPage() {
	$.mobile.changePage("#page_login");
	location.reload();
}

$(".footer_me").click(function() {
	alert("me");
});
$(".footer_overview").click(function() {
	alert("overview");
});
$(".footer_friends").click(function() {
	alert("friends");
});
$(".footer_settings").click(function() {
	alert("settings");
});
