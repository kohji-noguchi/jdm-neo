// ================= JAPAN TIME =================
function updateJapanTime() {
  const now = new Date();
  const japan = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Tokyo"}));
  const timeEl = document.getElementById("japan-time");
  if(timeEl) timeEl.innerText = japan.toLocaleTimeString();
}
setInterval(updateJapanTime,1000);
updateJapanTime();

// ================= HERO SLIDER =================
const slidesContainer = document.querySelector('.hero');
let slides = [], index = 0, slideInterval = null;

function createSlides(data){
  slidesContainer.innerHTML = "";
  slides = [];

  data.forEach(item=>{
    if(item.status === "stock" && !localStorage.getItem(`purchased_${item.id}`)){
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.id = `hero-slide-${item.id}`;

      const img = document.createElement("img");
      img.src = item.hero;
      img.alt = item.heroCaption;
      slide.appendChild(img);

      const info = document.createElement("div");
      info.className = "product-info";

      const p = document.createElement("p");
      p.className = "package";
      p.textContent = `Package #${item.id}`;
      info.appendChild(p);

      const priceBtn = document.createElement("span");
      priceBtn.className = "price";
      priceBtn.textContent = `$ ${item.price}`;
      info.appendChild(priceBtn);

      info.addEventListener("click",()=>window.location.href=`detail/detail.html?id=${item.id}`);
      slide.appendChild(info);

      const tri = document.createElement("div");
      tri.className = "triangle";
      const span = document.createElement("span");
      span.textContent = "STOCK";
      tri.appendChild(span);
      slide.appendChild(tri);

      slidesContainer.appendChild(slide);
      slides.push(slide);
    }
  });

  appendComingSoonSlide();
  showSlide(0);
  startAutoSlide();
  addSwipeSupport();
}

function appendComingSoonSlide(){
  const slide = document.createElement("div");
  slide.className = "slide coming";
  const tri = document.createElement("div");
  tri.className = "triangle coming";
  const span = document.createElement("span");
  span.textContent = "COMING";
  tri.appendChild(span);
  slide.appendChild(tri);
  const button = document.createElement("div");
  button.className = "coming-soon-btn";
  button.textContent = "COMING SOON";
  slide.appendChild(button);
  slidesContainer.appendChild(slide);
  slides.push(slide);
}

function showSlide(n){
  slides.forEach(s=>s.classList.remove("active"));
  slides[n].classList.add("active");
  index = n;
}

function startAutoSlide(){
  if(slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(()=>showSlide((index+1)%slides.length),3000);
}

function addSwipeSupport(){
  let startX = 0;
  slidesContainer.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; });
  slidesContainer.addEventListener('touchend',e=>{
    const endX = e.changedTouches[0].clientX;
    if(Math.abs(endX-startX)>50){
      showSlide(endX<startX?(index+1)%slides.length:(index-1+slides.length)%slides.length);
    }
  });
}

// ================= INIT =================
fetch('json/products.json')
  .then(res=>res.json())
  .then(data=>createSlides(data));