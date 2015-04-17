
// First time page is loaded 
$(document).on("pageinit","#page_show_user_profile",function(){
	var userIDtoShow = localStorage.getItem("userIDtoShow");
	console.log("pageinit - userIDtoShow: "+userIDtoShow);

	$('a[name=show_user_donationlist]').click(function(){
		console.log("Viser +"+localStorage.getItem("userIDtoShow")+" sine donasjoner");
	});

	$('button[name=challenge_user]').click(function(){
		var userIDtoShow = localStorage.getItem("userIDtoShow");
		console.log("challenge: "+localStorage.getItem("userIDtoShow"));
	});
	
}); // on pageinit

// Everytime page is shown
$(document).on("pagebeforeshow","#page_show_user_profile",function(){
	var userIDtoShow = localStorage.getItem("userIDtoShow");
	console.log("pagebeforeshow - userIDtoShow: "+userIDtoShow);

	var url = getURLappBackend();
	var sql = "SELECT * FROM user WHERE email = '"+userIDtoShow+"'";
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			if(json.length == 1){
				$('span[name=show_profile_username]').text(json[0].email);
				localStorage.setItem("userIDtoShow",json[0].email);

				var picURL = json[0].picURL;
				picURL = (picURL == null ? "../img/no_image_avaliable.png" : picURL);
				$('img[name=user_logo]').attr("src",picURL);
				$('span[name=show_user_fullname]').text(json[0].name);
				localStorage.setItem("userToShowName",json[0].name);
				getUserDonationInformation(json[0].email);

				
			}
		},
		error : function(){
			alert("showUserprofile.js Her gikk noe galt");
		}
	}); // ajax
}); // on pagebeforeshow



function getUserDonationInformation(userIDtoShow){
	var sql = "SELECT * FROM Donation WHERE email = '"+userIDtoShow+"'";
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
			var current_month="";
			var sum_total = 0;

			for(var i = 0; i < json.length; i++){
				var t = json[i].date.split(/[- :]/);
				var date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

				if(date.getMonth() == new Date().getMonth()){
					
					sum_current_month += parseInt(json[i].sum);
				}num_donations++;
				sum_total += parseInt(json[i].sum);
			}
			
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

			$('span[name=show_user_amount_current_month]').text(sum_current_month);
			$('span[name=show_user_total_amount]').text(sum_total);
			$('span[name=current_month]').text(current_month);
			$('span[name=show_user_num_donations]').html(num_donations==0?"Ingen":num_donations);
			$('span[name=is_pluar]').html(num_donations==1?"donasjon":"donasjoner");
			
		},// success
		error : function(error){
			alert("Error i showUserprofile.js getUserDonationInformation(userID)");
		}
	}); // ajax
} // getUserDonationInformation(userIDtoShow)

$(document).on("pagebeforeshow","#page_showUserDonations",function(){
	// alert("page_showUserDonations");
	var userIDtoShow = localStorage.getItem("userIDtoShow");
	listUserDonations(userIDtoShow);

	$(document).on("click","#userDonationList .li_mid",function(){
		//console.log("userDonation,projectID: "+$(this).closest("li").attr("projectID"));
		localStorage.setItem("projectToShow", $(this).closest("li").attr("projectID"));
		$.mobile.changePage("#page_project");
		location.reload();
	});
});

function listUserDonations(userIDtoShow){
	//alert("nå kommer\n"+userIDtoShow+"\nsine donasjoner");
	var usernameToShow = localStorage.getItem("userToShowName");
	$("#usernameToShow").html(usernameToShow+"'s donasjoner");

	
	var list = $("#userDonationList");
	var sql = "select project.projectID as projectID, project.name as name, donation.sum as sum, donation.type as type, donation.active as active, donation.date as date from donation join project on (project.projectID = donation.projectID) where donation.email like '"+userIDtoShow+"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type: "post",
		url: url,
		dataType: "json",
		data: data,
		success:function(response){
			var listHTML="";
			var listItem="";
			if(response.length == 0){
				listItem = 	"<li>"+usernameToShow+" har ikke donert ennå </li>";
				listHTML = listItem;
				list.html(listHTML);
			}else{
				
				for(var i = 0; i < response.length; i++){
					listItem = '<li name="userDonation" projectID="'+response[i].projectID+'">'+
						'<div class="li_container">' +
							'<div class="li_left"><div class="donationItem">'+(i+1)+'</div></div>'+
							'<div class="li_mid">'+
								'<div class="li_project">' +response[i].name+ '</div>'+
								'<span class="li_donation red">' + response[i].sum + ' kr</span> <span'+
								(response[i].type == 'fast'?' class="green">fast':'>')/*+response[i].type*/+'</span><span class="grey" style="float:right;font-size:small">'+
								formatDate(response[i].date)+'</span>'+
							'</div>'+
							'<div class="li_right">'+
								//(json[i].type == 'fast'?'<img src="donation_cancel.png"':'')+
								((response[i].type == 'fast' ? (response[i].active == 1 ? 'Aktiv':'Stoppet') : '' ))+
								
							'</div>'+
						'</div>'+
						'</li>';
				
					listHTML+=listItem;
						
				}
				list.html(listHTML);
			}

		},
		error:function(response){
			alert("error: "+JSON.stringify(response.readyState));
		}
	});
}

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