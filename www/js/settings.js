$(document).ready(function(){
	$(".footer_settings").click(function(){
		var url = getURLappBackend();
		var data = {"getSQL" : "SELECT * FROM friend_request WHERE to_user = '"+localStorage.getItem('userID')+"'"};

		$.ajax({
			type: "POST",
			url : url, 
			data: data,
			dataType: "json",
			success : function(response){
				$("#num_friend_req").text("You have " + response.length + " friend request(s)");
				var friend_requests = "";

				for(var i = 0; i < response.length; i++){
					friend_requests +=
					'<li>'+
					'<p>From: '+
					response[i].from_user+
					' '+
					'Date: '+
					response[i].date+
					'<button name="accept_request" id="'+response[i].from_user+'">Godta</p>'+
					'</p>'+
					'</li>';
				}
				$('ul[name=friend_requests]').html(friend_requests);
			},
			error : function(){
				alert("File: settings.js, trying to get friend_requests from getSQL appBackend from server, bad request, error");
			}
		});
		
	});
	$("button[name=logg_out]").click(function(){
		localStorage.removeItem("userID");
		window.location.replace("../index.html");
	});
	$(document.body).on('click', 'button[name=accept_request]', function() {
		acceptFriendRequest(this.id);
	});
});

function acceptFriendRequest(from_user){
	var url = getURLappBackend();
	var my_email = localStorage['userID'];
	var data = {"setSQL" : "INSERT INTO friend (email, email2) VALUES ('"+my_email+"', '"+from_user+"')"};

	$.ajax({
		type:"POST",
		url: url, 
		data: data,
		dataType: "text",
		success : function(response){
			alert("File: settings.js : trying to accept friend request, response from SQL : " + response);
			if(response == "OK"){
				var data = {"setSQL" : "DELETE FROM friend_request WHERE from_user = '"+from_user+"' AND to_user ='"+my_email+"'"};
				$.ajax({
					type: "post",
					url : url,
					data : data,
					dataType : "text",
					success : function(response){
						alert("File:  settings.js trying to delete friend request from table friend_request after successful friend request acceptance, response: " + response);
					}
				});
			}
		}
	});
}