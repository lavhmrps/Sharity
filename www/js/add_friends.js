/*var contact='<li>'
+'<div class="li_container">'
+'<div class="li_left">'
+'<div class="circlegrey">'
+img
+'</div>'
+'</div>'
+'<div class="li_mid ">'
+'<div class="li_friends">'
+name
+'</div>'
+'<div class="circlebluelittle">S</div>'
+'</div>'
+'<div class="li_right">'
+'<input data-role="none" type="checkbox" class="input_cb" id="'
+checkboxid
+'">'
+'</div>'
+'</div>'
+'</li>';*/

$(document).ready(function(){

	$(document.body).on('click', 'button[name=add_friend]', function() {
		requestFriendship(this.id);
	});

	$('span[name=search_sharity]').click(function(){
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
				userCode += '<li name="user_list">'+
				'<h3>Navn: '+
				response[i].name+
				'</h3>'+
				'<p>Email: '+
				response[i].email +
				'</p>'+
				'<button name="add_friend" id="'+response[i].email+'" >Legg til som venn</button>'+
				'</li>';

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