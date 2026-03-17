// ATTENDRE QUE LE DOM SOIT CHARGÉ
document.addEventListener('DOMContentLoaded', () => {

    displayProducts();

    // FILTRES (sécurisés)
    const category = document.getElementById('categoryFilter');
    const price = document.getElementById('priceFilter');
    const sort = document.getElementById('sortFilter');
    const search = document.getElementById('searchInput');

    if (category) category.addEventListener('change', filterProducts);
    if (price) price.addEventListener('change', filterProducts);
    if (sort) sort.addEventListener('change', filterProducts);

    if (search) {
        search.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();

            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );

            displayProducts(filtered);
        });
    }

});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // UX MODERNE
    alert(`🛒 ${product.name} ajouté !`);
}

// AFFICHAGE PRODUITS
function displayProducts(productsToDisplay = products) {
    const feedContainer = document.getElementById('productsFeed');

    if (!feedContainer) return;

    feedContainer.innerHTML = '<h2>Produits</h2>';

    productsToDisplay.forEach(product => {

        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        const badgeHTML = product.badge ? `<span class="product-badge ${product.badge}">${product.badgeText}</span>` : '';
        const priceHTML = product.originalPrice ? `<span class="price-original">${product.originalPrice}€</span>` : '';

        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badgeHTML}
                </div>

                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>

                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span>${product.reviews} avis</span>
                    </div>

                    <div class="product-price">
                        <span class="price-main">${product.price}€</span>
                        ${priceHTML}
                    </div>

                    <div class="product-actions">
                        <button onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Ajouter
                        </button>

                        <button onclick="addToWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        feedContainer.innerHTML += productCard;
    });
}

// FILTRAGE
function filterProducts() {

    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = products.filter(product => {

        let categoryMatch = !category || product.category === category;

        let priceMatch = true;
        if (priceRange) {
            if (priceRange === '0-50') priceMatch = product.price <= 50;
            if (priceRange === '50-100') priceMatch = product.price > 50 && product.price <= 100;
            if (priceRange === '100-500') priceMatch = product.price > 100 && product.price <= 500;
            if (priceRange === '500+') priceMatch = product.price > 500;
        }

        let searchMatch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return categoryMatch && priceMatch && searchMatch;
    });

    // TRI
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    displayProducts(filtered);
}

const search = document.getElementById('searchInput');

if (search) {
    search.addEventListener('input', filterProducts);
}

let timeout;
search.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(filterProducts, 300);
});

// PANIER
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`✅ "${product.name}" ajouté au panier !`);
}

// FAVORIS
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    alert(`❤️ "${product.name}" ajouté aux favoris !`);
}
// =======================
// 🛒 PANIER AVEC STOCKAGE
// =======================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// SAUVEGARDER
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// AJOUTER AU PANIER
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
}

// SUPPRIMER
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// CHANGER QUANTITÉ
function changeQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    }

    saveCart();
    updateCartUI();
}

// METTRE À JOUR L’AFFICHAGE
function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    const countElement = document.getElementById('cartCount');

    if (!container) return;

    container.innerHTML = '';

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>${item.price}€ x ${item.quantity}</p>

                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <button onclick="removeFromCart(${item.id})">❌</button>
            </div>
        `;
    });

    totalElement.textContent = `Total : ${total}€`;
    countElement.textContent = count;
}

// CHARGER PANIER AU DÉMARRAGE
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
