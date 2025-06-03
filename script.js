document.addEventListener("DOMContentLoaded", () => {
  const roomsInput = document.getElementById("rooms");
  const doctorsInput = document.getElementById("doctors");
  const cplSelect = document.getElementById("cpl");
  const additionalLocationsInput = document.getElementById("additional-locations");
  const noaInput = document.getElementById("noa");
  const noaPriceSelect = document.getElementById("noa-price");
  const calculateBtn = document.getElementById("calculate-btn");

  const resultsSection = document.getElementById("results");
  const defaultMonthlyPriceSpan = document.getElementById("default-monthly-price");
  const setupFeeSpan = document.getElementById("setup-fee");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const loadingSpinner = document.getElementById("loading-spinner");
  const countdownSpan = document.getElementById("countdown");
  const discountMessageSpan = document.getElementById("discount-message");

  const discountPanel = document.getElementById("discount-panel");
  const originalMonthlyPriceDel = document.getElementById("original-monthly-price");
  const originalSetupFeeDel = document.getElementById("original-setup-fee");
  const promoMonthlyPriceSpan = document.getElementById("promo-monthly-price");
  const promoSetupFeeSpan = document.getElementById("promo-setup-fee");
  const discountDateSpan = document.getElementById("discount-date");
  const lockPriceBtn = document.querySelector(".lock-price-btn");
  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");
  const liveViewersDiv = document.getElementById("live-viewers");
  const viewerCountSpan = document.getElementById("viewer-count");

  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const salesCommissionsSpan = document.getElementById("sales-commissions");

  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const pdfSidebar = document.getElementById("pdf-sidebar");
  const popupOverlay = document.getElementById("pdf-popup");
  const popupStructureInput = document.getElementById("popup-structure-name");
  const popupReferentInput = document.getElementById("popup-referent-name");
  const popupSalesInput = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  // Oggetto globale per conservare i dati calcolati e passati al PDF
  window.calculatedOfferData = {};

  // Funzione per calcolare i prezzi
  const calculatePrices = () => {
    const rooms = parseInt(roomsInput.value) || 0;
    const doctors = parseInt(doctorsInput.value) || 0;
    const cpl = parseInt(cplSelect.value) || 0;
    const additionalLocations = parseInt(additionalLocationsInput.value) || 0;
    const noaLicenses = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(noaPriceSelect.value) || 0;

    // Logica di calcolo (basata su ipotesi, da adattare alle tue regole)
    const baseMonthlyPrice = (rooms * 50) + (doctors * 30); // Esempio
    const cplCost = cpl * rooms; // Esempio
    const additionalLocationsCost = additionalLocations * 20; // Esempio
    const noaTotalCost = noaLicenses * noaPrice;

    const defaultMonthly = baseMonthlyPrice + cplCost + additionalLocationsCost + noaTotalCost;
    const setupFee = 250; // Esempio di setup fee fissa o calcolata

    // Inizializza i dati per l'offerta
    window.calculatedOfferData = {
      defaultMonthlyPrice: defaultMonthly,
      setupFeeDisplayed: setupFee,
      promoMonthlyPrice: defaultMonthly, // Inizialmente uguale al default
      setupFeeOnetime: setupFee, // Inizialmente uguale al default
      hasDiscountApplied: false,
      totalCTRValue: 0, // Esempio, da calcolare se necessario
    };

    // Mostra i risultati iniziali
    defaultMonthlyPriceSpan.textContent = `${defaultMonthly} €`;
    setupFeeSpan.textContent = `${setupFee} €`;

    resultsSection.style.display = "block";
    checkBtn.style.display = "inline-block";
    procediBtn.style.display = "inline-block";
    discountPanel.style.display = "none"; // Nasconde il pannello sconti finché non vengono "verificati"
    discountMessageSpan.style.display = "none";
    liveViewersDiv.style.display = "none";
    pdfSidebar.style.display = "flex"; // Mostra la sidebar del PDF una volta calcolato

    // Nasconde il pannello CTR e l'icona della calcolatrice se non pertinenti subito
    ctrPanel.style.display = "none";
    calculatorIcon.style.display = "none";
  };

  // Event Listener per il pulsante "Calcola"
  calculateBtn.addEventListener("click", calculatePrices);

  // Event Listener per il pulsante "Check Sconti"
  checkBtn.addEventListener("click", () => {
    // Simulazione di un caricamento per la verifica sconti
    checkBtn.style.display = "none";
    procediBtn.style.display = "none";
    loadingSpinner.style.display = "block";
    discountMessageSpan.style.display = "none";
    discountPanel.style.display = "none";
    liveViewersDiv.style.display = "none"; // Nascondi anche i viewer durante il check

    let countdown = 3; // Simula 3 secondi di attesa
    countdownSpan.textContent = `Verifica sconti in corso... ${countdown}s`;

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownSpan.textContent = `Verifica sconti in corso... ${countdown}s`;
      } else {
        clearInterval(countdownInterval);
        loadingSpinner.style.display = "none";
        // Simulazione della logica di sconto
        const hasDiscount = Math.random() < 0.7; // 70% di possibilità di sconto

        if (hasDiscount) {
          const originalMonthly = window.calculatedOfferData.defaultMonthlyPrice;
          const originalSetup = window.calculatedOfferData.setupFeeDisplayed;

          // Esempio di applicazione sconto: 10% sul mensile, 50% sul setup
          const promoMonthly = Math.round(originalMonthly * 0.90);
          const promoSetup = Math.round(originalSetup * 0.50);

          window.calculatedOfferData.promoMonthlyPrice = promoMonthly;
          window.calculatedOfferData.setupFeeOnetime = promoSetup;
          window.calculatedOfferData.hasDiscountApplied = true;
          window.calculatedOfferData.totalCTRValue = promoMonthly * 12 * 0.15; // Esempio CTR: 15% del valore annuale

          discountMessageSpan.textContent = "Congratulazioni! Offerta Speciale Disponibile!";
          discountMessageSpan.style.display = "block";
          discountPanel.style.display = "block";

          originalMonthlyPriceDel.textContent = `${originalMonthly} €`;
          originalSetupFeeDel.textContent = `${originalSetup} €`;
          promoMonthlyPriceSpan.textContent = `${promoMonthly} €`;
          promoSetupFeeSpan.textContent = `${promoSetup} €`;

          // Data di scadenza dell'offerta (es. 10 giorni da oggi)
          const validUntil = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
          const validUntilDateString = validUntil.toLocaleDateString("it-IT");
          discountDateSpan.textContent = `Offerta valida fino al ${validUntilDateString}`;
          window.calculatedOfferData.validUntilDate = validUntilDateString;

          // Simula i visualizzatori live
          const randomViewers = Math.floor(Math.random() * 5) + 1; // Da 1 a 5
          viewerCountSpan.textContent = randomViewers;
          liveViewersDiv.style.display = "flex";

          // Mostra l'icona calcolatrice solo se c'è un CTR
          calculatorIcon.style.display = "block";
          salesCommissionsSpan.textContent = `${window.calculatedOfferData.totalCTRValue.toFixed(2)} €`;

        } else {
          discountMessageSpan.textContent = "Nessun sconto disponibile al momento. Riprova più tardi!";
          discountMessageSpan.style.display = "block";
          procediBtn.style.display = "inline-block"; // Riabilita il procedi senza sconti
          calculatorIcon.style.display = "none"; // Nasconde l'icona se non c'è CTR
        }
        checkBtn.style.display = "none"; // Nasconde il pulsante check dopo la verifica
      }
    }, 1000);
  });

  // Event Listener per l'icona della calcolatrice
  calculatorIcon.addEventListener("click", () => {
    if (ctrPanel.style.display === "none" || ctrPanel.style.display === "") {
      ctrPanel.style.display = "block";
    } else {
      ctrPanel.style.display = "none";
    }
  });


  // Gestione del popup di generazione PDF
  generatePdfBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.style.display = "flex";
    // Pre-popola i campi se ci sono dati disponibili (es. da una sessione precedente o valori di default)
    // popupStructureInput.value = "Clinica Esempio";
    // popupReferentInput.value = "Dott. Mario Rossi";
    // popupSalesInput.value = "Giulia Bianchi";
  });

  popupCancelBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  popupConfirmBtn.addEventListener("click", async () => {
    const struttura = popupStructureInput.value.trim();
    const referente = popupReferentInput.value.trim();
    const commerciale = popupSalesInput.value.trim();

    if (!struttura || !referente || !commerciale) {
      alert("Compila tutti i campi prima di continuare.");
      return;
    }

    // Aggiorna i dati per il PDF con le informazioni del popup
    const d = window.calculatedOfferData; // Usa l'oggetto globale
    d.preparedFor = struttura;
    d.preparedBy = referente;
    d.nomeSale = commerciale;
    d.offerDate = new Date().toLocaleDateString("it-IT");
    // Se validUntilDate non è stata impostata dalla logica degli sconti, impostala di default
    d.validUntilDate = d.validUntilDate || new Date(Date.now() + 10 * 86400000).toLocaleDateString("it-IT");
    d.pdfTemplateUrl = "Modello-preventivo-crm.pdf";

    // Controlla lo stato della checkbox per includere lo sconto nel PDF
    const includeDiscount = applyDiscountToPdfCheckbox.checked;

    try {
      const existingPdfBytes = await fetch(d.pdfTemplateUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      form.getTextField("nome_struttura").setText(d.preparedFor);
      form.getTextField("Nome_referente").setText(d.preparedBy);
      form.getTextField("Nome_sale").setText(d.nomeSale);
      form.getTextField("Data_offerta").setText(d.offerDate);
      form.getTextField("Nome_struttura1").setText(d.preparedFor);
      form.getTextField("Nome_sale1").setText(d.nomeSale);
      form.getTextField("Scadenza_offerta").setText(d.validUntilDate);

      // Campi predefiniti o scontati
      form.getTextField("Quota_mensile_default").setText(`${d.defaultMonthlyPrice || "0"} €`);

      if (includeDiscount && d.hasDiscountApplied) {
        form.getTextField("Quota_mensile_scontata").setText(`${d.promoMonthlyPrice || "0"} €`);
        form.getTextField("Quota_formazione_setup").setText(`${d.setupFeeOnetime} € (scontato)`);

        const quotaScontataText =
          `Prezzo Originale: ~~${d.defaultMonthlyPrice} €~~\n` +
          `Setup Fee: ~~${d.setupFeeDisplayed} €~~\n\n` +
          `Prezzo Scontato: ${d.promoMonthlyPrice} €\n` +
          `Setup Scontato: ${d.setupFeeOnetime} €`;
        form.getTextField("Quota_scontata").setText(quotaScontataText);
      } else {
        // Se non si applica lo sconto o non c'è sconto, usa i valori predefiniti
        form.getTextField("Quota_mensile_scontata").setText(`${d.defaultMonthlyPrice || "0"} €`);
        form.getTextField("Quota_formazione_setup").setText(`${d.setupFeeDisplayed} €`);
        form.getTextField("Quota_scontata").setText(""); // Svuota il campo di testo dello sconto dettagliato
      }

      form.flatten(); // Rende i campi del form non modificabili nel PDF finale

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      // Correzione delle espressioni regolari per il nome del file
      const fileName = `Preventivo_MioDottore_${d.preparedFor.replace(/\s+/g, "_")}_${d.offerDate.replace(/\//g, "-")}.pdf`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      popupOverlay.style.display = "none";
    } catch (e) {
      console.error("Errore nella generazione del PDF:", e);
      alert("Errore nella generazione del PDF. Controlla la console.");
    }
  });

  // Inizializza i valori predefiniti nel caso l'utente non clicchi "Calcola" subito
  calculatePrices();
});
