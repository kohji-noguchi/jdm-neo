document.addEventListener("DOMContentLoaded", function() {

  const VERSION = "20260309";

  // ===== JAPAN TIME =====
  function updateJapanTime() {
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const time = document.getElementById("japan-time");
    if (time) time.innerText = japan.toLocaleTimeString();
  }

  setInterval(updateJapanTime, 1000);
  updateJapanTime();

  // ===== HERO IMAGE =====
  const heroImg = document.getElementById("detail-hero-img");

  if(heroImg){
    heroImg.src = heroImg.src + "?v=" + VERSION;
  }

  // ===== PRICE FROM JSON =====
  const priceTop = document.getElementById("detail-price-top");
  const priceBottom = document.getElementById("detail-price-bottom");

  let id = null;

  const match = window.location.pathname.match(/detail_(\d+)\.html$/);

  if(match) id = parseInt(match[1]);

  if(id !== null){

    fetch("../json/products.json")

      .then(res => res.json())

      .then(data => {

        const product = data.find(item => item.id === id);

        if(!product) return;

        if(priceTop) priceTop.textContent = `$${product.price}`;
        if(priceBottom) priceBottom.textContent = `$${product.price}`;

      })

      .catch(err => console.error("JSON ERROR:", err));
  }

  // ===== PAYPAL HOSTED BUTTON =====

  if (window.paypal) {

    paypal.HostedButtons({
      hostedButtonId: "KVZPEPJWSAQ2Y"
    }).render("#paypal-button-container-top");

    paypal.HostedButtons({
      hostedButtonId: "KVZPEPJWSAQ2Y"
    }).render("#paypal-button-container-bottom");

  }

});