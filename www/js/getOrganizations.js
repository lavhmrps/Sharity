$(document).ready(function(){

	$(document.body).on('click', 'li', function() {
		setLocalStorageorganizationToShow(this.id);

	});



	if(localStorage.getItem('userID') != null){
			//alert(localStorage.getItem('userID'));
			//sjekk om email / userID fortsatt finnes i databasen
			var sql = "select org.* , count(projectID) as projectCount from organization as org left join project on ( project.organizationNR like org.organizationNR ) group by org.name";
			var url = getURLappBackend();

			$.ajax({
				type : "POST",
				url : url,
				dataType: "json",
				data : {'getSQL' : sql},
				success : function(response){
					if(response.length == 0){
						var orgCode = '<li><div class="li_container">'+
							'<div class="li_left">'+
							'<div class="circle">'+
							'</div>'+
							'</div>'+
							'<div class="li_mid">'+
							'<span class="li_org_name" style="white-space:normal;">Det finnes ingen organisasjoner i databasen</span>'+
							'<span class="li_num_projects"></span>'+
							'</div>'+
							'<div class="li_right">'+
							'</div>'+
							'</div></li>';
						$("#orgList").append(orgCode);
					} 
					else{
						for(var i = 0 ; i < response.length; i++){	
							var orgCode = '<li '+
							'class="result" '+
							'id="'+ response[i].organizationNr +'">' +
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
							(response[i].projectCount == null ? '0':response[i].projectCount) + ' prosjekt'+
							(response[i].projectCount==1?'':'er')+
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
					}
				},
				error: function(){
					alert("getOrganiation.js error: Kan man få mer info her elleh?");
				}
			});
}else{
	window.location.replace("../index.html");
	alert("Vennligst logg inn");
}

$('button[name=logut]').click(function(){
	localStorage.removeItem("userID");
	window.location.replace("../index.html");
});

});

function setLocalStorageorganizationToShow(orgnaizationNr){
	localStorage['organizationToShow'] = orgnaizationNr;
}




/*
	


*/