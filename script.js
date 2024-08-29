document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const filterPrice = document.getElementById('filter-price');
    const filterModel = document.getElementById('filter-model');
    const filterCategory = document.getElementById('filter-category');
    const productCards = document.querySelectorAll('.product-card');
    const cartModalBody = document.getElementById('cart-modal-body');

    // Initialize cart from local storage or empty array if not found
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the product display based on filters
    function filterProducts() {
        const priceFilter = filterPrice.value;
        const modelFilter = filterModel.value;
        const categoryFilter = filterCategory.value;

        productCards.forEach(card => {
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardModel = card.getAttribute('data-model');
            const cardCategory = card.getAttribute('data-category');

            // Check if the card should be shown based on filters
            let show = true;

            // Price filter
            if (priceFilter !== 'all') {
                const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
                if (cardPrice < minPrice || (maxPrice && cardPrice > maxPrice)) {
                    show = false;
                }
            }

            // Model filter
            if (modelFilter !== 'all' && cardModel !== modelFilter) {
                show = false;
            }

            // Category filter
            if (categoryFilter !== 'all' && cardCategory !== categoryFilter) {
                show = false;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    // Function to update the cart modal display
    function updateCartModal() {
        if (cart.length === 0) {
            cartModalBody.innerHTML = 'Your cart is empty.';
        } else {
            let cartHtml = '<h5 class="modal-title">Items</h5><ul class="list-group">';
            let totalCost = 0;

            // Generate HTML for each item in the cart
            cart.forEach((item, index) => {
                totalCost += item.price;
                cartHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    ${item.name} - R${item.price.toFixed(2)}
                    <button class="btn btn-danger btn-sm ms-2" data-index="${index}">Remove</button>
                </li>`;
            });

            cartHtml += `</ul><p class="mt-3">Total: R${totalCost.toFixed(2)}</p>`;
            cartModalBody.innerHTML = cartHtml;
        }
    }

    // Function to save the cart to local storage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to add an item to the cart
    function addToCart(event) {
        if (!event.target.classList.contains('add-to-cart')) return;

        const card = event.target.closest('.product-card');
        const name = card.querySelector('.card-title').textContent;
        const price = parseFloat(card.querySelector('.card-text').textContent.replace('R', '').replace(',', ''));

        cart.push({ name, price });
        saveCartToLocalStorage();
        updateCartModal();
    }

    // Function to remove an item from the cart
    function removeFromCart(event) {
        if (!event.target.classList.contains('btn-danger')) return;

        const index = event.target.getAttribute('data-index');
        cart.splice(index, 1);
        saveCartToLocalStorage();
        updateCartModal();
    }

    // Function to clear all items from the cart
    function clearCart() {
        cart = [];
        saveCartToLocalStorage();
        updateCartModal();
    }

    // Event listeners
    filterPrice.addEventListener('change', filterProducts);
    filterModel.addEventListener('change', filterProducts);
    filterCategory.addEventListener('change', filterProducts);
    document.addEventListener('click', addToCart);
    cartModalBody.addEventListener('click', removeFromCart);

    document.getElementById('cartModal').addEventListener('shown.bs.modal', updateCartModal);
    document.querySelector('.btn-secondary').addEventListener('click', clearCart);
});
