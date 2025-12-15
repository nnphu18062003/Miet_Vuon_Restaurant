/**
 * 
 * @param {number} originalPrice 
 * @param {number} discount 
 * @returns the new price after applying the discount, rounded to 2 decimal places
 * @throws {TypeError} if the input is not a number
 * @throws {RangeError} if the discount is not between 0 and 100
 */
function calculateDiscountedPrice(originalPrice, discount) {
  if(isNaN(originalPrice) || isNaN(discount)) {
    throw new TypeError("Invalid input");
  }

  if(discount < 0 || discount > 100) {
    throw new RangeError("Discount must be between 0 and 100");
  }
  const newPrice = originalPrice - (originalPrice * discount / 100);
  return newPrice.toFixed(2);

}

module.exports = {
  calculateDiscountedPrice,
}