document.addEventListener("DOMContentLoaded", function() {

  const VERSION = "20260309";

  function updateJapanTime() {

    const now = new Date();

    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

    const time = document.getElementById("japan-time");

    if (time) time.innerText = japan.toLocaleTimeString();

  }

  setInterval(updateJapanTime, 1000);

  updateJapanTime();

  const heroImg = document.getElementById("detail-hero-img");

  if(heroImg){

    heroImg.src = heroImg.src + "?v=" + VERSION;

  }

  const additionalImages = document.getElementById("additional-images");

  if (additionalImages) {

    const imageUrls = [

      "https://picsum.photos/400/300?random=1",

      "https://picsum.photos/400/300?random=2",

      "https://picsum.photos/400/300?random=3",

      "https://picsum.photos/400/300?random=4"

    ];

    additionalImages.innerHTML = "";

    imageUrls.forEach(function(url, index) {

      const img = document.createElement("img");

      img.src = url + "&v=" + VERSION;

      img.alt = `Image ${index + 1}`;

      img.style.display = "block";

      img.style.marginBottom = "10px";

      additionalImages.appendChild(img);

    });

  }

  if (window.paypal) {

    ["paypal-button-container-top", "paypal-button-container-bottom"].forEach(function(id) {

      paypal.Buttons({

        createOrder: function(data, actions) {

          return actions.order.create({

            purchase_units: [{ amount: { value: "80" } }]

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