let progressChart = null;
let timelineChart = null;

async function loadDashboard() {

    try {

        const data = await API.dashboard();

        if (!data.success) return;

        const stats = data.stats;

        document.getElementById("bookings").textContent =
            stats.bookings;

        document.getElementById("tickets").textContent =
            stats.totalTickets;

        document.getElementById("checkedIn").textContent =
            stats.checkedIn;

        document.getElementById("remaining").textContent =
            stats.remaining;

        document.getElementById("attendancePercent").textContent =
            stats.attendance + "%";

        document.getElementById("attendanceBar").style.width =
            stats.attendance + "%";

        drawProgressChart(stats);

    }

    catch (err) {

        console.error(err);

    }

}

async function loadRecent() {

    const data = await API.recent();

    if (!data.success) return;

    const tbody =
        document.getElementById("recentTable");

    tbody.innerHTML = "";

    data.recent.forEach(scan => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${formatTime(scan.time)}</td>

            <td>${scan.reference}</td>

            <td>${scan.name}</td>

            <td>${scan.result}</td>

        `;

        tbody.appendChild(row);

    });

}

function drawProgressChart(stats) {

    const ctx =
        document
            .getElementById("progressChart")
            .getContext("2d");

    if (progressChart)
        progressChart.destroy();

    progressChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Checked In",

                "Remaining"

            ],

            datasets: [{

                data: [

                    stats.checkedIn,

                    stats.remaining

                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

function drawTimelineChart() {

    const ctx =
        document
            .getElementById("timelineChart")
            .getContext("2d");

    timelineChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Check-ins",

                data: []

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

async function search() {

    const query =
        document
            .getElementById("searchBox")
            .value
            .trim();

    if (!query) {

        document
            .getElementById("searchResults")
            .innerHTML = "";

        return;

    }

    const data =
        await API.search(query);

    if (!data.success) return;

    const container =
        document.getElementById("searchResults");

    container.innerHTML = "";

    data.results.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "search-card";

        div.innerHTML = `

            <strong>${item.name}</strong><br>

            ${item.reference}<br>

            ${item.scanCount}/${item.totalTickets}

        `;

        container.appendChild(div);

    });

}

function formatTime(date) {

    return new Date(date)
        .toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

        });

}

document
    .getElementById("searchBox")
    .addEventListener("input", search);

drawTimelineChart();

loadDashboard();

loadRecent();

setInterval(() => {

    loadDashboard();

    loadRecent();

}, 5000);
