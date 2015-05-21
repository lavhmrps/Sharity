$( document ).on( "pagebeforeshow", "#page_mystatistics",function() {
	showStats();
});


$( document ).on("pagebeforeshow","#page_mystatsDonations",  function() {
	listDonations();
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
	var sql = "SELECT * FROM challenge WHERE to_user = '"+email+"' and response is null";
	//console.log(sql);
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var numChallenges = json.length;
			showChallengeNotif(numChallenges);
			
			$('#mystats_num_challenges').html(numChallenges + (numChallenges == 1?" ny ":" nye ")+"utfordring" + (numChallenges==1?"":"er"));
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
	var sql ="SELECT d.*, p.name as projectName, p.logoURL as logoURL FROM donation as d join project as p on (p.projectID = d.projectID ) "
			+"WHERE email = '"+email+"' order by date desc";
	console.log(sql);
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
				var img = json[i].logoURL;
				var imgHTML ="";
				if (img != null)
					imgHTML = '<img src="'+img+'">';

				donations +=
				'<li id="' + json[i].projectID +'"  donation="' + json[i].donationID +'" active="'+
					(json[i].active == 1 ? 'true">':'false">')+
					'<div class="li_container">' +
						//'<div class="li_left"><div class="donationItem">'+(i+1)+'</div></div>'+
						'<div class="li_left"><div class="circlegrey">'+imgHTML+'</div></div>'+
						'<div class="li_mid">'+
							'<div class="li_project large">' + json[i].projectName + '</div>'+
							'<span class="li_donation grey">' + json[i].sum + ' kr</span> <span'+
							(json[i].type == 'fast'?' class="green">fast':'>')+'</span><span  class="grey x-small right" style="line-height:15pt">'+
							//formatDate(json[i].date)+
							calcTime(json[i].date)+
							' siden</span>'+
						'</div>'+
						'<div class="li_right">'+
							((json[i].type == 'fast' ? (json[i].active == 1 ? '<img src="../img/ongoing.png" class="icon">':'<img src="../img/cancelled.png" class="icon">') : '' ))+
						'</div>'+
					'</div>'+
					'</li>';
			}
			$("#donationList").html(donations);
			$("#donationList li .li_mid,#donationList li .li_left,#donationList li .li_right").click(function() {
				var projectID =$(this).closest("li").attr("id");
				var donationID =$(this).closest("li").attr("donation");
				var active = $(this).closest("li").attr("active");

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
					$.mobile.changePage("#page_project",{"transition":"slideup"});
					//$.mobile.changePage("#page_project", {"transition":"slideup"});
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
			div.find("img").attr("src","../img/cancelled.png");
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
					div.find("img").attr("src","../img/ongoing.png");
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
	var challengeList = $("#challengeList"),
		challengeListHistory = $("#challengeListHistory");

	var sql="select d.*, c.*,u.name as fromName, u.picURL, p.name as projectName,o.organizationNr as orgNr, o.name as orgName from donation as d "
			+"join challenge as c on c.donationID = d.donationID join user as u on u.email like c.from_user "
			+"join project as p on p.projectID = d.projectID join organization as o on o.organizationNr = p.organizationNr "
			+"and c.to_user like '"+localStorage.getItem("userID")+"'";
	//console.log(sql);
	var url = getURLappBackend();
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: {"getSQL":sql},
		success: function(response){
			var challengeListHTML="", challengeListHistoryHTML ="";
			for(var i=0;i<response.length;i++){
				var leftCode = response[i].picURL == null?'':'<img src="'+response[i].picURL+'">';
				if(response[i].response == null){
					// Challenge is neither accepted nor declined
					challengeListHTML+=
						'<li id="'+response[i].challengeID+'" orgName="'+response[i].orgName+'" projectName="'+response[i].projectName
									+'" projectID="'+response[i].projectID+'" sum="'+response[i].sum+'">'
							+'<div class="li_container">'
								+'<div class="li_left">'
									+'<div class="circlegrey">'+leftCode+'</div>'
								+'</div>'
								+'<div class="li_mid">'
									+'<div class="li_mid_top">'
										+'<span class="challenge_from small" fromID="'+response[i].from_user+'">'+response[i].fromName+'</span>'
									+'</div>'
									+'<div class="li_mid_bottom">'
										+'<span id="challenge_date" class="challenge_date x-small grey">'+formatDate(response[i].date)+'</span>'
										+'<span id="challenge_status" class="challenge_status x-small red">'+(response[i].response==null?"Ubesvart":"")+'</span>'
									+'</div>'
									+'<a href="#" class="ui-btn x-small ui-btn-icon-right caret-d-white btn_challenge_showmore">Mer info</a>'
								+'</div>'							
							+'</div>'
							+'<div class="chall_dd">'
								+'<div class="chall_dd_left">'
									+'<div class="dd_donationinfo small">'
										+'<span class="challenge_from" fromID="'+response[i].from_user+'" >'+response[i].fromName+'</span>'
										+' har donert <span id="dd_challenge_amount" class="red">'+response[i].sum+'</span>'
										+' kr til <span class="challenge_to_org green" orgNr="'+response[i].orgNr+'">'+response[i].orgName+'</span>'
										+' og deres prosjekt <span class="challenge_to_project blue" projectID="'+response[i].projectID+'">'+response[i].projectName+'</span>'
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
					} else{
						// Challenge has been answered
						var responseIndicator = "<img src='../img/icon-check.png' class='responseIndicator' />";

						challengeListHistoryHTML+=
						'<li id="'+response[i].challengeID+'" orgName="'+response[i].orgName+'" projectName="'+response[i].projectName
									+'" projectID="'+response[i].projectID+'" sum="'+response[i].sum+'">'
							+'<div class="li_container">'
								+'<div class="li_left">'
									+'<div class="circlegrey">'+leftCode+'</div>'
								+'</div>'
								+'<div class="li_mid">'
									+'<div class="li_mid_top">'
										+'<span class="challenge_from small" fromID="'+response[i].from_user+'">'+response[i].fromName+'</span>'
									+'</div>'
									+'<div class="li_mid_bottom">'
										+'<span id="challenge_date" class="challenge_date x-small grey">'+formatDate(response[i].date)+'</span>'
										+'<span id="challenge_status" class="challenge_status x-small green">'+(response[i].response==null?"Ubesvart":"Har svart")+'</span>'
									+'</div>'
									+'<a href="#" class="ui-btn x-small ui-btn-icon-right caret-d-white btn_challenge_showmore">Mer info</a>'
								+'</div>'							
							+'</div>'
							+'<div class="chall_dd">'
							+'<span class=" x-small grey whenRespondedMsg">Utfordringen ble besvart '+formatDate(response[i].response_date)+' </span>'
								+'<div class="chall_dd_left">'
									+'<div class="dd_donationinfo small">'
										+'<span class="challenge_from" fromID="'+response[i].from_user+'" >'+response[i].fromName+'</span>'
										+' har donert <span id="dd_challenge_amount" class="red">'+response[i].sum+'</span>'
										+' kr til <span class="challenge_to_org green" orgNr="'+response[i].orgNr+'">'+response[i].orgName+'</span>'
										+' og deres prosjekt <span class="challenge_to_project blue" projectID="'+response[i].projectID+'">'+response[i].projectName+'</span>'
										+' og utfordrer deg til å gjøre det samme!'
									+'</div>'

									+(response[i].response == 0 ? responseIndicator:"")
									+'<a href="#" class="ui-btn small grey answerbtn btn_decline">Ikke denne gangen</a>'
								+'</div>'
								+'<div class="chall_dd_right">'
									+'<img src="../img/quote-grey.png"/>'
									+'<div class="div_donationmessage">'
										+'<div class="donationmessage small">'+response[i].message+'</div>'
										+'<span class="x-small grey right">- <span class="challenge_from grey">'+response[i].fromName+'</span></span>'
									+'</div>'	
									+(response[i].response == 1 ? responseIndicator:"")						
									+'<a href="#" class="ui-btn small grey answerbtn btn_accept">Jeg tar utfordringen!</a>'
								+'</div>'
							+'</div>'
						+'</li>';

					}
				} // for

				if (challengeListHTML == ""){
					// No active challenges
					challengeListHTML = '<li id="emptylist">Ingen nye utfordringer</li>';
				}
				if (challengeListHistoryHTML == ""){
					// No challenges responded to
					challengeListHistoryHTML = '<li id="emptylist">Ingen besvarte utfordringer</li>'
				}
				challengeList.html(challengeListHTML);
				challengeListHistory.html(challengeListHistoryHTML);

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

				$(".challenge_from").off("click").click(function(){
					var fromID = $(this).attr("fromID");
					localStorage.setItem("userIDtoShow",fromID);
					$.mobile.changePage("#page_show_user_profile", {"transition":"slideup"});
				});

				$(".challenge_to_org").off("click").click(function(){
					var orgNr = $(this).attr("orgNr");
					localStorage.setItem("organizationToShow",orgNr);
					$.mobile.changePage("#page_organization", {"transition":"slideup"});
				});

				$(".challenge_to_project").off("click").click(function(){
					var projectID = $(this).attr("projectID");
					localStorage.setItem("projectToShow",projectID);
					$.mobile.changePage("#page_project", {"transition":"slideup"});
				});

				$("#challengeList .btn_accept").off("click").click(function(){
					var challengeID = $(this).attr("id");
					var thisListItem = $(this).closest("li");
					acceptChallenge(challengeID,thisListItem);
				});

				$("#challengeList .btn_decline").off("click").click(function(){
					var challengeID = $(this).attr("id");
					var thisListItem = $(this).closest("li");
					declineChallenge(challengeID,thisListItem);
				});

				$("#challengeListHistory .answerbtn").css("opacity","0.6");
			

		}
	});

});
$(document).on("pageshow","#page_challenges",function(){
	$(".chall_dd").hide();
});

