$(document).on("pageinit","#page_my_friends",function(){
	$(".add_friend_icon").click(function(){
		$.mobile.changePage("#page_add_friend",{"transition":"slide"});
	});
})

$(document).on("pagebeforeshow","#page_my_friends",function(){

	if(localStorage.getItem('userID') != null){
		var sql = "select friendEmail, name, sum(donation.sum) as Donasjoner, picURL, p.donations, p.page "
		+" from user join friend on"
		+" (user.email like friend.friendEmail"
		+" and friend.userEmail like '"+localStorage.getItem('userID')+"')"
		+" left join donation on donation.email like friend.friendEmail "
		+" left join privacy as p on p.userID = friend.friendEmail group by name";
		console.log(sql);

		var url = getURLappBackend();


		$.ajax({
			type : "POST",
			url : url,
			dataType: "json",
			data : {'getSQL' : sql},
			success : function(response){
				if(response.length == 0){
					// No friends
					var html = '<li>'
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
					+'</li>';
					$("#friendList").html(html);
				}else{
					var friends="", 
						priv_page, 
						priv_donations,
						donationsHTML="";

					for(var i = 0 ; i < response.length; i++){		
						priv_page = (response[i].page=='null'?1:response[i].page);
						priv_donations = (response[i].donations=='null'?1:response[i].donations);
						donationsHTML=(priv_donations==0?"X":(response[i].Donasjoner==null?0:response[i].Donasjoner)+" kr</span>");

						friends+='<li id="'+response[i].friendEmail+'" priv_page ="'+priv_page+'" name="showFriend">'
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
						+'<span class="li_donations '+(priv_donations==0?"red":"green")+'">'
						+ donationsHTML
						//+(response[i].Donasjoner==null?0:response[i].Donasjoner+'')
						+' '
						+'</div>'
						+'<div class="li_right">'
						+'<img src="../img/li_arrow_r_grey.png">'
						+'</div>'
						+'</div>'
						+'</li>';

					}
					$("#friendList").html(friends);
					
					$("#page_my_friends li[name=showFriend]").off("click").click(function(){
						var friendID = $(this).attr("id");
						var priv_page = $(this).attr("priv_page");
						if(priv_page == 0){
							showMessage("Ingen tilgang");
							return;
						}

						localStorage.setItem("userIDtoShow",friendID);
						$.mobile.changePage("#page_show_user_profile",{"transition":"slide"});
					});
				}
			},
			error: function(){
				alert("error in my_friends.js error in ajax_request trying to print friend list");
			}
		});
	}
})

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