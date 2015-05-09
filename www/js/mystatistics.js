$( document ).on( "pagebeforeshow", "#page_mystatistics",function() {
	showStats();
	listDonations();
});


$( document ).on("pageinit","#page_mystatsDonations",  function() {
	
});


$(".footer_me").click(function() {
	showStats();
});

function showStats(){
	var current_date = new Date();
	var month = new Array();
	month[0] = "Januar";
	month[1] = "Februar";
	month[2] = "Mars";
	month[3] = "April";
	month[4] = "Mai";
	month[5] = "Juni";
	month[6] = "Juli";
	month[7] = "August";
	month[8] = "September";
	month[9] = "Oktober";
	month[10] = "November";
	month[11] = "Desember";

	var current_month = month[current_date.getMonth()];

	$('span[name=current_month]').text(current_month);

	var email = localStorage.getItem('userID');
	var sql = "SELECT * FROM User WHERE email = '"+email+"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){

			$('div[name="user_name"]').text(json[0].name);
			$('img[name=logo]').attr('src',(json[0].picURL==null?"../img/no_image_avaliable.png":json[0].picURL));
			getMyDonationInformation();
			getChallenges();
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});


	$('div[name="user_name"]').text('Full name goes here');
	
}

function getChallenges(){
	var email = localStorage.getItem('userID');
	var sql = "SELECT * FROM challenge WHERE to_user = '"+email+"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var numChallenges = json.length;
			if(numChallenges != 0){
				showChallengeNotif(numChallenges);
			}
			$('#mystats_num_challenges').text(numChallenges);
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});
}


function getMyDonationInformation(){

	var email = localStorage.getItem('userID');
	var sql = "SELECT * FROM Donation WHERE email = '"+email+"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var num_donations = 0;
			var sum_current_month = 0;
			var sum_total = 0;

			for(var i = 0; i < json.length; i++){
				var t = json[i].date.split(/[- :]/);
				var date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

				if(date.getMonth() == new Date().getMonth()){
					
					sum_current_month += parseInt(json[i].sum);
				}
				num_donations++;
				sum_total += parseInt(json[i].sum);
			}

			
			$('span[name=amount_current_month]').text(sum_current_month);
			$('span[name=total_amount]').text(sum_total);
			if(num_donations == 1){
				$('span[name=is_pluar]').text("Donasjon");
			}else{
				$('span[name=is_pluar]').text("Donasjoner");
			}
			if(num_donations == 0){
				$('span[name=num_donations]').text("Ingen");
				$('span[name=is_pluar]').text("donasjoner");
			}else{
				$('span[name=num_donations]').text(num_donations);
			}
			
			return json;
			//alert(text);
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});
}

function listDonations(){
	var email = localStorage.getItem('userID');
	//var sql = "SELECT * FROM Donation WHERE email = '"+email+"'";
	var sql ="SELECT don.*, pro.name as projectName FROM donation as don join project as pro on (pro.projectID = don.projectID ) WHERE email = '"+email+"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){

			var donations = "";

			var num_donations = 0;
			var sum_current_month = 0;
			var sum_total = 0;

			for(var i = 0; i < json.length; i++){

				donations +=
				'<li id="' + json[i].projectID +'"  donation="' + json[i].donationID +'" active="'+
					(json[i].active == 1 ? 'true">':'false">')+
					'<div class="li_container">' +
						'<div class="li_left"><div class="donationItem">'+(i+1)+'</div></div>'+
						'<div class="li_mid">'+
							'<div class="li_project large">' + json[i].projectName + '</div>'+
							'<span class="li_donation grey">' + json[i].sum + ' kr</span> <span'+
							(json[i].type == 'fast'?' class="green">fast':'>')+'</span><span style="float:right;margin-right:5pt; font-size:small" class="grey">'+
							formatDate(json[i].date)+'</span>'+
						'</div>'+
						'<div class="li_right">'+
							//(json[i].type == 'fast'?'<img src="donation_cancel.png"':'')+
							((json[i].type == 'fast' ? (json[i].active == 1 ? 'Aktiv':'Stoppet') : '' ))+
						'</div>'+
					'</div>'+
					'</li>';
			}
			$("#donationList").html(donations);
			$("#donationList li .li_mid,#donationList li .li_left,#donationList li .li_right").click(function() {
				var projectID =$(this).parent().parent().attr("id");
				var donationID =$(this).parent().parent().attr("donation");
				var active = $(this).parent().parent().attr("active");

				if($(this).attr("class") == "li_right"){
					if(active == "true"){
						if (confirm("Stoppe donasjonen?") == true) {
						stopDonation(donationID,$(this));
						}else{
							return;
						}	
					}else{
						if (confirm("Aktivere donasjonen igjen?") == true) {
						startDonation(donationID,$(this));
						}else{
							return;
						}
					}
							
				}else{
					localStorage.setItem("projectToShow", projectID);
					$.mobile.changePage("#page_project");
					location.reload();
					//alert("file: organization.js: projectList is clicked, setting projectIDto Show: " + localStorage.getItem('projectToShow'));		
				}
			});
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});	
}

