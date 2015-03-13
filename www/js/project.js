$(document).ready(function(){

	$(document.body).on('click', 'li', function() {
		alert("NewsID: " + this.id);

	});
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
	function appendNewsList(projectID){

		var sql = "SELECT * FROM News WHERE projectID ='" + projectID + "'";
		var url = getURLappBackend();
		$.ajax({
			type : "POST",
			url : url,
			dataType: "JSON",
			data : {"getSQL" : sql},
			success : function(response){

				for(var i = 0; i < response.length; i++){
					var newsCode = 
					'<li id="' + response[i].newsID + '">'+
					'<a href="news.html" rel="external" class="show-page-loading-msg">'+
					'<div class="li_container">'+
					'<div class="li_left">'+
					'<div class="circle"></div>'+
					'</div>'+
					'<div class="li_mid dots">'+
					'<span class="li_date">'+
					response[i].date_added + 
					'</span>'+
					'<span class="li_text">'+
					response[i].txt +
					'</span>'+
					'</div>'+
					'<div class="li_right">'+
					'<img src="../img/li_arrow_r_grey.png">'+
					'</div>'+
					'</div>'+
					'</a>'+
					'</li>';
					$('ul[name=newsList]').append(newsCode);
				}
			}
		});

	}
});