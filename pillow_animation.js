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

//Pillow sliding animation
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

//Pillow carousel
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

