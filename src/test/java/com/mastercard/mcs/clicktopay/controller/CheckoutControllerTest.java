package com.mastercard.mcs.clicktopay.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.mastercard.mcs.clicktopay.service.MasterCardC2PCheckoutService;
import com.mcs.clicktopay.checkout.model.CheckoutRequest;

import jakarta.servlet.http.HttpServletRequest;

class CheckoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private MasterCardC2PCheckoutService masterCardC2PCheckoutService;

    @InjectMocks
    private CheckoutController checkoutController;

    @Mock
    private HttpServletRequest httpServletRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(checkoutController).build();
    }

    @Test
    @DisplayName("Test Transaction Credentials with Invalid JSON Request")
    void testTransactionCredentials_invalidJson_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/transaction/credentials")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-SRC-CX-FLOW-ID", "34f4a04b.7602af12-a18b-4023-a476-8231ddcaefe7.1621276711")
                .header("X-SRC-RESPONSE-HOST", "https://ksc.services-asn.mastercard.com/")
                .content("{invalidJson:true"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test Transaction Credentials with No Content")
    void testTransactionCredentials_noContent_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/transaction/credentials")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-SRC-CX-FLOW-ID", "34f4a04b.7602af12-a18b-4023-a476-8231ddcaefe7.1621276711")
                .header("X-SRC-RESPONSE-HOST", "https://ksc.services-asn.mastercard.com/"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test Transaction Credentials with Valid Request")
	void testProcessTransactionCredentials_success() throws Exception {
		CheckoutRequest request = new CheckoutRequest();
        String flowId = "34f4a04b.7602af12-a18b-4023-a476-8231ddcaefe7.1621276711";
        String responseHost = "https://ksc.services-asn.mastercard.com/";

        when(httpServletRequest.getHeader("X-SRC-CX-FLOW-ID")).thenReturn(flowId);
        when(httpServletRequest.getHeader("X-SRC-RESPONSE-HOST")).thenReturn(responseHost);
        doReturn(mockCheckoutApiResponse()).when(masterCardC2PCheckoutService).customFetchTransactionCredentials(request, flowId, responseHost);

        ResponseEntity<Object> response = checkoutController.processTransactionCredentials(request, httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertNull(response.getBody());

        verify(masterCardC2PCheckoutService, times(1)).customFetchTransactionCredentials(request, flowId, responseHost);
	}

    @SuppressWarnings("unchecked")
    private ResponseEntity<Object> mockCheckoutApiResponse() {
        ResponseEntity<Object> response = mock(ResponseEntity.class);
        when(response.getStatusCode()).thenReturn(HttpStatusCode.valueOf(200));
        when(response.getBody()).thenReturn(null);

        return response;
    }
}