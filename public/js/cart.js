document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById('product-list'); 
  const userId = document.getElementById("user-id").value;
  console.log("User ID:", userId);

  productContainer.addEventListener("click", async (event) => {
    if (event.target && event.target.matches(".add-to-cart-btn")) {
      if (userId == "") {
        window.location.href = "/login"; 
        return;
      }
      event.preventDefault();
      const productId = event.target.getAttribute("data-product-id");
      console.log(productId);
      const quantityElement = document.getElementById('quantity');
      const quantity = quantityElement ? quantityElement.innerText : 1;
      const price = event.target.getAttribute("data-product-price");

      try {
        const response = await fetch("/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            quantity: quantity,
            price: price,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message); 
        } else {
          alert(result.message); 
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Error adding product to cart");
      }
    }
  });
});