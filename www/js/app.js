// Every time a page is shown
$(document).delegate('.ui-page', 'pageshow', function () {
	checkUpdates();
});


$(document).ready(function(){
	$(".back_btn").click(function() {
		window.history.go(-1);
	});
	$('li[name=search_sharity]').click(function(){
		window.location.href='#page_search_friends_sharity';
	});
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