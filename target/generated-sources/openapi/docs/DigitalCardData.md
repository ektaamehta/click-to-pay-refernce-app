

# DigitalCardData

Digital card data contains digital card information to provide reference to the actual PAN or Payment Token without actually disclosing either. Digital card data is grouped based on the following: -  PAN Authorisation Digital Card Information - data used in request and response Messages -  UI/UX Presentation Data - data used in user interfaces to provide the user with a recognisable descriptor -  Digital Card Art - image that accompanies Digital Card information for user interface purposes.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**status** | **DigitalCardStatus** |  |  [optional] |
|**presentationName** | **String** | Presentation text created by the consumer to easily recognise a PAN entered into the DCF. This value is unique to DCF. |  [optional] |
|**descriptorName** | **String** | Presentation text created by SRC program to describe the PAN as a digital card. The descriptor name is the same across all DCFs. |  [optional] |
|**artUri** | **String** | URI that houses the Card Art image to be used for presentation purposes. Can be provided by SRCPI. |  [optional] |
|**artHeight** | **Integer** | Height of the card art in pixels. |  [optional] |
|**artWidth** | **Integer** | Width of the card art in pixels. |  [optional] |
|**pendingEvents** | **List&lt;CardPendingEvent&gt;** | Set of events that are pending completion such as address verification or SCA. |  [optional] |



