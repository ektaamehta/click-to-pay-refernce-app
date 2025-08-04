

# VerificationData

Object for verification related information generated during authentication, depending on the type of verification.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**verificationType** | **VerificationType** |  |  |
|**verificationEntity** | **String** | &lt;p&gt;Entity performing or initiating Cardholder authentication (e.g., Mastercard Checkout Solutions (MCS) System &#x3D; \&quot;02\&quot;).&lt;/p&gt; &lt;p&gt;Valid values are:&lt;/p&gt; &lt;ul&gt;   &lt;li&gt;\&quot;01\&quot; - Integrator&lt;/li&gt;   &lt;li&gt;\&quot;02\&quot; - Mastercard Checkout Solutions (MCS)&lt;/li&gt;   &lt;li&gt;\&quot;03\&quot; - Participating Issuer&lt;/li&gt;   &lt;li&gt;\&quot;06\&quot; -&gt; \&quot;99\&quot; - Others&lt;/li&gt; &lt;ul&gt; |  |
|**verificationMethod** | **String** | &lt;p&gt;Cardholder verification method. Supported values are as follows:&lt;/p&gt;   &lt;ul&gt;     &lt;li&gt;\&quot;01\&quot; - 3D Secure (3DS)&lt;/li&gt;     &lt;li&gt;\&quot;04\&quot; - A shared secret between the Card Issuer and the Cardholder such as One Time Passcode (OTP), activation code&lt;/li&gt;     &lt;li&gt;\&quot;07\&quot; - FIDO2 authentication&lt;/li&gt;     &lt;li&gt;\&quot;24\&quot; - Mastercard authentication with device binding and passive authentication&lt;/li&gt;   &lt;ul&gt; |  |
|**verificationResults** | **String** | &lt;p&gt;Indicates whether the Cardholder was verified or not, and what the results are when verified. Results can be:&lt;/p&gt; &lt;ul&gt;   &lt;li&gt;\&quot;01\&quot; - Verified&lt;/li&gt;   &lt;li&gt;\&quot;02\&quot; - Not Verified&lt;/li&gt;   &lt;li&gt;\&quot;03\&quot; - Not Performed&lt;/li&gt;   &lt;li&gt;\&quot;04\&quot; - Not Required&lt;/li&gt; &lt;ul&gt; |  |
|**verificationEvents** | **List&lt;String&gt;** | &lt;p&gt;Event that prompted the Cardholder authentication (e.g., Payment Transaction &#x3D; \&quot;01\&quot;).&lt;/p&gt; &lt;p&gt;For verificationType CARDHOLDER, valid values are:&lt;/p&gt; &lt;ul&gt;   &lt;li&gt;\&quot;01\&quot; - Payment Transaction&lt;/li&gt;   &lt;li&gt;\&quot;02\&quot; - Add Card/Card Enrollment&lt;/li&gt; &lt;ul&gt; |  [optional] |



