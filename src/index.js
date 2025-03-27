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

            function updateCartCount() {
                cartCount.textContent = cart.length;
            }

            function calculateTotal() {
                const total = cart.reduce((sum, item) => sum + item.price, 0);
                document.getElementById("cart-total").textContent = `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(total)}`;
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
                    const stockElement = document.querySelector(`[data-id='${product.id}']`).parentElement.querySelector("p:nth-of-type(2)");
                    stockElement.textContent = `Stock: ${product.stock}`;
                    
                    if (product.stock > 0) {
                        const soldOutMessage = document.querySelector(`[data-id='${product.id}']`).parentElement.querySelector("p[style='color: red;']");
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

            data.products.forEach(product => {
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
                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'KES',
                }).format(product.price);
                price.textContent = formattedPrice;
                
                const stock = document.createElement("p");
                stock.textContent = `Stock: ${product.stock}`;
                
                const button = document.createElement("button");
                button.classList.add("add-to-cart");
                button.textContent = "Add to Cart";
                button.setAttribute("data-id", product.id);
                
                if (product.stock === 0) {
                    const soldOutMessage = document.createElement("p");
                    soldOutMessage.textContent = "Sold Out";
                    soldOutMessage.style.color = "red";
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
        })
        .catch(error => console.error("Error fetching products:", error));
});
