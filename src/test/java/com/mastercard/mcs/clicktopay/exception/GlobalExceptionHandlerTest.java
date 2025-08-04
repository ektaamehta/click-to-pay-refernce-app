package com.mastercard.mcs.clicktopay.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.mcs.clicktopay.checkout.model.Error;

@SpringBootTest
class GlobalExceptionHandlerTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleException_returnsInternalServerErrorWithCustomError() {
        Exception ex = new Exception("Unexpected failure");

        ResponseEntity<Object> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody() instanceof Error);

        Error errorBody = (Error) response.getBody();
        assertNotNull(errorBody);
        assertEquals("UNKNOWN", errorBody.getReason());
        assertEquals("Unexpected failure", errorBody.getMessage());
    }

    @Test
    void handleIllegalArgument_returnsBadRequestWithMessage() {
        IllegalArgumentException ex = new IllegalArgumentException("Bad input");

        ResponseEntity<String> response = handler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bad input", response.getBody());
    }
}
