/**
 * charts.js
 * Handles all dashboard charts
 */

let progressChart = null;
let timelineChart = null;


/* ==========================================
   Attendance Doughnut
========================================== */

function initProgressChart() {

    const ctx = document
        .getElementById("progressChart")
        .getContext("2d");

    progressChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Checked In",

                "Remaining"

            ],

            datasets: [{

                data: [0, 0],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 500

            },

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


function updateProgressChart(checkedIn, remaining) {

    if (!progressChart) return;

    progressChart.data.datasets[0].data = [

        checkedIn,

        remaining

    ];

    progressChart.update();

}


/* ==========================================
   Timeline
========================================== */

function initTimelineChart() {

    const ctx = document
        .getElementById("timelineChart")
        .getContext("2d");

    timelineChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Check-ins",

                data: [],

                tension: .35,

                fill: false

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 500

            }

        }

    });

}


function updateTimelineChart(labels, values) {

    if (!timelineChart) return;

    timelineChart.data.labels = labels;

    timelineChart.data.datasets[0].data = values;

    timelineChart.update();

}
