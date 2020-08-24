//contextPath 구하기===============================
function getContextPath() {
	var hostIndex = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));
};
//=================================================

//전역변수=========================================
var contextPath = getContextPath();
var imgPath = contextPath + "/resource/images";
var stat = {
		battery:0,
		angle:0,
		speed:0,
		direction:"stop",
		mode:0,
		working:false
};
var position = "none";
//=================================================
let ipid;
subList = ["ambulance1", "ambulance2"];
lastSendtimearr = [Date.now(), Date.now()];

$(function(){
   ipid = new Date().getTime().toString();
   // location.hostname : IP(WAS와 MQTT가 같은 곳에서 실행되고 있어야 같은 IP로 쓸 수 있다.)
//   client = new Paho.MQTT.Client(location.hostname, 61614, ipid);
   	client = new Paho.MQTT.Client("192.168.3.183", 61614, ipid);
//	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());
//	client = new Paho.MQTT.Client("192.168.3.183", 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});
	
});

$(document).ready(function() {
    setInterval(getInterval, 750);
 });
 
 function response(index) {
    message = new Paho.MQTT.Message(ipid);
    message.destinationName = "/res/" + subList[index];
    client.send(message);
 }
 
 function getInterval() {
    nowtime = Date.now();
    lastSendtimearr.forEach(function(element, index, array) {
       if(nowtime - element > 750) {
          console.log(subList[index] + "연결안됨, 시간:" + String(nowtime - element));
          response(index);
       }
    });
 }
 
//배터리===================================================================
 function battery(batteryData) {
 	if(batteryData > 80) { //81~ 100 //5칸
// 		batteryImage.attr("src", imgPath + "/battery_100.png");
 		bat.src = imgPath + "/battery_100.png";
 	}
 	else if(batteryData > 60) { //61~ 80 //4칸
// 		batteryImage.attr("src", imgPath + "/battery_80.png");
 		bat.src = imgPath + "/battery_80.png";
 	}
 	else if(batteryData > 40) { //41~ 60 //3칸
// 		batteryImage.attr("src", imgPath + "/battery_60.png");
 		bat.src = imgPath + "/battery_60.png";
 	}
 	else if(batteryData > 20) { //21~ 40 //2칸
// 		batteryImage.attr("src", imgPath + "/battery_40.png");
 		bat.src = imgPath + "/battery_40.png";
 	}
 	else if(batteryData > 10) { //11~ 20 //1칸
// 		batteryImage.attr("src", imgPath + "/battery_20.png");
 		bat.src = imgPath + "/battery_20.png";
 	}
 	else if(batteryData <= 10) { //0~ 10 //빨간칸
// 		batteryAlert.html("배터리 충전 필요!!");
// 		batteryImage.attr("src", imgPath + "/battery_10(1).png");
 		bat.src = imgPath + "/battery_10(1).png";
 	}
 }
 //=========================================================================
 
//차 상태 컨트롤 타워로 전송================================================
 function sendStatuses() {
 	message = new Paho.MQTT.Message(carStatus);
 	message.destination = "controltower/" + carNo + "/carStatus";
 	client.send(message);
 }
 //=========================================================================
 
function onConnect() {
	console.log("onConnect");
	
	/*controltower로 부터 환자정보와 출동명령을 받아오기 위한 토픽*/
	client.subscribe("/carAssign");
	
	/*ambulance에게 출동명령 가능여부를 알려주기 위한 토픽*/
	client.subscribe("/giveMeDispatchPossible");
	
	/**/
	client.subscribe("ambulance/#");
	/*
	var locationList = ["A", "B", "C", "D", "E", "F", "H", "I", "J", "K", "M", "N", "P", "S", "T"]
	var j = 0;
	message = new Paho.MQTT.Message(locationList[14]);
	message.destinationName = "ambulance/1/position";
	client.send(message);
	setInterval(function() {
		if(j > 14) {j = 0;}
		message = new Paho.MQTT.Message(locationList[j]);
		message.destinationName = "ambulance/1/position";
		client.send(message);
		j += 1;
	}, 1000);*/
}

