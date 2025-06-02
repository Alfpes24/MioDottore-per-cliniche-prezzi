document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn"); // Get the new button [cite: 1]
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
  const noaInput = document.getElementById("noa");

  // Define the PDF template URL
  const PDF_TEMPLATE_URL = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf"; [cite: 2]

  // Global object to store calculated values for PDF generation
  window.calculatedOfferData = {};

  calculatorIcon.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(noaInput.value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

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

    setupFeeField.textContent = setupFeeDisplayed.toFixed(2) + " €";
    defaultMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    salesCommissionsField.textContent = totalCommission.toFixed(2) + " €";

    originalMonthlyPriceField.textContent = defaultMonthlyPrice.toFixed(2) + " €";
    promoMonthlyPriceField.textContent = totalMonthlyPrice.toFixed(2) + " €";
    originalSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";
    promoSetupFeeField.textContent = setupFeeDefault.toFixed(2) + " €";

    resultsBox.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessage.style.display = "none";
    viewerBox.style.display = "none";
    ctrPanel.style.display = "none";

    procediBtn.style.display = "inline-block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
    generatePdfBtn.style.display = "inline-block"; // Show the PDF button [cite: 1]

    // Store calculated values and the PDF URL in the global object
    window.calculatedOfferData = {
      rooms: rooms,
      doctors: doctors,
      cpl: cpl,
      additionalLocations: additionalLocations,
      noaLicenses: noa,
      noaPrice: noaPrice,
      defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2),
      setupFeeOnetime: setupFeeDefault.toFixed(2),
      promoMonthlyPrice: totalMonthlyPrice.toFixed(2),
      salesCommission: totalCommission.toFixed(2),
      offerDate: new Date().toLocaleDateString("it-IT"),
      validUntilDate: "",
      pdfTemplateUrl: PDF_TEMPLATE_URL
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
        validUntil.setDate(today.getDate() + 10);
        const validUntilDateString = validUntil.toLocaleDateString("it-IT");
        discountDate.textContent = `Valido fino al: ${validUntilDateString}`;

        window.calculatedOfferData.validUntilDate = validUntilDateString;

        viewerBox.style.display = "flex";
        updateViewerCount();
        setInterval(updateViewerCount, 20000);
      }
    }, 1000);
  });

  // Event listener for the new "Genera PDF Preventivo" button [cite: 1]
  generatePdfBtn.addEventListener("click", async () => {
    // This example uses pdf-lib as a conceptual demonstration.
    // You would need to include the pdf-lib library in your project (e.g., via CDN or npm).
    // Example: <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>

    if (!window.calculatedOfferData) {
      alert("Please calculate the offer first.");
      return;
    }

    try {
      // Fetch the existing PDF template
      const existingPdfBytes = await fetch(PDF_TEMPLATE_URL).then(res => res.arrayBuffer());
      const { PDFDocument, rgb, StandardFonts } = PDFLib; // Assumes PDFLib is available globally

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the form from the PDF
      const form = pdfDoc.getForm();

      // You need to know the exact names of the form fields in your PDF template.
      // These are placeholders. You MUST replace them with the actual field names from your PDF.
      // You can inspect your PDF using a tool like Adobe Acrobat or a free online PDF form field inspector
      // (e.g., https://pdf-online.com/pdf-form-fields-viewer.aspx) to find these names.

      // Example of setting fields (replace 'YOUR_FIELD_NAME' with actual names)
      // Note: Error handling included for each field in case it's not found in the PDF
      try {
        form.getTextField('NumeroStanzeAmbulatori').setText(String(window.calculatedOfferData.rooms));
      } catch (e) { console.warn("Field 'NumeroStanzeAmbulatori' not found or error:", e); }
      try {
        form.getTextField('QuotaMensileStruttura').setText(window.calculatedOfferData.promoMonthlyPrice + ' €');
      } catch (e) { console.warn("Field 'QuotaMensileStruttura' not found or error:", e); }
      try {
        form.getTextField('SetupFeeUnaTantum').setText(window.calculatedOfferData.setupFeeOnetime + ' €');
      } catch (e) { console.warn("Field 'SetupFeeUnaTantum' not found or error:", e); }
      try {
        form.getTextField('DataOfferta').setText(window.calculatedOfferData.offerDate);
      } catch (e) { console.warn("Field 'DataOfferta' not found or error:", e); }
      try {
        form.getTextField('OffertaValidaFinoA').setText(window.calculatedOfferData.validUntilDate);
      } catch (e) { console.warn("Field 'OffertaValidaFinoA' not found or error:", e); }
      try {
         form.getTextField('CommissioneNuovoPaziente').setText(window.calculatedOfferData.salesCommission + ' €');
      } catch (e) { console.warn("Field 'CommissioneNuovoPaziente' not found or error:", e); }

      // You would also need fields for "Preparata per:", "Redatta da:", "Spett.le" if they are inputs.
      // For instance, if you added input fields to your HTML for these:
      // const preparedFor = document.getElementById('prepared-for-input').value;
      // try { form.getTextField('PreparedForField').setText(preparedFor); } catch (e) { console.warn("Field 'PreparedForField' not found or error:", e); }


      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Create a Blob from the PDF bytes and create a download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Preventivo_MioDottore.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the object URL

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please check the console for details.");
    }
  });

  discountMessage.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = randomViewers;
  }
});
