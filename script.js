document.addEventListener("DOMContentLoaded", () => {
  // --- Controllo Accesso ---
  const refOk = document.referrer.includes("alfpes24.github.io") || window.opener;
  const accesso = localStorage.getItem("accessoMioDottore") === "ok";
  const mainContent = document.getElementById("main-content"); 

  if (!accesso || !refOk) {
    if (mainContent) {
      mainContent.style.display = "none"; 
      const unauthorizedMessage = document.createElement("h2");
      unauthorizedMessage.style.color = "red";
      unauthorizedMessage.style.textAlign = "center";
      unauthorizedMessage.textContent = "Accesso non autorizzato";
      document.body.prepend(unauthorizedMessage); 
    }
    setTimeout(() => location.replace("https://alfpes24.github.io/"), 1500);
    return; 
  }

  // --- Elementi DOM ---
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const pdfSidebar = document.getElementById("pdf-sidebar");
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
  const roomsInput = document.getElementById("rooms");
  const doctorsInput = document.getElementById("doctors");
  const cplSelect = document.getElementById("cpl");
  const additionalLocationsInput = document.getElementById("additional-locations");
  const noaInput = document.getElementById("noa");
  const noaPriceSelect = document.getElementById("noa-price");
  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");

  // Popup input fields
  const popup = document.getElementById("pdf-popup");
  const popupStructureName = document.getElementById("popup-structure-name");
  const popupReferentName = document.getElementById("popup-referent-name");
  const popupSalesName = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  let offerData = {};
  let readyToGeneratePDF = false;

  // --- Eventi ---
  popupConfirmBtn?.addEventListener("click", () => {
    offerData.preparedFor = popupStructureName.value;
    offerData.preparedBy = popupReferentName.value;
    offerData.salesName = popupSalesName.value;
    readyToGeneratePDF = true;
    popup.style.display = "none";
    generatePdfBtn.click();
  });

  popupCancelBtn?.addEventListener("click", () => {
    popup.style.display = "none";
  });

  generatePdfBtn?.addEventListener("click", () => {
    if (!readyToGeneratePDF) {
      popup.style.display = "block";
      return;
    }
    alert("Generazione PDF avviata con: " + JSON.stringify(offerData));
    // Qui andrà la logica effettiva per generare il PDF usando pdf-lib
  });

  calculateBtn?.addEventListener("click", () => {
    const rooms = parseInt(roomsInput.value) || 0;
    const doctors = parseInt(doctorsInput.value) || 0;
    const cpl = parseInt(cplSelect.value) || 0;
    const locations = parseInt(additionalLocationsInput.value) || 0;
    const noa = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(noaPriceSelect.value) || 0;

    const pricePerRoom = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const setupFees = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const idx = Math.min(rooms, 10);
    const monthly = pricePerRoom[idx] * rooms + locations * 99 + noa * noaPrice;
    const setup = setupFees[idx];

    const defaultMonthly = monthly * 2;
    const setupDouble = setup * 2;
    const commission = monthly + (doctors * (cpl === 17 ? 8 : 6)) + (setup / 12);

    defaultMonthlyPriceField.textContent = defaultMonthly.toFixed(2) + " €";
    setupFeeField.textContent = setupDouble.toFixed(2) + " €";
    originalMonthlyPriceField.textContent = defaultMonthly.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupDouble.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = monthly.toFixed(2) + " €";
    promoSetupFeeField.textContent = setup.toFixed(2) + " €";
    salesCommissionsField.textContent = commission.toFixed(2) + " €";

    resultsBox.style.display = "block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
    procediBtn.style.display = "inline-block";
  });

  checkBtn?.addEventListener("click", () => {
    let seconds = 15;
    countdown.textContent = `Attendere ${seconds} secondi...`;
    loadingSpinner.style.display = "block";
    const timer = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;
      if (seconds <= 0) {
        clearInterval(timer);
        loadingSpinner.style.display = "none";
        discountPanel.style.display = "block";
        discountMessage.textContent = "Sono presenti sconti clicca qui";
        discountMessage.style.display = "inline-block";
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 10);
        discountDate.textContent = `Valido fino al: ${validUntil.toLocaleDateString("it-IT")}`;
        viewerBox.style.display = "flex";
        updateViewerCount();
      }
    }, 1000);
  });

  discountMessage?.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  function updateViewerCount() {
    const count = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = count;
  }
});
