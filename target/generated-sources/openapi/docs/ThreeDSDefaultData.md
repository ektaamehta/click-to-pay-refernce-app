

# ThreeDSDefaultData

Enables a Merchant to supply their existing 3-D Secure (3DS) integration details at the time of Digital Payment Application (DPA) registration.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**defaultAcquirerBin** | **String** | Allows a Merchant to set a default Acquirer. An Acquirer BIN is an identifier assigned by Mastercard to an Acquirer.  If this field is not defined and acquirerData has only one entry, this field will be populated with the value from acquirerBin.  |  [optional] |
|**defaultAcquirerMerchantId** | **String** | An identifier assigned to the Merchant by their Acquirer. If this field is not populated and acquirerData has only one entry, this field will be populated with the value from acquirerMerchantId. |  [optional] |
|**defaultMerchantCountryCode** | **String** | Allows a Merchant to set a default Merchant Country Code (CC).  A Merchant CC is a two-character code indicating the country the Merchant is doing business in.  |  [optional] |
|**defaultMerchantCategoryCode** | **String** | Allows a Merchant to set a default Merchant Category Code (MCC).  An MCC is a four-character code assigned by Mastercard to the Merchant that indicates the type of business, service, or product provided by the Merchant.  Note: MCC&#39;s may be assigned differently across payment networks. To avoid errors, be sure to use your assigned Mastercard MCC. This code is required for 3-D Secure (3DS) and risk profiling. If the Merchant has more than one MCC, the code most relevant to their business should be used.  |  [optional] |



