const pillow = document.querySelector(".floating-pillow");
const pillowSection = document.querySelector(".pillow-section");
const categoriesSection = document.querySelector(".categories-section");
const prevPillowButton = document.querySelector("#prevPillow");
const nextPillowButton = document.querySelector("#nextPillow");
const pillowTitle = document.querySelector("#pillowTitle");
const pillowDescription = document.querySelector("#pillowDescription");
const pillowInfo = document.querySelector(".pillow-info");

const pillowProducts = [
    {
        image: "ASSETS/pillow_element.png",
        title: "Luxury Down Pillow",
        description: "Wake up refreshed with plush duck feather and down pillows crafted for hotel-level comfort every night."
    },
    {
        image: "ASSETS/pillow_element_2.png",
        title: "Contour Luxe Pillow",
        description: "Experience hotel-inspired comfort with breathable memory foam pillows that adapt to your shape."
    },
    {
        image: "ASSETS/pillow_element_3.png",
        title: "Memory Foam Pillow",
        description: "Supportive memory foam comfort designed to ease pressure and keep you aligned through the night."
    },
    {
        image: "ASSETS/pillow_element_4.png",
        title: "King Memory Foam Pillow",
        description: "A larger memory foam pillow with generous support for deeper, more restful sleep."
    }
];

let currentPillowIndex = 0;
let isChangingPillow = false;

let currentX = 0;
let currentY = 0;
let currentScale = 1;
let currentRotate = -8;

function animatePillow() {
    if (!pillow || !pillowSection || !categoriesSection || isChangingPillow) return;

    const sectionTop = pillowSection.offsetTop;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const start = sectionTop - windowHeight;
    const end = sectionTop + windowHeight * 0.25;

    let progress = (scrollY - start) / (end - start);
    progress = Math.min(Math.max(progress, 0), 1);

    const startX = 0;
    const startY = 0;
    const startScale = 1;
    const startRotate = -8;

    const endX = -30;
    const endY = 35;
    const endScale = 2.35;
    const endRotate = -14;

    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    const scale = startScale + (endScale - startScale) * progress;
    const rotate = startRotate + (endRotate - startRotate) * progress;

    currentX = x;
    currentY = y;
    currentScale = scale;
    currentRotate = rotate;

    pillow.style.transform = `
        translate(calc(-50% + ${x}vw), ${y}vh)
        rotate(${rotate}deg)
        scale(${scale})
    `;

    const categoriesTop = categoriesSection.offsetTop;
    const fadeStart = categoriesTop - windowHeight * 0.5;
    const fadeEnd = categoriesTop - windowHeight * 0.2;

    let fadeProgress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    fadeProgress = Math.min(Math.max(fadeProgress, 0), 1);

    const fadeScale = 1 - fadeProgress * 0.18;

    pillow.style.opacity = `${1 - fadeProgress}`;
    pillow.style.transform = `
        translate(calc(-50% + ${x}vw), ${y}vh)
        rotate(${rotate}deg)
        scale(${scale * fadeScale})
    `;
}

function setPillowTransform(extraX = 0) {
    pillow.style.transform = `
        translate(calc(-50% + ${currentX +extraX}vw), ${currentY}vh)
        rotate(${currentRotate}deg)
        scale(${currentScale})
    `;
}

function showPillow(index, direction) {
    if (!pillow || isChangingPillow) return;

    isChangingPillow = true;

    pillow.style.opacity = "0";

    if (pillowInfo) {
        pillowInfo.style.opacity = "0";
    }

    setPillowTransform(direction === "next" ? -10 : 10);

    setTimeout(() => {
        currentPillowIndex = index;

        pillow.src = pillowProducts[currentPillowIndex].image;

        if (pillowTitle) {
            pillowTitle.textContent = pillowProducts[currentPillowIndex].title;
        }

        if (pillowDescription) {
            pillowDescription.textContent = pillowProducts[currentPillowIndex].description;
        }

        setPillowTransform(direction === "next" ? 10 : -10);

        requestAnimationFrame(() => {
            pillow.style.opacity = "1";
            setPillowTransform();

            if (pillowInfo) {
                pillowInfo.style.opacity = "1";
            }
        });

        setTimeout(() => {
            isChangingPillow = false;
            animatePillow();
        }, 450);
    }, 350);
}

nextPillowButton?.addEventListener ("click", () => {
    const nextIndex = (currentPillowIndex + 1) % pillowProducts.length;
    showPillow(nextIndex, "next");
});

prevPillowButton?.addEventListener("click", () => {
    const prevIndex = (currentPillowIndex - 1 + pillowProducts.length) % pillowProducts.length;

    showPillow(prevIndex, "prev");
});

window.addEventListener("scroll", animatePillow);
window.addEventListener("resize", animatePillow);
animatePillow();

const productGrid = document.querySelector("#productGrid");
const productCards = [...document.querySelectorAll(".product-card")];
const filters = [...document.querySelectorAll(".catalog-filter")];
const clearFiltersButton = document.querySelector(".clear-filters");
const sortSelect = document.querySelector("#productSort");
const cartCount = document.querySelector(".cart-count");
const addCartButtons = document.querySelectorAll(".product-card-cart");

let cartItems = 0;

