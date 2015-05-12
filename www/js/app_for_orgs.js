$(document).ready(function(){
	$("#logout").click(function(){
		localStorage.clear();
		window.location.href="../index.html";
	});

	$(".back_btn").click(function() {
		window.history.go(-1);
	});

});

$(document).on("pageinit","#page_org_home",function(){
	$("#rowPublishNew").click(function(){
		$.mobile.changePage("#page_org_publish_news",{"transition":"slide"});
		if(localStorage.getItem("orgLogoURL") != "null"){
			$("img[name=homeOrgLogo]").attr("src",localStorage.getItem("orgLogoURL"));
	}
	});
});

$(document).on("pagebeforeshow","#page_org_home",function(){
	// Getting organization-data and saving it locally
	var sql = "select * from organization where name like '"+localStorage.getItem("orgName")+"'";
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			localStorage.setItem("orgNr",response[0].organizationNr);
			localStorage.setItem("orgname",response[0].name);
			localStorage.setItem("orgCategory",response[0].category);
			localStorage.setItem("orgLogoURL",response[0].logoURL);
			localStorage.setItem("orgBackgroundURL",response[0].backgroundimgURL);
			localStorage.setItem("orgWebsite",response[0].website);
			localStorage.setItem("orgAbout",response[0].about);
			localStorage.setItem("orgDateAdded",response[0].date_added);
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home: "+response);
		}
	});
	// Getting total number of subs from all projects
	sql = "select o.name as orgname, count(*) as numSubs from organization as o right join project as p "+
			"on o.organizationNr = p.organizationNr right join subscription as s "+
			"on p.projectID = s.projectID where o.name like '"+localStorage.getItem("orgName")+"'";

		$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			localStorage.setItem("orgNumSubs",response[0].numSubs);
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home get orgNumSubs: "+response);
		}
	});

	// Getting total number of donations from all projects and the total sum
	sql = "select o.name, count(*) as numDonations ,sum(d.sum) as sumDonations from donation as d join project as p on d.projectID = p.projectID join organization as o on o.organizationNr = p.organizationNr where o.name like '"+localStorage.getItem("orgName")+"'";
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			localStorage.setItem("orgNumDonations",response[0].numDonations);
			localStorage.setItem("orgSumDonations",response[0].sumDonations);
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home get orgNumDonations: "+response);
		}
	});

	// Getting all the news from projects
	sql = "select p.name as projectName, n.* from organization as o join project as p "+
			"on o.organizationNr = p.organizationNr join news as n on n.projectID = p.projectID "+
			"where o.name like '"+localStorage.getItem("orgName")+"' order by date_added desc";
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			var newsHTML ="";
			for(var i =0; i < response.length;i++){
				newsHTML += 
					'<div class="portrait">'
						+'<img src="'+response[i].backgroundimgURL+'" id="homeNewsBackgroundImage'+i+'">'
					+'</div>'
					+'<article>'
						+'<span class="blue small">'+response[i].projectName+'</span>'
						+'<span class="grey small right">'+formatDate(response[i].date_added)+'</span>'
						+'<h2 class="blue" id="homeNewsTitle'+i+'">'+response[i].title+'</h2>'
						+'<p id="homeNewsContent'+i+'">'+response[i].txt 
							+'<span id="'+response[i].newsID+'" class="editnews small blue" style="float:right">Rediger</span>'
						+'</p>'
					+'</article>'
					+'<div class="article_separator"></div>';
			}
			if(response.length == 0)
				newsHTML ="<span class='small grey'>Ingen nyheter</span>";

			$("#homeOrgNews").html(newsHTML);

			for(var i =0; i < response.length;i++){
				$("#homeNewsBackgroundImage"+i).error(function(){
					$(this).remove();
					
				});
			}

			$(".editnews").off("click").click(function(){
				var newsID = $(this).attr("id");
				localStorage.setItem("newsIDtoEdit",newsID);
				$.mobile.changePage("#page_org_edit_news",{"transition":"slide"});
			});
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home get orgNumDonations: "+response);
		}
	});
});

