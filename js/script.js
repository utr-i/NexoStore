/* Menu Hamburguesa */
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay"); /* Obtener el overlay para el fondo oscuro */

/* Funcion para abrir el menu */
const openMobileMenu = () => {
    mobileMenu.classList.remove("-translate-x-full");
    mobileMenu.classList.add("translate-x-0");
    mobileOverlay.classList.remove("hidden"); /* Mostrar el fondo oscuro cuando el menu esta abierto */
};

/* Funcion para cerrar el menu */
const closeMobileMenu = () => {
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("-translate-x-full");
    mobileOverlay.classList.add("hidden"); /* Ocultar el fondo oscuro al cerrar */
};

/* Eventos para abrir y cerrar el menu con los botones */
menuBtn.addEventListener("click", openMobileMenu);
closeBtn.addEventListener("click", closeMobileMenu);

/* Cerrar el menu si se hace click fuera del menu */
document.addEventListener("click", (event) => {
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnMenuButton = menuBtn.contains(event.target);

    /* Si el click no fue dentro del menu ni en el boton y el menu esta abierto, se cierra */
    if (!isClickInsideMenu && !isClickOnMenuButton && mobileMenu.classList.contains("translate-x-0")) {
        closeMobileMenu();
    }
});

/* Cerrar el menu si se hace click directamente en el overlay */
mobileOverlay.addEventListener("click", closeMobileMenu);

/* Inicializar Swiper para el carrusel de productos destacados */
document.addEventListener('DOMContentLoaded', function() {
  const swiper = new Swiper('.featured-carousel', {
    /* Mostrar 1 slide por vista en mobile */
    slidesPerView: 1,
    spaceBetween: 32,
    breakpoints: {
      640: { slidesPerView: 2 }, /* En tablet se muestran 2 */
      1024: { slidesPerView: 3 } /* En desktop se muestran 3 */
    },
    
    /* Loop infinito para que no se termine el carrusel */
    loop: true,
    
    /* Transicion suave entre slides */
    speed: 500,
    effect: 'slide',
    grabCursor: true,
    
    /* Flechas personalizadas para navegar */
    navigation: {
      nextEl: '.custom-next',
      prevEl: '.custom-prev',
    },
    
    /* Paginacion con puntos interactivos */
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
  });
});

/* Inicializar Swiper para la seccion de productos nuevos */
const swiperNew = new Swiper('.new-products', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.new-products .swiper-button-next',
    prevEl: '.new-products .swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 2 }, /* En tablet muestra 2 productos */
    1024: { slidesPerView: 4 } /* En desktop muestra 4 productos */
  }
});

/* Inicializar Swiper para la seccion de marcas */
const swiperBrands = new Swiper('.brand-products', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: '.brand-products .swiper-button-next',
    prevEl: '.brand-products .swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

/* Variable para almacenar el swiper de marcas y poder reiniciarlo */
let brandSwiper; 

/* Esperar a que el DOM cargue para manejar el filtrado de marcas */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.brand-button');
    const productCards = document.querySelectorAll('.product-card');
    const promoImage = document.querySelector('#brand-promo img');
    const promoTitle = document.querySelector('#promo-title');

    /* Datos de cada marca con su imagen y titulo */
    const promoData = {
        'steelseries': { 
            image: './img/assets/promo/steel-series.png', 
            title: 'STEELSERIES' 
        },
        'logitech': { 
            image: './img/assets/promo/logitech-promo.png', 
            title: 'LOGITECH' 
        },
        'asus': { 
            image: './img/assets/promo/asus-promo.png', 
            title: 'ASUS' 
        },
        /* Se pueden agregar mas marcas aca */
    };

    /* Funcion principal para filtrar los productos por marca */
    function filterProducts(selectedBrand) {
        let visibleSlides = 0;

        productCards.forEach(card => {
            if (card.getAttribute('data-brand') === selectedBrand) {
                /* Mostrar los productos de la marca seleccionada */
                card.classList.remove('hidden');
                visibleSlides++;
            } else {
                /* Ocultar los productos de otras marcas */
                card.classList.add('hidden');
            }
        });

        /* Actualizar imagen y titulo de la promo segun la marca */
        const data = promoData[selectedBrand];
        if (data) {
            promoImage.src = data.image;
            promoTitle.textContent = data.title;
        }

        /* Reiniciar el swiper para que solo muestre los productos visibles */
        if (brandSwiper) {
            brandSwiper.destroy(true, true);
        }
        
        brandSwiper = new Swiper('.brand-products', {
            slidesPerView: 1,
            spaceBetween: 15,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
            }
        });

        /* Cambiar el estilo de los botones segun la marca seleccionada */
        filterButtons.forEach(btn => {
            const isSelected = btn.getAttribute('data-brand') === selectedBrand;
            btn.classList.toggle('bg-violet-600', isSelected);
            btn.classList.toggle('text-white', isSelected);
            btn.classList.toggle('border-violet-600', isSelected);
            btn.classList.toggle('hover:border-violet-600', !isSelected);
            
            /* Invertir el color del logo cuando el boton esta activo */
            const logo = btn.querySelector('img');
            if (logo) {
                logo.classList.toggle('brightness-0', isSelected);
                logo.classList.toggle('invert', isSelected);
                logo.classList.toggle('filter-none', !isSelected);
            }
        });
    }

    /* Agregar evento click a cada boton de marca */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedBrand = button.getAttribute('data-brand');
            filterProducts(selectedBrand);
        });
    });

    /* Cargar por defecto la marca steelseries al iniciar */
    filterProducts('steelseries'); 
});
