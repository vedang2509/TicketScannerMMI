
let scanner;

function startScanner(){

scanner = new Html5Qrcode("reader");

scanner.start(

{ facingMode: "environment" },

{

fps:10,

qrbox:250

},

onScan

);

}

async function onScan(qrText) {

  let reference = qrText;

  try {
    const data = JSON.parse(qrText);

    if (data.reference) {
      reference = data.reference;
    }
  } catch (e) {
    // QR isn't JSON, treat it as a plain reference
  }

  console.log("Reference:", reference);

  await scanner.stop();

  document.getElementById("message").innerHTML = "Checking...";

  fetch(
    CONFIG.API_URL + "?reference=" + encodeURIComponent(reference)
  )
    .then(r => r.json())
    .then(showResult)
    .catch(e => {
      document.getElementById("message").innerHTML = e;
      setTimeout(startScanner, 2000);
    });

}
function showResult(result){

const div=document.getElementById("message");

if(result.success){

div.style.background="#C8E6C9";

div.innerHTML=`

<h2>✅ ${result.name}</h2>

Reference<br>

${result.reference}

<br><br>

${result.scanCount} / ${result.totalTickets}

<br><br>

${result.status}

`;

}
else{

div.style.background="#FFCDD2";

div.innerHTML=`

<h2>❌ ${result.message}</h2>

`;

}

setTimeout(startScanner,2500);

}

startScanner();
