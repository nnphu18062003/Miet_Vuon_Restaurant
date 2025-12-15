function showSection(section) {
    const profileTab = document.getElementById('profile-tab');
    const addressTab = document.getElementById('address-tab');
    const profileContent = document.getElementById('profile-content');
    const addressContent = document.getElementById('address-content');

    if (section === 'profile') {
        profileTab.classList.add('bg-blue-500', 'text-white');
        profileTab.classList.remove('text-gray-700', 'hover:bg-gray-200');

        addressTab.classList.remove('bg-blue-500', 'text-white');
        addressTab.classList.add('text-gray-700', 'hover:bg-gray-200');

        profileContent.classList.remove('hidden');
        addressContent.classList.add('hidden');

    } else if (section === 'address') {
        addressTab.classList.add('bg-blue-500', 'text-white');
        addressTab.classList.remove('text-gray-700', 'hover:bg-gray-200');

        profileTab.classList.remove('bg-blue-500', 'text-white');
        profileTab.classList.add('text-gray-700', 'hover:bg-gray-200');

        addressContent.classList.remove('hidden');
        profileContent.classList.add('hidden');

    }
}

function showAddAddressForm() {
    document.getElementById('address-list').classList.add('hidden');
    document.getElementById('add-address-form').classList.remove('hidden');
}

function hideAddAddressForm() {
    document.getElementById('add-address-form').classList.add('hidden');
    document.getElementById('update-address-form').classList.add('hidden');
    document.getElementById('address-list').classList.remove('hidden');
}


function submitAddressForm() {
    alert('Đã gửi dữ liệu lên server!');
    hideAddAddressForm();
}

function showUpdateAddressForm(addressId, addressLine) {
   
    const updateForm = document.getElementById("update-address-form");
    updateForm.classList.remove("hidden");

  
    const addressList = document.getElementById("address-list");
    addressList.classList.add("hidden");


    updateForm.querySelector('input[name="address_line"]').value = addressLine;
    updateForm.querySelector('input[name="address_id"]').value = addressId;
}


function deleteAddress(addressId) {
    fetch(`account/address/${addressId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert("Xóa địa chỉ thành công!");
            location.reload();
        } else {
            alert("Xóa địa chỉ thất bại!");
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi xóa địa chỉ!");
    });
    
}