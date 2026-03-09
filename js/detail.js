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
  
  // detailページのID判定
  let id = null;
  const match = window.location.pathname.match(/detail_(\d+)\.html$/);
  if(match) id = parseInt(match[1]);

  // ===== FETCH JSON =====
  if(id !== null){
    fetch("../json/products.json")
      .then(res => res.json())
      .then(data => {
        if(!data || !data.length) return;
        const product = data.find(item => item.id === id);
        if(!product) return;

        // 価格反映
        const priceTop = document.getElementById("detail-price-top");
        const priceBottom = document.getElementById("detail-price-bottom");
        if(priceTop) priceTop.textContent = `$${product.price}`;
        if(priceBottom) priceBottom.textContent = `$${product.price}`;

        // HERO IMAGE 反映
        if(heroImg && product.hero && product.hero !== "dummy"){
          heroImg.src = product.hero + "?v=" + VERSION;
        }

        // ===== ADDITIONAL IMAGES =====
        const additionalImages = document.getElementById("additional-images");
        if(additionalImages && product.images && product.images.length){
          additionalImages.innerHTML = "";
          product.images.forEach((imgPath, index) => {
            const img = document.createElement("img");
            img.src = imgPath + "?v=" + VERSION;
            img.alt = `Image ${index + 1}`;
            img.style.display = "block";
            img.style.marginBottom = "10px";
            additionalImages.appendChild(img);
          });
        }

      })
      .catch(err => console.error("detail.js JSON ERROR:", err));
  } else {
    console.warn("detail.js: 商品IDが取得できませんでした。");
  }

  // ===== PayPal ボタン（価格固定） =====
  if (window.paypal) {
    ["paypal-button-container-top", "paypal-button-container-bottom"].forEach(function(id) {
      paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{ amount: { value: "80" } }] // ここは固定
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render("#" + id);
    });
  }

});