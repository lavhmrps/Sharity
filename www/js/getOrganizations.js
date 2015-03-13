$(document).ready(function(){

	$(document.body).on('click', 'li', function() {
		setLocalStorage(this.id);

	});



	if(localStorage.getItem('userID') != null){
			//alert(localStorage.getItem('userID'));
			//sjekk om email / userID fortsatt finnes i databasen
			var sql = "SELECT * FROM Organization";
			var url = getURLappBackend();

			$.ajax({
				type : "POST",
				url : url,
				dataType: "json",
				data : {'organizationSQL' : sql},
				success : function(response){
					for(var i = 0 ; i < response.length; i++){		
						
						var orgCode = '<li id="'+ response[i].organizationNr +'">' +
						'<a href="organization.html" rel="external" class="show-page-loading-msg">' + 
						'<div class="li_container">'+
						'<div class="li_left">'+
						'<div class="circle">'+
						'<img src="' + response[i].logoURL + '"/>'+
						'</div>'+
						'</div>'+
						'<div class="li_mid">'+
						'<span class="li_org_name">' + 
						response[i].name +
						'</span>'+
						'<span class="li_num_projects">'+
						response[i].projectCount + ' prosjekt'+
						(response[i].projectCount==1?'':'er')
						'</span>'+
						'</div>'+
						'<div class="li_right">'+
						'<img src="../img/li_arrow_r_grey.png"/>'+
						'</div>'+
						'</div>'+
						'</a>' +
						'</li>';

						$("#orgList").append(orgCode);
					}
				},
				error: function(){
					alert("getOrganiation.js error");
				}
			});
}else{
	window.location.replace("../index.html");
	alert("Logg inn ditt beist!");
}

$('button[name=logut]').click(function(){
	localStorage.removeItem("userID");
	window.location.replace("../index.html");
});



});

function setLocalStorage(orgnaizationNr){
	localStorage['organizationToShow'] = orgnaizationNr;
}




/*
	


*/