$(document).ready(function(){

	$(".back_icon").click(function() {
		console.log(".back_icon");
		window.history.go(-1);
	});

	// Setting steps-to-go to 4 if register NewUser
	$("#nav_register1a").click(function() {
		$(".portrait").show();
		$("#deleteImage").show();
		$("#stepstogo").empty().append("4");
	});

	//Setting steps-to-go to 3 if register NewOrganisation
	$("#nav_register1b").click(function() {
		$(".portrait").hide();
		$("#deleteImage").hide();
		$("#stepstogo").empty().append("3");
	});

	// The inputfield in focus gets a blue border-bottom
	$(".input_underscored").focus(function() {
		// .. but not if at loginpage
		if ($.mobile.activePage.attr('id') == "page_login")
			return;
		$(this).css("border-bottom", "thin solid #006dfe");
	});

	// If the inputfield is empty after having had focus -> gets a red border-bottom
	// else, it gets a black border-bottom
	$(".input_underscored").blur(function() {
		
		// .. but not if at loginpage
		if ($.mobile.activePage.attr('id') == "page_login")
			return;

		var text = $(this).val();
		if (text == "" || text.indexOf("'")!=-1) {
			$(this).css("border-bottom", "thin solid #f63218");
		} else	{
			$(this).css("border-bottom", "thin solid #000")
		};

	});

	// Checking database for existing userID (email)
	$(document).on("blur","input[name='reg_user_email']",function(){
		var patt = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
		var emailTest = $("input[name='reg_user_email']").val();

		if(emailTest.indexOf("'")!=-1){
			return;
		}

		var sql = "select count(*) as numEmail from user where email like '"+$("input[name='reg_user_email']").val()+"'";
		
		url = getURLappBackend();

		$.ajax({
			type:"post",
			url:url,
			dataType:"json",
			data: {"getSQL":sql},
			success: function(response){
				//console.log("success: "+response[0].numEmail);
				if(response[0].numEmail != 0 || !patt.test(emailTest)){
					$("input[name='reg_user_email']").css("border-bottom", "thin solid #f63218");
					var error_message = response[0].numEmail != 0 ? "Eposten er allerede registrert:":"Ugyldig epost-adresse:";
					$("#email_error_message").html(error_message);
					localStorage.setItem("reg_user_email_ok","false");
				}

				else{
					$("input[name='reg_user_email']").css("border-bottom", "thin solid #000");
					localStorage.setItem("reg_user_email_ok","true");
					$("#email_error_message").html("");
				}
			}
		});

	});

});

// Pressing enter in one of the login-input-fields attempts to login
$(document).on("pageinit","#page_login",function(){
	$("#username, #password").keyup(function(e){
		if(e.keyCode==13){
			// Enter is pressed
			$("#btnLogin").click();			
		}
	});
});

//Goes to register NewUser and activating the correct tab
function toRegister1() {
	$.mobile.changePage("#page_register1", {
		transition : "slide"
	});
	$("#stepstogo").html("4");
	$("#tabs" ).tabs( "option", "active", 0 );
	$("#nav_register1b").removeClass("ui-btn-active");
	$("#nav_register1a").addClass("ui-btn-active");
	
}

// Goes to register NewOrganisation and activating the correct tab
function toRegister1b() {
	$.mobile.changePage("#page_register1", {
		transition : "slide"
	});
	$("#stepstogo").html("3");
	// Activate the Org panel
	$( "#tabs" ).tabs( "option", "active", 1 );
	$("#nav_register1a").removeClass("ui-btn-active");
	$("#nav_register1b").addClass("ui-btn-active");
}


// Visual spinner when loading new page
$(document).on(	"click", ".show-page-loading-msg", function() {
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

// Hiding footer when typing (for phones)
$(document).on("focus", "input", function() {
	$.mobile.activePage.find("footer").hide();
});

// Show footer when finished typing
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

// Saving User-data and moving to Register-page 2
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

//Saving Organisation-data and moving to Register-page 2
function toRegister2b() {
	orgdata.owner = $("#in_org_owner").val();
	orgdata.orgname = $("#in_org_name").val();
	orgdata.email = $("#in_org_email").val();

	$.mobile.changePage("#page_register2b", {
		transition : "slide"
	});
};

// When choosing a amount from radiobutton, the custom input resets to "" and unfocusing it
function blurDeleteCustomInput(){
	$("#in_custom_amount").val("");
	$("#in_custom_amount").blur();
	$("#in_custom_amount").css("border-bottom", "thin solid #d2d2d2");
}

// Unchecking radiobuttons with nametag 'in_donate_amount' (when custom amount has focus)
function uncheckRadiobuttonsDonate() {
	$("input[name='in_donate_amount']").attr("checked", false).checkboxradio("refresh");
}

// Unchecking all radio buttons
function uncheckRadiobuttons() {
	$("input[type='radio']").attr("checked", false).checkboxradio("refresh");
}

// Stores donation-amount and continue to register-page 3
function toRegister3() {
	var radio_val;
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
/*
	$("#reg_summary_name").append(data.fullname);
	$("#reg_summary_phone").append(data.phone);
	$("#reg_summary_email").append(data.email);
	$("#reg_summary_monthly_amount").append(data.monthly_amount + " kr.");
	$("#reg_summary_visanr").append(data.cardnr);
*/	

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
	$.mobile.changePage("#page_login",{"transition":"flip"});
}

function back(){
	$.mobile.changePage("#page_register2");
}

