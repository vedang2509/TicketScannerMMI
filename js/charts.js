const pie = new Chart(

document.getElementById("ticketChart"),

{

type:"pie",

data:{

labels:[
"Adult",
"Child",
"Youth",
"Meet&Greet",
"Group5",
"Group10"
],

datasets:[{

data:[420,65,32,18,45,12]

}]

}

});

const line = new Chart(

document.getElementById("timelineChart"),

{

type:"line",

data:{

labels:[
"10:00",
"10:30",
"11:00",
"11:30",
"12:00"
],

datasets:[{

label:"Check-ins",

data:[15,52,120,188,284],

fill:false,

tension:.3

}]

}

});
