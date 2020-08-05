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
      </script>

   </head>
   <body>
      	<section id="wrap">
      		<h1>응급차량 제어</h1>
      		<header>
      			<strong class="logo_box" ><img alt="응급차량 제어" src="${pageContext.request.contextPath}/resource/img/ambulanceMainLogo.png"></strong>
      		</header>
			<section id="container">
				<section id="menu1">
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
				</section>
				<section id="menu2">
					<div id="content2">
						<img id="cameraView" style="width: 100%; height: 85%;"/>
					</div>
				</section>
				<section id="menu3">
					<div id="content3">Track</div>
					<div>
						<button onclick="convoyEnd()">호송 종료</button>
					</div>
				</section>
			</section>
      		
      		<footer>
      			<p>KOSA-L3-Team1 Final Project(autonomous-car)</p>
      			<p>제작: 정채은 이호정 최영수 김상엽 권오현</p>
      		</footer>
      	</section>
   </body>
</html>