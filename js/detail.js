document.addEventListener("DOMContentLoaded", function(){

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // detail_001.html?id=1 のように渡す

  fetch("../json/products.json")
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id == id);
      if(!product) return;

      // タイトル
      const title = document.getElementById("detail-title");
      if(title) title.textContent = product.title;

      // 価格
      const priceTop = document.getElementById("detail-price-top");
      const priceBottom = document.getElementById("detail-price-bottom");
      if(priceTop) priceTop.textContent = `$${product.price}`;
      if(priceBottom) priceBottom.textContent = `$${product.price}`;

      // トップサムネ画像（hero）
      const heroImg = document.getElementById("detail-hero-img");
      if(heroImg) heroImg.src = product.hero || product.detailURL;

      // 追加画像
      const additional = document.getElementById("additional-images");
      if(additional){
        additional.innerHTML = "";
        product.images.forEach(url=>{
          const img = document.createElement("img");
          img.src = url;
          img.alt = product.title;
          additional.appendChild(img);
        });
      }
    })
    .catch(err => console.error("JSON ERROR:", err));

  // 日本時間
  function updateJapanTime(){
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Tokyo"}));
    const time = document.getElementById("japan-time");
    if(time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();
});