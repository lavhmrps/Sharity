$(document).on("pagebeforeshow","#page_settings",function(){
	
	var url = getURLappBackend();
	var userID = localStorage.getItem('userID');
	var data = "SELECT subscription.*, project.name, project.backgroundimgURL FROM  subscription INNER JOIN project ON subscription.projectID=project.projectID WHERE email = '"+userID+"'";
	
	$.ajax({
		type: "POST",
		url : url, 
		data : {"getSQL" : data},
		dataType : "json",
		success : function(response){
			var subscription_list = "";
			if(response.length>0){
				$("#subscription_message").html("");
				for(var i = 0; i < response.length; i++){
					var img = response[i].backgroundimgURL;
					var leftCode = (img==""?'<div class="circlegrey"></div>':'<a href="#popupPhotoLandscapePageSettings" data-rel="popup" data-position-to="window" '+
					'><img src="'+response[i].backgroundimgURL+'" id="'+response[i].projectID+'"></a>');

					subscription_list += 
						"<li projectID='"+response[i].projectID+"'>"
						  +"<div class='li_container'>"
							+"<div class='li_left'>"
							 +leftCode
							+"</div>"
							+"<div class='li_mid'>"
							  +"<div class='projectNameDiv'>"
								+ "<span class='large projectName'>"+response[i].name+"</span>"
							  +"</div>"
								+"<div class='dateAddedDiv'>"
								  +"<span class='small grey'>"+ formatDate(response[i].date_added)+"</span>"
								+"</div>"
							  +"</div>"
							+"<div class='li_right'>"
							  +"<a href='#' class='red' name='cancel_subscription'>Stopp</a>"					
							+ "</div>"
						  +"</div>"
						+"</li>";
					
				}
			}else{
				$("#subscription_message").html("Du har ingen abonnementer");
			}
			$('ul[name=subscription_list]').html(subscription_list);

			$("#subscription_list .li_mid").off("click").click(function(){
				var projectID =$(this).closest("li").attr("projectid");
				localStorage.setItem("projectToShow",projectID);
				$.mobile.changePage("#page_project");
			});

			$(document).on("click","a[name='cancel_subscription']",function(){
				var projectID = $(this).closest("li").attr("projectID");
				//console.log("Stopp subID:"+projectID);
				var elem =$(this).closest("li");
				cancel_subscription(projectID, elem);
				elem.remove();
				if($('ul[name=subscription_list] li' ).length == 0)
					$("#subscription_message").html("Du har ingen abonnementer");
					
			});

			$("li img").each(function(){
				$(this).error(function(){
					$(this).closest(".li_left").html('<div class="circlegrey"></div>');
				});
				$(this).off("click").click(function(){
					$("#popupPhotoLandscapePageSettings img").attr("src",$(this).attr("src"));
				});
			});
		},
		error : function(){
			alert("showSubscription.js feil i ajax request ");

		}
	});

});

function cancel_subscription(projectID,elem){
	var email = localStorage.getItem('userID');

	var sql ="delete from subscription where email like '"+email+"' and projectID = "+projectID;
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"text",
		data:{"setSQL":sql},
		success:function(response){
			console.log(response);

		}
	});
	//location.reload();
}