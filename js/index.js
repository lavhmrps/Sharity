$(document).ready(function() {
	$(".dots").dotdotdot();
});

$(".back_icon").click(function() {
	window.history.go(-1);
});

function toRegister1() {
	$.mobile.changePage("#page_register1", {
		transition : "slide"
	});
	$("#stepstogo").empty().append("4");
}

$("#nav_register1a").click(function() {
	$(".portrait").show();
	$("#stepstogo").empty().append("4");
});

$("#nav_register1b").click(function() {
	$(".portrait").hide();
	$("#stepstogo").empty().append("3");
});

// The inputfield in focus gets a blue border-bottom
$(".input_underscored").focus(function() {
	// .. but not if at loginpage
	if ($.mobile.activePage.attr('id') == "page_login")
		return;
	$(this).css("border-bottom", "thin solid #006dfe");
});

// If the imputfield is empty after having had focus -> gets a red border-bottom
// else, it gets a black border-bottom
$(".input_underscored").blur(function() {
	// .. but not if at loginpage
	if ($.mobile.activePage.attr('id') == "page_login")
		return;

	var text = $(this).val();
	if (text == "") {
		$(this).css("border-bottom", "thin solid #f63218");
	} else
		$(this).css("border-bottom", "thin solid #000");

});

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


// Store registration-data
var data = {
	fullname : '',
	firstname : '',
	lastname : '',
	email : '',
	phone : '',
	adress : '',
	zip : '',
	monthly_amount : '0',
	cardnr : '',
	expire_year : '',
	expire_month : '',
	ccv : ''
};

// store Organisation-data
var orgdata = {
	owner : '',
	orgname : '',
	email : '',
	category : '',
	orginfo : '',
	website : '',
	orgnr : ''
};

function toRegister2() {
	data.fullname = $("#in_fullname").val();
	data.firstname = $("#in_firstname").val();
	data.lastname = $("#in_lastname").val();
	data.email = $("#in_email").val();
	data.phone = $("#in_phone").val();

	$.mobile.changePage("#page_register2", {
		transition : "slide"
	});
};

function toRegister2b() {
	orgdata.owner = $("#in_org_owner").val();
	orgdata.orgname = $("#in_org_name").val();
	orgdata.email = $("#in_org_email").val();

	$.mobile.changePage("#page_register2b", {
		transition : "slide"
	});
};

$(".radio_amount").click(function() {
	$("#in_custom_amount").val("");
	$("#in_custom_amount").blur();
	$("#in_custom_amount").css("border-bottom", "thin solid #d2d2d2");
});

function uncheckRadiobuttonsDonate() {
	$("input[name='in_donate_amount']").attr("checked", false).checkboxradio("refresh");
}

function uncheckRadiobuttons() {
	$("input[type='radio']").attr("checked", false).checkboxradio("refresh");
}

function toRegister3() {
	var radio_val = "default";
	radio_val = $(" input[name='in_monthly_amount']:checked").val();
	var custom_val = "default2"
	custom_val = $("#in_custom_amount").val();

	if (radio_val == undefined && custom_val == "") {
		alert("Velg beløp");
		return;
	} else if (isNaN(custom_val)) {
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

function toSummaryB() {
	orgdata.category = $("#in_org_category").val();
	orgdata.orginfo = $("#in_org_about").val();
	orgdata.website = $("#in_org_website").val();
	orgdata.orgnr = $("#in_org_nr").val();

	$.mobile.changePage("#page_reg_summaryB", {
		transition : "slide"
	});

	// var output = orgdata.owner + "\n" + orgdata.orgname + "\n" +
	// orgdata.email
	// + "\n" + orgdata.category + "\n" + orgdata.orginfo + "\n"
	// + orgdata.website + "\n" + orgdata.orgnr;
	// alert(output);

}
enableSubmit = function enableSubmit(val) {
	var sbmt = document.getElementById("register_user");
	var org_sbmt = document.getElementById("register_org");

	if (val.checked == true) {
		sbmt.disabled = false;
		org_sbmt.disabled = false;
	} else {
		sbmt.disabled = true;
		org_sbmt.disabled = true;
	}
}

$(document).on("pageinit", "#page_reg_summary", function() {

	var val = document.getElementById("cb_accept_user_conditions");
	var sbmt = document.getElementById("register_user");

	if (val.checked == true) {
		sbmt.disabled = false;
	} else {
		sbmt.disabled = true;
	}

	$("#reg_summary_name").append(data.fullname);
	$("#reg_summary_phone").append(data.phone);
	$("#reg_summary_email").append(data.email);
	$("#reg_summary_monthly_amount").append(data.monthly_amount + " kr.");
	$("#reg_summary_visanr").append(data.cardnr);

});

$(document).on("pageinit", "#page_reg_summaryB", function() {
	
	var val = document.getElementById("cb_accept_conditions");
	var org_sbmt = document.getElementById("register_org");

	if (val.checked == true) {
		org_sbmt.disabled = false;
	} else {
		org_sbmt.disabled = true;
	}

	$("#org_summary_owner").append(orgdata.owner);
	$("#org_summary_orgname").append("sharityapp.no/" + orgdata.orgname);
	$("#org_summary_email").append(orgdata.email);
	$("#org_summary_category").append(orgdata.category);
	$("#org_summary_org_about").append("Beskrivelse: " + orgdata.orginfo);
	$("#org_summary_website").append(orgdata.website);
	$("#org_summary_orgnr").append(orgdata.orgnr);

});

function reloadPage() {
	$.mobile.changePage("#page_login");
	location.reload();
}