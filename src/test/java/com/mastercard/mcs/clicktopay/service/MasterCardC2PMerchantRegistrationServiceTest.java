package com.mastercard.mcs.clicktopay.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import com.mastercard.mcs.clicktopay.constants.AppConstants;
import com.mcs.clicktopay.merchantregistration.invoker.ApiException;
import com.mcs.clicktopay.merchantregistration.api.MerchantRegistrationApi;
import com.mcs.clicktopay.merchantregistration.invoker.ApiClient;
import com.mcs.clicktopay.merchantregistration.invoker.ApiResponse;
import com.mcs.clicktopay.merchantregistration.model.DpaAddUpdateRequest;
import com.mcs.clicktopay.merchantregistration.model.DpaAddUpdateResponse;
import com.mcs.clicktopay.merchantregistration.model.DpaBatchStatus;

@SpringBootTest
class MasterCardC2PMerchantRegistrationServiceTest {

    @Spy
    @InjectMocks
    private MasterCardC2PMerchantRegistrationService service;

    @Value("${srcClientId}")
    private String srcClientId;

    @Test
    @DisplayName("createMerchantRegistrationApi should return an instance of MerchantRegistrationApi")
    void testCreateMerchantRegistrationApi_returnsInstance() {
        ApiClient mockApiClient = mock(ApiClient.class);
        
        MerchantRegistrationApi result = service.createMerchantRegistrationApi(mockApiClient);

        assertNotNull(result);
        assertEquals(MerchantRegistrationApi.class, result.getClass());
    }

    @ParameterizedTest
    @DisplayName("submitDpaBatch should return expected successful response with 200 status code")
    @CsvSource({ "true", "false" })
    @SuppressWarnings("unchecked")
    void testSubmitDpaBatch_shouldReturnSuccessfulResponse(boolean isProduction) throws Exception {
        ReflectionTestUtils.setField(service, "production", isProduction);

        DpaAddUpdateRequest mockRequest = mock(DpaAddUpdateRequest.class);
        ApiClient mockApiClient = mock(ApiClient.class);
        MerchantRegistrationApi mockMerchantRegistrationApi = mock(MerchantRegistrationApi.class);

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getMerchantApiClient();
        doReturn(mockMerchantRegistrationApi).when(service).createMerchantRegistrationApi(mockApiClient);

        // Simulate successful API call
        doReturn(mockDpaAddUpdateApiResponse()).when(mockMerchantRegistrationApi)
                .bulkAddUpdateDpaWithHttpInfo("test-correlation-id", "test-src-client-id", mockRequest);

        ResponseEntity<Object> response = service.submitDpaBatch("test-src-client-id", mockRequest, "test-correlation-id");
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(body.containsKey(AppConstants.KEY_BODY));
        assertTrue(body.containsKey(AppConstants.KEY_HEADERS));
        assertTrue(body.containsKey(AppConstants.KEY_STATUS_CODE));

        verify(mockMerchantRegistrationApi).bulkAddUpdateDpaWithHttpInfo("test-correlation-id", "test-src-client-id", mockRequest);
    }

    @Test
    @DisplayName("submitDpaBatch should throw an ApiException Bad Request response with body and 400 response code")
    @SuppressWarnings("unchecked")
    void testSubmitDpaBatch_shouldThrowApiException() throws Exception {
        DpaAddUpdateRequest mockRequest = mock(DpaAddUpdateRequest.class);
        ApiClient mockApiClient = mock(ApiClient.class);
        MerchantRegistrationApi mockMerchantRegistrationApi = mock(MerchantRegistrationApi.class);

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getMerchantApiClient();
        doReturn(mockMerchantRegistrationApi).when(service).createMerchantRegistrationApi(mockApiClient);
        // Simulate API exception
        doThrow(new ApiException("Bad Request", 400, new HashMap<>(), null)).when(mockMerchantRegistrationApi)
                .bulkAddUpdateDpaWithHttpInfo("test-correlation-id", "test-src-client-id", mockRequest);

        // Call the service method (not the mock directly!)
        ResponseEntity<Object> response = service.submitDpaBatch("test-src-client-id", mockRequest, "test-correlation-id");

        assertEquals(400, response.getStatusCode().value());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(400, body.get(AppConstants.KEY_STATUS_CODE));

        verify(mockMerchantRegistrationApi).bulkAddUpdateDpaWithHttpInfo("test-correlation-id", "test-src-client-id", mockRequest);
    }

