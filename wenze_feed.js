// BASE DE DONNÉES DE PRODUITS
const products = [
    {
        id: 1,
        name: "Smartphone Pro Max 5G",
        category: "électronique",
        price: 899,
        originalPrice: 1099,
        image: "https://via.placeholder.com/280x220?text=Smartphone",
        description: "Écran AMOLED 6.7\", 5G, caméra 108MP",
        rating: 4.8,
        reviews: 245,
        badge: "sale",
        badgeText: "-18%"
    },
    {
        id: 2,
        name: "Casque Bluetooth Premium",
        category: "électronique",
        price: 199,
        originalPrice: 299,
        image: "https://via.placeholder.com/280x220?text=Casque",
        description: "Noise cancelling, 40h batterie",
        rating: 4.6,
        reviews: 128,
        badge: "new",
        badgeText: "Nouveau"
    },
    {
        id: 3,
        name: "Montre Connectée Elite",
        category: "électronique",
        price: 299,
        originalPrice: null,
        image: "https://via.placeholder.com/280x220?text=Montre",
        description: "GPS, écran AMOLED, 14 jours",
        rating: 4.7,
        reviews: 312,
        badge: null,
        badgeText: null
    },
    {
        id: 4,
        name: "Veste Tendance Hivernale",
        category: "vêtements",
        price: 79,
        originalPrice: 129,
        image: "https://via.placeholder.com/280x220?text=Veste",
        description: "Imperméable, doublure thermique",
        rating: 4.5,
        reviews: 87,
        badge: "sale",
        badgeText: "-39%"
    },
    {
        id: 5,
        name: "Jeans Premium Confort",
        category: "vêtements",
        price: 59,
        originalPrice: 99,
        image: "https://via.placeholder.com/280x220?text=Jeans",
        description: "Coupe slim, stretch, ultra confort",
        rating: 4.4,
        reviews: 156,
        badge: "sale",
        badgeText: "-40%"
    },
    {
        id: 6,
        name: "Chaussures de Sport",
        category: "vêtements",
        price: 89,
        originalPrice: 149,
        image: "https://via.placeholder.com/280x220?text=Chaussures",
        description: "Gel amorti, légères, respirantes",
        rating: 4.7,
        reviews: 203,
        badge: "new",
        badgeText: "Nouveau"
    },
    {
        id: 7,
        name: "Lampe LED Intelligente",
        category: "maison",
        price: 39,
        originalPrice: 59,
        image: "https://via.placeholder.com/280x220?text=Lampe",
        description: "16M couleurs, contrôle app",
        rating: 4.6,
        reviews: 94,
        badge: "sale",
        badgeText: "-34%"
    },
    {
        id: 8,
        name: "Tapis de Yoga Premium",
        category: "sport",
        price: 45,
        originalPrice: 75,
        image: "https://via.placeholder.com/280x220?text=Tapis",
        description: "6mm, antidérapant, écologique",
        rating: 4.5,
        reviews: 112,
        badge: "sale",
        badgeText: "-40%"
    },
    {
        id: 9,
        name: "Crème Visage Hydratante",
        category: "beauté",
        price: 34,
        originalPrice: null,
        image: "https://via.placeholder.com/280x220?text=Creme",
        description: "Bio, hypoallergénique, 50ml",
        rating: 4.8,
        reviews: 267,
        badge: "new",
        badgeText: "Nouveau"
    },
    {
        id: 10,
        name: "Tablette Graphique Pro",
        category: "électronique",
        price: 549,
        originalPrice: 699,
        image: "https://via.placeholder.com/280x220?text=Tablette",
        description: "12\", 8192 niveaux, stylet inclus",
        rating: 4.7,
        reviews: 178,
        badge: "sale",
        badgeText: "-21%"
    },
    {
        id: 11,
        name: "Sac à Dos Voyage",
        category: "vêtements",
        price: 89,
        originalPrice: 139,
        image: "https://via.placeholder.com/280x220?text=Sac",
        description: "40L, imperméable, USB",
        rating: 4.6,
        reviews: 143,
        badge: "sale",
        badgeText: "-36%"
    },
    {
        id: 12,
        name: "Enceinte Bluetooth Portative",
        category: "électronique",
        price: 129,
        originalPrice: 199,
        image: "https://via.placeholder.com/280x220?text=Enceinte",
        description: "360°, 20h batterie, étanche",
        rating: 4.7,
        reviews: 234,
        badge: "sale",
        badgeText: "-35%"
    }
];

// FONCTION POUR AFFICHER LES PRODUITS
function displayProducts(productsToDisplay = products) {
    const feedContainer = document.getElementById('productsFeed');
    feedContainer.innerHTML = '';

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
                        <span class="rating-count">${product.reviews} avis</span>
                    </div>
                    <div class="product-price">
                        <div>
                            <span class="price-main">${product.price}€</span>
                            ${priceHTML}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Ajouter
                        </button>
                        <button class="btn-wishlist" onclick="addToWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        feedContainer.innerHTML += productCard;
    });
}

// FILTRAGE ET TRI
document.getElementById('categoryFilter').addEventListener('change', filterProducts);
document.getElementById('priceFilter').addEventListener('change', filterProducts);
document.getElementById('sortFilter').addEventListener('change', filterProducts);

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filtered = products.filter(product => {
        let categoryMatch = !category || product.category === category;
        let priceMatch = true;

        if (priceRange) {
            if (priceRange === '0-50') priceMatch = product.price <= 50;
            if (priceRange === '50-100') priceMatch = product.price > 50 && product.price <= 100;
            if (priceRange === '100-500') priceMatch = product.price > 100 && product.price <= 500;
            if (priceRange === '500+') priceMatch = product.price > 500;
        }

        return categoryMatch && priceMatch;
    });

    // TRI
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    displayProducts(filtered);
}

// RECHERCHE
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
});

// PANIER
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`✅ "${product.name}" ajouté au panier!`);
    console.log('Produit ajouté au panier:', product);
}

// FAVORIS
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    alert(`❤️ "${product.name}" ajouté aux favoris!`);
    console.log('Produit ajouté aux favoris:', product);
}

// CHARGER LES PRODUITS AU DÉMARRAGE
displayProducts();