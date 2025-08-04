let initSuccess = false;
let recognizedSuccess = false;
let identityValidationSuccess = false;

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
    showLoader();

    if ($("input[name='authenticationType']").is(":checked")) {
        // authenticationPreferences.authenticationMethods = "3DS";
        var authenticationPreferences = {
            payloadRequested: "AUTHENTICATED", //required for Use case 1 & 2
            //"authenticationMethods": null, //required only for Use case 2
            //"suppressChallenge": false
        };

        console.log("authenticationPreferences", authenticationPreferences);
    }

    if ($("input[name='tasAuth']").is(":checked")) {
        var tafParams = {
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),
            authenticationPreferences: {
                payloadRequested: "AUTHENTICATED", // Add taf-specific authentication preferences
            },
        };
    }

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
        consumerEmailAddressRequested: $("#consumerEmailAddressRequested").is(
            ":checked"
        ),
        consumerNameRequested: $("#consumerNameRequested").is(":checked"),
        consumerPhoneNumberRequested: $("#consumerPhoneNumberRequested").is(
            ":checked"
        ),
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
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),
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
        initSuccess = true; // Set flag
        CallLog("\n Init - Success \n");
        showToast("Initialization successful!", "success");
        if (payload != undefined)
            CallLog(
                "\n Response : \n" +
                    JSON.stringify(payload, undefined, 4) +
                    "\n"
            );
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        initSuccess = false;
        CallLog("\n Init - Rejected \n");
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Initialization failed: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        if (payload != undefined)
            CallLog(
                "\n Response : \n" +
                    JSON.stringify(payload, undefined, 4) +
                    "\n"
            );
        hideLoader();
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
    showLoader();
    // Define response handlers
    function promiseResolvedHandler(payload) {
        CallLog(
            "\n isRecognized - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        recognized = payload.recognized;
        recognizedSuccess = true; // Set flag

        if (payload.recognized) {
            showToast(
                "User recognized from cookie. Is Recognized Call successful!",
                "success"
            );
        } else {
            showToast(
                "User not recognized from cookie. Is Recognized Call successful!",
                "danger"
            );
        }
        if (typeof Storage !== "undefined") {
            window.localStorage.setItem(
                "recognizedUsers",
                JSON.stringify(payload)
            );
            //$.cookie("recognizedUsers", JSON.stringify(payload),{ expires : 365 });
        }
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        recognizedSuccess = false; // Set flag
        CallLog(
            "\n isRecognized - Rejected\n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Recognition check failed: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
    }

    const isRecognizedPromise = window.SRCSDK_MASTERCARD.isRecognized(); //  returns a promise
    isRecognizedPromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

function GetSRCProfile() {
    stats("GET SRC PROFILE");
    showLoader();
    var recognizedUsers = JSON.parse(
        window.localStorage.getItem("recognizedUsers")
    );
    var sampleGetSrcProfileParams = { idTokens: recognizedUsers.idTokens };

    function promiseResolvedHandler(payload) {
        CallLog(
            "\n GetSRC Profile - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        showToast("GetSRC Profile successful!", "success");

        // Correct: assign maskedCards from payload
        const maskedCards = payload.profiles[0].maskedCards;

        // Hide or show card section logic as before
        if (maskedCards.length > 0) {
            if (recognized) {
                $("#notYourCards").show();
            } else {
                $("#notYourCards").hide();
            }
        } else {
            $("#notYourCards").hide();
            $("#deleteCard").hide();
        }

        // --- Render card tiles, not a dropdown ---
        renderCardTiles(maskedCards);

        // Hide/show Add Card form and Add Card button
        if (maskedCards.length > 0) {
            $("#addCardForm").hide();
            $("#addCardBtnWrap").show(); // <-- show the Add Card button
        } else {
            $("#addCardForm").show();
            $("#addCardBtnWrap").hide(); // <-- hide the button if no cards
        }
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        CallLog(
            "\n GetSRC Profile - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "GetSRC Profile Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    );
    getSrcProfilePromise
        .then(promiseResolvedHandler)
        .catch(promiseRejectedHandler);
}

// --- Card rendering helper ---
function renderCardTiles(maskedCards) {
    const $container = $("#cardList").empty();
    maskedCards.forEach((card) => {
        const descriptor = card.digitalCardData?.descriptorName || "Card";
        const last4 = card.panLastFour;
        const srcId = card.srcDigitalCardId;
        const cardBrand =
            card.paymentCardArtUri &&
            card.paymentCardArtUri.toLowerCase().includes("visa")
                ? "visa"
                : "mastercard";
        // You can make this smarter by looking for card.artUri or card.digitalCardData.artUri

        // Example with MC/visa logo, feel free to expand
        const cardLogo =
            cardBrand === "visa"
                ? "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                : "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png";

        const html = `
        <div class="col">
          <div class="card card-selectable mb-2" data-card-id="${srcId}">
            <div class="card-body d-flex align-items-center">
              <img src="${cardLogo}" class="me-3" style="width: 38px" alt="${cardBrand.toUpperCase()}" />
              <div>
                <div class="fw-bold">${descriptor}</div>
                <div class="text-muted small">**** ${last4}</div>
              </div>
              <div class="ms-auto">
                <input type="radio" name="selectedCard" value="${srcId}" class="form-check-input" />
              </div>
            </div>
          </div>
        </div>
        `;
        $container.append(html);
    });

    // Selection logic
    $(".card-selectable").on("click", function () {
        $(".card-selectable").removeClass("selected");
        $(this).addClass("selected");
        $(this).find("input[type=radio]").prop("checked", true);
        window.selectedCardId = $(this).data("card-id");

        // Show actions when card is selected
        $("#cardActionsBar").show();
        $("#checkoutBar").show();
    });

    // Hide actions if no card is selected (or on refresh)
    if (!$(".card-selectable.selected").length) {
        $("#cardActionsBar").hide();
        $("#checkoutBar").hide();
    }
}

function IdentityLookup() {
    stats("IDENTITY LOOKUP");
    showLoader();
    var sampleIdentityLookupParams = {
        consumerIdentity: {
            identityType: "EMAIL_ADDRESS",
            identityValue: $("#email").val(),
        },
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        console.log("promiseResolvedHandler", payload);

        CallLog(
            "\n IdentityLookup - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        if (payload.consumerPresent) {
            goToTab("#initiate"); // Bootstrap way!
            showToast(
                "Your email has been verified. Identity Lookup was successful!",
                "success"
            );
        } else {
            showToast(
                "Email ID not found. Identity Lookup unsuccessful!",
                "danger"
            );
        }
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        console.log("promiseRejectedHandler", payload);
        // add error handler logic here
        CallLog(
            "\n IdentityLookup - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Identity Lookup Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    showLoader();
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
        console.log("promiseResolvedHandler", payload);
        // add success handler logic here
        CallLog(
            "\n InitiateIdentityValidation - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        showToast(
            "OTP has been sent successfully. Please check your selected channel. Initiate Identity Validation successful!",
            "success"
        );
        goToTab("#otpBox"); // Go to "Validate OTP" tab
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        console.log("promiseRejectedHandler", payload);
        // add error handler logic here
        CallLog(
            "\n InitiateIdentityValidation - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Unable to send OTP to your selected channel. Initiate Identity Validation failed: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    showLoader();
    console.log("CompleteIdentityValidation", $("#otp").val());
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
        showToast(
            "OTP verified! Complete Identity Validation successful! You may proceed to the next step.",
            "success"
        );
        identityValidationSuccess = true;
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n CompleteIdentityValidation - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "OTP verification failed. Please try again. Complete Identity Validation Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        identityValidationSuccess = false;
        hideLoader();
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
                if (typeof setEncryptedCardTooltip === "function")
                    setEncryptedCardTooltip();
            }
            console.log(result);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function Checkout() {
    stats("NEW USER CHECKOUT");
    showLoader();
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
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),
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
        consumerEmailAddressRequested: $("#consumerEmailAddressRequested").is(
            ":checked"
        ),
        consumerNameRequested: $("#consumerNameRequested").is(":checked"),
        consumerPhoneNumberRequested: $("#consumerPhoneNumberRequested").is(
            ":checked"
        ),
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
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),

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
        showToast("New User Checkout SDK call successful!", "success");
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n New User Checkout - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "New User Checkout Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        if (inlineDCF) {
            dismissCheckoutIframe();
        } else {
            window.childSrcWindow.close();
        }
        hideLoader();
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
    showLoader();
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

        console.log("authenticationPreferences", authenticationPreferences);
    }

    if ($("input[name='tasAuth']").is(":checked")) {
        var tafParams = {
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),
            authenticationPreferences: {
                payloadRequested: "AUTHENTICATED", // Add taf-specific authentication preferences
            },
        };
    }

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
        consumerEmailAddressRequested: $("#consumerEmailAddressRequested").is(
            ":checked"
        ),
        consumerNameRequested: $("#consumerNameRequested").is(":checked"),
        consumerPhoneNumberRequested: $("#consumerPhoneNumberRequested").is(
            ":checked"
        ),
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
            acquirerMerchantId: $("#acquirerMerchantId").val(),
            acquirerBIN: $("#acquirerBin").val(),
            merchantCategoryCode: $("#merchantCategoryCode").val(),
            merchantCountryCode: $("#merchantCountryCode").val(),
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
        srcDigitalCardId: window.selectedCardId, // <-- Use the global
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
        showToast("Return User Checkout SDK call successful!", "success");
        hideLoader();
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
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Return User Checkout Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    console.log("validateDcfActionCode", checkoutResponse);
    if (inlineDCF) {
        dismissCheckoutIframe();
    } else {
        window.childSrcWindow.close();
    }
    if (checkoutResponse.dcfActionCode == "COMPLETE") {
        console.log(
            "checkoutResponse.dcfActionCode",
            checkoutResponse.dcfActionCode
        );
        PrintServerSideAPICallInfo(checkoutResponse);
        playSonic();

        // Show modal asking user for choice before API call
        $("#chooseCheckoutApiModal").modal("show");

        // Remove previous click handlers to avoid multiple triggers
        $("#btnUseSdkApi")
            .off("click")
            .on("click", function () {
                $("#chooseCheckoutApiModal").modal("hide");
                callCheckoutBackendAPI(checkoutResponse); // original behavior
            });

        $("#btnUseStandaloneApi")
            .off("click")
            .on("click", function () {
                $("#chooseCheckoutApiModal").modal("hide");
                showToast(
                    "You have chosen to perform the standalone API call manually. Please copy credentials from the logs below.",
                    "info"
                );
            });

        // callCheckoutBackendAPI(checkoutResponse);
        // if ($("input[name='IndicatorCheckout']:checked").val() == "FULL") {
        //     try {
        //         var encryptedPayload =
        //             checkoutResponse.checkoutResponse.encryptedPayload;
        //         var encryptedKey = $("#encprivatekey").val();
        //         console.log("Encrypted Payload :");
        //         console.log(encryptedPayload);
        //         decrypt(encryptedPayload, encryptedKey, "RSA-OAEP-256");
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }
        //VerifySignature(checkoutResponse.checkoutResponseSignature);
    } else if (checkoutResponse.dcfActionCode == "CHANGE_CARD") {
        console.log(
            "unbindAppInstance : " + checkoutResponse.unbindAppInstance
        );
        if (checkoutResponse.unbindAppInstance) {
            // Define response handlers
            function promiseResolvedHandler(payload) {
                // add success handler logic here
                console.log("unbindAppInstance - Successful");
                showToast("Unbind App Instance successful!", "success");
            }
            function promiseRejectedHandler(payload) {
                // add error handler logic here
                console.log("unbindAppInstance - failed");
                let errMsg =
                    payload && payload.message
                        ? payload.message
                        : "Unknown error";
                showToast(
                    "Unbind App Instance failed: " +
                        errMsg +
                        ". Check logs for more details.",
                    "danger"
                );
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

function callCheckoutBackendAPI(checkoutResponse) {
    let requestData = {
        srcClientId: $("#clientid").val(),
        srcDpaId: $("#dpaid").val(),
        srcCorrelationId: checkoutResponse.checkoutResponse.srcCorrelationId,
        srcDigitalCardId:
            checkoutResponse.checkoutResponse.maskedCard.srcDigitalCardId,
    };
    CallLog("\n Checkout API Call - Request Payload \n");
    CallLog("\n" + JSON.stringify(requestData, undefined, 4) + "\n");

    showLoader();
    $.ajax({
        url: SERVER_URL + `/transaction/credentials`,
        type: "POST",
        headers: {
            "X-Src-Cx-Flow-Id": "",
            "X-Src-Response-Host": "",
        },
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function (response) {
            console.log("Response:", response);

            CallLog(
                "\n Checkout API Call - \n" +
                    JSON.stringify(response, undefined, 4) +
                    "\n"
            );
            showToast("Checkout API Call successful!", "success");
            hideLoader();
            callConfirmationBackendAPI(checkoutResponse);
        },
        error: function (jqXHR) {
            hideLoader();
            let errorResponse;
            try {
                errorResponse = JSON.parse(jqXHR.responseText); // this fails for plain strings
            } catch (e) {
                console.error("Failed to parse error response as JSON:", e);
                errorResponse = jqXHR.responseText; // fallback to raw text
            }
            console.log("Error Response:", errorResponse);

            CallLog(
                "\n Checkout API Call - Rejected - \n" +
                    JSON.stringify(errorResponse, undefined, 4) +
                    "\n"
            );
            let errMsg =
                errorResponse && errorResponse
                    ? errorResponse
                    : "Unknown error";
            showToast(
                "Checkout API Call Rejected: " +
                    errMsg +
                    ". Check logs for more details.",
                "danger"
            );
        },
        complete: function () {
            hideLoader();
        },
    });
}

function callConfirmationBackendAPI(checkoutResponse) {
    let requestData = {
        srcClientId: $("#clientid").val(),
        srcDpaId: $("#dpaid").val(),
        srcCorrelationId: checkoutResponse.checkoutResponse.srcCorrelationId,
        serviceId: $("#serviceId").val(),
        srciTransactionId: checkoutResponse.checkoutResponse.srciTransactionId,
        confirmationData: {
            checkoutEventType: "07",
            checkoutEventStatus: "01",
            confirmationStatus: "01",
            confirmationReason: "Order Successfully Created",
            confirmationTimestamp: "2025-02-26T10:31:47Z",
            networkAuthorizationCode: "6019503940020912",
            networkTransactionIdentifier: "60195039400209",
            paymentNetworkReference: "543215465132123140",
            assuranceData: {
                VerificationType: "CARDHOLDER",
                VerificationEntity: 3,
                VerificationMethod: "01",
                VerificationResults: "01",
                VerificationEvent: "02",
            },
            transactionAmount: {
                transactionAmount: $("#txnAmount").val(),
                transactionCurrencyCode: $("#txnCurrency").val(),
            },
        },
    };

    CallLog("\n Confirmation API Call - Request Payload \n");
    CallLog("\n" + JSON.stringify(requestData, undefined, 4) + "\n");

    showLoader();
    $.ajax({
        url: SERVER_URL + `/confirmations`,
        type: "POST",
        headers: {
            "X-SRC-CX-FLOW-ID": "",
        },
        contentType: "application/json",
        data: JSON.stringify(requestData),
         success: function (response, textStatus, jqXHR) {
            console.log("Response:", response);

            if (jqXHR.status === 204) {
                CallLog(
                    "\n Confirmation API Call - \n" +
                        "Success - No Content (204)" +
                        "\n"
                );
                showToast("Confirmation API Call successful!", "success");
            } else {
                CallLog(
                    "\n Checkout API Call - \n" +
                        JSON.stringify(response, undefined, 4) +
                        "\n"
                );
                showToast("Confirmation API Call successful!", "success");
            }
            hideLoader();
        },
        error: function (jqXHR) {
            hideLoader();
            let errorResponse;
            try {
                errorResponse = JSON.parse(jqXHR.responseText); // this fails for plain strings
            } catch (e) {
                console.error("Failed to parse error response as JSON:", e);
                errorResponse = jqXHR.responseText; // fallback to raw text
            }
            console.log("Error Response:", errorResponse);

            CallLog(
                "\n Confirmation API Call - Rejected - \n" +
                    JSON.stringify(errorResponse, undefined, 4) +
                    "\n"
            );
            let errMsg =
                errorResponse && errorResponse
                    ? errorResponse
                    : "Unknown error";
            showToast(
                "Confirmation API Call Rejected: " +
                    errMsg +
                    ". Check logs for more details.",
                "danger"
            );
        },
        complete: function () {
            hideLoader();
        },
    });
}

function PrintServerSideAPICallInfo(payload) {
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

// Function to show loader
function showLoader() {
    $("#spinner").addClass("loading");
}

// Function to hide loader
function hideLoader() {
    $("#spinner").removeClass("loading");
}

function EnrollCard() {
    stats("ENROLL CARD");
    showLoader();
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
        CallLog(
            "\n Enroll Card - \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        showToast("Enroll Card successful!", "success");
        resetAddCardForm();
        GetSRCProfile(); // <-- refresh card tiles
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n Enroll Card - Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Enroll Card Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    showLoader();
    if (!window.selectedCardId) {
        MyAlert("Please select card first.");
        return;
    }
    var sampleDeleteCardParams = {
        srcDigitalCardId: window.selectedCardId, // required
    };

    // Define response handlers
    function promiseResolvedHandler(payload) {
        CallLog(
            "\n Delete Card - \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        showToast("Delete Card successful!", "success");
        GetSRCProfile(); // <-- re-render tiles instead of manipulating #cards
        hideLoader();
    }
    function promiseRejectedHandler(payload) {
        // add error handler logic here
        CallLog(
            "\n Delete Card Rejected - \n" +
                JSON.stringify(payload, undefined, 4) +
                "\n"
        );
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Delete Card Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    showLoader();
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
        showToast("Unbind App Instance successful!", "success");
        setStep(1);
        hideLoader();
        // location.reload(); // reload the page to reset the state
    }
    function c2pSignoutPromiseRejectedHandler(payload) {
        CallLog("\n Unbind App Instance - Rejected \n");
        CallLog(
            "\n Response : \n" + JSON.stringify(payload, undefined, 4) + "\n"
        );
        //$('body').pleaseWait('stop');
        let errMsg =
            payload && payload.message ? payload.message : "Unknown error";
        showToast(
            "Unbind App Instance Rejected: " +
                errMsg +
                ". Check logs for more details.",
            "danger"
        );
        hideLoader();
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
    console.log("playSonic called");
    // Show the Bootstrap modal instead of manipulating classes
    $("#animationStep").modal("show");

    // Play the sonic sound
    let mc_component = document.getElementById("mc-sonic");
    mc_component.play();

    // When sound completes, call handler
    document.addEventListener("sonicCompletion", onCompletion);

    // Hide underlying elements
    $("#src").hide();
    $("#srcFooter").hide();
}

function onCompletion() {
    // Hide modal the Bootstrap way
    $("#animationStep").modal("hide");

    // Restore original UI
    $("#src").show();
    $("#srcFooter").show();
}

function goToTab(tabId) {
    // tabId: string, e.g. "#initiate" or "#otp"
    var tabTrigger = document.querySelector('[data-bs-target="' + tabId + '"]');
    if (tabTrigger) {
        var tab = new bootstrap.Tab(tabTrigger);
        tab.show();
    }
}

function checkAndSetStepForInit() {
    console.log("initSuccess:", initSuccess);
    console.log("recognizedSuccess:", recognizedSuccess);
    if (initSuccess || recognizedSuccess) {
        setStep(2);
    } else {
        showToast(
            "Please complete Init or IsRecognized steps before proceeding.",
            "warning"
        );
        CallLog("Blocked: Init or IsRecognized not completed.\n");
    }
}

function checkAndSetStepAfterValidation() {
    console.log("initSuccess:", initSuccess);
    console.log("recognizedSuccess:", recognizedSuccess);
    console.log("identityValidationSuccess:", identityValidationSuccess);

    if (identityValidationSuccess) {
        setStep(4);
        GetSRCProfile();
    } else {
        showToast(
            "Please verify your identity before processing to the next step.",
            "warning"
        );
        CallLog("Blocked: One or more steps incomplete.\n");
    }
}

$(document).ready(function () {
    // Fetch configuration values from the backend
    $.get(SERVER_URL + "/api/config", function (data) {
        // Example: set input values if present in response
        if (data.srcClientId) {
            $("#clientid").val(data.srcClientId);
        }
        if (data.srcDpaId) {
            $("#dpaid").val(data.srcDpaId);
        }
        if (data.serviceId) {
            $("#serviceId").val(data.serviceId);
        }
        // You can add as many fields as needed
    });
});
