package com.mastercard.mcs.clicktopay.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.text.ParseException;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mastercard.developer.encryption.JweEncryption;
import com.mastercard.developer.oauth.OAuth;
import com.mastercard.mcs.clicktopay.constants.AppConstants;
import com.mcs.clicktopay.checkout.api.CheckoutApi;
import com.mcs.clicktopay.checkout.invoker.ApiClient;
import com.mcs.clicktopay.checkout.model.CheckoutRequest;
import com.mcs.clicktopay.checkout.model.CheckoutResponse;
import com.mcs.clicktopay.checkout.model.Payload;
import com.nimbusds.jose.JWSObject;

@SpringBootTest
class MasterCardC2PCheckoutServiceTest {

	@Mock
	private RestTemplate restTemplateMock;

	@Mock
	private Gson gsonMock;

	@Spy
	@InjectMocks
	private MasterCardC2PCheckoutService service;

	@Value("${production}")
	boolean production;

	@Value("${signing.consumerKey:defaultValue}")
	private String consumerKey;

	@Value("${signing.pkcs12KeyFile:defaultValue}")
	private String pkcs12KeyFile;

	@Value("${signing.keyAlias:defaultValue}")
	private String signingKeyAlias;

	@Value("${signing.keyPassword:defaultValue}")
	private String signingKeyPassword;

	@Value("${mastercard.encryption.pkcs12KeyFile:defaultValue}")
	private String mastercardEncryptionPkcs12KeyFile;

	@Value("${mastercard.encryption.keyAlias:defaultValue}")
	private String mastercardEncryptionKeyAlias;

	@Value("${mastercard.encryption.keyPassword:defaultValue}")
	private String mastercardEncryptionKeyPassword;

	@Value("${mastercard.api.base-url.sandbox:defaultValue}")
	String sandboxBaseUrl;

