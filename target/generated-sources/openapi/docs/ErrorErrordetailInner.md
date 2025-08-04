

# ErrorErrordetailInner


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**reason** | [**ReasonEnum**](#ReasonEnum) | Reason for Error. |  |
|**message** | **String** |  |  [optional] |
|**sourceType** | [**SourceTypeEnum**](#SourceTypeEnum) | Source of error. |  [optional] |
|**source** | **String** | Error source |  [optional] |



## Enum: ReasonEnum

| Name | Value |
|---- | -----|
| CANNOT_BE_NULL | &quot;CANNOT_BE_NULL&quot; |
| INVALID_VALUE | &quot;INVALID_VALUE&quot; |
| INVALID_FORMAT | &quot;INVALID_FORMAT&quot; |
| ALREADY_EXISTS | &quot;ALREADY_EXISTS&quot; |
| INVALID_STATE | &quot;INVALID_STATE&quot; |
| CORRUPT_DATA | &quot;CORRUPT_DATA&quot; |



## Enum: SourceTypeEnum

| Name | Value |
|---- | -----|
| BODY | &quot;BODY&quot; |
| HEADER | &quot;HEADER&quot; |
| QUERY | &quot;QUERY&quot; |
| PATH | &quot;PATH&quot; |



