$(document).ready(function(){

	listOrgs();
	
	$(document.body).on('click', 'li[name=organization_list]', function() {
		//alert(this.id+": (getOrganization.js)");
		localStorage.setItem('organizationToShow', this.id);
		//alert("File: getOrganization.js: setting organizationToShow " + localStorage.getItem('organizationToShow'));
	});



	$('.footer_overview').click(function(){
		if(localStorage.getItem('userID') != null){

				listOrgs();
			//alert(localStorage.getItem('userID'));
			//sjekk om email / userID fortsatt finnes i databasen
			
}else{
	window.location.replace("../index.html");
	alert("Vennligst logg inn");
}
});

$('button[name=logut]').click(function(){
	localStorage.removeItem("userID");
	window.location.replace("../index.html");
});

});

function listOrgs(){
	var sql = "select org.* , count(projectID) as projectCount from organization as org left join project on ( project.organizationNr like org.organizationNr ) group by org.name";
			var url = getURLappBackend();
			var orgCode = "";
			$.ajax({
				type : "POST",
				url : url,
				dataType: "json",
				data : {'getSQL' : sql},
				success : function(response){
					if(response.length == 0){
						orgCode += '<li><div class="li_container">'+
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
						$("#orgList").html(orgCode);
					} 
					else{
						orgCode = "";
						for(var i = 0 ; i < response.length; i++){	
							orgCode += '<li name="organization_list"'+
							'class="result" '+
							'id="'+ response[i].organizationNr +'">' +
							'<a href="#page_organization" rel="external" class="show-page-loading-msg">' + 
							'<div class="li_container">'+
							'<div class="li_left">'+
							'<div class="circle">'+
							'<img src="' + (response[i].logoURL == null? "../img/no_image_avaliable.png":response[i].logoURL) + '"/>'+
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

							
						}
						$("#orgList").html(orgCode);
					}
				},
				error: function(){
					alert("getOrganization.js feil i kontakt med " + url + ", serverbackendfeil");
				}
			});
}





/*
	


*/