$(document).ready(function(){


	if(localStorage['userID'] == null ||localStorage['userID'].length == 0 ){
	}else{
		//window.location.replace("pages/app.html#page_overview");
	}

	$('button[name=loginUser]').click(function(event){	
		
		
		var email = $('input[name=login_username]').val();
		var password = $('input[name=login_password]').val();

		var json = {
			"email" : email,
			"password" : password
		};

		json = JSON.stringify(json);

		var url = getURLappBackend();

		$.ajax({
			type : "POST",
			datatype : "text",
			url : url,
			data : {"userLoginApp" : json},
			success: function(response){
				if(response == "OK"){
					console.log("Bruker-login");
					window.location.replace("pages/app.html#page_overview");
					localStorage.setItem("userID", email);
				}else if(response == "ORG"){
					console.log("Organisasjon-login: ok");
					window.location.replace("pages/app_for_orgs.html#page_org_home");
					localStorage.setItem("orgName", email);
				}

				else{
					alert("Vennligst sjekk at epost og passord er riktig: "+response );
				}

			},
			error: function(response){
				console.log(response.message);
			}
		});

		event.preventDefault();
	});
});
