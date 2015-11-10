$(document).on("pagebeforeshow","#page_donate",function(){
	//console.log("page_donate, project: "+localStorage.getItem("donateToProject"));

	var projectID = localStorage.getItem('donateToProject');
	var orgNr = localStorage.getItem('donateToOrganization');
	var sql="";
	var orgDonation=false; projectDonation=false;
	var projectName, orgName;
	if(projectID != undefined){
		sql ="select p.* , o.name as orgName from project as p join organization as o on (p.organizationNr = o.organizationNr) where projectID = " + projectID;
		projectDonation=true;
	}
	else if (orgNr != undefined){
		sql ="select * from organization where organizationNr = "+orgNr;
		orgDonation=true;
	}
	else{
		alert("feil: Hverken organisasjon eller prosjekt er valgt");
		$.mobile.changePage("#page_overview",{"transition":"pop"});
		return;
	}

	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			//alert("projectID:" +projectID+": "+JSON.stringify(response));
			if(projectDonation){
				projectName = response[0].name;
				orgName = response[0].orgName;
				$(".recieverProject").show();
				$(".projectName").html(projectName);
			}
			if(orgDonation){
				orgName = response[0].name;
				$(".recieverProject").hide();
			}
			$(".orgName").html(orgName);
		},
		error:function(response){
			alert("error: "+json.stringify(response));
		}
	});

});


$(document).on("pageinit","#page_donate",function(){
	// Click events on page
	$(".radio_amount").click(function() {
		$("#in_custom_amount").val("");
		$("#in_custom_amount").blur();
		$("#in_custom_amount").css("border-bottom", "thin solid #d2d2d2");
	});

	$("#in_custom_amount").click(function(){
		uncheckRadiobuttonsDonate();

	});

	$('img[name=back]').click(function(){
		window.history.go(-1);
	});

	$('a[name=reg_donation_done]').click(function(){
		if(localStorage.getItem("donateToOrganization") != undefined)
		{
			alert("TODO: doner til organisasjon");
			return;
		}
		completeDonation();
	});

	/* Challenge-Popup */
	/*
	$("#popup_donate_challenge").on("popupbeforeposition",function (){
		// Disable background scrolling
		$('body').css('overflow','hidden');
		
		getFriendList();
		$("#chall-content-donationinfo-amount").html(localStorage.getItem("chall-donation-sum"));
		$("#chall-content-donationinfo-organization").html(localStorage.getItem("chall-donation-orgName"));
		$("#chall-content-donationinfo-project").html(localStorage.getItem("chall-donation-projectName"));



	});
	$("#popup_donate_challenge").on("popupafteropen",function (){
		var donationID = localStorage.getItem("chall-donationID");

		$("#chall-btn-challenge").off("click").click(function(){
			var to_list=[];
			var i=0;
			$("#chall-content-listdiv-list .chall_li_cb").each(function(){
				var isChecked = $(this).find("input[type=checkbox]").prop("checked");
				if(isChecked){
					var userID = $(this).closest("li").attr("id");
					to_list[i++]=userID;
				}
			});
			if(i==0){
				alert("Velg en eller flere mottagere");
				return;
			}

			var message = $("#chall-content-textareadiv-textarea").val();
			console.log(to_list);
			sendChallenges(to_list,donationID,message);
		
		});
	});	

	$("#popup_donate_challenge").on("popupafterclose",function (){
		// Enable scrolling after popup is closed
		$('body').css('overflow','auto');
	});
*/
});


 $(document).on("pagebeforehide","#page_donate",function(){
 	localStorage.removeItem("donateToProject");
 	localStorage.removeItem("donateToOrganization");
 });

$(document).on("pagebeforeshow","#page_donate_challenge",function(){
	getFriendList();
	$("#chall-content-donationinfo-amount").html(localStorage.getItem("chall-donation-sum"));
	$("#chall-content-donationinfo-organization").html(localStorage.getItem("chall-donation-orgName"));
	$("#chall-content-donationinfo-project").html(localStorage.getItem("chall-donation-projectName"));

});

$(document).on("pageinit","#page_donate_challenge",function(){
	var donationID = localStorage.getItem("chall-donationID");

	$("#chall-btn-challenge").off("click").click(function(){
		var to_list=[];
		var i=0;
		$("#chall-content-listdiv-list .chall_li_cb").each(function(){
			var isChecked = $(this).find("input[type=checkbox]").prop("checked");
			if(isChecked){
				console.log( $(this).closest("li").attr("id"))
				var userID = $(this).closest("li").attr("id");
				to_list[i++]=userID;
			}
		});
		if(i==0){
			alert("Velg en eller flere mottagere");
			return;
		}

		var message = $("#chall-content-textareadiv-textarea").val();
		sendChallenges(to_list,donationID,message);
	
	});

});

function uncheckRadiobuttonsDonate() {
	$("input[name='in_donate_amount']").attr("checked", false)
	.checkboxradio("refresh");
}