$(document).on("pageshow","#page_org_home",function(){
	//console.log("pageshow");
	if(localStorage.getItem("orgLogoURL") != "null"){
		$("img[name=homeOrgLogo]").attr("src",localStorage.getItem("orgLogoURL"));
	}
	
	$("span[name=homeOrgCategory]").html(localStorage.getItem("orgCategory"));
	$("h2[name=homeOrgName]").html(localStorage.getItem("orgName"));
	console.log(localStorage.getItem("orgName"));
	$("span[name=homeOrgSumDonations]").html(localStorage.getItem("orgSumDonations"));
	var numSubs = localStorage.getItem("orgNumSubs");
	$("span[name=homeOrgNumFollowers]").html(numSubs);
	$("span[name=homeOrgSingularPluarFollowers]").html((numSubs==1?"følger":"følgere"));
	var numDonations = localStorage.getItem("orgNumDonations");
	$("span[name=homeOrgNumDonations]").html(numDonations);
	$("span[name=homeOrgSingularPluarDonations]").html((numDonations==1?"donasjon":"donasjoner"));

});

$(document).on("pageinit","#page_org_publish_news",function(){
	$("#selectedImage").hide();
	$('#add_image_icon').click(function(e) {
		$('#inputChooseImage').click();
	});
	$("#inputChooseImage").change(function (e) {
	    if(this.disabled) 
	    	return alert('File upload not supported!');
	    var F = this.files;
	    if(F && F[0]) 
	    	for(var i=0; i<F.length; i++) 
	    		readImage( F[i] );
	});

	$("#btnGetImgFromUrl").click(function(){
		var imgUrl = $("#inputUrl").val();
		var imageOK = false;

		$("#deleteImage").css("visibility","visible");
		$('#preview').html('<img src="'+imgUrl+'" id="selectedImage">').show();
		$("#selectedImage").error(function(){
			$("#deleteImage").css("visibility","hidden");
			alert("Feil på bilde");
			$(this).remove();
			resetPreview();
		});

		$('#preview img').off("click").click(function(){
			$('#inputChooseImage').click();
		});
	});

	$("#deleteImage").click(function(){
		resetPreview();
		$(this).css("visibility","hidden");
	});


	$("#btnCancelPublish").click(function(){
		$(".dd_publish_input").val(0);
		$(".publish_input").val("");
		$("#selectedImage").hide();
		resetPreview();

	});
	$("#btnCompletePublish").click(function(){
		var title = $("#news_title").val();
		var content = $("#news_content").val();
		var image = $("#selectedImage").attr("src");
		var projectID = $(".dd_publish_input").val();

		if(title == ""){
			alert("Vennligst lag en tittel til nyheten");
			return;
		}
		if(content == ""){
			alert("Nyheten har ikke innhold ennå");
			return;
		}
		if(projectID == "0"){
			alert("Velg et prosjekt");
			return;
		}

		var sql = "insert into news (title,txt,backgroundimgURL,projectID) values('"+title+"','"+content+"','"+image+"','"+projectID+"')"
		var url = getURLappBackend();

		$.ajax({
			type:"post",
			url:url,
			dataType:"text",
			data:{"setSQL":sql},
			success:function(response){
				if(response == "OK"){
					$(".dd_publish_input").val(0);
					$(".publish_input").val("");
					$("#selectedImage").hide();
					resetPreview();
					$("#inputUrl").val("");

					showMessage("Nyhet lagret");


					$(".back_btn").click();
				}

			}
		});

	});


});

$(document).on("pagebeforeshow","#page_org_publish_news",function(){
	var sql ="select projectID, name from project where organizationNr = "+localStorage.getItem("orgNr");
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			var ddHTML ="<option value='0'>Velg Prosjekt</option>";
			for(var i=0; i < response.length;i++)
				ddHTML+="<option value='"+response[i].projectID+"'>"+response[i].name+"</option>";
			$("#dd_projects").html(ddHTML);
		}
	});

});

