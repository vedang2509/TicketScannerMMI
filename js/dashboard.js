window.onload = () => {

    loadDashboard();

};

function loadDashboard(){

    document.getElementById("bookings").innerText = 512;
    document.getElementById("tickets").innerText = 743;
    document.getElementById("checkedIn").innerText = 284;
    document.getElementById("remaining").innerText = 459;

    document.querySelector("#lastUpdated span").innerText =
        new Date().toLocaleTimeString();

}
