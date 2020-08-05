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
	
	/*119에게 출동명령 가능여부를 알려주기  위한 토픽*/
	client.subscribe("/giveMeSendPossible");
	
	/*ambulance에게 출동명령을 보내도 되는지 확인하기 위한 토픽*/
	client.subscribe("/dispatchPossible");
	
	/*onConnect 되자마자 ambulance에게 출동명령을 보내도 되는지 허락맡기 위해 ambulance에게 질문하는 메시지*/ 
	message = new Paho.MQTT.Message("giveMeDispatchPossbile");
	message.destinationName = "/giveMeDispatchPossible";
	client.send(message);
	console.log("message send : /giveMeDispatchPossible");
}

function onMessageArrived(message) {
	console.log("message arrived");
	if(message.destinationName == "/patientINFO") {
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
	}else if(message.destinationName == "/giveMeSendPossible") {
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
	}else if(message.destinationName == "/dispatchPossible") {
		console.log("message arrived : /dispatchPossible");
		console.log(message.payloadString);
		dispatchPossible = message.payloadString;
		console.log("dispatchPossible : " + dispatchPossible);
	}
}