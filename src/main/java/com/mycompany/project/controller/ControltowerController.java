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
		boolean isNowPatient = true;
		/*if(patientList.size() > 0) {
			model.addAttribute("nowPatient", patientList.get(0));
			isNowPatient = true;
		}else {
			isNowPatient = false;
		}*/
		if(patientList.size() > 0)
		{
			int patientWaiting = patientList.size();
			model.addAttribute("patientWating", patientWaiting);
			model.addAttribute("patientList", patientList);
		}
		model.addAttribute("isNowPatient", isNowPatient);
		
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
		
		JSONObject jsonObejct = new JSONObject();
		
		int totalRows = controltowerService.selectCountByPcarAssign("nothing");
		jsonObejct.put("totalRows", totalRows);
		
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
		jsonObejct.put("nowPatient", json);
		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObejct.toString());
		pw.flush();
		pw.close();
	}

	@PostMapping("carStart.do")
	public void carStart(HttpServletResponse response, String nowPatientNo) throws IOException {
		int intNowPatientNo = Integer.parseInt(nowPatientNo);
		Patient patient = controltowerService.getPatientByPno(intNowPatientNo);
		patient.setPcarAssign("car");
		controltowerService.updatePcarAssign(patient);
		
		JSONObject jsonObejct = new JSONObject();
		int totalRows = controltowerService.selectCountByPcarAssign("nothing");
		jsonObejct.put("totalRows", totalRows);
		if(totalRows != 0) {
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
			jsonObejct.put("nowPatient", json);
		}
		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObejct.toString());
		pw.flush();
		pw.close();
	}
	
	@RequestMapping("/savePatientInfo.do")
	public void patientInfo(@RequestParam Map<String, String> patientInfo, HttpServletResponse response) throws IOException
	{
		LOGGER.info("실행");
		Patient patient = new Patient();
		patient.setPreportTime(patientInfo.get("preportTime"));
		patient.setPreportTel(patientInfo.get("preportTel"));
		patient.setPlocation(patientInfo.get("plocation"));
		patient.setPname(patientInfo.get("pname"));
		patient.setPsymptom(patientInfo.get("psymptom"));
		patient.setPsex(patientInfo.get("psex"));
		patient.setPage(patientInfo.get("page"));
		patient.setPbloodType(patientInfo.get("pbloodType"));
		patient.setPcarAssign(patientInfo.get("pcarAssign"));
		
		controltowerService.savePatient(patient);
		
		String result = "save ok";
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("result", result);
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObject.toString());
		pw.flush();
		pw.close();
	}
	
	@RequestMapping("/requestWaitingCnt.do")
	public void requestWaitingCnt(HttpServletResponse response) throws IOException
	{
		int waitingCnt = controltowerService.selectCountByPcarAssign("nothing");
//		LOGGER.info("대기인원:{}", waitingCnt);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("waitingCnt", waitingCnt);
		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObject.toString());
		pw.flush();
		pw.close();
	}
	
	//
	@RequestMapping("/requestTopPatient.do")
	public void requestTopPatient(HttpServletResponse response, 
			String carNo, String assignedCar, 
			Model model) throws IOException 
	{
//		LOGGER.info(carNo);
		Patient patient = null;
		patient = controltowerService.getTopPatientByPcarAssign(assignedCar);
		
		JSONObject jsonPatient = new JSONObject();
		JSONObject jsonObejct = new JSONObject();
		if(patient == null) //assignedCar로 가져온게 없다면
		{
			jsonObejct.put("patient", "null");
		}
		else //assignedCar로 가져온게 있다면
		{
			//nothing을 carAssign 해서 업데이트
			patient.setPcarAssign(carNo);
//			controltowerService.updatePcarAssign(patient);
			
			//patient 응답
//			jsonPatient.put("plocation", patient.getPlocation());
			jsonPatient.put("pno", patient.getPno());
			jsonPatient.put("preportTime", patient.getPreportTime());
			jsonPatient.put("preportTel", patient.getPreportTel());
			jsonPatient.put("plocation", patient.getPlocation());
			jsonPatient.put("pname", patient.getPname());
			jsonPatient.put("psymptom", patient.getPsymptom());
			jsonPatient.put("psex", patient.getPsex());
			jsonPatient.put("page", patient.getPage());
			jsonPatient.put("pbloodType", patient.getPbloodType());
			
			jsonObejct.put("patient", jsonPatient);
			
			/*if(assignedCar.equals("1"))
			{
				model.addAttribute("patient1", patient);
			}
			else if(assignedCar.equals("2"))
			{
				model.addAttribute("patient2", patient);
			}*/
		}
		
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObejct.toString());
		pw.flush();
		pw.close();
	}
	
	@RequestMapping("/updateCarAssign.do")
	public void requestAssignPatientInfo(HttpServletResponse response, @RequestParam Map<String, String> patientInfo) throws IOException
	{
		Patient patient = new Patient();
		patient.setPreportTime(patientInfo.get("preportTime"));
		patient.setPreportTel(patientInfo.get("preportTel"));
		patient.setPlocation(patientInfo.get("plocation"));
		patient.setPname(patientInfo.get("pname"));
		patient.setPsymptom(patientInfo.get("psymptom"));
		patient.setPsex(patientInfo.get("psex"));
		patient.setPage(patientInfo.get("page"));
		patient.setPbloodType(patientInfo.get("pbloodType"));
		patient.setPcarAssign(patientInfo.get("pcarAssign"));
		
		controltowerService.updatePcarAssign(patient);
		
		JSONObject jsonObejct = new JSONObject();
		jsonObejct.put("result", "update ok");
		response.setContentType("application/json; charset=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.write(jsonObejct.toString());
		pw.flush();
		pw.close();
	}
}
