let scanner;
let processing = false;

const card = document.getElementById("resultCard");
const statusTitle = document.getElementById("statusTitle");
const statusIcon = document.getElementById("statusIcon");
const guestName = document.getElementById("guestName");
const scanDetails = document.getElementById("scanDetails");

function startScanner() {

    scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: {
                width: 280,
                height: 280
            }
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

    } catch {

        // Plain text QR

    }

    showChecking();

    try {

        const response = await fetch(
            CONFIG.API_URL +
            "?reference=" +
            encodeURIComponent(reference)
        );

        const result = await response.json();

        showResult(result);

    } catch {

        showConnectionError();

    }

    setTimeout(() => {

        processing = false;

    }, 1200);

}

function showChecking() {

    card.className = "result-card waiting";

    statusIcon.textContent = "⏳";
    statusTitle.textContent = "Checking Ticket...";

    guestName.textContent = "";

    scanDetails.innerHTML = `
        <p>Please wait while we validate the booking.</p>
    `;

}

function showConnectionError() {

    card.className = "result-card error";

    statusIcon.textContent = "📡";
    statusTitle.textContent = "Connection Error";

    guestName.textContent = "";

    scanDetails.innerHTML = `
        Unable to contact the server.
    `;

}

function showResult(result) {

    const now = new Date().toLocaleString("en-IE");

    if (result.success) {

        if ("vibrate" in navigator)
            navigator.vibrate(200);

        const remaining =
            result.totalTickets - result.scanCount;

        card.className = "result-card success";

        statusIcon.textContent = "✅";
        statusTitle.textContent = "Check-In Successful";

        guestName.textContent = result.name;

        scanDetails.innerHTML = `
            <table class="result-table">

                <tr>
                    <td>Reference</td>
                    <td><strong>${result.reference}</strong></td>
                </tr>

                <tr>
                    <td>Checked In</td>
                    <td>${result.scanCount} / ${result.totalTickets}</td>
                </tr>

                <tr>
                    <td>Remaining</td>
                    <td>${remaining}</td>
                </tr>

                <tr>
                    <td>Status</td>
                    <td>${result.status}</td>
                </tr>

                <tr>
                    <td>Scanned</td>
                    <td>${now}</td>
                </tr>

            </table>
        `;

    } else {

        if ("vibrate" in navigator)
            navigator.vibrate([200, 100, 200]);

        card.className = "result-card error";

        statusIcon.textContent = "❌";
        statusTitle.textContent = "Check-In Failed";

        guestName.textContent = "";

        scanDetails.innerHTML = `
            <h3>${result.message}</h3>
        `;

    }

}

startScanner();
