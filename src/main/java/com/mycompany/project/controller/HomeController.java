package com.mycompany.project.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class HomeController {
	private static final Logger LOGGER = LoggerFactory.getLogger(HomeController.class);
	
	@RequestMapping("/main.do")
	public String main() {
		LOGGER.info("HomeController의  main 메소드 실행");
		return "home/main";
	}
	
	@RequestMapping("/canvas.do")
	public String canvas()
	{
		return "home/canvas";
	}
	
	@RequestMapping("/test.do")
	public String test()
	{
		return "home/test";
	}
	
	@RequestMapping("/login_test.do")
	public String login_test()
	{
		return "home/login_test";
	}
	
}
