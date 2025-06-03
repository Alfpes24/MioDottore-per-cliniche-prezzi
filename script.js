document.addEventListener("DOMContentLoaded", () => {
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const popupOverlay = document.getElementById("pdf-popup");
  const popupStructureInput = document.getElementById("popup-structure-name");
  const popupReferentInput = document.getElementById("popup-referent-name");
  const popupSalesInput = document.getElementById("popup-sales-name");
  const popupConfirmBtn = document.getElementById("popup-confirm-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  // Mostra popup su click "Genera PDF"
  generatePdfBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.style.display = "flex";
  });

  // Annulla popup
  popupCancelBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Conferma popup → genera PDF
  popupConfirmBtn.addEventListener("click", async () => {
    const struttura = popupStructureInput.value.trim();
    const referente = popupReferentInput.value.trim();
    const commerciale = popupSalesInput.value.trim();

    if (!struttura || !referente || !commerciale) {
      alert("Compila tutti i campi prima di continuare.");
      return;
    }

    const d = window.calculatedOfferData || {};
    d.preparedFor = struttura;
    d.preparedBy = referente;
    d.nomeSale = commerciale;
    d.offerDate = new Date().toLocaleDateString("it-IT");
    d.validUntilDate = d.validUntilDate || new Date(Date.now() + 10 * 86400000).toLocaleDateString("it-IT");
    d.pdfTemplateUrl = "Modello-preventivo-crm.pdf";

    try {
      const existingPdfBytes = await fetch(d.pdfTemplateUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      form.getTextField("nome_struttura").setText(d.preparedFor);
      form.getTextField("Nome_referente").setText(d.preparedBy);
      form.getTextField("Nome_sale").setText(d.nomeSale);
      form.getTextField("Data_offerta").setText(d.offerDate);
      form.getTextField("Nome_struttura1").setText(d.preparedFor);
      form.getTextField("Nome_sale1").setText(d.nomeSale);
      form.getTextField("Scadenza_offerta").setText(d.validUntilDate);

      form.getTextField("Quota_mensile_default").setText(`${d.defaultMonthlyPrice || "0"} €`);
      form.getTextField("Quota_mensile_scontata").setText(`${d.promoMonthlyPrice || "0"} €`);
      form.getTextField("Quota_formazione_setup").setText(
        d.hasDiscountApplied ? `${d.setupFeeOnetime} € (scontato)` : `${d.setupFeeDisplayed} €`
      );

      if (d.hasDiscountApplied) {
        const quotaScontata = 
          `Prezzo Originale: ~~${d.defaultMonthlyPrice} €~~\n` +
          `Setup Fee: ~~${d.setupFeeDisplayed} €~~\n\n` +
          `Prezzo Scontato: ${d.promoMonthlyPrice} €\n` +
          `Setup Scontato: ${d.setupFeeOnetime} €`;
        form.getTextField("Quota_scontata").setText(quotaScontata);
      } else {
        form.getTextField("Quota_scontata").setText("");
      }

      form.flatten();

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fileName = `Preventivo_MioDottore_${d.preparedFor.replace(/\\s+/g, "_")}_${d.offerDate.replace(/\\//g, "-")}.pdf`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      popupOverlay.style.display = "none";
    } catch (e) {
      console.error("Errore nella generazione del PDF:", e);
      alert("Errore nella generazione del PDF. Controlla la console.");
    }
  });
});
