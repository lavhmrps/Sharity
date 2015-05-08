$(document).on("pagebeforeshow","#page_settings",function(){
	$("#div_persondata").hide();
	$("#div_manage_cards").hide();
	$("#btn_delete_card").hide();
	resetIconArrow($("#btn_settings_persondata"));	
	resetIconArrow($("#btn_settings_manage_cards"));
	$("#img_pw_change").attr("src","../img/li_arrow_d_grey.png");
	$(".tr_pw_change").hide();
	getPersonData();
	getCardsData();
/*
	$("#set_month").blur(function(){
		if($(this).val()==0)
			$(this).css("border-bottom","#f63218");
	});
	$("#set_year").blur(function(){
		if($(this).val()==0)
			$(this).css("border-bottom","#f63218");
	});
*/
});

$(document).on("pageinit","#page_settings",function(){

	$("button[name=logout]").click(function(){
		localStorage.clear();
		window.location.replace("../index.html");
	});

	$(document).on('click', 'button[name=accept_request]', function() {
		var from_user = $(this).closest("li").attr("id");
		var name = $(this).closest("li").find(".name").html();
		acceptFriendRequest(from_user,name);
	});
	$(document).on('click', 'button[name=deny_request]', function() {
		var from_user = $(this).closest("li").attr("id");
		var name = $(this).closest("li").find(".name").html();
		denyFriendRequest(from_user,name);
	});

	populateYearOfBirthSelect();

	/* Persondata events */

	// Opens div for editing persondata, hiding card-settings divs if they are visible 
	$("#btn_settings_persondata").click(function(){
		var btn = $(this);
		if($("#div_manage_cards").is(":visible")){
			$("#div_manage_cards").toggle("fast",function(){
				changeIconArrow($("#btn_settings_manage_cards"));
			});
			$("#div_persondata").delay("fast").toggle("fast",function(){
				changeIconArrow(btn);
			});
		}
		else{
			$("#div_persondata").toggle("fast",function(){
				changeIconArrow(btn);
			});
		}
	});
	
	// Shows/hides the change-password inputfields
	$("#btn_change_pw").click(function(){
		$(".tr_pw_change").toggle("fast");

		if($("#img_pw_change").attr("src")=="../img/li_arrow_d_grey.png"){
			// Showing password-fields
			$("#img_pw_change").attr("src","../img/li_arrow_u_grey.png");
		}
		else if($("#img_pw_change").attr("src")=="../img/li_arrow_u_grey.png"){
			// Hiding password-fields
			$("#img_pw_change").attr("src","../img/li_arrow_d_grey.png");
			$(".tr_pw_field").val("");
		}
	});

	// Closing persondata-div and resets fields to their old values
	$("#btn_settings_cancel").click(function(){
		var btn = $("#btn_settings_persondata");
		$("#set_name").val(localStorage.getItem("userName")) ;
		$("#set_phone").val(localStorage.getItem("userPhone")) ;
		$("#set_zip").val(localStorage.getItem("userZip"));
		$("#set_birthyear").val(localStorage.getItem("userBirthYear"));

		$("#div_persondata").toggle("fast",function(){
				changeIconArrow(btn);
			});
		var message="Ingen endringer";
		showMessage(message);

		resetPwFields();
	});

	// Saving new data
	$("#btn_settings_save").click(function(){
		var name = $("#set_name").val().trim();
		var phone = $("#set_phone").val().trim();
		var zip = $("#set_zip").val().trim();
		var birthyear = $("#set_birthyear").val();

		if(name ==""){
			alert("Navn kan ikke stå tomt");
			return;
		}

		if( name.indexOf("'") != -1|| phone.indexOf("'") != -1|| zip.indexOf("'") != -1){
			alert("Ugyldig tegn i navn (')");
			return;
		}

		if($("#tr_pw_change").is(":visible")){
			// Updating password and persondata
			var old_pw = $("#old_pw").val().trim();
			var new_pw = $("#new_pw").val().trim();
			var new_pw_rep = $("#new_pw_rep").val().trim();

			if(new_pw!=new_pw_rep){
				alert("Passordene i 'Nytt passord' og 'Gjenta nytt passord' stemmer ikke overens" );
				return;
			}
			if (new_pw.indexOf("'") != -1){
				alert("Ugyldig tegn i passord (')");
				return;
			}

			var userID = localStorage.getItem("userID");
			var sql = "select password from user where email like'"+userID+"'";
			var url = getURLappBackend();
			var data = {"getSQL":sql};

			$.ajax({
				type:"POST",
				url: url, 
				data: data,
				dataType: "json",
				success:function(response){
					if( response[0].password == old_pw)
					{
						sql = "update user set password = '"+new_pw+"' where email like '"+userID+"'";
						data = {"setSQL":sql};
						// Setting new password
						$.ajax({
							type:"POST",
							url: url, 
							data: data,
							dataType: "text",
							success:function(response){
								if(response == "OK"){
									alert("Passordet ble endret");

									var sql ="update user set name='"+name+"',phone='"+phone+"',zip='"+zip+"' ,birthyear='"+birthyear+"' where email like '"+localStorage.getItem("userID")+"'" ;
									var url = getURLappBackend();
									// Updating personinfo
									$.ajax({
										type: "POST",
										url : url, 
										data: {"setSQL":sql},
										dataType: "text",
										success : function(response){
											console.log("update persondata: "+response	);
											localStorage.setItem("userName",name);
											localStorage.setItem("userPhone",phone);
											localStorage.setItem("userZip",(zip==null)?"":zip);
											localStorage.setItem("userBirthYear",birthyear);
											$("#div_persondata").toggle("fast",function(){
												changeIconArrow( $("#btn_settings_persondata"));
											});
											var message="Lagret";
											showMessage(message);
											//$("#messagetext").html(message).css("padding","3pt");
											//$("#messagetext").fadeIn().delay(3000).fadeOut();
										}
									});
								}else
									alert("Kunne ikke endre passordet");
							}
						});


					}else{
						alert("Du oppga feil passord");
					}

				}

			});
		} else{
			// Update only persondata, not password
			var sql ="update user set name='"+name+"',phone='"+phone+"',zip='"+zip+"',birthyear='"+birthyear+"' where email like '"+localStorage.getItem("userID")+"'" ;
			console.log(sql);
			var url = getURLappBackend();
			$.ajax({
				type: "POST",
				url : url, 
				data: {"setSQL":sql},
				dataType: "text",
				success : function(response){
					console.log("update persondata: "+response	);
					localStorage.setItem("userName",name);
					localStorage.setItem("userPhone",phone);
					localStorage.setItem("userZip",(zip==null)?"":zip);
					localStorage.setItem("userBirthYear",birthyear);
					$("#div_persondata").toggle("fast",function(){
						changeIconArrow( $("#btn_settings_persondata"));
					});

					var message="Lagret";
					showMessage(message);
				}
			});
		}

	});


	/* Card-settings events */

	$("#btn_settings_manage_cards").click(function(){
		var btn = $(this);
		if($("#div_persondata").is(":visible")){
			$("#div_persondata").toggle("fast",function(){
				changeIconArrow($("#btn_settings_persondata"));
			});
			$("#div_manage_cards").delay("fast").toggle("fast",function(){
				changeIconArrow(btn);
			});
		}else{
			$("#div_manage_cards").toggle("fast",function(){
				changeIconArrow(btn);
			});
		}

	});

	$("#set_cardnr").on("keyup",function(e){
		var realVal = $("#set_cardnr").val().replace(/ /g,'');
		var val = $("#set_cardnr").val()
		//if(realVal.length > 0 && realVal.length % 4 == 0 &&  realVal.length !=16 && e.which != 8 && ((e.which >= 48 && e.which < 57)||(e.which >= 96 && e.which < 106))){
		if(realVal.length > 0 && realVal.length % 4 == 0 &&  realVal.length !=16 && e.which != 8 && !isNaN(parseInt(String.fromCharCode(e.which)))){
			$("#set_cardnr").val(val +" ");
		}	
	});

/*
	$("#dd_cards").val($("#dd_cards").val()==0?0:1);
	$("#set_cardnr").val("");
	$("#set_CCV").val("");
	$("#set_month").val(0);
	$("#set_year").val(0);
	$("#set_cardname").val("");
	$("#set_charge").val("");
	$("#cbMonthlyCharge").prop("checked",false);
	$("#set_cardnr").prop("disabled",false).css({"opacity":"1","border-bottom":"thin solid #d2d2d2"});

*/
	
	$("#dd_cards").change(function(){
		var cardnr = $(this).val();
		if(cardnr == 0){
			// cardnr 0 == choose card
			resetCardInputs();
			$("#set_cardnr, #set_CCV, #set_month, #set_year, #set_cardname, #set_charge, #cbMonthlyCharge").prop("disabled",true).css({"opacity":"0.6","background":"#eee"});
			return;
		}

		// Unlocking inputfields
		$("#set_cardnr, #set_CCV, #set_month, #set_year, #set_cardname, #set_charge, #cbMonthlyCharge").prop("disabled",false).css({"opacity":"1","background":"inherit"});
		if(cardnr == 1){
			// cardnr 1 == new card
			resetCardInputs();
			return;
		}
		
		// User has chosen an existing card to review/edit
		$("#btn_delete_card").show();

		var sql ="select * from card where cardnr="+cardnr ;
		var url = getURLappBackend();
		$.ajax({
			type: "POST",
			url : url, 
			data: {"getSQL":sql},
			dataType: "json",
			success : function(response){
				$("#set_cardnr").val(cardnr);
				$("#set_CCV").val(response[0].CCV);
				$("#set_month").val(response[0].month);
				$("#set_year").val(response[0].year);
				$("#set_cardname").val(response[0].cardname);
				$("#cbMonthlyCharge").prop("checked",response[0].monthly_charge!=null)
				$("#set_charge").val(response[0].monthly_charge);
			}
		});
		$("#set_cardnr").prop("disabled",true).css({"opacity":"0.6","border-bottom":"thin solid #000"});


	});

	$("#btn_delete_card").click(function(){
		if(confirm("Slette kort?") == true){
			deleteCard($("#dd_cards").val());
		}else{
			return;
		}
	});

	$("#cbMonthlyCharge").change(function(){
		if($(this).prop("checked") == false){
			$("#set_charge").val("").css("border-bottom","thin solid black");
		}else if($("#set_charge").val() == ""){
			$("#set_charge").css("border-bottom","thin solid #f63218");	
		}
	});
	
	$("#set_charge").change(function(){
		if($(this).val()!=""){
			$("#cbMonthlyCharge").prop("checked",true);
		}
		else{
			$("#cbMonthlyCharge").prop("checked",false);
			$(this).css("border-bottom","thin solid black");
		}
	});


	// Closing window, making no changes to any card
	$("#btn_cardsettings_cancel").click(function(){
		var btn =  $("#btn_settings_manage_cards");
		resetCardInputs();
		$("#div_manage_cards").toggle("fast",function(){
				changeIconArrow(btn);
			});
		var message="Ingen endringer";
		showMessage(message);
	});

	// Save / create creditcard
	$("#btn_cardsettings_save").click(function(){
		var cardnr = $("#set_cardnr").val().replace(/ /g,''); // removing whitespaces
		var ccv = $("#set_CCV").val().trim();
		var month = $("#set_month").val().trim();
		var year = $("#set_year").val().trim();
		var cardname = $("#set_cardname").val().trim();
		var cb_monthly_charge = $("#cbMonthlyCharge").prop("checked");
		var monthly_charge = $("#set_charge").val().trim();

		if(cardnr =="" || ccv ==""|| month ==0|| year ==0|| cardname ==""){
			alert("Feil: tomme felter");
			return;
		}if(cb_monthly_charge && monthly_charge ==""){
			alert("Velg beløp eller huk av 'månedlig beløp'"+cb_monthly_charge);
			return;
		}

		if(monthly_charge < 0){
			alert("Ugyldig negativt beløp");
			return;
		}

		if(ccv < 0 || cardnr < 0){
			alert("Ugyldig negative tall");
			return;
		}

		if(isNaN(cardnr) || isNaN(ccv)|| isNaN(monthly_charge)){
			alert("Sørg for å kun ha tall på kortnummer, ccv og beløp");
			return;
		}

		if( cardname.indexOf("'") != -1){
			alert("Ugyldig tegn i korteier (')");
			return;
		}

		if(!checkCardInfo()){
			alert("Feil på kort");
			return;
		}

		var addingNewCard = $("#dd_cards").val() == 1;

		if(addingNewCard){
			var sql = "insert into card (cardnr,month,year,CCV,cardname,monthly_charge,userID) "
				+"values ("+cardnr+","+month+","+year+","+ccv+",'"+cardname+"',"+(cb_monthly_charge?monthly_charge:null)+",'"+localStorage.getItem("userID")+"') ";
			console.log(sql);
		}
		else{
			// updating an old card
			var sql = "update card set cardnr='"+cardnr+"',CCV="+ccv+",month="+month+",year="+year+",cardname='"
					+cardname+"',monthly_charge="+(cb_monthly_charge?monthly_charge:null)+" where cardnr ="+$("#dd_cards").val() ;
		}
		console.log(sql);
		var url = getURLappBackend();
		$.ajax({
			type: "POST",
			url : url, 
			data: {"setSQL":sql},
			dataType: "text",
			success : function(response){

				console.log((addingNewCard?"insert: ":"update: ")+response);
				if(response=="OK"){
					resetCardInputs();
					getCardsData();
					$("#div_manage_cards").toggle("fast",function(){
						var btn = $("#btn_settings_manage_cards");
						changeIconArrow(btn);
					});
					var message="Kortinfo lagret";
					showMessage(message);
				}
			}
		});
	});

});

