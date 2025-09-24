// 

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    // FIX 1: Selecting the element by its class name '.nav-links'
    const navLinks = document.querySelector('.nav-links');

    // This makes the hamburger menu toggle the 'active' class
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // This makes the menu close when a link inside it is clicked
    if (navLinks) {
        navLinks.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Initialize the page
    renderProducts();
    updateCartCount();
});

// Products data
const products = [
    { id: 1, name: "Premium Red Roses", price: 120, image: "1.jpg", description: "Fresh red roses perfect for special occasions", events: ["wedding", "gift"] },
    { id: 2, name: "Bright Sunflowers", price: 80, image: "3.jpg", description: "Bright yellow sunflowers to light up any event", events: ["decoration", "festival"] },
    { id: 3, name: "Mixed Tulips", price: 150, image: "2.jpg", description: "Colorful tulips in various beautiful shades", events: ["gift", "wedding"] },
    { id: 4, name: "White Lilies", price: 100, image: "wl.jpg", description: "Elegant white lilies for sophisticated events", events: ["wedding", "decoration"] },
    { id: 5, name: "Pink Carnations", price: 90, image: "pc.jpg", description: "Delicate pink carnations for gentle occasions", events: ["gift", "wedding"] },
    { id: 6, name: "Purple Orchids", price: 200, image: "po.jpg", description: "Exotic purple orchids for luxury events", events: ["decoration", "wedding"] },
    { id: 7, name: "Yellow Marigolds", price: 60, image: "ym.jpg", description: "Traditional yellow marigolds for festivals", events: ["festival", "decoration"] },
    { id: 8, name: "Orange Gerberas", price: 110, image: "og.jpg", description: "Vibrant orange gerberas for cheerful occasions", events: ["decoration", "gift"] },
    { id: 9, name: "Blue Hydrangeas", price: 180, image: "bh.jpg", description: "Beautiful blue hydrangeas for elegant decor", events: ["decoration", "wedding"] },
    { id: 10, name: "Mixed Bouquet", price: 250, image: "mb.jpg", description: "Assorted flowers in a beautiful arrangement", events: ["wedding", "gift", "decoration"] }
];

let cart = [];
const whatsappNumber = "917818995275"; // Replace with your WhatsApp number

// Show/Hide pages
function showHomePage() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('orderPage').classList.add('hidden');
}

function showOrderPage() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('orderPage').classList.remove('hidden');
}

let filteredProducts = [...products];

// Render products
function renderProducts(productsToRender = filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price}/dozen</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn btn-success" onclick="orderNow(${product.id})">Order Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products by event
function filterProducts() {
    const eventFilter = document.getElementById('eventFilter').value;
    filteredProducts = eventFilter === 'all' ? [...products] : products.filter(p => p.events.includes(eventFilter));
    sortProducts();
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;
    
    if (sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    
    renderProducts();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    updateCartDisplay();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('floatingCartCount').textContent = count;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = 'Total: ₹0';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}/dozen</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = `Total: ₹${total}`;
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
    updateCartDisplay();
}

// Order single product
function orderNow(productId) {
    const product = products.find(p => p.id === productId);
    const message = `Hi! I would like to order:\n\n${product.name}\nPrice: ₹${product.price}/dozen\nQuantity: 1 dozen\n\nPlease confirm availability and delivery details.`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Order from cart
function orderFromCart() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = "Hi! I would like to order the following items:\n\n";
    
    cart.forEach(item => {
        message += `${item.name}\n`;
        message += `Price: ₹${item.price}/dozen\n`;
        message += `Quantity: ${item.quantity} dozen\n`;
        message += `Subtotal: ₹${item.price * item.quantity}\n\n`;
    });
    
    message += `Total Amount: ₹${total}\n\nPlease confirm availability and delivery details.`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}