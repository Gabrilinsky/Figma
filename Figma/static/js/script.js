// static/js/script.js

// Lista de productos utilizando las rutas de static/images/
const products = [
  {
    id: 1,
    name: "4 Quesos",
    category: "pizzas",
    image: "static/images/04_pizza_cuatro_quesos.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 2,
    name: "Todas las carnes",
    category: "pizzas",
    image: "static/images/08_pizza_pollo_pimenton_aceitunas.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 3,
    name: "Hawaiana",
    category: "pizzas",
    image: "static/images/03_pizza_hawaiana.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 4,
    name: "Pepperoni",
    category: "pizzas",
    image: "static/images/07_pizza_pepperoni.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 5,
    name: "Del Jardín",
    category: "pizzas",
    image: "static/images/09_pizza_del_jardin.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 6,
    name: "Del Huerto",
    category: "pizzas",
    image: "static/images/10_pizza_del_huerto.png",
    prices: { Mediano: 4490, Grande: 8490 }
  },
  {
    id: 7,
    name: "Limonada de menta jengibre",
    category: "bebestibles",
    image: "static/images/11_bebestibles_fondo_1.png",
    price: 1500
  },
  {
    id: 8,
    name: "Bebidas 350ml",
    category: "bebestibles",
    image: "static/images/Bebida.png",
    price: 1000
  },
  {
    id: 9,
    name: "Jugos Naturales",
    category: "bebestibles",
    image: "static/images/Jugo.png",
    price: 1200
  },
  {
    id: 10,
    name: "Alitas de Barbacoa",
    category: "acompañamientos",
    image: "static/images/Alitas.png",
    price: 1500
  },
  {
    id: 11,
    name: "Papas Fritas",
    category: "acompañamientos",
    image: "static/images/Papas.png",
    price: 1000
  },
  {
    id: 12,
    name: "Empanada queso/pino",
    category: "acompañamientos",
    image: "static/images/Empanadas.png",
    price: 1200
  }
];

let cart = [];
let selectedSizes = {};

// Elementos del DOM basados en tu HTML personalizado
const productGrid = document.getElementById('productgrid');
const cartDrawer = document.getElementById('carta-pedido');
const cartBtn = document.getElementById('btn');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('compra');
const searchInput = document.getElementById('searchInput');
const mainButtons = document.querySelectorAll('.main-button');
const checkoutBtn = document.getElementById('checkoutBtn');

// Formatear precios a Pesos Chilenos
function formatCLP(amount) {
  return `$${amount.toLocaleString('es-CL')} CLP`;
}

// Renderizar tarjetas de productos en el Grid
function renderProducts(filterCategory = 'all', searchQuery = '') {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const filtered = products.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    let sizeOptions = '';
    let currentPrice = p.price;

    if (p.category === 'pizzas') {
      const currentSize = selectedSizes[p.id] || 'Mediano';
      currentPrice = p.prices[currentSize];

      sizeOptions = `
        <div class="size-selector">
          <button class="size-btn ${currentSize === 'Mediano' ? 'active' : ''}" onclick="changeSize(${p.id}, 'Mediano')">Mediano</button>
          <button class="size-btn ${currentSize === 'Grande' ? 'active' : ''}" onclick="changeSize(${p.id}, 'Grande')">Grande</button>
        </div>
      `;
    }

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        ${sizeOptions}
        <div class="card-footer">
          <span class="price">${formatCLP(currentPrice)}</span>
          <button class="btn-primary" onclick="addToCart(${p.id})">Agregar</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Cambiar tamaño seleccionado en la tarjeta de Pizza
window.changeSize = function(productId, size) {
  selectedSizes[productId] = size;
  const activeBtn = document.querySelector('.main-button.active');
  const activeCategory = activeBtn ? activeBtn.dataset.cat : 'all';
  renderProducts(activeCategory, searchInput.value);
};

// Agregar un ítem al carrito
window.addToCart = function(productId) {
  const item = products.find(p => p.id === productId);
  let price = item.price;
  let name = item.name;

  if (item.category === 'pizzas') {
    const size = selectedSizes[productId] || 'Mediano';
    price = item.prices[size];
    name += ` (${size})`;
  }

  const existingIndex = cart.findIndex(c => c.name === name);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartUI();
  cartDrawer.classList.add('open');
};

// Actualizar la interfaz del carrito y total
function updateCartUI() {
  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>${formatCLP(item.price)} x ${item.qty}</div>
      </div>
      <button class="btn-primary" onclick="removeFromCart(${index})">&times;</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = formatCLP(total);
  cartCount.textContent = count;
}

// Eliminar ítem del carrito
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

// Función para clicks del menú de navegación (links del header)
window.filterCategory = function(cat) {
  let categoryMap = {
    'Menu': 'all',
    'Pizza': 'pizzas',
    'Bebida': 'bebestibles',
    'Acompañado': 'acompañamientos'
  };

  const targetCat = categoryMap[cat] || 'all';

  mainButtons.forEach(b => {
    b.classList.toggle('active', b.dataset.cat === targetCat);
  });

  renderProducts(targetCat, searchInput.value);
};

// Abrir y cerrar panel lateral del carrito
if (cartBtn) cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
if (closeCart) closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));

// Botones de filtro de categorías centrales
mainButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    mainButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.cat, searchInput.value);
  });
});

// Búsqueda en vivo
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const activeBtn = document.querySelector('.main-button.active');
    const activeCategory = activeBtn ? activeBtn.dataset.cat : 'all';
    renderProducts(activeCategory, e.target.value);
  });
}

// Envío del pedido a WhatsApp
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let message = "Hola PizzaBriel, quisiera hacer el siguiente pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
      message += `• ${item.name} x${item.qty} - ${formatCLP(item.price * item.qty)}\n`;
      total += item.price * item.qty;
    });

    message += `\n*Total:* ${formatCLP(total)}`;

    const phone = "56912345678"; // Reemplaza por tu número de WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });
}

// Carga Inicial
renderProducts();