var carStatuses = [];

function createMessage(msg, topic) {
	
	message = new Paho.MQTT.Message(msg);
	message.destinationName = topic;
	return message;
}

$(function() {
	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());
//	client = new Paho.MQTT.Client("192.168.3.183", 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});
});

function onConnect() {
	console.log("onConnect");
	/*119로 부터 환자 정보를 받는 토픽*/
	client.subscribe("/patientINFO");
	
	/* 119에게 출동명령 가능여부를 알려주기 위한 토픽 */
	client.subscribe("/giveMeSendPossible");
	
	/*ambulance에게 출동명령을 보내도 되는지 확인하기 위한 토픽*/
	client.subscribe("/dispatchPossible");
	
	/*onConnect 되자마자 ambulance에게 출동명령을 보내도 되는지 허락맡기 위해 ambulance에게 질문하는 메시지*/ 
	message = new Paho.MQTT.Message("giveMeDispatchPossbile");
	message.destinationName = "/giveMeDispatchPossible";
	client.send(message);
	console.log("message send : /giveMeDispatchPossible");
	
	/**/
	/* 119 서버에서 환자정보 받아오기 */
	client.subscribe("controltower/#");
	
	client.subscribe("ambulance/1/camera/frameLine");
	client.subscribe("ambulance/2/camera/frameLine");
	
	/* 모든 car의 상태 받아오기(리스트로) */
	requestCarStatuses();
}

function onMessageArrived(message) {
	topic = message.destinationName;
	console.log("message arrived");
	if(topic == "/patientINFO") {
		var patientInformation = JSON.parse(message.payloadString);
		$.ajax({
			url:"patientInformation.do",
			type:"POST",
			data:patientInformation,
			success:function(data){
				window.alert("success");
				//가장 상위에 있는 환자 데이터 가져오기 =====================================================================
				var nowPatient = JSON.parse(data.nowPatient);
				nowPatientNo = nowPatient.pno;
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
	}else if(topic == "/giveMeSendPossible") {
	  console.log("message arrived : /giveMeSendPossible");
	  $.ajax({
		  url:"sendPossible.do",
		  type:"POST",
		  success:function(data){
			  var data = JSON.parse(data);
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
			  console.log("ajax error (sendPossible.do)");
		  }
	  })
	}else if(topic == "/dispatchPossible") {
		console.log("message arrived : /dispatchPossible");
		console.log(message.payloadString);
		dispatchPossible = message.payloadString;
		console.log("dispatchPossible : " + dispatchPossible);
	}
	
	//119에서 환자정보 받는 토픽==========================================
	else if(topic == "controltower/patientInfo") {
		var patientInfo = JSON.parse(message.payloadString);
		
		//차 배정
		//일단 차랑 연결이 돼서 차 상태를 받아와야 가능한거지
		//그러니까 if문 써서 체크해야돼
		//근데 연결이 안돼서 차 상태를 못받아왔다면?
		patientInfo.pcarAssign = assignCar();
		console.log("topic:" + topic);
		console.log(patientInfo);
		console.log(patientInfo.pcarAssign);
		
		/*$.ajax({
			url:"patientInfo.do",
			type:"POST",
			data:patientInfo,
			success:function(data) {
				console.log(data.result);
			}
		});*/
	}
	//=====================================================================
	
	//차 상태 받아오는 토픽================================================
	//내 예상으로는 ["drive", "wait"] 이런식으로 들어와야돼
	//=====================================================================
	
	//카메라 영상 출력=====================================================
	else if(message.destinationName == "ambulance/1/camera/frameLine") {
		var cameraView1 = $("#cameraView1").attr("src", "data:image/jpg;base64," + message.payloadString);
//		cam.src = "data:image/jpg;base64," + message.payloadString;
		
	}
	else if(message.destinationName == "ambulance/2/camera/frameLine") {
		var cameraView2 = $("#cameraView2").attr("src", "data:image/jpg;base64," + message.payloadString);
//		cam.src = "data:image/jpg;base64," + message.payloadString;
	}
	//=====================================================================
}

//차 상태 달라고 요청하는 함수=========================================
//=====================================================================

function assignCar() {
	var waitingCarNo = 0;
	if(carStatuses.length == 0) { //차 상태를 못받아왔다는 얘기
		return "disconnect";
	}
	for(i=0; i<carStatuses.length; i++) {
		if(carStatuses[i] == "wait") {
			waitingCarNo = i + 1;
			break;
		}
	}
	if(waitingCarNo != 0) {
		return "car" + waitingCarNo;
	}
	else {
		return "nothing";
	}
}
	
