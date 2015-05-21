$(document).ready(function(){
	$(".back_btn").click(function() {
		window.history.go(-1);
	});

	$(".input_underscored").blur(function() {
		var val = $(this).val();
		if (val == "" || val.indexOf("'")!=-1 || val == 0) {
			$(this).css("border-bottom", "thin solid #f63218");
		} else	{
			$(this).css("border-bottom", "thin solid #000")
		};

	});

	$(".input_creditcard").blur(function() {
		var val = $(this).val().replace(/ /g,'');
		if (val.length != 16) {
			$(this).css("border-bottom", "thin solid #f63218");
		} else	{
			$(this).css("border-bottom", "thin solid #000")
		};

	});

	$(".select_underscored").blur(function() {
		var val = $(this).val();
		if (val != 0) 
			$(this).css("border-bottom", "thin solid #000");
		else
			$(this).css("border-bottom", "thin solid #d2d2d2");
	});
});

$( document ).on( "pagecreate", function() {
	$( ".photopopup" ).on({
		popupbeforeposition: function() {
			var maxHeight = $( window ).height() - 60 + "px";
			$( ".photopopup img" ).css( "max-height", maxHeight );
		}
	});
});

// Every time a page is shown
$(document).on('pagebeforeshow', function () {
	checkUpdates();
});

function checkUpdates(){
	checkFriendRequests();
	getChallenges();
}
// returns easily read date
function formatDate(date){
	// date : yyyy-mm-dd hh:mm:ss
	if (date == null)
		return "<bad dateformat>";

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

function getMillis (date) {
	// Split timestamp into [ Y, M, D, h, m, s ]
	var t = date.split(/[- :]/);
	// Apply each element to the Date function
	return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]).getTime();
}

function calcTime (date) {
	// Split timestamp into [ Y, M, D, h, m, s ]
	var t = date.split(/[- :]/);
	// Apply each element to the Date function
	var then = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]).getTime();
	var now = new Date().getTime();

	var secs = (now - then)/1000;
	if(secs < 60)
		return Math.floor(secs)+ " sekund"+(Math.floor(secs)==1?"":"er");

	var mins = secs/(60);
	if(mins < 60 )
		return Math.floor(mins) + " minutt" +(Math.floor(mins)==1?"":"er");

	var hrs = mins / 60;
	if( hrs < 24)
		return Math.floor(hrs) + " time"+(Math.floor(hrs)==1?"":"r");

	return  Math.floor(hrs / 24) +" dag"+(Math.floor(hrs / 24)==1?"":"er");
}

function showMessage(message){
	$(".messagediv span").html(message).css("padding","3pt").fadeIn().delay(2000).fadeOut();
	
}


