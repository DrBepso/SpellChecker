package com.example.springboot;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.RuleMatch;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.model.Info;
import com.example.springboot.model.Issue;
import com.example.springboot.model.Match;
import com.example.springboot.model.SpellCheck;

/**
 * SpellCheckerController is a REST controller class that provides endpoints for checking the spelling of a given message.
 */
@RestController
public class SpellCheckerController {

	private static final String CROSS_ORIGIN_ORIGIN = "http://localhost:3000";
	private JLanguageTool langTool = new JLanguageTool(new AmericanEnglish());

	/**
	 * The index method returns a greeting message from Spring Boot.
	 * @return a greeting message from Spring Boot
	 */
	@GetMapping("/")
	public String index() {
		return "Greetings from Spring Boot!";
	}

	/**
	 * The postMessage method checks the spelling of a given message (in plain text)
	 * and returns a response with the spelling issues found (in JSON format).
	 * @param message the message to be checked
	 * @return a response with the spelling issues found
	 */
	@PostMapping(path = "/message", consumes = "text/plain")
	@CrossOrigin(origins = CROSS_ORIGIN_ORIGIN)
	@ResponseBody
	public ResponseEntity<SpellCheck> postMessage(@RequestBody String message) {
		if (message == null || message.trim().isEmpty()) {
			return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
		}
	
		if (langTool == null) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	
		try {
			List<Issue> issues = getIssues(message, langTool);
			return new ResponseEntity<>(
				new SpellCheck(
					new Info(message),
					issues
				), HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	/**
	 * The getIssues method finds spelling issues in a given message using the language tool.
	 * @param message the message to be checked
	 * @param langTool the language tool used for checking the spelling
	 * @return a list of spelling issues that the languagetool found
	 * */
	private List<Issue> getIssues(String message, JLanguageTool langTool) throws IOException {
		List<RuleMatch> matches = langTool.check(message);
		return matches.stream()
		  .map(match -> new Issue(message, match))
		  .collect(Collectors.toList());
	}
}
