document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed. Initializing script.");

  // --- Get DOM Elements ---
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
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
  const preparedByInput = document.getElementById("prepared-by"); // This maps to Nome_referente (from the PDF fields)

  // Log to check if elements are found
  console.log({ calculateBtn, roomsInput, preparedForInput, generatePdfBtn });
  if (!calculateBtn) {
    console.error("Error: 'calculate-btn' not found in the DOM. Script may not function correctly.");
  }

  // Define the PDF template URL
  const PDF_TEMPLATE_URL = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";
  console.log("PDF Template URL:", PDF_TEMPLATE_URL);

  // Global object to store calculated values for PDF generation
  window.calculatedOfferData = {};

  // --- Event Listeners ---
  calculatorIcon.addEventListener("click", () => {
    console.log("Calculator icon clicked.");
    if (ctrPanel) ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  calculateBtn.addEventListener("click", () => {
    console.log("Calculate button clicked.");

    // --- Get input values and convert to numbers ---
    const rooms = parseInt(roomsInput ? roomsInput.value : "0") || 0;
    const doctors = parseInt(doctorsInput ? doctorsInput.value : "0") || 0;
    const cpl = parseInt(cplSelect ? cplSelect.value : "0") || 0;
    const additionalLocations = parseInt(additionalLocationsInput ? additionalLocationsInput.value : "0") || 0;
    const noa = parseInt(noaInput ? noaInput.value : "0") || 0;
    const noaPrice = parseInt(noaPriceSelect ? noaPriceSelect.value : "0") || 0;

    console.log("Input values for calculation:", { rooms, doctors, cpl, additionalLocations, noa, noaPrice });

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

    console.log("Calculated pricing details:", { setupFeeDefault, monthlyPrice, totalMonthlyPrice, defaultMonthlyPrice, totalCommission });

    // --- Update Displayed Results ---
    if (setupFeeField) setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";
    if (defaultMonthlyPriceField) defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    if (salesCommissionsField) salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    if (originalMonthlyPriceField) originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    if (promoMonthlyPriceField) promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    if (originalSetupFeeField) originalSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";
    if (promoSetupFeeField) promoSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";

    // --- Toggle Visibility of Sections/Buttons ---
    if (resultsBox) resultsBox.style.display = "block";
    if (discountPanel) discountPanel.style.display = "none";
    if (calculatorIcon) calculatorIcon.style.display = "none";
    if (discountMessage) discountMessage.style.display = "none";
    if (viewerBox) viewerBox.style.display = "none";
    if (ctrPanel) ctrPanel.style.display = "none";

    if (procediBtn) procediBtn.style.display = "inline-block";
    if (generatePdfBtn) generatePdfBtn.style.display = "inline-block";
    if (checkBtn) checkBtn.style.display = noa >= 1 ? "inline-block" : "none";

    // --- Store calculated data for PDF generation ---
    window.calculatedOfferData = {
      rooms: rooms,
      doctors: doctors,
      cpl: cpl,
      additionalLocations: additionalLocations,
      noaLicenses: noa,
      noaPrice: noaPrice,
      defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2),
      setupFeeOnetime: setupFeeDefault.toFixed(2), // Use the default, single setup fee for PDF
      promoMonthlyPrice: totalMonthlyPrice.toFixed(2),
      salesCommission: totalCommission.toFixed(2),
      offerDate: new Date().toLocaleDateString("it-IT"),
      validUntilDate: "", // Will be updated after checkBtn is pressed
      pdfTemplateUrl: PDF_TEMPLATE_URL,
      preparedFor: preparedForInput ? preparedForInput.value : "", // For 'nome_struttura' and 'indirizzo' (if provided in preparedFor)
      preparedBy: preparedByInput ? preparedByInput.value : "" // For 'Nome_referente'
    };
    console.log("Updated window.calculatedOfferData:", window.calculatedOfferData);
  });

  checkBtn.addEventListener("click", () => {
    console.log("Check Sconti button clicked.");
    if (loadingSpinner) loadingSpinner.style.display = "block";
    if (countdown) countdown.textContent = "Attendere 15 secondi...";
    let seconds = 15;

    const interval = setInterval(() => {
      seconds--;
      if (countdown) countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
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
        console.log("Discount valid until:", validUntilDateString);

        if (viewerBox) viewerBox.style.display = "flex";
        updateViewerCount();
        setInterval(updateViewerCount, 20000);
      }
    }, 1000);
  });

  if (discountMessage) {
    discountMessage.addEventListener("click", () => {
      console.log("Discount message clicked. Scrolling to discount panel.");
      if (discountPanel) discountPanel.scrollIntoView({ behavior: "smooth" });
    });
  }

  // --- PDF Generation Logic ---
  if (generatePdfBtn) {
    generatePdfBtn.addEventListener("click", async () => {
      console.log("Generate PDF button clicked.");

      if (!window.calculatedOfferData || !window.calculatedOfferData.pdfTemplateUrl) {
        alert("Please calculate the offer first.");
        console.error("PDF generation aborted: calculatedOfferData or pdfTemplateUrl is missing.");
        return;
      }

      if (typeof PDFLib === 'undefined' || !PDFLib.PDFDocument) {
          alert("Errore: La libreria PDF non è stata caricata correttamente. Assicurati che <script src='https://unpkg.com/pdf-lib/dist/pdf-lib.min.js'></script> sia nel tuo HTML, prima del tuo script.js.");
          console.error("PDFLib is not defined. Please ensure the pdf-lib CDN script is loaded.");
          return;
      }

      try {
        console.log("Fetching PDF template from:", window.calculatedOfferData.pdfTemplateUrl);
        const existingPdfBytes = await fetch(window.calculatedOfferData.pdfTemplateUrl).then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status} when fetching PDF template.`);
          }
          return res.arrayBuffer();
        });
        const { PDFDocument } = PDFLib;

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("PDF template loaded successfully.");

        const form = pdfDoc.getForm();
        console.log("PDF form obtained.");

        // --- Populate PDF Fields using the CONFIRMED names from your PDF ---

        // Field: "Nome della struttura" and "Nome struttura ripetuta"
        // Corresponds to HTML input 'prepared-for'
        try {
          form.getTextField('nome_struttura').setText(window.calculatedOfferData.preparedFor || '');
          console.log("Filled 'nome_struttura':", window.calculatedOfferData.preparedFor);
        } catch (e) { console.warn("PDF Field 'nome_struttura' not found or error:", e); }
        try {
          form.getTextField('nome_struttura1').setText(window.calculatedOfferData.preparedFor || '');
          console.log("Filled 'nome_struttura1':", window.calculatedOfferData.preparedFor);
        } catch (e) { console.warn("PDF Field 'nome_struttura1' not found or error:", e); }

        // Field: "Indirizzo struttura"
        // This is not a separate input in your HTML. If 'prepared-for' includes the address,
        // it would need parsing, or you'd need a new input. For now, it will be empty or use 'preparedFor'.
        try {
          // Assuming 'indirizzo' is meant to be the full client name/address from preparedFor
          form.getTextField('indirizzo').setText(window.calculatedOfferData.preparedFor || '');
          console.log("Filled 'indirizzo':", window.calculatedOfferData.preparedFor);
        } catch (e) { console.warn("PDF Field 'indirizzo' not found or error:", e); }

        // Field: "Nome referente"
        // Corresponds to HTML input 'prepared-by'
        try {
          form.getTextField('Nome_referente').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Filled 'Nome_referente':", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("PDF Field 'Nome_referente' not found or error:", e); }

        // Field: "Nome venditore"
        // Corresponds to HTML input 'prepared-by' (assuming commercial/sales person)
        try {
          // Assuming 'Nome_sale' here means the sales person's name or is an old field for rooms.
          // Your list connects 'Nome_sale' and 'Nome_sale1' to 'Nome venditore'.
          // If it means "Nome venditore", use preparedBy. If it's still for "rooms", then rooms.
          // Let's assume 'Nome venditore' mapping for now.
          form.getTextField('Nome_sale').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Filled 'Nome_sale' (Nome venditore):", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("PDF Field 'Nome_sale' not found or error:", e); }
        try {
          form.getTextField('Nome_sale1').setText(window.calculatedOfferData.preparedBy || '');
          console.log("Filled 'Nome_sale1' (Nome venditore):", window.calculatedOfferData.preparedBy);
        } catch (e) { console.warn("PDF Field 'Nome_sale1' not found or error:", e); }

        // Field: "Canone mensile" (default and discounted)
        try {
          form.getTextField('Quota_mensile_default').setText(window.calculatedOfferData.defaultMonthlyPrice + ' €' || '0 €');
          console.log("Filled 'Quota_mensile_default':", window.calculatedOfferData.defaultMonthlyPrice);
        } catch (e) { console.warn("PDF Field 'Quota_mensile_default' not found or error:", e); }
        try {
          form.getTextField('Quota_mensile_default_2').setText(window.calculatedOfferData.defaultMonthlyPrice + ' €' || '0 €');
          console.log("Filled 'Quota_mensile_default_2':", window.calculatedOfferData.defaultMonthlyPrice);
        } catch (e) { console.warn("PDF Field 'Quota_mensile_default_2' not found or error:", e); }

        try {
          // Your list implies Quota_scontata is for "Setup fee"
          // However, based on previous iterations, promoMonthlyPrice was assigned to Quota_scontata.
          // Let's use it for Setup Fee as per your latest list.
          form.getTextField('Quota_scontata').setText(window.calculatedOfferData.setupFeeOnetime + ' €' || '0 €');
          console.log("Filled 'Quota_scontata' (Setup Fee):", window.calculatedOfferData.setupFeeOnetime);
        } catch (e) { console.warn("PDF Field 'Quota_scontata' not found or error:", e); }

        // Field: "Data offerta"
        try {
          form.getTextField('Data_offerta').setText(window.calculatedOfferData.offerDate || '');
          console.log("Filled 'Data_offerta':", window.calculatedOfferData.offerDate);
        } catch (e) { console.warn("PDF Field 'Data_offerta' not found or error:", e); }

        // Field: "Scadenza offerta"
        try {
          form.getTextField('Scadenza_offerta').setText(window.calculatedOfferData.validUntilDate || '');
          console.log("Filled 'Scadenza_offerta':", window.calculatedOfferData.validUntilDate);
        } catch (e) { console.warn("PDF Field 'Scadenza_offerta' not found or error:", e); }

        // Field: "Ambulatori"
        try {
          form.getTextField('numero_ambulatori').setText(String(window.calculatedOfferData.rooms || '0'));
          console.log("Filled 'numero_ambulatori':", window.calculatedOfferData.rooms);
        } catch (e) { console.warn("PDF Field 'numero_ambulatori' not found or error:", e); }

        // Field: "Capoluogo/Non capoluogo"
        try {
          const cplText = window.calculatedOfferData.cpl === 17 ? 'Capoluogo' : 'No Capoluogo';
          form.getTextField('Cpl').setText(cplText);
          console.log("Filled 'Cpl':", cplText);
        } catch (e) { console.warn("PDF Field 'Cpl' not found or error:", e); }


        // Note: The previous fields for 'Commissione_a_prenotazione_NUOVO_PAZIENTE' and 'Quota_per_struttura_Una_Tantum'
        // are not explicitly in your *new* list, so I'm commenting them out to avoid filling non-existent fields.
        // If they are present and you want them filled, you need to add them back with their correct names.
        /*
        try {
            form.getTextField('Commissione_a_prenotazione_NUOVO_PAZIENTE').setText(window.calculatedOfferData.salesCommission + ' €' || '0 €');
            console.log("Filled 'Commissione_a_prenotazione_NUOVO_PAZIENTE':", window.calculatedOfferData.salesCommission);
        } catch (e) { console.warn("PDF Field 'Commissione_a_prenotazione_NUOVO_PAZIENTE' not found or error:", e); }

        try {
            form.getTextField('Quota_per_struttura_Una_Tantum').setText(window.calculatedOfferData.setupFeeOnetime + ' €' || '0 €');
            console.log("Filled 'Quota_per_struttura_Una_Tantum':", window.calculatedOfferData.setupFeeOnetime);
        } catch (e) { console.warn("PDF Field 'Quota_per_struttura_Una_Tantum' not found or error:", e); }
        */

        // If 'Quota_mensile_scontata' still represents the promo monthly price, keep this:
        try {
          // This field (Quota_mensile_scontata) was in your *previous* list as "Quota mensile per struttura".
          // It seems to be the discounted monthly price.
          form.getTextField('Quota_mensile_scontata').setText(window.calculatedOfferData.promoMonthlyPrice + ' €' || '0 €');
          console.log("Filled 'Quota_mensile_scontata':", window.calculatedOfferData.promoMonthlyPrice);
        } catch (e) { console.warn("PDF Field 'Quota_mensile_scontata' not found or error:", e); }


        // Flatten the form fields to make them part of the document content
        form.flatten();
        console.log("PDF form fields flattened.");

        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();
        console.log("PDF saved to bytes.");

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
        console.log("PDF download initiated.");

      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Si è verificato un errore durante la generazione del PDF. Controlla la console per i dettagli.");
      }
    });
  } else {
    console.warn("Element with ID 'generate-pdf-btn' not found. PDF generation button will not work.");
  }


  // --- Helper Functions ---
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    if (viewerCountSpan) viewerCountSpan.textContent = randomViewers;
    console.log("Viewer count updated to:", randomViewers);
  }
});
