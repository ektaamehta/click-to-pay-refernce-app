

# AssuranceData

Information about any risk assessment functions performed by the Mastercard Click to Pay System.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**verificationType** | **String** | Type of the verification data. Valid value includes   - CARDHOLDER |  [optional] |
|**verificationEntity** | **String** | Entity performing card verification. Valid value includes     - 03 SRCPI |  [optional] |
|**verificationMethod** | **String** | Card Issuer verification of the Cardholder. Valid values are   - 01 - Use of a 3-D Secure ACS    - 04 - A shared secret between the Card Issuer and the Cardholder such as One Time Passcode (OTP), activation code |  [optional] |
|**verificationResults** | **String** | Verification status of a PAN. Valid values are:  - 01 - Verified  - 03 - Not performed  - 04 - Not Required |  [optional] |
|**verificationEvent** | **String** | Indicates the event where verification occurred. Valid value includes  - 02 - Add card/Card enrollment |  [optional] |



