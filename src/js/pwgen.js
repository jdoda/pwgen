function getPassword() {
    var characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    var passphrase = document.getElementById("passphrase").value;
    var confirm = document.getElementById("confirm").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password");
    
    if (passphrase != confirm) {
        password.value = ("Passphrases didn't match");
    } else {
        bits = sjcl.misc.pbkdf2(passphrase, nickname);
        output = constructPassword(sjcl.codec.hex.fromBits(bits), characterSet);
        password.value = output;
    }
}

function constructPassword(hex, characterSet) {
    var output = "", i
    for (i = 0; i < hex.length; i += 2) {
        var highBits = parseInt(hex.charAt(i), 16) << 4;
        var lowBits = parseInt(hex.charAt(i+1), 16)
        var index = highBits + lowBits;
        index = Math.floor(index * characterSet.length / 256);
        output += characterSet.charAt(index);
    }
    return output;
}
