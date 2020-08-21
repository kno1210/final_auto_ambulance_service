<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html>
   <head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
	<meta name="description" content=""/>
	<meta name="author" content=""/>
      <title>Control Tower</title>
      
      <!--favicon-->
	<link rel="icon" href="${pageContext.request.contextPath}/resource/images/logo.ico" type="image/x-icon">
	<!-- Bootstrap core CSS-->
	<link href="${pageContext.request.contextPath}/resource/css/bootstrap.min.css" rel="stylesheet"/>
	<!-- Icons CSS-->
	<link href="${pageContext.request.contextPath}/resource/css/icons.css" rel="stylesheet" type="text/css"/>
	<!-- Custom Style-->
	<link href="${pageContext.request.contextPath}/resource/css/style-controlTower.css" rel="stylesheet"/>
    
    <script src="${pageContext.request.contextPath}/resource/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/popper/popper.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/bootstrap/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
	<script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
	
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/resource/js/mqttclientControltower.js"></script>
      <script type="text/javascript">
      	var dispatchPossible;
    	var nowPatientNo;
    	var prePatientNo;
    	var isNowPatient = ${isNowPatient};
    	if(isNowPatient) {
    		nowPatientNo = Number("${nowPatient.pno}");
    	}else {
    		nowPatientNo = 0;
    		prePatientNo = 0;
    	}
    	
      	function carStart() {
      		console.log("nowPatientNo : " + nowPatientNo);
      		console.log("prePatientNo : " + prePatientNo);
      		console.log("dispatchPossible : " + dispatchPossible);
      		if(prePatientNo != nowPatientNo && dispatchPossible == "possible") {
      			$.ajax({
          			url:"carStart.do",
          			type:"POST",
          			data:{
          				nowPatientNo:nowPatientNo
          			},
          			success:function(data){
          				window.alert("carStart");
          				var totalRows = data.totalRows;
          				if(totalRows == 0) {
          					$("#pno").text("");
              				$("#preportTime").text("");
              				$("#plocation").text("");
              				$("#pname").text("");
              				$("#psymptom").text("");
              				$("#pbloodType").text("");
              				$("#psex").text("");
              				$("#page").text("");
              				$("#preportTel").text("");
          				}else {
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
          				}
          				
          				if(totalRows > 0) {
          					var patientWating = String(totalRows-1);
          					$("#content2").text("대기환자 수 : " + patientWating);
          				}
          				message = new Paho.MQTT.Message("carAssign");
          				message.destinationName = "/carAssign";
          				client.send(message);
          				
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
          				window.alert("fail carStart");
          			}
          		})
          		prePatientNo = nowPatientNo;
      		}else if(prePatientNo == nowPatientNo) {
      			window.alert("호송할 환자가 없습니다.");
      		}else if(dispatchPossible == "impossible") {
      			window.alert("이미 호송이 진행 중입니다.");
      		}
      		
      	}
      </script>
   </head>
   <%-- <body>
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
								<td class="patientKey">환자 번호</td>
								<td id="pno" class="patientValue">${nowPatient.pno}</td>
							</tr>
							<tr>
								<td class="patientKey">신고 접수 시간</td>
								<td id="preportTime" class="patientValue">${nowPatient.preportTime}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 위치</td>
								<td id="plocation" class="patientValue">${nowPatient.plocation}</td>
							</tr>
							<tr>
								<td class="patientKey">환자 이름</td>
								<td id="pname" class="patientValue">${nowPatient.pname}</td>
							</tr>
							<tr>
								<td class="patientKey">증상</td>
								<td id="psymptom" class="patientValue">${nowPatient.psymptom}</td>
							</tr>
							<tr>
								<td class="patientKey">혈액형</td>
								<td id="pbloodType" class="patientValue">${nowPatient.pbloodType}</td>
							</tr>
							<tr>
								<td class="patientKey">성별</td>
								<td id="psex" class="patientValue">${nowPatient.psex}</td>
							</tr>
							<tr>
								<td class="patientKey">나이</td>
								<td id="page" class="patientValue">${nowPatient.page}</td>
							</tr>
							<tr>
								<td class="patientKey">신고자 전화번호</td>
								<td id="preportTel" class="patientValue">${nowPatient.preportTel}</td>
							</tr>
						</table>
					</div>
   					<div id="content2">대기환자 수 : ${patientWating}</div>
				</section>
				<section id="menu2">
					<div id="content3"></div>
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
      	
      	
   </body> --%>
   
