/* ================================================================
SCRIPT UNIFICADO PARA NEXO
Contiene:
1. Lógica de Menú Móvil y Mini-Carrito (comparten overlay)
2. Lógica de Conteo de Productos (¡NUEVA LÓGICA COMPLETA!)
3. Lógica del Botón "Subir"
4. Lógica de Swipers (Carruseles) - (Para Index)
5. Lógica de Filtro de Marcas - (Para Index)
================================================================
*/

// Almacenará los productos de nuestro carrito
let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {

    // --- Selectores del Menú Móvil ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // --- Selectores del Botón Subir ---
    const btnSubir = document.getElementById('btnSubir');

    // --- Selectores del Carrito (Contador) ---
    const cartCountDesktop = document.getElementById('cart-count-desktop');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // --- Selectores del Mini-Carrito (Panel) ---
    const miniCart = document.getElementById('mini-cart');
    const openCartButtons = document.querySelectorAll('.open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    // --- NUEVO: Selectores del contenido del carrito ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartSubtotal = document.getElementById('cart-subtotal');

    // --- 1. LÓGICA DE AÑADIR AL CARRITO (TOTALMENTE NUEVA) ---

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // 1. Encontrar la tarjeta del producto que fue clickeada
            const card = event.target.closest('.product-card');
            
            // 2. Extraer la información usando las clases que agregamos
            const name = card.querySelector('.product-name').innerText;
            const priceString = card.querySelector('.product-price').innerText;
            const imageSrc = card.querySelector('.product-image').src;

            // 3. Limpiar el precio (quitar "$", "." y convertir a número)
            // Esto convierte "$1.500.000" en el número 1500000
            const price = parseFloat(priceString.replace('$', '').replace(/\./g, ''));

            // 4. Crear un objeto producto
            const product = {
                id: name, // Usamos el nombre como ID único por simplicidad
                name: name,
                price: price,
                image: imageSrc,
                quantity: 1
            };

            // 5. Añadir el producto al array `cartItems`
            addItemToCart(product);
            
            // 6. Abrir el panel del carrito
            openCart();
        });
    });

    function addItemToCart(product) {
        // Revisar si el item ya existe
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            // Si existe, solo aumenta la cantidad
            existingItem.quantity++;
        } else {
            // Si es nuevo, lo agrega al array
            cartItems.push(product);
        }

        // Actualizar todo (la lista de items, el subtotal y los contadores)
        renderCart();
    }

    function renderCart() {
        // Limpiar el contenedor
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            // Si no hay items, mostrar el mensaje de "vacío"
            if (cartEmptyMsg) cartItemsContainer.appendChild(cartEmptyMsg);
        } else {
            // Si hay items, crear el HTML para cada uno
            cartItems.forEach(item => {
                const itemHTML = `
                    <div class="flex items-center gap-4 py-4 border-b border-gray-200">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                        <div class="flex-1">
                            <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                            <p class="text-xs text-gray-500">Cantidad: ${item.quantity}</p>
                            <p class="font-bold text-violet-600 text-sm">$${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                        </div>
                        </div>
                `;
                cartItemsContainer.innerHTML += itemHTML;
            });
        }
        
        // Actualizar el subtotal y los contadores de burbuja
        updateCartSubtotal();
        updateCartCounters();
    }

    function updateCartSubtotal() {
        // Sumar el (precio * cantidad) de cada item
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Mostrarlo en el HTML, formateado como moneda argentina
        if (cartSubtotal) cartSubtotal.innerText = `$${total.toLocaleString('es-AR')}`;
    }

    function updateCartCounters() {
        // Sumar la cantidad total de items (no de productos distintos)
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCountDesktop) cartCountDesktop.innerText = totalItems;
        if (cartCountMobile) cartCountMobile.innerText = totalItems;
    }


    // --- 2. LÓGICA DE ABRIR/CERRAR MENÚ Y CARRITO (Sin cambios) ---

    function openCart() {
        if (miniCart && mobileOverlay) {
            miniCart.classList.remove('translate-x-full');
            mobileOverlay.classList.remove('hidden');
            if (mobileMenu) mobileMenu.classList.add('-translate-x-full');
        }
    }

    function closeCart() {
        if (miniCart && mobileOverlay) {
            miniCart.classList.add('translate-x-full');
            if (!mobileMenu || mobileMenu.classList.contains('-translate-x-full')) {
                mobileOverlay.classList.add('hidden');
            }
        }
    }

    function openMobileMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.remove('-translate-x-full');
            mobileOverlay.classList.remove('hidden');
            if (miniCart) miniCart.classList.add('translate-x-full');
        }
    }
    
    function closeMobileMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.add('-translate-x-full');
            if (!miniCart || miniCart.classList.contains('translate-x-full')) {
                mobileOverlay.classList.add('hidden');
            }
        }
    }

    openCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            openCart();
        });
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
    });

    if (menuBtn) menuBtn.addEventListener('click', openMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            closeMobileMenu();
            closeCart(); 
        });
    }

    // --- 3. LÓGICA DEL BOTÓN "SUBIR" (Sin cambios) ---
    if (btnSubir) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                btnSubir.classList.remove("hidden");
            } else {
                btnSubir.classList.add("hidden");
            }
        });
        btnSubir.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- 4. LÓGICA DE SWIPERS (Sin cambios) ---
    
    if (document.querySelector('.featured-carousel')) {
        new Swiper('.featured-carousel', {
            slidesPerView: 1, spaceBetween: 32,
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
            loop: true, speed: 500, effect: 'slide', grabCursor: true,
            navigation: { nextEl: '.custom-next', prevEl: '.custom-prev' },
            pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
        });
    }

    if (document.querySelector('.new-products')) {
        new Swiper('.new-products', {
            slidesPerView: 1, spaceBetween: 20, loop: true,
            navigation: { nextEl: '.new-products .swiper-button-next', prevEl: '.new-products .swiper-button-prev' },
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
        });
    }

    // --- 5. LÓGICA DE FILTRO DE MARCAS (Sin cambios) ---
    
    const filterButtons = document.querySelectorAll('.brand-button');
    if (filterButtons.length > 0) {
        let brandSwiper; 
        const productCards = document.querySelectorAll('.product-card');
        const promoImage = document.querySelector('#brand-promo img');
        const promoTitle = document.querySelector('#promo-title');
        const brandNextButton = document.querySelector('.brand-products .swiper-button-next');
        const brandPrevButton = document.querySelector('.brand-products .swiper-button-prev');

        const promoData = {
            'steelseries': { image: './img/assets/promo/steel-series.png', title: 'STEELSERIES' },
            'logitech': { image: './img/assets/promo/logitech-promo.png', title: 'LOGITECH' },
            'asus': { image: './img/assets/promo/asus-promo.png', title: 'ASUS' },
        };

        function filterProducts(selectedBrand) {
            let visibleSlides = 0;
            productCards.forEach(card => {
                if (card.getAttribute('data-brand') === selectedBrand) {
                    card.classList.remove('hidden');
                    visibleSlides++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (promoImage && promoTitle) {
                const data = promoData[selectedBrand];
                if (data) {
                    promoImage.src = data.image;
                    promoTitle.textContent = data.title;
                }
            }
            
            if (brandSwiper) {
                brandSwiper.destroy(true, true);
            }
            
            if (document.querySelector('.brand-products')) {
                brandSwiper = new Swiper('.brand-products', {
                    slidesPerView: 1, spaceBetween: 15,
                    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                    breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }
                });
            }

            const shouldHideArrows = visibleSlides <= 1;
            if (brandNextButton && brandPrevButton) {
                brandNextButton.classList.toggle('hidden', shouldHideArrows);
                brandPrevButton.classList.toggle('hidden', shouldHideArrows);
            }

            filterButtons.forEach(btn => {
                const isSelected = btn.getAttribute('data-brand') === selectedBrand;
                btn.classList.toggle('bg-violet-600', isSelected);
                btn.classList.toggle('text-white', isSelected);
                btn.classList.toggle('border-violet-600', isSelected);
                btn.classList.toggle('hover:border-violet-600', !isSelected);
                
                const logo = btn.querySelector('img');
                if (logo) {
                    logo.classList.toggle('brightness-0', isSelected);
                    logo.classList.toggle('invert', isSelected);
                    logo.classList.toggle('filter-none', !isSelected);
                }
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedBrand = button.getAttribute('data-brand');
                filterProducts(selectedBrand);
            });
        });

        filterProducts('steelseries');
    }

}); // --- FIN DEL DOMContentLoaded ---

