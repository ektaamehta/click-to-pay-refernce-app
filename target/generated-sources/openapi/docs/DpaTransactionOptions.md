

# DpaTransactionOptions


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**transactionAmount** | [**TransactionAmount**](TransactionAmount.md) |  |  [optional] |
|**transactionType** | **TransactionType** |  |  [optional] |
|**dpaBillingPreference** | **AddressPreference** |  |  [optional] |
|**dpaAcceptedBillingCountries** | **List&lt;String&gt;** | Merchant accepted billing countries |  [optional] |
|**dpaShippingPreference** | **AddressPreference** |  |  [optional] |
|**dpaAcceptedShippingCountries** | **List&lt;String&gt;** | Merchant accepted shipping countries |  [optional] |
|**consumerEmailAddressRequested** | **Boolean** | Whether DPA wants consumer email ID in the Payload. |  [optional] |
|**consumerNameRequested** | **Boolean** | Whether DPA wants consumer name in the Payload. |  [optional] |
|**consumerPhoneNumberRequested** | **Boolean** | Whether DPA wants consumer phone number in the Payload. |  [optional] |
|**merchantCategoryCode** | **String** | Describes the Merchant&#39;s type of business, product or service. |  [optional] |
|**merchantCountryCode** | **String** | ISO 3166-1 numeric three-digit country code of the merchant. |  [optional] |
|**merchantOrderId** | **String** | DPA generated order/invoice number corresponding to a consumer purchase. Typically used for reconciliation purposes by the merchant. |  [optional] |
|**threeDsPreference** | **ThreeDsPreference** |  |  [optional] |
|**threeDsInputData** | **Object** |  |  [optional] |
|**srcTokenRequestData** | **Object** |  |  [optional] |
|**paymentOptions** | [**List&lt;PaymentOptions&gt;**](PaymentOptions.md) | Specifies the dynamic data requirement for the payload creation. |  [optional] |
|**dpaLocale** | **String** | Merchant&#39;s preferred locale. This can be the same as the locale in the init parameters or can be different. Format: ISO language_country pair (e.g. &#39;en_US&#39;, &#39;fr_CA&#39;). |  [optional] |
|**customInputData** | **Object** |  |  [optional] |
|**orderType** | **String** | Type of the order. |  [optional] |



