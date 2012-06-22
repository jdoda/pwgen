function getPassword() {
    var passphrase = document.getElementById("passphrase").value;
    var confirm = document.getElementById("confirm").value;
    var nickname = document.getElementById("nickname").value;
    var password = document.getElementById("password");
    
    if (passphrase != confirm) {
        password.value = ("Passphrases didn't match");
    } else {
        var input = passphrase + nickname;
        var hasher = new jsSHA(input, "ASCII");
        for (var i = 0; i < 999; i++) {
            hasher = new jsSHA(hasher.getHash("SHA-256", "HEX"), "HEX");
        }
        var output = hasher.getHash("SHA-256", "B64").slice(0, 12);
        output = output.replace("+", "-");
        output = output.replace("/", "_");
        password.value = output;
    }
}
