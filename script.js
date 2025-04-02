document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const resultsBox = document.getElementById("results");
  const discountMessage = document.getElementById("discount-message");
  const discountPanel = document.getElementById("discount-panel");
  const discountDate = document.getElementById("discount-date");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");

  resultsBox.classList.add("hidden");
  discountPanel.classList.add("hidden");
  calculatorIcon.classList.add("hidden");
  ctrPanel.classList.add("hidden");

  discountMessage.addEventListener("click", () => {
    discountPanel.classList.remove("hidden");
    calculatorIcon.classList.remove("hidden");
  });

  calculatorIcon.addEventListener("click", () => {
    ctrPanel.classList.toggle("hidden");
  });

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price").value) || 0;

    const setupFeeTable = [99, 129, 129, 159, 159, 199, 199, 299, 299, 499, 599];
    const pricePerRoomTable = [270, 180, 160, 130, 110, 105, 95, 90, 85, 75, 70];

    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);
    const setupFee = setupFeeTable[index];
    const monthlyPricePerRoom = pricePerRoomTable[index];
    const monthlyPrice = monthlyPricePerRoom * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPrice = totalMonthlyPrice * 1.25;

    const commissionBase = monthlyPrice;
    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const commissionLocations = locationsCost;
    const commissionNoa = noa * noaPrice;
    const totalCommission = commissionBase + commissionCpl + commissionLocations + (setupFee / 12) + commissionNoa;

    document.getElementById("default-monthly-price").textContent = `${defaultMonthlyPrice.toFixed(2)} €`;
    document.getElementById("setup-fee").textContent = `${setupFee.toFixed(2)} €`;
    document.getElementById("monthly-price").textContent = `${totalMonthlyPrice.toFixed(2)} €`;
    document.getElementById("sales-commissions").textContent = `${totalCommission.toFixed(2)} €`;

    const oggi = new Date();
    oggi.setDate(oggi.getDate() + 10);
    const giorno = String(oggi.getDate()).padStart(2, '0');
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const anno = oggi.getFullYear();
    discountDate.textContent = `Valido fino al: ${giorno}/${mese}/${anno}`;

    const messaggiSconto = [
      "Sono presenti sconti",
      "Offerta attiva",
      "Approfitta dello sconto ora",
      "Promo disponibile",
      "Sconto limitato"
    ];
    const messaggio = messaggiSconto[Math.floor(Math.random() * messaggiSconto.length)];
    discountMessage.textContent = messaggio;

    resultsBox.classList.remove("hidden");
    discountMessage.classList.remove("hidden");
    discountPanel.classList.add("hidden");
    calculatorIcon.classList.add("hidden");
    ctrPanel.classList.add("hidden");
  });
});