$(document).on("pageinit","#page_org_edit_news",function(){

	$("#dd_news_e").change(function(e){

		var newsID = $(this).val();
		if(newsID == 0){
			$(".dd_publish_input").val(0);
			$(".publish_input").val("").prop("disabled","true");
			$("#selectedImage_e").hide();
			$("#inputUrl_e").val("").prop("disabled","true");
			resetPreview_e();
			return;
		}

		var sql = "select * from news where newsID =" +newsID;
		console.log(sql);
		$.ajax({
			type:"post",
			dataType:"json",
			data:{"getSQL":sql},
			url:getURLappBackend(),
			success: function (response) {
				$("#dd_projects_e").val(response[0].projectID);
				$("#news_title_e").val(response[0].title);
				$("#news_content_e").val(response[0].txt);
				$("#deleteImage_e").css("visibility","visible");
				$('#preview_e').html('<img src="'+response[0].backgroundimgURL+'" id="selectedImage_e">').show();
				//$("#selectedImage_e").attr("src",(response[0].backgroundimgURL));
				$("#inputUrl_e").val(response[0].backgroundimgURL);
				$("#selectedImage_e").error(function(){
					$("#deleteImage_e").css("visibility","hidden");
					console.log("error");
					$(this).remove();
					resetPreview_e_e();
				});
			}
		});
	});


	$('#add_image_icon_e').click(function(e) {
		$('#inputChooseImage_e').click();
	});
	$("#inputChooseImage_e").change(function (e) {

	    if(this.disabled) 
	    	return alert('File upload not supported!');
	    var F = this.files;
	    if(F && F[0]) 
	    	for(var i=0; i<F.length; i++) 
	    		readImage_e( F[i] );
	});

	$("#btnGetImgFromUrl_e").click(function(){

		var imgUrl = $("#inputUrl_e").val();
		var imageOK = false;

		$("#deleteImage_e").css("visibility","visible");
		$('#preview_e').html('<img src="'+imgUrl+'" id="selectedImage_e">').show();
		$("#selectedImage_e").error(function(){
			$("#deleteImage_e").css("visibility","hidden");
			alert("Feil på bilde");
			$(this).remove();
			resetPreview_e();
		});

		$('#preview_e img').off("click").click(function(){
			$('#inputChooseImage_e').click();
		});
	});

	$("#deleteImage_e").click(function(){
		resetPreview_e();
		$(this).css("visibility","hidden");
	});


	$("#btnCancelEdit").click(function(){

		$(".dd_publish_input").val(0);
		$(".publish_input").val("");
		$("#selectedImage_e").hide();
		resetPreview_e();

	});

	$("#btnCompleteEdit").click(function(){
		var newsID = $("#dd_news_e").val();
		var title = $("#news_title_e").val();
		var content = $("#news_content_e").val();
		var image = $("#selectedImage_e").attr("src");
		var projectID = $("#dd_projects_e").val();

		if(newsID == 0){
			alert("Velg en nyhet å redigere");
			return;
		}

		if(title == ""){
			alert("Vennligst lag en tittel til nyheten");
			return;
		}
		if(content == ""){
			alert("Nyheten har ikke innhold ennå");
			return;
		}
		if(projectID == "0"){
			alert("Velg et prosjekt til nyheten");
			return;
		}

		var sql = "update news set title = '"+title+"',txt ='"+content+"',backgroundimgURL = '"+image+"'where newsID = "+newsID;
		var url = getURLappBackend();

		$.ajax({
			type:"post",
			url:url,
			dataType:"text",
			data:{"setSQL":sql},
			success:function(response){
				if(response == "OK"){
					$(".dd_publish_input").val(0);
					$(".publish_input").val("");
					$("#selectedImage_e").hide();
					resetPreview_e();
					$("#inputUrl_e").val("");

					showMessage("Nyhet oppdatert");

					$(".back_btn").click();
				}

			}
		});

	});
});

