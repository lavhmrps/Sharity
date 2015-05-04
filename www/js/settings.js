$(document).on("pagebeforeshow","#page_settings",function(){
	$("#message").hide();	
	$("#div_persondata").hide();
	$("#div_manage_cards").hide();
	getPersonData();
	getCardsData();
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

	$("#btn_settings_persondata").click(function(){
		if($("#div_manage_cards").is(":visible")){
			$("#div_manage_cards").hide("fast");
			$("#div_persondata").delay("fast").toggle("fast");
		}
		else{
			$("#div_persondata").toggle("fast");
		}


	});
	$("#btn_settings_manage_cards").click(function(){
		if($("#div_persondata").is(":visible")){
			$("#div_persondata").hide("fast");
			$("#div_manage_cards").delay("fast").toggle("fast");
		}else{
			$("#div_manage_cards").toggle("fast");
		}

	});
	$("#btn_settings_cancel").click(function(){
		$("#set_name").val(localStorage.getItem("userName")) ;
		$("#set_phone").val(localStorage.getItem("userPhone")) ;
		$("#set_zip").val(localStorage.getItem("userZip"));

		$("#div_persondata").toggle("fast");
		var message="Ingen endringer";
		$("#messagetext1").html(message).css("padding","3pt");
		$("#messagetext1").fadeIn().delay(1500).fadeOut();
	});

	$("#btn_settings_save").click(function(){
		var name = $("#set_name").val();
		var phone = $("#set_phone").val();
		var zip = $("#set_zip").val();

		if(name ==""){
			alert("Navn kan ikke stå tomt");
			return;
		}

		if( name.indexOf("'") != -1|| phone.indexOf("'") != -1|| zip.indexOf("'") != -1){
			alert("Ugyldig tegn i navn (')");
			return;
		}

		var sql ="update user set name='"+name+"',phone='"+phone+"',zip='"+zip+"' where email like '"+localStorage.getItem("userID")+"'" ;
		var url = getURLappBackend();
		$.ajax({
			type: "POST",
			url : url, 
			data: {"setSQL":sql},
			dataType: "text",
			success : function(response){
				console.log("update: "+response	);
				localStorage.setItem("userName",name);
				localStorage.setItem("userPhone",phone);
				localStorage.setItem("userZip",(zip==null)?"":zip);
				$("#div_persondata").toggle("fast");
				var message="Lagret";
				$("#messagetext1").html(message).css("padding","3pt");
				$("#messagetext1").fadeIn().delay(1500).fadeOut();
			}
		});

	});
	
	$("#dd_cards").change(function(){
		var cardnr = $(this).val();
		if(cardnr == 0){
			resetCardInputs();
			return;
		}
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


	$("#btn_cardsettings_cancel").click(function(){
		resetCardInputs();
		$("#div_manage_cards").toggle("fast");
		var message="Ingen endringer";
		$("#messagetext1").html(message).css("padding","3pt");
		$("#messagetext1").fadeIn().delay(1500).fadeOut();

	});
	$("#btn_cardsettings_save").click(function(){
		var cardnr = $("#set_cardnr").val();
		var ccv = $("#set_CCV").val();
		var month = $("#set_month").val();
		var year = $("#set_year").val();
		var cardname = $("#set_cardname").val();
		var cb_monthly_charge = $("#cbMonthlyCharge").prop("checked");
		var monthly_charge = $("#set_charge").val();

		if(cardnr =="" || ccv ==""|| month ==""|| year ==""|| cardname ==""){
			alert("Feil: tomme felter");
			return;
		}if(cb_monthly_charge && monthly_charge ==""){
			alert("Velg beløp eller huk av 'månedlig beløp'"+cb_monthly_charge);
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

		var sql ="update card set cardnr='"+cardnr+"',CCV="+ccv+",month="+month+",year="+year+",cardname='"
				+cardname+"',monthly_charge="+(cb_monthly_charge?monthly_charge:null)+" where cardnr ="+$("#dd_cards").val() ;
		console.log(sql);
		var url = getURLappBackend();
		$.ajax({
			type: "POST",
			url : url, 
			data: {"setSQL":sql},
			dataType: "text",
			success : function(response){
				console.log("update: "+response	);
				resetCardInputs();
				$("#div_manage_cards").toggle("fast");
				var message="Kortinfo lagret";
				$("#messagetext1").html(message).css("padding","3pt");
				$("#messagetext1").fadeIn().delay(1500).fadeOut();
			}
		});
	});

});

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
				/*
				friend_requests += "<li>"
								+"<div class='li_container'><div class='li_left'><div class='circlegrey'>"
								+(response[i].picURL == null? '':"<img src='"+response[i].picURL+"'>")+"</div>"
								+"</div><div class='li_mid'>"
								+ "<span class='projectName'>"+response[i].name+"</span>"
								+"<span class='grey small block'>"+ response[i].from_user+"</span>"
								+"</div><div class='li_right'>"
								+"<button class='btn_deny' name='deny_request' id='"+response[i].from_user+"'>Avslå</button>"
								+"<button class='btn_accept' name='accept_request' id='"+response[i].from_user+"'>OK</button>"
								+ "</div></div></li>";
				*/
				friend_requests 	+="<li id='"+response[i].from_user+"'>"// +0
										+"<div class='li_container'>" 	// +1
											+"<div class='li_l'>"	// +2
									    		+"<div class='circlegrey'>"	//+3
											    	+(response[i].picURL == null? '':"<img src='"+response[i].picURL+"'/>")
												+"</div>" // -3
											+"</div>" // -2
											+"<div class='li_r'>"// +2
												+"<div class='li_r_top'>"// +3
											    	+"<span class='name'>"+response[i].name+"</span>"
											    +"</div>"// -3
												+"<div class='li_r_bottom'>"// +3
												  	+"<button class='small confirm' name=accept_request>BEKREFT</button>"
												  	+"<button class='small grey dismiss' name=deny_request>AVSLÅ</button>"
												+"</div>"// -3
											+"</div>"// -2
										+"</div>"// -1
									+"</li>";// -0
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
						//alert("File:  settings.js trying to delete friend request from table friend_request after successful friend request acceptance, response: " + response);
						checkFriendRequests();
					}
				});
			}
		}
	});

	var message="Du ble venn med "+name;
	$("#messagetext2").html(message).css("padding","3pt");
	$("#messagetext2").fadeIn().delay(3000).fadeOut();

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
	$("#messagetext2").html(message).css("padding","3pt");
	$("#messagetext2").fadeIn().delay(3000).fadeOut();
}

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
			$("#set_name").val(name) ;
			$("#set_phone").val(phone);
			$("#set_zip").val(response[0].zip);
			localStorage.setItem("userName",name);
			localStorage.setItem("userPhone",phone);
			localStorage.setItem("userZip",(zip==null)?"":zip);
		}

	});

}

function getCardsData(){
	var sql = "select * from card where userID like '"+localStorage.getItem("userID")+"'";
	var url = getURLappBackend();

	$.ajax({
		type:"POST",
		url: url, 
		data: {"getSQL":sql},
		dataType: "json",
		success:function(response){
			var ddCardHTML = "<option value='0'>Velg kort</option>";
			for(var i=0; i<response.length;i++){
				// response[i].cardname+", "+response[i].cardnr+", "+response[i].month+", "+response[i].year+", "+response[i].CCV+", "+response[i].monthly_charge+"\n";
				ddCardHTML += "<option value='"+response[i].cardnr+"' id='"+response[i].CCV+"''>**** **** **** "+response[i].cardnr.substring(12)+"</option>";
			}
			$("#dd_cards").html(ddCardHTML);
		}

	});
}

function resetCardInputs(){
	$("#dd_cards").val(0);
	$("#set_cardnr").val("");
	$("#set_CCV").val("");
	$("#set_month").val(0);
	$("#set_year").val(0);
	$("#set_cardname").val("");
	$("#set_charge").val("");
	$("#cbMonthlyCharge").prop("checked",false);

}

// Check with bank to verify cardinfo
function checkCardInfo(){
	return true;
}