function acceptChallenge(challengeID,listItem){
	var sum = listItem.attr("sum"),
		orgName = listItem.attr("orgName"),
		projectName = listItem.attr("projectName"),
		projectID = listItem.attr("projectID")

	;
	var confirmMsg = "Donere "+ sum +" kr til "+orgName+", "+projectName+" ?"
	if (confirm(confirmMsg)!=true)
		return;

	// Donation confirmed
	var funds, email = localStorage.getItem("userID");
	var sql = "select funds from user where email like '"+email+"'";
	var url = getURLappBackend();

	// Checking funds
	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			funds = parseInt(response[0].funds);
			sum = parseInt(sum);

			if (funds < sum){
				alert("ikke dekning på konto:"+ funds +" < "+ sum);
				return;
			}

			// Fundings ok
			var newFunds = funds - sum;

			// Making a one-time donation
			var type = "engangsdonasjon";
			sql = "INSERT INTO Donation (projectID, email, type, sum,active) VALUES('"+projectID+"', '"+email+"', '"+type+"', '"+sum+"', '"+0+"')";
			var data = {'setSQL' : sql};

			$.ajax({
				type :"POST",
				url : url,
				dataType : "text",
				data : data,
				success : function(response){
					// Update funds
					sql  = "update user set funds = "+newFunds+" where email like '"+email+"'";
					$.ajax({
						type :"POST",
						url : url,
						dataType : "text",
						data : {"setSQL":sql},
						success : function(response){
							// Update challenge
							var sql ="update challenge set response = 1, response_date = NOW() where challengeID = "+challengeID;
							var url = getURLappBackend();

							$.ajax({
								type:"post",
								url:url,
								datatype:"text",
								data:{"setSQL":sql},
								success:function(response){
									if (response != "OK"){
										console.log("error: "+response);
										return;
									}
									moveToHistory(listItem,1);

								}

							}).done(function(){
								//console.log("update challenge done!" )
							});
													
						}
					}).done(function (){
						//console.log("update funds done!");
					});



				},
				error : function(response){
					alert("Error in: donate.js bad ajax request when insert to database");
				}
			}).done(function(){
				//console.log("insert donation done!" )
			});
		}
	});
	

}

