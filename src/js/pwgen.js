var pwgen = (function () {
    "use strict";

    var $ = document.getElementById.bind(document);

    var defaults = {
        charset : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`~!@#$%^&*()-=_+[]{}\\|;':\",.<>/?",
        required : "",
        index : "0",
        length : "16"
    };

    var generatePassword = function () {
        if ($("passphrase").value !== $("confirm").value) {
            $("password").value = ("Passphrases didn't match");
        } else {
            var bits = sjcl.misc.pbkdf2($("passphrase").value, $("nickname").value + $("index").value);
            var hex = sjcl.codec.hex.fromBits(bits), output = "", charset = $("charset").value, i;

            var highBits, lowBits, index;
            for (i = 0; i < hex.length; i += 2) {
                highBits = parseInt(hex.charAt(i), 16) << 4;
                lowBits = parseInt(hex.charAt(i + 1), 16);
                index = highBits + lowBits;
                index = Math.floor(index * charset.length / 256);
                output += charset.charAt(index);
            }
            $("password").value = output.substr(0, parseInt($("length").value, 10));
        }
    };

    var loadDomainSetting = function (domain, setting) {
        var value = localStorage.getItem("pwgen." + domain + "." + setting);
        if (value === null) {
            value = defaults[setting];
        }
        return value;
    };

    var loadAllDomainSettings = function () {
        ["length", "charset", "required", "index"].forEach(function (setting) {
            $(setting).value = loadDomainSetting($("nickname").value, setting);
        });
    };

    var saveDomainSetting = function (domain, setting, value) {
        localStorage.setItem("pwgen." + domain + "." + setting, value);
    };

    var saveDomainSettingForInput = function () {
        saveDomainSetting($("nickname").value, this.id, this.value);
    };

    return {
        "generatePassword" : generatePassword,
        "loadAllDomainSettings" : loadAllDomainSettings,
        "saveDomainSettingForInput" : saveDomainSettingForInput
    };
}());

window.addEventListener("load", function () {
    "use strict";

    var $ = document.getElementById.bind(document);

    $("generate").addEventListener("click", pwgen.generatePassword);
    $("nickname").addEventListener("input", pwgen.loadAllDomainSettings);
    ["length", "charset", "required", "index"].forEach(function (input) {
        $(input).addEventListener("input", pwgen.saveDomainSettingForInput);
    });

    pwgen.loadAllDomainSettings();
});
