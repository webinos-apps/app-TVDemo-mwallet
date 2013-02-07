var staticVideoArrayNumber = 0; // global variable for channelchange
var alreadyRunning = false; // global variable for bottom info animation
var bottom_panel_visible_timer = 13000; // global variable for duration of
// animation timer for bottom info bar
var timerId; // global variable for animation timer
var buttonsVisible = false; // global variable for buttons in bottom info bar
var buttonSelected = "buy"; // buy, dontbuy
var showButtons = true;
var encryptedChannel = 0;
var unecryptedChannel = 0;
var lastChannel = 0; // Array, starts from 0
var detailPage = ""; // which detailpage
var currentPage;

TVSettings.ANIMATE = true;

TVStyles["action-button2"] = {
	classNormal: "action-button2 action-button-text2",
	imgClass: "action-button2",
	imgNormal: "img/button_norm2.png",
	imgFocused: "img/button_focus2.png",
	imgPressed: "img/button_pressed2.png",
	imgDisabled: "img/button_norm2.png"
};

var navGrid = new TVNavGrid();

var VIDEOOUTPUT = {
	STREAM_TRAILER : 0,
	STREAM_RECORDED : 1,
	DOWNLOAD_TRAILER : 2
};

var CURRENTPAGE = {
	LIVETV : 0,
	DETAIL_ZDF : 1,
	PLAYER_ZDF : 2,
	ADRESSSELECTOR : 3,
};
var videoOutput = VIDEOOUTPUT.STREAM_RECORDED;

$(document).ready(function() {
	
	findService();

	// hide stuff and show only livetv
	currentPage = CURRENTPAGE.LIVETV;
	$('#detail_zdf').hide();
	$('#player_zdf').hide();
	$('#adress').hide();

	// timeMachine();
	document.addEventListener("keydown", function(e) {
		if (handleKeyCode(e.keyCode))
			e.preventDefault();
	}, false);
	
	//navGrid.registerItems("navGrid");
	//navGrid.moveToPos(0, 0);
	navGrid.setOverflowAllowed(true);
	navGrid.delegate = {
		executeItem: function(sender, item) {
			//alert("EXEC: " + item.attr("tsi:action"));
			var itemNumber = item.attr("tsi:action");
			if(payServices[itemNumber]["serviceAddress"] != undefined) {
				bindService(payServices[itemNumber]["service"]);
				//alert("Bind Service to: " + payServices[itemNumber]["serviceAddress"]);
				$('#adress').hide();
				$('#detail_zdf').show();
				currentPage = CURRENTPAGE.DETAIL_ZDF;
			}
		}
	};

	switch (videoOutput) {
	case VIDEOOUTPUT.STREAM_TRAILER:

		lastChannel = 4;
		encryptedChannel = 4;
		unecryptedChannel = 5;
		detailPage = "#detail_30min";

		if (Modernizr.video && Modernizr.video.ogg) {
			playVideo(0);
		} else {
			$('#error-msg').append("Your browser does not support live video");
		}

		break;

	case VIDEOOUTPUT.STREAM_RECORDED:

		lastChannel = 2;
		encryptedChannel = 1;
		unecryptedChannel = 3;
		detailPage = "#detail_zdf";

		if (Modernizr.video && Modernizr.video.ogg) {
			playVideo(0);
		} else {
			$('#error-msg').append("Your browser does not support live video");
		}

		break;

	case VIDEOOUTPUT.DOWNLOAD_TRAILER:

		lastChannel = 4;
		encryptedChannel = 4;
		unecryptedChannel = 5;
		detailPage = "#detail_30min";

		if (Modernizr.video && Modernizr.video.h264) {
			playVideo(0);
		} else {
			$('#error-msg').append("Your browser does not support h264 video");
		}

		break;
	}
	//checkToPlayUnencryptedVideo();
});

