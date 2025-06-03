document.addEventListener("DOMContentLoaded", () => {
  let pdfData = {};
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
// Gestione popup per inserimento dati PDF
const popupOverlay = document.getElementById("pdf-popup");
const popupStructure = document.getElementById("popup-structure-name");
const popupReferent = document.getElementById("popup-referent-name");
const popupSales = document.getElementById("popup-sales-name");
const popupConfirm = document.getElementById("popup-confirm-btn");
const popupCancel = document.getElementById("popup-cancel-btn");

if (popupCancel) {
  popupCancel.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });
}

if (generatePdfBtn) {
  generatePdfBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });
}

if (popupConfirm) {
  popupConfirm.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    const struttura = popupStructure.value.trim();
    const referente = popupReferent.value.trim();
    const sales = popupSales.value.trim();

    // Inietta i valori nei campi PDF
    if (pdfData) {
      pdfData.struttura = struttura;
      pdfData.referente = referente;
      pdfData.sales = sales;
    }

    // Prosegui con la generazione del PDF
    generaPDF(pdfData);
  });
}
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const defaultMonthlyPriceField = document.getElementById("default-monthly-price");
  const setupFeeField = document.getElementById("setup-fee");
  const resultsBox = document.getElementById("results");
  const checkSection = document.getElementById("check-section");
  const discountPanel = document.getElementById("discount-panel");
  const discountMessage = document.getElementById("discount-message");
  const discountDate = document.getElementById("discount-date");

  const originalMonthlyPriceField = document.getElementById("original-monthly-price");
  const promoMonthlyPriceField = document.getElementById("promo-monthly-price");
  const originalSetupFeeField = document.getElementById("original-setup-fee");
  const promoSetupFeeField = document.getElementById("promo-setup-fee");

  const salesCommissionsField = document.getElementById("sales-commissions");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const loadingSpinner = document.getElementById("loading-spinner");
  const countdown = document.getElementById("countdown");
  const viewerBox = document.getElementById("live-viewers");
  const viewerCountSpan = document.getElementById("viewer-count");
  const noaInput = document.getElementById("noa");

  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(noaInput.value) || 0;
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
    const defaultMonthlyPrice = totalMonthlyPrice * 2;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";

    defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    // Modified to display the doubled setup fee in the discount panel
    originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €"; // Changed this line
    promoSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";

    resultsBox.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessage.style.display = "none";
    viewerBox.style.display = "none";
    ctrPanel.style.display = "none";

    procediBtn.style.display = "inline-block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
  });

  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    countdown.textContent = "Attendere 15 secondi...";
    let seconds = 15;

    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval);
        loadingSpinner.style.display = "none";
        discountPanel.style.display = "block";
        calculatorIcon.style.display = "block";
        discountMessage.textContent = "Sono presenti sconti clicca qui";
        discountMessage.style.display = "inline-block";

        const today = new Date();
        today.setDate(today.getDate() + 10);
        discountDate.textContent = `Valido fino al: ${today.toLocaleDateString("it-IT")}`;

        viewerBox.style.display = "flex";
        updateViewerCount();
        setInterval(updateViewerCount, 20000);
      }
    }, 1000);
  });

  discountMessage.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = randomViewers;
  }
});


async function generaPDF(data) {
  const existingPdfBytes = await fetch("Modello-preventivo-crm.pdf").then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
