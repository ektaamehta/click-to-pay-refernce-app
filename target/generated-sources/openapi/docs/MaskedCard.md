

# MaskedCard


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**srcDigitalCardId** | **String** | Unique identifier for a PAN or payment token that allows a non-SRC Participating Issuer to identify the PAN.  A single PAN can have one or more SRC digital card reference IDs. |  |
|**srcPaymentCardId** | **String** | A reference representing the PAN that enables the Click to Pay System to communicate with the SRC Participating Issuer without transmitting the actual PAN. It is associated with the SRC Profile to which the payment card belongs and is unique within an Click to Pay System. |  [optional] |
|**panBin** | **String** | BIN number of the PAN. |  |
|**panLastFour** | **String** | The last 4 digits of the PAN. |  |
|**tokenBinRange** | **String** | Specific BIN range or subset of the BIN Range that has been designated only for the purpose of issuing Payment Tokens in an unmasked form |  [optional] |
|**tokenLastFour** | **String** | Last 4 digit of the payment token. |  [optional] |
|**digitalCardData** | [**DigitalCardData**](DigitalCardData.md) |  |  |
|**panExpirationMonth** | **String** | Two-digit expiry month (MM). |  [optional] |
|**panExpirationYear** | **String** | Four-digit expiry year (YYYY). |  [optional] |
|**paymentCardDescriptor** | **String** | Conveys the card brand |  [optional] |
|**paymentCardType** | **PaymentCardType** |  |  [optional] |
|**digitalCardFeatures** | [**List&lt;DigitalCardFeatures&gt;**](DigitalCardFeatures.md) | Card benefits associated with a Digital Card to be presented to the Consumer at the time of checkout. |  [optional] |
|**countryCode** | **String** | Country code associated with the Card Issuer&#39;s BIN license. ISO 3166-1 alpha 2 country code. |  [optional] |
|**maskedBillingAddress** | [**MaskedAddress**](MaskedAddress.md) |  |  [optional] |
|**dcf** | [**DCF**](DCF.md) |  |  [optional] |
|**serviceId** | **String** | Service identifier associated to a specific configuration |  [optional] |
|**dateOfCardCreated** | **String** | Date (in UTC) when card was enrolled into the Click to Pay System. |  |
|**dateOfCardLastUsed** | **String** | Date (in UTC) when card was last used for an SRC transaction. |  [optional] |



