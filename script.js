document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Initializing script.");

  // --- Get DOM Elements ---
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  // Assicurati che generatePdfBtn sia recuperato DOPO che il suo HTML è stato spostato
  const generatePdfBtn = document.getElementById("generate-pdf-btn");

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

  // Log per verificare che gli elementi siano trovati all'avvio.
  // Se uno di questi è null, significa un problema nell'HTML (ID sbagliato o elemento non presente).
  console.log({ calculateBtn, checkBtn, generatePdfBtn, discountPanel });
  if (!calculateBtn) {
    console.error("ERRORE CRITICO: Pulsante 'Calcola' (ID: calculate-btn) non trovato. Lo script non funzionerà.");
  }
  if (!generatePdfBtn) {
    console.error("ERRORE CRITICO: Pulsante 'Genera PDF Preventivo' (ID: generate-pdf-btn) non trovato. La generazione PDF non funzionerà.");
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


  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      console.log("Pulsante 'Calcola' cliccato.");

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
      // Il pulsante Genera PDF Preventivo viene gestito dalla logica di 'checkBtn'
      // o dal pannello sconti, quindi lo nascondiamo qui inizialmente se non è già gestito altrove
      if (generatePdfBtn) generatePdfBtn.style.display = "none";


      // --- Store calculated data for PDF generation ---
      window.calculatedOfferData = {
        rooms: rooms,
        doctors: doctors,
        cpl: cpl,
        additionalLocations: additionalLocations,
        noaLicenses: noa,
        noaPrice: noaPrice,
        defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2),
        setupFeeOnetime: setupFeeDefault.toFixed(2), // Usa la Setup Fee singola per il PDF
        promoMonthlyPrice: totalMonthlyPrice.toFixed(2),
        salesCommission: totalCommission.toFixed(2),
        offerDate: new Date().toLocaleDateString("it-IT"),
        validUntilDate: "", // Sarà aggiornata dopo il click su checkBtn
        pdfTemplateUrl: PDF_TEMPLATE_URL,
        preparedFor: preparedForInput ? preparedForInput.value : "",
        preparedBy: preparedByInput ? preparedByInput.value : "",
        hasDiscountApplied: false // Flag inizialmente falso
      };
      console.log("Dati offerta calcolati e aggiornati:", window.calculatedOfferData);
    });
  } else {
    console.error("ERRORE: Elemento 'calculate-btn' non trovato. Impossibile collegare l'event listener.");
  }


  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      console.log("Pulsante 'Check Sconti' cliccato.");
      if (loadingSpinner) loadingSpinner.style.display = "block";
      if (countdown) countdown.textContent = "Attendere 15 secondi...";
      let seconds = 15;

      const interval = setInterval(() => {
        seconds--;
        if (countdown) countdown.textContent = `Attendere ${seconds} secondi...`;

        if (seconds <= 0) {
          clearInterval(interval);
          if (loadingSpinner) loadingSpinner.style.display = "none";
          if (discountPanel) discountPanel.style.display = "block"; // Mostra il pannello sconti
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
          window.calculatedOfferData.hasDiscountApplied = true; // Flag true: sconto applicato
          console.log("Sconto valido fino al:", validUntilDateString);

          if (viewerBox) viewerBox.style.display = "flex";
          updateViewerCount();
          setInterval(updateViewerCount, 20000);

          // << MODIFICATO: Rende il pulsante Genera PDF visibile qui, dentro il pannello sconti
          if (generatePdfBtn) {
              generatePdfBtn.style.display = "inline-block";
              // Se vuoi che sia visibile in entrambi i posti contemporaneamente, devi clonarlo o riposizionarlo con CSS.
              // Dato che l'abbiamo spostato in HTML dentro discount-panel, sarà visibile solo quando discountPanel è visibile.
              // Se vuoi che sia visibile SEMPRE dopo Calcola, e ANCHE in discountPanel, dovremmo avere due pulsanti HTML.
              // Per la tua richiesta "dovrebbe apparire anche su questo pannello", questo è il comportamento corretto.
          }
        }
      }, 1000);
    });
  } else {
    console.warn("Elemento 'check-btn' non trovato.");
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
          console.log("Campo 'Nome_sale' compilato con:", window.calculatedOfferata.preparedBy);
        } catch (e) { console.warn("Campo PDF 'Nome_sale' non trovato o errore:", e); }

        // Field: "Data generazione del preventivo" (Data_offerta)
        try {
          form.getTextField('Data_offerta').setText(window.calculatedOfferData.offerDate || '');
          console.log("Campo 'Data_offerta' compilato con:", window.calculatedOfferData.offerDate);
        } catch (e) { console.warn("Campo PDF 'Data_offerta' non trovato o errore:", e); }

        // Field: "Nome struttura (pagina 2)" (Nome_struttura1)
        // Corrisponde all'input HTML 'prepared-for'
        try {
          form.getTextField('Nome_struttura1').setText(window.calculatedOfferData.preparedFor || '');
          console.log("Campo 'Nome_struttura1' compilato con:", window.calculatedOfferData.preparedFor);
        } catch (e) { console.warn("Campo PDF 'Nome_struttura1' non trovato o errore:", e); }

        // Field: "Data scadenza offerta" (Scadenza_offerta)
        try {
          form.getTextField('Scadenza_offerta').setText(window.calculatedOfferData.validUntilDate || '');
          console.log("Campo 'Scadenza_offerta' compilato con:", window.calculatedOfferData.validUntilDate);
        } catch (e) { console.warn("Campo PDF 'Scadenza_offerta' non trovato o errore:", e); }

        // Field: "Nome venditore (pagina 2)" (Nome_sale1)
        // Corrisponde all'input HTML 'prepared-by'
        try {
          form.getTextField('Nome_sale1').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Campo 'Nome_sale1' compilato con:", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("Campo PDF 'Nome_sale1' non trovato o errore:", e); }

        // Field: "Numero ambulatori inseriti" (numero_ambulatori)
        // Corrisponde all'input HTML 'rooms'
        try {
          form.getTextField('numero_ambulatori').setText(String(window.calculatedOfferData.rooms || '0'));
          console.log("Campo 'numero_ambulatori' compilato con:", window.calculatedOfferData.rooms);
        } catch (e) { console.warn("Campo PDF 'numero_ambulatori' non trovato o errore:", e); }

        // Field: "Capoluogo / Non capoluogo" (Cpl)
        try {
          const cplText = window.calculatedOfferData.cpl === 17 ? 'Capoluogo' : 'No Capoluogo';
          form.getTextField('Cpl').setText(cplText);
          console.log("Campo 'Cpl' compilato con:", cplText);
        } catch (e) { console.warn("Campo PDF 'Cpl' non trovato o errore:", e); }

        // Field: "Canone mensile predefinito (pagina 1)" (Quota_mensile_default)
        try {
          form.getTextField('Quota_mensile_default').setText(window.calculatedOfferData.defaultMonthlyPrice + ' €' || '0 €');
          console.log("Campo 'Quota_mensile_default' compilato con:", window.calculatedOfferData.defaultMonthlyPrice);
        } catch (e) { console.warn("Campo PDF 'Quota_mensile_default' non trovato o errore:", e); }

        // Field: "Canone mensile predefinito (pagina 2)" (Quota_mensile_default_2)
        try {
          form.getTextField('Quota_mensile_default_2').setText(window.calculatedOfferData.defaultMonthlyPrice + ' €' || '0 €');
          console.log("Campo 'Quota_mensile_default_2' compilato con:", window.calculatedOfferData.defaultMonthlyPrice);
        } catch (e) { console.warn("Campo PDF 'Quota_mensile_default_2' non trovato o errore:", e); }

        // Field: "Totale (canone + setup)" (Quota_scontata)
        // Questo campo deve essere compilato SOLO SE hasDiscountApplied è TRUE.
        // Se hasDiscountApplied è falso, il campo deve rimanere vuoto.
        try {
          if (window.calculatedOfferData.hasDiscountApplied) {
            form.getTextField('Quota_scontata').setText(window.calculatedOfferData.setupFeeOnetime + ' €' || '0 €');
            console.log("Campo 'Quota_scontata' (Totale/Setup) compilato perché sconto applicato:", window.calculatedOfferData.setupFeeOnetime);
          } else {
            form.getTextField('Quota_scontata').setText(''); // Svuota il campo
            console.log("Campo 'Quota_scontata' (Totale/Setup) lasciato vuoto perché nessun sconto applicato.");
          }
        } catch (e) { console.warn("Campo PDF 'Quota_scontata' non trovato o errore:", e); }

        // Field: "Canone mensile scontato (se applicabile)" (Quota_mensile_scontata)
        // Questo deve essere sempre il promoMonthlyPrice (prezzo scontato dopo il calcolo).
        try {
          form.getTextField('Quota_mensile_scontata').setText(window.calculatedOfferData.promoMonthlyPrice + ' €' || '0 €');
          console.log("Campo 'Quota_mensile_scontata' compilato con:", window.calculatedOfferData.promoMonthlyPrice);
        } catch (e) { console.warn("Campo PDF 'Quota_mensile_scontata' non trovato o errore:", e); }


        // Flatten the form fields to make them part of the document content
        form.flatten();
        console.log("Campi del modulo PDF appiattiti.");

        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();
        console.log("PDF salvato in byte.");

        // Create a Blob from the PDF bytes and create a download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const clientNameForFilename = (window.calculatedOfferData.preparedFor || 'Clinica').replace(/\s/g, '_').replace(/[^\w-]/g, '');
        const dateForFilename = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');
        a.download = `Preventivo_MioDottore_${clientNameForFilename}_${dateForFilename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Download PDF avviato.");

      } catch (error) {
        console.error("Errore durante la generazione del PDF:", error);
        alert("Si è verificato un errore durante la generazione del PDF. Controlla la console per i dettagli.");
      }
    });
  } else {
    console.warn("Elemento 'generate-pdf-btn' non trovato. La generazione PDF non funzionerà.");
  }


  // --- Helper Functions ---
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    if (viewerCountSpan) viewerCountSpan.textContent = randomViewers;
    console.log("Numero di visualizzatori aggiornato a:", randomViewers);
  }
});
