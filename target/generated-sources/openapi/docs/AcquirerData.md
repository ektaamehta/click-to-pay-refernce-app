

# AcquirerData

 Object for details about the acquiring institution (for example, merchant bank) or its agent. This includes acquirerIca, acquirerMerchantId and acquirerBin. This object may be used to improve transaction acceptance rates. 

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**acquirerIca** | **String** | An Acquirer Interbank Card Association (ICA) value is an identifier assigned to the Acquirer by Mastercard. |  |
|**acquirerBin** | **String** | Each Acquirer Interbank Card Association (ICA) identifier may be assigned one or more BINs by Mastercard.  Note: It is important to use the correct Acquirer ICA associated with the Acquirer BIN.  |  [optional] |
|**acquirerMerchantId** | **String** | A Merchant Identifier (MID) is a unique code assigned to the Merchant by the Acquirer once the Merchant has successfully opened an account. A MID identifies the Merchant to the Acquirer. |  |



