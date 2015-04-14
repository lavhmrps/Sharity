$(document).ready(function(){
	

	var globalData = {
		name : '',
		email : '',
		phone : '',
		picURL:'',
		monthly_amount : '0',
		visa_number : '',
		visa_expire_year : '',
		visa_expire_month : '',
		ccv : '',
		password : ''
	};
	
	$("img[name=preview]").hide();

	$('#clear').click(function(){
		var image = $("#file_background");
		image.replaceWith( image = image.clone( true ) );
	});

	$("input[name=reg_user_image]").change(function(){
		previewImage(this);
	});

	$("div[name=trigger_pick_image]").click(function(){
		$("input[name=reg_user_image]").trigger('click');
	});


	$('button[name=reg_user_personalia_done]').click(function(){
		globalData.name = $("input[name=reg_user_name]").val();
		globalData.email = $("input[name=reg_user_email]").val();
		globalData.phone = $("input[name=reg_user_phone]").val();
		var password = $("input[name=reg_user_password]").val();
		var password_repeat = $("input[name=reg_user_password_repeat]").val();

		var ok = 1;
		var emptyInput = "Mangler: ";

		if(globalData.name.trim() == ""){
			emptyInput += "Navn, ";
			ok = 0;
		}
		if(globalData.email.trim() == "" || localStorage.getItem("reg_user_email_ok")=="false"){
			emptyInput += "Email, ";
			ok = 0;
		}
		if(globalData.phone.trim() == ""){
			emptyInput += "Telefonnummer, ";
			ok = 0;
			//sjekk også om telefonnummer er 8 siffer
		}
		if(password !== password_repeat){
			emptyInput += "passord stemmer ikke, ";
			ok = 0;
		}		
		if(password.trim() == ""){
			emptyInput += "Passord1 er tomt, ";
			ok = 0;
		}
		if(password_repeat.trim() == ""){
			emptyInput +="Passord repeat er tomt";
			ok = 0;
		}

		if(ok == 0){
			alert(emptyInput);
			return false;
		}else{
			globalData.password = $("input[name=reg_user_password]").val();
		}
		
		$.mobile.changePage("#page_register2", {
			transition : "slide"
		});
	});

$('button[name=reg_user_donation_done]').click(function(){
	

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
	globalData.monthly_amount = custom_val;

	else
		globalData.monthly_amount = radio_val;
	

	$('td[name=reg_user_sumary_monthly_amount]').text(globalData.monthly_amount);

	$.mobile.changePage("#page_register3", {
		transition : "slide"
	});
});

$('button[name=reg_user_credit_card_done]').click(function(){
	localStorage['is_register_credit_card'] = 1;

	globalData.visa_number = $("input[name=reg_user_visa_number]").val();
	globalData.visa_expire_month = $('select[name=reg_user_visa_expire_month]').val();
	globalData.visa_expire_year = $('select[name=reg_user_visa_expire_year]').val();
	globalData.ccv = $('input[name=reg_user_visa_ccv]').val();

 	//sjekk at data stemmer her!!!!

 	$('td[name= reg_user_sumary_name]').text(globalData.name);
 	$('td[name= reg_user_sumary_email]').text(globalData.email);
 	$('td[name= reg_user_sumary_phone]').text(globalData.phone);

 	$('td[name=reg_user_sumary_visa_number]').text(globalData.visa_number);

 	$.mobile.changePage("#page_reg_summary", {
 		transition : "slide"
 	});
 });

$('button[name=reg_user_skip_creditcard]').click(function(){
	localStorage['is_register_credit_card'] = 0;
	$('td[name= reg_user_sumary_name]').text(globalData.name);
	$('td[name= reg_user_sumary_email]').text(globalData.email);
	$('td[name= reg_user_sumary_phone]').text(globalData.phone);


	$('td[name=reg_user_sumary_visa_number]').text("Ingen VISA lagt til");

	$.mobile.changePage("#page_reg_summary", {
		transition : "slide"
	});
});

$('button[name=reg_user_complete]').click(function(){
	insertUser();

});

function insertUser(){
	//console.log(globalData.name+"', '"+globalData.phone+"', '"+globalData.email+"','"+globalData.password);

	var sql = "INSERT INTO User (name, phone, email, password) VALUES ('"+globalData.name+"', '"+globalData.phone+"', '"+globalData.email+"','"+globalData.password+"')";
	var data = {"setSQL" : sql};
	var url = getURLappBackend();	


	$.ajax({
		type : "POST",
		url : url, 
		data : data,
		dataType : "text",
		success : function(response){
			if(response === "OK"){

				try{
					var image = $('input[name=reg_user_image]').prop('files')[0];
				}catch(error){
				}
				if(image != undefined){
					console.log("image undefined");
					insertImage(image);
				}
				//alert("USER SATT INN!  insertUser.js button[name=reg_user_complete.click]");
				if(localStorage['is_register_credit_card'] == 1){
					//alert("legger til kort");
					insertCardAndUpdateUser();
				}else if(localStorage['is_register_credit_card'] == 0){
					

					$.mobile.changePage("#page_login", {

						transition : "slide"
					});
				}
			}else{
				alert(response + ", noe gikk galt, insertUser() insertUser.js");
			}
		},
		error : function(){
			alert("Error insertUser.js insertUser()");
		}
	});	
	
}

function insertCardAndUpdateUser(){
	var sql = "INSERT INTO Card (cardnr, month, year, CCV) VALUES('"+globalData.visa_number+"', '"+globalData.visa_expire_month+"', '"+globalData.visa_expire_year+"', '"+globalData.ccv+"')";
	var url = getURLappBackend();	
	var data = {"setSQL" : sql};
	$.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : data,
		success : function(response){
			if(response === "OK"){
				updateUser();
			}else{
				alert(response + ", noe gikk galt, insertCardAndUpdateUser() insertUser.js button[name=reg_user_complete.click]");
			}
		},
		error : function(response){
			alert(response + ", error:  insertUser.js insertCardAndUpdateUser() button[name=reg_user_complete.click]");
		}
	});
}
function updateUser(){

	var sql = "UPDATE User SET cardnr = '" + globalData.visa_number + "' WHERE email = '" + globalData.email + "'";

	var url = getURLappBackend();

	$.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : {"setSQL" : sql},
		success : function(response){
			if(response == "OK"){
				//clearInput()
				$.mobile.changePage("#page_login", {
					transition : "slide"
				});

			}
		}
	});
}