function updateProducts() {
    const activeFilters = filters
        .filter((filter) => filter.checked)
        .map((filter) => filter.value);

    productCards.forEach((card) => {
        const category = card.dataset.category;

        const shouldShow =
            activeFilters.length === 0 ||
            activeFilters.some((filter) => category.includes(filter));

        card.classList.toggle("is-hidden", !shouldShow);
    });

    const sortedCards = [...productCards].sort((a, b) => {
        const sortValue = sortSelect.value;

        if (sortValue === "price-low") {
            return Number(a.dataset.price) - Number(b.dataset.price);
        }

        if (sortValue === "price-high") {
            return Number(b.dataset.price) - Number(a.dataset.price);
        }

        if (sortValue === "most-popular") {
            return a.dataset.name.localeCompare(b.dataset.name);
        }

        return Number(a.dataset.order) - Number(b.dataset.order);
    });

    const visibleCards = sortedCards.filter((card) => !card.classList.contains("is-hidden"));
    const hiddenCards = sortedCards.filter((card) => card.classList.contains("is-hidden"));

    [...visibleCards, ...hiddenCards].forEach((card) => productGrid.appendChild(card));
}

filters.forEach((filter) => {
    filter.addEventListener("change", updateProducts);
});

sortSelect?.addEventListener("change", updateProducts);

addCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        const productCard = button.closest(".product-card");
        const productName = productCard?.dataset.name;

        if (!productName) return;

        addItemToCart(productName, 1);
    });
});

updateCartBadge();
renderCartPage();

document.addEventListener("click", (event) => {
    const increaseButton = event.target.closest("[data-cart-increase]");
    const decreaseButton = event.target.closest("[data-cart-decrease]");
    const removeButton = event.target.closest("[data-cart-remove]");

    if (!increaseButton && !decreaseButton && !removeButton) return;

    const cart = getCart();

    if (increaseButton) {
        const name = increaseButton.dataset.cartIncrease;
        if (cart[name]) {
            cart[name].quantity += 1;
        }
    }

    if (decreaseButton) {
        const name = decreaseButton.dataset.cartDecrease;
        if (cart[name]) {
            cart[name].quantity = Math.max(0, cart[name].quantity - 1);
            if (cart[name].quantity === 0) {
                delete cart[name];
            }
        }
    }

    if (removeButton) {
        const name = removeButton.dataset.cartRemove;
        delete cart[name];
    }

    saveCart(cart);
    updateCartBadge();
    renderCartPage();
});

const qtyValue = document.querySelector(".detail-qty-value");
const qtyButtons = document.querySelectorAll(".detail-qty-btn");

let quantity = 1;

qtyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.textContent.includes("+")) {
            quantity += 1;
        } else {
            quantity = Math.max(1, quantity - 1);
        }

        if (qtyValue) {
            qtyValue.textContent = quantity;
        }
    });
});

const CART_STORAGE_KEY = "evopia-cart";

const productCatalog = {
    "Memory Foam Pillow": {
        name: "Memory Foam Pillow",
        price: 56,
        image: "ASSETS/memory foam pillow.png"
    },
    "King Memory Foam Pillow": {
        name: "King Memory Foam Pillow",
        price: 58,
        image: "ASSETS/king memory foam pillow.png"
    },
    "Luxury Down Pillow": {
        name: "Luxury Down Pillow",
        price: 54,
        image: "ASSETS/medium downfeather.png"
    },
    "Contour Luxe Pillow": {
        name: "Contour Luxe Pillow",
        price: 49,
        image: "ASSETS/contour luxe pillow.png"
    },
    "King Size Pillow Set": {
        name: "King Size Pillow Set",
        price: 81,
        image: "ASSETS/king set.png"
    }
};

function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartCount() {
    const cart = getCart();

    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    if (!cartCount) return;
    cartCount.textContent = getCartCount();
}

function addItemToCart(productName, quantity = 1) {
    const product = productCatalog[productName];
    if (!product) return;

    const cart = getCart();
    const currentQuantity = cart[productName]?.quantity || 0;

    cart[productName] = {
        ...product,
        quantity: currentQuantity + quantity
    };

    saveCart(cart);
    updateCartBadge();
}

function renderCartPage() {
    const cartList = document.querySelector("[data-cart-items]");
    const emptyState = document.querySelector("[data-cart-empty]");
    const subtotalValue = document.querySelector("[data-cart-subtotal]");
    const totalValue = document.querySelector("[data-cart-total]");

    if (!cartList) return;

    const cart = getCart();
    const items = Object.values(cart).filter((item) => item.quantity > 0);

    cartList.innerHTML = "";

    if (items.length === 0) {
        emptyState?.removeAttribute("hidden");
        if (subtotalValue) subtotalValue.textContent = "$0";
        if (totalValue) totalValue.textContent = "$0";
        return;
    }

    emptyState?.setAttribute("hidden", "");
    let subtotal = 0;

    items.forEach((item) => {
        const row = document.createElement("article");
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-product">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <p class="cart-item-name">${item.name}</p>
            </div>

            <div class="cart-item-quantity">
                <button type="button" class="cart-qty-btn" data-cart-decrease="${item.name}">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="cart-qty-btn" data-cart-increase="${item.name}">+</button>
            </div>

            <p class="cart-item-subtotal">$${itemSubtotal}</p>

            <button type="button" class="cart-item-remove" data-cart-remove="${item.name}">Delete</button>
        `;

        cartList.appendChild(row);
    });

    if (subtotalValue) subtotalValue.textContent = `$${subtotal}`;
    if (totalValue) totalValue.textContent = `$${subtotal}`;
}