function checkToPlayUnencryptedVideo(payed) {
	//if (getUrlParameter("payed") == "") {
	//	showButtons = true;
	//} else if (getUrlParameter("payed") == "true") {
	if (payed == true) {
		//buttonsVisible = true;
		if (buttonsVisible == true) {
			buttonsVisible = false;
			$('#payment-menue').css("visibility", "hidden").css("opacity", "0");
		}
		showButtons = false;
		channels[encryptedChannel] = channels[unecryptedChannel];
		// play encrypted channel because we changed the array
		playVideo(encryptedChannel);
	}
}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);

	if (results == null)
		return "";
	else
		return results[1];
}

function fadeIn() {
	if (alreadyRunning == false) {
		alreadyRunning = true;
		$('#bottom-panel').animate({
			opacity : 0.85,
			top : '472px'
		}, 200, function() {
			if (staticVideoArrayNumber != encryptedChannel) {
				timerId = setTimeout('fadeOut()', 13000);
			}
		});
	} else {
		clearTimeout(timerId);
		timerId = setTimeout('fadeOut()', 13000);
	}
}

function fadeOut() {
	$('#bottom-panel').animate({
		opacity : 0,
		top : '814px'
	}, 200, function() {
		toggleButtons();
		alreadyRunning = false;
	});
}

function toggleButtons() {
	if (showButtons == true) {
		if (staticVideoArrayNumber == encryptedChannel
				&& buttonsVisible == false) {
			buttonsVisible = true;
			// focus the left Button
			navigateLeft();
			$('#payment-menue').css("visibility", "visible").animate({
				opacity : 1
			}, 200);
		} else if (buttonsVisible == true) {
			buttonsVisible = false;
			$('#payment-menue').css("visibility", "hidden").css("opacity", "0");
		}
	}
}

function navigateLeft() {
	if (buttonSelected == "dontbuy" && buttonsVisible == true) {
		$('#button-buy').css("background-image",
				"url('img/tmenu/Button_Focus.png')");
		$('#button-dontbuy').css("background-image",
				"url('img/tmenu/Button_NoFocus.png')");
		buttonSelected = "buy";
	}
}

function navigateRight() {
	if (buttonSelected == "buy" && buttonsVisible == true) {
		$('#button-buy').css("background-image",
				"url('img/tmenu/Button_NoFocus.png')");
		$('#button-dontbuy').css("background-image",
				"url('img/tmenu/Button_Focus.png')");
		buttonSelected = "dontbuy";
	}
}

function playVideo(staticVideoArrayNumberTemp) {
	var vid = document.getElementById('video_livetv');
	vid.src = channels[staticVideoArrayNumberTemp]["url"];
	vid.play();
	$('#channel-info').html(channels[staticVideoArrayNumberTemp]["name"]);
	staticVideoArrayNumber = staticVideoArrayNumberTemp;
	fadeIn();
	toggleButtons();
}

