$(document).on("pagebeforeshow","#page_my_friends",function(){

	if(localStorage.getItem('userID') != null){
		var sql = "select friendEmail, name, sum(donation.sum) as Donasjoner, picURL "
		+"from user join friend on "
		+"(user.email like friend.friendEmail "
		+"and friend.userEmail like '"+localStorage.getItem('userID')+"')"
		+" left join donation on(donation.email like friend.friendEmail) group by name";

		var url = getURLappBackend();


		$.ajax({
			type : "POST",
			url : url,
			dataType: "json",
			data : {'getSQL' : sql},
			success : function(response){
				if(response.length == 0){
					var html = '<li><a href="#" rel="external" class="show-page-loading-msg">'
					+'<div class="li_container">'
					+'<div class="li_left">'
					+'<div class="circlegrey">'
					+'</div>'
					+'</div>'
					+'<div class="li_mid_left dots">'
					+'<h3 class="li_friends">Ingen venner lagt til</h3>'	
					+'</div>'
					+'<div class="li_mid_right">'
					+'</div>'
					+'<div class="li_right">'
					+'</div>'
					+'</div>'
					+'</a>'
					+'</li>';
					$("#friendList").html(html);
				}else{
					var friends="";
					for(var i = 0 ; i < response.length; i++){		
						
						friends+='<li id="'+response[i].friendEmail+'" name="showFriend"><a href="#" rel="external" class="show-page-loading-msg">'
						+'<div class="li_container">'
						+'<div class="li_left">'
						+'<div class="circlegrey">'
						+'<img src="'
						+(response[i].picURL==null? '../img/no_image_avaliable.png':response[i].picURL )+'"/>'
						+'</div>'
						+'</div>'
						+'<div class="li_mid_left dots">'
						+'<span class="li_friends">'+response[i].name	+'</span>	'	
						+'</div>'
						+'<div class="li_mid_right donations">'
						+'<span class="li_donations green">'
						+(response[i].Donasjoner==null?0:response[i].Donasjoner+'')
						+' kr</span>'
						+'</div>'
						+'<div class="li_right">'
						+'<img src="../img/li_arrow_r_grey.png">'
						+'</div>'
						+'</div>'
						+'</a>'
						+'</li>';
						$("#friendList").html(friends);
					}
					}
				},
				error: function(){
					alert("error in my_friends.js error in ajax_request trying to print friend list");
				}
		});
	}
});

$(document).on("pageinit","#page_my_friends",function(){

	$(".add_friend_icon").click(function(){
		$.mobile.changePage("#page_add_friend",{"transition":"slide"});
	});

	$(document).on('click', 'li[name=showFriend]', function() {
		localStorage.setItem("userIDtoShow", this.id);
		window.location.href="#page_show_user_profile";
	});


});

function showFriendsNotif(n){
	$(".footer_friends").each(function(){
		$(this).find(".notification").remove();
		$("#friendRequests").html("Du har <span class='red small'>"+n+"</span> ny"+(n==1?"":"e")+" venneforespørs"+(n==1?"el":"ler")+".");
		if(n>0){
			$(this).append("<div class='notification'>"+n+"</div>");
			$("#friendRequests").append(" <a href='#page_settings'>Se hvem</a>");
		}
		
	});		
}