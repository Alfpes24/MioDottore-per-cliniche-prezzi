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
  const discountMessage = document.getElementById("discount-message");

  // Calcolatrice toggle
  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  // Click su "Calcola"
  calculateBtn.addEventListener("click", () => {
    // Recupera valori input
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    // Tabelle di prezzo
    const setupFeeTable = [99, 129, 129, 159, 159, 199, 199, 299, 299, 499, 599];
    const pricePerRoomTable = [270, 180, 160, 130, 110, 105, 95, 90, 85, 75, 70];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFee = setupFeeTable[index];
    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;
    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    // Commissioni
    const commissionBase = monthlyPrice;
    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = commissionBase + commissionCpl + locationsCost + noaTotalPrice + setupFee / 12;

    // Popola risultati
    document.getElementById("default-monthly-price").textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    document.getElementById("setup-fee").textContent = `${setupFee.toFixed(2)} €`;
    document.getElementById("monthly-price").textContent = `${totalMonthlyPrice.toFixed(2)} €`;
    document.getElementById("sales-commissions").textContent = `${totalCommission.toFixed(2)} €`;

    // Calcola data scadenza (10 giorni dopo)
    const today = new Date();
    today.setDate(today.getDate() + 10);
    const formattedDate = today.toLocaleDateString("it-IT");
    discountDate.textContent = `Valido fino al: ${formattedDate}`;

    // Mostra sezione risultati e pulsanti
    resultsBox.style.display = "block";
    checkSection.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    ctrPanel.style.display = "none";
    viewerBox.style.display = "none";
    discountMessage.style.display = "none";
  });

  // Click su "Check"
  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    countdown.textContent = "Attendere 15 secondi...";
    let seconds = 15;

    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval);
        countdown.textContent = "Offerta disponibile!";
        loadingSpinner.style.display = "none";
        discountPanel.style.display = "block";
        calculatorIcon.style.display = "block";

        // Mostra sconti
        discountMessage.style.display = "block";
        discountMessage.textContent = "Sono presenti sconti clicca qui";

        // Visualizzatori casuali
        viewerBox.style.display = "flex";
        setInterval(() => {
          const viewers = Math.floor(Math.random() * 5) + 1;
          viewerCountSpan.textContent = viewers;
        }, 5000);
      }
    }, 1000);
  });

  // Click su messaggio sconto = mostra pannello
  discountMessage.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });
});
