const CART_STORAGE_KEY = "evopia-cart";

function getCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return {};
    }

    try {
        return JSON.parse(savedCart);
    } catch {
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartCount(cart) {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
}

function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
}

function updateCartBadge() {
    const cart = getCart();
    const count = getCartCount(cart);
    const badges = document.querySelectorAll(".cart-count");

    badges.forEach((badge) => {
        badge.textContent = count;
    });
}

//system feedback when item is added to cart

let cartToastTimeout;

function showCartToast(message) {
    let toast = document.querySelector(".cart-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "cart-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(cartToastTimeout);
    cartToastTimeout = setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 2200);
}

//cart system
function addItemToCart(product, quantityToAdd = 1) {
    const cart = getCart();
    const existingItem = cart[product.id];

    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart[product.id] = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: quantityToAdd
        };
    }

    saveCart(cart);
    updateCartBadge();

    const itemLabel = 
        quantityToAdd > 1
            ? `${quantityToAdd} x ${product.name} added to cart`
            : `${product.name} added to cart`;
            
    showCartToast(itemLabel);
}

function updateItemQuantity(productId, nextQuantity) {
    const cart = getCart();

    if (!cart[productId]) {
        return;
    }

    if (nextQuantity <= 0) {
        delete cart[productId];
    } else {
        cart[productId].quantity = nextQuantity;
    }

    saveCart(cart);
    updateCartBadge();
    renderCartPage();
}

function removeItem(productId) {
    const cart = getCart();
    delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCartPage();
}

function bindProductGridCartButton() {
    const buttons = document.querySelectorAll(".product-card-cart");

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".product-card");

            if(!card) {
                return;
            }

            addItemToCart({
                id: card.dataset.productId,
                name: card.dataset.name,
                price: card.dataset.price,
                image: card.dataset.image
            }, 1);
        });
    });
}

function bindDetailPageCartButton() {
    const cartButton = document.querySelector(".detail-cart-button");
    const qtyValue = document.querySelector(".detail-qty-value");
    const qtyButtons = document.querySelectorAll(".detail-qty-btn");

    if (!cartButton || !qtyValue || qtyButtons.length === 0) {
        return;
    }

    let quantity = Number(qtyValue.textContent) || 1;

    qtyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.textContent.trim() === "-") {
                quantity = Math.max(1, quantity - 1);
            } else {
                quantity += 1;
            }

            qtyValue.textContent = quantity;
        });
    });

    cartButton.addEventListener("click", () => {
        addItemToCart({
            id: cartButton.dataset.productId,
            name: cartButton.dataset.name,
            price: cartButton.dataset.price,
            image: cartButton.dataset.image
        }, quantity);
    });
}

//item display in cart page when item is added to cart
function renderCartPage() {
    const cartItemsContainer = document.querySelector("[data-cart-items]");
    const emptyState = document.querySelector("[data-cart-empty]");
    const subtotalElement = document.querySelector("[data-cart-subtotal]");
    const totalElement = document.querySelector("[data-cart-total]");

    if (!cartItemsContainer || !emptyState || !subtotalElement || !totalElement) {
        return;
    }

    const cart = getCart();
    const items = Object.values(cart).filter((item) => item.quantity > 0);

    cartItemsContainer.innerHTML = "";

    if (items.length === 0) {
        emptyState.hidden = false;
    } else {
        emptyState.hidden = true;
    }

    let subtotal = 0;

    items.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement("article");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-product">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <p class="cart-item-name">${item.name}</p>
            </div>

            <div class="cart-item-quantity">
                <button type="button" class="cart-qty-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="cart-qty-btn" data-action="increase" data-product-id="${item.id}">+</button>
            </div>

            <p class="cart-item-subtotal">${formatPrice(itemSubtotal)}</p>

            <div class="cart-item-action">
                <button type="button" class="cart-item-remove" data-product-id="${item.id}" aria-label="Remove ${item.name}">
                    Remove
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(row);
    });

    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal);

    cartItemsContainer.querySelectorAll(".cart-qty-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.dataset.productId;
            const action = button.dataset.action;
            const cart = getCart();
            const item = cart[productId];

            if (!item) {
                return;
            }

            const nextQuantity =
                action === "increase" ? item.quantity + 1 : item.quantity - 1;

                updateItemQuantity(productId, nextQuantity);
        });
    });

    cartItemsContainer.querySelectorAll(".cart-item-remove").forEach((button) => {
        button.addEventListener("click", () => {
            removeItem(button.dataset.productId);
        });
    });
}

updateCartBadge();
bindProductGridCartButton();
bindDetailPageCartButton();
renderCartPage();