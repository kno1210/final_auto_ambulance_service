<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Insert title here</title>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resource/bootstrap/css/bootstrap.min.css">
	<script src="${pageContext.request.contextPath}/resource/jquery/jquery.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/popper/popper.min.js"></script>
	<script src="${pageContext.request.contextPath}/resource/bootstrap/js/bootstrap.min.js"></script>
	<link rel="stylesheet"href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
	<script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
</head>
<body>
	<h5 class="alert alert-info">/main.jsp</h5>
	
	<ul>
		<li><a href="${pageContext.request.contextPath}/controltower/main.do">컨트롤 타워</a></li>
		<li><a href="${pageContext.request.contextPath}/ambulance/main.do?carNo=1">차량1 제어</a></li>
		<li><a href="${pageContext.request.contextPath}/ambulance/main.do?carNo=2" >차량2 제어</a></li>
		
		<!-- 실제로는 관리자만 접근가능하게 -->
		<li><a href="${pageContext.request.contextPath}/employee/registerForm.do">사원 등록</a></li>
		
		<!-- 실제로는 로그인을 해야 차량제어나 컨트롤 타워로 넘어갈 수 있음 -->
		<li><a href="${pageContext.request.contextPath}/home/login_test.do">로그인</a></li>
		<li><a href="${pageContext.request.contextPath}/home/test.do">테스트</a></li>
		
		<li><a href="${pageContext.request.contextPath}/home/canvas.do">캔버스 연습</a></li>
	</ul>
</body>
</html>