// Making a list of active friend-requests
function checkFriendRequests(){
	var url = getURLappBackend();
	var data = {"getSQL" : "SELECT fr.*,u.* FROM friend_request as fr join user as u on fr.from_user = u.email and fr.to_user = '"+localStorage.getItem("userID")+"'"};

	$.ajax({
		type: "POST",
		url : url, 
		data: data,
		dataType: "json",
		success : function(response){
			var numRequests = response.length;
			showFriendsNotif(numRequests);
			$("#num_friend_req").html("Du har <span class='red'>" + (numRequests==0?"ingen":numRequests) + "</span> venneforespørs"+(numRequests==1?"el":"ler"));

			if ($.mobile.activePage.attr('id') != "page_settings")
				return;
			var friend_requests = "";
			for(var i = 0; i < response.length; i++){
				friend_requests +=	
					"<li id='"+response[i].from_user+"'>"
					+"<div class='li_container'>"
						+"<div class='li_l'>"
				    		+"<div class='circlegrey'>"
						    	+(response[i].picURL == null? '':"<img src='"+response[i].picURL+"'/>")
							+"</div>"
						+"</div>" 
						+"<div class='li_r'>"
							+"<div class='li_r_top'>"
						    	+"<span class='name'>"+response[i].name+"</span>"
						    +"</div>"
							+"<div class='li_r_bottom'>"
							  	+"<button class='small confirm' name=accept_request>BEKREFT</button>"
							  	+"<button class='small grey dismiss' name=deny_request>AVSLÅ</button>"
							+"</div>"
						+"</div>"
					+"</div>"
				+"</li>";
			}
			$('ul[name=friend_requests]').html(friend_requests);

		},
		error : function(){
			alert("File: settings.js, trying to get friend_requests from getSQL appBackend from server, bad request, error");
		}
	});
}

