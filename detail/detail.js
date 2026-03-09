// detail.js
document.addEventListener("DOMContentLoaded", function() {

  const detailTitle = document.getElementById("detail-title");
  const detailPriceTop = document.getElementById("detail-price-top");
  const detailPriceBottom = document.getElementById("detail-price-bottom");
  const heroImg = document.getElementById("detail-hero-img");
  const additionalImages = document.getElementById("additional-images");

  // URL パラメータで id を取得
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1;

  // ===== 日本時間 =====
  function updateJapanTime(){
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Tokyo"}));
    const time = document.getElementById("japan-time");
    if(time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();

  // ===== JSON 読み込み =====
  fetch('../json/products.json')
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id == id);
      if(!product) return;

      // タイトル
      detailTitle.textContent = product.title;

      // 上下価格
      detailPriceTop.textContent = `$ ${product.price}`;
      detailPriceBottom.textContent = `$ ${product.price}`;

      // HERO 画像
      heroImg.src = product.hero;
      heroImg.alt = product.title;

      // 下段追加画像
      additionalImages.innerHTML = "";
      if(product.detailImages && product.detailImages.length){
        product.detailImages.forEach(imgUrl => {
          const img = document.createElement("img");
          img.src = imgUrl;
          additionalImages.appendChild(img);
        });
      }

      // ===== PayPal Buttons 上下 =====
      if(window.paypal){
        ["paypal-button-container-top","paypal-button-container-bottom"].forEach(id=>{
          paypal.Buttons({
            createOrder: (data, actions) => actions.order.create({
              purchase_units: [{ amount: { value: product.price } }]
            }),
            onApprove: (data, actions) => actions.order.capture()
              .then(details => alert('Transaction completed by ' + details.payer.name.given_name))
          }).render("#"+id);
        });
      }

    }).catch(err => console.error("JSON ERROR:", err));

});