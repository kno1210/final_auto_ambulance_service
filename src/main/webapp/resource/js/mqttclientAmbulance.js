//contextPath 구하기===============================
function getContextPath() {
	var hostIndex = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));
};
//=================================================

//전역변수=========================================
var contextPath = getContextPath();
var imgPath = contextPath + "/resource/images";
var statuses = {
		battery:0,
		mode:0,
		direction:"stop",
		speed:0,
		angle:0,
		working:false
};
//=================================================

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
	
//	console.log("car:" + ambulanceStatus);
	/* 연결되자마자 서버에서 차의 주행 상태 가져오기 */
	/*$.ajax({
		url:"carStatus.do",
		type:"POST",
		data:{ambulanceStatus:ambulanceStatus},
		success:function(data) {
			ambulanceStatus = data.carSt;
			console.log("성공:" + ambulanceStatus);
		},
		error:function() {
			console.log("실패");
		}
	});*/
	
	/* 연결되자마자 차에 주행 상태 요청하기 */
	message = new Paho.MQTT.Message("Send Me Driving Status of the Car.");
	message.destinationName = "car/" + carNo + "/drivingStatus";
	client.send(message);
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
	else if(message.destinationName == "ambulance/" + carNo + "/camera/frameLine") {
		//var cameraView = $("#cameraView").attr("src", "data:image/jpg;base64," + message.payloadString);
		cam.src = "data:image/jpg;base64," + message.payloadString;
//		console.log("토픽 : " + message.destinationName);
	}
	//=====================================================================
	
	//차 컨트롤============================================================
	//=====================================================================
	
	//차 상태를 달라는 요청================================================
	//=====================================================================
	
	//차 상태를 받는 토픽==================================================
	else if(message.destinationName == "ambulance/" + carNo + "/status") {
		statuses = JSON.parse(message.payloadString);
		console.log(statuses);
		
		//배터리
		battery(statuses.battery);
		
		//자동-수동 주행
		
		//방향
		
		//속도
		
		//각도
		
		//이송중/완료
		
	}
	//=====================================================================
	
	//컨트롤타워에 차 상태 보내주기============================
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
/*function drivingStatusSwitch(id) {
	var drivingStatus = $("#drivingStatus");
	if(id == "start") { //출발 버튼이니까 이송중으로 상태 바꾸기
		ambulanceStatus = "transport";
		drivingStatus.html("이송 중");
	}
	else if(id == "finish") { //완료 버튼이니까 대기중으로 상태 바꾸기
		ambulanceStatus = "wait";
		drivingStatus.html("대기 중");
	}
	
	$.ajax({
		url:"carStatus.do",
		type:"POST",
		data:{ambulanceStatus:ambulanceStatus},
		success:function(data) {
			ambulanceStatus = data.carSt;
			console.log("성공:" + ambulanceStatus);
		},
		error:function() {
			console.log("실패");
		}
	});
}*/
//=========================================================================

//차 상태 컨트롤 타워로 전송===============================================
//function sendStatus() {
//	message = new Paho.MQTT.Message(ambulance);
//	message.destination = "controltower/ambulanceStatus";
//	client.send(message);
//}
//=========================================================================

//배터리===================================================================
function battery(batteryData) {
	if(batteryData > 80) { //81~ 100 //5칸
//		batteryImage.attr("src", imgPath + "/battery_100.png");
		bat.src = imgPath + "/battery_100.png";
	}
	else if(batteryData > 60) { //61~ 80 //4칸
//		batteryImage.attr("src", imgPath + "/battery_80.png");
		bat.src = imgPath + "/battery_80.png";
	}
	else if(batteryData > 40) { //41~ 60 //3칸
//		batteryImage.attr("src", imgPath + "/battery_60.png");
		bat.src = imgPath + "/battery_60.png";
	}
	else if(batteryData > 20) { //21~ 40 //2칸
//		batteryImage.attr("src", imgPath + "/battery_40.png");
		bat.src = imgPath + "/battery_40.png";
	}
	else if(batteryData > 10) { //11~ 20 //1칸
//		batteryImage.attr("src", imgPath + "/battery_20.png");
		bat.src = imgPath + "/battery_20.png";
	}
	else if(batteryData <= 10) { //0~ 10 //빨간칸
//		batteryAlert.html("배터리 충전 필요!!");
//		batteryImage.attr("src", imgPath + "/battery_10(1).png");
		bat.src = imgPath + "/battery_10(1).png";
	}
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
			var topic = "command/" + carNo + "/frontTire/left";
			console.log(topic);
		}else if(keycode == 39) {
			//right
			$("#right").css("background-color", "green");
			topic = "command/" + carNo + "/frontTire/right";
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
			var topic = "command/" + carNo + "/backTire/forward";
		} else if(keycode == 40) {
			// down
			$("#down").css("background-color", "green");
			var topic = "command/" + carNo + "/backTire/backward";
		} else if(keycode == 32) {
			//spacebar
			stopped = true;
			var topic = "command/" + carNo + "/backTire/stop";
		}
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	}
	
	if(keycode == 69) {
        message = new Paho.MQTT.Message("process_stop");
        message.destinationName = "command/" + carNo + "/process/stop";
        client.send(message);
     }
	
	if(keycode == 65) {
        message = new Paho.MQTT.Message("AUTO_MODE");
        message.destinationName = "command/" + carNo + "/changemode/auto";
        client.send(message);
     }
     if(keycode == 77) {
        message = new Paho.MQTT.Message("MANUAL_MODE");
        message.destinationName = "command/"+ carNo + "/changemode/manual";
        client.send(message);
     }
     if(keycode == 67) {
         message = new Paho.MQTT.Message("CHANGE_ROAD");
         message.destinationName = "command/" + carNo + "/road/change";
         client.send(message);
      }
}

function onkeyup_handler(event) {
	var keycode = event.which || event.keycode;
	if(keycode == 37 || keycode == 39) {
		$("#left").css("background-color", "");
		$("#right").css("background-color", "");
		var topic = "command/" + carNo + "/frontTire/front";
		message = new Paho.MQTT.Message("frontTire");
		message.destinationName = topic;
		client.send(message);
	}
	if(keycode == 38 || keycode == 40) {
		$("#up").css("background-color", "");
		$("#down").css("background-color", "");
		var topic = "command/" + carNo + "/backTire/stop";
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	}
}
//=========================================================================