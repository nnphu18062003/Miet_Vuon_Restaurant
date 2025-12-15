async function updateFilter(urlParamKey, urlParamValue) {

  const params = new URLSearchParams(window.location.search);

  params.set(urlParamKey, urlParamValue);


  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);
 

  await fetchAndRenderOrderPage(newURL);
}



async function fetchAndRenderOrderPage(newURL) {
  try {
    const response = await fetch(newURL, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!data.error) {
          updateOrderList(data.orderList);
        } else {
          console.error('Error fetching data:', data.error);
        }
      } else {
        console.error('Unexpected response type:', await response.text());
      }
    } else {
      console.error('Server error:', response.status);
    }
  } catch (error) {
    console.error('Error in AJAX request:', error);
  }
}

function updateOrderList(products) {
  const productContainer = document.querySelector('.container.mx-auto.my-6.space-y-6'); // Class container sản phẩm
  productContainer.innerHTML = ''; // Xóa danh sách cũ

  // Render danh sách sản phẩm mới
  products.forEach((order) => {
    let orderHTML = `
      <div class="main-box border border-gray-200 rounded-xl w-full">
        <div class="flex flex-col lg:flex-row justify-between px-6 pb-6 border-b border-gray-200">
          <div>
            <p class="font-semibold text-base text-black">
              Order Id: <span class="text-indigo-600 font-medium">#${order.order_code}</span>
            </p>
            <p class="font-semibold text-base text-black">
              Status: <span class="text-emerald-600">${order.order_status}</span>
            </p>
          </div>
          <div class="mt-4">
            ${order.status_payment === 'Unpaid' ? `
              <p class="font-semibold text-base text-black">
                <span class="text-red-600 font-medium text-2xl">${order.status_payment}</span>
              </p>` : `
              <p class="font-semibold text-base text-black">
                <span class="text-green-600 font-medium text-2xl">${order.status_payment}</span>
              </p>`}
          </div>
        </div>

        <div class="w-full px-6">
          ${order.products.map(item => `
          <div class="flex flex-row items-center py-6 border-b border-gray-200 gap-6">
            <!-- Product Image -->
            <div class="w-28 h-28">
              <img src="${item.product_url}" alt="${item.name} image" class="w-full h-full rounded-lg object-cover">
            </div>

            <!-- Product Details -->
            <div class="flex-1 grid grid-cols-5 gap-4">
              <div class="col-span-3">
                <h3 class="font-semibold text-xl text-black mb-2">${item.name}</h3>
                <p class="text-gray-500">Qty: ${item.quantity}</p>
              </div>
              <div class="col-span-2 text-right">
                <p class="font-medium text-sm text-black">Price</p>
                <p class="font-semibold text-lg text-indigo-600">$${item.price}</p>
              </div>
            </div>
          </div>`).join('')}
        </div>

      

        <div class="w-full border-t border-gray-200 px-6 py-6 flex flex-col lg:flex-row items-center justify-between">
            <div>
            <p class="font-semibold text-lg text-black mt-4 lg:mt-0">
              Total Price: <span class="text-indigo-600">$${order.total}</span>
            </p>
          </div>
          <div>
            <button class="bg-gray-200 p-4 rounded-lg">
              <a href="/checkout/payment?order_code=${order.order_code} " class="text-red-500 font-semibold" onclick="event.preventDefault(); updateFilter('status', 'Canceled'); window.location.href=this.href;">Go To Payment</a>
            </button>
            
        </div>
        </div>
      </div>`;

    productContainer.insertAdjacentHTML('beforeend', orderHTML);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");

  function setActiveLink(clickedLink) {
  
    links.forEach((link) => link.classList.remove("text-red-500"));

    clickedLink.classList.add("text-red-500");
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      setActiveLink(event.target);
    });
  });
});