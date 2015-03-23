$(document).ready(function(){

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
					response[i].date_added +"IKKETEST" + 
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

					$(".dots").dotdotdot();
				}
				$('ul[name=newsListProject]').html(newsCode);
			}
		});
	}
});
