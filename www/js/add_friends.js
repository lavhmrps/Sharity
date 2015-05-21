$(document).on("pageinit","#page_add_friend",function(){
	$('li[name=search_sharity]').click(function(){
		window.location.href='#page_search_friends_sharity';
	});
})

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
								var nameAttr ="name="+ (alreadyFriend?"deleteFriend":(requestPending?"'cancelRequest'":"'requestFriendship'"));
								var btnText = (alreadyFriend?"Venn":(requestPending?"Avbryt <br>forespørsel":"Bli venn"));
								var btnClass = alreadyFriend?"btnFriend":(requestPending?"btnCancelRequest":"btnSendRequest");
								
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
													  +'<a href="#" page-role="button" class="addbtn x-small '+btnClass+'" '+nameAttr+' to_name="'+response[i].name+'">'+btnText+'</a>'
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
		var userIDtoShow = $(this).closest("li").attr("id");
		var weAreFriends = $(this).closest("li").find("a").hasClass("btnFriend");

		// Get user's privacyinfo
		var sql = "select * from privacy where userID like '"+userIDtoShow+"'";
		$.ajax({
			type:"post",
			url :getURLappBackend(),
			dataType:"json",
			data:{"getSQL":sql},
			success:function(response){
				var privacy_page, privacy_donations;
				if (response.length == 0){
					// User has yet to customize privacyinfo, using defaults : visibility to friends
					privacy_page=1;
					privacy_donations=1;
				}
				else{
					privacy_page = response[0].page;
					privacy_donations = response[0].donations;
				}
				if(privacy_page == 0){
					showMessage("Ingen tilgang");
					return;
				}
				if(privacy_page == 1){
					if(weAreFriends){
						localStorage.setItem("userIDtoShow",userIDtoShow);
						$.mobile.changePage("#page_show_user_profile",{"transition":"slideup"});
					}
					else{
						showMessage("Ingen tilgang");
						return;
					}
				}
				if(privacy_page == 2){
					localStorage.setItem("userIDtoShow",userIDtoShow);
					localStorage.setItem("userIDtoShowPrivacyPage",privacy_page);
					localStorage.setItem("userIDtoShowPrivacyDonations",privacy_donations);
					$.mobile.changePage("#page_show_user_profile",{"transition":"slideup"});
				}


			}
		});


		
		
	});// li left/mid on click

	$("a[name=requestFriendship]").off("click").on("click",function(){
		var to_user = $(this).closest("li").attr("id");
		requestFriendship(to_user,$(this));

	}); // a requestFriendship

	$("a[name=cancelRequest]").off("click").on("click",function(){
		var to_user = $(this).closest("li").attr("id");
		cancelRequest(to_user,$(this));

	}); // a cancelRequest

	$("a[name=deleteFriend]").off("click").on("click",function(){
		var to_user = $(this).closest("li").attr("id");
		if(confirm("Fjerne som venn?") == true)
			deleteFriend(to_user,$(this));

	}); // a deleteFriend

}) // on pageshow #page_add_friend

function requestFriendship(to_user,elem){
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
			if(response == "OK"){
				elem.removeClass("btnSendRequest").addClass("btnCancelRequest").html("Avbryt<br>forespørsel").attr("name","cancelRequest");
				showMessage("Venneforespørsel sendt til "+elem.attr("to_name"));
				elem.off("click").on("click",function(){
					var to_user = $(this).closest("li").attr("id");
					cancelRequest(to_user,$(this));

				}); // a requestFriendship
			}


			//alert("File: add_friends.js Trying to set friend request getting response from ajax request: : " + response);
		}
	});
}

function cancelRequest(to_user,elem){
	var url = getURLappBackend();
	var from_user = localStorage['userID'];
	var sql ="delete from friend_request where from_user like '"+from_user+"' and to_user like '"+to_user+"'";
	console.log(sql);

	$.ajax({
		type: "POST",
		url: url,
		dataType: "text",
		data: {"setSQL" : sql},
		success: function(response){
			if(response == "OK"){
				elem.removeClass("btnCancelRequest").addClass("btnSendRequest").html("Bli venn").attr("name","requestFriendship");
				showMessage("Venneforespørsel til "+elem.attr("to_name")+" avbrutt");
				elem.off("click").on("click",function(){
					var to_user = $(this).closest("li").attr("id");
					requestFriendship(to_user,$(this));
					

				}); // a requestFriendship
			}

			//alert("File: add_friends.js Trying to set friend request getting response from ajax request: : " + response);
		}
	});
}

function deleteFriend(to_user,elem){
	var url = getURLappBackend();
	var from_user = localStorage['userID'];
	var sql ="delete from friend where friendEmail like '"+to_user+"' and userEmail like '"+from_user+"'";
	console.log(sql);

	$.ajax({
		type: "POST",
		url: url,
		dataType: "text",
		data: {"setSQL" : sql},
		success: function(response){
			if(response == "OK"){
				elem.removeClass("btnFriend").addClass("btnSendRequest").html("Bli venn").attr("name","requestFriendship");
				showMessage("Du avsluttet vennskapet med "+elem.attr("to_name"));
				elem.off("click").on("click",function(){
					var to_user = $(this).closest("li").attr("id");
					requestFriendship(to_user,$(this));

				}); // a requestFriendship
			}

			//alert("File: add_friends.js Trying to set friend request getting response from ajax request: : " + response);
		}
	});
}

