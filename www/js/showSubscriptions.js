$(document).on("pagebeforeshow","#page_settings",function(){
	
	var url = getURLappBackend();
	var userID = localStorage.getItem('userID');
	var data = "SELECT subscription.*, project.name FROM  subscription INNER JOIN project ON subscription.projectID=project.projectID WHERE email = '"+userID+"'";
	
	$.ajax({
		type: "POST",
		url : url, 
		data : {"getSQL" : data},
		dataType : "json",
		success : function(json){
			var subscription_list = "";
			if(json.length>0){
				$("#subscription_message").html("");
				for(var i = 0; i < json.length; i++){
					subscription_list += "<li projectID='"+json[i].projectID+"'>"
						+"<div class='li_container'><div class='li_left'><div class='circlegrey'></div>"
						+"</div><div class='li_mid'><div class='projectNameDiv'>"
						+ "<span class='large projectName'>"+json[i].name+"</span></div>"
						+"<div class='dateAddedDiv'><span class='small grey'>"+ formatDate(json[i].date_added)+"</span></div>"
						+"</div><div class='li_right'><a href='#' class='red' name='cancel_subscription'>Stopp</a>"					
						+ "</div></div></li>";
					
				}
			}else{
				$("#subscription_message").html("Du har ingen abonnementer");
			}
			$('ul[name=subscription_list]').html(subscription_list);

			$(document).on("click","a[name='cancel_subscription']",function(){
				var projectID = $(this).closest("li").attr("projectID");
				//console.log("Stopp subID:"+projectID);
				var elem =$(this).closest("li");
				cancel_subscription(projectID, elem);
				elem.remove();
				if($('ul[name=subscription_list] li' ).length == 0)
					$("#subscription_message").html("Du har ingen abonnementer");
					
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