const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const carouselInner = document.getElementById('carousel-inner');
let currentIndex = 0;

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : 2;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < 2) ? currentIndex + 1 : 0;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
});