<body class="bg-theme bg-theme9"> <!-- 1 ~ 9 -->
 
<!-- Start wrapper-->
<div id="wrapper">

<!--Start sidebar-wrapper-->
   <div id="sidebar-wrapper">
     <div class="brand-logo">
      <a href="${pageContext.request.contextPath}/home/main.do">
      	<img src="${pageContext.request.contextPath}/resource/images/logo.png" class="logo-icon" alt="logo icon">
      	MAIN
     </a>
   </div>
   <table class="table align-items-center table-flush table-bordered">
                 <tbody>
                  	 <tr>
							<td class="patientKey">환자 번호</td>
							<td id="pno" class="patientValue">${nowPatient.pno}</td>
						</tr>
						<tr>
							<td class="patientKey">신고 접수 시간</td>
							<td id="preportTime" class="patientValue">${nowPatient.preportTime}</td>
						</tr>
						<tr>
							<td class="patientKey">환자 위치</td>
							<td id="plocation" class="patientValue">${nowPatient.plocation}</td>
						</tr>
						<tr>
							<td class="patientKey">환자 이름</td>
							<td id="pname" class="patientValue">${nowPatient.pname}</td>
						</tr>
						<tr>
							<td class="patientKey">증상</td>
							<td id="psymptom" class="patientValue">${nowPatient.psymptom}</td>
						</tr>
						<tr>
							<td class="patientKey">혈액형</td>
							<td id="pbloodType" class="patientValue">${nowPatient.pbloodType}</td>
						</tr>
						<tr>
							<td class="patientKey">성별</td>
							<td id="psex" class="patientValue">${nowPatient.psex}</td>
						</tr>
						<tr>
							<td class="patientKey">나이</td>
							<td id="page" class="patientValue">${nowPatient.page}</td>
						</tr>
						<tr>
							<td class="patientKey">신고자 전화번호</td>
							<td id="preportTel" class="patientValue">${nowPatient.preportTel}</td>
						</tr>
					</tbody>
                 </table>
                 <div id="content2">대기환자 수 : ${patientWating}</div>
   
   </div>
   <!--End sidebar-wrapper-->

<!--Start topbar header-->
<header class="topbar-nav">
 <nav class="navbar navbar-expand fixed-top">
  <ul class="navbar-nav mr-auto align-items-center">
    <li class="nav-item">
      
    </li>
  </ul>
     
  <ul class="navbar-nav align-items-center right-nav-link">
    <li class="nav-item">
    	<a href="">컨트롤 타워</a>
    </li>
  </ul>
