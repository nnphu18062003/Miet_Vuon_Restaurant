const search = document.querySelector("[form-search]");
console.log(search);

if(search){
    search.addEventListener("submit",async (e) =>  {
        e.preventDefault();
        const searchValue = search.querySelector("[name='keyword']").value;
        // const baseUrl = '/admin/products/search';
        const searchParams = new URLSearchParams();
        
        if(searchValue) {
            searchParams.set("keyword", searchValue);
        }
        if(!searchValue.trim()) {
            window.location.href = '/admin/products';
            return;
        }
        const searchUrl = `/admin/products/search?keyword=${encodeURIComponent(searchValue)}`;
        window.location.href = searchUrl;
    });
}

