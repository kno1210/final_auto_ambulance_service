package com.mycompany.project.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.mycompany.project.model.Patient;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository
public class AmbulanceDao extends EgovAbstractMapper {
	private static final Logger LOGGER = LoggerFactory.getLogger(AmbulanceDao.class);

	public int selectCountByPcarAssign(String pcarAssign) {
		int carRow = selectOne("patient.selectCountByPcarAssign", pcarAssign);
		return carRow;
	}

	public void delete(int pno) {
		delete("patient.deleteByPno", pno);
	}

	public Patient selectByPcarAssign(String string) {
		Patient patient = selectOne("patient.selectByPcarAssign", string);
		return patient;
	}
}
