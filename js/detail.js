document.addEventListener("DOMContentLoaded", function () {

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"),10) || 1;

fetch("json/products.json")

.then(res => res.json())

.then(products => {

const product = products.find(p => p.id === id);

if(!product) return;


document.getElementById("detail-title").textContent = product.title;

document.getElementById("detail-price").textContent = "$ " + product.price;

document.getElementById("detail-price-bottom").textContent = "$ " + product.price;


document.getElementById("detail-hero-img").src = product.hero;

document.getElementById("hero-caption").textContent = product.title;


const gallery = document.getElementById("additional-images");

gallery.innerHTML = "";

if(product.images){

product.images.forEach(img=>{

const image = document.createElement("img");

image.src = img;

image.className = "detail-shot";

gallery.appendChild(image);

});

}


function renderPaypal(container){

paypal.Buttons({

style:{
layout:'vertical',
label:'paypal'
},

createOrder:function(data,actions){

return actions.order.create({

purchase_units:[{

description:product.title,

amount:{
value:product.price.toString()
}

}]

});

},

onApprove:function(data,actions){

return actions.order.capture().then(function(details){

alert("Transaction completed by " + details.payer.name.given_name);

});

}

}).render(container);

}


renderPaypal("#paypal-button-container-top");
renderPaypal("#paypal-button-container-bottom");

})

.catch(err=>console.error("JSON load error:",err));

});