
function register_user(){

					
	
					var firstname = $("#in_firstname").val();
					var lastname = $("#in_lastname").val();
					var email = $("#in_email").val();
					var phone = $("#in_phone").val();
					var adress = $("#in_adress").val();
					var zip = $("#in_zip").val();
					var cardnr = $("#in_visa_number").val();
					var password = $("#in_password").val();
					var password_repeat = $("#in_password_repeat").val();


					var monthdrop = document
							.getElementById("in_visa_expire_month");
					var exp_month = monthdrop.options[monthdrop.selectedIndex].value; // date
																						// of
																						// expiration

					var yeardrop = document
							.getElementById("in_visa_expire_year");
					var exp_year = yeardrop.options[yeardrop.selectedIndex].value; // date
																					// of
																					// expiration
					var ccv = $("#in_visa_ccv").val();




					if (password != password_repeat || password == null
							|| password == "") {
						alert("Ugyldig passord");
						return false;
					}


					if (cardnr == "") {

					} else {
						var cardJSON = {
							"cardnr" : cardnr,
							"name" : firstname + " " + lastname,
							"month" : exp_month,
							"year" : exp_year,
							"CCV" : ccv
						};

						var jsonstringCard = JSON.stringify(cardJSON);
						var urlCard = "http://student.cs.hioa.no/~s188081/Server-backend/register_card.php";

						$.ajax({
							type : 'POST',
							url : urlCard,
							data : {
								'card' : jsonstringCard
							},
							success : function(msg) {
							}
						});

					}




					var userJSON = {
						"firstname" : firstname,
						"lastname" : lastname,
						"email" : email,
						"phone" : phone,
						"adress" : adress,
						"zip" : zip,
						"password" : password,
						"cardnr" : cardnr

					};


					var jsonstringUser = JSON.stringify(userJSON);
					var urlUser = "http://student.cs.hioa.no/~s188081/Server-backend/register_user.php";

					$.ajax({
						type : 'POST',
						url : urlUser,
						data : {
							'user' : jsonstringUser
						},
						success : function(msg) {

							if(msg == "true"){
								toOverview1();
							}				
						}
					});

					


					return false;


}