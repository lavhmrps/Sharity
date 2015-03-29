//$(document).ready(function(){
$(document).delegate("#page_organization", "pagebeforeshow", function() {
	showOrganization();


	$(document.body).on('click', 'li[name=organization_list]', function() {
		showOrganization();
	});


	$(document.body).on('click', 'li[name=project_list]', function() {
		localStorage.setItem("projectToShow", this.id);

		//alert("file: organization.js: projectList is clicked, setting projectIDto Show: " + localStorage.getItem('projectToShow'));		
	});
	$(document.body).on('click', 'a[name="donation"]', function() {
		//setLocalStorageProjectToShow(this.id);
		
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
					var backgroundimgURL = response[0].backgroundimgURL;
					var organizationNr = response[0].organizationNr;
					
					$('span[name=category]').text(category);
					$('p[name=organization_name]').text(organization_name);
					localStorage.setItem("orgName", organization_name);
					$('h2[name=organization_name]').text(organization_name); 
					$('p[name=ingress]').text(about_organization); 
					$('img[name=logo]').attr("src", logoURL );
					$('img[name=background]').attr("src", backgroundimgURL);
					appendProjectList(organizationNr);
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
					'<a href="#page_donate" rel="external" class="li_btn_donate show-page-loading-msg" id="' + response[i].projectID +'" name="donation">DONÉR</a>'+
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
});	





