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
      <script type="text/javascript" src="${pageContext.request.contextPath}/resource/js/mqttclient.js"></script>
      <link rel="stylesheet" href="${pageContext.request.contextPath}/resource/css/ambulanceMain.css">
   </head>
   <body>
      	<section id="wrap">
      		<h1>응급차량 제어</h1>
      		<header>
      			<strong class="logo_box" ><img alt="응급차량 제어" src="${pageContext.request.contextPath}/resource/img/ambulanceMainLogo.png"></strong>
      		</header>
			<!--       			// 이 클래스가 접수가 들어온 환자의 정보를 담는 클래스일 경우
				int pno; // 환자 번호
				String preportTime; // 신고 시간 // sdf로 String으로 저장
				String preportTel; // 신고를 한 번호
				String plocation; // 환자 위치
				String pname; // 환자 이름 // 익명이라면 anonymous
				String psymptom; // 증상
				char psex; // 성별
				int page; // 나이
				String pbloodType; // 혈액형 -->
			<section id="container">
				<section id="menu1">
					<div id="content1">
						<p>patientNo : </p><br/>
						<p>patientReportTime : </p><br/>
						<p>patientReportTel : </p><br/>
						<p>patientLocation : </p><br/>
						<p>patientName : </p><br/>
						<p>patientSymptom : </p><br/>
						<p>patientSex : </p><br/>
						<p>patientAge : </p><br/>
						<p>patientBloodType : </p><br/>
					</div>
				</section>
				<section id="menu2">
					<div id="content2">
						<img id="cameraView" style="width: 100%; height: 85%;"/>
					</div>
				</section>
				<section id="menu3">
					<div id="content3">Track</div>
					<div id="batteryView">
						<div id="batteryStatus"></div>
						<!-- <div id="batteryAlert"></div> -->
						<span id="batteryAlert" style="color:red"></span>
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