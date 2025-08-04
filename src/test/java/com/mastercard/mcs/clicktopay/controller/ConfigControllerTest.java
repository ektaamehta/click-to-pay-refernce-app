package com.mastercard.mcs.clicktopay.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ConfigController.class)
@TestPropertySource(properties = {
        "srcClientId=test-client-id",
        "srcDpaId=test-dpa-id"
})
class ConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetConfigValues_returnsExpectedProperties() throws Exception {
        mockMvc.perform(get("/api/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.srcClientId").value("test-client-id"))
                .andExpect(jsonPath("$.srcDpaId").value("test-dpa-id"));
    }
}