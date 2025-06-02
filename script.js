document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const defaultMonthlyPriceField = document.getElementById("default-monthly-price");
  const setupFeeField = document.getElementById("setup-fee"); // Questo è il campo della Setup Fee iniziale
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

    const setupFeeDefault = setupFeeTable[index]; // Questa è la setup fee di default
    const setupFeeDisplayed = setupFeeDefault * 2; // Questa è la setup fee raddoppiata per la visualizzazione iniziale

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    // Nella commissione CTR si usa la setupFee di default (non raddoppiata) divisa per 12
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    // Aggiorna il campo della Setup Fee iniziale con il valore raddoppiato
    setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";

    defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    // I campi del pannello sconti dovrebbero riflettere la setup fee originale o promozionale (non raddoppiata)
    originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";
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
