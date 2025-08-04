function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
    return uuid;
}

function getPublicKeys() {
    $.getJSON(this.sandboxPublicKey, function (data) {
        encParams.keys = data.keys;
    });
}

var callNodeJsAPIUrl = "";
var nodeJSSBSAPIUrl = "";
var nodeJSAuthAPIUrl = "";
var nodeJSStatsAPIUrl = "";
var callAPIUrl = "";
var sandboxTransactionCredentailAPIEndPoint = "";
var sandboxTransactionConfirmationAPIEndPoint = "";
var sandboxPublicKey = "";
var decryptUrl = "";
var host = "";
var transactionCredentialsRelativeURL = "";
var transactionConfirmationRelativeURL = "";
var crypt = new Crypt({ md: "sha256" });
var myCustomJSON = "";

function getConfig() {
    $.getJSON("/assets/js/config.json", function (data) {
        callAPIUrl = data.callAPIUrl;
        sandboxTransactionCredentailAPIEndPoint =
            data.sandboxTransactionCredentailAPIEndPoint;
        sandboxTransactionConfirmationAPIEndPoint =
            data.sandboxTransactionConfirmationAPIEndPoint;
        sandboxPublicKey = data.sandboxPublicKey;
        decryptUrl = data.decryptUrl;
        host = data.sandboxhost;
        transactionCredentialsRelativeURL =
            data.transactionCredentialsRelativeURL;
        transactionConfirmationRelativeURL =
            data.transactionConfirmationRelativeURL;
        callNodeJsAPIUrl = data.callNodeJsAPIUrl;
        nodeJSSBSAPIUrl = data.nodeJSSBSAPIUrl;
        nodeJSAuthAPIUrl = data.nodeJSAuthAPIUrl;
        nodeJSStatsAPIUrl = data.nodeJSStatsAPIUrl;
        getPublicKeys();
        stats("LOAD");
    }).fail(function () {
        console.log("An error has occurred.");
    });
}

const encParams = {
    encContentAlgo: "A128GCM",
    encAlgo: "RSA-OAEP-256",
    encKeyId: "src-fpan-encryption",
    verKeyId: "src-payload-verification",
    verAlgo: "RS256",
    keys: "",
};

function CallLog(text) {
    //log.textContent += text + "___________________________________________________________________\n";
    //log.scrollTop = log.scrollHeight;
    log.textContent =
        text +
        "___________________________________________________________________\n" +
        log.textContent;
}

function CallLogWithoutLine(text) {
    log.textContent = text + log.textContent;
}

