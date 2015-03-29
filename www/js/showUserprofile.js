$(document).ready(function(){
	$(document.body).on('click', 'a[name=showUserprofile]', function() {
		localStorage.setItem("userIDtoShow", this.id);

		var url = getURLappBackend();
		var data = {"getSQL" : "SELECT * FROM user WHERE email = '"+this.id+"'"};

		$.ajax({
			type : "POST",
			url : url,
			data : data,
			dataType : "JSON",
			success : function(json){
				if(json.length == 1){
					$('h2[name=show_profile_username]').text(json[0].email);
					$('div[name=show_user_fullname]').text(json[0].name);
					
				}
			},
			error : function(){
				alert("showUserprofile.js Her gikk noe galt");
			}
		});

	});
	$('button[name=challenge_user]').click(function(){
		var userID = localStorage.getItem("userIDtoShow");
		alert(userID);
	});
});