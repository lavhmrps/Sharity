$(document).ready(function(){
	$(".back_btn").click(function() {
		window.history.go(-1);
	});

	$(".input_underscored").blur(function() {
		var text = $(this).val();
		if (text == "" || text.indexOf("'")!=-1) {
			$(this).css("border-bottom", "thin solid #f63218");
		} else	{
			$(this).css("border-bottom", "thin solid #000")
		};

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

