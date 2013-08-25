(function () {
    "use strict";

    var $ = document.getElementById.bind(document);

    var SETTINGS = ["length", "charset", "required", "index"];
    var DEFAULTS;

    var generatePassword = function (passphrase, domain, index, length, charset, required) {
        var bits = sjcl.misc.pbkdf2(passphrase, domain + index);
        var hex = sjcl.codec.hex.fromBits(bits), output = "", i;

        var highBits, lowBits, byte, currentCharset;
        for (i = 0; i < hex.length; i += 2) {
            if (i / 2 < required.length) {
                currentCharset = required[i / 2];
            } else {
                currentCharset = charset;
            }

            highBits = parseInt(hex.charAt(i), 16) << 4;
            lowBits = parseInt(hex.charAt(i + 1), 16);
            byte = highBits + lowBits;
            output += currentCharset.charAt(Math.floor(byte * currentCharset.length / 256));
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

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'defaults.json', true);
        xhr.onload = function(e) {
            if (this.status == 200) {
                DEFAULTS = JSON.parse(this.responseText);
                loadAllDomainSettings();
            }
        };
        xhr.send();
    });
}());