function init() {
    stats("INIT");

    if ($("input[name='authenticationType']").is(":checked")) {
        // authenticationPreferences.authenticationMethods = "3DS";
        var authenticationPreferences = {
            payloadRequested: "AUTHENTICATED", //required for Use case 1 & 2
            //"authenticationMethods": null, //required only for Use case 2
            //"suppressChallenge": false
        };
    }

    if ($("input[name='tasAuth']").is(":checked")) {
        var tafParams = {
            acquirerMerchantId: "SRC3DS",
            acquirerBIN: "545301",
            merchantCategoryCode: "5995",
            merchantCountryCode: "US",
            authenticationPreferences: {
                payloadRequested: "AUTHENTICATED", // Add taf-specific authentication preferences
            },
        };
    }

    console.log("authenticationPreferences", authenticationPreferences);

    var dpaTransactionOptions = {
        transactionAmount: {
            transactionAmount: $("#txnAmount").val(),
            transactionCurrencyCode: $("#txnCurrency").val(),
        },
        transactionType: "PURCHASE",
        dpaBillingPreference: allowBilling == true ? "FULL" : "NONE",
        dpaShippingPreference: allowShipping == true ? "FULL" : "NONE",
        customInputData: {
            "com.mastercard.dcfExperience": "WITHIN_CHECKOUT",
        },
        consumerNationalIdentifierRequested: false,
        dpaAcceptedBillingCountries: [],
        dpaAcceptedShippingCountries: [],
        dpaLocale: $("#dpalocale").val(),
        consumerEmailAddressRequested: true,
        consumerNameRequested: true,
        consumerPhoneNumberRequested: true,
        confirmPayment: confPayment,
        payloadTypeIndicatorCheckout: $(
            "input[name='IndicatorCheckout']:checked"
        ).val(),
        //payloadTypeIndicatorPayload: "PAYMENT",
        paymentOptions: {
            dpaDynamicDataTtlMinutes: 15,
            //dpaPanRequested: false,
            dynamicDataType: $("input[name='cryptogram']:checked").val(), //"CARD_APPLICATION_CRYPTOGRAM_LONG_FORM"
        },
        ...tafParams, // injects only if checked
    };

    console.log("dpaTransactionOptions", dpaTransactionOptions);
    console.log("authenticationType", authenticationType);

    if (authenticationType) {
        dpaTransactionOptions = {
            ...dpaTransactionOptions,
            //"acquirerId": "550e8400", //required for Use case 1 & 2
            acquirerBin: "545301", //required for Use case 1 & 2
            merchantCategoryCode: "5995", //required for Use case 1 & 2
            merchantCountryCode: "US", //required for Use case 1 & 2
            acquirerMerchantId: "SRC3DS",
            authenticationPreferences: authenticationPreferences,
            //"threeDsInputData": {
            //	 "forceChallenge": false,
            //	 "billingAddress": {
            //			"name": "John Doe",
            //			"line1": "Paseo Castellana 259C",
            //			"line2": "Torre de Cristal",
            //			"city": "Madrid",
            //			"state": "CT",
            //			"zip": "28049",
            //			"countryCode": "US"
            //		 }
            //	  }
        };
    }

    var sampleInitParams = {
        srcInitiatorId: $("#clientid").val(), // required
        srciDpaId: $("#dpaid").val(), // required
        srciTransactionId: $("#transactionid").val(), // required
        dpaTransactionOptions: dpaTransactionOptions, // required
        dpaData: {
            dpaPresentationName: "Moovetshop",
            dpaUri: "https://mtf.moovetshop.com",
            dpaName: "Moovetshop",
        },
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog("\n Init - Success \n");
        if (payload != undefined)
            CallLog(
                "\n Response : \n" +
                    JSON.stringify(payload, undefined, 4) +
                    "\n"
            );
    }
    function promiseRejectedHandler(payload) {
        CallLog("\n Init - Rejected \n");
        if (payload != undefined)
            CallLog(
                "\n Response : \n" +
                    JSON.stringify(payload, undefined, 4) +
                    "\n"
            );
    }
    CallLog("\n Init - Request Payload \n");
    if (myCustomJSON != "") {
        sampleInitParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog("\n" + JSON.stringify(sampleInitParams, undefined, 4) + "\n");
    const initPromise = window.SRCSDK_MASTERCARD.init(sampleInitParams); //  returns a promise
    initPromise
        .then(promiseResolvedHandler) // No other SDK methods should be invoked until `init` resolves
        .catch(promiseRejectedHandler);
}

function isRecognized() {
    stats("IS RECOGNIZED");
    // Define response handlers
    function promiseResolvedHandler(payload) {
        CallLog(
            "\n isRecognized - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        recognized = payload.recognized;
        if (typeof Storage !== "undefined") {
            window.localStorage.setItem(
                "recognizedUsers",
                JSON.stringify(payload)
            );
            //$.cookie("recognizedUsers", JSON.stringify(payload),{ expires : 365 });
        }
    }
    function promiseRejectedHandler(payload) {
        CallLog(
            "\n isRecognized - Rejected\n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    const isRecognizedPromise = window.SRCSDK_MASTERCARD.isRecognized(); //  returns a promise
    isRecognizedPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function GetSRCProfile() {
    stats("GET SRC PROFILE");
    var recognizedUsers = JSON.parse(
        window.localStorage.getItem("recognizedUsers")
    );
    //var recognizedUsers = JSON.parse($.cookie("recognizedUsers"));
    var sampleGetSrcProfileParams = { idTokens: recognizedUsers.idTokens };
    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog(
            "\n GetSRC Profile - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        if (payload.profiles[0].maskedCards.length > 0) {
            // $("#deleteCard").show();
            if (recognized) {
                $("#notYourCards").show();
            } else {
                $("#notYourCards").hide();
            }
        } else {
            $("#notYourCards").hide();
            $("#deleteCard").hide();
        }
        $("#cards")
            .find("option")
            .remove()
            .end()
            .append('<option value="">Select</option>')
            .val("");
        $.each(payload.profiles[0].maskedCards, function (index, jsonObject) {
            var text =
                jsonObject["digitalCardData"].descriptorName +
                " - " +
                jsonObject["panLastFour"];
            var value = jsonObject["srcDigitalCardId"];
            var o = new Option(text, value);
            $("#cards").append(o);
            console.log(text);
        });
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n GetSRC Profile - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    CallLog("\n GetSRCProfile - Request Payload \n");
    if (myCustomJSON != "") {
        sampleGetSrcProfileParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog(
        "\n" + JSON.stringify(sampleGetSrcProfileParams, undefined, 4) + "\n"
    );

    const getSrcProfilePromise = window.SRCSDK_MASTERCARD.getSrcProfile(
        sampleGetSrcProfileParams
    ); //  returns a promise
    getSrcProfilePromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function IdentityLookup() {
    stats("IDENTITY LOOKUP");
    var sampleIdentityLookupParams = {
        consumerIdentity: {
            identityType: "EMAIL_ADDRESS",
            identityValue: $("#email").val(),
        },
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        CallLog(
            "\n IdentityLookup - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        if (payload.consumerPresent) {
            showTab1("iiV", "initiateValidation");
        }
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n IdentityLookup - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }
    CallLog("\n IdentityLookup - Request Payload \n");
    if (myCustomJSON != "") {
        sampleIdentityLookupParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog(
        "\n" + JSON.stringify(sampleIdentityLookupParams, undefined, 4) + "\n"
    );

    const identityLookupPromise = window.SRCSDK_MASTERCARD.identityLookup(
        sampleIdentityLookupParams
    ); //  returns a promise
    identityLookupPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function InitiateIdentityValidation() {
    stats("INITIATE IDENTITY VALIDATION");
    const sampleInitiateIdentityValidationParamsEmail = {
        requestedValidationChannelId: "EMAIL_ADDRESS",
    };

    const sampleInitiateIdentityValidationParamsPhone = {
        requestedValidationChannelId: "MOBILE_PHONE_NUMBER",
    };

    var validationChanel = "email";
    var validationChanel = $("input[name='identityV']:checked").val();
    var sampleInitiateIdentityValidationParams =
        validationChanel == "email"
            ? sampleInitiateIdentityValidationParamsEmail
            : sampleInitiateIdentityValidationParamsPhone;
    console.log(sampleInitiateIdentityValidationParams);
    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog(
            "\n InitiateIdentityValidation - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        showTab1("vOTP", "validateOTP");
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n InitiateIdentityValidation - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    CallLog("\n InitiateIdentityValidation - Request Payload \n");
    if (myCustomJSON != "") {
        sampleInitiateIdentityValidationParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog(
        "\n" +
            JSON.stringify(
                sampleInitiateIdentityValidationParams,
                undefined,
                4
            ) +
            "\n"
    );

    const initiateIdentityValidationPromise =
        window.SRCSDK_MASTERCARD.initiateIdentityValidation(
            sampleInitiateIdentityValidationParams
        ); //  returns a promise
    initiateIdentityValidationPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function CompleteIdentityValidation() {
    stats("COMPLETE IDENTITY VALIDATION");
    var sampleCompleteIdentityValidationParams = {
        validationData: $("#otp").val(), // required, OTP value entered by the user.
    };

    if (suppressDCF && rememberMe) {
        sampleCompleteIdentityValidationParams = {
            ...sampleCompleteIdentityValidationParams,
            complianceSettings: {
                complianceResources: [
                    {
                        complianceType: "REMEMBER_ME",
                        uri: $(location).attr("href"),
                        version: "LATEST",
                        datePublished: new Date().getTime() / 1000,
                    },
                ],
            },
        };
    }

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        if (typeof Storage !== "undefined") {
            var data = { idTokens: [payload.idToken] };
            window.localStorage.setItem(
                "recognizedUsers",
                JSON.stringify(data)
            );
            //$.cookie("recognizedUsers", JSON.stringify(data),{ expires : 365 });
        }
        CallLog(
            "\n CompleteIdentityValidation - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n CompleteIdentityValidation - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    CallLog("\n CompleteIdentityValidation - Request Payload \n");
    if (myCustomJSON != "") {
        sampleCompleteIdentityValidationParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog(
        "\n" +
            JSON.stringify(
                sampleCompleteIdentityValidationParams,
                undefined,
                4
            ) +
            "\n"
    );

    const completeIdentityValidationPromise =
        window.SRCSDK_MASTERCARD.completeIdentityValidation(
            sampleCompleteIdentityValidationParams
        ); //  returns a promise
    completeIdentityValidationPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function EncryptCard(type) {
    var plantextData = "";

    if (type == "old") {
        var oldcardnumber = $("#oldcardnumber").val().replace(/ /g, "");
        var oldcvvnumber = $("#oldcvvnumber").val();
        //var oldexpiryyear = $('#oldexpiryyear').val();
        //var oldexpirymonth = $('#oldexpirymonth').val();
        var oldinputExpDate = $("#oldinputExpDate").val();
        var oldcardholdername = $("#oldcardholdername").val();
        var billingAddName = $("#billingAddName").val();
        var billingAddLine1 = $("#billingAddLine1").val();
        var billingAddLine2 = $("#billingAddLine2").val();
        var billingAddLine3 = $("#billingAddLine3").val();
        var billingAddCity = $("#billingAddCity").val();
        var billingAddState = $("#billingAddState").val();
        var billingAddZip = $("#billingAddZip").val();
        var billingCountryCode = $("#billingCountryCode").val();
        var oldexpirymonth = oldinputExpDate.split("/")[0].trim();
        var oldexpiryyear = oldinputExpDate.split("/")[1].trim();

        if (oldcardholdername != "") {
            if (
                billingAddName == "" ||
                billingAddLine1 == "" ||
                billingAddCity == "" ||
                billingCountryCode == ""
            ) {
                plaintext.textContent =
                    '{"primaryAccountNumber": "' +
                    oldcardnumber +
                    '", "panExpirationMonth": "' +
                    oldexpirymonth +
                    '", "panExpirationYear": "' +
                    oldexpiryyear +
                    '", "cardSecurityCode": "' +
                    oldcvvnumber +
                    '", "cardholderFullName": "' +
                    oldcardholdername +
                    '"}';
            } else {
                plaintext.textContent =
                    '{"primaryAccountNumber": "' +
                    oldcardnumber +
                    '", "panExpirationMonth": "' +
                    oldexpirymonth +
                    '", "panExpirationYear": "' +
                    oldexpiryyear +
                    '", "cardSecurityCode": "' +
                    oldcvvnumber +
                    '", "cardholderFullName": "' +
                    oldcardholdername +
                    '", "billingAddress": { "name": "' +
                    billingAddName +
                    '", "line1": "' +
                    billingAddLine1 +
                    '", "line2": "' +
                    billingAddLine2 +
                    '", "line3": "' +
                    billingAddLine3 +
                    '", "city": "' +
                    billingAddCity +
                    '", "state": "' +
                    billingAddState +
                    '", "zip": "' +
                    billingAddZip +
                    '", "countryCode": "' +
                    billingCountryCode +
                    '"}}';
            }
        } else {
            if (
                billingAddName == "" ||
                billingAddLine1 == "" ||
                billingAddCity == "" ||
                billingCountryCode == ""
            ) {
                plaintext.textContent =
                    '{"primaryAccountNumber": "' +
                    oldcardnumber +
                    '", "panExpirationMonth": "' +
                    oldexpirymonth +
                    '", "panExpirationYear": "' +
                    oldexpiryyear +
                    '", "cardSecurityCode": "' +
                    oldcvvnumber +
                    '"}';
            } else {
                plaintext.textContent =
                    '{"primaryAccountNumber": "' +
                    oldcardnumber +
                    '", "panExpirationMonth": "' +
                    oldexpirymonth +
                    '", "panExpirationYear": "' +
                    oldexpiryyear +
                    '", "cardSecurityCode": "' +
                    oldcvvnumber +
                    '", "billingAddress": { "name": "' +
                    billingAddName +
                    '", "line1": "' +
                    billingAddLine1 +
                    '", "line2": "' +
                    billingAddLine2 +
                    '", "line3": "' +
                    billingAddLine3 +
                    '", "city": "' +
                    billingAddCity +
                    '", "state": "' +
                    billingAddState +
                    '", "zip": "' +
                    billingAddZip +
                    '", "countryCode": "' +
                    billingCountryCode +
                    '"}}';
            }
        }

        plantextData = plaintext.textContent;
    } else {
        var cardnumber = $("#cardnumber").val().replace(/ /g, "");
        var cvvnumber = $("#cvvnumber").val();
        //var expiryyear = $('#expiryyear').val();
        //var expirymonth = $('#expirymonth').val();
        var newinputExpDate = $("#newinputExpDate").val();
        var cardholdername = $("#cardholdername").val();
        var expirymonth = newinputExpDate.split("/")[0].trim();
        var expiryyear = newinputExpDate.split("/")[1].trim();

        if (cardholdername != "") {
            newplaintext.textContent =
                '{"primaryAccountNumber": "' +
                cardnumber +
                '", "panExpirationMonth": "' +
                expirymonth +
                '", "panExpirationYear": "' +
                expiryyear +
                '", "cardSecurityCode": "' +
                cvvnumber +
                '", "cardholderFullName": "' +
                cardholdername +
                '"}';
        } else {
            newplaintext.textContent =
                '{"primaryAccountNumber": "' +
                cardnumber +
                '", "panExpirationMonth": "' +
                expirymonth +
                '", "panExpirationYear": "' +
                expiryyear +
                '", "cardSecurityCode": "' +
                cvvnumber +
                '"}';
        }
        plantextData = newplaintext.textContent;
    }
    let webKey = "";
    _.forEach(encParams.keys, (srcKey) => {
        if (srcKey.kid.includes(encParams.encKeyId)) {
            webKey = srcKey;
        }
    });
    var cryptographer = new Jose.WebCryptographer();
    cryptographer.setKeyEncryptionAlgorithm(encParams.encAlgo);
    cryptographer.setContentEncryptionAlgorithm(encParams.encContentAlgo);
    var key = {
        kty: webKey.kty,
        e: webKey.e,
        n: webKey.n,
    };
    var rsa_key = Jose.Utils.importRsaPublicKey(key, encParams.encAlgo);
    var encrypter = new Jose.JoseJWE.Encrypter(cryptographer, rsa_key);
    encrypter.addHeader("kid", webKey.kid);
    encrypter
        .encrypt(plantextData)
        .then(function (result) {
            stats("ENCRYPT CARD");
            if (type == "old") {
                $("#ciphertext").val(result);
            } else {
                $("#newciphertext").val(result);
            }
            console.log(result);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function Checkout() {
    stats("NEW USER CHECKOUT");
    var srcWindow;
    if (inlineDCF) {
        checkoutIframe.addEventListener("load", showCheckoutIframe, {
            once: true,
        });
        srcWindow = checkoutIframe.contentWindow
            ? checkoutIframe.contentWindow
            : checkoutIframe.contentDocument.defaultView;
    } else {
        srcWindow = window.open("", "_blank", "popup");
        srcWindow.moveTo(500, 100);
        srcWindow.resizeTo(550, 650);
        srcWindow.addEventListener("message", this.cancel);
    }
    window.childSrcWindow = srcWindow;

    // if ($("input[name='authenticationType']:checked").val() == "3DS") {
    //     authenticationPreferences.authenticationMethods = "3DS";
    // }

    console.log(
        "authenticationType",
        $("input[name='authenticationType']").is(":checked")
    );

    if ($("input[name='authenticationType']").is(":checked")) {
        // authenticationPreferences.authenticationMethods = "3DS";
        var authenticationPreferences = {
            payloadRequested: "AUTHENTICATED", //required for Use case 1 & 2
            //"authenticationMethods": null, //required only for Use case 2
            //"suppressChallenge": false
        };
    }

    if ($("input[name='tasAuth']").is(":checked")) {
        var tafParams = {
            acquirerMerchantId: "SRC3DS",
            acquirerBIN: "545301",
            merchantCategoryCode: "5995",
            merchantCountryCode: "US",
            authenticationPreferences: {
                payloadRequested: "AUTHENTICATED", // Add taf-specific authentication preferences
            },
        };
    }

    console.log("authenticationPreferences", authenticationPreferences);

    var sampleCheckoutParams;

    var dpaTransactionOptions = {
        transactionAmount: {
            transactionAmount: $("#txnAmount").val(),
            transactionCurrencyCode: $("#txnCurrency").val(),
        },
        transactionType: "PURCHASE",
        dpaBillingPreference: allowBilling == true ? "FULL" : "NONE",
        dpaShippingPreference: allowShipping == true ? "FULL" : "NONE",
        dpaAcceptedBillingCountries: [],
        dpaAcceptedShippingCountries: [],
        dpaLocale: $("#dpalocale").val(),
        consumerEmailAddressRequested: true,
        consumerNameRequested: true,
        consumerPhoneNumberRequested: true,
        customInputData: {
            "com.mastercard.dcfExperience": "WITHIN_CHECKOUT",
        },
        confirmPayment: confPayment,
        paymentOptions: {
            dpaDynamicDataTtlMinutes: 15,
            dynamicDataType: $("input[name='cryptogram']:checked").val(), //"CARD_APPLICATION_CRYPTOGRAM_LONG_FORM"
        },
        payloadTypeIndicatorCheckout: $(
            "input[name='IndicatorCheckout']:checked"
        ).val(),
        ...tafParams, // injects only if checked
    };

    console.log("dpaTransactionOptions", dpaTransactionOptions);
    console.log("authenticationType", authenticationType);
    if (authenticationType) {
        dpaTransactionOptions = {
            ...dpaTransactionOptions,
            authenticationPreferences: authenticationPreferences,
            //"acquirerId": "550e8400", //required for Use case 1 & 2
            acquirerBin: "545301", //required for Use case 1 & 2
            merchantCategoryCode: "5995", //required for Use case 1 & 2
            merchantCountryCode: "US", //required for Use case 1 & 2
            acquirerMerchantId: "SRC3DS",

            // threeDsInputData: {
            //     forceChallenge: false,
            //     billingAddress: {
            //         name: "John Doe",
            //         line1: "Paseo Castellana 259C",
            //         line2: "Torre de Cristal",
            //         city: "Madrid",
            //         state: "CT",
            //         zip: "28049",
            //         countryCode: "US",
            //     },
            //     shippingAddress: {
            //         name: "John Doe",
            //         line1: "Paseo Castellana 259C",
            //         line2: "Torre de Cristal",
            //         city: "Madrid",
            //         state: "CT",
            //         zip: "28049",
            //         countryCode: "US",
            //     },
            // },
        };
    }

    console.log("dpaTransactionOptions", dpaTransactionOptions);

    sampleCheckoutParams = {
        dpaTransactionOptions: dpaTransactionOptions,
        consumer: {
            emailAddress: $("#consumerEmail").val(),
            mobileNumber: {
                countryCode: $("#consumerMobileCountryCode").val(),
                phoneNumber: $("#consumerMobileNumber").val(),
            },
            firstName: $("#oldcardholderfname").val(),
            lastName: $("#oldcardholderlname").val(),
        },
        srciActionCode: "NEW_USER",
        //"payloadTypeIndicatorCheckout": $("input[name='IndicatorCheckout']:checked").val(),
        encryptedCard: $("#ciphertext").val(),
    };
    var sampleCheckoutParams1 = sampleCheckoutParams;
    sampleCheckoutParams = { ...sampleCheckoutParams, windowRef: srcWindow };

    if (suppressDCF && !rememberMe) {
        sampleCheckoutParams = {
            ...sampleCheckoutParams,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
            },
        };
        sampleCheckoutParams1 = {
            ...sampleCheckoutParams1,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
            },
        };
    } else if (suppressDCF && rememberMe) {
        sampleCheckoutParams = {
            ...sampleCheckoutParams,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
                complianceResources: [
                    {
                        complianceType: "REMEMBER_ME",
                        uri: $(location).attr("href"),
                        version: "LATEST",
                        datePublished: new Date().getTime() / 1000,
                    },
                ],
            },
        };
        sampleCheckoutParams1 = {
            ...sampleCheckoutParams1,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
                complianceResources: [
                    {
                        complianceType: "REMEMBER_ME",
                        uri: $(location).attr("href"),
                        version: "LATEST",
                        datePublished: new Date().getTime() / 1000,
                    },
                ],
            },
        };
    }

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog(
            "\n New User Checkout - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        validateDcfActionCode(payload);
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n New User Checkout - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        if (inlineDCF) {
            dismissCheckoutIframe();
        } else {
            window.childSrcWindow.close();
        }
    }

    CallLog("\n Checkout - Request Payload \n");

    if (myCustomJSON != "") {
        sampleCheckoutParams1 = JSON.parse(myCustomJSON);
        sampleCheckoutParams = {
            ...sampleCheckoutParams1,
            windowRef: srcWindow,
        };
        myCustomJSON = "";
    }

    CallLog(
        "\n" +
            JSON.stringify(
                { ...sampleCheckoutParams1, windowRef: "YOUR WINDOW REF" },
                undefined,
                4
            ) +
            "\n"
    );

    const checkoutPromise =
        window.SRCSDK_MASTERCARD.checkout(sampleCheckoutParams); //  returns a promise
    checkoutPromise.then(promiseResolvedHandler).catch(promiseRejectedHandler);
}

async function ReturnUserCheckout() {
    stats("RETURN USER CHECKOUT");
    var srcWindow;
    if (inlineDCF) {
        checkoutIframe.addEventListener("load", showCheckoutIframe, {
            once: true,
        });
        srcWindow = checkoutIframe.contentWindow
            ? checkoutIframe.contentWindow
            : checkoutIframe.contentDocument.defaultView;
    } else {
        srcWindow = window.open("", "_blank", "popup");
        srcWindow.moveTo(500, 100);
        srcWindow.resizeTo(550, 650);
        srcWindow.addEventListener("message", this.cancel);
    }
    window.childSrcWindow = srcWindow;

    // if ($("input[name='authenticationType']:checked").val() == "3DS") {
    //     authenticationPreferences.authenticationMethods = "3DS";
    // }

    console.log(
        "authenticationType",
        $("input[name='authenticationType']").is(":checked")
    );

    if ($("input[name='authenticationType']").is(":checked")) {
        // authenticationPreferences.authenticationMethods = "3DS";
        var authenticationPreferences = {
            payloadRequested: "AUTHENTICATED", //required for Use case 1 & 2
            //"authenticationMethods": null, //required only for Use case 2
            //"suppressChallenge": false
        };
    }

    if ($("input[name='tasAuth']").is(":checked")) {
        var tafParams = {
            acquirerMerchantId: "SRC3DS",
            acquirerBIN: "545301",
            merchantCategoryCode: "5995",
            merchantCountryCode: "US",
            authenticationPreferences: {
                payloadRequested: "AUTHENTICATED", // Add taf-specific authentication preferences
            },
        };
    }

    console.log("authenticationPreferences", authenticationPreferences);

    var dpaTransactionOptions = {
        transactionAmount: {
            transactionAmount: $("#txnAmount").val(),
            transactionCurrencyCode: $("#txnCurrency").val(),
        },
        transactionType: "PURCHASE",
        dpaBillingPreference: allowBilling == true ? "FULL" : "NONE",
        dpaShippingPreference: allowShipping == true ? "FULL" : "NONE",
        dpaAcceptedBillingCountries: [],
        dpaAcceptedShippingCountries: [],
        dpaLocale: $("#dpalocale").val(),
        consumerEmailAddressRequested: true,
        consumerNameRequested: true,
        consumerPhoneNumberRequested: true,
        customInputData: {
            "com.mastercard.dcfExperience": "WITHIN_CHECKOUT",
        },
        confirmPayment: confPayment,
        paymentOptions: {
            dpaDynamicDataTtlMinutes: 15,
            dynamicDataType: $("input[name='cryptogram']:checked").val(), //"CARD_APPLICATION_CRYPTOGRAM_LONG_FORM"
        },
        payloadTypeIndicatorCheckout: $(
            "input[name='IndicatorCheckout']:checked"
        ).val(),
        ...tafParams, // injects only if checked
    };

    console.log("dpaTransactionOptions", dpaTransactionOptions);
    console.log("authenticationType", authenticationType);
    if (authenticationType) {
        dpaTransactionOptions = {
            ...dpaTransactionOptions,
            //"acquirerId": "550e8400", //required for Use case 1 & 2
            acquirerBin: "545301", //required for Use case 1 & 2
            merchantCategoryCode: "5995", //required for Use case 1 & 2
            merchantCountryCode: "US", //required for Use case 1 & 2
            acquirerMerchantId: "SRC3DS",
            authenticationPreferences: authenticationPreferences,
            //"threeDsInputData": {
            //	 "forceChallenge": false,
            //	 "billingAddress": {
            //			"name": "John Doe",
            //			"line1": "Paseo Castellana 259C",
            //			"line2": "Torre de Cristal",
            //			"city": "Madrid",
            //			"state": "CT",
            //			"zip": "28049",
            //			"countryCode": "US"
            //		 }
            //	  }
        };
    }

    var sampleCheckoutParams = {
        dpaTransactionOptions: dpaTransactionOptions,
        srcDigitalCardId: $("#cards").val(),
        payloadTypeIndicatorCheckout: $(
            "input[name='IndicatorCheckout']:checked"
        ).val(),
    };
    var sampleCheckoutParams1 = sampleCheckoutParams;
    sampleCheckoutParams = { ...sampleCheckoutParams, windowRef: srcWindow };

    if (suppressDCF && !rememberMe) {
        sampleCheckoutParams = {
            ...sampleCheckoutParams,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
            },
        };
        sampleCheckoutParams1 = {
            ...sampleCheckoutParams1,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
            },
        };
    } else if (suppressDCF && rememberMe) {
        sampleCheckoutParams = {
            ...sampleCheckoutParams,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
                complianceResources: [
                    {
                        complianceType: "REMEMBER_ME",
                        uri: $(location).attr("href"),
                        version: "LATEST",
                        datePublished: new Date().getTime() / 1000,
                    },
                ],
            },
        };
        sampleCheckoutParams1 = {
            ...sampleCheckoutParams1,
            complianceSettings: {
                privacy: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/privacy.html",
                },
                tnc: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/country-listing/terms.html",
                },
                cookie: {
                    acceptedVersion: "LATEST",
                    latestVersion: "LATEST",
                    latestVersionUri:
                        "https://www.mastercard.com/global/click-to-pay/en-us/privacy-notice.html",
                },
                complianceResources: [
                    {
                        complianceType: "REMEMBER_ME",
                        uri: $(location).attr("href"),
                        version: "LATEST",
                        datePublished: new Date().getTime() / 1000,
                    },
                ],
            },
        };
    }

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog(
            "\n Return User Checkout - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        validateDcfActionCode(payload);
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n Return User Checkout - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        if (inlineDCF) {
            dismissCheckoutIframe();
        } else {
            window.childSrcWindow.close();
        }
    }

    CallLog("\n ReturnUserCheckout - Request Payload \n");
    if (myCustomJSON != "") {
        sampleCheckoutParams1 = JSON.parse(myCustomJSON);
        sampleCheckoutParams = {
            ...sampleCheckoutParams1,
            windowRef: srcWindow,
        };
        myCustomJSON = "";
    }

    CallLog(
        "\n" +
            JSON.stringify(
                { ...sampleCheckoutParams1, windowRef: "YOUR WINDOW REF" },
                undefined,
                4
            ) +
            "\n"
    );

    const checkoutPromise =
        window.SRCSDK_MASTERCARD.checkout(sampleCheckoutParams); //  returns a promise
    checkoutPromise.then(promiseResolvedHandler).catch(promiseRejectedHandler);
}

function validateDcfActionCode(checkoutResponse) {
    if (inlineDCF) {
        dismissCheckoutIframe();
    } else {
        window.childSrcWindow.close();
    }
    if (checkoutResponse.dcfActionCode == "COMPLETE") {
        playSonic();
        if ($("input[name='IndicatorCheckout']:checked").val() == "FULL") {
            try {
                var encryptedPayload =
                    checkoutResponse.checkoutResponse.encryptedPayload;
                var encryptedKey = $("#encprivatekey").val();
                console.log("Encrypted Payload :");
                console.log(encryptedPayload);
                decrypt(encryptedPayload, encryptedKey, "RSA-OAEP-256");
            } catch (err) {
                console.log(err);
            }
        }
        //VerifySignature(checkoutResponse.checkoutResponseSignature);
        PrintServerSideAPICallInfo(checkoutResponse);
    } else if (checkoutResponse.dcfActionCode == "CHANGE_CARD") {
        console.log(
            "unbindAppInstance : " + checkoutResponse.unbindAppInstance
        );
        if (checkoutResponse.unbindAppInstance) {
            // Define response handlers
            function promiseResolvedHandler(payload) {
                // add success handler logic here
                console.log("unbindAppInstance - Successful");
            }
            function promiseRejectedHandler(payload) {
                // add error handler logic here
                console.log("unbindAppInstance - failed");
            }
            const dataToken = window.localStorage.getItem("recognizedUsers");
            //const dataToken = $.cookie("recognizedUsers");
            const unbindAppInstancePromise =
                window.SRCSDK_MASTERCARD.unbindAppInstance({
                    idToken: dataToken.idToken,
                }); //  returns a promise
            unbindAppInstancePromise
                .then(promiseResolvedHandler)
                .catch(promiseRejectedHandler);
        }
    }
}

function PrintServerSideAPICallInfo(payload) {
    var consumerkey = $("#consumerkey").val();
    var key = $("#privatekey").val();
    //var key = "";
    if (consumerkey.length > 0 && key.length > 0) {
        var url = sandboxTransactionCredentailAPIEndPoint;
        var encryptedKey = $("#encprivatekey").val();
        //var encryptedKey = "";
        var requestpayload =
            "{" +
            '"srcCorrelationId":"' +
            payload.checkoutResponse.srcCorrelationId +
            '",' +
            '"srcClientId":"' +
            $("#clientid").val() +
            '",' +
            '"srciTransactionId":"' +
            payload.checkoutResponse.srciTransactionId +
            '",' +
            '"srcDpaId":"' +
            $("#dpaid").val() +
            '",' +
            '"srcDigitalCardId":"' +
            payload.checkoutResponse.maskedCard.srcDigitalCardId +
            '"' +
            "}";

        $.ajax({
            url: nodeJSSBSAPIUrl,
            data: {
                consumerkey: consumerkey,
                host: host,
                relativeurl: transactionCredentialsRelativeURL,
                payload: requestpayload,
                method: "POST",
                contentType: "application/json",
            },
            type: "post",
            success: function (output) {
                //console.log(output);
                const sbs = output.sbs;
                const oauthParams = output.OAuthParam;
                //console.log(oauthParams);
                const o1_tstamp = getUrlVars(oauthParams, "oauth_timestamp");
                const o1_nonce = getUrlVars(oauthParams, "oauth_nonce");
                const o1_body_hash = getUrlVars(oauthParams, "oauth_body_hash");
                encodedBaseString = sbs;
                var signature = doSign(encodedBaseString, key);
                var oauth_signature = 'oauth_signature="' + signature + '"';
                var oauth_header =
                    "OAuth oauth_consumer_key='" +
                    consumerkey +
                    "',oauth_body_hash='" +
                    o1_body_hash +
                    "',oauth_signature_method='" +
                    getUrlVars(oauthParams, "oauth_signature_method") +
                    "',oauth_timestamp='" +
                    o1_tstamp +
                    "',oauth_nonce='" +
                    o1_nonce +
                    "',  oauth_signature='" +
                    signature +
                    "',oauth_version='1.0'";
                oauth_header = oauth_header.replaceAll("'", '"');
                //console.log(oauth_header);
                $.ajax({
                    url: nodeJSAuthAPIUrl,
                    data: {
                        consumerkey: consumerkey,
                        host: host,
                        relativeurl: transactionCredentialsRelativeURL,
                        payload: requestpayload,
                        method: "POST",
                        contentType: "application/json",
                        authHeader: oauth_header,
                        XSRCCXFLOWID: payload.checkoutResponse.srcCorrelationId,
                    },
                    type: "post",
                    success: function (output) {
                        console.log(
                            "API Endpoint: " + transactionCredentialsRelativeURL
                        );
                        console.log(output);
                        var x_src_cx_flow_id =
                            output.headers["x-src-cx-flow-id"];
                        console.log("x-src-cx-flow-id : " + x_src_cx_flow_id);
                        var transactionCredentialResponse = output.data;
                        if (
                            $(
                                "input[name='IndicatorCheckout']:checked"
                            ).val() != "FULL"
                        ) {
                            var response = JSON.parse(
                                transactionCredentialResponse
                            );
                            var split_string =
                                response.checkoutResponseJWS.split(".");
                            var base64EncodedHeader = split_string[0];
                            var base64EncodedBody = split_string[1];
                            var base64EncodedSignature = split_string[2];
                            console.log(atob(base64EncodedHeader));
                            console.log(atob(base64EncodedBody));
                            var body = JSON.parse(
                                atob(base64EncodedBody)
                            ).encryptedPayload;
                            console.log(body);
                            decrypt(body, encryptedKey, "RSA-OAEP-256");
                        }

                        var url = sandboxTransactionConfirmationAPIEndPoint;
                        requestpayload =
                            "{" +
                            '"srcDpaId":"' +
                            $("#dpaid").val() +
                            '",' +
                            '"confirmationData":{' +
                            '	"confirmationReason":"Order Successfully Created",' +
                            '	"transactionAmount":{' +
                            '		"transactionAmount":"' +
                            $("#txnAmount").val() +
                            '",' +
                            ' 		"transactionCurrencyCode":"' +
                            $("#txnCurrency").val() +
                            '"' +
                            " 	},\n" +
                            '	"confirmationTimestamp":"2020-07-08T22:13:22Z",' +
                            '	"networkTransactionIdentifier":"UNAVLB",' +
                            '	"checkoutEventStatus":"01",' +
                            '	"checkoutEventType":"07"' +
                            "	}," +
                            '"srcClientId":"' +
                            $("#clientid").val() +
                            '",' +
                            '"srcCorrelationId":"' +
                            payload.checkoutResponse.srcCorrelationId +
                            '"' +
                            "}";
                        $.ajax({
                            url: nodeJSSBSAPIUrl,
                            data: {
                                consumerkey: consumerkey,
                                host: host,
                                relativeurl: transactionConfirmationRelativeURL,
                                payload: requestpayload,
                                method: "POST",
                                contentType: "application/json",
                            },
                            type: "post",
                            success: function (output) {
                                //console.log(output);
                                const sbs = output.sbs;
                                const oauthParams = output.OAuthParam;
                                //console.log(oauthParams);
                                const o1_tstamp = getUrlVars(
                                    oauthParams,
                                    "oauth_timestamp"
                                );
                                const o1_nonce = getUrlVars(
                                    oauthParams,
                                    "oauth_nonce"
                                );
                                const o1_body_hash = getUrlVars(
                                    oauthParams,
                                    "oauth_body_hash"
                                );
                                encodedBaseString = sbs;
                                var signature = doSign(encodedBaseString, key);
                                var oauth_signature =
                                    'oauth_signature="' + signature + '"';
                                var oauth_header =
                                    "OAuth oauth_consumer_key='" +
                                    consumerkey +
                                    "',oauth_body_hash='" +
                                    o1_body_hash +
                                    "',oauth_signature_method='" +
                                    getUrlVars(
                                        oauthParams,
                                        "oauth_signature_method"
                                    ) +
                                    "',oauth_timestamp='" +
                                    o1_tstamp +
                                    "',oauth_nonce='" +
                                    o1_nonce +
                                    "',  oauth_signature='" +
                                    signature +
                                    "',oauth_version='1.0'";
                                oauth_header = oauth_header.replaceAll(
                                    "'",
                                    '"'
                                );
                                //console.log(oauth_header);
                                $.ajax({
                                    url: nodeJSAuthAPIUrl,
                                    data: {
                                        consumerkey: consumerkey,
                                        host: host,
                                        relativeurl:
                                            transactionConfirmationRelativeURL,
                                        payload: requestpayload,
                                        method: "POST",
                                        contentType: "application/json",
                                        authHeader: oauth_header,
                                        XSRCCXFLOWID: x_src_cx_flow_id,
                                    },
                                    type: "post",
                                    success: function (output) {
                                        console.log(
                                            "API Endpoint : " +
                                                transactionConfirmationRelativeURL
                                        );
                                        console.log(output);
                                        var transactionConfirmation =
                                            output.data;
                                        if (
                                            transactionConfirmation.length == 0
                                        ) {
                                            transactionConfirmation =
                                                "Success with 204";
                                        }
                                        CallLogWithoutLine(
                                            "\n Next Steps (Server side API call Information): \n" +
                                                "\n 1. Transaction Credentails API: " +
                                                sandboxTransactionCredentailAPIEndPoint +
                                                " \n" +
                                                "\n Request Payload: \n" +
                                                "\n {" +
                                                '\n 	"srcCorrelationId":"' +
                                                payload.checkoutResponse
                                                    .srcCorrelationId +
                                                '",' +
                                                '\n 	"srcClientId":"' +
                                                $("#clientid").val() +
                                                '",' +
                                                '\n 	"srciTransactionId":"' +
                                                payload.checkoutResponse
                                                    .srciTransactionId +
                                                '",' +
                                                '\n 	"srcDpaId":"' +
                                                $("#dpaid").val() +
                                                '",' +
                                                '\n 	"srcDigitalCardId":"' +
                                                payload.checkoutResponse
                                                    .maskedCard
                                                    .srcDigitalCardId +
                                                '"' +
                                                "\n }\n\n" +
                                                "\n Response: \n " +
                                                transactionCredentialResponse.replace(
                                                    '"',
                                                    '"'
                                                ) +
                                                "\n" +
                                                "\n 2. Transaction Confirmation API: " +
                                                sandboxTransactionConfirmationAPIEndPoint +
                                                " \n" +
                                                "\n Request Payload: \n" +
                                                "\n {" +
                                                '\n 	"srcDpaId":"' +
                                                $("#dpaid").val() +
                                                '",' +
                                                '\n 	"confirmationData":{' +
                                                '\n 		"confirmationReason":"Order Successfully Created",' +
                                                '\n 		"transactionAmount":{' +
                                                '\n 			"transactionAmount":"' +
                                                $("#txnAmount").val() +
                                                '",' +
                                                '\n 			"transactionCurrencyCode":"' +
                                                $("#txnCurrency").val() +
                                                '"' +
                                                "\n 		},\n" +
                                                '\n 		"confirmationTimestamp":"2020-07-08T22:13:22Z",' +
                                                '\n 		"networkTransactionIdentifier":"UNAVLB",' +
                                                '\n 		"checkoutEventStatus":"01",' +
                                                '\n 		"checkoutEventType":"07"' +
                                                "\n		}," +
                                                '\n		"srcClientId":"' +
                                                $("#clientid").val() +
                                                '",' +
                                                '\n		"srcCorrelationId":"' +
                                                payload.checkoutResponse
                                                    .srcCorrelationId +
                                                '"' +
                                                "\n }" +
                                                "\n Response: \n " +
                                                transactionConfirmation.replace(
                                                    '"',
                                                    '"'
                                                ) +
                                                "\n" +
                                                "\n___________________________________________________________________\n"
                                        );
                                    },
                                    error: function (xhr, status, error) {
                                        var errorMessage =
                                            xhr.status + ": " + xhr.statusText;
                                        console.log("Error - " + errorMessage);
                                        $("body").pleaseWait("stop");
                                    },
                                });
                            },
                            error: function (xhr, status, error) {
                                var errorMessage =
                                    xhr.status + ": " + xhr.statusText;
                                console.log("Error - " + errorMessage);
                                $("body").pleaseWait("stop");
                            },
                        });
                        // $.ajax({ url: callNodeJsAPIUrl,
                        // //data: {action: 'callAPI', consumerkey : consumerkey, url : url, key : key, payload: requestpayload, XSRCCXFLOWID: payload.checkoutResponse.srciTransactionId},
                        // data: {consumerkey : consumerkey, privatekey: key, host: host, relativeurl : transactionConfirmationRelativeURL, payload: requestpayload, method: "POST", contentType: "application/json", XSRCCXFLOWID:x_src_cx_flow_id},
                        // type: 'post',
                        // success: function(output)
                        // });
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.status + ": " + xhr.statusText;
                        console.log("Error - " + errorMessage);
                        $("body").pleaseWait("stop");
                    },
                });
            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ": " + xhr.statusText;
                console.log("Error - " + errorMessage);
                $("body").pleaseWait("stop");
            },
        });
        // $.ajax({ url: callNodeJsAPIUrl,
        // //data: {action: 'callAPI', consumerkey : consumerkey, url : url, key : key, payload: requestpayload, XSRCCXFLOWID: payload.checkoutResponse.srciTransactionId},
        // data: {consumerkey : consumerkey, privatekey: key, host: host, relativeurl : transactionCredentialsRelativeURL, payload: requestpayload, method: "POST", contentType: "application/json", XSRCCXFLOWID:payload.checkoutResponse.srcCorrelationId},
        // type: 'post',

        // });
    } else {
        CallLogWithoutLine(
            "\n Next Steps (Server side API call Information): \n" +
                "\n 1. Transaction Credentails API: " +
                sandboxTransactionCredentailAPIEndPoint +
                " \n" +
                "\n Request Payload: \n" +
                "\n {" +
                '\n 	"srcCorrelationId":"' +
                payload.checkoutResponse.srcCorrelationId +
                '",' +
                '\n 	"srcClientId":"' +
                $("#clientid").val() +
                '",' +
                '\n 	"srciTransactionId":"' +
                payload.checkoutResponse.srciTransactionId +
                '",' +
                '\n 	"srcDpaId":"' +
                $("#dpaid").val() +
                '",' +
                '\n 	"srcDigitalCardId":"' +
                payload.checkoutResponse.maskedCard.srcDigitalCardId +
                '"' +
                "\n }\n\n" +
                "\n 2. Transaction Confirmation API: " +
                sandboxTransactionConfirmationAPIEndPoint +
                " \n" +
                "\n Request Payload: \n" +
                "\n {" +
                '\n 	"srcDpaId":"' +
                $("#dpaid").val() +
                '",' +
                '\n 	"confirmationData":{' +
                '\n 		"confirmationReason":"Order Successfully Created",' +
                '\n 		"transactionAmount":{' +
                '\n 			"transactionAmount":"' +
                $("#txnAmount").val() +
                '",' +
                '\n 			"transactionCurrencyCode":"' +
                $("#txnCurrency").val() +
                '"' +
                "\n 		},\n" +
                '\n 		"confirmationTimestamp":"2020-07-08T22:13:22Z",' +
                '\n 		"networkTransactionIdentifier":"UNAVLB",' +
                '\n 		"checkoutEventStatus":"01",' +
                '\n 		"checkoutEventType":"07"' +
                "\n		}," +
                '\n		"srcClientId":"' +
                $("#clientid").val() +
                '",' +
                '\n		"srcCorrelationId":"' +
                payload.checkoutResponse.srcCorrelationId +
                '"' +
                "\n }" +
                "\n___________________________________________________________________\n"
        );
    }
}

function EnrollCard() {
    stats("ENROLL CARD");
    const dataToken = window.localStorage.getItem("recognizedUsers");
    //const dataToken = $.cookie("recognizedUsers");
    const token = JSON.parse(dataToken).idTokens;
    var sampleEnrollCardParams = {
        encryptedCard: $("#newciphertext").val(), // required,
        // An encrypted Card object describing the card to be enrolled with the SRC System.
        // Encrypted using the public key of the target SRC System.

        idToken: token, // conditional
        // Federated ID token formatted as a JWT. In case a 3rd party federated identity
        // token is supplied, this may be used to provide the consumer hints in the
        // DCF UX to enter their identity credentials consistently across SRC Systems.
        // Conditionality: provided when required (e.g. to enroll a card to one of a range
        // of identified SRC Profiles).
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog(
            "\n Enroll Card - \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        var text =
            payload.maskedCard.digitalCardData.descriptorName +
            " - " +
            payload.maskedCard.panLastFour;
        var value = payload.maskedCard.srcDigitalCardId;
        var o = new Option(text, value);
        $("#cards").append(o);
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n Enroll Card - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    CallLog("\n EnrollCard - Request Payload \n");
    if (myCustomJSON != "") {
        sampleEnrollCardParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog("\n" + JSON.stringify(sampleEnrollCardParams, undefined, 4) + "\n");

    const enrollCardPromise = window.SRCSDK_MASTERCARD.enrollCard(
        sampleEnrollCardParams
    ); //  returns a promise
    enrollCardPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function DeleteCard() {
    stats("DELETE CARD");
    if ($("#cards").val() == "") {
        MyAlert("Please select card first.");
        return;
    }

    var sampleDeleteCardParams = {
        srcDigitalCardId: $("#cards").val(), // required
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        // add success handler logic here
        $("#cards option[value='" + $("#cards").val() + "']").remove();
        CallLog(
            "\n Delete Card - \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n Delete Card Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
    }

    CallLog("\n DeleteCard - Request Payload \n");
    if (myCustomJSON != "") {
        sampleDeleteCardParams = JSON.parse(myCustomJSON);
        myCustomJSON = "";
    }
    CallLog("\n" + JSON.stringify(sampleDeleteCardParams, undefined, 4) + "\n");

    const deleteCardPromise = window.SRCSDK_MASTERCARD.deleteCard(
        sampleDeleteCardParams
    ); //  returns a promise
    deleteCardPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function VerifySignature(signature) {
    let webKey = "";
    _.forEach(encParams.keys, (srcKey) => {
        if (srcKey.kid.includes(encParams.verKeyId)) {
            webKey = srcKey;
        }
    });
    var key = {
        kty: webKey.kty,
        e: webKey.e,
        n: webKey.n,
    };
    var rsa_key = Jose.Utils.importRsaPublicKey(key, encParams.verAlgo);

    var cryptographer = new Jose.WebCryptographer();
    cryptographer.setContentSignAlgorithm(encParams.verAlgo);

    var verifier = new Jose.JoseJWS.Verifier(cryptographer, signature, false);
    verifier.addRecipient(key, webKey.kid, encParams.verAlgo).then(function () {
        verifier
            .verify()
            .then(function (verified) {
                console.log("verified: ", verified);
                CallLog(
                    "\n Checkout Response Signature Verified - " +
                        verified[0].verified +
                        "\n"
                );
            })
            .catch(function (err) {
                console.error(err);
                CallLog("\n Verification Error - " + err + "\n");
            });
    });
}

function doSign(message, key) {
    var o1_secret = key;
    var signature = crypt.signature(o1_secret, message);
    var sign = encodeURIComponent(JSON.parse(signature).signature);
    return sign;
}

function getUrlVars(params, key) {
    var vars = [],
        hash;
    var hashes = params.split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        if (hash[0] == key) {
            return hashes[i].slice(hashes[i].indexOf("=") + 1);
        }
    }
    return vars;
}

async function decrypt(ciphertext, key, alg) {
    updateJwk(key, false).then((jsonKey) => {
        var private_rsa_key = Jose.Utils.importRsaPrivateKey(jsonKey, alg);
        var cryptographer = new Jose.WebCryptographer();

        var decrypter = new Jose.JoseJWE.Decrypter(
            cryptographer,
            private_rsa_key
        );
        decrypter
            .decrypt(ciphertext)
            .then(function (decrypted_plain_text) {
                console.log("Decrypted Payload:");
                console.log(decrypted_plain_text);
            })
            .catch(function (err) {
                console.log(err.message);
            });
    });
}

function loadInputBox() {
    $.confirm({
        useBootstrap: false,
        title: "Prompt!",
        content:
            "" +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            "<label>Enter your custom JSON Payload here (For Checkout function DO NOT include windowRef element):</label>" +
            '<textarea id="customJSON" name="customJSON" cols="100" rows="10" class="customJSON form-control" required ></textarea>' +
            "</div>" +
            "</form>",
        buttons: {
            formSubmit: {
                text: "Submit",
                btnClass: "btn-blue",
                action: function () {
                    var customJSON = this.$content.find(".customJSON").val();
                    if (!customJSON) {
                        MyAlert("provide a valid JSON Payload");
                        return false;
                    }
                    //$.alert('Your name is ' + customJSON);
                    myCustomJSON = customJSON;
                },
            },
            cancel: function () {
                //close
            },
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find("form").on("submit", function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger("click"); // reference the button and click it
            });
        },
    });
}

function SignOut(message) {
    stats("SIGN OUT");
    $.confirm({
        title: "Confirm!",
        content: "Are you sure" + message + "?",
        useBootstrap: false,
        buttons: {
            confirm: function () {
                ClickToPaySignOut();
            },
            cancel: function () {
                return;
            },
        },
    });
}

function ClickToPaySignOut() {
    //$('body').pleaseWait();
    var recognizedUsers = JSON.parse(
        window.localStorage.getItem("recognizedUsers")
    );
    //var recognizedUsers = JSON.parse($.cookie("recognizedUsers"));
    var sampleUnbindAppInstanceParams = { idToken: recognizedUsers.idTokens };
    CallLog(
        "\n Unbind App Instance - Request Payload \n" +
            JSON.stringify(sampleUnbindAppInstanceParams, undefined, 4) +
            "\n"
    );
    const unbindAppInstancePromise = window.SRCSDK_MASTERCARD.unbindAppInstance(
        sampleUnbindAppInstanceParams
    ); //  returns a promise
    unbindAppInstancePromise
        .then(c2pSignoutPromiseResolvedHandler)
        .catch(c2pSignoutPromiseRejectedHandler);

    function c2pSignoutPromiseResolvedHandler(payload) {
        // add success handler logic here
        CallLog("\n Unbind App Instance - Success \n");
        CallLog(
            "\n Response : \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        $("#cards")
            .find("option")
            .remove()
            .end()
            .append('<option value="">Select</option>')
            .val("");
        $("#notYourCards").hide();
        $("#deleteCard").hide();
        //$('body').pleaseWait('stop');
    }
    function c2pSignoutPromiseRejectedHandler(payload) {
        CallLog("\n Unbind App Instance - Rejected \n");
        CallLog(
            "\n Response : \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        //$('body').pleaseWait('stop');
    }
}

function stats(desc) {
    /*$.ajax({ 
            url: nodeJSStatsAPIUrl,
            data: { "Type":"V1", "Desc":desc },
            type: 'post',
            success: function(output) {
                console.log(output);
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                console.log('Error - ' + errorMessage);
            }
        });*/
}
function playSonic() {
    let animationStep = document.getElementById("animationStep");
    animationStep.classList.remove("hide");
    window.scrollTo({ top: 0, behavior: "auto" });
    animationStep.scrollTo({ top: 0, behavior: "auto" });
    let mc_component = document.getElementById("mc-sonic");
    mc_component.play();
    document.addEventListener("sonicCompletion", onCompletion);
    $("#src").hide();
    $("#srcFooter").hide();
}

function onCompletion() {
    let animationStep = document.getElementById("animationStep");
    animationStep.classList.add("hide");
    $("#src").show();
    $("#srcFooter").show();
}
