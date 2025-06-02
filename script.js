let preventivoData = {};

window.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const pdfBtn = document.getElementById("pdf-btn");
  const popup = document.getElementById("popup-overlay");
  const confirmPopup = document.getElementById("confirm-popup");
  const cancelPopup = document.getElementById("cancel-popup");

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
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

    preventivoData = {
      defaultMonthly: defaultMonthlyPrice.toFixed(2) + " €",
      setupFee: setupFeeDisplayed.toFixed(2) + " €",
      total: (totalMonthlyPrice + setupFeeDefault).toFixed(2) + " €",
      ambulatori: rooms,
      capoluogo: cpl === 17 ? "Capoluogo" : "No Capoluogo",
      setupFeeDefault,
      setupFeeDisplayed,
      totalMonthlyPrice,
      monthlyPrice,
      noaTotalPrice,
      locationsCost,
      scontoAttivo: noa >= 1
    };

    document.getElementById("default-monthly-price").textContent = preventivoData.defaultMonthly;
    document.getElementById("setup-fee").textContent = preventivoData.setupFee;
    document.getElementById("results").style.display = "block";

    // Mostra pulsante "Check Sconti" solo se presente almeno una licenza NOA
    const checkBtn = document.getElementById("check-discount-btn");
    const procediBtn = document.getElementById("proceed-btn");
    const discountPanel = document.getElementById("discount-panel");
    const spinner = document.getElementById("loading-spinner");
    const countdown = document.getElementById("countdown");

    if (preventivoData.scontoAttivo) {
      checkBtn.style.display = "inline-block";
    } else {
      checkBtn.style.display = "none";
    }

    checkBtn.addEventListener("click", () => {
      let counter = 5;
      spinner.style.display = "flex";
      checkBtn.style.display = "none";

      const interval = setInterval(() => {
        countdown.textContent = counter + " secondi...";
        counter--;

        if (counter < 0) {
          clearInterval(interval);
          spinner.style.display = "none";
          discountPanel.style.display = "block";
          procediBtn.style.display = "inline-block";

          // Riempie i valori nel pannello sconti
          document.getElementById("original-monthly-price").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
          document.getElementById("promo-monthly-price").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
          document.getElementById("original-setup-fee").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
          document.getElementById("promo-setup-fee").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
        }
      }, 1000);
    });

  
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});

  pdfBtn.addEventListener("click", () => {
    popup.style.display = "flex";
  
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});

  cancelPopup.addEventListener("click", () => {
    popup.style.display = "none";
  
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});

  confirmPopup.addEventListener("click", async () => {
    const struttura = document.getElementById("clinic-name").value;
    const indirizzo = document.getElementById("clinic-address").value;
    const referente = document.getElementById("contact-name").value;
    const venditore = document.getElementById("salesperson-name").value;

    popup.style.display = "none";
    await generaPDF({ struttura, indirizzo, referente, venditore 
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});
  
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});

  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});

async function generaPDF(datiPopup) {
  const formUrl = "https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf";
  const formBytes = await fetch(formUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(formBytes);
  const form = pdfDoc.getForm();

  const today = new Date();
  const scadenza = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
  const formatDate = (d) => d.toLocaleDateString("it-IT");

  let riepilogoSconto = "";
  if (preventivoData.scontoAttivo) {
    riepilogoSconto =
      `Prezzo Originale CRM: ${(preventivoData.monthlyPrice * 1.25).toFixed(2)} €\n` +
      `Prezzo CRM Scontato: ${preventivoData.monthlyPrice.toFixed(2)} €\n` +
      `Setup Originale: ${preventivoData.setupFeeDisplayed.toFixed(2)} €\n` +
      `Setup Scontato: ${preventivoData.setupFeeDefault.toFixed(2)} €\n` +
      `Visibilità inclusa\n` +
      `Licenze NOA: ${preventivoData.noaTotalPrice.toFixed(2)} €\n` +
      `Totale Mensile Scontato: ${preventivoData.totalMonthlyPrice.toFixed(2)} €\n` +
      `Totale Complessivo: ${(preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2)} €`;
  }

  form.getTextField("nome_struttura").setText(datiPopup.struttura);
  form.getTextField("Nome_struttura1").setText(datiPopup.struttura);
  form.getTextField("Nome_referente").setText(datiPopup.referente);
  form.getTextField("Nome_sale").setText(datiPopup.venditore);
  form.getTextField("Nome_sale1").setText(datiPopup.venditore);
  form.getTextField("numero_ambulatori").setText(preventivoData.ambulatori.toString());
  form.getTextField("Cpl").setText(preventivoData.capoluogo);
  form.getTextField("Data_offerta").setText(formatDate(today));
  form.getTextField("Scadenza_offerta").setText(formatDate(scadenza));
  form.getTextField("Quota_mensile_default").setText(preventivoData.defaultMonthly);
  form.getTextField("Quota_mensile_default_2").setText(preventivoData.defaultMonthly);
  form.getTextField("Quota_mensile_scontata").setText(preventivoData.totalMonthlyPrice.toFixed(2) + " €");

  if (preventivoData.scontoAttivo) {
    form.getTextField("Quota_scontata").setText(riepilogoSconto);
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" 
  const checkBtn = document.getElementById("check-discount-btn");

  checkBtn.addEventListener("click", () => {
    if (!preventivoData || !preventivoData.scontoAttivo) {
      alert("Nessuno sconto applicabile. Inserisci almeno una licenza NOA.");
      return;
    }

    document.getElementById("crm-original").textContent = (preventivoData.monthlyPrice * 1.25).toFixed(2) + " €";
    document.getElementById("crm-discounted").textContent = preventivoData.monthlyPrice.toFixed(2) + " €";
    document.getElementById("setup-original").textContent = preventivoData.setupFeeDisplayed.toFixed(2) + " €";
    document.getElementById("setup-discounted").textContent = preventivoData.setupFeeDefault.toFixed(2) + " €";
    document.getElementById("noa-total").textContent = preventivoData.noaTotalPrice.toFixed(2) + " €";
    document.getElementById("monthly-total").textContent = preventivoData.totalMonthlyPrice.toFixed(2) + " €";
    document.getElementById("full-total").textContent = (preventivoData.totalMonthlyPrice + preventivoData.setupFeeDefault).toFixed(2) + " €";

    document.getElementById("discount-panel").style.display = "block";
  });

});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Preventivo_MioDottore_${datiPopup.struttura.replace(/\s+/g, "_")}_${formatDate(today)}.pdf`;
  link.click();
}
