// detail.js
document.addEventListener("DOMContentLoaded", function() {

  // ===== 日本時間 =====
  function updateJapanTime(){
    const time = document.getElementById("japan-time");
    if(time){
      const now = new Date();
      const japan = new Date(now.toLocaleString("en-US",{timeZone:"Asia/Tokyo"}));
      time.textContent = japan.toLocaleTimeString();
    }
  }

  // 初回表示
  updateJapanTime();

  // 1秒ごとに更新
  setInterval(updateJapanTime, 1000);

  // ===== 以下に他の処理を追加可能 =====
  // 例: JSON読み込みやPayPalボタン描画など
});