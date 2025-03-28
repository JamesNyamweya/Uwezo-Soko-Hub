document.addEventListener("DOMContentLoaded", () => {
    fetch("db.json")
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById("products");
            const cart = [];
            const cartCount = document.getElementById("cart-count");
            const cartButton = document.getElementById("cart-button");
            const cartPopup = document.getElementById("cart-popup");
            const cartItemsList = document.getElementById("cart-items");
            const closeCartButton = document.getElementById("close-cart");
            const cartTotal = document.getElementById("cart-total");
            const searchInput = document.getElementById("search-bar");
            const categoryDropdown = document.getElementById("category-filter");

            function updateCartCount() {
                cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            }

            function calculateTotal() {
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cartTotal.textContent = `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(total)}`;
            }

            function renderCart() {
                cartItemsList.innerHTML = "";
                cart.forEach((item, index) => {
                    const cartItem = document.createElement("li");
                    cartItem.textContent = `${item.name} (x${item.quantity}) - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(item.price * item.quantity)}`;

                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove One";
                    removeButton.addEventListener("click", () => {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            cart.splice(index, 1);
                        }
                        updateCartCount();
                        increaseStock(item);
                        renderCart();
                        calculateTotal();
                    });

                    cartItem.appendChild(removeButton);
                    cartItemsList.appendChild(cartItem);
                });
                calculateTotal();
            }

            function increaseStock(item) {
                const product = data.products.find(p => p.id === item.id);
                if (product) {
                    product.stock++;
                    
                    const stockElement = document.querySelector(`[data-id='${product.id}']`).parentElement.querySelector(".stock-info");
                    stockElement.textContent = `Stock: ${product.stock}`;

                    if (product.stock > 0) {
                        const soldOutMessage = document.querySelector(`[data-id='${product.id}']`).parentElement.querySelector(".sold-out-message");
                        if (soldOutMessage) {
                            soldOutMessage.remove();
                        }
                        document.querySelector(`[data-id='${product.id}']`).disabled = false;
                    }
                }
            }

            cartButton.addEventListener("click", () => {
                cartPopup.style.display = "block";
                renderCart();
            });

            closeCartButton.addEventListener("click", () => {
                cartPopup.style.display = "none";
            });

            function renderProducts(products) {
                productsContainer.innerHTML = "";
                products.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product");

                    const img = document.createElement("img");
                    img.src = product.image;
                    img.alt = product.name;

                    const name = document.createElement("h3");
                    name.textContent = product.name;

                    const category = document.createElement("p");
                    category.textContent = `Category: ${product.category}`;

                    const price = document.createElement("p");
                    price.textContent = `KES ${product.price}`;

                    const stock = document.createElement("p");
                    stock.classList.add("stock-info");
                    stock.textContent = `Stock: ${product.stock}`;

                    const button = document.createElement("button");
                    button.classList.add("add-to-cart");
                    button.textContent = "Add to Cart";
                    button.setAttribute("data-id", product.id);

                    const soldOutMessage = document.createElement("p");
                    soldOutMessage.textContent = "Sold Out";
                    soldOutMessage.style.color = "red";
                    soldOutMessage.classList.add("sold-out-message");

                    if (product.stock === 0) {
                        button.disabled = true;
                        productCard.appendChild(soldOutMessage);
                    }

                    button.addEventListener("click", () => {
                        if (product.stock > 0) {
                            const cartItem = cart.find(item => item.id === product.id);
                            if (cartItem) {
                                cartItem.quantity++;
                            } else {
                                cart.push({ ...product, quantity: 1 });
                            }
                            updateCartCount();
                            product.stock--;
                            stock.textContent = `Stock: ${product.stock}`;

                            if (product.stock === 0) {
                                button.disabled = true;
                                productCard.appendChild(soldOutMessage);
                            }
                        }
                    });

                    productCard.appendChild(img);
                    productCard.appendChild(name);
                    productCard.appendChild(category);
                    productCard.appendChild(price);
                    productCard.appendChild(stock);
                    productCard.appendChild(button);

                    productsContainer.appendChild(productCard);
                });
            }

            function searchProducts() {
                const query = searchInput.value.toLowerCase();
                const filteredProducts = data.products.filter(product => product.name.toLowerCase().includes(query));
                renderProducts(filteredProducts);
                showNotFoundMessage(filteredProducts.length === 0);
            }

            function filterByCategory() {
                const selectedCategory = categoryDropdown.value;
                let filteredProducts = data.products;

                if (selectedCategory !== "all") {
                    filteredProducts = data.products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
                }

                renderProducts(filteredProducts);
                showNotFoundMessage(filteredProducts.length === 0);
            }

            function showNotFoundMessage(isNotFound) {
                let notFoundMessage = document.getElementById("not-found-message");

                if (isNotFound) {
                    if (!notFoundMessage) {
                        notFoundMessage = document.createElement("p");
                        notFoundMessage.id = "not-found-message";
                        notFoundMessage.textContent = "Item not found";
                        notFoundMessage.style.color = "red";
                        notFoundMessage.style.textAlign = "center";
                        productsContainer.appendChild(notFoundMessage);
                    }
                } else {
                    if (notFoundMessage) {
                        notFoundMessage.remove();
                    }
                }
            }

            renderProducts(data.products);

            searchInput.addEventListener("input", searchProducts);
            categoryDropdown.addEventListener("change", filterByCategory);
        })
        .catch(error => console.error("Error fetching products:", error));
});

