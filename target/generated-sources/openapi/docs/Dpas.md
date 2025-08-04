

# Dpas


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**srcDpaId** | **String** |  The registered identifier for the Digital Payment Application (DPA) accessing the service. At least one DPA needs to be registered for each Merchant/Merchant OBO/Sub-Merchant (PF) needed, with additional DPAs being added as required.  Conditional: Required if you are a Merchant directly integrating with Mastercard Checkout Solutions (MCS) APIs, a Payment Service Provider (PSP) integrating On-Behalf-Of (OBO) a Merchant, a Payment Facilitator, or if you are enrolling in the Secure Card on File (SCOF) QR program.  |  |
|**hasAcquirerRelationship** | [**HasAcquirerRelationshipEnum**](#HasAcquirerRelationshipEnum) | Indicates if the Digital Payment Application (DPA) has an Acquirer relationship. This field may be used to improve acceptance rates. |  [optional] |
|**subMerchantId** | **String** | Identifier assigned to a Sub-Merchant by the Payment Facilitator (PF). This field may be used to improve transaction security and acceptance rates. |  [optional] |
|**paymentFacilitatorId** | **String** | Payment Facilitator (PF) identifier that may be used to improve transaction security and acceptance rates. |  [optional] |
|**dpaData** | [**DpaData**](DpaData.md) |  |  [optional] |
|**debitTokenRequested** | **Boolean** | **Deprecated** A flag for the Integrator to indicate that they would not like to have their Cardholder&#39;s debit cards tokenized.  |  [optional] |
|**merchantCategoryCodes** | **List&lt;String&gt;** | Object for the array of Merchant Category Codes (MCC) that the Merchant processes transactions under, and is used for risk-scoring transactions by the issuer. All MCC codes that will be processed by a DPA should be provided here (typically, this will be a single item).  An MCC is a four-character code assigned by Mastercard to the Merchant that indicates the type of business, service, or product provided by the Merchant.  Note: MCC&#39;s may be assigned differently across payment networks. To avoid errors, be sure to use your assigned Mastercard MCC. This code is required for 3-D Secure (3DS) and risk profiling. If the Merchant has more than one MCC, the code most relevant to their business should be used.  |  [optional] |
|**threeDSDefaultdata** | [**ThreeDSDefaultData**](ThreeDSDefaultData.md) |  |  [optional] |
|**acquirerData** | [**List&lt;AcquirerData&gt;**](AcquirerData.md) |  |  [optional] |



## Enum: HasAcquirerRelationshipEnum

| Name | Value |
|---- | -----|
| Y | &quot;Y&quot; |
| N | &quot;N&quot; |



