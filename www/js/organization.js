$(document).on("pageinit","#page_organization",function(){
	// Clicking on newslink will scroll automatically down to newssection
	$("#linkPageOrgNews").click(function(){
		$('html, body').animate({scrollTop: $("#sectionOrgNews").offset().top}, 600);	

	});
	
	// Saving information on who to donate to
	$(document).on('click', 'a[name="page_org_donation"]', function() {
		localStorage.setItem("donateToOrganization",localStorage.getItem("organizationToShow"));
	});

	$(document).on('click', 'a[name="page_org_li_donation"]', function() {
		localStorage.setItem("donateToProject",this.id);
	});
});

$(document).on( "pagebeforeshow","#page_organization", function() {
	showOrganization();
	getNews();
	

	$(document).on('click', 'li[name=organization_list]', function() {
		showOrganization();
	});

	$(document).on('click', 'li[name=project_list]', function() {
		localStorage.setItem("projectToShow", this.id);
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

				updateBreadcrumbOrganization();

				$('p[name=organization_name]').text(organization_name); 
				$('span[name=category]').text(category);
				$('span[name=organization_name]').text(organization_name);
				$('span[name=ingress]').text(about_organization); 

				$('img[name=background]').show();
				$('img[name=logo]').show();
				$('img[name=background]').attr("src", (backgroundimgURL==null?"#":backgroundimgURL));
				$('img[name=logo]').attr("src", (logoURL==null?"#":logoURL));

				appendProjectList(organizationNr);
				$('img[name=background]').error(function(){
					$(this).hide();
				});
				$('img[name=logo]').error(function(){
					$(this).hide();
				});

			},
			error: function(response){
				alert("Error in organization.js trying to print projectlist for: "+ organizationNr +"  ajax bad request:\n"+JSON.stringify(response));
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
				'<div class="circlegrey"><img src="'+
				(response[i].logoURL == null? "../img/no_image_avaliable.png":response[i].logoURL)+
				'"></div>'+
				'</div>'+
				'<div class="li_mid dots">'+
				'<div class="li_heading">' + response[i].name + '</div>'+
				'</div>'+
				'<div class="li_right">'+
				'<a href="#page_donate" rel="external" class="li_btn_donate show-page-loading-msg" id="' + response[i].projectID +'" name="page_org_li_donation">DONÉR</a>'+
				'</div>'+
				'</div>'+
				'</li>';
			} if (response.length==0)
				projectCode = "<span class='small grey'>Ingen prosjekter</span>";
			$('ul[name=projectList]').html(projectCode).css("background",(response.length==0?"inherit":"white"));

			$("#page_organization li[name=project_list]").off("click").click(function(){
				var projectID = $(this).attr("id");
				localStorage.setItem("projectToShow",projectID);
				$.mobile.changePage("#page_project",{"transition":"slide"});
			})
		},
		error : function(error){
			alert("Trying to print projectList connected to: " + organizationNr + ", in organization.js but getting error in ajax request:\n"+JSON.stringify(error));
		}
	});

}

function getNews(){
// Getting all the news from projects
	var sql = "select p.name as projectName, n.* from organization as o join project as p "+
			"on o.organizationNr = p.organizationNr join news as n on n.projectID = p.projectID "+
			"where o.organizationNr= "+localStorage.getItem("organizationToShow")+" order by date_added desc";
	
	var url = getURLappBackend();
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			var newsHTML ="";
			for(var i =0; i < response.length;i++){
				newsHTML += '<div class="portrait"><img src="'+response[i].backgroundimgURL+'" id="homeNewsBackgroundImage'+i+'"></div>'+
					'<article><span class="blue small project" projectID="'+response[i].projectID+'">'+response[i].projectName+
					'</span> <span class="grey small right">'+formatDate(response[i].date_added)+'</span>'+
					'<h2 class="blue" id="homeNewsTitle'+i+'">'+response[i].title+'</h2>'+
					'<p id="homeNewsContent'+i+'">'+response[i].txt +'</p>'+
					'</article><div class="article_separator"></div>';
			}
			if(response.length == 0)
				newsHTML ="<span class='small grey'>Ingen nyheter</span>";

			$("#pageOrgNews").html(newsHTML);
			$("#pageOrgNews .project").click(function(){
				localStorage.setItem("projectToShow",$(this).attr("projectID")) ;
				$.mobile.changePage("#page_project",{"transition":"slide"});
			});


			for(var i =0; i < response.length;i++){
				$("#homeNewsBackgroundImage"+i).error(function(){
					$(this).remove();
					
				});
			}
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home get orgNumDonations: "+response);
		}
	});

}

function updateBreadcrumbOrganization(){
	var orgName = localStorage.getItem("orgName");
	var bcHTML = '<span id="bcOverview" class="white">Oversikt</span>';
	bcHTML += '<span class="green"> > </span>';
	bcHTML +=  '<span id="bcOrganization" class="white">'+orgName+'</span>';

	$(".breadcrumb").html(bcHTML);

	$("#bcOverview").off("click").click(function(){
		$.mobile.changePage("#page_overview");
	})
}