function previewImage(input) {
	if (input.files && input.files[0]) {
		var fileReader = new FileReader();

		fileReader.onload = function (e) {
			$('img[name=preview]').attr('src', e.target.result);
			$("img[name=preview]").show();
		}

		fileReader.readAsDataURL(input.files[0]);
	}
}

function insertImage(image){	


	var urlLocalstorage = getURLphpBackendlocalStorageJStoPHP();
	$.ajax({
		type : "POST",
		url : urlLocalstorage,
		dataType : "text",
		data : {"userEmailToInsertImage" : globalData.email},
		success : function(response){
			if(response != "OK"){
				alert("insertUser.js insertImage: " + response);
			}
		},
		error : function(response){
			alert("insertUser.js : insertImage() : ajax request error: "  +  response.message);
		}
	});
	

	var urlInsertImage = getURLappBackendInsertImageUser();
	
	var form_data_image = new FormData();
	form_data_image.append('image', image);
	$.ajax({
		url: urlInsertImage, // point to server-side PHP script
		datatype: 'text', // what to expect back from the PHP script, if anything
		cache: false,
		contentType: false,
		processData: false,
		data: form_data_image,
		type: 'POST',
		success: function(response){
			if(response == "OK"){

			}else{
				alert("insertUser.js insertImage: " + response);
			}
			
		},
		error : function(response){
			alert(" insertProject.js : insertBackground ajax request ERROR: " + response);
			console.log(response.message);
		}
	});
}

});
