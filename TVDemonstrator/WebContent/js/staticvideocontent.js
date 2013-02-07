var channels = new Array();
var streamerIp = "192.168.1.3";
var downloadUrlPraefix = "http://xxx/videos";

switch (videoOutput) {
case VIDEOOUTPUT.STREAM_TRAILER:

	channels[0] = new Object();
	channels[0]["url"] = "http://" + streamerIp + ":8081/video.ogg";
	channels[0]["name"] = "Friends with benefits";

	channels[1] = new Object();
	channels[1]["url"] = "http://" + streamerIp + ":8082/video.ogg";
	channels[1]["name"] = "Resturlaub";

	channels[2] = new Object();
	channels[2]["url"] = "http://" + streamerIp + ":8083/video.ogg";
	channels[2]["name"] = "Die Relativitätstheorie der Liebe";

	channels[3] = new Object();
	channels[3]["url"] = "http://" + streamerIp + ":8084/video.ogg";
	channels[3]["name"] = "Footloose";

	channels[4] = new Object();
	channels[4]["url"] = "http://" + streamerIp + ":8085/video.ogg";
	channels[4]["name"] = "Encrypted content: 30 minutes or less";

	channels[5] = new Object();
	channels[5]["url"] = "http://" + streamerIp + ":8086/video.ogg";
	channels[5]["name"] = "Unencrypted content: 30 minutes or less";

	break;
	
case VIDEOOUTPUT.STREAM_RECORDED:

	channels[0] = new Object();
	channels[0]["url"] = "http://" + streamerIp + ":8081/video.ogg";
	channels[0]["name"] = "ARD";

	channels[1] = new Object();
	channels[1]["url"] = "http://" + streamerIp + ":8082/video.ogg";
	channels[1]["name"] = "Encrypted Content: ZDF";

	channels[2] = new Object();
	channels[2]["url"] = "http://" + streamerIp + ":8083/video.ogg";
	channels[2]["name"] = "ARTE";

	channels[3] = new Object();
	channels[3]["url"] = "http://" + streamerIp + ":8084/video.ogg";
	channels[3]["name"] = "Unencrypted Content: ZDF";

	break;

case VIDEOOUTPUT.DOWNLOAD_TRAILER:

	channels[0] = new Object();
	channels[0]["url"] = downloadUrlPraefix + "/25560.mp4";
	channels[0]["name"] = "Friends with benefits";

	channels[1] = new Object();
	channels[1]["url"] = downloadUrlPraefix + "/26628.mp4";
	channels[1]["name"] = "Resturlaub";

	channels[2] = new Object();
	channels[2]["url"] = downloadUrlPraefix + "/27412.mp4";
	channels[2]["name"] = "Die Relativitätstheorie der Liebe";

	channels[3] = new Object();
	channels[3]["url"] = downloadUrlPraefix + "/27554.mp4";
	channels[3]["name"] = "Footloose";

	channels[4] = new Object();
	channels[4]["url"] = downloadUrlPraefix + "/28327.mp4";
	channels[4]["name"] = "Encrypted content: 30 minutes or less";

	channels[5] = new Object();
	channels[5]["url"] = downloadUrlPraefix + "/28327.mp4";
	channels[5]["name"] = "Unencrypted content: 30 minutes or less";

	break;
}
