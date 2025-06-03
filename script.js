document.addEventListener("DOMContentLoaded", () => {
  console.log("Script caricato");

  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const pdfSidebar = document.getElementById("pdf-sidebar");

  const defaultMonthlyPriceField = document.getElementById("default-monthly-price");
  const setupFeeField = document.getElementById("setup-fee");
  const originalMonthlyPriceField = document.getElementById("original-monthly-price");
  const promoMonthlyPriceField = document.getElementById("promo-monthly-price");
  const originalSetupFeeField = document.getElementById("original-setup-fee");
  const promoSetupFeeField = document.getElementById("promo-setup-fee");
  const salesCommissionsField = document.getElementById("sales-commissions");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const discountPanel = document.getElementById("discount-panel");
  const discountMessage = document.getElementById("discount-message");
  const discountDate = document.getElementById("discount-date");
  const viewerBox = document.getElementById("live-viewers");
  const countdown = document.getElementById("countdown");
  const loadingSpinner = document.getElementById("loading-spinner");

  const roomsInput = document.getElementById("rooms");
  const doctorsInput = document.getElementById("doctors");
  const cplSelect = document.getElementById("cpl");
  const additionalLocationsInput = document.getElementById("additional-locations");
  const noaInput = document.getElementById("noa");
  const noaPriceSelect = document.getElementById("noa-price");

  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");

  // POPUP
  const popupOverlay = document.getElementById("pdf-popup");
  const popupStructureInput = document.getElementById("popup-structure-name");
  const popupReferentInput = document.getElementById("popup-referent-name");
  const popupSalesInput = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  const preparedForInput = document.getElementById("prepared-for");
  const preparedByInput = document.getElementById("prepared-by");

  // Mostra il popup quando clicco su "Genera PDF"
  generatePdfBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!window.calculatedOfferData || !window.calculatedOfferData.defaultMonthlyPrice) {
      alert("Devi prima cliccare su CALCOLA per generare il PDF.");
      return;
    }
    popupOverlay.style.display = "flex";
  });

  // Chiudi popup
  popupCancelBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Conferma popup e genera PDF
  popupConfirmBtn.addEventListener("click", () => {
    const struttura = popupStructureInput.value.trim();
    const referente = popupReferentInput.value.trim();
    const sale = popupSalesInput.value.trim();

    if (!struttura || !referente || !sale) {
      alert("Compila tutti i campi prima di continuare.");
      return;
    }

    window.calculatedOfferData = window.calculatedOfferData || {};
    window.calculatedOfferData.preparedFor = struttura;
    window.calculatedOfferData.preparedBy = referente;
    window.calculatedOfferData.nomeSale = sale;

    popupOverlay.style.display = "none";
    generatePdfBtn.dispatchEvent(new Event("click-pdf-confirmed"));
  });

  // CALCOLO
  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(roomsInput.value || 0);
    const doctors = parseInt(doctorsInput.value || 0);
    const cpl = parseInt(cplSelect.value || 0);
    const additionalLocations = parseInt(additionalLocationsInput.value || 0);
    const noa = parseInt(noaInput.value || 0);
    const noaPrice = parseInt(noaPriceSelect.value || 0);

    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayed = setupFeeDefault * 2;
    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotal = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotal;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotal + setupFeeDefault / 12;

    defaultMonthlyPriceField.textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    setupFeeField.textContent = `${setupFeeDisplayed.toFixed(2)} €`;
    salesCommissionsField.textContent = `${totalCommission.toFixed(2)} €`;
    originalMonthlyPriceField.textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    promoMonthlyPriceField.textContent = `${totalMonthlyPrice.toFixed(2)} €`;
    originalSetupFeeField.textContent = `${setupFeeDefault.toFixed(2)} €`;
    promoSetupFeeField.textContent = `${setupFeeDefault.toFixed(2)} €`;

    document.getElementById("results").style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessage.style.display = "none";
    viewerBox.style.display = "none";
    ctrPanel.style.display = "none";
    procediBtn.style.display = "inline-block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
    pdfSidebar.style.display = "flex";

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 10);

    window.calculatedOfferData = {
      rooms,
      doctors,
      cpl,
      additionalLocations,
      noaLicenses: noa,
      noaPrice,
      defaultMonthlyPrice: defaultMonthlyPrice.toFixed(2),
      setupFeeOnetime: setupFeeDefault.toFixed(2),
      setupFeeDisplayed: setupFeeDisplayed.toFixed(2),
      promoMonthlyPrice: totalMonthlyPrice.toFixed(2),
      salesCommissions: totalCommission.toFixed(2),
      offerDate: new Date().toLocaleDateString("it-IT"),
      validUntilDate: validUntilDate.toLocaleDateString("it-IT"),
      hasDiscountApplied: false
    };
  });

  // CHECK SCONTI
  checkBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    let seconds = 15;
    countdown.textContent = `Attendere ${seconds} secondi...`;

    applyDiscountToPdfCheckbox.disabled = true;

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
        viewerBox.style.display = "flex";
        applyDiscountToPdfCheckbox.checked = true;
        applyDiscountToPdfCheckbox.disabled = false;
        window.calculatedOfferData.hasDiscountApplied = true;
      }
    }, 1000);
  });

  // GENERA PDF dopo conferma popup
  generatePdfBtn.addEventListener("click-pdf-confirmed", async () => {
    const url = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";
    const { PDFDocument } = PDFLib;

    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    const d = window.calculatedOfferData;
    form.getTextField("nome_struttura").setText(d.preparedFor || "");
    form.getTextField("Nome_referente").setText(d.preparedBy || "");
    form.getTextField("Nome_sale").setText(d.nomeSale || d.preparedBy || "");
    form.getTextField("Data_offerta").setText(d.offerDate);
    form.getTextField("Nome_struttura1").setText(d.preparedFor || "");
    form.getTextField("Scadenza_offerta").setText(d.validUntilDate);
    form.getTextField("Nome_sale1").setText(d.nomeSale || d.preparedBy || "");
    form.getTextField("numero_ambulatori").setText(String(d.rooms || ""));
    form.getTextField("Cpl").setText(d.cpl === 17 ? "17 €" : "13 €");
    form.getTextField("Quota_mensile_default").setText(`${d.defaultMonthlyPrice} €`);
    form.getTextField("Quota_mensile_scontata").setText(`${d.promoMonthlyPrice} €`);

    if (d.hasDiscountApplied) {
      const s = `Prezzo Originale: ${d.defaultMonthlyPrice} €\nSetup Fee: ${d.setupFeeDisplayed} €\n\nPrezzo Scontato: ${d.promoMonthlyPrice} €\nSetup Scontato: ${d.setupFeeOnetime} €`;
      form.getTextField("Quota_scontata").setText(s);
    } else {
      form.getTextField("Quota_scontata").setText("");
    }

    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const clientName = (d.preparedFor || "Clinica").replace(/\s/g, "_");
    const date = new Date().toLocaleDateString("it-IT").replace(/\//g, "-");
    a.href = urlBlob;
    a.download = `Preventivo_MioDottore_${clientName}_${date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  });
});
