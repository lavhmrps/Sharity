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
	
	var sql = "select n.*, o.name as orgName from news as n join project as p on n.projectID = p.projectID join organization as o on p.organizationNr = o.organizationNr where newsID ="+newsID;
	//console.log(sql);
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
			$("span[name=date]").text(formatDate(response[0].date_added));
			$("span[name=title]").text(response[0].title);
			$("span[name=ingress]").text(response[0].txt);

			$('img[name=backgroundImg]').show();
			$('img[name=backgroundImg]').error(function(){
				$(this).hide();
			});
			$('img[name=orglogo]').show();
			$('img[name=orglogo]').error(function(){
				$(this).hide();
			});
		}
	});

	
	var sql = "SELECT * FROM News WHERE projectID ='" + projectID + "'";
	//console.log(sql);
	var url = getURLappBackend();
	$.ajax({
		type : "POST",
		url : url,
		dataType: "JSON",
		data : {"getSQL" : sql},
		success : function(response){
			var newsCode = "",leftCode="";
			for(var i = 0; i < response.length; i++){
				var img = response[i].backgroundimgURL;
				leftCode = (img==""?'<div class="circle"></div>':'<a href="#popupPhotoLandscapePageNews" data-rel="popup" data-position-to="window" class=""><img src="'+response[i].backgroundimgURL+'" id="'+response[i].newsID+'"></a>');
				newsCode += 
				'<li id="' + response[i].newsID + '" name="news_list">'+
				'<a href="#page_news" rel="external" class="show-page-loading-msg">'+
				'<div class="li_container">'+
				'<div class="li_left">'+
				leftCode+
				'</div>'+
				'<div class="li_mid">'+
				'<span class="small grey">'+
				formatDate(response[i].date_added) + 
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
			$('ul[name=newsListProjectPageNews]').html(newsCode);


			$("li img").each(function(){
				$(this).error(function(){
					$(this).parent().parent().html('<div class="circle"></div>');
					$(this).parent().remove();
				});
				$(this).off("click").click(function(){
					$("#popupPhotoLandscapePageNews img").attr("src",$(this).attr("src"));
				});
			});
		}
	});
}