var movingPatient;
function onMessageArrived(message) {
//	console.log("message arrived");
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
		response(0);
		lastSendtimearr[0] = Date.now();
		//var cameraView = $("#cameraView").attr("src", "data:image/jpg;base64," + message.payloadString);
		cam.src = "data:image/jpg;base64," + message.payloadString;
//		console.log("토픽 : " + message.destinationName);
	}
	//=====================================================================
	
	//차 상태를 받는 토픽==================================================
	else if(message.destinationName == "ambulance/" + carNo + "/status") {
		stat = JSON.parse(message.payloadString);
		console.log(stat);
		
		//배터리
		battery(stat.battery);
		
		//자동-수동 주행
		
		//방향
		
		//속도
		
		//각도
		
		//이송중/완료
		/*if() {
			var carStatuses = [];
			for(i=0; i<statuses.length; i++) {
				carStatuses[i]["battery"] = statuses[i].battery;
				carstatuses[i]["working"] = statuses[i].working;
			}
			sendStatuses(carStatuses);
		}*/
	}
	//=====================================================================
	
	//위치=================================================================
	else if(message.destinationName == "ambulance/" + carNo + "/position") {
		var position = message.payloadString;
		
		var index;
		if(position == "A") {
			index = 0;
		}else if(position == "B") {
			index = 1;
		}else if(position == "C") {
			index = 2;
		}else if(position == "D") {
			index = 3;
		}else if(position == "E") {
			index = 4;
		}else if(position == "F") {
			index = 5;
		}else if(position == "H") {
			index = 6;
		}else if(position == "I") {
			index = 7;
		}else if(position == "J") {
			index = 8;
		}else if(position == "K") {
			index = 9;
		}else if(position == "M") {
			index = 10;
		}else if(position == "N") {
			index = 11;
		}else if(position == "P") {
			index = 12;
		}else if(position == "S") {
			index = 13;
		}else if(position == "T") {
			index = 14;
		}
		mapArea.setCarLocation(index);	// carLocX, carLocY에 값을 주는 메소드
		mapArea.drawCar();		// car 위치에 빨간 동그라미를 그림
		
		if(mapArea.carLocation == mapArea.patientLocation) {
			mapArea.destination = "hospital";
			mapArea.erasePatient();
			destinationNo = mapArea.hospitalLocation;
		}else if(mapArea.carLocation == mapArea.hospitalLocation) {
			mapArea.destination = "patient";
			if(destinationNo == mapArea.hospitalLocation) {
				var patientNo = document.getElementById("pno").innerHTML;
				$.ajax({
					url:"deletePatient.do",
					type:"POST",
					data:{patientNo:document.getElementById("pno").innerHTML},
					success:function(data){
						$("#pno").text("");
						$("#plocation").text("");
						$("#preportTel").text("");
					},
					error:function(){
						window.alert("error");
					}
				})
			}
			
		}
		mapArea.drawPath();
		carLocX = mapArea.getCarLocX(); 	// Map에서 car 좌표를 얻어오는 메소드
		carLocY = mapArea.getCarLocY();
	}
	//=====================================================================
	
	//객체=================================================================
	else if(message.destinationName == "ambulance/" + carNo + "/object") {
		var object = message.payloadString;
		
		console.log("객체:" + object);
	}
	//=====================================================================
	
	//컨트롤타워에 차 상태 보내주기========================================
	
	//=====================================================================
}

// 지도와 관련된 클래스 선언
var locationList = [
	[540, 397],
    [550, 300],
    [550, 200],
    [550, 100],
    [490, 55],
    [350, 44],
    [235, 22],
    [135, 20],
    [88, 89],
    [20, 140],
    [20, 260],
    [20, 368],
    [120, 410],
    [270, 410],
    [420, 410]
]

