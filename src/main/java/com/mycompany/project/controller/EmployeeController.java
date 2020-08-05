package com.mycompany.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/employee")
public class EmployeeController {

	@RequestMapping("/registerForm.do")
	public String registerForm() 
	{
		return "employee/registerForm"; 
	}
	
	@RequestMapping("/register.do")
	public void register()
	{
		
	}
	
	@RequestMapping("/loginForm.do")
	public String loginForm()
	{
		return "employee/loginForm";
	}
	
	@RequestMapping("/login.do")
	public void login()
	{
		
	}
}