function stopDonation(donationID,div){
	var sql = "update donation set active = 0 where donationID = "+donationID;
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"text",
		data:{"setSQL":sql},
		success: function(response){
			//alert("Donasjon stoppet!");
			div.html("Stoppet");
			div.closest("li").attr("active","false");
		},
		error: function(response){
			alert("Kunne ikke stoppe donasjonen.");
		}
	});

	return;
}

function startDonation(donationID,div){

	var userID, projectID,type,sum;
	var sql = "SELECT * FROM donation where donationID = "+donationID;
	var url = getURLappBackend();

	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: {"getSQL":sql},
		success: function(r){
			userID = r[0].email;
			projectID = r[0].projectID;
			type = r[0].type;
			sum = r[0].sum;
			
			var txt = r[0].donationID +", "+r[0].projectID  +", "+r[0].email+", "+r[0].type +", "+r[0].sum +", "+r[0].active;
			//alert(txt);

			sql = "UPDATE donation set active = 1 where donationID = "+donationID;

			$.ajax({
				type :"POST",
				url : url,
				dataType : "text",
				data : {'setSQL' : sql},
				success : function(response){
					//alert("Donasjon aktivert!");
					div.html("Aktiv");
					div.closest("li").attr("active","true");
					//window.location.reload();

				},
				error : function(response){
					alert("Error in setSQL:"+ response);
				}
			});
		},
		error: function(response){
			alert("error in getSQL:"+json.stringify(response));
		}

	});
}

function showChallengeNotif(n){
	$("#challenges").hide();
	$(".footer_me").each(function(){
		$(this).find(".notification").remove();
		$("#challenges").html("Du har <span class='red small'>"+n+"</span> ny"+(n==1?"":"e")+" utfordring"+(n==1?"":"er")+".");
		if(n>0){
			$("#challenges").show();
			$(this).append("<div class='notification'>"+n+"</div>");
			$("#challenges").append(" <a href='#page_challenges'>Se fra hvem</a>");
		}
		
	});		
}

