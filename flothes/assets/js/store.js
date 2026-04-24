const Store = {
    init() {
        // Initialize default items for testing if empty
        if (!localStorage.getItem('flothes_cart')) {
            localStorage.setItem('flothes_cart', JSON.stringify([
                { id: 'cart-item-1', name: 'Urban Oversized Shirt', price: 349000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop', variant: 'Putih Tulang / M' },
                { id: 'cart-item-2', name: 'Essential Black Tee', price: 169000, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=150&auto=format&fit=crop', variant: 'Hitam / M' }
            ]));
        }
        if (!localStorage.getItem('flothes_wishlist')) {
            localStorage.setItem('flothes_wishlist', JSON.stringify([]));
        }
        if (localStorage.getItem('flothes_isLoggedIn') === null) {
            localStorage.setItem('flothes_isLoggedIn', 'false');
        }
        this.updateUI();
        this.renderCart();
    },
    
    getCart() {
        return JSON.parse(localStorage.getItem('flothes_cart'));
    },
    
    addToCart(itemName) {
        let cart = this.getCart();
        let price = itemName.includes('Shirt') ? 349000 : 169000; 
        let imgUrl = itemName.includes('Shirt') 
            ? 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=150&auto=format&fit=crop';
            
        let newItem = {
            id: `cart-item-${Date.now()}`,
            name: itemName,
            price: price,
            img: imgUrl,
            variant: 'M / Default'
        };
        
        cart.push(newItem);
        localStorage.setItem('flothes_cart', JSON.stringify(cart));
        this.updateUI();
        this.renderCart();
        if(typeof showToast === 'function') showToast(`${itemName} ditambahkan ke keranjang!`);
    },
    
    removeFromCart(itemId) {
        let cart = this.getCart();
        let index = cart.findIndex(i => i.id === itemId);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem('flothes_cart', JSON.stringify(cart));
            this.updateUI();
            this.renderCart();
        }
    },
    
    getWishlist() {
        return JSON.parse(localStorage.getItem('flothes_wishlist'));
    },
    
    toggleWishlist(itemName) {
        let wishlist = this.getWishlist();
        let index = wishlist.indexOf(itemName);
        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(itemName);
        }
        localStorage.setItem('flothes_wishlist', JSON.stringify(wishlist));
        this.updateUI();
        return index === -1; // true if added
    },
    
    isLoggedIn() {
        return localStorage.getItem('flothes_isLoggedIn') === 'true';
    },
    
    setLoggedIn(status) {
        localStorage.setItem('flothes_isLoggedIn', status);
        this.updateUI();
    },
    
    updateUI() {
        const cartCount = this.getCart().length;
        const wishlistCount = this.getWishlist().length;
        
        const cartBadge = document.getElementById('cart-counter');
        const drawerCartCount = document.getElementById('drawer-cart-count');
        if (cartBadge) cartBadge.innerText = cartCount;
        if (drawerCartCount) drawerCartCount.innerText = cartCount;
        
        const wishlistBadge = document.getElementById('wishlist-counter');
        if (wishlistBadge) {
            if (wishlistCount > 0) {
                wishlistBadge.classList.remove('hidden');
                wishlistBadge.innerText = wishlistCount;
            } else {
                wishlistBadge.classList.add('hidden');
            }
        }
        
        const emptyWishlist = document.getElementById('empty-wishlist-state');
        if (emptyWishlist) {
            if (wishlistCount > 0) emptyWishlist.classList.add('hidden');
            else emptyWishlist.classList.remove('hidden');
        }
        
        // Update heart icons on page to reflect wishlist state
        const wishlist = this.getWishlist();
        document.querySelectorAll('button[onclick*="toggleHeart"]').forEach(btn => {
            const icon = btn.querySelector('i');
            const match = btn.getAttribute('onclick').match(/toggleHeart\(this, '(.*?)'\)/);
            if(match && match[1]) {
                const itemName = match[1];
                if(wishlist.includes(itemName)) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                    btn.classList.add('text-red-500');
                    btn.classList.remove('text-gray-400');
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                    btn.classList.remove('text-red-500');
                    btn.classList.add('text-gray-400');
                }
            }
        });
    },
    
    renderCart() {
        const cartContainer = document.getElementById('cart-items-container');
        if(!cartContainer) return;
        
        const cart = this.getCart();
        const emptyState = document.getElementById('empty-cart-state');
        
        // Remove existing items except empty state
        Array.from(cartContainer.children).forEach(child => {
            if(child.id !== 'empty-cart-state') child.remove();
        });
        
        if(cart.length === 0) {
            if(emptyState) emptyState.classList.remove('hidden');
            document.getElementById('cart-subtotal').innerText = 'Rp 0';
            return;
        }
        
        if(emptyState) emptyState.classList.add('hidden');
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price;
            const itemHTML = `
                <div class="flex gap-4 cart-item mb-4" id="${item.id}">
                    <img src="${item.img}" class="w-20 h-24 object-cover border border-gray-100">
                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start">
                                <h4 class="font-bold text-sm leading-tight text-brand-900">${item.name}</h4>
                                <button onclick="Store.removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">${item.variant}</p>
                        </div>
                        <div class="flex justify-between items-end mt-2">
                            <div class="flex items-center border border-gray-200 rounded">
                                <button class="px-2 py-0.5 text-gray-500 hover:bg-gray-100">-</button><span class="px-2 text-xs font-medium">1</span><button class="px-2 py-0.5 text-gray-500 hover:bg-gray-100">+</button>
                            </div>
                            <p class="font-bold text-sm">Rp ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML('afterbegin', itemHTML);
        });
        
        const subtotalEl = document.getElementById('cart-subtotal');
        if(subtotalEl) subtotalEl.innerText = \`Rp \${subtotal.toLocaleString('id-ID')}\`;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    // Expose addToCart globally for inline onclick handlers
    window.addToCart = (name) => Store.addToCart(name);
});
