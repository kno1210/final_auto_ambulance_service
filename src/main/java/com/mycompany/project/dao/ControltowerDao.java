package com.mycompany.project.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.mycompany.project.model.Patient;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository
public class ControltowerDao extends EgovAbstractMapper {
	private static final Logger LOGGER = LoggerFactory.getLogger(ControltowerDao.class);
	
	public void insert(Patient patient) {
		insert("patient.insert", patient);	
	}

	public int selectCountByPcarAssign(String pcarAssign) {
		int totalRows = selectOne("patient.selectCountByPcarAssign", pcarAssign);
		return totalRows;
	}

	public List<Patient> selectListByPcarAssign(String pcarAssign) {
		List<Patient> patientList = selectList("patient.selectListByPcarAssign", pcarAssign);
		return patientList;
	}

	public Patient selectByPno(int intNowPatientNo) {
		Patient patient = selectOne("patient.selectByPno", intNowPatientNo);
		return patient;
	}

	public void updatePcarAssign(Patient patient) {
		update("patient.updatePcarAssign", patient);
	}

	
}
