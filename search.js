const products = [
    {
        name: "Memory Foam Pillow",
        keywords: ["memory", "foam", "pillow", "support"],
        url: "memoryFoam.html", 
        image: "ASSETS/memory foam pillow.png",
        subtitle: "Memory Foam Pillow"
    },
    {
        name: "King Memory Foam Pillow",
        keywords: ["king", "memory", "foam", "pillow"],
        url: "kingMemoryFoam.html",
        image: "ASSETS/king memory foam pillow.png",
        subtitle: "King Sized Pillow"
    },
    {
        name: "Luxury Down Pillow",
        keywords: ["luxury", "down", "feather", "pillow"],
        url: "luxuryDown.html",
        image: "ASSETS/medium downfeather.png",
        subtitle: "Down Feather Pillow"
    },
    {
        name: "Contour Luxe Pillow",
        keywords: ["contour", "luxe", "pillow"],
        url: "contourLuxe.html",
        image: "ASSETS/contour luxe pillow.png",
        subtitle: "Contour Support Pillow"
    },
    {
        name: "King Size Pillow Set",
        keywords: ["king", "size", "set", "pillow"],
        url: "kingSet.html",
        image: "ASSETS/king set.png",
        subtitle: "4-Piece Pillow Set"
    }
];

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#siteSearch");
const suggestionsBox = document.querySelector("#searchSuggestions");

if (searchForm && searchInput && suggestionsBox) {
    function getMatches(query) {
        const cleanQuery = query.trim().toLowerCase();

        if (!cleanQuery) {
            return [];
        }

        return products.filter((product) => {
            const searchableText = [
                product.name,
                product.subtitle,
                ...product.keywords
            ].join(" ").toLowerCase();

            return searchableText.includes(cleanQuery);
        });
    }

    function renderSuggestions(matches) {
        suggestionsBox.innerHTML = "";

        if (matches.length === 0) {
            suggestionsBox.classList.remove("is-visible");
            return;
        }
        
        const visibleMatches = matches.slice(0, 5);

        const label = document.createElement("div");
        label.className = "search-suggestions-label";
        label.textContent = "Products";
        suggestionsBox.appendChild(label);

        matches.slice(0, 5).forEach((product) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "search-suggestion";

            button.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="search-suggestion-image">
                <div class="search-suggestion-copy">
                    <span class="search-suggestion-title">${product.name}</span>
                    <span class="search-suggestion-subtitle">${product.subtitle}</span>
                </div>
            `;

            button.addEventListener("click", () => {
                window.location.href = product.url;
            });

            suggestionsBox.appendChild(button);
        });

        const footer = document.createElement("div");
        footer.className = "search-suggestions-footer";
        footer.textContent = `${visibleMatches.length} result${visibleMatches.length === 1 ? "" : "s"}`;
        suggestionsBox.appendChild(footer);

        suggestionsBox.classList.add("is-visible");
    }

    searchInput.addEventListener("input", () => {
        const matches = getMatches(searchInput.value);
        renderSuggestions(matches);
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const matches = getMatches(searchInput.value);

        if (matches.length > 0) {
            window.location.href = matches[0].url;
        }
    });

    searchInput.addEventListener("focus", () => {
        const matches = getMatches(searchInput.value);
        if (matches.length > 0) {
            renderSuggestions(matches);
        }
    });

    document.addEventListener("click", (event) => {
        if (!searchForm.contains(event.target)) {
            suggestionsBox.classList.remove("is-visible");
        }
    });
}