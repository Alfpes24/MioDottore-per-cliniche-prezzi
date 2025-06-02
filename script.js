// script.js aggiornato — con calcoli da script (3).js e generazione PDF

let preventivoData = {};

window.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const pdfBtn = document.getElementById("pdf-btn");
  const popup = document.getElementById("popup-overlay");
  const confirmPopup = document.getElementById("confirm-popup");
  const cancelPopup = document.getElementById("cancel-popup");

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeDefault * 2;

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    preventivoData = {
      defaultMonthly: defaultMonthlyPrice.toFixed(2) + " €",
      setupFee: setupFeeDisplayed.toFixed(2) + " €",
      total: (defaultMonthlyPrice + setupFeeDisplayed).toFixed(2) + " €",
      ambulatori: rooms,
      capoluogo: cpl === 17 ? "Capoluogo" : "No Capoluogo"
    };

    document.getElementById("default-monthly-price").textContent = preventivoData.defaultMonthly;
    document.getElementById("setup-fee").textContent = preventivoData.setupFee;
    document.getElementById("results").style.display = "block";
  });

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
});

async function generaPDF(datiPopup) {
  const formUrl = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";
  const formBytes = await fetch(formUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(formBytes);
  const form = pdfDoc.getForm();

  const today = new Date();
  const scadenza = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
  const formatDate = (d) => d.toLocaleDateString("it-IT");

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
