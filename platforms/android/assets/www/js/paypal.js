/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);

    // start to initialize PayPalMobile library
    app.initPaymentUI();
  },
  initPaymentUI: function() {
    var clientIDs = {
      "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
      "PayPalEnvironmentSandbox": "AFcWxV21C7fd0v3bYYYRCpSSRl31ABq5kyEJjouAiXhBHlnAwXEwgxzZ"
    };
    PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

  },
  onSuccesfulPayment: function(payment) {
    console.log("payment success: " + JSON.stringify(payment, null, 4));
  },
  onAuthorizationCallback: function(authorization) {
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },
  createPayment: function() {
	//Hente ut hvor mye som blir donert!
	
	var sum;
	
	if($('input[name=in_donate_amount]:checked').length > 0){
		sum = $('input[name=in_donate_amount]:checked').val();
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
	
    var paymentDetails = new PayPalPaymentDetails(sum, "0.00", "0.00");
    var payment = new PayPalPayment(sum, "NOK", "Awesome Sauce", "Sale",
      paymentDetails);
    return payment;
  },
  configuration: function() {
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onPrepareRender: function() {
    var buyNowBtn = document.getElementById("buyNowBtn");
    var buyInFutureBtn = document.getElementById("buyInFutureBtn");
    var profileSharingBtn = document.getElementById("profileSharingBtn");
	alert("Blir trykket ned!");
	
    buyNowBtn.onclick = function(e) {
      // single payment
	  alert("Blir trykket ned!");
      PayPalMobile.renderSinglePaymentUI(app.createPayment(), app.onSuccesfulPayment,
        app.onUserCanceled);
    };

    buyInFutureBtn.onclick = function(e) {
      // future payment
      PayPalMobile.renderFuturePaymentUI(app.onAuthorizationCallback, app
        .onUserCanceled);
    };

    profileSharingBtn.onclick = function(e) {
      // profile sharing
      PayPalMobile.renderProfileSharingUI(["profile", "email", "phone",
        "address", "futurepayments", "paypalattributes"
      ], app.onAuthorizationCallback, app.onUserCanceled);
    };
  },
  onPayPalMobileInit: function() {
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", app.configuration(),
      app.onPrepareRender);
  },
  onUserCanceled: function(result) {
    console.log(result);
  }
};

app.initialize();
