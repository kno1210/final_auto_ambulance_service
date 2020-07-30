package com.mycompany.project.model;

public class Patient {

	// 이 클래스가 접수가 들어온 환자의 정보를 담는 클래스일 경우
	int pno; // 환자 번호
	String preportTime; // 신고 시간 // sdf로 String으로 저장
	String preportTel; // 신고를 한 번호
	String plocation; // 환자 위치
	String pname; // 환자 이름 // 익명이라면 anonymous
	String psymptom; // 증상
	String psex; // 성별
	int page; // 나이
	String pbloodType; // 혈액형
	String pcarAssign; // 차 할당유무
	
	public String getPcarAssign() {
		return pcarAssign;
	}
	public void setPcarAssign(String pcarAssign) {
		this.pcarAssign = pcarAssign;
	}
	public int getPno() {
		return pno;
	}
	public void setPno(int pno) {
		this.pno = pno;
	}
	public String getPreportTime() {
		return preportTime;
	}
	public void setPreportTime(String preportTime) {
		this.preportTime = preportTime;
	}
	public String getPreportTel() {
		return preportTel;
	}
	public void setPreportTel(String preportTel) {
		this.preportTel = preportTel;
	}
	public String getPlocation() {
		return plocation;
	}
	public void setPlocation(String plocation) {
		this.plocation = plocation;
	}
	public String getPname() {
		return pname;
	}
	public void setPname(String pname) {
		this.pname = pname;
	}
	public String getPsymptom() {
		return psymptom;
	}
	public void setPsymptom(String psymptom) {
		this.psymptom = psymptom;
	}
	public String getPsex() {
		return psex;
	}
	public void setPsex(String psex) {
		this.psex = psex;
	}
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public String getPbloodType() {
		return pbloodType;
	}
	public void setPbloodType(String pbloodType) {
		this.pbloodType = pbloodType;
	}
}
