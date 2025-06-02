// script.js - Generazione preventivo PDF con pdf-lib

// Includi pdf-lib nel tuo HTML:
// <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>

let preventivoData = {};

// Bottone calcola
const calculateBtn = document.getElementById("calculate-btn");
calculateBtn.addEventListener("click", () => {
  const rooms = +document.getElementById("rooms").value;
  const cpl = +document.getElementById("cpl").value;
  const noa = +document.getElementById("noa").value;
  const noaPrice = +document.getElementById("noa-price").value;
  const extraLocations = +document.getElementById("additional-locations").value;

  const defaultMonthly = (rooms * cpl) + (noa * noaPrice);
  const setupFee = 1000 + (extraLocations * 250);
  const total = defaultMonthly + setupFee;

  preventivoData = {
    defaultMonthly: defaultMonthly.toFixed(2) + " €",
    setupFee: setupFee.toFixed(2) + " €",
    total: total.toFixed(2) + " €",
    ambulatori: rooms,
    capoluogo: cpl === 17 ? "Capoluogo" : "No Capoluogo"
  };

  document.getElementById("default-monthly-price").textContent = preventivoData.defaultMonthly;
  document.getElementById("setup-fee").textContent = preventivoData.setupFee;
  document.getElementById("results").style.display = "block";
});

// Mostra popup per dati aggiuntivi
const popup = document.getElementById("popup-overlay");
const confirmPopup = document.getElementById("confirm-popup");
const cancelPopup = document.getElementById("cancel-popup");
const pdfBtn = document.getElementById("pdf-btn");

pdfBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

cancelPopup.addEventListener("click", () => {
  popup.style.display = "none";
});

confirmPopup.addEventListener("click", async () => {
  const struttura = document.getElementById("clinic-name").value;
  const indirizzo = document.getElementById("clinic-address").value;
  const referente = document.getElementById("contact-name").value;
  const venditore = document.getElementById("salesperson-name").value;

  popup.style.display = "none";
  await generaPDF({ struttura, indirizzo, referente, venditore });
});

// Genera PDF con pdf-lib
async function generaPDF(datiPopup) {
  const formUrl = "/template/Modello%20preventivo%20crm%20digitale.pdf"; // Cambia percorso se necessario
  const formBytes = await fetch(formUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(formBytes);
  const form = pdfDoc.getForm();

  const today = new Date();
  const scadenza = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);

  const formatDate = (d) => d.toLocaleDateString("it-IT");

  // Compila i campi del modulo PDF
  form.getTextField("nome_struttura").setText(datiPopup.struttura);
  form.getTextField("Nome_struttura1").setText(datiPopup.struttura);
  form.getTextField("Nome_referente").setText(datiPopup.referente);
  form.getTextField("Nome_sale").setText(datiPopup.venditore);
  form.getTextField("Nome_sale1").setText(datiPopup.venditore);
  form.getTextField("numero_ambulatori").setText(preventivoData.ambulatori.toString());
  form.getTextField("Cpl").setText(preventivoData.capoluogo);
  form.getTextField("Data_offerta").setText(formatDate(today));
  form.getTextField("Scadenza_offerta").setText(formatDate(scadenza));
  form.getTextField("Quota_mensile_default").setText(preventivoData.defaultMonthly);
  form.getTextField("Quota_mensile_default_2").setText(preventivoData.defaultMonthly);
  form.getTextField("Quota_scontata").setText(preventivoData.total);
  form.getTextField("Quota_mensile_scontata").setText(preventivoData.defaultMonthly);

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "preventivo_miodottore.pdf";
  link.click();
}
