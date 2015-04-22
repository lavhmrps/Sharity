$(document).ready(function(){
	$("#logout").click(function(){
		localStorage.clear();
		window.location.href="../index.html";
	})

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
			localStorage.setItem("orgID",response[0].organizationNr);
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
			console.log("numDonations: "+localStorage.getItem("orgNumDonations"));
		},
		error:function(response){
			console.log("error in ajax, pageinit #page_org_home get orgNumDonations: "+response);
		}
	});

	// Getting all the news from projects
	sql = "select p.name, n.* from organization as o join project as p on o.organizationNr = p.organizationNr join news as n on n.projectID = p.projectID where o.name like '"+localStorage.getItem("orgName")+"'";
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			console.log("numNews: "+response.length);
			var newsHTML ="";
			for(var i =0; i < response.length;i++){
				newsHTML += '<div class="portrait"><img src="'+response[i].backgroundimgURL+'" id="homeNewsBackgroundImage'+i+'"></div>'+
					'<article><h2 class="blue" id="homeNewsTitle'+i+'">'+response[i].title+'</h2>'+
					'<p id="homeNewsContent'+i+'">'+response[i].txt +'</p></article><div class="article_separator"></div>';
			}
			if(response.length == 0)
				newsHTML ="<span class='small grey'>Ingen nyheter</span>";
			$("#homeOrgNews").html(newsHTML);
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
});

$(document).on("pageshow","#page_org_home",function(){
	//console.log("pageshow");
	if(localStorage.getItem("orgLogoURL") != "null")
		$("img[name=homeOrgLogo]").attr("src",localStorage.getItem("orgLogoURL"));
	
	$("span[name=homeOrgCategory]").html(localStorage.getItem("orgCategory"));
	$("h2[name=homeOrgName]").html(localStorage.getItem("orgName"));
	$("span[name=homeOrgSumDonations]").html(localStorage.getItem("orgSumDonations"));
	var numSubs = localStorage.getItem("orgNumSubs");
	$("span[name=homeOrgNumFollowers]").html(numSubs);
	$("span[name=homeOrgSingularPluarFollowers]").html((numSubs==1?"følger":"følgere"));
	var numDonations = localStorage.getItem("orgNumDonations");
	$("span[name=homeOrgNumDonations]").html(numDonations);
	$("span[name=homeOrgSingularPluarDonations]").html((numDonations==1?"donasjon":"donasjoner"));

});

$(document).on("pagebeforeshow","#page_org_activities",function(){
	var sql = "select * from project where project.organizationNr = "+localStorage.getItem("orgID");
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

})

$(document).on("pageshow","#page_org_activities",function(){
	
	$("span[name=actsNumDonations]").html(localStorage.getItem("orgNumDonations"));
	$("span[name=actsNumFollowers]").html(localStorage.getItem("orgNumSubs"));

	// When project in dropdownlist is changed
	$("select[name=actsSelectProject]").change(function(){
		var projectID = $("select[name=actsSelectProject] option:selected").attr("id");
		var sql = "select count(*) as numDonations from donation where donation.projectID = "+projectID;
		url = getURLappBackend();

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