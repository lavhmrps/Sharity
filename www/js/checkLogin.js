$(document).ready(function(){
	
	$('button[name=loginUser]').click(function(event){
		alert("TRY LOGIN");
	
	var email = $('input[name=login_username]').val();
	var password = $('input[name=login_password]').val();

	var combinationJSON = {
		"email" : email,
		"password" : password
	};

	combinationJSON = JSON.stringify(combinationJSON);

	alert(combinationJSON);

	$.ajax({
		type : "POST",
		datatype : "text",
		url : "http://localhost/SharityCRM/phpBackend/checkLogin.php",
		data : {"userLoginApp" : combinationJSON},
		success: function(response){
			if(response == "OK"){

				window.location.replace("pages/overview.html");
				localStorage.setItem("userID", email);
			}else{
				alert("NOT OK " + response);
			}

		},
		error: function(response){
			console.log(response.message);
		}
	});

	event.preventDefault();
});
});
