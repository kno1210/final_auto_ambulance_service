package com.mycompany.project.model;

public class Patient {

	// 이 클래스가 접수가 들어온 환자의 정보를 담는 클래스일 경우
	int pno; // 환자 번호
	String preportTime; // 신고 시간 // sdf로 String으로 저장
	String preportTel; // 신고를 한 번호
	String plocation; // 환자 위치
	String pname; // 환자 이름 // 익명이라면 anonymous
	String psymptom; // 증상
	char psex; // 성별
	int page; // 나이
	String pbloodType; // 혈액형
}