function handleKeyCode(kc) {
	switch (kc) {
	case VK_DOWN:
		if (currentPage == CURRENTPAGE.LIVETV) {
			if (staticVideoArrayNumber == 0) {
				playVideo(lastChannel);
			} else {
				playVideo(staticVideoArrayNumber - 1);
			}
			if (staticVideoArrayNumber == encryptedChannel
					&& showButtons == true) {
				clearTimeout(timerId);
			}
		} else if (currentPage == CURRENTPAGE.DETAIL_ZDF) {
			setFocusDown();
		} else if (currentPage == CURRENTPAGE.ADRESSSELECTOR) {
			navGrid.moveDown();
		}
		return true;
		break;
	case VK_UP:
		if (currentPage == CURRENTPAGE.LIVETV) {
			if (staticVideoArrayNumber == lastChannel) {
				playVideo(0);
			} else {
				playVideo(staticVideoArrayNumber + 1);
			}
			if (staticVideoArrayNumber == encryptedChannel
					&& showButtons == true) {
				clearTimeout(timerId);
			}
		} else if (currentPage == CURRENTPAGE.DETAIL_ZDF) {
			setFocusUp();
		} else if (currentPage == CURRENTPAGE.ADRESSSELECTOR) {
			navGrid.moveUp();
		}
		return true;
		break;
	case VK_LEFT:
		if (currentPage == CURRENTPAGE.LIVETV) {
			if (staticVideoArrayNumber == encryptedChannel) {
				navigateLeft();
			}
		}
		return true;
		break;
	case VK_RIGHT:
		if (currentPage == CURRENTPAGE.LIVETV) {
			if (staticVideoArrayNumber == encryptedChannel) {
				navigateRight();
			}
		}
		return true;
		break;

	case VK_ENTER:
		if (currentPage == CURRENTPAGE.LIVETV) {
			if (staticVideoArrayNumber == encryptedChannel) {
				if (buttonSelected == "dontbuy" && buttonsVisible == true) {
					clearTimeout(timerId);
					fadeOut();
				}
				if (buttonSelected == "buy" && buttonsVisible == true) {
					$('#livetv').hide();
					$('#video_livetv').get(0).pause();
					$(detailPage).show();
					if (detailPage == "#detail_zdf") {
						currentPage = CURRENTPAGE.DETAIL_ZDF;
					} else if (detailPage == "#detail_30min") {
						currentPage = CURRENTPAGE.DETAIL_30MIN;
					}
					first = document.getElementById("first");
					first.focus();
				}
			}
		} else if (currentPage == CURRENTPAGE.ADRESSSELECTOR) {
			navGrid.execute();
		} else {
			if ($("*:focus").get(0).id == "first") {
				if (currentPage == CURRENTPAGE.DETAIL_ZDF) {
					$('#detail_zdf').hide();
					$('#player_zdf').show();
					currentPage = CURRENTPAGE.PLAYER_ZDF;
					$('#video_zdf').get(0).load();
					$('#video_zdf').get(0).play();
					var vid = document.getElementById('video_zdf');
					vid.addEventListener('ended', back, false);
					function back(e) {
						setTimeout('backWithTimer()', 1500);
					}
					function backWithTimer() {
						history.go(-1);
					}
				}
			} else if ($("*:focus").get(0).id == "second") {
				navGrid.registerItems('navGrid');
				navGrid.moveToPos(0, 0);
				$('#detail_zdf').hide();
				$('#adress').show();
				currentPage = CURRENTPAGE.ADRESSSELECTOR;
				// addItemToBasket() function is in webinospaymentimpl.js
				//addItemToBasket(videoOutput);
			}
		}
		return true;
		break;

	case 8:
		if (currentPage == CURRENTPAGE.LIVETV) {

		} else if (currentPage == CURRENTPAGE.DETAIL_ZDF) {
			$('#detail_zdf').hide();
			$('#livetv').show();
			currentPage = CURRENTPAGE.LIVETV;
			$('#video_livetv').get(0).load();
			$('#video_livetv').get(0).play();
		} else if (currentPage == CURRENTPAGE.PLAYER_ZDF) {
			$('#video_zdf').get(0).pause();
			$('#player_zdf').hide();
			$('#detail_zdf').show();
			currentPage = CURRENTPAGE.DETAIL_ZDF;
		}
		return true;
		break;
	default:
		// alert(kc);
		return false;
	}
}

function setFocusUp() {
	var focussed = $("*:focus").get(0).id;
	switch (focussed) {
	case "seventh":
		$('#sixth').focus();
		break;
	case "sixth":
		$('#fifth').focus();
		break;
	case "fifth":
		$('#fourth').focus();
		break;
	case "fourth":
		$('#third').focus();
		break;
	case "third":
		$('#second').focus();
		break;
	case "second":
		$('#first').focus();
		break;
	}
};

function setFocusDown() {
	var focussed = $("*:focus").get(0).id;
	switch (focussed) {
	case "first":
		$('#second').focus();
		break;
	case "second":
		$('#third').focus();
		break;
	case "third":
		$('#fourth').focus();
		break;
	case "fourth":
		$('#fifth').focus();
		break;
	case "fifth":
		$('#sixth').focus();
		break;
	case "sixth":
		$('#seventh').focus();
		break;
	}

};

function timeMachine() {
	UR_Nu = new Date;
	UR_Indhold = showFilled(UR_Nu.getHours()) + ":"
			+ showFilled(UR_Nu.getMinutes());
	document.getElementById("ur").innerHTML = UR_Indhold;
	setTimeout("timeMachine()", 1000);
}
function showFilled(Value) {
	return (Value > 9) ? "" + Value : "0" + Value;
}
