// Select elements
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityDisplay = document.getElementById('quantity');

// Initial quantity
let quantity = parseInt(quantityDisplay.textContent);

// Event listeners
decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) { // Prevent quantity from going below 1
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
});