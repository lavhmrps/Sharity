$(document).delegate("#page_donate","pageinit",function(){

	var projectID = localStorage.getItem('projectToShow');
	var projectName, orgName;

	var sql ="select p.* , o.name as orgName from project as p join organization as o on (p.organizationNr = o.organizationNr) where projectID = " + projectID;
	var url = getURLappBackend();

	$.ajax({
		type:"post",
		url:url,
		dataType:"json",
		data:{"getSQL":sql},
		success:function(response){
			//alert("projectID:" +projectID+": "+JSON.stringify(response));
			projectName = response[0].name;
			orgName = response[0].orgName;

			$(".projectName").html("Prosjekt: "+projectName);
			$(".orgName").html("Organisasjon: "+orgName);
			

		},
		error:function(response){
			alert("error: "+json.stringify(response));
		}
	});

	$(".radio_amount").click(function() {
		$("#in_custom_amount").val("");
		$("#in_custom_amount").blur();
		$("#in_custom_amount").css("border-bottom", "thin solid #d2d2d2");
	});

	$("#in_custom_amount").click(function(){
		uncheckRadiobuttonsDonate();

	});

	function uncheckRadiobuttonsDonate() {
		$("input[name='in_donate_amount']").attr("checked", false)
		.checkboxradio("refresh");
	}

	$('img[name=back]').click(function(){
		window.history.go(-1);
	});

	$('button[name=reg_donation_done]').click(function(){
		completeDonation();
	});
});

function completeDonation(){
	var projectID = localStorage.getItem('projectToShow');

	var sum;
	var type;
	var projectID = localStorage.getItem('projectToShow');
	var email = localStorage.getItem('userID');

	var validSum = false;

	if($('input[name=in_donate_amount]:checked').length > 0){
		sum = $('input[name=in_donate_amount]:checked').val();
		validSum = true;
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
			console.log("funds for "+email+": "+response[0].funds);
			funds =  response[0].funds;
			if (funds < sum){
				alert("ikke dekning på konto");
				return;
			}
			var newFunds = funds - sum;

			var sql = "INSERT INTO Donation (projectID, email, type, sum,active) VALUES('"+projectID+"', '"+email+"', '"+type+"', '"+sum+"', '"+(type=='fast'?1:0)+"')";
			var data = {'setSQL' : sql};

			$.ajax({
				type :"POST",
				url : url,
				dataType : "text",
				data : data,
				success : function(response){
					//alert("donate.js successful ajax request returned : " + response);
					console.log(sql+ " "+response);
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
							console.log(sql+ " "+response);
						}
					});


					window.history.go(-1);
				},
				error : function(response){
					alert("Error in: donate.js bad ajax request when insert to database");
				}
			});

		}

	});

		
}