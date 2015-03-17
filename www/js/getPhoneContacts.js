 document.addEventListener('deviceready', onDeviceReady, false);
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
	        for(var i = 0; i < contacts.length; i++){
	            if(contacts[i].name.formatted && contacts[i].phoneNumbers){
	                $("#myContactsList").append(newListitem(contacts[i]));
	            }
	           
	        }

	    };

	    function onError(contactError) {
	        alert('onError!');
	    };

	    function newListitem(contact){
	    	
	    	var name = contact.name.formatted;
	    	var phone = contact.phoneNumbers[0].value;
	    	phone = phone.replace(/ /g,''); // Remove all whitespaces in number, ex: 22 33 4 -> 22334
	    	if(phone.charAt(0)=='+') phone = phone.substring(3); // Removes countrycode from number, ex: +4702323 -> 02323
	    	var isMember = phone.length%2==1; // Code to get different results for testing

	    	var listitemCode = 
				'<li>'+
				'<div class="li_container">'+
				'<div class="li_left">'+
				'<div class="li_circ">'+
				'</div>'+
				'</div>'+
				'<a href="#" rel="external" class="show-page-loading-msg">'+
				'<div class="li_mid dots">'+
				'<span class="li_heading">'+name+'</span>'+
				'<span class="li_text">'+phone+'</span>'+
				'</div>'+
				'</a>'+
				'<div class="li_right">'+
				'<a href="#" rel="external" class="li_btn '+
				(isMember?'visit':'invite')+' show-page-loading-msg" name="donation">'+
				(isMember ? 'Vis profil':'Inviter') + '</a>'+
				'</div>'+
				'</div>'+
				'</li>';
			return listitemCode;
	    }