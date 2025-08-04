

# ConfirmationData


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**checkoutEventType** | **String** | Type of event associated with the checkout. Valid values are: - 01 - Authorise - 02 - Capture - 03 - Refund - 04 - Cancel - 05 - Fraud - 06 - Chargeback - 07 - Other |  |
|**checkoutEventStatus** | **String** |  Event type associated with the order. Valid values are: - 01 - Created - 02 - Confirmed - 03 - Cancelled - 04 - Fraud Cancelled - 05 - Others - 06-50 - Reserved for EMVCo future use - 51-99 - Click to Pay System specific statuses |  |
|**confirmationStatus** | **String** | Status of the event as provided by the SRC Initiator in the confirmation message. Valid values are: - 01 - Success - 02 - Failure - 03 - Other |  [optional] |
|**confirmationReason** | **String** | Reason for the event associated with the order. |  [optional] |
|**confirmationTimestamp** | **String** | Date and time (UTC) corresponding to the completion of confirmation event by the SRC Initiator. UTC ISO 8601 |  |
|**networkAuthorizationCode** | **String** | Authorisation code associated with an approved transaction. |  [optional] |
|**networkTransactionIdentifier** | **String** | The unique authorisation related tracing value assigned by a Payment Network and provided in an authorisation response. Required only when checkoutEventType&#x3D;01. If checkoutEventType&#x3D;01 and the value of networkTransactionIdentifier is unknown, please pass UNAVLB. |  [optional] |
|**paymentNetworkReference** | **String** | Transaction ID provided by a Payment Network after the authorisation is complete. |  [optional] |
|**assuranceData** | [**AssuranceData**](AssuranceData.md) |  |  [optional] |
|**transactionAmount** | [**TransactionAmount**](TransactionAmount.md) |  |  [optional] |



