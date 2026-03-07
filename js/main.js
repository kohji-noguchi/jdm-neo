// ======================= main.js (修正版) =======================
document.addEventListener("DOMContentLoaded", function(){
  const heroContainer = document.querySelector('.hero');
  const slides = [];
  let currentSlide = 0;
  const intervalTime = 3000;
  let slideInterval;

  // ================= JSONロード =================
  fetch('json/products.json')  // 相対パス
    .then(res => res.json())
    .then(data => {

      // ===== HEROスライダー =====
      data.forEach(item => {
        if(item.status === "stock"){
          const slide = document.createElement("div");
          slide.className = "slide";
          slide.id = `hero-slide-${item.id}`;

          const img = document.createElement("img");
          img.src = item.hero;          // JSON側で相対パス img/index/heroX.webp に
          img.alt = "";                 // ← altを空にして「Image」表示を消す
          slide.appendChild(img);

          const info = document.createElement("div");
          info.className = "product-info";

          const p = document.createElement("p");
          p.className = "package";
          p.textContent = `Package #${item.packageNumber}`;
          info.appendChild(p);

          const price = document.createElement("span");
          price.className = "price";
          price.textContent = `$ ${item.price}`;
          info.appendChild(price);

          // 商品クリックで detail.html に遷移
          info.addEventListener("click", () => {
            window.location.href = `detail/detail.html?id=${item.id}`;
          });

          slide.appendChild(info);

          const tri = document.createElement("div");
          tri.className = "triangle";
          const span = document.createElement("span");
          span.textContent = "STOCK";
          tri.appendChild(span);
          slide.appendChild(tri);

          heroContainer.appendChild(slide);
          slides.push(slide);
        }
      });

      // COMING SOON スライド
      const comingSlide = document.createElement("div");
      comingSlide.className = "slide coming";
      const btn = document.createElement("div");
      btn.className = "coming-soon-btn";
      btn.textContent = "COMING SOON";
      comingSlide.appendChild(btn);
      heroContainer.appendChild(comingSlide);
      slides.push(comingSlide);

      // 初期表示
      slides[0].classList.add("active");
      slideInterval = setInterval(nextSlide, intervalTime);

      // クリックでスライド切り替え
      heroContainer.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, intervalTime);
      });

      // スワイプ対応
      let startX = 0;
      heroContainer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
      heroContainer.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if(Math.abs(endX - startX) > 50){
          clearInterval(slideInterval);
          slides[currentSlide].classList.remove("active");
          if(endX < startX) currentSlide = (currentSlide + 1) % slides.length;
          else currentSlide = (currentSlide - 1 + slides.length) % slides.length;
          slides[currentSlide].classList.add("active");
          slideInterval = setInterval(nextSlide, intervalTime);
        }
      });

      function nextSlide(){
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
      }

      // ===== カード生成 =====
      const cardSlider = document.querySelector(".card-slider");
      if(cardSlider){
        data.forEach(item => {
          const card = document.createElement("div");
          card.className = "card";

          const a = document.createElement("a");
          a.href = `detail/detail.html?id=${item.id}`;

          const img = document.createElement("img");
          img.src = item.images[0]?.src || "img/placeholder.webp"; // 相対パス
          img.alt = ""; // ← altを空にして「Image」表示を消す
          a.appendChild(img);

          const h3 = document.createElement("h3");
          h3.textContent = item.title;
          a.appendChild(h3);

          const p = document.createElement("p");
          p.textContent = `$ ${item.price}`;
          a.appendChild(p);

          card.appendChild(a);
          cardSlider.appendChild(card);
        });
      }

    });

  // ================= 日本時間 =================
  function updateJapanTime(){
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    document.getElementById("japan-time").innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();

});