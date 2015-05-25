$(document).on("pagebeforeshow","#page_project", function() {
		showProject();
		checkSubStatus(localStorage.getItem("userID"),localStorage.getItem("projectToShow"))
});

$(document).on( "pageinit","#page_project",function(){
	var projectID = localStorage.getItem("projectToShow");
	var email = localStorage.getItem('userID');
	checkSubStatus(email,projectID);

	$("img[name=orglogo]").click(function(){
		var orgID = $(this).attr("orgid");
		localStorage.setItem("organizationToShow",orgID);
		$.mobile.changePage("#page_organization",{"transition":"flip"});
	});
	

	$('span[name=follow_this_project]').click(function(){
		var projectID = localStorage.getItem("projectToShow");
		var email = localStorage.getItem('userID');

		var data = {"getSQL" : "SELECT * FROM subscription WHERE email = '"+email+"' AND projectID = '"+projectID+"'"};

		var url = getURLappBackend();
		$.ajax({
			type : "POST",
			url : url,
			data : data,
			dataType : "json",
			success : function(json){
				if(json.length == 0){
					var data = {"setSQL" :  "INSERT INTO subscription (email, projectID) VALUES ('"+email+"', '"+projectID+"')"};
					$.ajax({
						type: "POST",
						url : url,
						data : data,
						dataType : "text",
						success : function(response){
							$("#followerstatus").html("Følger");
							$("#changeFollowerstatus").html("Ikke følg");
							//$('span[name=follow_this_project]').html("Ikke følg");

						},
						error : function(){
							alert("project.js trying to insert subscription but ajax request failed");
						}
					});

				}else{
					var sql ="delete from subscription where email like '"+email+"' and projectID = "+projectID;

					$.ajax({
						type:"post",
						url:url,
						dataType:"text",
						data:{"setSQL":sql},
						success:function(response){
							$("#followerstatus").html("Følger ikke");
							$("#changeFollowerstatus").html("Følg prosjekt");
						}
					});
					
				}
			}
		});
	});

	$(document).on('click', 'a[name="page_project_donation"]', function() {
		localStorage.setItem("donateToProject",localStorage.getItem("projectToShow"));
	});

	$(document).on('click', 'li[name=news_list]', function() {
		localStorage.setItem('newsToShow', this.id);
			//alert("file: project.js: setting newsToShow in localStorage: " + localStorage.getItem('newsToShow'));

		});

	$(document).on('click', 'li[name=project_list]', function() {
		//alert("File: project.js, trying to show projectNr: " + localStorage.getItem('projectToShow'));
		showProject();
	});
});

function checkSubStatus(email,projectID){
	var url = getURLappBackend();
	var sql = "SELECT * FROM subscription WHERE email = '"+email+"' AND projectID = "+projectID;
	
	$.ajax({
		type : "POST",
		url : url,
		data : {"getSQL":sql},
		dataType : "json",
		success : function(response){
			$("#followerstatus").html(response.length == 0?"Følger ikke":"Følger");
			$("#changeFollowerstatus").html(response.length == 0?"Følg Prosjekt":"Ikke følg");
		}
	});
}

function showProject(){

	var projectID = localStorage.getItem("projectToShow");
	var sql = "SELECT o.logoURL as orgLogo, p.* FROM Project as p join organization as o on o.organizationNr = p.organizationNr WHERE projectID ='" + projectID + "'";
	var url = getURLappBackend();
	$.ajax({
		type : "POST",
		url : url,
		dataType: "json",
		data : {"getSQL" : sql},
		success : function(response){
			var project_name = response[0].name;
			var project_title = response[0].title;
			var about_project = response[0].about;
			var project_city = response[0].city;
			var project_country = response[0].country;
			var background = response[0].backgroundimgURL;

			$('p[name=project_name]').text(project_name);
			localStorage.setItem("projectName", project_name);
			$('span[name=project_title]').text(project_title);
			$('p[name=ingress]').text(about_project);
			$('span[name=project_country]').text(project_country);
			$('span[name=project_city]').text(project_city);
			$('img[name=background]').attr("src", background);
			$('img[name=orglogo]').attr("src",response[0].orgLogo).attr("orgid",response[0].organizationNr);
			localStorage.setItem("orgLogo",response[0].orgLogo)

			appendNewsList(projectID);

			updateBreadCrumbProject();
		}
	});
}
function appendNewsList(projectID){

	var newsCode = "",leftCode="";
	var sql = "SELECT * FROM News WHERE projectID ='" + projectID + "'";
	var url = getURLappBackend();
	$.ajax({
		type : "POST",
		url : url,
		dataType: "JSON",
		data : {"getSQL" : sql},
		success : function(response){
			if(response.length == 0){
				newsCode = '<li>Ingen nyheter</li>';
			}
				
			for(var i = 0; i < response.length; i++){
				var img = response[i].backgroundimgURL;
				leftCode = (img==""?'<div class="circlegrey"></div>':'<a href="#popupPhotoLandscapePageProject" data-rel="popup" data-position-to="window" class="">'
					+'<img src="'+response[i].backgroundimgURL+'" id="'+response[i].newsID+'"></a>');
				newsCode += 
				'<li id="' + response[i].newsID + '" name="news_list">'+
				'<div class="li_container">'+
				'<div class="li_left">'+
				leftCode+
				'</div>'+
				'<a href="#page_news"  data-transition="slide">'+
				'<div class="li_mid">'+
				'<span class="small grey">'+
				formatDate(response[i].date_added) +
				'</span>'+
				'<div class="li_text dots">'+
				response[i].txt +
				'</div>'+
				'</div>'+
				'<div class="li_right">'+
				'<img src="../img/li_arrow_r_grey.png"  class="icon" >'+
				'</div>'+
				'</div>'+
				'</a>'+
				'</li>';
			}
			$('ul[name=newsListProjectPageProject]').html(newsCode);
			
			$("ul[name=newsListProjectPageProject] li img").each(function(){
				$(this).error(function(){
					$(this).closest(".li_left").html('<div class="circlegrey"></div>');
				});
				$(this).off("click").click(function(){
					$.mobile.popup.prototype.options.history = false;
					$("#popupPhotoLandscapePageProject img").attr("src",$(this).attr("src"));
				});
			});
		}
	});
}

function updateBreadCrumbProject(){
	var orgName = localStorage.getItem("orgName");
	var projectName = localStorage.getItem("projectName");
	var bcHTML = '<span id="bcOverview" class="white">Oversikt</span>';
	bcHTML += '<span class="green"> > </span>';
	bcHTML +=  '<span id="bcOrganization" class="white">'+orgName+'</span>';
	bcHTML += '<span class="green"> > </span>';
	bcHTML +=  '<span id="bcProject" class="white">'+projectName+'</span>';

	$(".breadcrumb").html(bcHTML);

	$("#bcOverview").off("click").click(function(){
		$.mobile.changePage("#page_overview");
	});
	$("#bcOrganization").off("click").click(function(){
		$.mobile.changePage("#page_organization");
	});
}