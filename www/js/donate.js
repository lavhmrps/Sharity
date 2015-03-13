$(document).ready(function(){
	$('img[name=back]').click(function(){
		window.history.go(-1);
	});

	$('button[name=reg_donation_done]').click(function(){
		var projectID = localStorage.getItem('projectToShow');

		var sum;
		var type;
		var projectID = localStorage.getItem('projectToShow');
		var email = localStorage.getItem('userID');

		if($('input[name=in_donate_amount]:checked').length > 0){
			sum = $('input[name=in_donate_amount]:checked').val();
		}
		else if($('input[name=in_donate_amount_custom]').val().length > 0){
			sum = $('input[name=in_donate_amount_custom]').val();
		}else{
			alert("Velg beløp");
			return false;
		}

		if($('input[name=donation_freq]:checked').length > 0){
			type = $('input[name=donation_freq]:checked').val();
		}else{
			alert("Velg donasjonsfrekvens");
			return false;
		}

		var sql = "INSERT INTO Donation (projectID, email, type, sum) VALUES('"+projectID+"', '"+email+"', '"+type+"', '"+sum+"')";

		var url = getURLappBackend();
		
		var data = {'setSQL' : sql};

		$.ajax({
			type :"POST",
			url : url,
			dataType : "text",
			data : data,
			success : function(response){
				alert("donate.js successful ajax request returned : " + response);
				$("input[name='in_donate_amount']").attr("checked", false).checkboxradio("refresh");
				$("input[name='donation_freq']").attr("checked", false).checkboxradio("refresh");
				window.history.go(-1);
			},
			error : function(response){
				alert("Error in: donate.js bad ajax request when insert to database");
			}
		});
	});
});