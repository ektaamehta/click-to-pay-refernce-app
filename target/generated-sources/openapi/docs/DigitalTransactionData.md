

# DigitalTransactionData

Object will be used to help issuers with their risk decisioning or dispute resolution. The provisioning of data is subject to compliance with all applicable laws and regulations.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**phoneNumber** | [**PhoneNumber**](PhoneNumber.md) |  |  [optional] |
|**emailAddressFormat** | **Integer** | This parameter indicates if an email address is clear or hashed email address collected during checkout. Required when the email address is provided. Possible values are: &#39;0&#39; - Clear / Plain email address &#39;1&#39; - Hashed email address |  [optional] |
|**emailAddress** | **String** | CardHolder&#39;s email Address. In case of hashed email address use SHA256 Algorithm. Refer to Appendix B TAF Program Guide for more details. Conditional : Required for Token Authentication Framework. Mandatory if no phone number is provided. |  [optional] |
|**deviceLocation** | **String** | This field should contain the latitude and longitude coordinates of the device where consumer is attempting to checkout. It&#39;s formatted as first 8 digits are latitude &amp; longitude hexadecimal encoded degree with two decimal places and last digit is latitude &amp; longitude sector value from one of the values (1:NW 2:NE 3SW 4SE). Conditional : Required for Token Authentication Framework unless the consumer has declined to share his/her location. |  [optional] |
|**ipAddress** | **String** | Unique string of characters that identifies a device. Support V4 or V6 Conditional : Required for Token Authentication Framework |  [optional] |



