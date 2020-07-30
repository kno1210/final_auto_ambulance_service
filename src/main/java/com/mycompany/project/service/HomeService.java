package com.mycompany.project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.project.dao.HomeDao;
import com.mycompany.project.model.Patient;

@Service
public class HomeService {
	private static final Logger LOGGER = LoggerFactory.getLogger(HomeService.class);
	
	@Autowired
	private HomeDao homeDao;
	
	public void savePatient(Patient patient) {
		homeDao.insert(patient);
	}

	public int selectCount() {
		LOGGER.info("HomeService의 selectCount 메소드 실행");
		int totalRows = homeDao.selectCount();
		return totalRows;
	}

}
