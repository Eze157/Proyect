const productsContainer = document.querySelector('#productsContainer');
const cartLink = document.querySelector('#cartLink');
const cartModal = document.querySelector('#cartModal');
const cartItems = document.querySelector('#cartItems');
const totalCost = document.querySelector('#totalCost');
const clearCartButton = document.querySelector('#clearCartButton');
const closeCartButton = document.querySelector('.close');
const checkoutButton = document.querySelector('#checkoutButton');
const checkoutMessage = document.querySelector('#checkoutMessage');

let cart = [];
let data;

fetch('products.json')
    .then(response => response.json())
    .then(productsData => {
    data = productsData;
    data.forEach(product => {
        displayProduct(product);
    });

    const addToCartButtons = document.querySelectorAll('.addToCart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    cartLink.addEventListener('click', openCart);
    clearCartButton.addEventListener('click', clearCart);
    closeCartButton.addEventListener('click', closeCart);
    });


function displayProduct(product) {
    const productCard = document.createElement('div');
    productCard.className = 'productCard';

    const image = document.createElement('img');
    image.src = product.image;
    productCard.appendChild(image);

    const name = document.createElement('h3');
    name.textContent = product.name;
    productCard.appendChild(name);

    const price = document.createElement('p');
    price.textContent = '$' + product.price.toFixed(2);
    productCard.appendChild(price);

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Agregar al carrito';
    addToCartButton.className = 'addToCart';
    addToCartButton.dataset.id = product.id;
    productCard.appendChild(addToCartButton);

    productsContainer.appendChild(productCard);
}

function addToCart(event) {
    const productId = event.target.dataset.id;
    const product = getProductById(productId);

    if (product) {
    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    updateCartCount();
    updateTotalCost();
    }
}

function getProductById(productId) {
    return data.find(product => product.id == productId);
}

function updateCartCount() {
    cartLink.textContent = 'Carrito (' + getCartTotalQuantity() + ')';
}

function getCartTotalQuantity() {
    let totalQuantity = 0;

    cart.forEach(item => {
    totalQuantity += item.quantity;
    });

    return totalQuantity;
}

function openCart() {
    cartModal.style.display = 'block';
    displayCartItems();
}

function closeCart() {
    cartModal.style.display = 'none';
}

function displayCartItems() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.textContent = 'El carrito está vacío.';
    cartItems.appendChild(emptyCartMessage);
    return;
    }

    const uniqueItems = getUniqueItems();

    uniqueItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cartItem';

    const image = document.createElement('img');
    image.src = item.image;
    cartItem.appendChild(image);

    const name = document.createElement('h4');
    name.textContent = item.name;
    cartItem.appendChild(name);

    const quantity = document.createElement('span');
    quantity.textContent = 'Cantidad: ' + item.quantity;
    cartItem.appendChild(quantity);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.dataset.id = item.id;
    removeButton.addEventListener('click', removeFromCart);
    cartItem.appendChild(removeButton);

    cartItems.appendChild(cartItem);
    });
}

function removeFromCart(event) {
    const productId = event.target.dataset.id;
    const index = cart.findIndex(item => item.id == productId);

    if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1);
    }

    updateCartCount();
    updateTotalCost();
    displayCartItems();
    }
}

function clearCart() {
    cart = [];
    updateCartCount();
    updateTotalCost();
    displayCartItems();
}

function getUniqueItems() {
    const uniqueItems = [];

    cart.forEach(item => {
    const existingItem = uniqueItems.find(uniqueItem => uniqueItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        uniqueItems.push({ ...item });
    }
    });

    return uniqueItems;
}

function updateTotalCost() {
    let total = 0;

    cart.forEach(item => {
    total += item.price * item.quantity;
    });

    totalCost.textContent = '$' + total.toFixed(2);
}

checkoutButton.addEventListener('click', finalizePurchase);

function finalizePurchase() {
    if (cart.length === 0) {
        checkoutMessage.textContent = 'No ha seleccionado ningún artículo.';
    } else {
        cart = [];
        updateCartCount();
        displayCartItems();
        checkoutMessage.textContent = 'Muchas gracias por su compra, vuelva pronto.';
        setTimeout(() => {
        checkoutMessage.classList.add('hide');
        clearCart();
        updateTotalCost(); 
        closeCart(); 
        }, 3000);
    }
    checkoutMessage.classList.remove('hide');
}

