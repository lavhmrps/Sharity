//$(document).ready(function(){

$(document).on("pageinit","#page_organization",function(){
	$(document).on('click', 'a[name="page_org_donation"]', function() {
		localStorage.setItem("donateToOrganization",localStorage.getItem("organizationToShow"));
		console.log("page_organization: "+localStorage.getItem("donateToOrganization"));
		
	});

	$(document).on('click', 'a[name="page_org_li_donation"]', function() {
		localStorage.setItem("donateToProject",this.id);
		console.log("page_organization: "+localStorage.getItem("donateToProject"));
		
	});
});

$(document).delegate("#page_organization", "pagebeforeshow", function() {
	showOrganization();


	$(document).on('click', 'li[name=organization_list]', function() {
		showOrganization();
	});


	$(document).on('click', 'li[name=project_list]', function() {
		localStorage.setItem("projectToShow", this.id);

		//alert("file: organization.js: projectList is clicked, setting projectIDto Show: " + localStorage.getItem('projectToShow'));		
	});


});	

function showOrganization(){

	var organizationNr = localStorage.getItem("organizationToShow");

	if(organizationNr == null || organizationNr.length == 0){
	}else{
		var sql = "SELECT * FROM organization WHERE organizationNr ='" + organizationNr + "'";

		var url = getURLappBackend();
		$.ajax({
			type : "POST",
			url : url,
			dataType: "JSON",
			data : {'organizationSQL' : sql},
			success : function(response){
				var organization_name = response[0].name;
				var category = response[0].category;
				var about_organization = response[0].about;

				var logoURL = response[0].logoURL;
				localStorage.setItem("orgLogo",logoURL);
				var backgroundimgURL = response[0].backgroundimgURL;
				var organizationNr = response[0].organizationNr;
				
				localStorage.setItem("orgName", organization_name);

				$('p[name=organization_name]').text(organization_name); 
				$('span[name=category]').text(category);
				$('span[name=organization_name]').text(organization_name);
				$('span[name=ingress]').text(about_organization); 
				$('img[name=logo]').attr("src", logoURL );
				$('img[name=background]').attr("src", backgroundimgURL);
				appendProjectList(organizationNr);
				$('img[name=background]').error(function(){
					$(this).remove();
				});
			},
			error: function(){
				alert("Error in organization.js trying to print projectlist for: "+ organizationNr +"  ajax bad request");
			}
		});

	}
}

	

function appendProjectList(organizationNr){
	var sql = "SELECT * FROM project WHERE organizationNr ='" + organizationNr + "'";
	var url = getURLappBackend();
	var projectCode = "";
	$.ajax({
		type : "POST",
		url : url,
		dataType: "JSON",
		data : {"getSQL" : sql},
		success : function(response){
			for(var i = 0; i < response.length; i++){
				projectCode += 
				'<li id="' + response[i].projectID +'" name="project_list">'+
				'<div class="li_container">' +
				'<div class="li_left">'+
				'<div class="li_circ"><img src="'+
				(response[i].logoURL == null? "../img/no_image_avaliable.png":response[i].logoURL)+
				'"></div>'+
				'</div>'+
				'<a href="#page_project" rel="external" class="show-page-loading-msg">'+
				'<div class="li_mid dots">'+
				'<div class="li_heading">' + response[i].name + '</div>'+
				'</div>'+
				'</a>'+
				'<div class="li_right">'+
				'<a href="#page_donate" rel="external" class="li_btn_donate show-page-loading-msg" id="' + response[i].projectID +'" name="page_org_li_donation">DONÉR</a>'+
				'</div>'+
				'</div>'+
				'</li>';
			}
			$('ul[name=projectList]').html(projectCode);
		},
		error : function(){
			alert("Trying to print projectList connected to: " + organizationNr + ", in organization.js but getting error in ajax request");
		}
	});

}