	@Value("${mastercard.api.base-url.production:defaultValue}")
	String productionBaseUrl;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(service, "restTemplate", restTemplateMock);
		ReflectionTestUtils.setField(service, "gson", gsonMock);
		// Set required fields
		ReflectionTestUtils.setField(service, "production", production);
		ReflectionTestUtils.setField(service, "sandboxBaseUrl", sandboxBaseUrl);
		ReflectionTestUtils.setField(service, "productionBaseUrl", productionBaseUrl);
		ReflectionTestUtils.setField(service, "consumerKey", consumerKey);
		ReflectionTestUtils.setField(service, "signingKeyAlias", signingKeyAlias);
		ReflectionTestUtils.setField(service, "signingKeyPassword", signingKeyPassword);
		ReflectionTestUtils.setField(service, "pkcs12KeyFile", pkcs12KeyFile);
		ReflectionTestUtils.setField(service, "mastercardEncryptionPkcs12KeyFile", mastercardEncryptionPkcs12KeyFile);
		ReflectionTestUtils.setField(service, "mastercardEncryptionKeyAlias", mastercardEncryptionKeyAlias);
		ReflectionTestUtils.setField(service, "mastercardEncryptionKeyPassword", mastercardEncryptionKeyPassword);
	}

	@Test
	@DisplayName("fetchTransactionCredentials should return expected CheckoutResponse")
	void testFetchTransactionCredentials_shouldCallApiSuccessfully() throws Exception {
		CheckoutRequest request = new CheckoutRequest();
		CheckoutResponse expectedResponse = new CheckoutResponse();

		try (MockedConstruction<CheckoutApi> mocked = Mockito.mockConstruction(CheckoutApi.class, (mock, context) -> {
			when(mock.postTransactionCredentials(any(), any(), any())).thenReturn(expectedResponse);
		})) {

			doReturn(new ApiClient()).when(service).getCheckoutApiClient();

			CheckoutResponse actual = service.fetchTransactionCredentials(request, "flowId", "respHost");
			assertEquals(expectedResponse, actual);
		}
	}

	@ParameterizedTest
	@DisplayName("customFetchTransactionCredentials should return ResponseEntity with decrypted payload")
	@CsvSource(value = { "true, null, null",
			"false, test-flow-id, test-response-host" }, nullValues = "null")
	@SuppressWarnings("unchecked")
	void testCustomFetchTransactionCredentials_shouldReturnResponseEntity(boolean isProduction, String flowId,
			String responseHost) throws Exception {
		ReflectionTestUtils.setField(service, "production", isProduction);

		// Arrange
		CheckoutRequest request = mock(CheckoutRequest.class);

		String responseJson = "{\"checkoutResponseJWS\": \"testJws\"}";
		String jwsPayloadJson = "{\"some\": \"payload\"}";
		String decryptedPayloadJson = "{\"decrypted\": \"data\"}";

		// Mock GSON
		when(gsonMock.toJson(any())).thenReturn("{json}");
		when(gsonMock.fromJson(eq(responseJson), any(TypeToken.class)))
				.thenReturn(Map.of("checkoutResponseJWS", "testJws"));
		when(gsonMock.fromJson(jwsPayloadJson, Payload.class))
				.thenReturn(new Payload());
		when(gsonMock.toJson(any())).thenReturn(jwsPayloadJson);

		// Mock RestTemplate
		ResponseEntity<String> fakeResponse = new ResponseEntity<>(responseJson, HttpStatus.OK);
		when(restTemplateMock.postForEntity(any(URI.class), any(HttpEntity.class), eq(String.class)))
				.thenReturn(fakeResponse);

		// Mock static
		try (MockedStatic<OAuth> oAuthMockedStatic = mockStatic(OAuth.class);
				MockedStatic<JWSObject> jwsObjectMockedStatic = mockStatic(JWSObject.class);
				MockedStatic<JweEncryption> jweEncryptionMockedStatic = mockStatic(JweEncryption.class)) {

			oAuthMockedStatic.when(() -> OAuth.getAuthorizationHeader(any(), any(), any(), any(), any(), any()))
					.thenReturn("OAuthHeader");

			JWSObject jwsObject = mock(JWSObject.class);
			jwsObjectMockedStatic.when(() -> JWSObject.parse(anyString())).thenReturn(jwsObject);

			when(jwsObject.getPayload()).thenReturn(new com.nimbusds.jose.Payload(Map.of("some", "payload")));

			jweEncryptionMockedStatic.when(() -> JweEncryption.decryptPayload(any(), any()))
					.thenReturn(decryptedPayloadJson);

			// Act
			ResponseEntity<Object> result = service.customFetchTransactionCredentials(request, flowId, responseHost);

			// Assert
			assertEquals(200, result.getStatusCode().value());
			Map<String, Object> body = (Map<String, Object>) result.getBody();
			assertNotNull(body);
			assertTrue(body.containsKey(AppConstants.KEY_BODY));
			assertTrue(body.containsKey(AppConstants.KEY_HEADERS));
			assertTrue(body.containsKey(AppConstants.KEY_STATUS_CODE));
		}
	}

	@Test
	@DisplayName("customFetchTransactionCredentials should handle HTTP errors gracefully")
	@SuppressWarnings("unchecked")
	void testCustomFetchTransactionCredentials_httpError() throws Exception {
		CheckoutRequest request = mock(CheckoutRequest.class);

		// Simulate RestTemplate 4xx/5xx error
		HttpStatusCodeException exception = mock(HttpStatusCodeException.class);
		when(exception.getResponseBodyAsString()).thenReturn("error-body");
		when(exception.getResponseHeaders()).thenReturn(new HttpHeaders());
		when(exception.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);

		when(restTemplateMock.postForEntity(any(URI.class), any(HttpEntity.class), eq(String.class)))
				.thenThrow(exception);

		// Act
		ResponseEntity<Object> result = service.customFetchTransactionCredentials(request, "flow", "respHost");

		// Assert
		assertEquals(400, result.getStatusCode().value());
		Map<String, Object> body = (Map<String, Object>) result.getBody();
		assertNotNull(body);
		assertEquals("error-body", body.get(AppConstants.KEY_BODY));
		assertEquals(400, body.get(AppConstants.KEY_STATUS_CODE));
	}

	@Test
	@DisplayName("customFetchTransactionCredentials should handle Exception gracefully")
	@SuppressWarnings("unchecked")
	void testCustomFetchTransactionCredentials_exception()
			throws Exception {
		CheckoutRequest request = mock(CheckoutRequest.class);

		String responseJson = "{\"checkoutResponseJWS\": \"testJws\"}";
		String jwsPayloadJson = "{\"some\": \"payload\"}";

		// Mock GSON
		when(gsonMock.toJson(any())).thenReturn("{json}");
		when(gsonMock.fromJson(eq(responseJson), any(TypeToken.class)))
				.thenReturn(Map.of("checkoutResponseJWS", "testJws"));
		when(gsonMock.fromJson(jwsPayloadJson, Payload.class))
				.thenReturn(new Payload());
		when(gsonMock.toJson(any())).thenReturn(jwsPayloadJson);

		// Mock RestTemplate
		ResponseEntity<String> fakeResponse = new ResponseEntity<>(responseJson, HttpStatus.OK);
		when(restTemplateMock.postForEntity(any(URI.class), any(HttpEntity.class), eq(String.class)))
				.thenReturn(fakeResponse);

		// Simulate ParseException/5xx error
		ParseException exception = mock(ParseException.class);
		when(exception.getMessage()).thenReturn("error-body");

		try (MockedStatic<JWSObject> jwsObjectMockedStatic = mockStatic(JWSObject.class)) {
			jwsObjectMockedStatic.when(() -> JWSObject.parse(anyString())).thenThrow(exception);

			// Act
			ResponseEntity<Object> result = service.customFetchTransactionCredentials(request, "flow", "respHost");

			// Assert
			assertEquals(500, result.getStatusCode().value());
			Map<String, Object> body = (Map<String, Object>) result.getBody();
			assertNotNull(body);
			assertEquals("error-body", body.get(AppConstants.KEY_BODY));
			assertEquals(500, body.get(AppConstants.KEY_STATUS_CODE));
		}
	}
}