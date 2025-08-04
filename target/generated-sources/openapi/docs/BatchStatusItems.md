

# BatchStatusItems


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**action** | [**ActionEnum**](#ActionEnum) | The action to be performed on the Digital Payment Application (DPA). The selected action will be applied to all DPAs provided in the items list.  __ADD__ - Add DPA  __UPDATE__ - Update DPA  __DELETE__ - Delete DPA  Note: A limited number of DPA fields can be changed using the &#39;UPDATE&#39; action. These are dpaPresentationName, dpaLogoUri, merchantCategoryCode and threeDSDefaultData. Please refer to the example for a minimal use case.  |  [optional] |
|**serviceId** | **String** | A unique identifier assigned by Mastercard for which tokens are created uniquely for the entity onboarded. |  [optional] |
|**trid** | **String** | Token Requestors receive a unique identifier, TRID, which represents the consumer-facing entity name to the Issuer  during the tokenization process. This identifier has a one-to-one relationship with the serviceId. &lt;br&gt; &lt;br&gt; Note: Reach out to your Mastercard representative to begin receiving trid in API responses.  |  [optional] |
|**programName** | **String** | The Cardholder facing name of the Merchant.  Conditional: Must be supplied when adding Merchants to a Payment Facilitator (PF) program.\&quot;  |  [optional] |
|**status** | [**StatusEnum**](#StatusEnum) | Indicates the status of an individual Digital Payment Application (DPA) item in a batch. |  [optional] |
|**error** | [**Error**](Error.md) |  |  [optional] |
|**dpaResults** | [**List&lt;DpaResults&gt;**](DpaResults.md) |  |  [optional] |



## Enum: ActionEnum

| Name | Value |
|---- | -----|
| ADD | &quot;ADD&quot; |
| UPDATE | &quot;UPDATE&quot; |
| DELETE | &quot;DELETE&quot; |



## Enum: StatusEnum

| Name | Value |
|---- | -----|
| SUCCESSFUL | &quot;SUCCESSFUL&quot; |
| FAILED | &quot;FAILED&quot; |



