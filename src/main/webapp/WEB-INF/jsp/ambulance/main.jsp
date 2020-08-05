<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title>응급차량 제어</title>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/bootstrap/css/bootstrap.min.css">
      <script src="${pageContext.request.contextPath}/resource/jquery/jquery.min.js"></script>
      <script src="${pageContext.request.contextPath}/resource/popper/popper.min.js"></script>
      <script src="${pageContext.request.contextPath}/resource/bootstrap/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
      <script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
      
      <script type="text/javascript" src="${pageContext.request.contextPath}/resource/js/mqttclientAmbulance.js"></script>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/css/ambulanceMain.css">
      
      <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css"/>
      <link href="${pageContext.request.contextPath}/resource/css/user.css" rel="stylesheet" type="text/css" media="all" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
		
      <script type="text/javascript">
      	/* 전역 변수로 선언해주기 */
      	var dispatchPossible;
      	
      	function convoyEnd() {
      		dispatchPossible = "possible";
      		var pno = Number($("#pno").text());
      		console.log(pno);
      		if(pno == 0) {
      			window.alert("호송중인 환자가 없습니다만?");
      		}else {
      			$.ajax({
          			url:"convoyEnd.do",
          			type:"POST",
          			data:{
          				pno:pno
          			},
          			success:function() {
          				$("#pno").text("");
          				$("#preportTime").text("");
          				$("#preportTel").text("");
          				$("#plocation").text("");
          				$("#pname").text("");
          				$("#psymptom").text("");
          				$("#psex").text("");
          				$("#page").text("");
          				$("#pbloodType").text("");
          				
          				dispatchPossible = "possible";
          				message = new Paho.MQTT.Message(dispatchPossible);
          				message.destinationName = "/dispatchPossible";
          				client.send(message);
          			},
          			error:function() {
          				window.alert("error : convoyEnd.do");
          			}
          		})
      		}
      		
      	}
      	
      	function sirenOn() {
      		//사이렌 온
      		
      		//아이콘 변경
      		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/img/siren_on.png");
      	}
      	
      	function sirenOff() {
      		//사이렌 오프
      		
      		//아이콘 변경
      		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/img/siren_off.png");
      	}
	</script>

	</head>
	<body>
		<div id="wrapper">
			<div id="header">
				<div id="logo">
					<h1>응급차량 제어</h1>
				</div>
			</div>
			
			<div id="top">
				<div class="floatView" id="speed">
						<h5>속도</h5>
					</div>
					
					<div class="floatView" id="camera">
						<img id="cameraView" style="border:1px solid black; width:100%; height:100%" alt=""/>
					</div>
					
					<div class="floatView" id="map">
						<img id="mapView" src="${pageContext.request.contextPath}/resource/img/map sample.png" style="border:1px solid black" width="100%" height="100%" alt="" />
					</div>
					
					<div class="floatView" id="battery">
						<h5 id="batteryStatus" style="color:white">배터리 연결중. . .</h5>
						<p><img id="batteryImage" src="${pageContext.request.contextPath}/resource/img/battery_100.png" style="width:75%; height:75%"/></p>
						<span id="batteryAlert" style="color:red"></span>
					</div>
				</div>
				
				<div id="bottom">
					<div class="floatView" id="info">
						<table>
							<tr>
								<td class="patientKey">환자 번호</td>
								<td id="pno" class="patientValue">${movingPatient.pno}</td>
							</tr>
							<tr>
								<td class="patientKey">신고 접수 시간</td>
								<td id="preportTime" class="patientValue">${movingPatient.preportTime}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 위치</td>
								<td id="plocation" class="patientValue">${movingPatient.plocation}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 이름</td>
								<td id="pname" class="patientValue">${movingPatient.pname}</td>
							</tr>
							<tr>
								<td class="patientKey">증상</td>
								<td id="psymptom" class="patientValue">${movingPatient.psymptom}</td>
							</tr>
							<tr>
								<td class="patientKey">혈액형</td>
								<td id="pbloodType" class="patientValue">${movingPatient.pbloodType}</td>
							</tr>
							<tr>
								<td class="patientKey">성별</td>
								<td id="psex" class="patientValue">${movingPatient.psex}</td>
							</tr>
							<tr>
								<td class="patientKey">나이</td>
								<td id="page" class="patientValue">${movingPatient.page}</td>
							</tr>
							<tr>
								<td class="patientKey">신고자 전화번호</td>
								<td id="preportTel" class="patientValue">${movingPatient.preportTel}</td>
							</tr>
						</table>
					</div>
					
					<div class="floatView" id="control">
						<div id="control-top" style="height:40%">
							<div class="floatView" style="width:48%; height:100%; margin-right:2%">
							</div>
							
							<div class="floatView" id="drivingStatus" style="width:48%; height:100%; margin-left:2%">
								<button class="btn btn-primary" id="auto" onclick="autoModeSwitch(this.id)">자동</button>
								<button class="btn btn-warning" id="manual" onclick="autoModeSwitch(this.id)">수동</button>
								<button class="btn btn-success" id="start" onclick="drivingStatusSwith(this.id)">이송 출발</button>
								<button class="btn btn-secondary" id="finish" onclick="drivingStatusSwith(this.id)">이송 완료</button>
							</div>
						</div>
						
						<div id="control-bottom" style="height:40%">
							<div class="floatView" id="carControl" style="width:48%; height:100%; margin-right:2%">
							</div>
							<div class="floatView" id="siren" style="width:48%; height:100%; margin-left:2%">
								<img class="floatView" id="sirenImage" src="${pageContext.request.contextPath}/resource/img/siren_off.png" style="width:120px; height:120px; margin-top:10px; margin-bottom:10px"/>
								<p><button class="btn btn-danger" onclick="sirenOn()">사이렌 on</button></p>
								<p><button class="btn btn-info" onclick="sirenOff()">사이렌 off</button></p>
							</div>
						</div>
					</div>
				</div>
				
