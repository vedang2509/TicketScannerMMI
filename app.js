let scanner = null;
let processing = false;

const card = document.getElementById("resultCard");
const statusTitle = document.getElementById("statusTitle");
const statusIcon = document.getElementById("statusIcon");
const guestName = document.getElementById("guestName");
const scanDetails = document.getElementById("scanDetails");

const reader = document.getElementById("reader");
const scanBtn = document.getElementById("scanBtn");
const placeholder = document.getElementById("cameraPlaceholder");
const scannerStatus = document.getElementById("scannerStatus");

scanBtn.addEventListener("click", startScanner);

async function startScanner() {

    if (scanner) return;

    processing = false;

    scanBtn.style.display = "none";
    placeholder.style.display = "none";
    reader.style.display = "block";

    scannerStatus.textContent = "Scanning...";

    scanner = new Html5Qrcode("reader");

    try {

await scanner.start(
    { facingMode: "environment" },
    {
        fps: 10,

        qrbox: {
            width: 280,
            height: 280
        },

        aspectRatio: 1,

        rememberLastUsedCamera: true
    },
    onScan
);

    } catch (err) {

        console.error(err);

        closeScanner();

        showConnectionError();

    }

}

async function closeScanner() {

    try {

        if (scanner) {

            await scanner.stop();
            await scanner.clear();

        }

    } catch (e) {

        console.log(e);

    }

    scanner = null;

    reader.style.display = "none";
    placeholder.style.display = "block";

    scanBtn.style.display = "block";
    scanBtn.textContent = "📷 Scan Next Ticket";

    scannerStatus.textContent = "Ready";

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

    await closeScanner();

    processing = false;

}

function showChecking() {

    card.className = "result-card waiting";

    statusIcon.textContent = "⏳";
    statusTitle.textContent = "Checking Ticket";

    guestName.textContent = "";

    scanDetails.innerHTML = `
        <p>Please wait while we validate the booking...</p>
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

        const remaining = result.totalTickets - result.scanCount;

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
