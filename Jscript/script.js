// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Iconos SVG
const sunIcon = 'icons/sun.svg';
const moonIcon = 'icons/moon.svg';

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'dark';
body.className = savedTheme;
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
});

function updateThemeIcon() {
    themeIcon.src = body.classList.contains('dark') ? sunIcon : moonIcon;
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carrusel
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('carouselIndicators');

const cards = carouselTrack.querySelectorAll('.project-card');
const totalCards = cards.length;
let currentIndex = 0;
let autoplayInterval;

// Crear indicadores
function createIndicators() {
    for (let i = 0; i < totalCards; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Actualizar indicadores
function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

// Ir a slide
function goToSlide(index) {
    currentIndex = index;
    const offset = -currentIndex * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    updateIndicators();
    resetAutoplay();
}

// Siguiente slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    goToSlide(currentIndex);
}

// Slide anterior
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    goToSlide(currentIndex);
}

// Autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Pausar al hover
carouselTrack.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

carouselTrack.addEventListener('mouseleave', () => {
    startAutoplay();
});

// Inicializar
createIndicators();
startAutoplay();

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('#')[0];
    if (linkPage === currentPage || (currentPage === 'index.html' && linkPage.includes('#'))) {
        link.style.color = '#fff';
        link.style.fontWeight = '600';
    }
});