document.addEventListener("DOMContentLoaded", () => {
  // --- Get DOM Elements ---
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn"); // New PDF button
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

  // Input fields for PDF customization (optional, but good for filling the PDF)
  const preparedForInput = document.getElementById("prepared-for");
  const preparedByInput = document.getElementById("prepared-by");

  // Define the PDF template URL
  const PDF_TEMPLATE_URL = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";

  // Global object to store calculated values for PDF generation
  window.calculatedOfferData = {};

  // --- Event Listeners ---
  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  calculateBtn.addEventListener("click", () => {
    // --- Get input values and convert to numbers ---
    const rooms = parseInt(roomsInput.value) || 0;
    const doctors = parseInt(doctorsInput.value) || 0;
    const cpl = parseInt(cplSelect.value) || 0;
    const additionalLocations = parseInt(additionalLocationsInput.value) || 0;
    const noa = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(noaPriceSelect.value) || 0;

    // --- Price Tables and Calculations ---
    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0); // Ensure index is within bounds

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeDefault * 2; // Doubled for initial display

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    // CTR commission uses the default setup fee (not doubled) divided by 12 months
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;

    // --- Update Displayed Results ---
    setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";
    defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";
    promoSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";

    // --- Toggle Visibility of Sections/Buttons ---
    resultsBox.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessage.style.display = "none";
    viewerBox.style.display = "none";
    ctrPanel.style.display = "none";

    procediBtn.style.display = "inline-block";
    generatePdfBtn.style.display = "inline-block"; // Make PDF button visible
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none"; // Only show check if NOA licenses > 0

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
      preparedFor: preparedForInput.value, // Get value from new input field
      preparedBy: preparedByInput.value // Get value from new input field
    };
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
        const validUntil = new Date();
        validUntil.setDate(today.getDate() + 10); // Offer valid for 10 days
        const validUntilDateString = validUntil.toLocaleDateString("it-IT");
        discountDate.textContent = `Valido fino al: ${validUntilDateString}`;

        // Update the validUntilDate in the global object for PDF
        window.calculatedOfferData.validUntilDate = validUntilDateString;

        viewerBox.style.display = "flex";
        updateViewerCount();
        // Update viewer count every 20 seconds
        setInterval(updateViewerCount, 20000);
      }
    }, 1000);
  });

  discountMessage.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  // --- PDF Generation Logic ---
  generatePdfBtn.addEventListener("click", async () => {
    if (!window.calculatedOfferData || !window.calculatedOfferData.pdfTemplateUrl) {
      alert("Please calculate the offer first.");
      return;
    }

    try {
      // Fetch the existing PDF template from the specified URL
      const existingPdfBytes = await fetch(window.calculatedOfferData.pdfTemplateUrl).then(res => res.arrayBuffer());
      const { PDFDocument, rgb, StandardFonts } = PDFLib; // Ensure PDFLib is globally available

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the form from the PDF
      const form = pdfDoc.getForm();

      // --- Populate PDF Fields ---
      // IMPORTANT: Replace 'YOUR_ACTUAL_PDF_FIELD_NAME' with the exact names from your PDF
      // Use console.warn to see if a field is not found, rather than crashing the script.

      // Page 1 fields
      try {
        form.getTextField('Preparata_per').setText(window.calculatedOfferData.preparedFor);
      } catch (e) { console.warn("PDF Field 'Preparata_per' not found or error:", e); }
      try {
        form.getTextField('Redatta_da').setText(window.calculatedOfferData.preparedBy);
      } catch (e) { console.warn("PDF Field 'Redatta_da' not found or error:", e); }

      // Page 4 fields
      try {
        form.getTextField('Data_Offerta').setText(window.calculatedOfferData.offerDate);
      } catch (e) { console.warn("PDF Field 'Data_Offerta' not found or error:", e); }
      try {
        form.getTextField('Offerta_Valida_Fino_A').setText(window.calculatedOfferData.validUntilDate);
      } catch (e) { console.warn("PDF Field 'Offerta_Valida_Fino_A' not found or error:", e); }
      try {
        form.getTextField('Spett_le').setText(window.calculatedOfferData.preparedFor); // Assuming "Spett.le" is also the client name
      } catch (e) { console.warn("PDF Field 'Spett_le' not found or error:", e); }


      // Page 5 fields
      try {
        // This is for "Numero Stanze/ambulatori" on page 5 [cite: 15]
        // Assuming PDF field name is 'NumeroStanzeAmbulatori' or similar
        form.getTextField('Numero_Stanze_Ambulatori').setText(String(window.calculatedOfferData.rooms));
      } catch (e) { console.warn("PDF Field 'Numero_Stanze_Ambulatori' not found or error:", e); }

      try {
        // This is for "Quota mensile per struttura" for MIODOTTORE CRM on page 5 [cite: 15]
        // Assuming PDF field name is 'QuotaMensilePerStruttura' or similar
        form.getTextField('Quota_Mensile_Struttura_CRM').setText(window.calculatedOfferData.promoMonthlyPrice + ' €');
      } catch (e) { console.warn("PDF Field 'Quota_Mensile_Struttura_CRM' not found or error:", e); }

      try {
        // This is for "TOTALE:" for MIODOTTORE CRM on page 5 [cite: 15]
        // Assuming PDF field name is 'TotaleCRM' or similar. It might be the same as monthly price.
        form.getTextField('Totale_CRM').setText(window.calculatedOfferData.promoMonthlyPrice + ' €');
      } catch (e) { console.warn("PDF Field 'Totale_CRM' not found or error:", e); }

      try {
        // This is for "Commissione a prenotazione NUOVO PAZIENTE" on page 5 [cite: 17]
        // Assuming PDF field name is 'CommissioneNuovoPaziente' or similar
        form.getTextField('Commissione_Nuovo_Paziente').setText(window.calculatedOfferData.salesCommission + ' €');
      } catch (e) { console.warn("PDF Field 'Commissione_Nuovo_Paziente' not found or error:", e); }

      try {
        // This is for "Quota per struttura Una Tantum" for TRAINING on page 5 [cite: 16]
        // Assuming PDF field name is 'QuotaStrutturaUnaTantum' or similar
        form.getTextField('Quota_Struttura_Una_Tantum').setText(window.calculatedOfferData.setupFeeOnetime + ' €');
      } catch (e) { console.warn("PDF Field 'Quota_Struttura_Una_Tantum' not found or error:", e); }


      // Flatten the form fields to make them part of the document content
      form.flatten();

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Create a Blob from the PDF bytes and create a download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Preventivo_MioDottore_${window.calculatedOfferData.preparedFor.replace(/\s/g, '_') || 'Clinica'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the object URL

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Si è verificato un errore durante la generazione del PDF. Controlla la console per i dettagli.");
    }
  });

  // --- Helper Functions ---
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = randomViewers;
  }
});
