$(document).ready(function(){


	$(document.body).on('click', 'li', function() {
		setLocalStorageProjectToShow(this.id);

	});
	$(document.body).on('click', 'a[name="donation"]', function() {
		setLocalStorageProjectToShow(this.id);
	});

	var organizationNr = localStorage.getItem("organizationToShow");

	var sql = "SELECT * FROM Organization WHERE organizationNr ='" + organizationNr + "'";

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

			$('span[name=category]').append(category);
			$('p[name=organization_name]').text(organization_name); 
			$('h2[name=organization_name]').text(organization_name); 
			$('p[name=ingress]').text(about_organization); 
			$('img[name=logo]').attr("src", logoURL );
			$('img[name=background]').attr("src", backgroundimgURL);


			appendProjectList(organizationNr);
		},
		error: function(){
			alert("Error in organization.html js ajax bad request");
		}
	});

			/*
			*/


			function appendProjectList(organizationNr){
				var sql = "SELECT * FROM Project WHERE organizationNr ='" + organizationNr + "'";
				var url = getURLappBackend();
				$.ajax({
					type : "POST",
					url : url,
					dataType: "JSON",
					data : {"getSQL" : sql},
					success : function(response){
						for(var i = 0; i < response.length; i++){
							var projectCode = 
							'<li id="' + response[i].projectID +'">'+
							'<div class="li_container">' +
							'<div class="li_left">'+
							'<div class="li_circ"><img src="#"></div>'+
							'</div>'+
							'<a href="project.html" rel="external" class="show-page-loading-msg">'+
							'<div class="li_mid dots">'+
							'<span class="li_heading">' + response[i].name + '</span>'+
							'<span class="li_text"></span>'+
							'</div>'+
							'</a>'+
							'<div class="li_right">'+
							'<a href="donate.html" rel="external" class="li_btn_donate show-page-loading-msg" id="' + response[i].projectID +'" name="donation">DONÉR</a>'+
							'</div>'+
							'</div>'+
							'</li>';

							$('ul[name=projectList]').append(projectCode);
						}


					}
				});

			}

			function setLocalStorageProjectToShow(projectID){
				localStorage['projectToShow'] = projectID;
			}



		});	