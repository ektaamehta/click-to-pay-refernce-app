

# Payload

JWE[Payload] that contains payment and/or consumer data. The payload data object returned via the encryptedPayload string in the POST /transactionCredentials response. Once decrypted the data will consist of a JSON document with relevant payment and consumer data.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**card** | [**Card**](Card.md) |  |  [optional] |
|**token** | [**PaymentToken**](PaymentToken.md) |  |  [optional] |
|**shippingAddress** | [**Address**](Address.md) |  |  [optional] |
|**consumerEmailAddress** | **String** | Consumer-provided email address. |  [optional] |
|**consumerFirstName** | **String** | Consumer-provided first name. |  [optional] |
|**consumerLastName** | **String** | Consumer-provided last name. |  [optional] |
|**consumerFullName** | **String** | Consumer-provided full name. |  [optional] |
|**consumerMobileNumber** | [**PhoneNumber**](PhoneNumber.md) |  |  [optional] |
|**srcTokenResultsData** | [**SrcTokenResultsDataObject**](SrcTokenResultsDataObject.md) |  |  [optional] |
|**dynamicData** | [**DynamicData**](DynamicData.md) |  |  [optional] |
|**billingAddress** | [**Address**](Address.md) |  |  [optional] |



