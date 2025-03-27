document.addEventListener("DOMContentLoaded", () => {
    fetch("db.json")
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById("products");
            const cart = [];
            const cartCount = document.getElementById("cart-count");

            function updateCartCount() {
                cartCount.textContent = cart.length;
            }

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
                    name.style.textDecoration = "line-through";
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
                            name.style.textDecoration = "line-through";
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
