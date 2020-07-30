package com.mycompany.project.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.mycompany.project.model.Patient;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository
public class HomeDao extends EgovAbstractMapper {
	private static final Logger LOGGER = LoggerFactory.getLogger(HomeDao.class);
	
	public void insert(Patient patient) {
		insert("patient.insert", patient);	
	}

	public int selectCount() {
		LOGGER.info("HomeDao의 selectCount 메소드 실행");
		int totalRows = selectOne("patient.selectCount");
		return totalRows;
	}

}
