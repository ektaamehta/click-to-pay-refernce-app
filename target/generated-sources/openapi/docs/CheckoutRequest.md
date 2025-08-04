

# CheckoutRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**srcClientId** | **String** | Identifies the connecting client, e.g. SRCI |  |
|**srcDpaId** | **String** | DPA Identifier provided during onboarding. Registered identifier for the DPA accessing the service. Must be provided except when the calling client is an SRC-PI |  |
|**srcCorrelationId** | **String** | Correlation ID for this transaction. If available within the present checkout session (e.g. received in an earlier API response during the present session), then it must be provided, otherwise a new checkout session will be initiated. |  [optional] |
|**srcDigitalCardId** | **String** | Unique Identifier of the Card. Reference representing the PAN or Payment Token that enables a non-SRCPI entity to identify the underlying PAN. A single PAN can have one or more SRC Digital Card Reference Identifiers. Digital Card information can be accompanied with SRC Digital Card Reference Identifier. It is associated with the SRC Profile to which the Digital Card belongs and is unique within an Click to Pay System |  |



