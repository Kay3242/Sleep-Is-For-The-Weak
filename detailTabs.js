const detailTabs = document.querySelectorAll(".detail-mobile-tab");
const detailPanels = document.querySelectorAll(".detail-mobile-panel");
const detailMobileQuery = window.matchMedia("(max-width: 48rem)");

function updateDetailTabs(defaultTab = "description") {
    if (!detailTabs.length || !detailPanels.length) {
        return;
    }

    if (!detailMobileQuery.matches) {
        detailTabs.forEach((tab) => tab.classList.remove("is-active"));
        detailPanels.forEach((panel) => panel.classList.add("is-active"));
        return;
    }

    detailTabs.forEach((tab) => {
        const isActive = tab.dataset.detailTab === defaultTab;
        tab.classList.toggle("is-active", isActive);
    });

    detailPanels.forEach((panel) => {
        const isActive = panel.dataset.detailPanel === defaultTab;
        panel.classList.toggle("is-active", isActive);
    });
}

detailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        updateDetailTabs(tab.dataset.detailTab);
    });
});

updateDetailTabs();

detailMobileQuery.addEventListener("change", () => {
    updateDetailTabs();
});