# MerchantRegistrationApi

All URIs are relative to *https://sandbox.api.mastercard.com/src/onboarding*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**bulkAddUpdateDpa**](MerchantRegistrationApi.md#bulkAddUpdateDpa) | **POST** /srci/{src-client-id}/dpas/batch | Asynchronous - DPA bulk Add/Update/Delete |
| [**getDpaBatchStatus**](MerchantRegistrationApi.md#getDpaBatchStatus) | **GET** /srci/{src-client-id}/dpas/batch/status/{batch-id} | Get status of the DPA Add/Update async (batch) job by Batch ID. |


<a id="bulkAddUpdateDpa"></a>
# **bulkAddUpdateDpa**
> DpaAddUpdateResponse bulkAddUpdateDpa(correlationId, srcClientId, dpaAddUpdateRequest)

Asynchronous - DPA bulk Add/Update/Delete

This is a composite API and performs the following functions in a single call.   * ADD -- Add the DPA record.  * UPDATE -- Update the DPA record.  * DELETE --Delete the DPA record   Additionally, this request can be used to generate serviceIds in Commerce Platform use cases.   A Digital Payment Application (DPA) is a website, web or mobile application operated by a Merchant, marketplace, or other service provider where a consumer can purchase goods or services.   A ServiceId is a unique identifier assigned by Mastercard for which tokens are created uniquely for the entity onboarded. A serviceId can have multiple associated DPAs.   This request must contain the following values, for detail please refer to the Body Model description::     * items    * action    * programType   The contents of the DPA items will vary based on the operation requested.   Note:  * For UPDATE operations, only DPA data are updated. Once registered, a DPA cannot be associated with a new serviceId or programType. A new DPA will need to be ADDed for each programType/serviceId.  * It is recommended to provide **either** ADD **or** UPDATE across different items within the same batch of DPA Registration API 

### Example
```java
// Import classes:
import com.mcs.clicktopay.merchantregistration.invoker.ApiClient;
import com.mcs.clicktopay.merchantregistration.invoker.ApiException;
import com.mcs.clicktopay.merchantregistration.invoker.Configuration;
import com.mcs.clicktopay.merchantregistration.invoker.models.*;
import com.mcs.clicktopay.merchantregistration.api.MerchantRegistrationApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://sandbox.api.mastercard.com/src/onboarding");

    MerchantRegistrationApi apiInstance = new MerchantRegistrationApi(defaultClient);
    String correlationId = "0000016e0364631b-e4cefc"; // String | A unique identifier that correlates a series of two or more requests to a single session of activity. Mastercard Checkout Solutions (MCS) will return a new srcCorrelationId in each response by default, but Integrators may choose to populate previously used srcCorrelationIds in subsequent requests to correlate their activity under a single ID. This can be done by providing a Mastercard generated srcCorrelationId in the request, or by generating your own ID in the same format. SrcCorrelationId is used for tracking and troubleshooting purposes within Mastercard's ecosystem.
    String srcClientId = "5e0d4b84-189d-4c86-822d-590602f62062"; // String | A unique identifier assigned by Mastercard during onboarding which signifies the responsible party Integrating to Mastercard Checkout Solutions (MCS).
    DpaAddUpdateRequest dpaAddUpdateRequest = new DpaAddUpdateRequest(); // DpaAddUpdateRequest | DPA asynchronous/bulk Registration Request
    try {
      DpaAddUpdateResponse result = apiInstance.bulkAddUpdateDpa(correlationId, srcClientId, dpaAddUpdateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling MerchantRegistrationApi#bulkAddUpdateDpa");
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
| **correlationId** | **String**| A unique identifier that correlates a series of two or more requests to a single session of activity. Mastercard Checkout Solutions (MCS) will return a new srcCorrelationId in each response by default, but Integrators may choose to populate previously used srcCorrelationIds in subsequent requests to correlate their activity under a single ID. This can be done by providing a Mastercard generated srcCorrelationId in the request, or by generating your own ID in the same format. SrcCorrelationId is used for tracking and troubleshooting purposes within Mastercard&#39;s ecosystem. | |
| **srcClientId** | **String**| A unique identifier assigned by Mastercard during onboarding which signifies the responsible party Integrating to Mastercard Checkout Solutions (MCS). | |
| **dpaAddUpdateRequest** | [**DpaAddUpdateRequest**](DpaAddUpdateRequest.md)| DPA asynchronous/bulk Registration Request | |

### Return type

[**DpaAddUpdateResponse**](DpaAddUpdateResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad request, see error object for details |  -  |
| **401** | Unauthorized, see error object for details, e.g. authorization token validation failure |  -  |
| **403** | Forbidden, see error object for details, e.g. client identity (origin) not validated |  -  |
| **500** | Internal server error, see error object for details  |  -  |

<a id="getDpaBatchStatus"></a>
# **getDpaBatchStatus**
> DpaBatchStatus getDpaBatchStatus(correlationId, srcClientId, batchId)

Get status of the DPA Add/Update async (batch) job by Batch ID.

The GET Status API allows the SRC Initiator to retrieve the status of a DPA Registration request submitted earlier.

### Example
```java
// Import classes:
import com.mcs.clicktopay.merchantregistration.invoker.ApiClient;
import com.mcs.clicktopay.merchantregistration.invoker.ApiException;
import com.mcs.clicktopay.merchantregistration.invoker.Configuration;
import com.mcs.clicktopay.merchantregistration.invoker.models.*;
import com.mcs.clicktopay.merchantregistration.api.MerchantRegistrationApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("https://sandbox.api.mastercard.com/src/onboarding");

    MerchantRegistrationApi apiInstance = new MerchantRegistrationApi(defaultClient);
    String correlationId = "0000016e0364631b-e4cefc"; // String | A unique identifier that correlates a series of two or more requests to a single session of activity. Mastercard Checkout Solutions (MCS) will return a new srcCorrelationId in each response by default, but Integrators may choose to populate previously used srcCorrelationIds in subsequent requests to correlate their activity under a single ID. This can be done by providing a Mastercard generated srcCorrelationId in the request, or by generating your own ID in the same format. SrcCorrelationId is used for tracking and troubleshooting purposes within Mastercard's ecosystem.
    String srcClientId = "5e0d4b84-189d-4c86-822d-590602f62062"; // String | A unique identifier assigned by Mastercard during onboarding which signifies the responsible party Integrating to Mastercard Checkout Solutions (MCS).
    String batchId = "1c9d3e43-f232-44a1-9552-7da22aaf5590"; // String | A unique identifier associated with the submitted Digital Payment Application (DPA) batch. The Batch ID can be used to retrieve the status of the batch by calling GET DPA status endpoint.
    try {
      DpaBatchStatus result = apiInstance.getDpaBatchStatus(correlationId, srcClientId, batchId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling MerchantRegistrationApi#getDpaBatchStatus");
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
| **correlationId** | **String**| A unique identifier that correlates a series of two or more requests to a single session of activity. Mastercard Checkout Solutions (MCS) will return a new srcCorrelationId in each response by default, but Integrators may choose to populate previously used srcCorrelationIds in subsequent requests to correlate their activity under a single ID. This can be done by providing a Mastercard generated srcCorrelationId in the request, or by generating your own ID in the same format. SrcCorrelationId is used for tracking and troubleshooting purposes within Mastercard&#39;s ecosystem. | |
| **srcClientId** | **String**| A unique identifier assigned by Mastercard during onboarding which signifies the responsible party Integrating to Mastercard Checkout Solutions (MCS). | |
| **batchId** | **String**| A unique identifier associated with the submitted Digital Payment Application (DPA) batch. The Batch ID can be used to retrieve the status of the batch by calling GET DPA status endpoint. | |

### Return type

[**DpaBatchStatus**](DpaBatchStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK. |  -  |
| **400** | Bad request, see error object for details |  -  |
| **401** | Unauthorized, see error object for details, e.g. authorization token validation failure |  -  |
| **403** | Forbidden, see error object for details, e.g. client identity (origin) not validated |  -  |
| **404** | Not found, see error object for details.  |  -  |
| **500** | Internal server error, see error object for details  |  -  |

