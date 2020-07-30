$(function() {
	client = new Paho.MQTT.Client(location.hostname, 61614, new Date().getTime().toString());

	client.onMessageArrived = onMessageArrived;

	client.connect({onSuccess:onConnect});
});

function onConnect() {
  console.log("onConnect");
  client.subscribe("/camera");
  client.subscribe("/patientINFO");
}

function onMessageArrived(message) {
	console.log("message arrived");
	if(message.destinationName == "/camera") {
		var cameraView = $("#cameraView").attr("src", "data:image/jpg;base64," + message.payloadString);
		console.log("good!");
	}else if(message.destinationName == "/patientINFO") {
		var patientInformation = JSON.parse(message.payloadString);
		$.ajax({
			url:"patientInformation.do",
			type:"POST",
			data:patientInformation,
			success:function(data){
				window.alert("success");
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
		/*count가 6이면 119에 그만 보내라고 메시지를 보내야함, count가 6보다 작으면 보내도 된다고 메시지를 보내야함*/
	}
}
