
// First time page is loaded 
$(document).on("pageinit","#page_show_user_profile",function(){
	var userIDtoShow = localStorage.getItem("userIDtoShow");
	$('a[name=show_user_donationlist]').click(function(){
		//alert("vis: "+userIDtoShow +" sine donasjoner");
	});

	$('button[name=challenge_user]').click(function(){
		var userID = localStorage.getItem("userIDtoShow");
		alert("challenge: "+userID);
	});
}); // on pageinit

// Everytime page is shown
$(document).on("pagebeforeshow","#page_show_user_profile",function(){
	
	var userIDtoShow = localStorage.getItem("userIDtoShow");

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
				var picURL = json[0].picURL;
				picURL = (picURL == null ? "../img/no_image_avaliable.png" : picURL);
				$('img[name=user_logo]').attr("src",picURL);
				$('span[name=show_user_fullname]').text(json[0].name);
				localStorage.setItem("userToShowName",json[0].name);
				getDonationInformation(userIDtoShow);

				
			}
		},
		error : function(){
			alert("showUserprofile.js Her gikk noe galt");
		}
	}); // ajax
}); // on pagebeforeshow



function getDonationInformation(userIDtoShow){
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
					num_donations++;
					sum_current_month += parseInt(json[i].sum);
				}
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
			alert("Error i showUserprofile.js getDonationInformation(userID)");
		}
	}); // ajax
} // getDonationInformation(userIDtoShow)

$(document).on("pagebeforeshow","#page_showUserDonations",function(){
	// alert("page_showUserDonations");
	listDonations(localStorage.getItem("userIDtoShow"));
})

function listDonations(userIDtoShow){
	//alert("nå kommer\n"+userIDtoShow+"\nsine donasjoner");

	$("#usernameToShow").html(localStorage.getItem("userToShowName")+"'s donasjoner");

	
	var list = $("#userDonationList");
	var sql = "select project.name as name, donation.sum as sum, donation.type as type, donation.active as active from donation join project on (project.projectID = donation.projectID) where donation.email like '"+userIDtoShow+"'";
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
				listItem = 	"<li>Ingen Donasjoner ennå </li>";
				listHTML = listItem;
				list.html(listHTML);
			}else{
				
				for(var i = 0; i < response.length; i++){
					listItem = 
						"<li> "
						+response[i].name+", "+response[i].sum+", "+response[i].type+", "+(response[i].type=='fast'?(response[i].active==1?"Pågår":"Avsluttet"):"");
						+"</li>";
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