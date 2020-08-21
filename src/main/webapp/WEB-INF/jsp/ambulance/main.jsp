<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
	<meta name="description" content=""/>
	<meta name="author" content=""/>
	<title>Ambulance Control</title>
	<!-- loader-->
	<%-- <link href="${pageContext.request.contextPath}/resource/css/pace.min.css" rel="stylesheet"/>
	<script src="${pageContext.request.contextPath}/resource/js/pace.min.js"></script> --%>
	<!--favicon-->
	<link rel="icon" href="${pageContext.request.contextPath}/resource/images/logo.ico" type="image/x-icon">
	<!-- Bootstrap core CSS-->
	<link href="${pageContext.request.contextPath}/resource/css/bootstrap.min.css" rel="stylesheet"/>
	<!-- Icons CSS-->
	<link href="${pageContext.request.contextPath}/resource/css/icons.css" rel="stylesheet" type="text/css"/>
	<!-- Custom Style-->
	<link href="${pageContext.request.contextPath}/resource/css/style-ambulanceControl.css" rel="stylesheet"/>
	
	<script src="${pageContext.request.contextPath}/resource/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/popper/popper.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/bootstrap/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
	<script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
	
	<!-- 뷰에서 컨트롤러로 넘어가면서 url로 carNo을 넘기고 model.addAttribute("carNo", carNo); -->
	<!-- 여기서 var carNo을 선언하고 밑의 .js에서 그대로 가져가서 사용한다. -->
	<!-- script 순서 유의하자 -->
	<!-- 선언 후에 script를 불러오는 게 순서야 -->
	<script type="text/javascript">
		var carNo = ${carNo};
		//console.log("카:" + carNo);
	</script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/resource/js/mqttclientAmbulance.js"></script>
	
	<script>
		/* function sirenOn() {
	  		//사이렌 온
	  		
	  		//아이콘 변경
	  		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/images/siren_on.png");
	  		
	  	}
	  	
	  	function sirenOff() {
	  		//사이렌 오프
	  		
	  		//아이콘 변경
	  		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/images/siren_off.png");
	  	} */
	</script>