    @ParameterizedTest
    @DisplayName("submitDpaBatch should return expected successful response with 200 status code")
    @CsvSource({ "true", "false" })
    @SuppressWarnings("unchecked")
    void testGetDpaBatchStatus_shouldReturnSuccessfulResponse(boolean isProduction) throws Exception {
        ReflectionTestUtils.setField(service, "production", isProduction);
        
        ApiClient mockApiClient = mock(ApiClient.class);
        MerchantRegistrationApi mockMerchantRegistrationApi = mock(MerchantRegistrationApi.class);

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getMerchantApiClient();
        doReturn(mockMerchantRegistrationApi).when(service).createMerchantRegistrationApi(mockApiClient);

        // Simulate successful API call
        doReturn(mockDpaBatchStatusApiResponse()).when(mockMerchantRegistrationApi)
                .getDpaBatchStatusWithHttpInfo("test-correlation-id", "test-src-client-id", "test-batch-id");

        ResponseEntity<Object> response = service.getDpaBatchStatus("test-src-client-id", "test-batch-id", "test-correlation-id");

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(body.containsKey(AppConstants.KEY_BODY));
        assertTrue(body.containsKey(AppConstants.KEY_HEADERS));
        assertTrue(body.containsKey(AppConstants.KEY_STATUS_CODE));

        verify(mockMerchantRegistrationApi).getDpaBatchStatusWithHttpInfo("test-correlation-id", "test-src-client-id", "test-batch-id");
    }

    @Test
    @DisplayName("getDpaBatchStatus should throw an ApiException Bad Request response with body and 400 response code")
    @SuppressWarnings("unchecked")
    void testGetDpaBatchStatus_shouldThrowApiException() throws Exception {
        ApiClient mockApiClient = mock(ApiClient.class);
        MerchantRegistrationApi mockMerchantRegistrationApi = mock(MerchantRegistrationApi.class);

        // Spy the service and override getApiClient and getDefaultApi
        doReturn(mockApiClient).when(service).getMerchantApiClient();
        doReturn(mockMerchantRegistrationApi).when(service).createMerchantRegistrationApi(mockApiClient);
        // Simulate API exception
        doThrow(new ApiException("Bad Request", 400, new HashMap<>(), null)).when(mockMerchantRegistrationApi)
                .getDpaBatchStatusWithHttpInfo("test-correlation-id", "test-src-client-id", "test-batch-id");;

        // Call the service method (not the mock directly!)
        ResponseEntity<Object> response = service.getDpaBatchStatus("test-src-client-id", "test-batch-id", "test-correlation-id");

        assertEquals(400, response.getStatusCode().value());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(400, body.get(AppConstants.KEY_STATUS_CODE));

        verify(mockMerchantRegistrationApi).getDpaBatchStatusWithHttpInfo("test-correlation-id", "test-src-client-id", "test-batch-id");;
    }

    @SuppressWarnings("unchecked")
    private ApiResponse<DpaAddUpdateResponse> mockDpaAddUpdateApiResponse() {
        ApiResponse<DpaAddUpdateResponse> response = mock(ApiResponse.class);
        when(response.getHeaders()).thenReturn(new HashMap<>());
        when(response.getStatusCode()).thenReturn(200);
        when(response.getData()).thenReturn(new DpaAddUpdateResponse());

        return response;
    }

    @SuppressWarnings("unchecked")
    private ApiResponse<DpaBatchStatus> mockDpaBatchStatusApiResponse() {
        ApiResponse<DpaBatchStatus> response = mock(ApiResponse.class);
        when(response.getHeaders()).thenReturn(new HashMap<>());
        when(response.getStatusCode()).thenReturn(200);
        when(response.getData()).thenReturn(new DpaBatchStatus());

        return response;
    }
}