$(document).on("pagebeforeshow","#page_org_edit_news",function(){
	var sql ="select * from news where newsID = "+localStorage.getItem("newsIDtoEdit");
	sql = "select p.name as projectName, n.* from organization as o join project as p "+
			"on o.organizationNr = p.organizationNr join news as n on n.projectID = p.projectID "+
			"where o.name like '"+localStorage.getItem("orgName")+"' order by date_added desc";
	console.log(sql);
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			var dd_news_HTML ="<option value='0'>Velg nyhet</option>";
			var dd_projects_HTML = "<option value='0'>Velg prosjekt</option>";
			var projects=[],
				numProjects=0;
			for(var i=0; i < response.length;i++){
				dd_news_HTML+="<option value='"+response[i].newsID+"'>"+response[i].title+"</option>";
				if (projects.indexOf(response[i].projectID) == -1){
					// Project not already in list
					projects[numProjects++]=response[i].projectID;
					console.log(projects.indexOf(response[i].projectID));
					dd_projects_HTML += "<option value='"+response[i].projectID+"'>"+response[i].projectName+"</option>";
				}
			}
			$("#dd_news_e").html(dd_news_HTML);
			$("#dd_projects_e").html(dd_projects_HTML);
		}
	});

	

});

$(document).on("pageshow","#page_org_edit_news",function(){
	var newsID = localStorage.getItem("newsIDtoEdit");
	if(newsID == null){
		$(".dd_publish_input").val(0);
		$(".publish_input").val("");
		$("#selectedImage_e").hide();
		$("#inputUrl_e").val("");
		resetPreview();
		return;
	}
	$("#dd_news_e").val(newsID);
	var sql = "select * from news where newsID =" +newsID;
		console.log(sql);
		$.ajax({
			type:"post",
			dataType:"json",
			data:{"getSQL":sql},
			url:getURLappBackend(),
			success: function (response) {
				$("#dd_projects_e").val(response[0].projectID);
				$("#news_title_e").val(response[0].title);
				$("#news_content_e").val(response[0].txt);
				$("#deleteImage_e").css("visibility","visible");
				$('#preview_e').html('<img src="'+response[0].backgroundimgURL+'" id="selectedImage_e">').show();
				//$("#selectedImage_e").attr("src",(response[0].backgroundimgURL));
				$("#inputUrl_e").val(response[0].backgroundimgURL);
				$("#selectedImage_e").error(function(){
					$("#deleteImage_e").css("visibility","hidden");
					console.log("error");
					$(this).remove();
					resetPreview_e();
				});
			}
		});
});

$(document).on("pagehide","#page_org_edit_news",function(){
	localStorage.removeItem("newsIDtoEdit");
});



$(document).on("pagebeforeshow","#page_org_activities",function(){
	var sql = "select * from project where project.organizationNr = "+localStorage.getItem("orgNr");
	url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			var projectSelectOptions ='<option value="0">Alle Prosjekter</option>';
			for(var i = 0; i < response.length;i++){
				projectSelectOptions += '<option value="'+(i+1)+'" id="'+response[i].projectID+'">'+response[i].name+'</option>';
			}
			$("select[name=actsSelectProject]").html(projectSelectOptions);
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_activities get projects: "+response);
		}
	});

});


$(document).on("pageshow","#page_org_activities",function(){
	
	$("span[name=actsNumDonations]").html(localStorage.getItem("orgNumDonations"));
	$("span[name=actsNumFollowers]").html(localStorage.getItem("orgNumSubs"));

	// When project in dropdownlist is changed
	$("select[name=actsSelectProject]").change(function(){
		var projectID = $("select[name=actsSelectProject] option:selected").attr("id");
		var sql = "select count(*) as numDonations from donation where donation.projectID = "+projectID;
		var url = getURLappBackend();

		$.ajax({
			type:"post",
			url:url,
			dataType:"json",
			data:{"getSQL":sql},
			success:function(response){
				//localStorage.setItem("projectID"+projectID+"NumDonations",response[0].numDonations);
				$("span[name=actsNumDonations]").html(response[0].numDonations);
			}
		});

		sql = "select count(*) as numFollowers from subscription where subscription.projectID = "+projectID;
		$.ajax({
			type:"post",
			url:url,
			dataType:"json",
			data:{"getSQL":sql},
			success:function(response){
				//localStorage.setItem("projectID"+projectID+"NumDonations",response[0].numDonations);
				$("span[name=actsNumFollowers]").html(response[0].numFollowers);
			}
		});
	});

	$(document).on("click","#actsProjectStats tr",function(){
		var projectID = $("select[name=actsSelectProject] option:selected").attr("id");
		var rowName = $(this).attr("name");
		if(rowName== "actsRowDonations")
			alert("Her skal det komme detaljer om donajonene");
		else if(rowName = "actsNumFollowers")
			alert("Her skal det komme detaljer om følgerene");
	})

});



