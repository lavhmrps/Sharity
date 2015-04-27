$(document).on("pagebeforeshow","#page_settings",function(){
	$("#message").hide();	
});

$(document).on("pageinit","#page_settings",function(){

	$("button[name=logout]").click(function(){
		localStorage.clear();
		window.location.replace("../index.html");
	});

	$(document).on('click', 'button[name=accept_request]', function() {
		var from_user = $(this).closest("li").attr("id");
		acceptFriendRequest(from_user);
	});
	$(document).on('click', 'button[name=deny_request]', function() {
		var from_user = $(this).closest("li").attr("id");
		var name = $(this).closest("li").find(".name").html();
		denyFriendRequest(from_user,name);
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

function acceptFriendRequest(from_user){
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
	$("#messagetext").html(message).css("padding","3pt");
	$("#messagetext").fadeIn().delay(3000).fadeOut();
}

