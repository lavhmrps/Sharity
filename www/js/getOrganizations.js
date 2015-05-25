$(document).on("pageinit","#page_overview",function(){
	$("#showOrgsOrProjects").click(function(){
		var nowShowing = $("#orgList").attr("name");
		if(nowShowing == "organizationList"){
			$(this).html("Prosjekter");
			listProjects();
		}else if(nowShowing == "projectList"){
			
			listOrgs();
		}else{
			console.log("nowShowing= "+nowShowing);
		}
	});
	
	$(document).on('click', 'li[name=organization_list]', function() {
		localStorage.setItem('organizationToShow', this.id);
	});
	$(document).on('click', 'li[name=project_list]', function() {;
		localStorage.setItem('projectToShow', this.id);
	});

	$('button[name=logut]').click(function(){
		localStorage.clear();
		window.location.replace("../index.html");
	});

});

$(document).on("pagebeforeshow","#page_overview",function(){
	listOrgs();
});

function listProjects(){
	$("#showOrgsOrProjects").html("Prosjekter");
	$("#listTitle").html("Alle Prosjekter");
	$("#orgList").attr("name","projectList");

	var sql ="select p.*, o.name as orgName from project as p join organization as o on o.organizationNr = p.organizationNr";
	var url = getURLappBackend();
	var projectsCode="";
	$.ajax({
		type : "POST",
		url : url,
		dataType: "json",
		data : {'getSQL' : sql},
		success : function(response){
			if(response.length == 0){
				projectsCode += '<li><div class="li_container">'+
				'<div class="li_left">'+
				'<div class="circlegrey">'+
				'</div>'+
				'</div>'+
				'<div class="li_mid">'+
				'<span class="li_org_name" style="white-space:normal;">Det finnes ingen prosjekter i databasen</span>'+
				'<span class="li_num_projects"></span>'+
				'</div>'+
				'<div class="li_right">'+
				'</div>'+
				'</div></li>';
				$("#orgList").html(projectsCode);
			} 
			else{
				projectsCode = "";
				for(var i = 0 ; i < response.length; i++){	
					projectsCode += '<li name="project_list" class="result" id="'+ response[i].projectID +'">' +
					'<div class="li_container">'+
					'<div class="li_left">'+
					'<div class="circlegrey">'+
					'<img src="' + (response[i].logoURL == null? "../img/no_image_avaliable.png":response[i].logoURL) + '"/>'+
					'</div>'+
					'</div>'+
					'<div class="li_mid">'+
					'<span class="li_project_name">' + 
					response[i].name +
					'</span>'+
					'<span class="li_projects_org_name">'+
					response[i].orgName+
					'</span>'+
					'</div>'+
					'<div class="li_right">'+
					'<img src="../img/li_arrow_r_grey.png"/>'+
					'</div>'+
					'</div>'+
					'</li>';
				}
				$("#orgList").html(projectsCode);

				$("#page_overview li[name=project_list]").off("click").click(function(){
					var projectID = $(this).attr("id");
					localStorage.setItem("projectToShow",projectID);
					$.mobile.changePage("#page_project",{"transition":"slide"});
				});
			}
		},
		error: function(){
			alert("getOrganization.js feil i kontakt med " + url + ", serverbackendfeil");
		}
	});


}

function listOrgs(){
	$("#showOrgsOrProjects").html("Organisasjoner");
	$("#listTitle").html("Alle Organisasjoner");
	$("#orgList").attr("name","organizationList");


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
				'<div class="circlegrey">'+
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
					orgCode += '<li name="organization_list" class="result" id="'+ response[i].organizationNr +'">' + 
					'<div class="li_container">'+
					'<div class="li_left">'+
					'<div class="circlegrey">'+
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
					'</li>';
				}
				$("#orgList").html(orgCode);

				$("#page_overview li[name=organization_list]").off("click").click(function(){
					var orgNr = $(this).attr("id");
					localStorage.setItem("organizationToShow",orgNr);
					$.mobile.changePage("#page_organization",{"transition":"slide"});
				});
			}
		},
		error: function(){
			alert("getOrganization.js feil i kontakt med " + url + ", serverbackendfeil");
		}
	});
}