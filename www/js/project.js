$(document).delegate("#page_project", "pagebeforeshow",function(){

	$('a[name=follow_this_project]').click(function(){
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
							
							if(response == "OK"){
								alert("subscription was added with response: " + response);
							}
						},
						error : function(){
							alert("project.js trying to insert subscription but ajax request failed");
						}
					});

				}else{
					alert("project.js : trying to insert new subscription, brukeren abonnerer allerede på prosjektet");
				}
			}
		});
	});
});


$(document).delegate("#page_project", "pagebeforeshow", function() {
		showProject();
});


$(document.body).on('click', 'li[name=news_list]', function() {
	localStorage.setItem('newsToShow', this.id);
		//alert("file: project.js: setting newsToShow in localStorage: " + localStorage.getItem('newsToShow'));

	});

$(document.body).on('click', 'li[name=project_list]', function() {
		//alert("File: project.js, trying to show projectNr: " + localStorage.getItem('projectToShow'));
		showProject();

	});



function showProject(){

	var projectID = localStorage.getItem("projectToShow");
	var sql = "SELECT * FROM Project WHERE projectID ='" + projectID + "'";
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
			$('h2[name=project_title]').text(project_title);
			$('p[name=ingress]').text(about_project);
			$('span[name=project_country]').text(project_country);
			$('span[name=project_city]').text(project_city);
			$('img[name=background]').attr("src", background);

			appendNewsList(projectID);


		}
	});
}
function appendNewsList(projectID){

	var newsCode = "";
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
				newsCode += 
				'<li id="' + response[i].newsID + '" name="news_list">'+
				'<a href="#page_news" rel="external" class="show-page-loading-msg">'+
				'<div class="li_container">'+
				'<div class="li_left">'+
				'<div class="circle"></div>'+
				'</div>'+
				'<div class="li_mid">'+
				'<span class="li_date">'+
				response[i].date_added  + 
				'</span>'+
				'<div class="li_text dots">'+
				response[i].txt +
				'</div>'+
				'</div>'+
				'<div class="li_right">'+
				'<img src="../img/li_arrow_r_grey.png">'+
				'</div>'+
				'</div>'+
				'</a>'+
				'</li>';


				$('#orgLogo').html();

			}
			$('ul[name=newsListProject]').html(newsCode);
		}
	});
}
