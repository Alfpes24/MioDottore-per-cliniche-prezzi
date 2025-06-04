document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Initializing script.");

  // --- Controllo Accesso (Spostato qui per non interferire con il DOM) ---
  const isDev = location.hostname === 'localhost';
const refOk = isDev || document.referrer.includes("alfpes24.github.io") || window.opener;
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


  // --- Get DOM Elements ---
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");  
  const sendEmailBtn = document.getElementById("send-email-btn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      const destinatario = ""; // Lascia vuoto per farlo scegliere all'utente
      const oggetto = encodeURIComponent("Preventivo MioDottore");
      const corpo = encodeURIComponent(
        `Ciao,\n\nTi invio in allegato il preventivo per il gestionale MioDottore.\n\nPer qualsiasi domanda resto a disposizione.\n\nCordiali saluti,\n\n${window.calculatedOfferData?.preparedBy || "Il tuo consulente"}`
      );
  
      const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${oggetto}&body=${corpo}`;
      window.open(mailtoUrl, "_blank");
    });
  }
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

  
  // Popup Elements
  const popupOverlay = document.getElementById("pdf-popup");
  const popupStructureInput = document.getElementById("popup-structure-name");
  const popupReferentInput = document.getElementById("popup-referent-name");
  const popupSalesInput = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  // Mostra popup su click normale
  generatePdfBtn.addEventListener("click", () => {
        if (!window.calculatedOfferData || !window.calculatedOfferData.rooms) {
      alert("Calcola prima l'offerta prima di generare il PDF.");
      return;
    }
    popupOverlay.style.display = "flex";
  });

  // Conferma popup → salva dati e triggera evento
 // ✅ MODIFICA FINALE - Trigger diretto al click sul bottone di conferma del popup

// Popup Confirm Button Event
popupConfirmBtn.addEventListener("click", () => {
  const struttura = popupStructureInput.value.trim();
  const referente = popupReferentInput.value.trim();
  const sale = popupSalesInput.value.trim();

  if (!struttura || !referente || !sale) {
    alert("Compila tutti i campi prima di continuare.");
    return;
  }

  if (preparedForInput) preparedForInput.value = struttura;
  if (preparedByInput) preparedByInput.value = referente;

  window.calculatedOfferData = window.calculatedOfferData || {};
  window.calculatedOfferData.preparedFor = struttura;
  window.calculatedOfferData.preparedBy = referente;
  window.calculatedOfferData.nomeSale = sale;

  popupOverlay.style.display = "none";

  // ✅ Chiamata diretta alla funzione di generazione PDF
  if (typeof generatePdfImmediately === 'function') {
    generatePdfImmediately();
  } else {
    console.error("Funzione 'generatePdfImmediately' non trovata.");
  }
});

// ✅ Estrarre la funzione principale in modo riutilizzabile
async function generatePdfImmediately() {
  const event = new Event("click-pdf-confirmed");
  generatePdfBtn.dispatchEvent(event);
}
  

  // Annulla popup
  popupCancelBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });


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
console.log("Verifica ID 'calculate-btn':", document.getElementById("calculate-btn"));
if (!calculateBtn) {
    console.error("ERRORE CRITICO: Pulsante 'Calcola' (ID: calculate-btn) non trovato nell'HTML. Si prega di verificare l'ID.");
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
  const rooms = parseInt(roomsInput?.value || "0");
  const doctors = parseInt(doctorsInput?.value || "5");

  
  if (rooms === 0 || doctors === 0) {
    alert("Inserisci almeno 1 ambulatorio e 5 medici.");
    return;
  }
    console.log("Pulsante 'Calcola' cliccato. Inizio calcoli."); 

    // --- Get input values and convert to numbers ---
    
    
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
    const setupFeeDisplayed = setupFeeDefault * 2; 

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
    if (discountPanel) discountPanel.style.display = "none"; 
    if (calculatorIcon) calculatorIcon.style.display = "none";
    if (discountMessage) discountMessage.style.display = "none";
    if (viewerBox) viewerBox.style.display = "none";
    if (ctrPanel) ctrPanel.style.display = "none";

    if (procediBtn) procediBtn.style.display = "inline-block";
    if (checkBtn) checkBtn.style.display = noa >= 1 ? "inline-block" : "none";

    if (pdfSidebar) pdfSidebar.style.display = "flex"; 
    window.calculatedOfferData = {
      rooms,
      doctors,
      cpl,
      additionalLocations,
      sediAggiuntive: additionalLocations,
      sediTotale: (additionalLocations * 99).toFixed(2),
      licenzeNoa: noa,
      noaPrice,
      noaTotale: noaTotalPrice.toFixed(2),
      defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2),
      promoMonthlyPrice: totalMonthlyPrice.toFixed(2),
      setupFeeDisplayed: setupFeeDisplayed.toFixed(2),
      setupFeeOnetime: setupFeeDefault.toFixed(2),
      salesCommission: totalCommission.toFixed(2),
      pdfTemplateUrl: PDF_TEMPLATE_URL,
      offerDate: new Date().toLocaleDateString('it-IT'),
      hasDiscountApplied: false
    };
    
    



    // --- Store calculated data for PDF generation ---
    
    console.log("Dati offerta calcolati e aggiornati:", window.calculatedOfferData);
  });


  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      console.log("Pulsante 'Check Sconti' cliccato. Inizio conto alla rovescia."); 
      if (loadingSpinner) loadingSpinner.style.display = "block";
      if (countdown) countdown.textContent = "Attendere 15 secondi...";
      let seconds = 15;

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

          window.calculatedOfferData = window.calculatedOfferData || {};
          window.calculatedOfferData.validUntilDate = validUntilDateString;
          console.log("Sconto valido fino al:", validUntilDateString);
          
          if (applyDiscountToPdfCheckbox) {
            applyDiscountToPdfCheckbox.disabled = false;
            applyDiscountToPdfCheckbox.checked = true; 
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

  if (applyDiscountToPdfCheckbox) {
    applyDiscountToPdfCheckbox.addEventListener('change', () => {
      window.calculatedOfferData = window.calculatedOfferData || {};
    window.calculatedOfferData.hasDiscountApplied = applyDiscountToPdfCheckbox.checked;
      console.log("Checkbox 'Includi sconto nel PDF' cambiata. hasDiscountApplied:", window.calculatedOfferData.hasDiscountApplied);
    });
    window.calculatedOfferData = window.calculatedOfferData || {};
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
    generatePdfBtn.addEventListener("click-pdf-confirmed", async () => {

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
          form.getTextField('Nome_sale').setText(window.calculatedOfferData.nomeSale || '');
          form.getTextField('Nome_sale1').setText(window.calculatedOfferData.nomeSale || '');

          console.log("Campo 'Nome_sale' compilato con:", window.calculatedOfferData.preparedBy);
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
          form.getTextField('Nome_sale').setText(window.calculatedOfferData.nomeSale || '');
          form.getTextField('Nome_sale1').setText(window.calculatedOfferData.nomeSale || '');

          console.log("Campo 'Nome_sale' compilato con:", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("Campo PDF 'Nome_sale' non trovato o errore:", e); }

        // Field: "Numero ambulatori inseriti" (numero_ambulatori)
        // Corrisponde all'input HTML 'rooms'
        try {
          form.getTextField('numero_ambulatori').setText(String(window.calculatedOfferData.rooms || '0'));
          console.log("Campo 'numero_ambulatori' compilato con:", window.calculatedOfferData.rooms);
        } catch (e) { console.warn("Campo PDF 'numero_ambulatori' non trovato o errore:", e); }

        // Field: "Capoluogo / Non capoluogo" (Cpl)
        // Inseriamo la tariffa in Euro
        try {
          const cplTariffa = window.calculatedOfferData.cpl === 17 ? '17 €' : '13 €';
          form.getTextField('Cpl').setText(cplTariffa);
          console.log("Campo 'Cpl' compilato con tariffa:", cplTariffa);
        } catch (e) { console.warn("Campo PDF 'Cpl' non trovato o errore:", e); }

        // Field: "Canone mensile predefinito (pagina 1)" (Quota_mensile_default)
        try {
          form.getTextField('Quota_mensile_default').setText(window.calculatedOfferData.defaultMonthlyPrice + ' €' || '0 €');

          try {
            const sedi = String(window.calculatedOfferData.sediAggiuntive || 0);
            const quotaSedi = String(window.calculatedOfferData.sediTotale || 0) + " €";
          
            form.getTextField('n_sedi_aggiuntive').setText(sedi);
            form.getTextField('quota_mensile_sedi').setText(quotaSedi);
            console.log("Campi sedi compilati con:", sedi, quotaSedi);
          } catch (e) {
            console.warn("Errore nel compilare i campi sedi aggiuntive:", e);
          }

          console.log("Campo 'Quota_mensile_default' compilato con:", window.calculatedOfferData.defaultMonthlyPrice);
        } catch (e) { console.warn("Campo PDF 'Quota_mensile_default' non trovato o errore:", e); }


        // Field: "Totale (canone + setup)" (Quota_scontata)
        // Questo campo viene compilato con il riepilogo dello sconto SOLO SE la checkbox è spuntata.
        try {
  const quotaField = form.getTextField('Quota_scontata');

  if (window.calculatedOfferData.hasDiscountApplied) {
    const prezzoOriginale = window.calculatedOfferData.defaultMonthlyPrice;
    const prezzoScontato = window.calculatedOfferData.promoMonthlyPrice;
    const setupOriginale = window.calculatedOfferData.setupFeeDisplayed;
    const setupScontato = window.calculatedOfferData.setupFeeOnetime;

    const riepilogoScontoString =
      `Prezzo Originale: ${prezzoOriginale} €\n` +
      `Setup Fee: ${setupOriginale} €\n\n` +
      `Prezzo Scontato: ${prezzoScontato} €\n` +
      `Setup Scontato: ${setupScontato} €`;

    quotaField.setText(riepilogoScontoString);
    console.log("Campo 'Quota_scontata' compilato con riepilogo sconto:", riepilogoScontoString);
  } else {
    quotaField.setText('');
    console.log("Campo 'Quota_scontata' lasciato vuoto perché la checkbox sconto non è spuntata.");
  }
} catch (e) {
  console.warn("Campo PDF 'Quota_scontata' non trovato o errore:", e);
}


        // Field: "Canone mensile scontato (se applicabile)" (Quota_mensile_scontata)
        // Questo deve essere sempre il promoMonthlyPrice (prezzo scontato dopo il calcolo).
        try {
          form.getTextField('Quota_mensile_scontata').setText(window.calculatedOfferData.promoMonthlyPrice + ' €' || '0 €');
          console.log("Campo 'Quota_mensile_scontata' compilato con:", window.calculatedOfferData.promoMonthlyPrice);
        } catch (e) { console.warn("Campo PDF 'Quota_mensile_scontata' non trovato o errore:", e); }
        // Campo: quota_mensile_totale
try {
  form.getTextField('quota_mensile_totale').setText(window.calculatedOfferData.promoMonthlyPrice + ' €');
  console.log("Campo 'quota_mensile_totale' compilato con:", window.calculatedOfferData.promoMonthlyPrice);
} catch (e) { console.warn("Campo 'quota_mensile_totale' non trovato:", e); }

// Campo: setup_fee
try {
  form.getTextField('setup_fee').setText(window.calculatedOfferData.setupFeeOnetime + ' €');
  console.log("Campo 'setup_fee' compilato con:", window.calculatedOfferData.setupFeeOnetime);
} catch (e) { console.warn("Campo 'setup_fee' non trovato:", e); }

// Campo: setup_fee_originale
try {
  form.getTextField('setup_fee_originale').setText(window.calculatedOfferData.setupFeeDisplayed + ' €');
  console.log("Campo 'setup_fee_originale' compilato con:", window.calculatedOfferData.setupFeeDisplayed);
} catch (e) { console.warn("Campo 'setup_fee_originale' non trovato:", e); }

// Campo: commissione_totale
try {
  form.getTextField('commissione_totale').setText(window.calculatedOfferData.salesCommission + ' €');
  console.log("Campo 'commissione_totale' compilato con:", window.calculatedOfferData.salesCommission);
} catch (e) { console.warn("Campo 'commissione_totale' non trovato:", e); }

// Campo: medici
try {
  form.getTextField('medici').setText(String(window.calculatedOfferData.doctors || '0'));
  console.log("Campo 'medici' compilato con:", window.calculatedOfferData.doctors);
} catch (e) { console.warn("Campo 'medici' non trovato:", e); }

// Campo: sedi_aggiuntive
try {
  form.getTextField('sedi_aggiuntive').setText(String(window.calculatedOfferData.additionalLocations || '0'));
  console.log("Campo 'sedi_aggiuntive' compilato con:", window.calculatedOfferData.additionalLocations);
} catch (e) { console.warn("Campo 'sedi_aggiuntive' non trovato:", e); }



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