const tabs = document.querySelectorAll('#tab-login, #tab-register');
        const forms = document.querySelectorAll('.auth-form');
        const title = document.getElementById('auth-title');
        const subtitle = document.getElementById('auth-subtitle');
        const switchText = document.getElementById('switch-text');

        const content = {
            login: {
                title: 'Inicia Sesión en NEXO',
                subtitle: 'Accede a tu cuenta y continúa armando tu PC.',
                switch: '¿No tienes una cuenta? <a href="#" data-target="register" class="toggle-link font-medium text-violet-600 hover:text-violet-500 transition duration-150">Regístrate aquí</a>'
            },
            register: {
                title: 'Crea tu Cuenta NEXO',
                subtitle: 'Regístrate en segundos y empieza a comprar.',
                switch: '¿Ya tienes una cuenta? <a href="#" data-target="login" class="toggle-link font-medium text-violet-600 hover:text-violet-500 transition duration-150">Inicia sesión aquí</a>'
            }
        };

        function switchForm(target) {
            // 1. Alternar formularios (visibilidad)
            forms.forEach(form => {
                form.style.display = form.id === `form-${target}` ? 'block' : 'none';
            });

            // 2. Alternar pestañas (estilos)
            tabs.forEach(tab => {
                if (tab.dataset.target === target) {
                    tab.classList.add('text-violet-700', 'border-violet-700');
                    tab.classList.remove('text-gray-500', 'border-transparent');
                } else {
                    tab.classList.remove('text-violet-700', 'border-violet-700');
                    tab.classList.add('text-gray-500', 'border-transparent');
                }
            });

            // 3. Actualizar textos dinámicos
            title.textContent = content[target].title;
            subtitle.textContent = content[target].subtitle;
            switchText.innerHTML = content[target].switch;
            
            // Re-agregar event listeners a los nuevos enlaces de switch
            document.querySelectorAll('.toggle-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    switchForm(e.target.dataset.target);
                });
            });
        }

        // Event listeners para las pestañas
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                switchForm(e.target.dataset.target);
            });
        });

        // Event listeners para el enlace de alternancia inicial
        document.querySelectorAll('.toggle-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchForm(e.target.dataset.target);
            });
        });

        // Inicializar al formulario de Login por defecto
        document.addEventListener('DOMContentLoaded', () => {
            switchForm('login');
        });