function mapArea(ctxMap, ctxCar, ctxPatient, ctxPath, x, y) {
	this.ctxMap = ctxMap;	// 맵 그리기용 ctx
	this.ctxCar = ctxCar;	// 자동차 위치 그리기용 ctx
	this.ctxPatient = ctxPatient;
	this.ctxPath = ctxPath;
	this.x = x;
	this.y = y;
	
	this.mapWidth = 607;
	this.mapHeight = 470;	
	
	this.carLocation;
	this.carLocX;	// 자동차위치 x좌표
	this.carLocY;	// 자동차위치 y좌표
	this.carColor;
	this.carRadius;
	
	this.patientLocation;
	this.patientLocX;
	this.patientLocY;
	
	this.hospitalLocation = 14;
	this.hospitalLocX = locationList[this.hospitalLocation][0];
  	this.hospitalLocY = locationList[this.hospitalLocation][1];
	
  	this.destination = "patient";
	// 맵을 그리는 메소드
	this.drawTrack = function() {
		var lineWidthList = ["29", "27", "1"];
		var strokeStyleList = ["white", "black", "white"];

		for(i=0; i<=2; i++) {
			 this.ctxMap.beginPath();
			 this.ctxMap.lineWidth = lineWidthList[i];
			 this.ctxMap.strokeStyle = strokeStyleList[i];
			 if(i==2) {
				this.ctxMap.setLineDash([20, 10]);
			 }
			 this.ctxMap.moveTo(150, 18);
			 this.ctxMap.lineTo(210, 18);
			 this.ctxMap.lineTo(420, 55);
			 this.ctxMap.lineTo(500, 55);
			 this.ctxMap.quadraticCurveTo(550, 55, 550, 105);
			 
			 this.ctxMap.lineTo(550, 360);
			 this.ctxMap.quadraticCurveTo(550, 410, 500, 410);
			 
			 this.ctxMap.lineTo(70, 410);
			 this.ctxMap.quadraticCurveTo(20, 410, 20, 360);
			 
			 this.ctxMap.lineTo(20, 150);
			 this.ctxMap.quadraticCurveTo(20, 100, 50, 100);
			 this.ctxMap.quadraticCurveTo(100, 100, 100, 50);
			 this.ctxMap.quadraticCurveTo(100, 18, 150, 18);
			 
			 this.ctxMap.stroke();
		}
	  	this.ctxMap.setLineDash([]);
	  	
	  	this.ctxMap.fillStyle = "yellow";
	  	this.ctxMap.fillRect(this.hospitalLocX-15, this.hospitalLocY-45, 40, 30);
	  	this.ctxMap.fillStyle = "black";
	  	this.ctxMap.fillText("병원", this.hospitalLocX, this.hospitalLocY-30);
	}
	
	// 자동차 색깔과 크기 설정
	this.readyDrawCar = function(color, radius) {
		this.carColor = color;
		this.carRadius = radius;
	}

	// 자동차 위치 값 주기
	this.setCarLocation = function(carLocation) {
		this.carLocation = carLocation;
		this.carLocX = locationList[this.carLocation][0];
		this.carLocY = locationList[this.carLocation][1];
	}
	
	// 자동차 그리기
	this.drawCar = function() {
		this.ctxCar.clearRect(this.x, this.y, this.mapWidth, this.mapHeight);
		this.ctxCar.beginPath();
		this.ctxCar.fillStyle = this.carColor;
		this.ctxCar.arc(this.carLocX, this.carLocY, this.carRadius, 0, 2*Math.PI);
		this.ctxCar.fill();
		this.ctxCar.stroke();
	}
	
	// 자동차 위치 x 좌표 얻기
	this.getCarLocX = function() {
		return this.carLocX;
	}
	// 자동차 위치 y 좌표 얻기
	this.getCarLocY = function() {
		return this.carLocY;
	}
	
	this.setPatientLocation = function(patientLocation) {
		this.patientLocation = patientLocation;
		this.patientLocX = locationList[this.patientLocation][0];
		this.patientLocY = locationList[this.patientLocation][1];
	}
	
	this.drawPatient = function() {
		this.ctxPatient.clearRect(this.x, this.y, this.mapWidth, this.mapHeight);
		this.ctxPatient.beginPath();
		this.ctxPatient.fillStyle = "green";
		this.ctxPatient.rect(this.patientLocX-7, this.patientLocY-7, 14, 14);
		this.ctxPatient.fill();
		this.ctxPatient.stroke();
	}
	
	this.erasePatient = function() {
		console.log("erase");
		this.ctxPatient.clearRect(this.x, this.y, this.mapWidth, this.mapHeight);
	}
	
	this.drawPath = function() {
		this.ctxPath.clearRect(this.x, this.y, this.mapWidth, this.mapHeight);
		if(this.destination == "patient") {
			for(i = this.carLocation; i<locationList.length; i++) {
				if(i == this.patientLocation) {
					break;
				}
	        	this.ctxPath.beginPath();
	            this.ctxPath.lineWidth = 5;
	            this.ctxPath.strokeStyle = "blue";
	            this.ctxPath.moveTo(locationList[i][0], locationList[i][1]);
	            if(i != 14 && (locationList[i][0] == locationList[i+1][0]
	            		|| locationList[i][1] == locationList[i+1][1])) {
	            	this.ctxPath.lineTo(locationList[i+1][0], locationList[i+1][1]);
	            }else if(i == 14) {
	            	this.ctxPath.lineTo(500, 410);
	                this.ctxPath.quadraticCurveTo(530, 410, 540, 397);
	                i = -1;
	            }else {
	             	if(i==0) {
	             		this.ctxPath.quadraticCurveTo(553, 393, 550, 300);
	                }else if(i==3) {
	                	this.ctxPath.quadraticCurveTo(550, 55, 490, 55);
	                }else if(i==4) {
	                	this.ctxPath.lineTo(420, 55);
	                    this.ctxPath.lineTo(350, 44);
	                }else if(i==5) {
	                	this.ctxPath.lineTo(235, 22);
	                }else if(i==6) {
	                	this.ctxPath.lineTo(210, 18);
	                    this.ctxPath.lineTo(135, 20);
	                }else if(i==7) {
	                	this.ctxPath.quadraticCurveTo(100, 18, 100, 50);
	                    this.ctxPath.quadraticCurveTo(95, 85, 88, 89);
	                }else if(i==8) {
	                	this.ctxPath.quadraticCurveTo(85, 92, 65, 98);
	                    this.ctxPath.quadraticCurveTo(20, 98, 20, 140);
	                }else if(i==11) {
	                	this.ctxPath.quadraticCurveTo(20, 410, 80, 410);
	                    this.ctxPath.lineTo(120, 410);
	                }
	            }
	            this.ctxPath.stroke();
			}
		}else if(this.destination == "hospital") {
			for(i = this.carLocation; i<locationList.length; i++) {
				if(i == this.hospitalLocation) {
					break;
				}
	        	this.ctxPath.beginPath();
	            this.ctxPath.lineWidth = 5;
	            this.ctxPath.strokeStyle = "purple";
	            this.ctxPath.moveTo(locationList[i][0], locationList[i][1]);
	            if(i != 14 && (locationList[i][0] == locationList[i+1][0]
	            		|| locationList[i][1] == locationList[i+1][1])) {
	            	this.ctxPath.lineTo(locationList[i+1][0], locationList[i+1][1]);
	            }else if(i == 14) {
	            	this.ctxPath.lineTo(500, 410);
	                this.ctxPath.quadraticCurveTo(530, 410, 540, 397);
	                i = -1;
	            }else {
	             	if(i==0) {
	             		this.ctxPath.quadraticCurveTo(553, 393, 550, 300);
	                }else if(i==3) {
	                	this.ctxPath.quadraticCurveTo(550, 55, 490, 55);
	                }else if(i==4) {
	                	this.ctxPath.lineTo(420, 55);
	                    this.ctxPath.lineTo(350, 44);
	                }else if(i==5) {
	                	this.ctxPath.lineTo(235, 22);
	                }else if(i==6) {
	                	this.ctxPath.lineTo(210, 18);
	                    this.ctxPath.lineTo(135, 20);
	                }else if(i==7) {
	                	this.ctxPath.quadraticCurveTo(100, 18, 100, 50);
	                    this.ctxPath.quadraticCurveTo(95, 85, 88, 89);
	                }else if(i==8) {
	                	this.ctxPath.quadraticCurveTo(85, 92, 65, 98);
	                    this.ctxPath.quadraticCurveTo(20, 98, 20, 140);
	                }else if(i==11) {
	                	this.ctxPath.quadraticCurveTo(20, 410, 80, 410);
	                    this.ctxPath.lineTo(120, 410);
	                }
	            }
	            this.ctxPath.stroke();
			}
		}
	}
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