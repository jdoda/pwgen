const $ = document.getElementById.bind(document);
const SETTINGS = ["length", "charset", "required", "index"];
const DEFAULTS = {
    "*" : {
        "length" : "14",
        "charset" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
        "required" : "",
        "index" : "0"
    }
};

let generatePassword = (passphrase, domain, index, length, charset, required) => {
    let encoder = new TextEncoder();
    if (index !== "0") {
        domain += index;
    }
    
    window.crypto.subtle.importKey(
        "raw",
        encoder.encode(passphrase),
        {
            name: "PBKDF2",
        },
        false,
        ["deriveBits"]
    )
    .then((key) => {
        return window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: encoder.encode(domain),
                iterations: 100000,
                hash: {name: "SHA-256"},
            },
            key,
            length * 32
        )
    })
    .then((bits) => {
        let ints = new Uint32Array(bits);
        let currentCharset = "";
        let output = "";
        
        for (let j = 0; j < ints.length; j += 1) {
            if (j < required.length && required[j].length > 0) {
                currentCharset = required[j];
            } else {
                currentCharset = charset;
            }

            output += currentCharset.charAt(Math.floor(ints[j] * currentCharset.length / Math.pow(2, 32)));
        }
        
        $("password").value = output
        $("password").select();
    })
    .catch((error) => {
        console.error(error);
    });
};

let loadDomainSetting = (domain, setting) => {
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

let loadAllDomainSettings = () => {
    SETTINGS.forEach(function (setting) {
        $(setting).value = loadDomainSetting($("domain").value.trim(), setting);
    });
};

let saveDomainSetting = (domain, setting, value) => {
    if (value === DEFAULTS[setting]) {
        localStorage.removeItem("pwgen." + domain + "." + setting);
    } else {
        localStorage.setItem("pwgen." + domain + "." + setting, value);
    }
};

let saveDomainSettingForInput = () => {
    saveDomainSetting($("domain").value.trim(), this.id, this.value);
};

let onGenerateButtonClick = () => {
    if ($("passphrase").value !== $("confirm").value) {
        $("password").value = ("Passphrases didn't match");
    } else {
        generatePassword($("passphrase").value, $("domain").value.trim(), $("index").value.trim(), parseInt($("length").value, 10), $("charset").value.trim(), $("required").value.trim().split(/,\s*/));
    }
};

// Hook up callbacks
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

window.addEventListener("load", () => {
    $("generate").addEventListener("click", onGenerateButtonClick);
    $("domain").addEventListener("input", loadAllDomainSettings);
    SETTINGS.forEach((setting) => {
        $(setting).addEventListener("input", saveDomainSettingForInput);
    });
    loadAllDomainSettings();
});



