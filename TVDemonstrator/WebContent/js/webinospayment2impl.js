var paymentService = null;
var paymentServices = [];
var addressCounter = 0;
var payServices = new Array();
//var myItemList = new Array();


function findService() {
	if (window.webinos) {
		webinos.discovery.findServices(new ServiceType(
		//looking for Payment2 API
				'http://webinos.org/api/payment2'), {
			onFound : function(service) {
				for(var i = 0; i < payServices.length; i++) {
					if(service.serviceAddress == payServices[i]["serviceAddress"]) {
						return;
					}
				}
				//paymentServices[service.serviceAdress] = service;
				payServices[addressCounter] = new Object();
				payServices[addressCounter]["serviceAddress"] = service.serviceAddress;
				payServices[addressCounter]["service"] = service;
				$('#navGrid').append('<div tsi:posx="0" tsi:posy="' + addressCounter + '" tsi:action="' + addressCounter + '">' + service.serviceAddress + '</div>');				
				addressCounter = addressCounter + 1;				
				alert("Service found: " + service.serviceAddress);
				//createShoppingBasket();
				//TODO: First select one of more services, then bind
				//bindService(service);
			},
			onError : function(error) {
				alert("PaymentService not found");
			}
		});		
	} else {
		alert("No webinos environment found. May it be, that you are in a local environment?");
	}
}

function bindService(service){
	//TODO implement which pzp
	paymentService = service;
	if(paymentService != undefined) {
	paymentService.bindService({onBind: function (service) {
		alert("Successfully bound to: " + paymentService.serviceAddress);
                processPayment();
            }});
	//createShoppingBasket();
	}	
}

function chooseContent(videoOutput){
	
	switch (videoOutput) {
		case VIDEOOUTPUT.STREAM_TRAILER:


			myItem = {
								productID: "001",
								description: "30 Minuten oder weniger",
								currency: "EUR",
								itemPrice: 2.51,
								itemCount: 1
							};
			return myItem;

		case VIDEOOUTPUT.STREAM_RECORDED:

			myItem = {
								productID: "001",
								description: "ZDF Küchenschlacht",
								currency: "EUR",
								itemPrice: 3.51,
								itemCount: 1
							};
			return myItem;

		case VIDEOOUTPUT.DOWNLOAD_TRAILER:

			myItem = {
								productID: "001",
								description: "30 Minuten oder weniger",
								currency: "EUR",
								itemPrice: 4.51,
								itemCount: 1
							};
			return myItem;
		}		
}

//create bill
function createBill(myItemList){
	
	//do some math for creating a real bill
	//iterate through myItemList...
	
	//create  test bill
var bill = {
	description: "Bill 123",
	currency: "EUR",
	itemPrice: "5.51"
	};
	return bill;
}


function processPayment(){
	alert("processing");
	var myItemList = new Array();
	
	if (paymentService == null) {
		alert("Need to find service first..searching");
		findService();
	} else {
		//choose the content (returns an item)
		myItemList[0] = chooseContent(videoOutput);	
		//create bill
		var bill = createBill(myItemList);
		
		//set Parameters
		serviceProviderId = "mWallet";
		customer = "TestCustomer";
		seller = "mWallet";
		
		//call Payment Method pay
		paymentService.pay(paymentSuccess, paymentFailure, null, myItemList, bill, serviceProviderId, customer, seller)
	
}
}
	

// Define the checkoutSuccess success callback.
function paymentSuccess() {
	alert("Checkout handled successfully - payment was performed.");
	walletCallBackHandler();
}

// Define the paymentFailure failure callback.
function paymentFailure(e) {
	alert("Failure occured during payment.");
}

// Function when wallet return with no errors
function walletCallBackHandler(){
	//window.location.href = "../index.html?payed=true";
	checkToPlayUnencryptedVideo(true);
	$('#detail_zdf').hide();
	$('#livetv').show();
	currentPage = CURRENTPAGE.LIVETV;
}
