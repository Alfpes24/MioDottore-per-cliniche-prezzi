document.addEventListener("DOMContentLoaded", () => {
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const popup = document.getElementById("pdf-popup");
  const confirmBtn = document.getElementById("popup-confirm-btn");
  const cancelBtn = document.getElementById("popup-cancel-btn");

  const structureField = document.getElementById("popup-structure-name");
  const referentField = document.getElementById("popup-referent-name");
  const salesField = document.getElementById("popup-sales-name");

  const promoPanel = document.getElementById("discount-panel");
  const promoMonthlyPrice = document.getElementById("promo-monthly-price");
  const promoSetupFee = document.getElementById("promo-setup-fee");
  const defaultMonthlyPrice = document.getElementById("default-monthly-price").textContent;
  const setupFee = document.getElementById("setup-fee").textContent;

  generatePdfBtn.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  confirmBtn.addEventListener("click", async () => {
    const nomeStruttura = structureField.value.trim();
    const nomeReferente = referentField.value.trim();
    const nomeSale = salesField.value.trim();

    if (!nomeStruttura || !nomeReferente || !nomeSale) {
      alert("Compila tutti i campi prima di continuare.");
      return;
    }

    const existingPdfBytes = await fetch("https://alfpes24.github.io/MioDottore-per-cliniche-prezzi/template/Modello-preventivo-crm.pdf").then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField("Nome_Struttura").setText(nomeStruttura);
    form.getTextField("nome_referente").setText(nomeReferente);
    form.getTextField("nome_sale").setText(nomeSale);

    const scontiAttivi = promoPanel.style.display === "block";
    if (scontiAttivi) {
      form.getTextField("quota_scontata").setText(promoMonthlyPrice.textContent);
      form.getTextField("Quota_formazione_setup").setText(promoSetupFee.textContent);
    } else {
      form.getTextField("quota_scontata").setText(defaultMonthlyPrice);
      form.getTextField("Quota_formazione_setup").setText(setupFee);
    }

    form.flatten(); // blocca i campi, rendendoli non modificabili

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "preventivo-clinica.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    popup.style.display = "none";
  });
});
