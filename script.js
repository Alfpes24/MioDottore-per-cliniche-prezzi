document.addEventListener("DOMContentLoaded", () => {
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

  // Riferimenti agli elementi per i prezzi nel pannello sconti
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
  const noaInput = document.getElementById("noa"); // Input N° licenze NOA


  // Event listener per l'icona della calcolatrice (mostra/nasconde pannello CTR)
  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  // Event listener per il pulsante "Calcola"
  calculateBtn.addEventListener("click", () => {
    // Recupera i valori dai campi del form
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(noaInput.value) || 0; // Utilizza noaInput
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    // Tabelle per il calcolo dei prezzi
    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0); // Indice per le tabelle

    // Calcoli dei costi
    const setupFee = setupFeeTable[index];
    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    // NUOVA FORMULA: Calcolo del prezzo totale mensile e del default
    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25; // Prezzo predefinito (es. prezzo di listino)

    // Calcolo delle commissioni CTR
    const commissionCpl = doctors * (cpl === 17 ? 8 : 6); // Commissione basata su dottori e capoluogo
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFee / 12; // Commissione totale CTR

    // Aggiorna i campi dei risultati iniziali
    defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    setupFeeField.textContent = setupFee.toFixed(2) + " €";
    salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    // Aggiorna i campi del pannello sconti (originale e promozionale)
    originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupFee.toFixed(2) + " €";
    promoSetupFeeField.textContent = setupFee.toFixed(2) + " €"; // Se la setup fee promozionale è diversa, modificala qui

    // Gestione della visibilità degli elementi dopo il calcolo
    resultsBox.style.display = "block"; // Mostra la sezione dei risultati
    discountPanel.style.display = "none"; // Nasconde il pannello sconti inizialmente
    calculatorIcon.style.display = "none"; // Nasconde l'icona calcolatrice inizialmente
    discountMessage.style.display = "none"; // Nasconde il messaggio sconti inizialmente
    viewerBox.style.display = "none"; // Nasconde il contatore spettatori inizialmente
    ctrPanel.style.display = "none"; // Nasconde il pannello CTR inizialmente

    procediBtn.style.display = "inline-block"; // Mostra il pulsante "Procedi"
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none"; // Mostra "Check" solo se N° licenze NOA è >= 1
  });

  // Event listener per il pulsante "Check" (per sconti)
  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block"; // Mostra lo spinner di caricamento
    countdown.textContent = "Attendere 15 secondi..."; // Messaggio di attesa
    let seconds = 15;

    // Countdown timer
    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval); // Ferma il timer
        loadingSpinner.style.display = "none"; // Nasconde lo spinner
        discountPanel.style.display = "block"; // Mostra il pannello sconti
        calculatorIcon.style.display = "block"; // Mostra l'icona calcolatrice
        discountMessage.textContent = "Sono presenti sconti clicca qui"; // Messaggio sconti
        discountMessage.style.display = "inline-block"; // Mostra il messaggio

        // Calcola e mostra la data di scadenza dello sconto (oggi + 10 giorni)
        const today = new Date();
        today.setDate(today.getDate() + 10);
        discountDate.textContent = `Valido fino al: ${today.toLocaleDateString("it-IT")}`;

        viewerBox.style.display = "flex"; // Mostra il contatore spettatori
        updateViewerCount(); // Aggiorna il conteggio iniziale
        setInterval(updateViewerCount, 20000); // Aggiorna il conteggio ogni 20 secondi
      }
    }, 1000); // Aggiorna ogni secondo
  });

  // Event listener per il messaggio "Sono presenti sconti" (scorri al pannello sconti)
  discountMessage.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" }); // Scorri al pannello sconti
  });

  // Funzione per aggiornare il numero di spettatori casuali
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1; // Numero casuale tra 1 e 5
    viewerCountSpan.textContent = randomViewers;
  }
});
