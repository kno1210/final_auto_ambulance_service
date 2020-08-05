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
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.css">
		<script src="${pageContext.request.contextPath}/resource/jquery-ui/jquery-ui.min.js"></script>
	</head>
	<body>
		<h5 class="alert alert-info">/employee/registerForm.jsp</h5>
		
		<form method="post" action="register.do">
			<table>
				<tr>
					<td>입사 날짜 : </td>
					<td><input type="text" id="edate" placeholder="20200102"/></td>
				</tr>
				<tr>
					<td>이  름 : </td>
					<td><input type="text" id="ename" placeholder="홍길동"/><br/></td>
				</tr>
				
				<tr>
					<td>나이 : </td>
					<td><input type="text" id="eage" placeholder="20"></td>
				</tr>
				
				<tr>
					<td>성별 : </td>
					<td><input type="text" id="esex" placeholder="m or f"/></td>
				</tr>
				
				<tr>
					<td>연락처 : </td>
					<td><input type="text" id="etel" placeholder="01012341234"/></td>
				</tr>
				
				<tr>
					<td>부서 : </td>
					<td><input type="text" id="eposition" placeholder="001-원무과"/></td>
				</tr>
				
				<!-- <tr>
					<td>face id :</td>
					<td><input type="text" id="efaceid" placeholder="f123"/></td>
				</tr> -->
			</table>
			<input type="submit" value="사원 등록"/>
		</form>
	</body>
</html>