function declineChallenge(challengeID, listItem){	
	var sql ="update challenge set response = 0, response_date = NOW() where challengeID = "+challengeID;
	//console.log(sql);
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		datatype:"text",
		data:{"setSQL":sql},
		success:function(response){
			if (response != "OK"){
				showMessage("error: "+response);
				return;
			}
			moveToHistory(listItem,0);

		}

	});

}

function moveToHistory(listItem,response){
	listItem.find(".answerbtn").off("click").css("opacity","0.6");
	listItem.find("#challenge_status").removeClass("red").addClass("green").html("Har svart");

	var responseIndicator = "<img src='../img/icon-check.png' class='responseIndicator' />";
	var whenRespondedMsg ='<span class=" x-small grey whenRespondedMsg">Utfordringen ble besvart nettopp </span>';

	if (response == 0){
		// Declined challenge
		listItem.find(".btn_decline").before(responseIndicator);
	}
	else if (response == 1){
		// Accepted challenge
		listItem.find(".btn_accept").before(responseIndicator);
	}
	listItem.find(".chall_dd_left").before(whenRespondedMsg);
	

	var challengeListHistory = $("#challengeListHistory");
	if($("#challengeListHistory li").first().attr("id") == "emptylist"){
		// No historyitems
		challengeListHistory.empty();
	}

	//var noHistoryInList = $("#challengeListHistory li").first().attr("id");

	challengeListHistory.append(listItem);
	var numActiveChallenges = $("#challengeList li").length;
	if(numActiveChallenges == 0)
		$("#challengeList").append('<li id="emptylist">Ingen nye utfordringer</li>');
	getChallenges();


}