</head>
<body class="bg-theme bg-theme1"> <!-- 1 or 9 -->
 
 <!-- Start wrapper-->
 <div id="wrapper">

  <!--Start topbar header-->
  <header class="topbar-nav">
   <nav class="navbar navbar-expand fixed-top">
    <ul class="navbar-nav mr-auto align-items-center">
     <li class="nav-item">
      <a href="${pageContext.request.contextPath}/home/main.do">
       <img src="${pageContext.request.contextPath}/resource/images/logo.png" class="logo-icon" alt="logo icon">
       MAIN
      </a>
     </li>
    </ul>
     
    <ul class="navbar-nav align-items-center right-nav-link">
     <li class="nav-item">
      <a href="">응급차량 제어</a>
     </li>
    </ul>
   </nav>
  </header>
  <!--End topbar header-->

  <!--Start Content-->
  <div class="row content-wrapper">
   <!-- <div class="container-fluid"> -->
   
   <div class="col-12 col-lg-8">
    	<div class="card" id="camera">
		 <div class="card-header">카메라 뷰</div>
		 <div class="card-body">
		   <canvas id="cameraView"></canvas>
		   <canvas id="controllerView"></canvas>
		   <%-- <canvas id="sirenView"></canvas> --%>
			<!-- <img style="width:100%; height:100%;" id="cameraView"> -->
		 </div>
		</div>
   </div>
   
   <div class="col-12 col-lg-4">
	<div class="card" id="controller">
	<div class="card-header">제어</div>
     <!-- <div class="card-content"> -->
      <div class="row row-group m-0">
       <div class="col-12 col-xl-6 border-light">
		<div class="card-body">
		 <div id="speed">
		  <h5><b>속도</b></h5>
		  <button class="btn btn-danger btn-sm" onclick="sirenOn()">사이렌 on</button>
		  <button class="btn btn-info btn-sm" onclick="sirenOff()">사이렌 off</button>
		 </div>
		</div>
	   </div>
	   
	   <div class="col-12 col-xl-6 border-light">
	    <div class="card-body">
	  	 <div id="driving">
		  <h5><b>주행 상태</b></h5>
		  <h5><b id="drivingStatus">DISCONNECT...</b></h5>
		 </div>
	    </div>
	   </div>
	   
	   <%-- <div class="col-12 col-xl-3 border-light">
		<div class="card-body">
		 <div id="battery">
		  <!-- <h5 id="batteryStatus"><b>배터리</b></h5> -->
		  <h5><b>배터리</b></h5>
		  <p>
		   <img style="width:20%; margin-top:2%" id="batteryImage" src="${pageContext.request.contextPath}/resource/images/battery_100(1).png">
		   <strong><span id="batteryStatus" style="margin-left:5%">DISCONNECT...</span></strong>
		  </p>
		 </div>
		</div>
	   </div> --%>
	   
	   <%-- <div class="col-12 col-xl-3 border-light">
		<div class="card-body">
		 <div id="siren">
		  <!-- <h5 id="drivingStatus"><b>사이렌</b></h5> -->
		  <h5><b>사이렌</b></h5>
		  <img style="width:20%;" class="floatView" id="sirenImage" src="${pageContext.request.contextPath}/resource/images/siren_off.png"/>
		  <button class="btn btn-danger btn-sm" onclick="sirenOn()">사이렌 on</button>
		  <button class="btn btn-info btn-sm" onclick="sirenOff()">사이렌 off</button>
		 </div>
		</div>
	   </div> --%>
	  </div>
	 <!-- </div> -->
	</div>  
	  
     
		<div class="card" id="map">
		 <div class="card-header">맵 뷰</div>
		 <div class="card-body">
			<img id="mapView" src="${pageContext.request.contextPath}/resource/images/map sample.png">
		 </div>
		</div>

	
	   <div class="card mb-0" id="patientInfo">
	     <div class="card-header">환자 정보</div>
	     <div class="card-body p-0">
			<table class="table align-items-center table-flush table-bordered">
				<tbody>
					<tr>
						<td class="patientKey">환자 번호</td>
						<td id="pno" class="patientValue">${patient.pno}</td>
					</tr>
					<tr>
						<td class="patientKey">환자 위치</td>
						<td id="plocation" class="patientValue">${patient.plocation}</td>
					</tr>
					<tr>
						<td class="patientKey">신고자 전화번호</td>
						<td id="preportTel" class="patientValue">${patient.preportTel}</td>
					</tr>
				</tbody>
			</table>
			</div>
	   </div><!--End Row-->

      <!--End Dashboard Content-->
		
    <!-- </div>End container-fluid -->
    </div>
    
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
 
 <script>
 	var cameraLayer = document.getElementById("cameraView");
 	cameraLayer.width = 1200;
 	cameraLayer.height = 900;
 	var cameraCtx = cameraLayer.getContext("2d");
 	
 	var controllerLayer = document.getElementById("controllerView");
 	controllerLayer.width = 1200;
 	controllerLayer.height = 900;
 	var controllerCtx = controllerLayer.getContext("2d");
 	
 	/* var sirenLayer = document.getElementById("sirenView");
 	sirenLayer.width = 100;
 	sirenLayer.height = 100;
 	var sirenCtx = sirenLayer.getContext("2d"); */
 	
 	
 	var cam = new Image();
 	var bat = new Image();
 	var sir = new Image();
 	cam.src = "";
 	bat.src = "";
 	sir.src = "${pageContext.request.contextPath}/resource/images/siren_off.png";
 	cam.onload = function() {
	 	//console.log("bat:" + batteryData);
 		cameraCtx.drawImage(cam, 0, 0, 1200, 900);

		controllerCtx.clearRect(0, 0, controllerLayer.width, controllerLayer.height);
		
		//사이렌
		controllerCtx.drawImage(sir, 1050, 20, 120, 120); //사이렌 아이콘
		
		//텍스트 설정
		controllerCtx.font = "bold 30px arial";
		controllerCtx.fillStyle = "black";
		
		//속도
		controllerCtx.fillText(stat.speed.toFixed(2)*100, 1020, 200);
		controllerCtx.fillText("km/h", 1080, 200);

		//배터리
		controllerCtx.fillText(stat.battery, 1010, 280); //배터리 잔량
		controllerCtx.fillText("%", 1060, 280); //퍼센트
		controllerCtx.drawImage(bat, 1100, 230, 80, 60); //배터리 아이콘
 		
 		/* sir.onload = function() {
 			sirenCtx.clearRect(0, 0, sirenLayer.width, sirenLayer.height);
 			sirenCtx.drawImage(sir, 100, 100, 70, 70);
 		} */
 	};
 	
 	function sirenOn() {
  		//사이렌 온
  		
  		//아이콘 변경
  		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/images/siren_on.png");
  		sir.src = "${pageContext.request.contextPath}/resource/images/siren_on.png";
  	}
  	
  	function sirenOff() {
  		//사이렌 오프
  		
  		//아이콘 변경
  		$("#sirenImage").attr("src", "${pageContext.request.contextPath}/resource/images/siren_off.png");
  		sir.src = "${pageContext.request.contextPath}/resource/images/siren_off.png";
  	}
 	
 </script>
  
</body>
</html>