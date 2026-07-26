/**
 * dashboard.js
 * Jallosh Dashboard
 */

let searchTimer = null;

const UI = {

    bookings: document.getElementById("bookings"),
    tickets: document.getElementById("tickets"),
    checkedIn: document.getElementById("checkedIn"),
    remaining: document.getElementById("remaining"),

    attendancePercent: document.getElementById("attendancePercent"),
    attendanceBar: document.getElementById("attendanceBar"),

    recentTable: document.getElementById("recentTable"),

    searchBox: document.getElementById("searchBox"),
    searchResults: document.getElementById("searchResults"),

    status: document.getElementById("status"),
    lastUpdated: document.getElementById("lastUpdated")

};


/* ===========================================
   Dashboard
=========================================== */

async function loadDashboard() {

    const data = await API.dashboard();

    if (!data.success) {
        throw new Error("Unable to load dashboard.");
    }

    const stats = data.stats;

    UI.bookings.textContent = stats.bookings;
    UI.tickets.textContent = stats.totalTickets;
    UI.checkedIn.textContent = stats.checkedIn;
    UI.remaining.textContent = stats.remaining;

    UI.attendancePercent.textContent =
        `${stats.attendance}%`;

    UI.attendanceBar.style.width =
        `${stats.attendance}%`;

    // charts.js
    updateProgressChart(
        stats.checkedIn,
        stats.remaining
    );

}


/* ===========================================
   Recent Check-ins
=========================================== */

async function loadRecent() {

    const data = await API.recent();

    if (!data.success) {
        throw new Error("Unable to load recent scans.");
    }

    UI.recentTable.innerHTML = "";

    data.recent.forEach(scan => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${formatTime(scan.time)}</td>
            <td>${scan.reference}</td>
            <td>${scan.name}</td>
            <td>${getBadge(scan.result)}</td>
        `;

        UI.recentTable.appendChild(row);

    });

}


/* ===========================================
   Search
=========================================== */

function searchDelayed() {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(search, 300);

}

async function search() {

    const query = UI.searchBox.value.trim();

    if (!query) {

        UI.searchResults.innerHTML = "";

        return;

    }

    try {

        const data = await API.search(query);

        if (!data.success) return;

        UI.searchResults.innerHTML = "";

        data.results.forEach(item => {

            const card = document.createElement("div");

            card.className = "search-card";

            card.innerHTML = `
                <strong>${item.name}</strong><br>
                ${item.reference}<br>
                Checked In:
                <strong>${item.scanCount}/${item.totalTickets}</strong>
            `;

            UI.searchResults.appendChild(card);

        });

    }

    catch (err) {

        console.error(err);

    }

}


/* ===========================================
   Helpers
=========================================== */

function getBadge(result) {

    let css = "success";

    switch (result) {

        case "ERROR":
            css = "danger";
            break;

        case "PARTIAL":
            css = "warning";
            break;

        case "COMPLETE":
            css = "primary";
            break;

        default:
            css = "success";

    }

    return `
        <span class="badge ${css}">
            ${result}
        </span>
    `;

}

function formatTime(date) {

    return new Date(date).toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"

    });

}

function setOnlineStatus(online) {

    if (!UI.status) return;

    UI.status.textContent =
        online ? "🟢 Live" : "🔴 Offline";

}

function updateLastRefresh() {

    if (!UI.lastUpdated) return;

    const now = new Date();

    UI.lastUpdated.textContent = now.toLocaleString("en-IE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

}


/* ===========================================
   Refresh
=========================================== */

async function refreshDashboard() {

    // Dashboard
    try {
        await loadDashboard();
        console.log("Dashboard OK");
    } catch (e) {
        console.error("Dashboard Error:", e);
    }

    // Recent
    try {
        await loadRecent();
        console.log("Recent OK");
    } catch (e) {
        console.error("Recent Error:", e);
    }

    // Status
    setOnlineStatus(true);
    updateLastRefresh();

}

/* ===========================================
   Initialise
=========================================== */

window.addEventListener("DOMContentLoaded", () => {

    UI.searchBox.addEventListener(
        "input",
        searchDelayed
    );

    // charts.js
    initProgressChart();
    initTimelineChart();

    refreshDashboard();

    setInterval(
        refreshDashboard,
        CONFIG.REFRESH_INTERVAL
    );

});
