var paymentService;
var myBasket;
var paymentServices = [];
var addressCounter = 0;
var payServices = new Array();

function findService() {
	if (window.webinos) {
		webinos.discovery.findServices(new ServiceType(
				'http://webinos.org/api/payment'), {
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
				//alert("Service found: " + service.serviceAddress);
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
		//alert("Successfully bound to: " + paymentService.serviceAddress);
                createShoppingBasket();
            }});
	//createShoppingBasket();
	}	
}

function createShoppingBasket() {
	if (paymentService == null) {
		alert("Need to find service first");
	} else {
		serviceProviderId = "mWallet";
		customer = "TestCustomer";
		shop = "mWallet";

		paymentService.createShoppingBasket(openBasketSuccess, paymentFailure,
				serviceProviderId, customer, shop);
	}
}

// Define the openBasketSuccess success callback.
function openBasketSuccess(basket) {
	//alert("Shopping basket was opened successfully");
	myBasket = basket;
	addItemToBasket(videoOutput);
}

function addItemToBasket(videoOutput) {
	if (paymentService == null) {
		findService();
	} else {
		switch (videoOutput) {
		case VIDEOOUTPUT.STREAM_TRAILER:

			var myItem = new ShoppingItem();
			myItem.productID = "001";
			myItem.description = "30 Minuten oder weniger";
			myItem.currency = "EUR";
			myItem.itemPrice = 2.51;
			myItem.itemCount = 1;
			myItem.itemsPrice = 2.51;
			myBasket.addItem(addItemSuccess, paymentFailure, myItem);

			break;

		case VIDEOOUTPUT.STREAM_RECORDED:

			var myItem = new ShoppingItem();
			myItem.productID = "001";
			myItem.description = "ZDF Küchenschlacht";
			myItem.currency = "EUR";
			myItem.itemPrice = 2.51;
			myItem.itemCount = 1;
			myItem.itemsPrice = 2.51;
			myBasket.addItem(addItemSuccess, paymentFailure, myItem);

			break;

		case VIDEOOUTPUT.DOWNLOAD_TRAILER:

			var myItem = new ShoppingItem();
			myItem.productID = "001";
			myItem.description = "30 Minuten oder weniger";
			myItem.currency = "EUR";
			myItem.itemPrice = 2.51;
			myItem.itemCount = 1;
			myItem.itemsPrice = 2.51;
			myBasket.addItem(addItemSuccess, paymentFailure, myItem);

			break;
		}
	}
}

function formattedPrice(price){
                                resVal=""+Math.floor(price);
                                cents=Math.round((price-Math.floor(price))*100);
                                if(cents>9)resVal=resVal+"."+cents;
                                else resVal=resVal+".0"+cents;
                                return resVal;
                        }

// Define the addItemSuccess success callback.
function addItemSuccess() {
	//alert("Adding of new item was handled successfully");
	// now close the bill and perform the actual payment
	myBasket.update(updateSuccess, paymentFailure);
}

// Define the updateSuccess success callback.
function updateSuccess() {
	alert("Total amount is: " + formattedPrice(myBasket.totalBill) + " Tax is "
			+ myBasket.extras[0].description);
	// now close the bill and perform the actual payment
	myBasket.checkout(checkoutSuccess, paymentFailure);
}

// Define the checkoutSuccess success callback.
function checkoutSuccess() {
	alert("Checkout handled successfully - payment was performed.");
	if (myBasket != null) {
		myBasket.release();
	}
	walletCallBackHandler();
}

// Define the paymentFailure failure callback.
function paymentFailure(e) {
	alert("Failure occured during payment.");
	if (myBasket != null)
		myBasket.release();
}

// Function when wallet return with no errors
function walletCallBackHandler(){
	//window.location.href = "../index.html?payed=true";
	checkToPlayUnencryptedVideo(true);
	$('#detail_zdf').hide();
	$('#livetv').show();
	currentPage = CURRENTPAGE.LIVETV;
}
