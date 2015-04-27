$(document).on("pageinit","#page_search_friends_sharity",function(){
	var url = getURLappBackend();
	var sql ="select * from friend where userEmail like '"+localStorage['userID']+"'";
	var friends = [];
	var pendingRequests = [];
	$.ajax({
		type : "POST",
		url : url,
		dataType: "JSON",
		data:{"getSQL":sql},
		success:function(response){
			for(var i = 0; i < response.length; i++)
				friends[i]=response[i].friendEmail;

			sql ="select * from friend_request where from_user like '"+localStorage['userID']+"'";
			$.ajax({
				type : "POST",
				url : url,
				dataType: "JSON",
				data:{"getSQL":sql},
				success:function(response){
					for(var i=0;i<response.length;i++){
						pendingRequests[i]=response[i].to_user;					
					}

					var data = {"getSQL" : "SELECT * FROM user WHERE email !='"+localStorage['userID']+"'"};
					$.ajax({
						type : "POST",
						data : data,
						url : url,
						dataType: "JSON",
						success: function(response){
							var userCode = "";
							var alreadyFriend=false;
							var requestPending=false;
							for(var i = 0 ; i < response.length; i++){							
								if($.inArray(response[i].email,friends) != -1)
									alreadyFriend = true;
								if($.inArray(response[i].email,pendingRequests) != -1){
									requestPending = true;
																}
								var nameAttr = (alreadyFriend?"":"name="+(requestPending?"'cancelRequest'":"'requestFriendship'"));
								var btnText = (alreadyFriend?"Friend":(requestPending?"Cancel":"Befriend"));
								
								userCode +='<li id="'+response[i].email+'">'
											  +'<div class="li_container">'
												+'<div class="li_left">'
												  +'<div class="circlegrey">'
												   +(response[i].picURL == null? "":"<img src='"+response[i].picURL+"'/>'")
												  +'</div>'
												+'</div>'
												+'<div class="li_mid ">'
												  +'<div class="li_name">'
												    + response[i].name
												  +'</div>'
												  +'<span class="li_email">'
												    + response[i].email
												  +'</span>'
												+'</div>'
												+'<div class="li_right">'
												  +'<div class="li_right_center">'
													  +'<a href="#" page-role="button" class="addbtn" '+nameAttr+'>'+btnText+'</a>'
												    //+'<a href="#" page-role="button" class="ui-btn" '+(alreadyFriend?'':'name="requestFriendship"')+'">'+(alreadyFriend?"Er venn":"Bli venn")+'</a>'
												  +'</div>'
												+'</div>'
											  +'</div>'
											+'</li>';
								alreadyFriend = false;
								requestPending = false;
								
							} // for
							$("#user_list").html(userCode);
						}// success
					}); // ajax
				} // success			
			});//ajax
		} // success
	});// ajax
}) 


$(document).on("pageshow","#page_search_friends_sharity",function(){

	$(".li_left, .li_mid").off("click").on("click",function(){
		localStorage.setItem("userIDtoShow",$(this).closest("li").attr("id"));
		$.mobile.changePage("#page_show_user_profile");
		
	});// li left/mid on click

	$("a[name=requestFriendship]").off("click").on("click",function(){
		var to_user = $(this).closest("li").attr("id");
		localStorage.setItem("userIDtoShow",to_user); // id of listitem
		requestFriendship(to_user);

	}); // a on click

}) // on pageshow #page_add_friend

function requestFriendship(to_user){
	var url = getURLappBackend();
	var from_user = localStorage['userID'];
	var sql ="INSERT INTO friend_request (from_user, to_user) VALUES('"+from_user+"', '"+to_user+"')";
	console.log(sql);

	$.ajax({
		type: "POST",
		url: url,
		dataType: "text",
		data: {"setSQL" : sql},
		success: function(response){
			if(response == "OK")
				console.log("venneforespørsel sendt til "+to_user);
			//alert("File: add_friends.js Trying to set friend request getting response from ajax request: : " + response);
		}
	});
}

