package com.example.springboot;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.example.springboot.model.Info;
import com.example.springboot.model.Issue;
import com.example.springboot.model.Match;
import com.example.springboot.model.SpellCheck;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@SpringBootTest
@AutoConfigureMockMvc
public class SpellCheckerControllerTest {

	@Autowired
	private MockMvc mvc;
	
	@Test
	public void getHello() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().string(equalTo("Greetings from Spring Boot!")));
	}

	@Test
    public void postMessage_CorrectInput_Returns200() throws Exception {
        String input = "This is a sentece with an speling error.";

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
            .post("/message")
            .contentType(MediaType.TEXT_PLAIN)
            .content(input);

        mvc.perform(request)
            .andExpect(MockMvcResultMatchers.status().isOk());
    }

	@Test
    public void postMessage_IncorrectInput_Returns400() throws Exception {
        String input = "";

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders
            .post("/message")
            .contentType(MediaType.TEXT_PLAIN)
            .content(input);

        mvc.perform(request)
            .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

	@Test
    public void postMessage_CorrectInput_ReturnsCorrectJSONValues() throws Exception {
        String input = "This is a sentece with an speling error.";
		SpellCheck expectedResponse = new SpellCheck(
        	new Info(input), 
        	List.of(new Issue("Possible Typo", new Match("sentece", 10, 17, List.of("sentence"))),
			new Issue("Miscellaneous", new Match("an", 23, 25, List.of("a"))),
			new Issue("Possible Typo", new Match("speling", 26, 33, List.of("spelling","spewing","spieling"))))
    	);
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders
            .post("/message")
            .contentType(MediaType.TEXT_PLAIN)
            .content(input);

        MvcResult result = mvc.perform(request)
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andReturn();

        ObjectMapper mapper = new ObjectMapper();
		mapper.registerModule(new JavaTimeModule());
        SpellCheck actualResponse = mapper.readValue(result.getResponse().getContentAsString(), SpellCheck.class);
        
        assertThat(actualResponse.getInfo().getWords()).isEqualTo(expectedResponse.getInfo().getWords());
		assertThat(actualResponse.getIssues().size()).isEqualTo(expectedResponse.getIssues().size());
    }
}

