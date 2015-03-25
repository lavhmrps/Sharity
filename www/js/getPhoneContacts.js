 $( document ).delegate("#page_add_friend", "pageinit", function() {

		document.addEventListener('deviceready', onDeviceReady, false);
	});
		
	function onDeviceReady(){
		//alert("ready");
	        getContacts();
	    }
	    var filter = "";
	    function getContacts(){
	    	var options      = new ContactFindOptions();
	    	options.filter   = filter;
	    	options.multiple = true;
	    	var fields       = ["displayName", "name"];
	    	navigator.contacts.find(fields, onSuccess, onError, options);
	    }
	    function onSuccess(contacts) {
	    	//alert("onSuccess "+contacts.length);
	    	var url = getURLappBackend();
	    	var data = {"getSQL" : "SELECT email,phone FROM user"};
	    	$.ajax({
	    		type: "POST",
	    		url : url,
	    		data : data,
	    		dataType : "json",
	    		success: function(response){
	    			//alert("onSuccess "+response.length);
	    			var count = 0;
	    			var contactCode = "";
	    			var html ="";

	    			for(var i = 0; i < contacts.length; i++){
	    				if(contacts[i].name.formatted && contacts[i].phoneNumbers){
		    				var contact = contacts[i];
		    				var name = contact.name.formatted;
							var phone = contact.phoneNumbers[0].value;
							phone = phone.replace(/ /g,''); 
							if(phone.charAt(0)=='+') phone = phone.substring(3);
							var isMember = false;

							var dbPhone, userID;
							for (var j = 0; j < response.length; j++) {
								dbPhone = response[j].phone;
								userID = response[j].email;
								//alert(userID);
								if(phone == dbPhone){
									isMember = true;
									break;
								}
							}
							userID = isMember ? userID : null;
							html += newListitem(contact, isMember,userID);
							count++;
						}
					
	    			}
	    			$("#myContactsList").html(html);
	    			
	    			$("#myContactsList li .li_mid, .li_right").click(function() {
	    				var email = $(this).parent().parent().attr("email");
	    				if(email != "null")
	    					alert(email);
	    			}); 					
	    		},
	    		error : function(error){
	    			alert("File: getPhoneContacts.js error: "+JSON.stringify(error));
	    		}
	    	});
		}
function onError(contactError) {
	alert('onError!');
};

function newListitem(contact, isMember, userID){
	var name = contact.name.formatted;
	var phone = contact.phoneNumbers[0].value;

	phone = phone.replace(/ /g,''); 
	if(phone.charAt(0)=='+') phone = phone.substring(3);
	    	
	var listitemCode = 
	'<li email="' + userID +'">'+
	'<div class="li_container">'+
	'<div class="li_left">'+
	'<div class="li_circ">'+
	'</div>'+
	'</div>'+
	'<div class="li_mid">'+
	'<span class="li_heading">'+name+'</span>'+
	'<span class="li_text">'+phone+'</span>'+
	'</div>'+
	'<div class="li_right">'+
	'<a href="#" rel="external" class="li_btn '+
	(isMember?'visit':'invite')+' show-page-loading-msg" name="donation">'+
	(isMember ? 'Vis profil':'Inviter') + 
	'</a>'+
	'</div>'+
	'</div>'+
	'</li>';
	return listitemCode;
}