$(document).on("pagebeforeshow","#page_challenges",function(){
	console.log("before");
	var challengeList = $("#challengeList");
	var sql="select d.*, c.*,u.name as fromName, u.picURL, p.name as projectName, o.name as orgName from donation as d join challenge as c on c.donationID = d.donationID join user as u on u.email like c.from_user join project as p on p.projectID = d.projectID join organization as o on o.organizationNr = p.organizationNr and c.to_user like '"+localStorage.getItem("userID")+"'";
	console.log(sql);
	var url = getURLappBackend();
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: {"getSQL":sql},
		success: function(response){
			var challengeListHTML="";
			for(var i=0;i<response.length;i++){
				var leftCode = response[i].picURL == null?'':'<img src="'+response[i].picURL+'">';
				console.log(response[i].picURL);
				challengeListHTML+=
					'<li id="'+response[i].challengeID+'">'
						+'<div class="li_container">'
							+'<div class="li_left">'
								+'<div class="circlegrey">'+leftCode+'</div>'
							+'</div>'
							+'<div class="li_mid">'
								+'<div class="li_mid_top">'
									+'<span class="challenge_from" class="challenge_from small">'+response[i].fromName+'</span>'									
								+'</div>'
								+'<div class="li_mid_bottom">'
									+'<span id="challenge_date" class="challenge_date x-small grey">'+formatDate(response[i].date)+'</span>'
									+'<span id="challenge_status" class="challenge_status x-small red">'+(response[i].completed==null?"Ubesvart":"")+'</span>'
								+'</div>'
								+'<a href="#" class="ui-btn x-small ui-btn-icon-right caret-d-white btn_challenge_showmore">Mer info</a>'
							+'</div>'							
						+'</div>'
						+'<div class="chall_dd">'
							+'<div class="chall_dd_left">'
								+'<div class="dd_donationinfo small">'
									+'<span class="challenge_from" >'+response[i].fromName+'</span>'
									+' har donert <span id="dd_challenge_amount" class="red">'+response[i].sum+'</span>'
									+' kr til <span id="dd_challenge_org" class="green">'+response[i].orgName+'</span>'
									+' og deres prosjekt <span id="dd_challenge_project"  class="blue">'+response[i].projectName+'</span>'
									+' og utfordrer deg til å gjøre det samme!'
								+'</div>'
								+'<a href="#" class="ui-btn small grey answerbtn btn_decline" id="'+response[i].challengeID+'">Ikke denne gangen</a>'
							+'</div>'
							+'<div class="chall_dd_right">'
								+'<img src="../img/quote-grey.png"/>'
								+'<div class="div_donationmessage">'
									+'<div class="donationmessage small">'+response[i].message+'</div>'
									+'<span class="x-small grey right">- <span class="challenge_from grey">'+response[i].fromName+'</span></span>'
								+'</div>'								
								+'<a href="#" class="ui-btn small grey answerbtn btn_accept"  id="'+response[i].challengeID+'">Jeg tar utfordringen!</a>'
							+'</div>'
						+'</div>'
					+'</li>';
				challengeList.html(challengeListHTML);

				// When click on 'More info'-button
				$(".btn_challenge_showmore").off("click").click(function(){
					var thisChallengeID = $(this).closest("li").attr("id");
					var thisBtn = $(this).closest("li").find(".btn_challenge_showmore");
					// Close all other infodiv and set their button-arrow to 'down'
					$(".chall_dd").each(function(){
						var btn = $(this).closest("li").find(".btn_challenge_showmore");
						btn.removeClass("caret-u-white").addClass("caret-d-white");
						var challengeID = $(this).closest("li").attr("id");
						if(thisChallengeID!=challengeID){
							$(this).hide();
						}
					});
					// Set correct button-arrow on this button
					$(this).closest("li").find(".chall_dd").toggle();
					if($(this).closest("li").find(".chall_dd").is(":visible"))
						thisBtn.removeClass("caret-d-white").addClass("caret-u-white");
					else{
						thisBtn.removeClass("caret-u-white").addClass("caret-d-white");
					}
				});

				$(".btn_accept").off("click").click(function(){
					var challengeID = $(this).attr("id");
					acceptChallenge(challengeID);
				});

				$(".btn_decline").off("click").click(function(){
					var challengeID = $(this).attr("id");
					declineChallenge(challengeID);
				});
			}

		}
	});

});
$(document).on("pageshow","#page_challenges",function(){
	$(".chall_dd").hide();
});

function acceptChallenge(challengeID){
	alert("I ACCEPT YOUR PUNY CHALLENGE!");

}

function declineChallenge(challengeID){
	alert("I DECLINE YOUR PATHETIC CHALLENGE!");
}