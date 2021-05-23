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