</nav>
</header>
<!--End topbar header-->

  <div class="content-wrapper">
    <!-- <div class="container-fluid"> -->

  <!--Start Dashboard Content-->
	  
	<div class="row">
     <div class="col-12 col-lg-6 col-xl-6">
	    <div class="card">
		 <div class="card-header">차1 카메라 뷰</div>
		 <div class="card-body" id="camera">
			<!-- <img style="width:100%; height:100%;" id="cameraView1"> -->
			<div>
				<h4 id="workingStatus1">연결중</h4>
			</div>
			<div>
				<table class="table align-items-center table-flush table-bordered">
					<tbody>
                  	 <tr>
							<td class="patientKey">환자 번호</td>
							<td id="pno" class="patientValue">${nowPatient.pno}</td>
						</tr>
						<tr>
							<td class="patientKey">신고 접수 시간</td>
							<td id="preportTime" class="patientValue">${nowPatient.preportTime}</td>
						</tr>
						<tr>
							<td class="patientKey">환자 위치</td>
							<td id="plocation" class="patientValue">${nowPatient.plocation}</td>
						</tr>
						<tr>
							<td class="patientKey">환자 이름</td>
							<td id="pname" class="patientValue">${nowPatient.pname}</td>
						</tr>
						<tr>
							<td class="patientKey">증상</td>
							<td id="psymptom" class="patientValue">${nowPatient.psymptom}</td>
						</tr>
						<tr>
							<td class="patientKey">혈액형</td>
							<td id="pbloodType" class="patientValue">${nowPatient.pbloodType}</td>
						</tr>
						<tr>
							<td class="patientKey">성별</td>
							<td id="psex" class="patientValue">${nowPatient.psex}</td>
						</tr>
						<tr>
							<td class="patientKey">나이</td>
							<td id="page" class="patientValue">${nowPatient.page}</td>
						</tr>
						<tr>
							<td class="patientKey">신고자 전화번호</td>
							<td id="preportTel" class="patientValue">${nowPatient.preportTel}</td>
						</tr>
					</tbody>
                 </table>
				</table>
			</div>
		 </div>
		</div>
	</div>
		
	<div class="col-12 col-lg-6 col-xl-6">
		<div class="card">
		 <div class="card-header">차1 맵 뷰</div>
		 <div class="card-body" id="map">
			<img style="width:100%; height:100%;" id="mapView1" src="${pageContext.request.contextPath}/resource/images/map sample.png">
		 </div>
		</div>
	</div>

	</div><!--End Row-->
	
	<div class="row">
     <div class="col-12 col-lg-6 col-xl-6">
	    <div class="card">
		 <div class="card-header">차2 카메라 뷰</div>
		 <div class="card-body" id="camera">
			<!-- <img style="width:100%; height:100%;" id="cameraView2"> -->
			<div>
				<h4 id="workingStatus1">연결중</h4>
			</div>
			<div>
				<table class="table align-items-center table-flush table-bordered">
					<tr>
						<td class="patientKey">환자 번호</td>
						<td class="patientValue">ㅎㅇㅎㅇㅎㅇ</td>
					</tr>
					<tr>
						<td class="patientKey">11</td>
						<td class="patientValue">111</td>
					</tr>
					<tr>
						<td class="patientKey">qq</td>
						<td class="patientValue">ㅂㅂㅂㅂ</td>
					</tr>
				</table>
			</div>
		 </div>
		</div>
	</div>
		
	<div class="col-12 col-lg-6 col-xl-6">
		<div class="card">
		 <div class="card-header">차2 맵 뷰</div>
		 <div class="card-body" id="map">
			<img style="width:100%; height:100%;" id="mapView2" src="${pageContext.request.contextPath}/resource/images/map sample.png">
		 </div>
		</div>
	</div>

	</div><!--End Row-->
	
      <!--End Dashboard Content-->
		
    <!-- </div>End container-fluid -->
    </div><!--End content-wrapper-->
	
	<!--Start footer-->
	<!-- <footer class="footer">
      <div class="container">
        <div class="text-center">
          <p>KOSA-L3-Team1 Final Project(autonomous-car)</p>
		  <p>제작: 정채은 이호정 최영수 김상엽 권오현</p>
        </div>
      </div>
    </footer> -->
	<!--End footer-->
  </div><!--End wrapper-->

  <!-- Bootstrap core JavaScript-->
  <script src="${pageContext.request.contextPath}/resource/js/jquery.min.js"></script>
  <script src="${pageContext.request.contextPath}/resource/js/popper.min.js"></script>
  <script src="${pageContext.request.contextPath}/resource/js/bootstrap.min.js"></script>
	
  <!-- Custom scripts -->
  <script src="${pageContext.request.contextPath}/resource/js/app-script.js"></script>
  </body>
</html>