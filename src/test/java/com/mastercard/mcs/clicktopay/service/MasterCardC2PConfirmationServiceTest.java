package com.mastercard.mcs.clicktopay.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.mastercard.mcs.clicktopay.constants.AppConstants;
import com.mcs.clicktopay.confirmations.api.DefaultApi;
import com.mcs.clicktopay.confirmations.invoker.ApiClient;
import com.mcs.clicktopay.confirmations.invoker.ApiException;
import com.mcs.clicktopay.confirmations.invoker.ApiResponse;
import com.mcs.clicktopay.confirmations.model.ConfirmationRequest;

@SpringBootTest
class MasterCardC2PConfirmationServiceTest {

    @Spy
    @InjectMocks
    private MasterCardC2PConfirmationService service;
    
    @Test
    @DisplayName("postConfirmation should return expected successful response with null body and 204 response code")
    @SuppressWarnings("unchecked")
    void testPostConfirmation_shouldCallApiSuccessfully() throws Exception {
        ConfirmationRequest mockRequest = mock(ConfirmationRequest.class);
        ApiClient mockApiClient = mock(ApiClient.class);
        DefaultApi mockDefaultApi = mock(DefaultApi.class);

        ApiResponse<Void> mockApiResponse = mockApiResponse();

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getConfirmationApiClient();
        doReturn(mockDefaultApi).when(service).getDefaultApi(mockApiClient);
        // Simulate successful API call
        doReturn(mockApiResponse).when(mockDefaultApi).postConfirmationWithHttpInfo(mockRequest, "mock-flow-id");

        // No exception expected from postConfirmation()
        ResponseEntity<Object> response = service.postConfirmation(mockRequest, "mock-flow-id");
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertNull(body.get(AppConstants.KEY_BODY));
        assertEquals(204, body.get(AppConstants.KEY_STATUS_CODE));

        verify(mockDefaultApi).postConfirmationWithHttpInfo(mockRequest, "mock-flow-id");
    }

    @Test
    @DisplayName("postConfirmation should throw an ApiException Bad Request response with body and 400 response code")
    @SuppressWarnings("unchecked")
    void testPostConfirmation_shouldThrowApiException() throws Exception {
        ConfirmationRequest mockRequest = mock(ConfirmationRequest.class);
        ApiClient mockApiClient = mock(ApiClient.class);
        DefaultApi mockDefaultApi = mock(DefaultApi.class);

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getConfirmationApiClient();
        doReturn(mockDefaultApi).when(service).getDefaultApi(mockApiClient);
        // Simulate API exception
        doThrow(new ApiException("Bad Request", 400, new HashMap<>(), null)).when(mockDefaultApi)
                .postConfirmationWithHttpInfo(mockRequest, "mock-flow-id");

        // Call the service method (not the mock directly!)
        ResponseEntity<Object> response = service.postConfirmation(mockRequest, "mock-flow-id");

        assertEquals(400, response.getStatusCode().value());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(400, body.get(AppConstants.KEY_STATUS_CODE));

        verify(mockDefaultApi).postConfirmationWithHttpInfo(mockRequest, "mock-flow-id");
    }

    @Test
    @DisplayName("getDefaultApi should return the correct DefaultApi Instance")
    void testGetDefaultApi_shouldReturnInstance() {
        ApiClient mockApiClient = mock(ApiClient.class);

        DefaultApi defaultApi = service.getDefaultApi(mockApiClient);

        assertNotNull(defaultApi);
        assertEquals(DefaultApi.class, defaultApi.getClass());
    }

    @SuppressWarnings("unchecked")
    private ApiResponse<Void> mockApiResponse() {
        ApiResponse<Void> response = mock(ApiResponse.class);
        when(response.getHeaders()).thenReturn(new HashMap<>());
        when(response.getStatusCode()).thenReturn(204);
        return response;
    }
}