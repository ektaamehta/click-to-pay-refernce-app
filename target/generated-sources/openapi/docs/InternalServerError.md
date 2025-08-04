

# InternalServerError


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**status** | **Integer** | HTTP response status codes. |  |
|**reason** | [**ReasonEnum**](#ReasonEnum) | Reason for Error. |  |
|**message** | **Object** | Error message details |  |
|**errordetail** | [**List&lt;InternalServerErrorErrordetailInner&gt;**](InternalServerErrorErrordetailInner.md) | List of Errors |  [optional] |



## Enum: ReasonEnum

| Name | Value |
|---- | -----|
| INVALID_ARGUMENT | &quot;INVALID_ARGUMENT&quot; |
| INVALID_STATE | &quot;INVALID_STATE&quot; |
| UNAUTHENTICATED | &quot;UNAUTHENTICATED&quot; |
| PERMISSION_DENIED | &quot;PERMISSION_DENIED&quot; |
| LOCKED | &quot;LOCKED&quot; |
| NOT_FOUND | &quot;NOT_FOUND&quot; |
| ABORTED | &quot;ABORTED&quot; |
| ALREADY_EXISTS | &quot;ALREADY_EXISTS&quot; |
| RESOURCE_EXHAUSTED | &quot;RESOURCE_EXHAUSTED&quot; |
| CANCELLED | &quot;CANCELLED&quot; |
| DATA_LOSS | &quot;DATA_LOSS&quot; |
| INTERNAL | &quot;INTERNAL&quot; |
| NOT_IMPLEMENTED | &quot;NOT_IMPLEMENTED&quot; |
| UNAVAILABLE | &quot;UNAVAILABLE&quot; |
| DEADLINE_EXCEEDED | &quot;DEADLINE_EXCEEDED&quot; |
| CVC_VERIFICATION_REQUIRED | &quot;CVC_VERIFICATION_REQUIRED&quot; |
| COMPLIANCE_REQUIRED | &quot;COMPLIANCE_REQUIRED&quot; |



