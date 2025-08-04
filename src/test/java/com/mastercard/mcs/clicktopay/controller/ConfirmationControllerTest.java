package com.mastercard.mcs.clicktopay.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import com.mastercard.mcs.clicktopay.service.MasterCardC2PConfirmationService;
import com.mcs.clicktopay.confirmations.model.ConfirmationRequest;

import jakarta.servlet.http.HttpServletRequest;

class ConfirmationControllerTest {

    private ConfirmationController confirmationController;

    @Mock
    private MasterCardC2PConfirmationService confirmationService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        confirmationController = new ConfirmationController(confirmationService);
    }

    @Test
    void testPostConfirmation_success() throws Exception {
        ConfirmationRequest request = new ConfirmationRequest();
        String flowId = "flow123";

        when(httpServletRequest.getHeader("X-SRC-CX-FLOW-ID")).thenReturn(flowId);
        doReturn(mockConfirmationApiResponse()).when(confirmationService).postConfirmation(request, flowId);

        ResponseEntity<Object> response = confirmationController.postConfirmation(request, httpServletRequest);

        assertEquals(204, response.getStatusCode().value());
        assertNull(response.getBody());

        verify(confirmationService, times(1)).postConfirmation(request, flowId);
    }

    @SuppressWarnings("unchecked")
    private ResponseEntity<Object> mockConfirmationApiResponse() {
        ResponseEntity<Object> response = mock(ResponseEntity.class);
        when(response.getStatusCode()).thenReturn(HttpStatusCode.valueOf(204));
        when(response.getBody()).thenReturn(null);

        return response;
    }
}