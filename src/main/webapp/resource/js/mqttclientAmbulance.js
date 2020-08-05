//contextPath 구하기===============================
function getContextPath() {
	var hostIndex = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));
};

var contextPath = getContextPath();
//=================================================

//차의 상태
//대기 중 : wait
//이송 중 : transport
//정비 필요 : overhaul
var ambulanceStatus = "wait";

$(function() {
	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());
//	client = new Paho.MQTT.Client("192.168.3.183", 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});
});

function onConnect() {
	console.log("onConnect");
	
	/*controltower로 부터 환자정보와 출동명령을 받아오기 위한 토픽*/
	client.subscribe("/carAssign");
	
	/*ambulance에게 출동명령 가능여부를 알려주기 위한 토픽*/
	client.subscribe("/giveMeDispatchPossible");
	
	/**/
	client.subscribe("ambulance/#");
}

var movingPatient;
function onMessageArrived(message) {
	console.log("message arrived");
	if(message.destinationName == "/carAssign") {
		$.ajax({
			url:"movingPatientInfo.do",
			type:"POST",
			success:function(data){
				var movingPatient = JSON.parse(data.movingPatient);
				$("#pno").text(movingPatient.pno);
				$("#preportTime").text(movingPatient.preportTime);
				$("#preportTel").text(movingPatient.preportTel);
				$("#plocation").text(movingPatient.plocation);
				$("#pname").text(movingPatient.pname);
				$("#psymptom").text(movingPatient.psymptom);
				$("#psex").text(movingPatient.psex);
				$("#page").text(movingPatient.page);
				$("#pbloodType").text(movingPatient.pbloodType);
				
				dispatchPossible = "impossible";
				message = new Paho.MQTT.Message(dispatchPossible);
				message.destinationName = "/dispatchPossible";
				client.send(message);
			},
			error:function(){
				window.alert("error");
			}
		})
	}else if(message.destinationName == "/giveMeDispatchPossible") {
		console.log("message arrived : /giveMeDispatchPossible");
		$.ajax({
			url:"dispatchPossible.do",
			type:"POST",
			success:function(data){
				var data = JSON.parse(data);
				var carRow = data.carRow;
				console.log("carRow : " + carRow);
				if(carRow != 0) {
					dispatchPossible = "impossible";
				}else {
					dispatchPossible = "possible";
				}
				message = new Paho.MQTT.Message(dispatchPossible);
				message.destinationName ="/dispatchPossible";
				client.send(message);
				console.log("message send : /dispatchPossible");
			},
			error:function(){
				window.alert("ajax error (dispatchPossible.do)");
			}
		})
	}
	//카메라 영상 출력=====================================================
	else if(message.destinationName == "ambulance/camera/frameLine") {
		var cameraView = $("#cameraView").attr("src", "data:image/jpg;base64," + message.payloadString);
		console.log("line!");
	}
	
	else if(message.destinationName == "ambulance/camera/frameDetect") {
		var objectView = $("#objectView").attr("src", "data:image/jpg;base64," + message.payloadString);
		console.log("object!");
	}
	//=====================================================================
	
	//차 컨트롤============================================================
	//=====================================================================
	
	//배터리 상태 수신=====================================================
	else if(message.destinationName == "ambulance/battery/status") {
		var batteryStatus = JSON.parse(message.payloadString);
		console.log("배터리 : " + batteryStatus);
		$("#batteryAlert").html("");
		$("#batteryStatus").html("배터리 잔량 : " + batteryStatus + "%");
		if(batteryStatus > 80) { //81~ 100 //5칸
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_100.png");
		}
		else if(batteryStatus > 60) { //61~ 80 //4칸
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_80.png");
		}
		else if(batteryStatus > 40) { //41~ 60 //3칸
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_60.png");
		}
		else if(batteryStatus > 20) { //21~ 40 //2칸
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_40.png");
		}
		else if(batteryStatus > 10) { //11~ 20 //1칸
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_20.png");
		}
		else if(batteryStatus <= 10) { //0~ 10 //빨간칸
			$("#batteryAlert").html("배터리 충전 필요!!");
			$("#batteryImage").attr("src", contextPath + "/resource/img/battery_10.png");
			ambulanceStatus = "overhaul";
		}
	}
	//=====================================================================
}

//자동/수동 주행 바꾸기====================================================
function autoModeSwitch(id) {
	message = new Paho.MQTT.Message("autoModeSwitch");
	if(id == "auto") {
		message.destinationName = "command/changemode/auto";
		client.send(message);
	}
	else if(id == "manual") {
		message.destinationName = "command/changemode/manual";
		client.send(message);
	}
}
//=========================================================================

//현재 운행 상태 바꾸기====================================================
function drivingStatusSwitch(id) {
	if(id == "start") { //출발 버튼이니까 이송중으로 상태 바꾸기
		ambulanceStatus = "transport";
	}
	else if(id == "finish") { //완료 버튼이니까 대기중으로 상태 바꾸기
		ambulanceStatus = "wait";
	}
}
//=========================================================================

//차 상태 컨트롤 타워로 전송===============================================
function sendStatus() {
	message = new Paho.MQTT.Message(ambulance);
	message.destination = "controltower/ambulanceStatus";
	client.send(message);
}
//=========================================================================

//수동 주행 키=============================================================
document.onkeydown = onkeydown_handler;
document.onkeyup = onkeyup_handler;

function onkeydown_handler(event) {
	var keycode = event.which || event.keycode;
	console.log(keycode);
	if(keycode == 37 || keycode == 39) {
		if(keycode == 37) {
			//left
			$("#left").css("background-color", "green");
			var topic = "command/frontTire/left";
			console.log(topic);
		}else if(keycode == 39) {
			//right
			$("#right").css("background-color", "green");
			topic = "command/frontTire/right";
			console.log(topic);
		}
		message = new Paho.MQTT.Message("frontTire");
		message.destinationName = topic;
		client.send(message);
	}
	if(keycode == 38 || keycode == 40 || keycode == 32) {
		if(keycode == 38) {
			// up
			$("#up").css("background-color", "green");
			var topic = "command/backTire/forward";
		} else if(keycode == 40) {
			// down
			$("#down").css("background-color", "green");
			var topic = "command/backTire/backward";
		} else if(keycode == 32) {
			//spacebar
			stopped = true;
			var topic = "command/backTire/stop";
		}
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	}
}

function onkeyup_handler(event) {
	var keycode = event.which || event.keycode;
	if(keycode == 37 || keycode == 39) {
		$("#left").css("background-color", "");
		$("#right").css("background-color", "");
		var topic = "command/frontTire/front";
		message = new Paho.MQTT.Message("frontTire");
		message.destinationName = topic;
		client.send(message);
	}
	/*if(keycode == 38 || keycode == 40) {
		$("#up").css("background-color", "");
		$("#down").css("background-color", "");
		var topic = "command/backTire/stop";
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	}*/
}
//=========================================================================