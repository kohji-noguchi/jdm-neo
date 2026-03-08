document.addEventListener("DOMContentLoaded", async function () {

  const heroContainer = document.querySelector('.hero');
  const slides = [];
  let currentSlide = 0;
  const intervalTime = 3000;
  let slideInterval;

  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwKLuhCuIR-9IjRqprczReCEIEBE-7EMf6FXB-B7Fk9nF_b6sya8p5U_0O95d5QZzs/exec";

  try {
    const res = await fetch("json/products.json");
    const data = await res.json();

    let purchasedIds = [];
    try {
      const sheetRes = await fetch(SHEETS_URL);
      const sheetData = await sheetRes.json();
      purchasedIds = sheetData.filter(p => p.purchased == 1).map(p => p.id);
    } catch (err) {
      console.error("Sheets GET error:", err);
    }

    data.forEach((item, index) => {
      if (purchasedIds.includes(item.id)) return;

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

      slide.appendChild(info);
      heroContainer.appendChild(slide);
      slides.push(slide);
    });

    // COMING SOON
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

  } catch (err) {
    console.error("MAIN JS ERROR:", err);
  }

  // 日本時間
  function updateJapanTime() {
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const time = document.getElementById("japan-time");
    if (time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();
});