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
            const searchInput = document.getElementById("search");

            function updateCartCount() {
                cartCount.textContent = cart.length;
            }

            function calculateTotal() {
                const total = cart.reduce((sum, item) => sum + item.price, 0);
                cartTotal.textContent = `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(total)}`;
            }

            function renderCart() {
                cartItemsList.innerHTML = "";
                cart.forEach((item, index) => {
                    const cartItem = document.createElement("li");
                    cartItem.textContent = `${item.name} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(item.price)}`;

                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.addEventListener("click", () => {
                        cart.splice(index, 1);
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

                    if (product.stock === 0) {
                        const soldOutMessage = document.createElement("p");
                        soldOutMessage.textContent = "Sold Out";
                        soldOutMessage.style.color = "red";
                        soldOutMessage.classList.add("sold-out-message");
                        button.disabled = true;
                        productCard.appendChild(soldOutMessage);
                    }

                    button.addEventListener("click", () => {
                        if (product.stock > 0) {
                            cart.push(product);
                            updateCartCount();
                            product.stock--;
                            stock.textContent = `Stock: ${product.stock}`;
                            if (product.stock === 0) {
                                const soldOutMessage = document.createElement("p");
                                soldOutMessage.textContent = "Sold Out";
                                soldOutMessage.style.color = "red";
                                soldOutMessage.classList.add("sold-out-message");
                                productCard.appendChild(soldOutMessage);
                                button.disabled = true;
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
                const productCards = document.querySelectorAll(".product");
                let found = false;

                productCards.forEach(card => {
                    const productName = card.querySelector("h3").textContent.toLowerCase();
                    if (productName.includes(query) || query === "") {
                        card.style.display = "block";
                        found = true;
                    } else {
                        card.style.display = "none";
                    }
                });

                let notFoundMessage = document.getElementById("not-found-message");
                if (!found) {
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
        })
        .catch(error => console.error("Error fetching products:", error));
});
