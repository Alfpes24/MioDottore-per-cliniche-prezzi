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

  // Funzione per aggiornare il conteggio dei visualizzatori (rimasta come prima)
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = randomViewers;
  }

  // Event Listener per l'icona della calcolatrice (rimasta come prima)
  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  // Logica di calcolo dei prezzi (aggiornata con il codice fornito dall'utente)
  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(roomsInput.value) || 0;
    const doctors = parseInt(doctorsInput.value) || 0;
    const cpl = parseInt(cplSelect.value) || 0;
    const additionalLocations = parseInt(additionalLocationsInput.value) || 0;
    const noa = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(noaPriceSelect.value) || 0;

    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeDefault * 2; // Questo è il valore che appare inizialmente nel modulo

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25; // Prezzo con markup del 25%

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    // Aggiorna gli elementi della UI
    setupFeeSpan.textContent = setupFeeDisplayed.toFixed(2) + " €";
    defaultMonthlyPriceSpan.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    salesCommissionsSpan.textContent = totalCommission.toFixed(2) + " €";

    // Imposta i valori nell'oggetto globale per la generazione PDF
    window.calculatedOfferData = {
      defaultMonthlyPrice: defaultMonthlyPrice,
      setupFeeDisplayed: setupFeeDisplayed, // Valore setup fee "normale" per il PDF
      promoMonthlyPrice: totalMonthlyPrice, // Valore "scontato" per il PDF (senza markup)
      setupFeeOnetime: setupFeeDefault, // Valore setup fee scontato per il PDF
      hasDiscountApplied: false, // Inizialmente false, verrà impostato da checkBtn
      totalCTRValue: totalCommission,
    };

    // Aggiorna i campi del pannello sconti con i valori "originali" e "scontati"
    originalMonthlyPriceDel.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceSpan.textContent = totalMonthlyPrice.toFixed(2) + " €"; // Questo è il prezzo "scontato"
    originalSetupFeeDel.textContent = setupFeeDisplayed.toFixed(2) + " €";
    promoSetupFeeSpan.textContent = setupFeeDefault.toFixed(2) + " €"; // Questo è il setup "scontato"

    // Gestione della visibilità delle sezioni
    resultsSection.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessageSpan.style.display = "none";
    liveViewersDiv.style.display = "none";
    ctrPanel.style.display = "none"; // Nasconde il pannello CTR inizialmente

    procediBtn.style.display = "inline-block";
    // Il pulsante check viene mostrato solo se ci sono licenze NOA
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
    pdfSidebar.style.display = "flex"; // Mostra la sidebar del PDF una volta calcolato
  });

  // Event Listener per il pulsante "Check Sconti" (rimasta come prima)
  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    countdownSpan.textContent = "Attendere 15 secondi...";
    let seconds = 15;

    // Imposta hasDiscountApplied a true se il check viene attivato (si presume che il check sia per lo sconto)
    window.calculatedOfferData.hasDiscountApplied = true;

    const interval = setInterval(() => {
      seconds--;
      countdownSpan.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval);
        loadingSpinner.style.display = "none";
        
        discountPanel.style.display = "block";
        calculatorIcon.style.display = "block";
        discountMessageSpan.textContent = "Sono presenti sconti clicca qui";
        discountMessageSpan.style.display = "inline-block";

        const today = new Date();
        today.setDate(today.getDate() + 10);
        const validUntilDateString = today.toLocaleDateString("it-IT");
        discountDateSpan.textContent = `Valido fino al: ${validUntilDateString}`;
        window.calculatedOfferData.validUntilDate = validUntilDateString; // Imposta la data di scadenza per il PDF

        liveViewersDiv.style.display = "flex";
        updateViewerCount();
        setInterval(updateViewerCount, 20000); // Aggiorna il conteggio ogni 20 secondi

        procediBtn.style.display = "none"; // Nasconde il pulsante "Procedi" quando lo sconto è attivo
        checkBtn.style.display = "none"; // Nasconde il pulsante "Check Sconti" dopo la verifica
      }
    }, 1000);
  });

  // Event Listener per il messaggio di sconto (rimasta come prima)
  discountMessageSpan.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  // Gestione del popup di generazione PDF
  generatePdfBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.style.display = "flex";
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

      // Campi per il canone mensile (predefinito o scontato)
      form.getTextField("Quota_mensile_default").setText(`${d.defaultMonthlyPrice.toFixed(2)} €`);

      if (includeDiscount && d.hasDiscountApplied) {
        form.getTextField("Quota_mensile_scontata").setText(`${d.promoMonthlyPrice.toFixed(2)} €`);
        form.getTextField("Quota_formazione_setup").setText(`${d.setupFeeOnetime.toFixed(2)} € (scontato)`);

        const quotaScontataText =
          `Prezzo Originale: ~~${d.defaultMonthlyPrice.toFixed(2)} €~~\n` +
          `Setup Fee: ~~${d.setupFeeDisplayed.toFixed(2)} €~~\n\n` +
          `Prezzo Scontato: ${d.promoMonthlyPrice.toFixed(2)} €\n` +
          `Setup Scontato: ${d.setupFeeOnetime.toFixed(2)} €`;
        form.getTextField("Quota_scontata").setText(quotaScontataText);
      } else {
        // Se non si applica lo sconto o non c'è sconto, usa i valori predefiniti
        form.getTextField("Quota_mensile_scontata").setText(`${d.defaultMonthlyPrice.toFixed(2)} €`);
        form.getTextField("Quota_formazione_setup").setText(`${d.setupFeeDisplayed.toFixed(2)} €`);
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

  // Eseguire il calcolo iniziale per mostrare i valori di default all'avvio
  calculateBtn.click(); // Simula un click sul pulsante calcola all'avvio della pagina
});