function acceptFriendRequest(from_user,name){
	var url = getURLappBackend();
	var my_email = localStorage['userID'];
	var data = {"setSQL" : "INSERT INTO friend (userEmail, friendEmail) VALUES ('"+my_email+"', '"+from_user+"')"};

	$.ajax({
		type:"POST",
		url: url, 
		data: data,
		dataType: "text",
		success : function(response){
			//alert("File: settings.js : trying to accept friend request, response from SQL : " + response);
			if(response == "OK"){
				var data = {"setSQL" : "DELETE FROM friend_request WHERE from_user = '"+from_user+"' AND to_user ='"+my_email+"'"};
				$.ajax({
					type: "post",
					url : url,
					data : data,
					dataType : "text",
					success : function(response){
						checkFriendRequests();
					}
				});
			}
		}
	});

	var message="Du ble venn med "+name;
	showMessage(message);
}

function denyFriendRequest(from_user,name){
	var url = getURLappBackend();
	var my_email = localStorage['userID'];
	var sql ="DELETE FROM friend_request WHERE from_user = '"+from_user+"' AND to_user ='"+my_email+"'"
	$.ajax({
		type:"POST",
		url: url, 
		data: {"setSQL":sql},
		dataType: "text",
		success : function(response){
			console.log(response);
			checkFriendRequests();
		}
	});

	var message="Du avslo "+name+" sin venneforespørsel.";
	showMessage(message);
}

