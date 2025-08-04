

# DpaData

DpaData Object for Integrator to populate Digital Payment Application (DPA) information, including the Merchant name, address, and other relevant data. 

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**dpaPresentationName** | **String** | The name of the Merchant that the Cardholder will see when checking out with the Digital Payment Application (DPA).  Conditional: Required for Guest Checkout Tokenization (GCT) and SQR programs.  |  [optional] |
|**dpaAddress** | [**Address**](Address.md) |  |  [optional] |
|**dpaName** | **String** | Legal name of Merchant (which may differ from dpaPresentationName). Only the special characters defined in the pattern are permitted. |  [optional] |
|**dpaLogoUri** | **String** | URI for the logo displayed to Cardholders during C2P checkout. |  [optional] |
|**dpaUri** | **String** | URI for your merchant&#39;s site for handling all Checkout transactions. |  [optional] |



