<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title>오토병원 응급차량 관제센터</title>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/bootstrap/css/bootstrap.min.css">
      <script src="${pageContext.request.contextPath}/resource/jquery/jquery.min.js"></script>
      <script src="${pageContext.request.contextPath}/resource/popper/popper.min.js"></script>
      <script src="${pageContext.request.contextPath}/resource/bootstrap/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
      <script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
      
      <script type="text/javascript" src="${pageContext.request.contextPath}/resource/js/mqttclient.js"></script>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/css/controltowerMain.css">
      <script type="text/javascript">
      	function carStart() {
      		
      	}
      </script>
   </head>
   <body>
      	<section id="wrap">
      		<h1>오토병원 응급차량 관제센터</h1>
      		<header>
      			<strong class="logo_box" ><img alt="오토병원 응급차량 관제센터" src="${pageContext.request.contextPath}/resource/img/controltowerMainLogo.png"></strong>
      		</header>
      		
			<section id="container">
				<section id="menu1">
					<div id="content1">
						<table>
							<tr>
								<td>환자 번호</td>
								<td id="pno">${nowPatient.pno}</td>
							</tr>
							<tr>
								<td>신고 접수 시간</td>
								<td id="preportTime">${nowPatient.preportTime}</td>
							</tr>
							<tr>
								<td>환자 위치</td>
								<td id="plocation">${nowPatient.plocation}</td>
							</tr>
							<tr>
								<td>환자 이름</td>
								<td id="pname">${nowPatient.pname}</td>
							</tr>
							<tr>
								<td>증상</td>
								<td id="psymptom">${nowPatient.psymptom}</td>
							</tr>
							<tr>
								<td>혈액형</td>
								<td id="pbloodType">${nowPatient.pbloodType}</td>
							</tr>
							<tr>
								<td>성별</td>
								<td id="psex">${nowPatient.psex}</td>
							</tr>
							<tr>
								<td>나이</td>
								<td id="page">${nowPatient.page}</td>
							</tr>
							<tr>
								<td>신고자 전화번호</td>
								<td id="preportTel">${nowPatient.preportTel}</td>
							</tr>
						</table>
					</div>
   					<div id="content2">대기환자 수 : ${patientWating}</div>
				</section>
				<section id="menu2">
					<div id="content3">지도 Map</div>
					<div>
						<button onclick="carStart()">응급차 출발</button>
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