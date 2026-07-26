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

function showResult(result) {

    const div = document.getElementById("message");

    if (result.success) {

        div.style.background = "#2E7D32";
        div.style.color = "#fff";

        div.innerHTML = `
            <h2>✅ CHECK-IN SUCCESSFUL</h2>

            <h3>${result.name}</h3>

            <p><strong>${result.reference}</strong></p>

            <h2>${result.scanCount} / ${result.totalTickets}</h2>

            <p>${result.status}</p>
        `;

    } else {

        div.style.background = "#C62828";
        div.style.color = "#fff";

        div.innerHTML = `
            <h2>❌ ${result.message}</h2>
        `;
    }
}

startScanner();
