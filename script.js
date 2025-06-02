document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Initializing script.");

  // --- Controllo Accesso (Spostato qui per non interferire con il DOM) ---
  const refOk = document.referrer.includes("alfpes24.github.io") || window.opener;
  const accesso = localStorage.getItem("accessoMioDottore") === "ok";
  const mainContent = document.getElementById("main-content"); // Nuovo ID aggiunto al main content

  if (!accesso || !refOk) {
    if (mainContent) {
      mainContent.style.display = "none"; // Nasconde il contenuto principale
      const unauthorizedMessage = document.createElement("h2");
      unauthorizedMessage.style.color = "red";
      unauthorizedMessage.style.textAlign = "center";
      unauthorizedMessage.textContent = "Accesso non autorizzato";
      document.body.prepend(unauthorizedMessage); // Inserisce il messaggio all'inizio del body
    }
    setTimeout(() => location.replace("https://alfpes24.github.io/"), 1500);
    return; // Ferma l'esecuzione del resto dello script
  }
  // Se l'accesso è valido, il contenuto principale rimane visibile e lo script prosegue normalmente.


  // --- Get DOM Elements ---
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

  // Input fields for calculation
  const roomsInput = document.getElementById("rooms");
  const doctorsInput = document.getElementById("doctors");
  const cplSelect = document.getElementById("cpl");
  const additionalLocationsInput = document.getElementById("additional-locations");
  const noaInput = document.getElementById("noa");
  const noaPriceSelect = document.getElementById("noa-price");

  // Input fields for PDF customization
  const preparedForInput = document.getElementById("prepared-for");
  const preparedByInput = document.getElementById("prepared-by");

  // Checkbox per lo sconto nel PDF
  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");

  // Log all critical elements at startup to quickly identify if any are missing
  console.log("--- Elementi DOM al caricamento (dopo controllo accesso) ---");
  console.log("calculateBtn:", calculateBtn);
  console.log("checkBtn:", checkBtn);
  console.log("generatePdfBtn:", generatePdfBtn);
  console.log("pdfSidebar:", pdfSidebar);
  console.log("discountPanel:", discountPanel);
  console.log("roomsInput:", roomsInput);
  console.log("preparedForInput:", preparedForInput);
  console.log("applyDiscountToPdfCheckbox:", applyDiscountToPdfCheckbox);
  console.log("--- Fine elementi DOM ---");

  // Critical error check: if calculateBtn is not found, the script cannot proceed meaningfully
  if (!calculateBtn) {
    console.error("ERRORE CRITICO: Pulsante 'Calcola' (ID: calculate-btn) non trovato nell'HTML. Si prega di verificare l'ID.");
    return; 
  }
  if (!generatePdfBtn) {
    console.error("ERRORE CRITICO: Pulsante 'Genera PDF Preventivo' (ID: generate-pdf-btn) non trovato. La generazione PDF non funzionerà.");
  }
  if (!pdfSidebar) {
    console.error("ERRORE CRITICO: Elemento 'Sidebar' (ID: pdf-sidebar) non trovato. La barra laterale non apparirà.");
  }


  // Define the PDF template URL
  const PDF_TEMPLATE_URL = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";
  console.log("PDF Template URL:", PDF_TEMPLATE_URL);

  // Global object to store calculated values for PDF generation
  window.calculatedOfferData = {};

  // --- Event Listeners ---
  if (calculatorIcon) {
    calculatorIcon.addEventListener("click", () => {
      console.log("Calculator icon clicked.");
      if (ctrPanel) ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
    });
  } else {
    console.warn("Elemento 'calculator-icon' non trovato.");
  }


  // Main Calculate Button Logic
  calculateBtn.addEventListener("click", () => {
    console.log("Pulsante 'Calcola' cliccato. Inizio calcoli."); 

    // --- Get input values and convert to numbers ---
    const rooms = parseInt(roomsInput ? roomsInput.value : "0") || 0;
    const doctors = parseInt(doctorsInput ? doctorsInput.value : "0") || 0;
    const cpl = parseInt(cplSelect ? cplSelect.value : "0") || 0;
    const additionalLocations = parseInt(additionalLocationsInput ? additionalLocationsInput.value : "0") || 0;
    const noa = parseInt(noaInput ? noaInput.value : "0") || 0;
    const noaPrice = parseInt(noaPriceSelect ? noaPriceSelect.value : "0") || 0;

    console.log("Valori di input per il calcolo:", { rooms, doctors, cpl, additionalLocations, noa, noaPrice });

    // --- Price Tables and Calculations ---
    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeDefault * 2; // Setup Fee raddoppiata per la visualizzazione iniziale sul web

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    console.log("Dettagli prezzi calcolati:", { setupFeeDefault, monthlyPrice, totalMonthlyPrice, defaultMonthlyPrice, totalCommission });

    // --- Update Displayed Results ---
    if (defaultMonthlyPriceField) defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    if (setupFeeField) setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";
    if (salesCommissionsField) salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    if (originalMonthlyPriceField) originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    if (promoMonthlyPriceField) promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    if (originalSetupFeeField) originalSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";
    if (promoSetupFeeField) promoSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";

    // --- Toggle Visibility of Sections/Buttons (Stato iniziale dopo il calcolo) ---
    if (resultsBox) resultsBox.style.display = "block";
    if (discountPanel) discountPanel.style.display = "none"; // Nasconde il pannello sconti
    if (calculatorIcon) calculatorIcon.style.display = "none";
    if (discountMessage) discountMessage.style.display = "none";
    if (viewerBox) viewerBox.style.display = "none";
    if (ctrPanel) ctrPanel.style.display = "none";

    if (procediBtn) procediBtn.style.display = "inline-block";
    if (checkBtn) checkBtn.style.display = noa >= 1 ? "inline-block" : "none";

    // Mostra la sidebar del PDF dopo il calcolo iniziale.
    if (pdfSidebar) pdfSidebar.style.display = "flex"; 


    // --- Store calculated data for PDF generation ---
    window.calculatedOfferData = {
      rooms: rooms,
      doctors: doctors,
      cpl: cpl,
      additionalLocations: additionalLocations,
      noaLicenses: noa,
      noaPrice: noaPrice,
      defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2), 
      setupFeeOnetime: setupFeeDefault.toFixed(2), 
      setupFeeDisplayed: setupFeeDisplayed.toFixed(2), 
      promoMonthlyPrice: totalMonthlyPrice.toFixed(2), 
      salesCommission: totalCommission.toFixed(2),
      offerDate: new Date().toLocaleDateString("it-IT"),
      validUntilDate: "", 
      pdfTemplateUrl: PDF_TEMPLATE_URL,
      preparedFor: preparedForInput ? preparedForInput.value : "",
      preparedBy: preparedByInput ? preparedByInput.value : "",
      hasDiscountApplied: false // Inizialmente false, gestito dalla checkbox
    };
    console.log("Dati offerta calcolati e aggiornati:", window.calculatedOfferData);
  });


  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      console.log("Pulsante 'Check Sconti' cliccato. Inizio conto alla rovescia."); 
      if (loadingSpinner) loadingSpinner.style.display = "block";
      if (countdown) countdown.textContent = "Attendere 15 secondi...";
      let seconds = 15;

      // Disabilita la checkbox durante il countdown
      if (applyDiscountToPdfCheckbox) applyDiscountToPdfCheckbox.disabled = true;

      const interval = setInterval(() => {
        seconds--;
        if (countdown) countdown.textContent = `Attendere ${seconds} secondi...`;

        console.log("Conto alla rovescia: " + seconds + " secondi rimanenti.");

        if (seconds <= 0) {
          console.log("Conto alla rovescia terminato (seconds <= 0). Eseguo blocco finale."); 
          clearInterval(interval);
          if (loadingSpinner) loadingSpinner.style.display = "none";
          if (discountPanel) discountPanel.style.display = "block"; 
          if (calculatorIcon) calculatorIcon.style.display = "block";
          if (discountMessage) {
            discountMessage.textContent = "Sono presenti sconti clicca qui";
            discountMessage.style.display = "inline-block";
          }

          const today = new Date();
          const validUntil = new Date();
          validUntil.setDate(today.getDate() + 10);
          const validUntilDateString = validUntil.toLocaleDateString("it-IT");
          if (discountDate) discountDate.textContent = `Valido fino al: ${validUntilDateString}`;

          window.calculatedOfferData.validUntilDate = validUntilDateString;
          // hasDiscountApplied NON viene impostato qui. Sarà gestito dalla checkbox.
          console.log("Sconto valido fino al:", validUntilDateString);
          
          // Riabilita la checkbox e la imposta a true per default
          if (applyDiscountToPdfCheckbox) {
            applyDiscountToPdfCheckbox.disabled = false;
            applyDiscountToPdfCheckbox.checked = true; // Pre-seleziona la checkbox
            // Trigger l'evento change per aggiornare window.calculatedOfferData.hasDiscountApplied
            applyDiscountToPdfCheckbox.dispatchEvent(new Event('change')); 
          }

          if (viewerBox) viewerBox.style.display = "flex";
          updateViewerCount();
          setInterval(updateViewerCount, 20000); 

        }
      }, 1000);
    });
  } else {
    console.warn("Elemento 'check-btn' non trovato nell'HTML. L'event listener non verrà collegato.");
  }

  // Listener per la checkbox per aggiornare hasDiscountApplied
  if (applyDiscountToPdfCheckbox) {
    applyDiscountToPdfCheckbox.addEventListener('change', () => {
      window.calculatedOfferData.hasDiscountApplied = applyDiscountToPdfCheckbox.checked;
      console.log("Checkbox 'Includi sconto nel PDF' cambiata. hasDiscountApplied:", window.calculatedOfferData.hasDiscountApplied);
    });
    // Sincronizza lo stato iniziale del flag con lo stato della checkbox all'avvio
    window.calculatedOfferData.hasDiscountApplied = applyDiscountToPdfCheckbox.checked; 
  } else {
    console.warn("Elemento 'apply-discount-to-pdf' non trovato nell'HTML. La logica dello sconto nel PDF potrebbe non funzionare correttamente.");
  }


  if (discountMessage) {
    discountMessage.addEventListener("click", () => {
      console.log("Messaggio sconto cliccato. Scrolling al pannello sconti.");
      if (discountPanel) discountPanel.scrollIntoView({ behavior: "smooth" });
    });
  } else {
    console.warn("Elemento 'discount-message' non trovato.");
  }


  // --- PDF Generation Logic ---
  if (generatePdfBtn) {
    generatePdfBtn.addEventListener("click", async () => {
      console.log("Pulsante 'Genera PDF' cliccato.");
      console.log("Stato di 'hasDiscountApplied' al click PDF:", window.calculatedOfferData.hasDiscountApplied);


      if (!window.calculatedOfferData || !window.calculatedOfferData.pdfTemplateUrl) {
        alert("Si prega di calcolare prima l'offerta.");
        console.error("Generazione PDF interrotta: dati calcolati o URL template PDF mancanti.");
        return;
      }

      if (typeof PDFLib === 'undefined' || !PDFLib.PDFDocument) {
          alert("Errore: La libreria PDF non è stata caricata correttamente. Assicurati che <script src='https://unpkg.com/pdf-lib/dist/pdf-lib.min.js'></script> sia nel tuo HTML, prima del tuo script.js.");
          console.error("PDFLib non è definito. Assicurati che lo script CDN di pdf-lib sia caricato.");
          return;
      }

      try {
        console.log("Caricamento template PDF da:", window.calculatedOfferData.pdfTemplateUrl);
        const existingPdfBytes = await fetch(window.calculatedOfferData.pdfTemplateUrl).then(res => {
          if (!res.ok) {
            throw new Error(`Errore HTTP! stato: ${res.status} durante il caricamento del template PDF.`);
          }
          return res.arrayBuffer();
        });
        const { PDFDocument } = PDFLib;

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("Template PDF caricato con successo.");

        const form = pdfDoc.getForm();
        console.log("Modulo PDF ottenuto.");

        // --- Popola i campi del PDF usando i nomi CONFERMATI dalla tua ultima lista ---

        // Field: "Nome del referente" (Nome_referente)
        // Corrisponde all'input HTML 'prepared-by'
        try {
          form.getTextField('Nome_referente').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Campo 'Nome_referente' compilato con:", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("Campo PDF 'Nome_referente' non trovato o errore:", e); }

        // Field: "Nome della struttura (pagina 1)" (nome_struttura)
        // Corrisponde all'input HTML 'prepared-for'
        try {
          form.getTextField('nome_struttura').setText(window.calculatedOfferData.preparedFor || '');
          console.log("Campo 'nome_struttura' compilato con:", window.calculatedOfferData.preparedFor);
        } catch (e) { console.warn("Campo PDF 'nome_struttura' non trovato o errore:", e); }

        // Field: "Nome venditore (pagina 1)" (Nome_sale)
        // Corrisponde all'input HTML 'prepared-by'
        try {
          form.getTextField('Nome_sale').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Campo 'Nome_sale' compilato con:", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("Campo PDF 'Nome_sale' non trovato o errore:", e); }

        // Field: "Data generazione del preventivo" (Data_offerta)
        try {
          form.getTextField('Data_offerta').setText(window.calculatedOfferData.offerDate || '');
          console.log("Campo 'Data_offerta' compilato con:", window.calculatedOfferData.offerDate);
        } catch (e) { console.warn("Campo PDF 'Data_offerta' non trovato o errore:", e); }

        // Field: "Nome struttura (pagina 2)" (Nome_struttura1
