document.addEventListener("DOMContentLoaded", () => {
  // Inizializzazione elementi
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const pdfSidebar = document.getElementById("pdf-sidebar");

  const roomsInput = document.getElementById("rooms");
  const doctorsInput = document.getElementById("doctors");
  const cplSelect = document.getElementById("cpl");
  const additionalLocationsInput = document.getElementById("additional-locations");
  const noaInput = document.getElementById("noa");
  const noaPriceSelect = document.getElementById("noa-price");

  const defaultMonthlyPriceField = document.getElementById("default-monthly-price");
  const setupFeeField = document.getElementById("setup-fee");
  const resultsBox = document.getElementById("results");

  const originalMonthlyPriceField = document.getElementById("original-monthly-price");
  const promoMonthlyPriceField = document.getElementById("promo-monthly-price");
  const originalSetupFeeField = document.getElementById("original-setup-fee");
  const promoSetupFeeField = document.getElementById("promo-setup-fee");

  const salesCommissionsField = document.getElementById("sales-commissions");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const loadingSpinner = document.getElementById("loading-spinner");
  const countdown = document.getElementById("countdown");
  const discountPanel = document.getElementById("discount-panel");
  const discountMessage = document.getElementById("discount-message");
  const discountDate = document.getElementById("discount-date");
  const viewerBox = document.getElementById("live-viewers");
  const viewerCountSpan = document.getElementById("viewer-count");
  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");

  // Popup input fields
  const popup = document.getElementById("pdf-popup");
  const popupStructureInput = document.getElementById("popup-structure-name");
  const popupReferentInput = document.getElementById("popup-referent-name");
  const popupSalesInput = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  let offerData = {};

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(roomsInput.value) || 0;
    const doctors = parseInt(doctorsInput.value) || 0;
    const cpl = parseInt(cplSelect.value) || 0;
    const additionalLocations = parseInt(additionalLocationsInput.value) || 0;
    const noa = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(noaPriceSelect.value) || 0;

    const index = Math.min(rooms, 10);
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotal = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotal;
    const defaultMonthlyPrice = totalMonthlyPrice * 2;
    const setupFeeBase = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeBase * 2;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotal + setupFeeBase / 12;

    defaultMonthlyPriceField.textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    setupFeeField.textContent = `${setupFeeDisplayed.toFixed(2)} €`;
    salesCommissionsField.textContent = `${totalCommission.toFixed(2)} €`;

    originalMonthlyPriceField.textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    promoMonthlyPriceField.textContent = `${totalMonthlyPrice.toFixed(2)} €`;
    originalSetupFeeField.textContent = `${setupFeeDisplayed.toFixed(2)} €`;
    promoSetupFeeField.textContent = `${setupFeeBase.toFixed(2)} €`;

    resultsBox.style.display = "block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
    procediBtn.style.display = "inline-block";
    pdfSidebar.style.display = "flex";

    offerData = {
      rooms, doctors, cpl, additionalLocations, noa, noaPrice,
      defaultMonthlyPrice, setupFeeBase, setupFeeDisplayed,
      promoMonthlyPrice: totalMonthlyPrice,
      salesCommissions: totalCommission
    };
  });

  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    let seconds = 15;
    countdown.textContent = `Attendere ${seconds} secondi...`;

    const timer = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;
      if (seconds <= 0) {
        clearInterval(timer);
        loadingSpinner.style.display = "none";
        discountPanel.style.display = "block";
        discountMessage.style.display = "inline-block";
        viewerBox.style.display = "flex";
        updateViewerCount();
        const today = new Date();
        today.setDate(today.getDate() + 10);
        discountDate.textContent = `Valido fino al: ${today.toLocaleDateString("it-IT")}`;
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

  generatePdfBtn.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  popupCancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  popupConfirmBtn.addEventListener("click", () => {
    const preparedFor = popupStructureInput.value;
    const preparedBy = popupReferentInput.value;
    const salesName = popupSalesInput.value;

    if (!preparedFor || !preparedBy || !salesName) {
      alert("Compila tutti i campi prima di continuare.");
      return;
    }

    popup.style.display = "none";
    // Qui andrai a usare i valori per compilare il PDF
    alert("Generazione PDF completata (simulazione).");
  });
});