<%-- 				<section id="menu1">
					<div id="content1">
						<table>
							<tr>
								<td class="patientKey">환자 번호</td>
								<td id="pno" class="patientValue">${movingPatient.pno}</td>
							</tr>
							<tr>
								<td class="patientKey">신고 접수 시간</td>
								<td id="preportTime" class="patientValue">${movingPatient.preportTime}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 위치</td>
								<td id="plocation" class="patientValue">${movingPatient.plocation}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 이름</td>
								<td id="pname" class="patientValue">${movingPatient.pname}</td>
							</tr>
							<tr>
								<td class="patientKey">증상</td>
								<td id="psymptom" class="patientValue">${movingPatient.psymptom}</td>
							</tr>
							<tr>
								<td class="patientKey">혈액형</td>
								<td id="pbloodType" class="patientValue">${movingPatient.pbloodType}</td>
							</tr>
							<tr>
								<td class="patientKey">성별</td>
								<td id="psex" class="patientValue">${movingPatient.psex}</td>
							</tr>
							<tr>
								<td class="patientKey">나이</td>
								<td id="page" class="patientValue">${movingPatient.page}</td>
							</tr>
							<tr>
								<td class="patientKey">신고자 전화번호</td>
								<td id="preportTel" class="patientValue">${movingPatient.preportTel}</td>
							</tr>
						</table>
					</div>
				</section> --%>
				<!-- <section id="menu2">
					<div id="content2">
						<img id="cameraView" style="width: 100%; height: 85%;"/>
					</div>
				</section>
				<section id="menu3">
					<div id="content3">Track</div>
					<div>
						<button onclick="convoyEnd()">호송 종료</button>
					</div>
				</section> -->
      		
      		<!-- <footer>
      			<p>KOSA-L3-Team1 Final Project(autonomous-car)</p>
      			<p>제작: 정채은 이호정 최영수 김상엽 권오현</p>
      		</footer> -->
      		<div id="footer">
				<p>KOSA-L3-Team1 Final Project(autonomous-car)</p>
		      	<p>제작: 정채은 이호정 최영수 김상엽 권오현</p>
			</div>
		</div>
	</body>
</html>