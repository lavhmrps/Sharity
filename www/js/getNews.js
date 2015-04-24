$(document).ready(function(){
	$(document).on('click', 'li[name=news_list]', function() {
		localStorage.setItem('newsToShow', this.id);
		showNews();
	});
});

$(document).on("pageinit","#page_news",function(){
	
});

$(document).on("pagebeforeshow","#page_news",function(){
	showNews();
});

function showNews(){
	var newsID = localStorage.getItem("newsToShow");
	var projectID = localStorage.getItem("projectToShow");
	
	//var sql = "select * from news where newsID = " + newsID;
	var sql = "select news.*, org.name as orgName from news join project on (news.projectID ="+projectID+") join organization as org on (project.organizationNR like org.organizationNR) where newsID = "+newsID+" group by newsID";
	var url = getURLappBackend();

	$.ajax({
		type: "post",
		url: url,
		dataType: "json",
		data: {"getSQL" : sql},
		success: function(response){
			$("img[name=orglogo]").attr("src",localStorage.getItem("orgLogo"));
			$("img[name=backgroundImg]").attr("src",response[0].backgroundimgURL);
			$("p[name=orgname]").text(response[0].orgName);
			$("span[name=date]").text(response[0].date_added);
			$("span[name=title]").text(response[0].title);
			$("span[name=ingress]").text(response[0].txt);

			$('img[name=backgroundImg]').show();
			$('img[name=backgroundImg]').error(function(){
				$(this).hide();
			});
			$('img[name=orglogo]'),show();
			$('img[name=orglogo]').error(function(){
				$(this).hide();
			});
		}
	});

	
	var sql = "SELECT * FROM News WHERE projectID ='" + projectID + "'";
	var url = getURLappBackend();
	$.ajax({
		type : "POST",
		url : url,
		dataType: "JSON",
		data : {"getSQL" : sql},
		success : function(response){
			var newsCode = "";
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
				response[i].date_added + 
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
			}
			$('ul[name=newsListProject]').html(newsCode);
		}
	});
}