const productGrid = document.querySelector("#productGrid");
const productCards = [...document.querySelectorAll(".product-card")];
const filters = [...document.querySelectorAll(".catalog-filter")];
const clearFiltersButton = document.querySelector(".clear-filters");
const sortSelect = document.querySelector("#productSort");

function updateProducts() {
    const activeFilters = filters
        .filter((filter) => filter.checked)
        .map((filter) => filter.value);

    productCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");

        const shouldShow =
            activeFilters.length === 0 ||
            activeFilters.some((filter) => categories.includes(filter));

        card.classList.toggle("is-hidden", !shouldShow);
    });

    const sortedCards = [...productCards].sort((a, b) => {
        const sortValue = sortSelect ? sortSelect.value : "newest";

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

    sortedCards.forEach((card) => {
        productGrid.appendChild(card);
    });
}

filters.forEach((filter) => {
    filter.addEventListener("change", updateProducts);
});

if (sortSelect) {
    sortSelect.addEventListener("change", updateProducts);
}

if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        filters.forEach((filter) => {
            filter.checked = false;
        });

        updateProducts();
    });
}

updateProducts();