

# DpaResults

Object for individual Digital Payment Application (DPA) item status data.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**srcDpaId** | **String** | The registered identifier for the Digital Payment Application (DPA) accessing the service.  Conditional: Required if you are a Merchant directly integrating with Mastercard Checkout Solutions (MCS) APIs, a Payment Service Provider (PSP) integrating On-Behalf-Of (OBO) a Merchant, a Payment Facilitator, or if you are enrolling in the Secure Card on File (SCOF) QR program.  |  [optional] |
|**status** | [**StatusEnum**](#StatusEnum) | Status of the individual Digital Payment Application (DPA) item. Potential statuses include:  * SUCCESSFUL - The DPA is eligible to process transactions.  * FAILED - The DPA is NOT eligible to process transactions. Please see the error object for more details.\&quot;  |  [optional] |
|**dpaName** | **String** | Legal name of Merchant (which may differ from dpaPresentationName). |  [optional] |
|**error** | [**Error**](Error.md) |  |  [optional] |



## Enum: StatusEnum

| Name | Value |
|---- | -----|
| SUCCESSFUL | &quot;SUCCESSFUL&quot; |
| FAILED | &quot;FAILED&quot; |



