document.addEventListener("DOMContentLoaded", async function () {

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 1;

  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwKLuhCuIR-9IjRqprczReCEIEBE-7EMf6FXB-B7Fk9nF_b6sya8p5U_0O95d5QZzs/exec";

  try {
    const [productsRes, sheetsRes] = await Promise.all([
      fetch("json/products.json"),
      fetch(SHEETS_URL)
    ]);

    const products = await productsRes.json();
    const purchasedData = await sheetsRes.json();

    const purchasedIds = purchasedData.filter(p => p.purchased == 1).map(p => p.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const isPurchased = purchasedIds.includes(product.id);

    document.getElementById("detail-title").textContent = product.title;
    document.getElementById("detail-price").textContent = `$ ${product.price}`;
    document.getElementById("detail-price-bottom").textContent = `$ ${product.price}`;
    document.getElementById("detail-hero-img").src = product.hero;
    document.getElementById("hero-caption").textContent = product.title;

    const gallery = document.getElementById("additional-images");
    gallery.innerHTML = "";
    if (product.images) {
      product.images.forEach(img => {
        const image = document.createElement("img");
        image.src = img;
        image.className = "detail-shot";
        gallery.appendChild(image);
      });
    }

    function renderPaypal(container) {
      const el = document.querySelector(container);
      el.innerHTML = "";

      if (isPurchased) {
        el.style.display = "none";
        return;
      }

      paypal.Buttons({
        style: { layout: 'vertical', label: 'paypal' },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              description: product.title,
              amount: { value: product.price.toString() }
            }]
          });
        },
        onApprove: async function (data, actions) {
          return actions.order.capture().then(async function () {
            alert("Transaction completed");

            await fetch(SHEETS_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: product.id })
            });

            el.style.display = "none";
          });
        }
      }).render(container);
    }

    renderPaypal("#paypal-button-container-top");
    renderPaypal("#paypal-button-container-bottom");

  } catch (err) {
    console.error("DETAIL JS ERROR:", err);
  }

});