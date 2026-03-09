document.addEventListener("DOMContentLoaded", function() {

  const heroContainer = document.querySelector('.hero');
  const cardSlider = document.querySelector('.card-slider');
  const slides = [];
  let currentSlide = 0;
  const intervalTime = 5000;
  let slideInterval;

  // ===== JAPAN TIME =====
  function updateJapanTime(){
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Tokyo"}));
    const time = document.getElementById("japan-time");
    if(time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();

  // ===== FETCH JSON =====
  fetch('json/products.json')
    .then(res => res.json())
    .then(data => {
      if(!data || !data.length) return;

      // ===== HERO SLIDER =====
      const heroData = data.slice(0,3);
      // ダミー「COMING SOON」を改行入りに変更
      heroData.push({ hero: "dummy", title: "FIRST COME FIRST SERVED\nLIMITED DROP" });

      heroData.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if(index === 0) slide.classList.add('active');

        if(item.hero === "dummy"){
          // CSSに任せてテキストだけHTMLで改行を入れる
          const dummyDiv = document.createElement('div');
          dummyDiv.className = 'dummy-slide';
          const dummyText = document.createElement('div');
          dummyText.className = 'dummy-text';
          // 改行反映
          dummyText.innerHTML = item.title.replace(/\n/g, "<br>");
          dummyDiv.appendChild(dummyText);
          slide.appendChild(dummyDiv);
        } else {
          const img = document.createElement('img');
          img.src = item.hero;
          img.alt = item.title;
          slide.appendChild(img);

          const info = document.createElement('a');
          info.className = 'product-info';
          info.href = item.link;

          const pTitle = document.createElement('p');
          pTitle.className = 'package';
          pTitle.textContent = item.title;
          info.appendChild(pTitle);

          const price = document.createElement('span');
          price.className = 'price';
          price.textContent = `$ ${item.price}`;
          info.appendChild(price);

          const buyBtn = document.createElement('button');
          buyBtn.className = 'buy-now';
          buyBtn.textContent = 'BUY NOW';
          info.appendChild(buyBtn);

          slide.appendChild(info);
        }

        heroContainer.appendChild(slide);
        slides.push(slide);
      });

      // ===== HERO SLIDE FUNCTION =====
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
        if(Math.abs(endX - startX) > 50){
          clearInterval(slideInterval);
          slides[currentSlide].classList.remove('active');
          currentSlide = (endX < startX)
            ? (currentSlide + 1) % slides.length
            : (currentSlide - 1 + slides.length) % slides.length;
          slides[currentSlide].classList.add('active');
          slideInterval = setInterval(nextSlide, intervalTime);
        }
      });

      // ===== CARD SLIDER =====
      if(cardSlider){
        data.forEach(item => {
          const card = document.createElement('div');
          card.className = 'card';

          const a = document.createElement('a');
          a.href = item.link;

          const img = document.createElement('img');
          img.src = item.thumbnail;
          img.className = "card-thumbnail";
          a.appendChild(img);

          const h3 = document.createElement('h3');
          h3.textContent = item.title;
          a.appendChild(h3);

          const sold = document.createElement('p');
          sold.textContent = `✅ Sold: ${item.soldDate}`;
          a.appendChild(sold);

          const listed = document.createElement('p');
          listed.textContent = `🏷️ Listed: ${item.listedDate}`;
          a.appendChild(listed);

          const shipped = document.createElement('p');
          shipped.innerHTML = `✈️ Shipped to <img class="flag-icon" src="https://flagcdn.com/24x18/${item.flag.toLowerCase()}.png">${item.shippedTo}`;
          a.appendChild(shipped);

          card.appendChild(a);
          cardSlider.appendChild(card);
        });
      }

    }).catch(err => console.error("JSON ERROR:", err));

});