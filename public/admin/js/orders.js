const viewDetail = document.querySelectorAll('[view-detail]');
const modal = document.querySelector("#orderDetailsModal");
const modalContent = modal.querySelector(".bg-white");

viewDetail.forEach((btn) => {
    btn.addEventListener('click', async () => {
        const row = btn.closest('tr');
        const orderId = row.querySelector('td:first-child').getAttribute("order-id");
        console.log(orderId);

        try {
            const response = await fetch(`/admin/orders/${orderId}/details`);
            const data = await response.json();

            if (data.ok) {
                const details = data.details;
                const orderItemsContainer = document.getElementById('orderItems');
                orderItemsContainer.innerHTML = '';

                // Display order items
                details.forEach(item => {
                    const itemElement = `
                        <div class="flex justify-between items-center p-4 hover:bg-gray-50">
                            <div class="flex items-center space-x-4">
                                <img src="${item.product_url || '/images/default-food.png'}" 
                                     alt="${item.product_name}" 
                                     class="w-16 h-16 object-cover rounded-lg">
                                <div>
                                    <p class="font-medium">${item.product_name}</p>
                                    <p class="text-sm text-gray-500">Số lượng: ${item.quantity}</p>
                                    <div class="space-y-1">
                                        <p class="text-sm ${item.is_discount_active ? 'line-through text-gray-400' : 'text-gray-600'}">
                                            Giá gốc: ${item.original_price.toLocaleString('vi-VN')}VNĐ
                                        </p>
                                        ${item.is_discount_active ? `
                                            <p class="text-sm text-red-500">
                                                Giảm giá: ${item.discount}%
                                            </p>
                                            <p class="text-sm text-green-600">
                                                Giá sau giảm: ${item.final_price.toLocaleString('vi-VN')}VNĐ
                                            </p>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-medium">
                                    ${item.subtotal.toLocaleString('vi-VN')}VNĐ
                                </p>
                            </div>
                        </div>
                    `;
                    orderItemsContainer.innerHTML += itemElement;
                });

                // Update other modal content
                document.getElementById('orderIdDetail').textContent = details[0].order_code;
                document.getElementById('orderStatus').textContent = details[0].status;
                document.getElementById('customerName').textContent = details[0].name;
                document.getElementById('customerEmail').textContent = details[0].email;
                document.getElementById('customerPhone').textContent = details[0].phone;
                // document.getElementById('customerAddress').textContent = details[0].address;

                document.getElementById('customerAddress').textContent = details[0].address;
                document.getElementById('deliveryFee').textContent = '0VNĐ';
                document.getElementById('orderTotal').textContent =`${parseInt(details[0].total).toLocaleString('vi-VN')} VNĐ`;

                // Show modal
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 50);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// Close modal with animation
document.getElementById('closeOrderDetails').addEventListener('click', () => {
    modalContent.classList.add('scale-95', 'opacity-0');
    modalContent.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
});

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        document.getElementById('closeOrderDetails').click();
    }
});

// Link to update order
function showToast(message, type = 'success') {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-4';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `
        transform translate-x-full
        flex items-center p-4 rounded-lg shadow-lg
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
        text-white min-w-[300px]
    `;

    // Add content
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        <span class="flex-1">${message}</span>
    `;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('transition-transform', 'duration-300');
        toast.classList.remove('translate-x-full');
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            container.removeChild(toast);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
}

const updateModal = document.querySelector("#updateOrderModal");
const updateModalContent = updateModal.querySelector(".bg-white");
const updateButtons = document.querySelectorAll('[update-detail]');
const STATUS_TRANSLATIONS = {
    'Pending': 'Chờ xác nhận',
    'Confirmed': 'Đã xác nhận',
    'Delivered': 'Đã giao cho ĐVVC',
    'In Transit': 'Đang vận chuyển',
    'Completed': 'Hoàn thành',
    'Canceled': 'Đã hủy'
};

const PAYMENT_STATUS_TRANSLATIONS = {
    'Paid': 'Đã thanh toán',
    'Unpaid': 'Chưa thanh toán',
};
const STATUS_COLORS = {
    'Chờ xác nhận': 'bg-yellow-100 text-yellow-800',
    'Đã xác nhận': 'bg-blue-100 text-blue-800',
    'Đã giao cho ĐVVC': 'bg-purple-100 text-purple-800',
    'Đang vận chuyển': 'bg-indigo-100 text-indigo-800',
    'Hoàn thành': 'bg-green-100 text-green-800',
    'Đã hủy': 'bg-red-100 text-red-800'
};

const PAYMENT_COLORS = {
    'Chưa thanh toán': 'bg-red-100 text-red-800',
    'Đã thanh toán': 'bg-green-100 text-green-800',

};
const STATUS_MAP = {
    'Pending': 'Chờ xác nhận',
    'Confirmed': 'Đã xác nhận',
    'Delivered': 'Đã giao cho ĐVVC',
    'In Transit': 'Đang vận chuyển',
    'Completed': 'Hoàn thành',
    'Canceled': 'Đã hủy',
    'Chờ xác nhận': 'Pending',
    'Đã xác nhận': 'Confirmed',
    'Đã giao cho ĐVVC': 'Delivered',
    'Đang vận chuyển': 'In Transit',
    'Hoàn thành': 'Completed',
    'Đã hủy': 'Canceled'
};

const PAYMENT_STATUS_MAP = {
    'Paid': 'Đã thanh toán',
    'Unpaid': 'Chưa thanh toán',
    'Đã thanh toán': 'Paid',
    'Chưa thanh toán': 'Unpaid',
};
updateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const orderId = btn.getAttribute('order-id');
        const currentStatus = row.querySelector('td:nth-child(5) span').textContent.trim();
        const currentPaymentStatus = row.querySelector('td:nth-child(6) span').textContent.trim();
        const orderCode = row.querySelector('td:first-child').textContent.trim();

        document.getElementById('updateOrderId').textContent = orderCode;
        document.getElementById('updateOrderIdInput').value = orderId;
        document.getElementById('orderStatusSelect').value = STATUS_MAP[currentStatus];
        document.getElementById('paymentStatusSelect').value = PAYMENT_STATUS_MAP[currentPaymentStatus];

        updateModal.classList.remove('hidden');
        updateModal.classList.add('flex');
        setTimeout(() => {
            updateModalContent.classList.remove('scale-95', 'opacity-0');
            updateModalContent.classList.add('scale-100', 'opacity-100');
        }, 50);
    });
});

document.getElementById('updateOrderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const orderId = document.getElementById('updateOrderIdInput').value;
    const vietnameseStatus = document.getElementById('orderStatusSelect').value;
    const vietnamesePaymentStatus = document.getElementById('paymentStatusSelect').value;

    const newStatus = STATUS_MAP[vietnameseStatus];
    const newPaymentStatus = PAYMENT_STATUS_MAP[vietnamesePaymentStatus];

    console.log("orderId: ", orderId);
    console.log("newStatus: ", newStatus);
    console.log("newPaymentStatus: ", newPaymentStatus);

    try {
        const response = await fetch(`/admin/orders/${orderId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: newStatus,
                payment_status: newPaymentStatus
            })
        });

        const data = await response.json();

        if (data.ok) {
            showToast('Cập nhật đơn hàng thành công!', 'success');
            document.getElementById('closeUpdateModal').click();
             setTimeout(() => window.location.reload(), 1500);
        } else {
            throw new Error(data.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra!', 'error');
    }
});

// Close modal handlers
document.getElementById('closeUpdateModal').addEventListener('click', () => {
    updateModalContent.classList.add('scale-95', 'opacity-0');
    updateModalContent.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        updateModal.classList.add('hidden');
        updateModal.classList.remove('flex');
    }, 300);
});

document.getElementById('cancelUpdate').addEventListener('click', () => {
    document.getElementById('closeUpdateModal').click();
});

updateModal.addEventListener('click', (e) => {
    if (e.target === updateModal) {
        document.getElementById('closeUpdateModal').click();
    }
});

// search form
// Add search functionality
const searchInput = document.querySelector('input[placeholder="Tìm kiếm mã đơn hàng..."]');
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();

    // const baseUrl = '/admin/orders/search';
    const searchParams = new URLSearchParams();

    if (searchValue) {
        searchParams.set("keyword", searchValue);
    }
    if (!searchValue.trim()) {
        window.location.href = '/admin/orders';
        return;
    }

    // Construct search URL
    const searchUrl = `/admin/orders/search?keyword=${encodeURIComponent(searchValue)}`;
    window.location.href = searchUrl;
});

// filter orders by status
const filterStatus = document.querySelector('[filter-status]');
const filterPayment = document.querySelector('[filter-payment]');
const filterButton = document.querySelector('[filter-button]');
const selectAll = document.querySelector('[select-all]');

// Initialize filter values from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status')) filterStatus.value = urlParams.get('status');
if (urlParams.get('payment_status')) filterPayment.value = urlParams.get('payment_status');

// Handle filter submission
function handleFilter() {
    const status = filterStatus.value;
    const payment = filterPayment.value;

    if (!status && !payment) {
        window.location.href = '/admin/orders';
        return;
    }

    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    if (payment) searchParams.append('payment_status', payment);

    window.location.href = `/admin/orders/filter?${searchParams.toString()}`;
}

filterButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleFilter();
});

selectAll.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/admin/orders';
});

// Reset filters
selectAll.addEventListener('click', (e) => {
    e.preventDefault();
    filterStatus.selectedIndex = 0;
    filterPayment.selectedIndex = 0;
    window.location.href = '/admin/orders';
});



// Delete Order Modal
const deleteModal = document.querySelector("#deleteOrderModal");
const deleteModalContent = deleteModal.querySelector(".bg-white");
const deleteButtons = document.querySelectorAll('[cancel-detail]');
let orderToDelete = null;

deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const orderId = row.querySelector('td:first-child').getAttribute('order-id');
        const orderCode = row.querySelector('td:first-child').textContent;

        orderToDelete = orderId;
        console.log(orderToDelete);
        document.getElementById('deleteOrderId').textContent = orderCode;

        // Show modal with animation
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        setTimeout(() => {
            deleteModalContent.classList.remove('scale-95', 'opacity-0');
            deleteModalContent.classList.add('scale-100', 'opacity-100');
        }, 50);
    });
});

document.getElementById('confirmDelete').addEventListener('click', async () => {
    try {
        const response = await fetch(`/admin/orders/${orderToDelete}/delete`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Đã hủy đơn hàng thành công!', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast('Không thể hủy đơn hàng!', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Đã xảy ra lỗi!', 'error');
    }
});

document.getElementById('cancelDelete').addEventListener('click', () => {
    deleteModalContent.classList.add('scale-95', 'opacity-0');
    deleteModalContent.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
    }, 300);
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        document.getElementById('cancelDelete').click();
    }
});