package com.mycompany.project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.project.dao.AmbulanceDao;
import com.mycompany.project.model.Patient;

@Service
public class AmbulanceService {
	private static final Logger LOGGER = LoggerFactory.getLogger(AmbulanceService.class);
	
	@Autowired
	private AmbulanceDao ambulanceDao;

	public int selectCountByPcarAssign(String pcarAssign) {
		int carRow = ambulanceDao.selectCountByPcarAssign(pcarAssign);
		return carRow;
	}

	public void drop(int pno) {
		ambulanceDao.delete(pno);
	}

	public Patient getPatientByPcarAssign(String string) {
		Patient patient = ambulanceDao.selectByPcarAssign(string);
		return patient;
	}
}
