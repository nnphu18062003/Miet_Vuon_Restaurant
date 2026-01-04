// Product Management JavaScript
let currentProductId = null;

// Open Add Product Modal
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Thêm món mới';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImagePreview').src = '/admin/images/default-food.png';
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
}

// Open Edit Product Modal
function editProduct(productId) {
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    if (!productCard) return;

    document.getElementById('modalTitle').textContent = 'Chỉnh sửa món';
    document.getElementById('productId').value = productId;
    document.getElementById('productName').value = productCard.dataset.name;
    document.getElementById('productDescription').value = productCard.dataset.description;
    document.getElementById('productPrice').value = productCard.dataset.price;
    document.getElementById('productCategory').value = productCard.dataset.category;
    document.getElementById('productDiscount').value = productCard.dataset.discount || 0;
    document.getElementById('discountActive').checked = productCard.dataset.discountActive === 'true';
    document.getElementById('productStatus').checked = productCard.dataset.status === 'true';
    document.getElementById('bestSeller').checked = productCard.dataset.bestseller === 'true';
    document.getElementById('customLabel').value = productCard.dataset.customlabel || '';
    document.getElementById('productImagePreview').src = productCard.dataset.img;

    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
}

// Close Product Modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

// Open Delete Modal
function deleteProduct(productId) {
    currentProductId = productId;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex';
}

// Close Delete Modal
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    currentProductId = null;
}

// Confirm Delete
async function confirmDelete() {
    if (!currentProductId) return;

    try {
        const response = await fetch(`/admin/products/${currentProductId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.ok) {
            Snackbar.success('Xóa món thành công!');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            Snackbar.error(data.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Error:', error);
        Snackbar.error('Không thể xóa món');
    }

    closeDeleteModal();
}

// Handle Product Form Submit
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productId = document.getElementById('productId').value;
    const url = productId ? `/admin/products/${productId}` : '/admin/products';
    const method = productId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
        }

        if (data.ok) {
            Snackbar.success(productId ? 'Cập nhật món thành công!' : 'Thêm món thành công!');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            Snackbar.error(data.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Error details:', error);
        Snackbar.error('Lỗi: ' + error.message);
    }
});

// Image Preview
document.getElementById('productImage')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('productImagePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Search & Filter
function applyFilters() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    window.location.href = `/admin/products?${params.toString()}`;
}

// Add Product Button
document.querySelector('.js-add')?.addEventListener('click', openAddProductModal);

// Close modals on outside click
document.getElementById('productModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

document.getElementById('deleteModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Load categories into dropdown on page load
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Get categories from page data (passed from server)
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && categoryFilter.options.length > 1) {
            // Categories already loaded in filter, copy to modal
            const productCategory = document.getElementById('productCategory');
            if (productCategory) {
                // Clear existing options except first one
                productCategory.innerHTML = '<option value="">Chọn danh mục</option>';

                // Copy options from filter (skip first "All" option)
                for (let i = 1; i < categoryFilter.options.length; i++) {
                    const option = categoryFilter.options[i];
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.textContent;
                    productCategory.appendChild(newOption);
                }
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
});
