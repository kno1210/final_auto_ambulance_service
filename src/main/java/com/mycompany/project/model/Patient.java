package com.mycompany.project.model;

public class Patient {
	
	// 이 클래스가 등록한 회원의 정보를 담는 클래스일 경우
	//String pno; // 서비스 가입한 회원(환자)의 식별번호
	//String pname; // 회원 이름
	//String pphone; // 회원 휴대폰 번호
	//String paddr; // 회원 집주소
	//int page; // 회원 나이
	//char psex; // 회원 성별
	
	// 이 클래스가 접수가 들어온 환자의 정보를 담는 클래스일 경우
	String receptionTime; // 접수 시간 // sdf로 String으로 저장
	String location; // 환자 위치
	String symptom; // 증상
	char sex; // 성별
	int age; // 나이
	String bloodType; // 혈액형
	
}
