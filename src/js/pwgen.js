function getPassword() {
    var passphrase = document.getElementById("passphrase").value;
    var confirm = document.getElementById("confirm").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password");
    
    if (passphrase != confirm) {
        password.value = ("Passphrases didn't match");
    } else {
        bits = sjcl.misc.pbkdf2(nickname, passphrase)
        output = sjcl.codec.base64.fromBits(bits)
        password.value = output;
    }
}
