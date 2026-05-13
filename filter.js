
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

sortSelect.addEventListener("change", updateProducts);

clearFiltersButton.addEventListener("click", () => {
    filters.forEach((filter) => {
        filter.checked = false;
    });

    updateProducts();
})

updateProducts();