// returns easily read date
function formatDate(date){
	// date : yyyy-mm-dd hh:mm:ss
	var formattedDate="";
	var year,month,day,hour,minute,second;
	year = date.substring(0,4);
	month = date.substring(5,7);
	day = date.substring(8,10);
	hour = date.substring(11,13);
	minute = date.substring(14,16);
	second = date.substring(17,19);

	year = year.substring(2,4);
	
	switch(month){
		case "01": month ="Jan";break;
		case "02": month ="Feb";break;
		case "03": month ="Mar";break;
		case "04": month ="Apr";break;
		case "05": month ="Mai";break;
		case "06": month ="Jun";break;
		case "07": month ="Jul";break;
		case "08": month ="Aug";break;
		case "09": month ="Sep";break;
		case "10": month ="Okt";break;
		case "11": month ="Nov";break;
		case "12": month ="Des";break;
	}
	if(day.indexOf("0") == 0) 
		day = day.substring(1,2);

	formattedDate = day+". "+month+"-"+year+" "+hour+":"+minute;

	return formattedDate;
}

function readImage(file) {
  
    var reader = new FileReader();
    var image  = new Image();
  
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        image.src    = _file.target.result;              // url.createObjectURL(file);
        image.onload = function() {
        	/*
            var w = this.width,
                h = this.height,
                t = file.type,                           // ext only: // file.type.split('/')[1],
                n = file.name,
                s = ~~(file.size/1024) +'KB';
			*/
            $('#preview').html('<img src="'+ this.src +'" id="selectedImage"> ');	//+w+'x'+h+' '+s+' '+t+' '+n+'<br>');
			$('#preview img').click(function(){
				$('#inputChooseImage').click();
			});
			$("#deleteImage").css("visibility","visible");
		};
        image.onerror= function() {
            alert('Ugyldig filtype: '+ file.type);
        };      
    };
    
}

function readImage_e(file) {
  
    var reader = new FileReader();
    var image  = new Image();
  
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        image.src    = _file.target.result;              // url.createObjectURL(file);
        image.onload = function() {
        	/*
            var w = this.width,
                h = this.height,
                t = file.type,                           // ext only: // file.type.split('/')[1],
                n = file.name,
                s = ~~(file.size/1024) +'KB';
			*/
            $('#preview_e').html('<img src="'+ this.src +'" id="selectedImage_e"> ');	//+w+'x'+h+' '+s+' '+t+' '+n+'<br>');
			$('#preview_e img').click(function(){
				$('#inputChooseImage_e').click();
			});
			$("#deleteImage_e").css("visibility","visible");
		};
        image.onerror= function() {
            alert('Ugyldig filtype: '+ file.type);
        };      
    };
    
}

function resetPreview(){
	$("#preview").html(	'<img src="../img/add-image-icon-grey2.png" id="add_image_icon" >');
	$("#deleteImage").css("visibility","hidden");
	$('#add_image_icon').off("click").click(function(){
		$('#inputChooseImage').click();
	});
	$("#inputUrl").val("");
}

function resetPreview_e(){
	$("#preview_e").html(	'<img src="../img/add-image-icon-grey2.png" id="add_image_icon_e" >');
	$("#deleteImage_e").css("visibility","hidden");
	$('#add_image_icon_e').off("click").click(function(){
		$('#inputChooseImage_e').click();
	});
	$("#inputUrl_e").val("");
}

function showMessage(message){
	console.log("showing message : "+message);
	$(".messagediv span").html(message).css("padding","3pt").fadeIn().delay(3000).fadeOut();
	//$("#messagetext").fadeIn().delay(3000).fadeOut();
}