package com.mastercard.mcs.clicktopay.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.PrivateKey;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import com.mastercard.developer.encryption.EncryptionException;
import com.mastercard.developer.encryption.JweConfig;
import com.mastercard.developer.interceptors.OkHttpOAuth1Interceptor;

import okhttp3.OkHttpClient;

@SpringBootTest
class MasterCardCommonServiceTest {

    @Spy
    @InjectMocks
    private MasterCardCommonService service;

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
    @DisplayName("getSigningKey should load PrivateKey from file")
    void testGetSigningKey_shouldLoadPrivateKeyFromFile() {
        assertDoesNotThrow(() -> {
            PrivateKey key = service.getSigningKey();
            assertNotNull(key, "The private key should be loaded successfully.");
        });
    }

    @Test
    @DisplayName("getSigningKey should load throw FileNotFoundExeption when file is not present in the classpath")
    void testGetSigningKey_shouldThrowFileNotFoundException() {
        ReflectionTestUtils.setField(service, "pkcs12KeyFile", "fileNotPresent.p12");

        assertThrows(FileNotFoundException.class, () -> {
            service.getSigningKey();
        });
    }

    @ParameterizedTest
    @DisplayName("getMerchantApiClient should set correct base path and create ApiClient for the selected environment")
    @CsvSource({ "true, https://api.mastercard.com/src",
            "false, https://sandbox.api.mastercard.com/src" })
    void testGetMerchantApiClient_shouldSetBasePathAndCreateApiClientForEnvironment(boolean isProduction,
            String expectedBasePath) throws Exception {
        ReflectionTestUtils.setField(service, "production", isProduction);

        com.mcs.clicktopay.merchantregistration.invoker.ApiClient apiClient = service.getMerchantApiClient();
        assertApiClient(apiClient, com.mcs.clicktopay.merchantregistration.invoker.ApiClient.class, expectedBasePath);
    }

    @ParameterizedTest
    @DisplayName("getConfirmationApiClient should set correct base path and create ApiClient for the selected environment")
    @CsvSource({ "true, https://api.mastercard.com/src",
            "false, https://sandbox.api.mastercard.com/src" })
    void testGetConfirmationApiClient_shouldSetBasePathAndCreateApiClientForEnvironment(boolean isProduction,
            String expectedBasePath) throws Exception {
        ReflectionTestUtils.setField(service, "production", isProduction);

        com.mcs.clicktopay.confirmations.invoker.ApiClient apiClient = service.getConfirmationApiClient();
        assertApiClient(apiClient, com.mcs.clicktopay.confirmations.invoker.ApiClient.class, expectedBasePath);
    }

    @ParameterizedTest
    @DisplayName("getCheckoutApiClient should set correct base path and create ApiClient for the selected environment")
    @CsvSource({ "true, https://api.mastercard.com/src",
            "false, https://sandbox.api.mastercard.com/src" })
    void testGetCheckoutApiClient_shouldSetBasePathAndCreateApiClientForEnvironment(boolean isProduction,
            String expectedBasePath) throws Exception {
        ReflectionTestUtils.setField(service, "production", isProduction);

        com.mcs.clicktopay.checkout.invoker.ApiClient apiClient = service.getCheckoutApiClient();
        assertApiClient(apiClient, com.mcs.clicktopay.checkout.invoker.ApiClient.class, expectedBasePath);
    }

    @Test
    @DisplayName("getDecryptionConfig should provide decryptionConfig when the initial value for decryptionConfig is null")
    void testGetDecryptionConfig_whenDecryptionConfigIsNull()
            throws IOException, GeneralSecurityException, EncryptionException {
        ReflectionTestUtils.setField(service, "production", false);
        ReflectionTestUtils.setField(service, "decryptionConfig", null);

        JweConfig decryptionConfig = (JweConfig) ReflectionTestUtils.getField(service, "decryptionConfig");
        assertNull(decryptionConfig);

        decryptionConfig = service.getDecryptionConfig();
        
        assertNotNull(decryptionConfig);
    }

    @Test
    @DisplayName("getDecryptionConfig should provide decryptionConfig when the initial value for decryptionConfig is not null")
    void testGetDecryptionConfig_whenDecryptionConfigIsNotNull()
            throws IOException, GeneralSecurityException, EncryptionException {
        ReflectionTestUtils.setField(service, "production", false);
        ReflectionTestUtils.setField(service, "decryptionConfig", new JweConfig());

        JweConfig decryptionConfig = (JweConfig) ReflectionTestUtils.getField(service, "decryptionConfig");
        assertNotNull(decryptionConfig);

        decryptionConfig = service.getDecryptionConfig();
        
        assertNotNull(decryptionConfig);
    }

    private <T> void assertApiClient(Object apiClient, Class<T> apiClientClass, String expectedBasePath) {
        assertNotNull(apiClient);
        assertEquals(apiClientClass, apiClient.getClass());

        if (expectedBasePath != null) {
            String actualBasePath = (String) ReflectionTestUtils.getField(apiClient, "basePath");
            if (actualBasePath != null) {
                assertTrue(actualBasePath.contains(expectedBasePath));
            }
        }

        OkHttpClient httpClient = (OkHttpClient) ReflectionTestUtils.getField(apiClient, "httpClient");
        assertNotNull(httpClient);

        boolean hasOAuthInterceptor = httpClient.interceptors().stream()
                .anyMatch(OkHttpOAuth1Interceptor.class::isInstance);
        assertTrue(hasOAuthInterceptor, "OAuth1Interceptor should be present in client");
    }
}