// Fetch userdata from database and write to inputfields
function getPersonData(){
	var sql = "select * from user where email like '"+localStorage.getItem("userID")+"'";
	var url = getURLappBackend();

	$.ajax({
		type:"POST",
		url: url, 
		data: {"getSQL":sql},
		dataType: "json",
		success:function(response){
			var name = response[0].name;
			var phone = response[0].phone;
			var zip = response[0].zip;
			var birthyear = response[0].birthyear;
			$("#set_name").val(name) ;
			$("#set_phone").val(phone);
			$("#set_zip").val(zip);
			$("#set_birthyear").val(birthyear);
			localStorage.setItem("userName",name);
			localStorage.setItem("userPhone",phone);
			localStorage.setItem("userZip",(zip==null)?"":zip);
			localStorage.setItem("userBirthYear",birthyear);
		}

	});

}

// Fetch carddata from database and write to inputfields
function getCardsData(){
	var sql = "select * from card where userID like '"+localStorage.getItem("userID")+"'";
	var url = getURLappBackend();

	$.ajax({
		type:"POST",
		url: url, 
		data: {"getSQL":sql},
		dataType: "json",
		success:function(response){
			var ddCardHTML = "<option value='0'>Velg kort</option><option value='1'>Nytt kort</option>";
			for(var i=0; i<response.length;i++){
				// response[i].cardname+", "+response[i].cardnr+", "+response[i].month+", "+response[i].year+", "+response[i].CCV+", "+response[i].monthly_charge+"\n";
				ddCardHTML += "<option value='"+response[i].cardnr+"' id='"+response[i].CCV+"''>**** **** **** "+response[i].cardnr.substring(12)+"</option>";
			}
			$("#dd_cards").html(ddCardHTML);
		}

	});
}


