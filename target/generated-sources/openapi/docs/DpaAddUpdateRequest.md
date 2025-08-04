

# DpaAddUpdateRequest

The DpaAddUpdateRequest is used to add, update, or delete DPAs from the Mastercard system. Additionally, the DpaAddUpdateRequest can be used to generate serviceIds in Commerce Platform use cases.  A Digital Payment Application (DPA) is a website, web or mobile application operated by a Merchant, marketplace, or other service provider where a consumer can purchase goods or services.  A ServiceId is a unique identifier assigned by Mastercard for which tokens are created uniquely for the entity onboarded. A serviceId can have multiple associated DPAs.  The DpaAddUpdateRequest request must contain the following values:   * items  * action  * programType   The contents of the DPA items will vary based on the operation requested. 

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**requestId** | **String** | This field allows the Integrator to assign an internal reference to a batch request so that it can be used for internal tracking purposes. |  [optional] |
|**items** | [**List&lt;AddUpdateItems&gt;**](AddUpdateItems.md) | Items  Object for Integrator to provide a list of Digital Payment Applications (DPA) to be enrolled in a given program. A minimum of 1 item must be provided in a request.  |  |



