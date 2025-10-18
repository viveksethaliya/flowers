let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const cartCountElement = document.getElementById('cartCount');
  const floatingCartCount = document.querySelector('.floating-cart .cart-count');
  const itemCount = cart.length;
  
  if (cartCountElement) {
    cartCountElement.textContent = itemCount;
    cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
  }
  
  if (floatingCartCount) {
    floatingCartCount.textContent = itemCount;
    floatingCartCount.style.display = itemCount > 0 ? 'flex' : 'none';
  }
}

function renderCart() {
  const cartList = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  
  if (cartList) {
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, i) => {
      total += item.price;
      const li = document.createElement('li');
      li.textContent = `${item.name} - ₹${item.price}`;
      cartList.appendChild(li);
    });

    if (totalEl) {
      totalEl.textContent = total;
    }
  }
}

function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const message = cart.map(i => `${i.name} - ₹${i.price}`).join('%0A');
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const whatsappMsg = `Hello Fleur Vine,%0AI'd like to order:%0A${message}%0A%0ATotal: ₹${total}`;
  const phone = '919999999999'; // ← Replace with your business WhatsApp number
  window.open(`https://wa.me/${phone}?text=${whatsappMsg}`, '_blank');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function clearCart() {
  cart = [];
  updateCartCount();
  renderCart();
}

function toggleCart() {
  const cartSidebar = document.querySelector('.cart-sidebar');
  if (cartSidebar) {
    cartSidebar.classList.toggle('open');
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});