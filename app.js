let scanner;
let processing = false;

function startScanner() {

    scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScan
    );

}

async function onScan(qrText) {

    if (processing) return;

    processing = true;

    let reference = qrText;

    try {

        const data = JSON.parse(qrText);

        if (data.reference)
            reference = data.reference;

    } catch (e) {
        // Plain text QR
    }

    document.getElementById("message").innerHTML = "Checking...";

    try {

        const response = await fetch(
            CONFIG.API_URL +
            "?reference=" +
            encodeURIComponent(reference)
        );

        const result = await response.json();

        showResult(result);

    } catch (err) {

        document.getElementById("message").innerHTML =
            "Connection Error";

    }

    setTimeout(() => {

        processing = false;

        document.getElementById("message").innerHTML =
            "Ready to Scan";

    }, 2000);

}

startScanner();
