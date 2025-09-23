const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay"); // Obtener el nuevo overlay

// Funcion para abrir el menu
const openMobileMenu = () => {
    mobileMenu.classList.remove("-translate-x-full");
    mobileMenu.classList.add("translate-x-0");
    mobileOverlay.classList.remove("hidden"); // Mostrar el overlay
};

// Funcion para cerrar el menu
const closeMobileMenu = () => {
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("-translate-x-full");
    mobileOverlay.classList.add("hidden"); // Ocultar el overlay
};

menuBtn.addEventListener("click", openMobileMenu);
closeBtn.addEventListener("click", closeMobileMenu);

document.addEventListener("click", (event) => {
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnMenuButton = menuBtn.contains(event.target);

    // Si el clic no fue dentro del menu, ni en el X, y el menu está abierto
    if (!isClickInsideMenu && !isClickOnMenuButton && mobileMenu.classList.contains("translate-x-0")) {
        closeMobileMenu(); // Cerrar el menu
    }
});

// Cerrar el menu si se hace clic directamente en el overlay
mobileOverlay.addEventListener("click", closeMobileMenu);