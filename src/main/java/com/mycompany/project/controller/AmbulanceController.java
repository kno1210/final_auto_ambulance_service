package com.mycompany.project.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/ambulance")
public class AmbulanceController {
	private static final Logger LOGGER = LoggerFactory.getLogger(AmbulanceController.class);
	
	@RequestMapping("/main.do")
	public String main() {
		LOGGER.info("Ambulance main 메소드 실행");
		return "ambulance/main";
	}
}
