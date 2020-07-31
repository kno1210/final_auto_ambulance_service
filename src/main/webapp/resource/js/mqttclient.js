$(function() {
	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());
//	client = new Paho.MQTT.Client("192.168.3.183", 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});
});

function onConnect() {
	console.log("onConnect");
	console.log("연결");
	client.subscribe("ambulance/#");
	client.subscribe("/patientINFO");
	client.subscribe("/giveMeSendPossible");
}

function onMessageArrived(message) {
	console.log("message arrived");
	if(message.destinationName == "ambulance/camera/frameLine") {
		var cameraView = $("#cameraView").attr("src", "data:image/jpg;base64," + message.payloadString);
	}
	else if(message.destinationName == "/patientINFO") {
		var patientInformation = JSON.parse(message.payloadString);
		$.ajax({
			url:"patientInformation.do",
			type:"POST",
			data:patientInformation,
			success:function(data){
				window.alert("success");
				//가장 상위에 있는 환자 데이터 가져오기 =====================================================================
				var nowPatient = JSON.parse(data.nowPatient);
				$("#pno").text(nowPatient.pno);
				$("#preportTime").text(nowPatient.preportTime);
				$("#plocation").text(nowPatient.plocation);
				$("#pname").text(nowPatient.pname);
				$("#psymptom").text(nowPatient.psymptom);
				$("#pbloodType").text(nowPatient.pbloodType);
				$("#psex").text(nowPatient.psex);
				$("#page").text(nowPatient.page);
				$("#preportTel").text(nowPatient.preportTel);
				
				var totalRows = data.totalRows;
				if(totalRows > 0) {
					var patientWating = String(totalRows-1);
					$("#content2").text("대기환자 수 : " + patientWating);
				}
				var value;
				if(totalRows >= 6) {
					value = "No Send";
				}else {
					value = "Yes Send";
				}
				var target = {
						value:value,
						totalRows:totalRows
				}
				message = new Paho.MQTT.Message(JSON.stringify(target));
				message.destinationName = "/sendPossible";
				client.send(message);
				console.log(message.payloadString);				
			},
			error:function(){
				window.alert("fail");
			}
		})
	}
	//차 컨트롤===========================================================
	else if(message.destinationName == "ambulance/carControl") {
		var jsonObject = JSON.parse(message.payloadString);
		
		document.getElementById("backTire_state").innerHTML = "현재상태 : " + jsonObject["dcMotor_state"];
		
		document.getElementById("backTire_state").innerHTML = "현재상태 : " + jsonObject["dcMotor_state"];
	}
	//=====================================================================
	
	//배터리 상태 수신===========================================================
	else if(message.destinationName == "ambulance/battery/status") {
		console.log("배터리");
		var batteryStatus = JSON.parse(message.payloadString);
		console.log(batteryStatus);
		$("#batteryView #batteryStatus").html("배터리 잔량 : " + batteryStatus + "%");
		if(batteryStatus <= 73) {
			$("#batteryView #batteryAlert").html("배터리 충전이 필요합니다!!");
		}
	}
	//=====================================================================
	
	//119가 mqtt에 onConnect되자마자 publish를 해도 되는지 검사=====================================================================
	else if(message.destinationName == "/giveMeSendPossible") {
	  console.log("message arrived : /giveMeSendPossible");
	  $.ajax({
		  url:"sendPossible.do",
		  type:"POST",
		  success:function(data){
			  var totalRows = data.totalRows;
			  var value;
			  if(totalRows >= 6) {
				  value = "No Send";
			  }else {
				  value = "Yes Send";
			  }
			  var target = {
					  value:value,
					  totalRows:totalRows
			  }
			  message = new Paho.MQTT.Message(JSON.stringify(target));
			  message.destinationName = "/sendPossible";
			  client.send(message);
			  console.log(message.payloadString);
			  console.log("message send : sendPossible");
		  },
		  error:function(){
			  console.log("ajax error");
		  }
	  })
	}
}

var speed = 0;
var order = "stop";
var stopped = false;
function backTire_control(setOrder, setSpeed) {
	var message = 0;
	if(setSpeed != undefined) {
		speed = setSpeed;
	}
	if(stopped == true) {
		speed = 0;
		stopped = false;
	}
	if(setOrder != '0') {
		order = setOrder;
	}
	if(order == "stop") {
		speed = 0;
	}
	
	var target = {
			direction:order,
			pwm:speed
	};
	
	message = new Paho.MQTT.Message(JSON.stringify(target));
	message.destinationName = "command/backTire/button";
	client.send(message);
}

var isPressed = false;

document.onkeydown = onkeydown_handler;
document.onkeyup = onkeyup_handler;

