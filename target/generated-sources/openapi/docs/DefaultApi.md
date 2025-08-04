# DefaultApi

All URIs are relative to *https://sandbox.api.mastercard.com/src/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**postConfirmation**](DefaultApi.md#postConfirmation) | **POST** /confirmations | Send results of payment authorization to Mastercard Checkout Solutions. Not applicable for Secure Card on File or SQR |


<a id="postConfirmation"></a>
# **postConfirmation**
> postConfirmation(confirmationRequest, X_SRC_CX_FLOW_ID)

Send results of payment authorization to Mastercard Checkout Solutions. Not applicable for Secure Card on File or SQR

Use the confirmations endpoint to notify Mastercard Checkout Solutions the outcome of a checkout or payment.  The confirmation data is sent in the request body and normally the response will be 204 (No Content) .  If an error response is returned, the response body will include further information about the reason for the error.

### Example
```java
// Import classes:
import com.mcs.clicktopay.confirmations.invoker.ApiClient;
import com.mcs.clicktopay.confirmations.invoker.ApiException;
import com.mcs.clicktopay.confirmations.invoker.Configuration;
import com.mcs.clicktopay.confirmations.invoker.models.*;
import com.mcs.clicktopay.confirmations.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://sandbox.api.mastercard.com/src/api");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    ConfirmationRequest confirmationRequest = new ConfirmationRequest(); // ConfirmationRequest | Confirmations Request
    String X_SRC_CX_FLOW_ID = "39a9af3f-e27c-49f2-b924-26b74938d013"; // String | The `X-SRC-CX-FLOW-ID` ensures to direct all calls from the same client to the same server and maintains session affinity. For the first API request, add the value of `srcCorrelationId` in  X-SRC-CX-FLOW-ID field. For subsequent requests, use the  X-SRC-CX-FLOW-ID returned in the response for the initial API call.
    try {
      apiInstance.postConfirmation(confirmationRequest, X_SRC_CX_FLOW_ID);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#postConfirmation");
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
| **confirmationRequest** | [**ConfirmationRequest**](ConfirmationRequest.md)| Confirmations Request | |
| **X_SRC_CX_FLOW_ID** | **String**| The &#x60;X-SRC-CX-FLOW-ID&#x60; ensures to direct all calls from the same client to the same server and maintains session affinity. For the first API request, add the value of &#x60;srcCorrelationId&#x60; in  X-SRC-CX-FLOW-ID field. For subsequent requests, use the  X-SRC-CX-FLOW-ID returned in the response for the initial API call. | [optional] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No content.The confirmation message was accepted. |  * X-SRC-CX-FLOW-ID - The &#x60;X-SRC-CX-FLOW-ID&#x60; ensures to direct all calls from the same client to the same server and maintains session affinity. For the first API request, add the value of &#x60;srcCorrelationId&#x60; in  X-SRC-CX-FLOW-ID field. For subsequent requests, use the  X-SRC-CX-FLOW-ID returned in the response for the initial API call. <br>  |
| **400** | Bad Request. For example, an incorrect correlation id value may have been used in the request. See status enum and message string within the error object for details.  |  -  |
| **403** | Forbidden. See status enum and message string within the error object for details, e.g., client identity (origin) not validated, or there may be a mismatch between client and correlation ids. In some cases an array of further details may be returned.  |  -  |
| **500** | Internal Server Error. See status enum and message string within the error object for details. In some cases an array of further details may be returned.  |  -  |

