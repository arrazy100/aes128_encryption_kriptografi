var encryption_page = document.getElementById("encryption_page");
var decryption_page = document.getElementById("decryption_page");

decryption_page.style.display = "none";

var encryption_page_btn = document.getElementById("encryption_page_btn");
var decryption_page_btn = document.getElementById("decryption_page_btn");

encryption_page_btn.addEventListener("click", function() {
    if (encryption_page_btn.style.display === "block") return;

    encryption_page.style.display = "block";
    decryption_page.style.display = "none";

    document.getElementById("footer_btn").style.display = "none";
    removeAllStep();
});

decryption_page_btn.addEventListener("click", function() {
    if (decryption_page_btn.style.display === "block") return;

    encryption_page.style.display = "none";
    decryption_page.style.display = "block";

    document.getElementById("footer_btn").style.display = "none";
    removeAllStep();
});

function copyText(id) {
    let el = document.getElementById("" + id);

    el.select();
    document.execCommand("copy");

    window.getSelection().removeAllRanges();
}

document.getElementById("skip_btn").addEventListener("click", function() {
    delay_time = 0;
    loop_delay = 0;
});

document.getElementById("top_btn").addEventListener("click", function() {
    document.getElementById("top").scrollIntoView();
});

document.getElementById("plaintext").addEventListener("input", function() {
    let el = document.getElementById("plaintext_length");
    let m_length = document.getElementById("plaintext").value.length;

    if (m_length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
        m_length = document.getElementById("plaintext").value.length;
    }

    el.innerHTML = m_length + " characters";
});

document.getElementById("key").addEventListener("input", function() {
    var el = document.getElementById("key_length");
    var m_length = document.getElementById("key").value.length;

    if (m_length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
        m_length = document.getElementById("key").value.length;
    }

    el.innerHTML = m_length + " characters";
});

document.getElementById("encrypted_text").addEventListener("input", function() {
    var el = document.getElementById("encrypted_length");
    var m_length = document.getElementById("encrypted_text").value.length;

    if (m_length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
        m_length = document.getElementById("encrypted_text").value.length;
    }

    el.innerHTML = m_length + " characters";
});

document.getElementById("decryption_key").addEventListener("input", function() {
    var el = document.getElementById("decryption_key_length");
    var m_length = document.getElementById("decryption_key").value.length;

    if (m_length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
        m_length = document.getElementById("decryption_key").value.length;
    }

    el.innerHTML = m_length + " characters";
});

function validateForm(plain_id, key_id) {
    let plain_length = document.getElementById("" + plain_id).value.length;
    let key_length = document.getElementById("" + key_id).value.length;

    if (plain_length === 16 && key_length === 16) return true;
    else return false;
}

let el = document.getElementById("plaintext_length");
let m_length = document.getElementById("plaintext").value.length;
el.innerHTML = m_length + " characters";
el = document.getElementById("key_length");
m_length = document.getElementById("key").value.length;
el.innerHTML = m_length + " characters";

el = document.getElementById("encrypted_length");
m_length = document.getElementById("encrypted_text").value.length;
el.innerHTML = m_length + " characters";
el = document.getElementById("decryption_key_length");
m_length = document.getElementById("decryption_key").value.length;
el.innerHTML = m_length + " characters";