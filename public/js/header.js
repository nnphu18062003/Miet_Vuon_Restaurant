document.addEventListener('DOMContentLoaded', function () {
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
  
    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener('click', function () {
        dropdownMenu.classList.toggle('hidden');
      });
  
      // Close the dropdown menu when clicking outside of it
      document.addEventListener('click', function (event) {
        if (!dropdownTrigger.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.add('hidden');
        }
      });
    }
  });