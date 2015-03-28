$(document).ready(function(){
	$('.footer_settings').click(function(){
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
				for(var i = 0; i < json.length; i++){
					subscription_list += "<li>";
					subscription_list += "<p>project.name: " + json[i].name + "<p/>";
					subscription_list += "<p>Since: " + json[i].date_added + "</p>";
					subscription_list += "</li>";
					
				}
				$('ul[name=subscription_list]').html(subscription_list);
			},
			error : function(){
				alert("showSubscription.js feil i ajax request ");

			}
		});

	});
});