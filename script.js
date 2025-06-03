document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const pdfSidebar = document.getElementById("pdf-sidebar");

  const popupOverlay = document.getElementById("pdf-popup");
  const popupStructure = document.getElementById("popup-structure-name");
  const popupReferent = document.getElementById("popup-referent-name");
  const popupSales = document.getElementById("popup-sales-name");
  const popupConfirm = document.getElementById("popup-confirm-btn");
  const popupCancel = document.getElementById("popup-cancel-btn");

  const applyDiscountToPdfCheckbox = document.getElementById("apply-discount-to-pdf");

  let offerData = {};

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const locations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    const priceTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const setupTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const index = rooms >= 11 ? 10 : rooms;

    const pricePerRoom = priceTable[index];
    const setupFee = setupTable[index];

    const baseMonthly = pricePerRoom * rooms + locations * 99 + noa * noaPrice;
    const fullMonthly = baseMonthly * 1.25;
    const commission = pricePerRoom * rooms + (cpl === 17 ? 8 : 6) * doctors;

    document.getElementById("default-monthly-price").textContent = fullMonthly.toFixed(2) + " €";
    document.getElementById("setup-fee").textContent = (setupFee * 2).toFixed(2) + " €";

    document.getElementById("original-monthly-price").textContent = fullMonthly.toFixed(2) + " €";
    document.getElementById("promo-monthly-price").textContent = baseMonthly.toFixed(2) + " €";
    document.getElementById("original-setup-fee").textContent = setupFee.toFixed(2) + " €";
    document.getElementById("promo-setup-fee").textContent = setupFee.toFixed(2) + " €";
    document.getElementById("sales-commissions").textContent = commission.toFixed(2) + " €";

    document.getElementById("results").style.display = "block";
    if (noa > 0) checkBtn.style.display = "inline-block";
    procediBtn.style.display = "inline-block";
    pdfSidebar.style.display = "flex";

    offerData = {
      rooms,
      doctors,
      cpl,
      locations,
      noa,
      noaPrice,
      baseMonthly,
      fullMonthly,
      setupFee,
      commission,
      validUntil: "",
      discount: false
    };
  });

  checkBtn.addEventListener("click", () => {
    let seconds = 15;
    document.getElementById("loading-spinner").style.display = "block";
    const countdown = document.getElementById("countdown");
    countdown.textContent = "Attendere 15 secondi...";

    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval);
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("discount-panel").style.display = "block";
        document.getElementById("calculator-icon").style.display = "block";
        document.getElementById("discount-message").textContent = "Sono presenti sconti clicca qui";
        document.getElementById("discount-message").style.display = "inline-block";

        const date = new Date();
        date.setDate(date.getDate() + 10);
        const scadenza = date.toLocaleDateString("it-IT");
        document.getElementById("discount-date").textContent = "Valido fino al: " + scadenza;
        document.getElementById("live-viewers").style.display = "flex";

        offerData.validUntil = scadenza;
        offerData.discount = true;
        applyDiscountToPdfCheckbox.checked = true;
      }
    }, 1000);
  });

  generatePdfBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  popupCancel.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  popupConfirm.addEventListener("click", () => {
    offerData.structureName = popupStructure.value;
    offerData.referentName = popupReferent.value;
    offerData.salesName = popupSales.value;
    popupOverlay.style.display = "none";

    const filename = `Preventivo_${offerData.structureName.replace(/\s+/g, "_")}.pdf`;
    const blob = new Blob([JSON.stringify(offerData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  });
});
