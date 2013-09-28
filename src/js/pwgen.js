(function () {
    "use strict";

    var $ = document.getElementById.bind(document);

    var SETTINGS = ["length", "charset", "required", "index"];
    var DEFAULTS = {
        "*" : {
            "length" : "16",
            "charset" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`~!@#$%^&*()-=_+[]{}\\|;':\",.<>/?",
            "required" : "",
            "index" : "0"
        },
        
        "td.com" : {
            "length" : "8",
            "charset" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
            "required" : "",
            "index" : "0"
        }
    }

    var hexToShort = function (hex) {
        return (parseInt(hex.charAt(0), 16) << 12) + (parseInt(hex.charAt(1), 16) << 8) + (parseInt(hex.charAt(2), 16) << 4) + (parseInt(hex.charAt(3), 16));
    };
    
    var generatePassword = function (passphrase, domain, index, length, charset, required) {
        var bits = sjcl.misc.pbkdf2(passphrase, sjcl.codec.utf8String.toBits(domain + index), 10000);
        var hex = sjcl.codec.hex.fromBits(bits), output = "", i;

        var currentCharset;
        for (i = 0; i < hex.length; i += 4) {
            if (i / 4 < required.length && 
                    required[i / 4].length > 0) {
                currentCharset = required[i / 4];
            } else {
                currentCharset = charset;
            }

            output += currentCharset.charAt(Math.floor(hexToShort(hex.substr(i, 4)) * currentCharset.length / Math.pow(2, 16)));
        }
        return output.substr(0, length);
    };

    var loadDomainSetting = function (domain, setting) {
        var value = localStorage.getItem("pwgen." + domain + "." + setting);
        if (value === null) {
            if (DEFAULTS.hasOwnProperty(domain)) {
                value = DEFAULTS[domain][setting];
            } else {
                value = DEFAULTS["*"][setting];
            }
        }
        return value;
    };

    var loadAllDomainSettings = function () {
        SETTINGS.forEach(function (setting) {
            $(setting).value = loadDomainSetting($("domain").value.trim(), setting);
        });
    };

    var saveDomainSetting = function (domain, setting, value) {
        if (value === DEFAULTS[setting]) {
            localStorage.removeItem("pwgen." + domain + "." + setting);
        } else {
            localStorage.setItem("pwgen." + domain + "." + setting, value);
        }
    };

    var saveDomainSettingForInput = function () {
        saveDomainSetting($("domain").value.trim(), this.id, this.value);
    };

    var onGenerateButtonClick = function () {
        if ($("passphrase").value !== $("confirm").value) {
            $("password").value = ("Passphrases didn't match");
        } else {
            $("password").value = generatePassword($("passphrase").value, $("domain").value.trim(), $("index").value.trim(), parseInt($("length").value, 10), $("charset").value.trim(), $("required").value.trim().split(/,\s*/));
            $("password").select();
        }
    };

    // Hook up callbacks
    window.addEventListener("load", function () {
        $("generate").addEventListener("click", onGenerateButtonClick);
        $("domain").addEventListener("input", loadAllDomainSettings);
        SETTINGS.forEach(function (setting) {
            $(setting).addEventListener("input", saveDomainSettingForInput);
        });
        loadAllDomainSettings();
    });
}());


