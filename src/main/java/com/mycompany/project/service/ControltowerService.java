package com.mycompany.project.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.project.dao.ControltowerDao;
import com.mycompany.project.model.Patient;

@Service
public class ControltowerService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ControltowerService.class);
	
	@Autowired
	private ControltowerDao controltowerDao;
	
	public void savePatient(Patient patient) {
		LOGGER.info("실행");
		controltowerDao.insert(patient);
	}

	public int selectCountByPcarAssign(String pcarAssign) {
//		LOGGER.info("실행");
		int totalRows = controltowerDao.selectCountByPcarAssign(pcarAssign);
		return totalRows;
	}
	
	public Patient getTopPatientByPcarAssign(String pcarAssign)
	{
		Patient patient = controltowerDao.selectTopPatientByPcarAssign(pcarAssign);
		return patient;
	}

	public List<Patient> getPatientListByPcarAssign(String pcarAssign) {
		List<Patient> patientList = controltowerDao.selectListByPcarAssign(pcarAssign);
		return patientList;
	}

	public Patient getPatientByPno(int intNowPatientNo) {
		Patient patient = controltowerDao.selectByPno(intNowPatientNo);
		return patient;
	}

	public void updatePcarAssign(Patient patient) {
		controltowerDao.updatePcarAssign(patient);
	}

}
