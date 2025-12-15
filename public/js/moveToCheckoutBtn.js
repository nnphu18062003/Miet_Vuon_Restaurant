document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("#place-order");
    buttons.forEach(button => {
        button.addEventListener("click", async (event) => {
            window.location.href = "/checkout"; 
        });
    });
});
