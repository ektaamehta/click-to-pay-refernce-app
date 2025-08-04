package com.mastercard.mcs.clicktopay.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.mastercard.mcs.clicktopay.exception.GlobalExceptionHandler;
import com.mastercard.mcs.clicktopay.service.MasterCardC2PMerchantRegistrationService;
import com.mcs.clicktopay.merchantregistration.model.DpaAddUpdateRequest;

@ExtendWith(MockitoExtension.class)
class MerchantRegistrationControllerTest {

	@Mock
	private MasterCardC2PMerchantRegistrationService merchantRegistrationService;

	@InjectMocks
	private MerchantRegistrationController controller;

	private MockMvc mockMvc;

	@BeforeEach
	void setup() {
		mockMvc = MockMvcBuilders
				.standaloneSetup(controller)
				.setControllerAdvice(new GlobalExceptionHandler())
				.build();
	}

	@Test
	void testSubmitDpaBatch_Success() throws Exception {
		when(merchantRegistrationService.submitDpaBatch(eq("client123"), any(DpaAddUpdateRequest.class), eq("corr123")))
				.thenReturn(ResponseEntity.ok("Batch Submitted"));

		mockMvc.perform(post("/srci/client123/dpas/batch")
				.contentType(MediaType.APPLICATION_JSON)
				.header("correlation-id", "corr123")
				.content("{}"))
				.andExpect(status().isOk())
				.andExpect(content().string("Batch Submitted"));

		verify(merchantRegistrationService, times(1))
				.submitDpaBatch(eq("client123"), any(DpaAddUpdateRequest.class), eq("corr123"));
	}

	@Test
	void testSubmitDpaBatch_MissingCorrelationId() throws Exception {
		mockMvc.perform(post("/srci/client123/dpas/batch")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testGetBatchStatus_Success() throws Exception {
		when(merchantRegistrationService.getDpaBatchStatus("client123", "batch456", "corr123"))
				.thenReturn(ResponseEntity.ok("Batch Status"));

		mockMvc.perform(get("/srci/client123/dpas/batch/status/batch456")
				.header("correlation-id", "corr123"))
				.andExpect(status().isOk())
				.andExpect(content().string("Batch Status"));

		verify(merchantRegistrationService, times(1))
				.getDpaBatchStatus("client123", "batch456", "corr123");
	}

	@Test
	void testGetBatchStatus_MissingCorrelationId() throws Exception {
		mockMvc.perform(get("/srci/client123/dpas/batch/status/batch456"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testSubmitDpaBatch_EmptyCorrelationId() throws Exception {
		mockMvc.perform(post("/srci/client123/dpas/batch")
				.contentType(MediaType.APPLICATION_JSON)
				.header("correlation-id", "")
				.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testGetBatchStatus_EmptyCorrelationId() throws Exception {
		mockMvc.perform(get("/srci/client123/dpas/batch/status/batch456")
				.header("correlation-id", ""))
				.andExpect(status().isBadRequest());
	}
}