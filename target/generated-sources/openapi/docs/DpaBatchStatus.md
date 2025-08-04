

# DpaBatchStatus

The DpaBatchStatus response contains information related to the status of a submitted Digital Payment Application (DPA) batch.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**requestId** | **String** | This field allows the Integrator to assign an internal reference to a batch request so that it can be used for internal tracking purposes. |  [optional] |
|**batchId** | **String** | A unique identifier associated with the submitted Digital Payment Application (DPA) batch. The Batch ID can be used to retrieve the status of the batch by calling GET DPA status endpoint. |  [optional] |
|**batchStatus** | [**BatchStatusEnum**](#BatchStatusEnum) | Describes the outcome of the submitted Digital Payment Application (DPA) batch. Possible outcomes include:  * COMPLETED_SUCCESSFULLY - Batch was completed successfully and all DPAs included in the batch are ready to transact.  * COMPLETED_WITH_ERRORS - Batch was completed successfully, but some DPAs included in the batch aren&#39;t ready to transact.  * FAILED -  Batch failed to load.  * IN_PROGRESS - Batch processing in progress.  For a full breakdown of all DPA outcomes in a batch, refer to the items.  |  [optional] |
|**batchStartTime** | **String** | Start time of batch request |  [optional] |
|**batchEndTime** | **String** | End time of batch request |  [optional] |
|**errorMessage** | **String** | Provides additional information when batchStatus yields a FAILED status. |  [optional] |
|**items** | [**List&lt;BatchStatusItems&gt;**](BatchStatusItems.md) | An array of status objects that describes the outcome of each Digital Payment Application (DPA) item in a batch request.  Note: DPA item order may differ from original submission.\&quot;  |  [optional] |



## Enum: BatchStatusEnum

| Name | Value |
|---- | -----|
| COMPLETED_SUCCESSFULLY | &quot;COMPLETED_SUCCESSFULLY&quot; |
| COMPLETED_WITH_ERRORS | &quot;COMPLETED_WITH_ERRORS&quot; |
| FAILED | &quot;FAILED&quot; |
| IN_PROGRESS | &quot;IN_PROGRESS&quot; |



