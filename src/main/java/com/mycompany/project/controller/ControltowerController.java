package com.mycompany.project.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mycompany.project.model.Patient;
import com.mycompany.project.service.ControltowerService;

@Controller
@RequestMapping("/controltower")
public class ControltowerController {
	private static final Logger LOGGER = LoggerFactory.getLogger(ControltowerController.class);
	
	@Autowired
	private ControltowerService controltowerService;
	
	@GetMapping("/main.do")
	public String main(Model model) {
		LOGGER.info("컨트롤타워 메인페이지");
		List<Patient> patientList = controltowerService.getPatientListByPcarAssign("nothing");
		if(patientList.size() > 0) {
			model.addAttribute("nowPatient", patientList.get(0));
			int patientWaiting = patientList.size() - 1;
			model.addAttribute("patientWating", patientWaiting);
		}
		return "controltower/main";
	}
	
	@PostMapping("/sendPossible.do")
	public void sendPossible(HttpServletResponse response) throws IOException {
		int totalRows = controltowerService.selectCountByPcarAssign("nothing");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("totalRows", totalRows);
		PrintWriter pw = response.getWriter();
		pw.write(jsonObject.toString());
		pw.flush();
		pw.close();
	}
	
	@RequestMapping("/patientInformation.do")
	public void patientInformation(HttpServletRequest request, HttpServletResponse response,
									@RequestParam Map<String, String> patientInformation) throws IOException {
		Patient patient = new Patient();
		patient.setPreportTime(patientInformation.get("patientReportTime"));
		patient.setPreportTel(patientInformation.get("patientReportTel"));
		patient.setPlocation(patientInformation.get("patientLocation"));
		patient.setPname(patientInformation.get("patientName"));
		patient.setPsymptom(patientInformation.get("patientSymptom"));
		patient.setPsex(patientInformation.get("patientSex"));
		patient.setPage(patientInformation.get("patientAge"));
		patient.setPbloodType(patientInformation.get("patientBloodType"));
		patient.setPcarAssign("nothing");
		controltowerService.savePatient(patient);
		
//		count가 6이면 119에 그만보내라고 메시지를 보내야함, count가 6보다 작으면 더 보내도 된다고 메시지를 보내야함
		int totalRows = controltowerService.selectCountByPcarAssign("nothing");
		
		List<Patient> patientList = controltowerService.getPatientListByPcarAssign("nothing");
		Patient nowPatient = patientList.get(0);
		
		JSONObject nowPatientJson = new JSONObject();
		nowPatientJson.put("pno", nowPatient.getPno());
		nowPatientJson.put("preportTime", nowPatient.getPreportTime());
		nowPatientJson.put("preportTel", nowPatient.getPreportTel());
		nowPatientJson.put("plocation", nowPatient.getPlocation());
		nowPatientJson.put("pname", nowPatient.getPname());
		nowPatientJson.put("psymptom", nowPatient.getPsymptom());
		nowPatientJson.put("psex", nowPatient.getPsex());
		nowPatientJson.put("page", nowPatient.getPage());
		nowPatientJson.put("pbloodType", nowPatient.getPbloodType());
		String json = nowPatientJson.toString();
		
		JSONObject jsonObejct = new JSONObject();
		jsonObejct.put("totalRows", totalRows);
		jsonObejct.put("nowPatient", json);
		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObejct.toString());
		pw.flush();
		pw.close();
	}

}
