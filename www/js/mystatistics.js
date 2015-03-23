$(document).ready(function(){

	

	$(".back_btn").click(function() {
		window.history.go(-1);
	});

	$(".footer_me").click(function() {
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
				$('img[name=logo]').attr('src',json[0].picURL);
				getDonationInformation();
				getChallenges();

			},
			error : function(error){
				alert("Error i mystatistics.js bad ajax reqest getSQL from database");
			}
		});


		$('div[name="user_name"]').text('Full name goes here');
		
	});


});

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
			$('#mystats_num_challenges').text(json.length);
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});
}


function getDonationInformation(){
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

			var text = "";

			var num_donations = 0;
			var sum_current_month = 0;
			var sum_total = 0;

			for(var i = 0; i < json.length; i++){
				text += "Sum: " + json[i].sum + ", Type: " + json[i].type + ", Datum: "+ json[i].date  + "\n";

				var t = json[i].date.split(/[- :]/);
				var date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

				if(date.getMonth() == new Date().getMonth()){
					num_donations++;
					sum_current_month += parseInt(json[i].sum);
				}
				sum_total += parseInt(json[i].sum);
			}

			alert("File: mystatistics.js getDonationInformation() just for show:\n" + text);



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
			

			//alert(text);
		},
		error : function(error){
			alert("Error i mystatistics.js bad ajax reqest getSQL from database");
		}
	});
}