function completeDonation(){
	var sum;
	var type;
	var projectID = localStorage.getItem('donateToProject');
	var email = localStorage.getItem('userID');

	if($('input[name=in_donate_amount]:checked').length > 0){
		sum = $('input[name=in_donate_amount]:checked').val();
	}
	else if($('input[name=in_donate_amount_custom]').val().length > 0){
		sum = $('input[name=in_donate_amount_custom]').val();
		if(isNaN(sum)){
			alert("Sjekk at beløpet er et tall");
			return;
		}else if(sum <= 0){
			alert("Ugyldig beløp (0 eller mindre)");
			return;
		}
		else if(sum % 1 != 0){
			alert("Kun tillatt med beløp i hele kroner");
			return;
		}
	}else{
		alert("Velg beløp");
		return;
	}

	if($('input[name=donation_freq]:checked').length > 0){
		type = $('input[name=donation_freq]:checked').val();
	}else{
		alert("Velg donasjonsfrekvens");
		return;
	}

	var funds;
	var sql = "select funds from user where email like '"+email+"'";
	var url = getURLappBackend();

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
			var newFunds = funds - sum;

			sql = "INSERT INTO Donation (projectID, email, type, sum,active) VALUES('"+projectID+"', '"+email+"', '"+type+"', '"+sum+"', '"+(type=='fast'?1:0)+"')";
			var data = {'setSQL' : sql};

			$.ajax({
				type :"POST",
				url : url,
				dataType : "text",
				data : data,
				success : function(response){
					$("input[name='in_donate_amount']").attr("checked", false).checkboxradio("refresh");
					$("input[name='donation_freq']").attr("checked", false).checkboxradio("refresh");
					$("input[name='in_donate_amount_custom']").val("");

					sql  = "update user set funds = "+newFunds+" where email like '"+email+"'";
					$.ajax({
						type :"POST",
						url : url,
						dataType : "text",
						data : {"setSQL":sql},
						success : function(response){
							sql="select donationID from donation where projectID = "+projectID +" and email like '"+email+"' order by date desc limit 1";
							$.ajax({
								type : "POST",
								url : url,
								dataType: "json",
								data : {'getSQL' : sql},
								success : function(response){
									var donationID = response[0].donationID;
									localStorage.setItem("chall-donationID",donationID);
									if(confirm("Du har donert!\nVil du utfordre noen av vennene dine til å gjøre det samme?")){
										localStorage.setItem("chall-donation-orgName",$(".orgName").html());
										localStorage.setItem("chall-donation-projectName",$(".projectName").html());
										localStorage.setItem("chall-donation-sum",sum);
										$.mobile.changePage("#page_donate_challenge",{"transition":"slide"});
										//$("#popup_donate_challenge").popup("open");									
									}else {
										//$.mobile.back();
										clearChallengeFields();
										window.history.go(-2);
									}
								}
							});
						}
					});



				},
				error : function(response){
					alert("Error in: donate.js bad ajax request when insert to database");
				}
			});
		}
	});
}

function sendChallenges(to_list, donationID,message){
	var url = getURLappBackend();
	for(var i=0; i<to_list.length;i++){		
		(function (i) {
			var sql ="insert into challenge (from_user, to_user, donationID, message) values ( '"+localStorage.getItem("userID")+"', '"+to_list[i]+"', "+donationID+", '"+message+"')";
			console.log(sql);
			$.ajax({
				type : "POST",
				url : url,
				dataType: "text",
				data : {'setSQL' : sql},
				success : function(response){
					if(i==(to_list.length-1))
						sendChallengesCompleted();
				}
			});
		})(i);
	}
}

function sendChallengesCompleted(){
	alert("Utfordringene ble sendt!");
	clearChallengeFields();
	window.history.go(-2);
	clearDonationData();
	//writeLocalStorage();
}

function getFriendList(){
	var sql = "select friendEmail, name from friend join user on friend.friendEmail = user.email where friend.userEmail like '"+localStorage.getItem("userID")+"'";
	console.log(sql);
	var url = getURLappBackend();

	$.ajax({
		type : "POST",
		url : url,
		dataType: "json",
		data : {'getSQL' : sql},
		success : function(response){
			//console.log(JSON.stringify(response));
			var listHTML = "";
			for(var i=0; i<response.length;i++){
				console.log(response[i].friendEmail);
				listHTML += 
					'<li id="'+response[i].friendEmail+'">'
						+'<div class="chall_li_container">'
							+'<div class="chall_li_name small">'+response[i].name+'</div>'
							+'<div class="chall_li_cb">'
								+'<input type="checkbox"/>'
							+'</div>'
						+'</div>'
					+'</li>';
			}
			$("#chall-content-listdiv ul").html(listHTML);

			var numChallenges=0;
			$("#chall-content-listdiv-list .chall_li_name").click(function(){
				var isChecked = $(this).closest("li").find("input[type=checkbox]").prop("checked");
				if(isChecked){
					$(this).closest("li").find("input[type=checkbox]").prop("checked",false);
					$(this).closest("li").css("background","inherit");
					numChallenges--;
				}else{
					$(this).closest("li").find("input[type=checkbox]").prop("checked",true);
					$(this).closest("li").css("background","lightgreen");
					numChallenges++;
				}
				$("#chall-num-challenges").html(numChallenges);
				$("textarea").blur();
			});
				
			$("#chall-content-listdiv-list .chall_li_cb").click(function(){
				var isChecked = $(this).find("input[type=checkbox]").prop("checked");
				if(isChecked){
					$(this).closest("li").css("background","lightgreen");
					numChallenges++;
				}
				else{
					$(this).closest("li").css("background","inherit");
					numChallenges--;
				}	
				$("#chall-num-challenges").html(numChallenges);
				$("textarea").blur();
			});
			
			
		},error:function(response){
			console.log(JSON.stringify(response));
		}
	});
}

function clearDonationData(){
	for ( var i = 0, len = localStorage.length; i < len; ++i ) 
		if  (localStorage.key( i ) != null)
			if (localStorage.key( i ).substring(0,5)=="chall")
				localStorage.removeItem(localStorage.key( i ));

}

function writeLocalStorage(){
	for ( var i = 0, len = localStorage.length; i < len; ++i ) 
		console.log(localStorage.key(i)+" : "+localStorage.getItem(localStorage.key(i)));
	
}

function clearChallengeFields(){
	$("#chall-content-textareadiv-textarea").val("");
}