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
}