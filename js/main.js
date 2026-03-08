document.addEventListener("DOMContentLoaded", async function () {

  const heroContainer = document.querySelector('.hero');
  const slides = [];
  let currentSlide = 0;
  const intervalTime = 3000;
  let slideInterval;

  // =====================
  // Google Sheets WebApp URL
  // =====================
  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzhESrmL_SzKU4FtQsUr8WSMLYQv9waY--coBr2yHQzM2ixi14gXBy-bI8UC2iB3I0/exec";

  try {
    // 1. products.json と購入状態取得
    const [productsRes, sheetsRes] = await Promise.all([
      fetch('json/products.json'),
      fetch(SHEETS_URL)
    ]);

    const products = await productsRes.json();
    const sheetsData = await sheetsRes.json();

    // 購入済み ID 配列
    const purchasedIds = sheetsData.filter(p => p.purchased == 1).map(p => p.id);

    // =====================
    // HEROスライド生成
    // =====================
    products.forEach((item, index) => {
      if (purchasedIds.includes(item.id)) return; // 購入済みは非表示

      const slide = document.createElement('div');
      slide.className = 'slide';
      if (index === 0) slide.classList.add('active');
      slide.id = `hero-slide-${item.id}`;

      const img = document.createElement('img');
      img.src = item.hero || "img/hero/placeholder.webp";
      img.alt = item.title || "";
      slide.appendChild(img);

      const info = document.createElement('div');
      info.className = 'product-info';

      const p = document.createElement('p');
      p.className = 'package';
      p.textContent = item.title || "";
      info.appendChild(p);

      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = `$ ${item.price || 0}`;
      info.appendChild(price);

      info.addEventListener('click', () => {
        window.location.href = `detail.html?id=${item.id}`;
      });

      info.style.cursor = "pointer";
      slide.appendChild(info);

      heroContainer.appendChild(slide);
      slides.push(slide);
    });

    // COMING SOON スライド
    const comingSlide = document.createElement('div');
    comingSlide.className = 'slide coming';
    const btn = document.createElement('div');
    btn.className = 'coming-soon-btn';
    btn.textContent = 'COMING SOON';
    comingSlide.appendChild(btn);
    heroContainer.appendChild(comingSlide);
    slides.push(comingSlide);

    // スライド切替
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    slideInterval = setInterval(nextSlide, intervalTime);

    heroContainer.addEventListener('click', () => {
      clearInterval(slideInterval);
      nextSlide();
      slideInterval = setInterval(nextSlide, intervalTime);
    });

    // スワイプ対応
    let startX = 0;
    heroContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    heroContainer.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (Math.abs(endX - startX) > 50) {
        clearInterval(slideInterval);
        slides[currentSlide].classList.remove('active');
        currentSlide = (endX < startX)
          ? (currentSlide + 1) % slides.length
          : (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        slideInterval = setInterval(nextSlide, intervalTime);
      }
    });

    // =====================
    // CARD SLIDER
    // =====================
    const cardSlider = document.querySelector('.card-slider');
    if (cardSlider) {
      products.forEach(item => {
        if (purchasedIds.includes(item.id)) return; // 購入済みカード非表示も可

        const card = document.createElement('div');
        card.className = 'card';

        const a = document.createElement('a');
        a.href = `detail.html?id=${item.id}`;

        const img = document.createElement('img');
        img.src = (item.images && item.images[0]) ? item.images[0] : "img/detail/placeholder.webp";
        a.appendChild(img);

        const h3 = document.createElement('h3');
        h3.textContent = item.title || "";
        a.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = `$ ${item.price || 0}`;
        a.appendChild(p);

        card.appendChild(a);
        cardSlider.appendChild(card);
      });
    }

  } catch (err) {
    console.error("MAIN JS ERROR:", err);
  }

  // =====================
  // 日本時間表示
  // =====================
  function updateJapanTime() {
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const time = document.getElementById("japan-time");
    if (time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();

});