function resetCardInputs(){
	$("#dd_cards").val($("#dd_cards").val()==0?0:1);
	$("#set_cardnr").val("");
	$("#set_CCV").val("");
	$("#set_month").val(0);
	$("#set_year").val(0);
	$("#set_cardname").val("");
	$("#set_charge").val("");
	$("#cbMonthlyCharge").prop("checked",false);
	$("#set_cardnr").prop("disabled",false).css({"opacity":"1","border-bottom":"thin solid #d2d2d2"});
	$("#btn_delete_card").hide();

}

function resetPwFields(){
	$("#old_pw").val("");
	$("#new_pw").val("");
	$("#new_pw_rep").val("");
	$(".tr_pw_change").hide();
	$("#img_pw_change").attr("src","../img/li_arrow_d_grey.png");

}

// Check with bank to verify cardinfo
function checkCardInfo(){
	return true;
}

// Switching arrowicons depending on state of its div's visibility
function changeIconArrow(elem){
	if(elem.hasClass("icon-arrow-up")){
		elem.removeClass("icon-arrow-up").addClass("icon-arrow-down");
	}
	else if(elem.hasClass("icon-arrow-down")){
		elem.removeClass("icon-arrow-down").addClass("icon-arrow-up");
	}
}

function resetIconArrow(elem){
	elem.removeClass("icon-arrow-up").addClass("icon-arrow-down");
}

// Checking password and updating if its correct
function verifyAndUpdatePassword(old_pw, new_pw){

	var userID = localStorage.getItem("userID");
	var sql = "select password from user where email like'"+userID+"'";
	var url = getURLappBackend();
	var data = {"getSQL":sql};

	$.ajax({
		type:"POST",
		url: url, 
		data: data,
		dataType: "json",
		success:function(response){
			if( response[0].password == old_pw)
			{
				sql = "update user set password = '"+new_pw+"' where email like '"+userID+"'";
				data = {"setSQL":sql};
				$.ajax({
					type:"POST",
					url: url, 
					data: data,
					dataType: "text",
					success:function(response){
						if(response == "OK")
							alert("Passordet ble endret");
						else
							alert("Kunne ikke endre passordet");
					}
				});
			}else{
				alert("Du oppga feil passord");
			}
		}
	});
	return false;
}

function deleteCard(cardnr){
	//alert("sletter kort");
	var sql ="delete from card where cardnr="+cardnr ;
	var url = getURLappBackend();
	$.ajax({
		type: "POST",
		url : url, 
		data: {"setSQL":sql},
		dataType: "text",
		success : function(response){
			console.log("delete card: "+response);
			if(response=="OK"){
				var message="Kort slettet";
				showMessage(message);
				//$("#messagetext1").html(message).css("padding","3pt");
				//$("#messagetext1").fadeIn().delay(3000).fadeOut();
				getCardsData();
				resetCardInputs();
			}
		}
	});

}
/*
// code snippet from http://www.peterbe.com/plog/cc-formatter for formatting creditcard-input
function cc_format(value) {
		var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
		var matches = v.match(/\d{4,16}/g);
		var match = matches && matches[0] || ''
		var parts = []
		for (i=0, len=match.length; i<len; i+=4) {
			parts.push(match.substring(i, i+4))
		}
		if (parts.length) {
			return parts.join(' ')
		} else {
			return value
		}
	}

onload = function() {
	document.getElementById('set_cardnr').oninput = function() {
		this.value = cc_format(this.value)
	}
}
*/

function isNumber(n) {
    n = (n) ? n : window.event;
    var charCode = (n.which) ? n.which : n.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function populateYearOfBirthSelect(){
	var select = $("#set_birthyear");
	var selectHTML  = '<option value="0000">Fødselsår</option>';
	for (var i=new Date().getFullYear(); i > (new Date().getFullYear()-100);i--){
		selectHTML+='<option value='+i+'>'+i+'</option>';
	}
	select.html(selectHTML);
}