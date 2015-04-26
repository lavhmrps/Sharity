$(document).ready(function(){
	$(document.body).on('click', 'button[name=add_friend]', function() {
		requestFriendship(this.id);
	});
	$('li[name=search_sharity]').click(function(){
		window.location.href='#page_search_friends_sharity';
	});
	var url = getURLappBackend();
	var data = {"getSQL" : "SELECT * FROM user WHERE email !='"+localStorage['userID']+"'"};
	$.ajax({
		type : "POST",
		data : data,
		url : url,
		dataType: "JSON",
		success: function(response){
			var userCode = "";
			for(var i = 0 ; i < response.length; i++){	
				userCode +='<li id="'+response[i].email+'">'
							  +'<div class="li_container">'
								+'<div class="li_left">'
								  +'<div class="circlegrey">'
								    +'<img src="'+(response[i].picURL == null? "../img/no_image_avaliable.png":response[i].picURL)+'"/>'
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
								/*
								  +'<div class="li_right_tophalf">'
								    +'<a href="#page_show_user_profile" name="showUserprofile" id="'+response[i].email+'">Vis profil </a>'
								  +'</div>'
								*/
								  +'<div class="li_right_center">'
								    +'<a href="#" page-role="button" class="ui-btn" name="requestFriendship">Bli venn</a>'
								  +'</div>'
								+'</div>'
							  +'</div>'
							+'</li>';
			}
			$("#user_list").html(userCode);
		}
	});
});
function requestFriendship(to_user){
	var url = getURLappBackend();
	var from_user = localStorage['userID'];
	var data = {"setSQL" : "INSERT INTO friend_request (from_user, to_user) VALUES('"+from_user+"', '"+to_user+"')"};

	$.ajax({
		type: "POST",
		data: data,
		url: url,
		dataType: "text",
		success: function(response){
			alert("File: add_friends.js Trying to set friend request getting response from ajax request: : " + response);
		}
	});
}

$(document).on("pageshow","#page_search_friends_sharity",function(){

	$(".li_left, .li_mid").off("click").on("click",function(){
		localStorage.setItem("userIDtoShow",$(this).closest("li").attr("id"));
		$.mobile.changePage("#page_show_user_profile");
		
	});// li left/mid on click

	$("a[name=requestFriendship]").off("click").on("click",function(){
		localStorage.setItem("userIDtoShow",$(this).closest("li").attr("id")); // id of listitem
		alert("Venneforspørsel sendt til "+ $(this).closest("li").attr("id"));
	}); // a on click

}) // on pageshow #page_add_friend