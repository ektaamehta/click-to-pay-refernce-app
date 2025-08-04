# CheckoutApi

All URIs are relative to *https://api.mastercard.com/src/api/digital/payments*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**postTransactionCredentials**](CheckoutApi.md#postTransactionCredentials) | **POST** /transaction/credentials | Checkout end point for retrieving transaction payload. |


<a id="postTransactionCredentials"></a>
# **postTransactionCredentials**
> CheckoutResponse postTransactionCredentials(checkoutRequest, xSrcCxFlowId, xSrcResponseHost)

Checkout end point for retrieving transaction payload.

Requests the preparation of transaction credentials for checkout. The transaction credentials payload data is encrypted according to JSON Web Encryption (JWE) specification RFC 7516. Algorithm used to encrypt the payload is according to RFC 7518 section 4.1. Obtain the encrypted transaction credentials for an enrolled card from Secure Card on File so that it can be submitted for authorization processing and the consumer can complete the purchase.

### Example
```java
// Import classes:
import com.mcs.clicktopay.checkout.invoker.ApiClient;
import com.mcs.clicktopay.checkout.invoker.ApiException;
import com.mcs.clicktopay.checkout.invoker.Configuration;
import com.mcs.clicktopay.checkout.invoker.models.*;
import com.mcs.clicktopay.checkout.api.CheckoutApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://api.mastercard.com/src/api/digital/payments");

    CheckoutApi apiInstance = new CheckoutApi(defaultClient);
    CheckoutRequest checkoutRequest = new CheckoutRequest(); // CheckoutRequest | Checkout Request
    String xSrcCxFlowId = "34f4a04b.7602af12-a18b-4023-a476-8231ddcaefe7.1621276711"; // String | The X-Src-Cx-Flow-Id ensures to direct all calls from the same client to the same server and maintains session affinity. When you make your initial API call, Secure Card on File responds with the X-Src-Cx-Flow-Id in the header. The X-Src-Cx-Flow-Id returned in this response can be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response.
    String xSrcResponseHost = "https://ksc.services-asn.mastercard.com/"; // String | The X-Src-Response-Host is used to direct all calls from the same client to the same server to maintain session affinity. When you make your initial API call, Mastercard Checkout Solutions responds with the X-Src-Response-Host in the HTTP header. The X-Src-Response-Host that is returned will contain a site specific URL that must be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response.
    try {
      CheckoutResponse result = apiInstance.postTransactionCredentials(checkoutRequest, xSrcCxFlowId, xSrcResponseHost);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling CheckoutApi#postTransactionCredentials");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **checkoutRequest** | [**CheckoutRequest**](CheckoutRequest.md)| Checkout Request | |
| **xSrcCxFlowId** | **String**| The X-Src-Cx-Flow-Id ensures to direct all calls from the same client to the same server and maintains session affinity. When you make your initial API call, Secure Card on File responds with the X-Src-Cx-Flow-Id in the header. The X-Src-Cx-Flow-Id returned in this response can be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response. | [optional] |
| **xSrcResponseHost** | **String**| The X-Src-Response-Host is used to direct all calls from the same client to the same server to maintain session affinity. When you make your initial API call, Mastercard Checkout Solutions responds with the X-Src-Response-Host in the HTTP header. The X-Src-Response-Host that is returned will contain a site specific URL that must be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response. | [optional] |

### Return type

[**CheckoutResponse**](CheckoutResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK  |  * X-Src-Cx-Flow-Id - The X-Src-Cx-Flow-Id ensures to direct all calls from the same client to the same server and maintains session affinity. When you make your initial API call, Secure Card on File responds with the X-Src-Cx-Flow-Id in the header. The X-Src-Cx-Flow-Id returned in this response can be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response. <br>  * X-Src-Response-Host - The X-Src-Response-Host is used to direct all calls from the same client to the same server to maintain session affinity. When you make your initial API call, Mastercard Checkout Solutions responds with the X-Src-Response-Host in the HTTP header. The X-Src-Response-Host that is returned will contain a site specific URL that must be used in the subsequent calls to ensure these calls are directed to the same server that returned the initial response. <br>  |
| **400** | Bad Request. Reason code of &#x60;INVALID_ARGUMENT&#x60; Identifies a malformed or invalid request. Use cases:    * Mandatory parameters in request are missing. Example, &#x60;srcClientId&#x60; or &#x60;srcDigitalCardId&#x60; values are not provided.   * Request parameters value has invalid format. Example, &#x60;srcClientId&#x60;, &#x60;srcDigitalCardId&#x60;,&#x60;srcCorrelationId&#x60;, &#x60;recipientIdCheckout&#x60;,  &#x60;shippingAddressId&#x60; is not in UUID format.   * Request have &#x60;transactionAmount&#x60; object present but its property &#x60;transactionAmount&#x60; or &#x60;transactionCurrencyCode&#x60; is not present.   * &#x60;srcDigitalCardId&#x60; associated card is in a &#x60;LOCKED&#x60; or &#x60;PENDING_VERIFICATION&#x60; state, or the card itself is not present in the system.   * System was not able to find the consumer associated with a card or the address associated with the addressId provided in request.   * Length of a property exceeds the maximum allowed length. Example, &#x60;srciTransactionId&#x60; parameter length is too long. |  -  |
| **401** | Unauthorized, see error object for details, e.g. authorization token validation failure |  -  |
| **403** | Forbidden. API will return this response if identifier validation fails. |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

