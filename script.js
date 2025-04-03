document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const resultsBox = document.getElementById("results");
  const checkSection = document.getElementById("check-section");
  const checkBtn = document.getElementById("check-btn");
  const loadingSpinner = document.getElementById("loading-spinner");
  const countdown = document.getElementById("countdown");
  const discountPanel = document.getElementById("discount-panel");
  const discountDate = document.getElementById("discount-date");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const viewerBox = document.getElementById("live-viewers");
  const viewerCountSpan = document.getElementById("viewer-count");

  // Mostra CTR Panel con calcolatrice
  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  // CALCOLA: mostra canone mensile e check
  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    const setupFeeTable = [99, 129, 129, 159, 159, 199, 199, 299, 299, 499, 599];
    const pricePerRoomTable = [270, 180, 160, 130, 110, 105, 95, 90, 85, 75, 70];

    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);
    const setupFee = setupFeeTable[index];
    const monthlyPricePerRoom = pricePerRoomTable[index];
    const monthlyPrice = monthlyPricePerRoom * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionBase = monthlyPrice;
    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const commissionLocations = locationsCost;
    const commissionNoa = noa * noaPrice;
    const totalCommission = commissionBase + commissionCpl + commissionLocations + (setupFee / 12) + commissionNoa;

    document.getElementById("default-monthly-price").textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    document.getElementById("setup-fee").textContent = `${setupFee.toFixed(2)} €`;
    document.getElementById("monthly-price").textContent = `${totalMonthlyPrice.toFixed(2)} €`;
    document.getElementById("sales-commissions").textContent = `${totalCommission.toFixed(2)} €`;

    const oggi = new Date();
    oggi.setDate(oggi.getDate() + 10);
    const giorno = String(oggi.getDate()).padStart(2, '0');
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const anno = oggi.getFullYear();
    discountDate.textContent = `Valido fino al: ${giorno}/${mese}/${anno}`;

    // Mostra risultati base + tasto Check
    resultsBox.style.display = "block";
    checkSection.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    ctrPanel.style.display = "none";
    viewerBox.style.display = "none";
  });

  // CHECK: avvia countdown + spinner + mostra pannello sconto
  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    countdown.textContent = "Attendere 15 secondi...";
    let counter = 15;

    const interval = setInterval(() => {
      counter--;
      countdown.textContent = `Attendere ${counter} secondi...`;
      if (counter <= 0) {
        clearInterval(interval);
        countdown.textContent = "Offerta disponibile!";
        loadingSpinner.style.display = "none";
        discountPanel.style.display = "block";
        calculatorIcon.style.display = "block";

        // Avvia numeri random viewers
        viewerBox.style.display = "flex";
        setInterval(() => {
          const randomViewers = Math.floor(Math.random() * 5) + 1;
          viewerCountSpan.textContent = randomViewers;
        }, 5000);
      }
    }, 1000);
  });
});
