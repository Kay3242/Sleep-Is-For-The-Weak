const navToggle = document.querySelector(".nav-toggle");
    const navbar = document.querySelector(".navbar");

    if (navToggle && navbar) {
        navToggle.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("menu-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                navbar.classList.remove("menu-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            }
        });
    }