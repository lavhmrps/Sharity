/*

ALL TIME

*/
function getData(sql){
	return $.ajax({
		type : "POST",
		url : getURLappBackend(),
		data : {"getSQL":sql,delay:3000},
		dataType : "JSON"
	});

}


function getSubscriptionsAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) as numSubs FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";

	var url = getURLappBackend();
	var data = {"getSQL" : sql};


	return $.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON"
	});

}

function getDonationsNumberAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM donation INNER JOIN project ON donation.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsSumAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT SUM(sum) FROM donation INNER JOIN project ON donation.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsAverageAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			var sql2 = "SELECT SUM(sum) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
			var data2 = {"getSQL" : sql2};
			$.ajax({
				type : "POST",
				url : url,
				data : data2,
				dataType : "JSON",
				success : function(json){
					var res2 = parseInt(json);
					var totalt;
					if(res1 != 0){
						totalt = res2/res1;
					}
					else{
						totalt = 0;
					}
				},
			});
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getNewsNumberAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM news INNER JOIN project ON news.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getProjectsNumberAllTime(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM project WHERE organizationNr = = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

/*

DAY

*/
function getSubscriptionsDay(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID "
			+"WHERE DATE(subscription.date_added) = '"+ date +"' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsNumberDay(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM donation INNER JOIN project ON donation.projectID = project.projectID "
			+"WHERE DATE(donation.date) = '"+ date +"' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsSumDay(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT SUM(sum) FROM donation INNER JOIN project ON donation.projectID = project.projectID "
			+"WHERE DATE(donation.date) = '"+ date +"' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsAverageDay(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID "
			+"WHERE DATE(donation.date) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			var sql2 = "SELECT SUM(sum) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID "
					+"WHERE DATE(donation.date) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
			var data2 = {"getSQL" : sql2};
			$.ajax({
				type : "POST",
				url : url,
				data : data2,
				dataType : "JSON",
				success : function(json){
					var res2 = parseInt(json);
					var totalt;
					if(res1 != 0){
						totalt = res2/res1;
					}
					else{
						totalt = 0;
					}
				},
			});
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getNewsNumberDay(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM news INNER JOIN project ON news.projectID = project.projectID "
			+"WHERE DATE(news.date_added) = '"+ date +"' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getProjectsNumberDay(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM project WHERE DATE(date_added) = '"+ date +"' AND organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}




/*

MONTH

*/
function getSubscriptionsMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID "
			+"WHERE MONTH(date(subscription.date_added)) = MONTH('" + date + "') AND YEAR(date(subscription.date_added)) = YEAR('" + date + "') |"
			+"AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsNumberMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM donation INNER JOIN project ON donation.projectID = project.projectID "
			+"WHERE MONTH(date(donation.date)) = MONTH('" + date + "') AND YEAR(date(donation.date)) = YEAR('" + date + "') "
			+"AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsSumMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT SUM(sum) FROM donation INNER JOIN project ON donation.projectID = project.projectID "
			+"WHERE MONTH(date(donation.date)) = MONTH('" + date + "') AND YEAR(date(donation.date)) = YEAR('" + date + "') "
			+"AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsAverageMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE MONTH(date(donation.date)) = MONTH('" + date + "') AND YEAR(date(donation.date)) = YEAR('" + date + "') AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			var sql2 = "SELECT SUM(sum) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE MONTH(date(donation.date)) = MONTH('" + date + "') AND YEAR(date(donation.date)) = YEAR('" + date + "') AND project.organizationNr = '"+ orgNr +"'";
			var data2 = {"getSQL" : sql2};
			$.ajax({
				type : "POST",
				url : url,
				data : data2,
				dataType : "JSON",
				success : function(json){
					var res2 = parseInt(json);
					var totalt;
					if(res1 != 0){
						totalt = res2/res1;
					}
					else{
						totalt = 0;
					}
				},
			});
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getNewsNumberMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM news INNER JOIN project ON news.projectID = project.projectID WHERE MONTH(date(news.date_added)) = MONTH('" + date + "') AND YEAR(date(project.date_added)) = YEAR('" + date + "') AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getProjectsNumberMonth(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM project WHERE MONTH(date(project.date_added)) = MONTH('" + date + "') AND YEAR(date(project.date_added)) = YEAR('" + date + "') AND organizationNr = = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}




/*

YEAR

*/
function getSubscriptionsYear(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE YEAR(date(subscription.date_added)) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsNumberYear(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM donation INNER JOIN project ON donation.projectID = project.projectID WHERE YEAR(date(donation.date)) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsSumYear(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT SUM(sum) FROM donation INNER JOIN project ON donation.projectID = project.projectID WHERE YEAR(date(donation.date)) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getDonationsAverageYear(){
	var orgNr = localStorage.getItem('orgNr');
	var sql = "SELECT COUNT(*) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHEREYEAR(date(donation.date)) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			var sql2 = "SELECT SUM(sum) FROM subscription INNER JOIN project ON subscription.projectID = project.projectID WHERE project.organizationNr = '"+ orgNr +"'";
			var data2 = {"getSQL" : sql2};
			$.ajax({
				type : "POST",
				url : url,
				data : data2,
				dataType : "JSON",
				success : function(json){
					var res2 = parseInt(json);
					var totalt;
					if(res1 != 0){
						totalt = res2/res1;
					}
					else{
						totalt = 0;
					}
				},
			});
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getNewsNumberYear(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM news INNER JOIN project ON news.projectID = project.projectID WHERE YEAR(date(news.date_added)) = '" + date + "' AND project.organizationNr = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}

function getProjectsNumberYear(){
	var orgNr = localStorage.getItem('orgNr');
	var date = $("input[name=dateStats]").getItem(); //dateInput
	var sql = "SELECT COUNT(*) FROM project WHERE YEAR(date(project.date_added)) = '" + date + "' AND organizationNr = = '"+ orgNr +"'";
	var url = getURLappBackend();
	var data = {"getSQL" : sql};

	$.ajax({
		type : "POST",
		url : url,
		data : data,
		dataType : "JSON",
		success : function(json){
			var res = parseInt(json);
			/*

				Response

			*/
		},
		error : function(error){
			alert("Error i stats.js bad ajax reqest getSQL from database");
		}
	});
}