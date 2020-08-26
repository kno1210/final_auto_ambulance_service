var statuses = [
	{
		battery:0,
		mode:0,
		direction:"stop",
		speed:0,
		angle:0,
		working:undefined
	},
	{
		battery:0,
		mode:0,
		direction:"stop",
		speed:0,
		angle:0,
		working:undefined
	}
];

var waitingCnt = 0;

$(function() {
//	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());
	client = new Paho.MQTT.Client("192.168.3.183", 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({
		onSuccess:onConnect,
		cleanSession:true
	});
});

//메시지 생성 후 리턴 함수
function createMessage(msg, topic) {
	message = new Paho.MQTT.Message(msg);
	message.destinationName = topic;
	return message;
}

//대기목록 수 가져와서 보내는 함수
function importWaitingCnt() {
	$.ajax({
		url:"requestWaitingCnt.do",
		type:"POST",
		success:function(data) {
//			console.log(typeof(data.waitingCnt));
//			sendWaitingCnt("3");
			waitingCnt = data.waitingCnt;
			sendWaitingCnt(waitingCnt.toString());
			
		},
		error:function() {
			alert("**requestWaitingCnt.do**\nError");
		}
	});
}

//대기목록 보내는 함수
function sendWaitingCnt(cnt) {
	console.log("대기목록:" + cnt);
//	message = new Paho.MQTT.Message(cnt);
//	message.destinationName = "119/waitingCnt";
	client.send(createMessage(cnt, "119/waitingCnt"));
}

//목적지 보내는 함수
function sendDestination(dest, carNo) {
	console.log("sendDestination");
//	message = new Paho.MQTT.Message(dest);
//	message.destinationName = "car/" + carNo + "/destination";
	client.send(createMessage(dest, "car/" + carNo + "/destination"));
}

//차 배정 함수
function assignCar() {
	for(i=0; i<statuses.length; i++) {
		if(statuses[i].working == false) {
			return "" + (i+1);
		}
	}
	return "nothing";
}

function importAssignPatientInfo(carNo) {
	$.ajax({
		url:"requestAssignPatientInfo.do",
		type:"POST",
		data:{carNo:carNo},
		success:function(data) {
			
		},
		error:function() {
			alert("** requestAssignPatientInfo.do **\nError");
		}
	});
}

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
	
	//**************************************************************************
	
	/*연결되자마자 대기목록 수 가져와서 119에 보내기*/
	setInterval(importWaitingCnt, 1000);
//	importWaitingCnt();
	
	/* 119 서버에서 환자정보 받아오기 */
	client.subscribe("controltower/#");
	
	/* 차 상태 받아오기 */
	client.subscribe("ambulance/1/status");
	client.subscribe("ambulance/2/status");
	
}

function onMessageArrived(message) {
	topic = message.destinationName;
//	console.log("message arrived");
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
		console.log("전송됨");
		var patientInfo = JSON.parse(message.payloadString);
		patientInfo.pcarAssign = "nothing";
		
		//대기목록이 없다면 바로 배정
		if(waitingCnt == 0) { 
			patientInfo.pcarAssign = assignCar();
			console.log("*차:" + patientInfo.pcarAssign);
			console.log("*목적지:" + patientInfo.plocation);
			
			//차에 목적지 전송
			if(patientInfo.pcarAssign != "nothing") {
//				client.send(
//					createMessage(patientInfo.plocation, "car/" + patientInfo.pcarAssign + "/destination")
//				);
				console.log(patientInfo.plocation + "car/" + patientInfo.pcarAssign + "/destination");
				console.log("차:" + statuses[patientInfo.pcarAssign-1].working);
				sendDestination(patientInfo.plocation, patientInfo.pcarAssign);
				
				/*$("#car" + 1 + " " + "#pno").html(patient.pno);
				$("#car" + 1 + " " + "#preportTime").html(patient.preportTime);
				$("#car" + 1 + " " + "#plocation").html(patient.plocation);
				$("#car" + 1 + " " + "#pname").html(patient.pname);
				$("#car" + 1 + " " + "#psymptom").html(patient.psymptom);
				$("#car" + 1 + " " + "#pbloodType").html(patient.pbloodType);
				$("#car" + 1 + " " + "#psex").html(patient.psex);
				$("#car" + 1 + " " + "#page").html(patient.page);
				$("#car" + 1 + " " + "#preportTel").html(patient.preportTel);*/
			}
			
			
		}
		//대기목록이 있다면 배정 X
		
		//서버에 환자 정보 보내기
		$.ajax({
			url:"savePatientInfo.do",
			type:"POST",
			data:patientInfo,
			success:function(data) {
				console.log(data.result);
			},
			error:function() {
				alert("** patientInfo.do **\nError");
			}
		});
	}
	//=====================================================================
	
	//차 상태 받아오는 토픽================================================
	//토픽을 저렇게 하는 게 아니라 포함하고 있는지 아닌지로 하는게 나을거 같아
	else if(topic == "ambulance/1/status" || topic == "ambulance/2/status") { 
		var carNo = topic[topic.indexOf("/")+1];
		var status = JSON.parse(message.payloadString);
		var viewId = "car" + carNo;
		statuses[carNo-1] = status;
		console.log("**차" + carNo + ":" + statuses[carNo-1].working);
		
		if(statuses[carNo-1].working == true) {
			document.getElementById("workingStatus" + String(carNo)).innerHTML = "[ 이송중 ]";
		}
		else if(statuses[carNo-1].working == false) {
			document.getElementById("workingStatus" + String(carNo)).innerHTML = "[ 대기중 ]";
			//배터리 상태 검사
			if(statuses[carNo-1].battery > 15) {
				//nothing 중에서 가장 위에 꺼내오기
				$.ajax({
					url:"requestTopPatient.do",
					type:"POST",
					data:{carNo:carNo, assignedCar:"nothing"},
					success:function(data) {
						var patient = data.patient;
						console.log(patient);
						if(patient == "null") { patient = undefined; } //nothing이 없다면
						else { //nothing이 있다면
							var dest = patient.plocation;
							console.log("**목적지:" + dest);
							setTimeout(sendDestination, 3000, dest, carNo);
//							sendDestination(dest, carNo);
							
							/*$("#car" + 1 + " " + "#pno").text(patient.pno);
							$("#car" + 1 + " " + "#preportTime").text(patient.preportTime);
							$("#car" + 1 + " " + "#plocation").text(patient.plocation);
							$("#car" + 1 + " " + "#pname").text(patient.pname);
							$("#car" + 1 + " " + "#psymptom").text(patient.psymptom);
							$("#car" + 1 + " " + "#pbloodType").text(patient.pbloodType);
							$("#car" + 1 + " " + "#psex").text(patient.psex);
							$("#car" + 1 + " " + "#page").text(patient.page);
							$("#car" + 1 + " " + "#preportTel").text(patient.preportTel);*/
							
//							setTimeout(sendDestination, 500, dest, carNo);
							patient.pcarAssign = carNo;
							$.ajax({
								url:"updateCarAssign.do",
								type:"POST",
								async:false,
								data:patient,
								success:function(data) {
									console.log(data.result);
								},
								error:function() {
									alert("** updateCarAssign.do **\nError");
								}
							});
						}
					},
					error:function() {
						alert("** requestTopPatient.do **\nError");
					}
				});
			}
		}
	}
	//=====================================================================
}
