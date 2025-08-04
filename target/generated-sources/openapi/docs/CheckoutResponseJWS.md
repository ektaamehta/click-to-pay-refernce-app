

# CheckoutResponseJWS

It is a JWS signed by Mastercard Click to Pay so that the SRCI's backend can validate the integrity of the data in the checkout response.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**joseHeader** | [**JoseHeader**](JoseHeader.md) |  |  |
|**jwsPayload** | [**CheckoutResponsePayload**](CheckoutResponsePayload.md) |  |  |
|**jwsSignature** | **String** | JSON Web Signature |  |



