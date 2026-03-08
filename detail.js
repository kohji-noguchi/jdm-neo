document.addEventListener("DOMContentLoaded", function() {

  // ===== JAPAN TIME =====
  function updateJapanTime() {
    const now = new Date();
    const japan = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const time = document.getElementById("japan-time");
    if (time) time.innerText = japan.toLocaleTimeString();
  }
  setInterval(updateJapanTime, 1000);
  updateJapanTime();

  // ===== HERO IMAGE FIXED (手動指定) =====
  // HTMLで指定した src をそのまま使用
  const heroImg = document.getElementById("detail-hero-img");
  // heroImg.src は HTML に書いた "../img/detail/package1-0.webp" のまま使用

  // ===== ADDITIONAL IMAGES =====
  // サムネ下の画像を縦に積む
  const additionalImages = document.getElementById("additional-images");
  if (additionalImages) {
    const imageUrls = [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=3",
      "https://picsum.photos/400/300?random=4"
    ];

    // 一旦空にする
    additionalImages.innerHTML = "";

    imageUrls.forEach(function(url, index) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Image ${index + 1}`;
      img.style.display = "block";      // 縦に積む
      img.style.marginBottom = "10px";  // 下に少しスペース
      additionalImages.appendChild(img);
    });
  }

  // ===== PAYPAL BUTTONS (仮) =====
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