function onkeydown_handler(event) {
	var keycode = event.which || event.keycode;
	console.log(keycode);
	if(keycode == 87 || keycode== 65 || keycode== 83 || keycode== 68){		//카메라 제어
		if(keycode == 83){					//앞
			$("#cameradown").css("background-color", "green");
			var topic="command/camera/front";
		} else if(keycode == 65){			//왼쪽
			$("#cameraleft").css("background-color", "green");
			console.log(keycode);
			var topic="command/camera/left";
		} else if(keycode == 87){			//뒤
			$("#cameraup").css("background-color", "green");
			var topic="command/camera/back";
		} else if(keycode == 68){			//오른쪽
			$("#cameraright").css("background-color", "green");
			var topic="command/camera/right";
		}
		message = new Paho.MQTT.Message("camera");
		message.destinationName = topic;
		client.send(message);
	}
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
	if(keycode == 100 || keycode == 102) {		// 거리 센서 제어
		if(keycode == 100) {					//좌
			$("#sonicleft").css("background-color", "green");
			var topic = "command/distance/left";
		} else if(keycode == 102) {				//우
			$("#sonicright").css("background-color", "green");
			var topic = "command/distance/right";
		} 
		message = new Paho.MQTT.Message("distance");
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
	if(keycode == 38 || keycode == 40) {
		$("#up").css("background-color", "");
		$("#down").css("background-color", "");
		var topic = "command/backTire/respeed";
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	}
	if(keycode == 87 || keycode== 65 || keycode== 83 || keycode== 68) {
		$("#cameraup").css("background-color", "");
		$("#cameradown").css("background-color", "");
		$("#cameraright").css("background-color", "");
		$("#cameraleft").css("background-color", "");
	}
	if(keycode == 100 || keycode == 102) {
		$("#sonicleft").css("background-color", "");
		$("#sonicright").css("background-color", "");
	}
}

var backbuttonPressed = false;
var frontbuttonPressed = false;
function tire_button_down(direction) {
	if(direction=="up" || direction=="down") {
		backbuttonPressed = true;
	}
	else {
		frontbuttonPressed = true;
	}
	
	tire_control(direction);
	
}

function tire_button_up(direction) {
	if(direction=="up" || direction=="down") {
		backbuttonPressed = false;
		var topic = "command/backTire/respeed";
		message = new Paho.MQTT.Message("backTire");
		message.destinationName = topic;
		client.send(message);
	} else {
		frontbuttonPressed = false;
		var topic = "command/frontTire/front";
		message = new Paho.MQTT.Message("frontTire");
		message.destinationName = topic;
		client.send(message);
	}
}

function tire_control(direction) {
	if(backbuttonPressed) {
		if(direction == 'up') {
			var topic = "command/backTire/forward";
		}else if(direction == 'down') {
			var topic = "command/backTire/backward";
		}
		message = new Paho.MQTT.Message("tire");
		message.destinationName = topic;
		client.send(message);
		
		setTimeout(function() {
			tire_control(direction);
		}, 30);
	}
	if(frontbuttonPressed) {
		if(direction == 'left') {
			var topic = "command/frontTire/left";
		}else if(direction == 'right') {
			var topic = "command/frontTire/right";
		}
		message = new Paho.MQTT.Message("tire");
		message.destinationName = topic;
		client.send(message);
		
		setTimeout(function() {
			tire_control(direction);
		}, 30);
	}
}

var go = false;
function tire_control_touch(direction) {
	if(go) {
		if(direction == "up") {
			var topic = "command/backTire/forward";
		}
		if(direction == "down") {
			var topic = "command/backTire/backward";
		}
		if(direction == "left") {
			var topic = "command/frontTire/left";
		}
		if(direction == "right") {
			var topic = "command/frontTire/right";
		}
		message = new Paho.MQTT.Message("tire");
		message.destinationName = topic;
		client.send(message);
		setTimeout(function() {
			tire_control_touch(direction);
		}, 30);
	}else {
		if(direction == "up" || direction == "down") {
			var topic = "command/backTire/respeed";
			message = new Paho.MQTT.Message("tire");
			message.destinationName = topic;
			client.send(message);	
		}else {
			var topic = "command/frontTire/front";
			message = new Paho.MQTT.Message("tire");
			message.destinationName = topic;
			client.send(message);	
		}
		
	}	
}

var move = false;
function camera_control_touch(motor_direction){
	if(move){
		if(motor_direction == 'cameraup') {
			var topic="command/camera/back";
		}if(motor_direction == 'cameradown') {
			var topic="command/camera/front";
		}if(motor_direction == 'cameraleft') {
			var topic="command/camera/left";
		}if(motor_direction == 'cameraright') {
			var topic="command/camera/right";
		}if(motor_direction == 'sonicleft') {
			var topic="command/distance/left";
		}if(motor_direction == 'sonicright') {
			var topic="command/distance/right";
		}
		message = new Paho.MQTT.Message("camera&sonic");
		message.destinationName = topic;
		client.send(message);
		setTimeout(function() {
			camera_control_touch(motor_direction);
		}, 30);
	}
}

function click_w() {
	console.log("클릭 w 실행됨");
	message = new Paho.MQTT.Message("click_w")
	message.destinationName = "command/camera/back";
	client.send(message);
}
function click_a() {
	console.log("클릭 a 실행됨");
	message = new Paho.MQTT.Message("click_a")
	message.destinationName = "command/camera/left";
	client.send(message);
}
function click_d() {
	message = new Paho.MQTT.Message("click_d")
	message.destinationName = "command/camera/right";
	client.send(message);
}
function click_s() {
	message = new Paho.MQTT.Message("click_s")
	message.destinationName = "command/camera/front";
	client.send(message);
}

function click_up() {
	message = new Paho.MQTT.Message("click_s")
	message.destinationName = "command/backTire/forward";
	client.send(message);
}
function click_down() {
	message = new Paho.MQTT.Message("click_s")
	message.destinationName = "command/backTire/backward";
	client.send(message);
}
function click_left() {
	message = new Paho.MQTT.Message("click_left")
	message.destinationName = "command/frontTire/left";
	client.send(message);
}
function click_right() {
	message = new Paho.MQTT.Message("click_right")
	message.destinationName = "command/frontTire/right";
	client.send(message);
}

function click_4() {
	message = new Paho.MQTT.Message("click_s")
	message.destinationName = "command/distance/left";
	client.send(message);
}
function click_6() {
	message = new Paho.MQTT.Message("click_s")
	message.destinationName = "command/distance/right";
	client.send(message);
}
