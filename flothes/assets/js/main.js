const UI = {
    init() {
        this.observeRevealElements();
        this.startTypeEffect();
        
        const searchInput = document.getElementById('global-search-input');
        if(searchInput) searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') { e.preventDefault(); this.executeSearch(); } });
        
        const aiInput = document.getElementById('ai-stylist-input');
        if(aiInput) aiInput.addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if(typeof window.generateStyleAdvice === 'function') window.generateStyleAdvice(); } });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
                this.closeAuthModal();
                if(typeof closeReviewModal === 'function') closeReviewModal();
                this.closeAIStylist(); 
                const cartDrawer = document.getElementById('cart-drawer');
                if(cartDrawer && cartDrawer.classList.contains('open')) this.toggleCartDrawer();
                const wishlistDrawer = document.getElementById('wishlist-drawer');
                if(wishlistDrawer && wishlistDrawer.classList.contains('open')) this.toggleWishlistDrawer();
                const filterDrawer = document.getElementById('mobile-filter-drawer');
                if(filterDrawer && filterDrawer.classList.contains('open')) this.toggleMobileFilter();
            }
        });

        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (nav && nav.style.display !== 'none') {
                if (window.scrollY > 50) { nav.classList.add('shadow-sm', 'bg-white/95'); nav.classList.remove('bg-white/70'); } 
                else { nav.classList.remove('shadow-sm', 'bg-white/95'); nav.classList.add('bg-white/70'); }
            }
        });
    },

    observeRevealElements() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach((element) => {
            element.classList.remove('active');
            revealObserver.observe(element);
        });
    },

    showToast(message) {
        const toast = document.getElementById('toast-container');
        const msgEl = document.getElementById('toast-msg');
        if(toast && msgEl) {
            msgEl.innerText = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    },
    
    checkAuthAndNavigate() {
        if(Store.isLoggedIn()) { window.location.href = 'profile.html'; } 
        else { this.toggleAuthModal(); }
    },
    
    processLogout() {
        Store.setLoggedIn('false');
        this.showToast("Anda telah keluar.");
        setTimeout(() => window.location.href = 'index.html', 1000);
    },

    toggleAuthModal() {
        const modal = document.getElementById('auth-modal');
        if(modal) {
            if(modal.classList.contains('inactive')) {
                modal.classList.remove('inactive'); modal.classList.add('active');
            } else {
                modal.classList.remove('active'); modal.classList.add('inactive');
            }
        }
    },

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if(modal) { modal.classList.remove('active'); modal.classList.add('inactive'); }
    },

    switchAuthTab(tab) {
        const formLogin = document.getElementById('form-login');
        const formRegister = document.getElementById('form-register');
        const btnLogin = document.getElementById('tab-btn-login');
        const btnReg = document.getElementById('tab-btn-register');

        if(tab === 'login') {
            formLogin.classList.replace('hidden', 'block');
            formRegister.classList.replace('block', 'hidden');
            btnLogin.className = "flex-1 py-3 text-center font-bold border-b-2 border-brand-900 text-brand-900";
            btnReg.className = "flex-1 py-3 text-center font-bold text-gray-400 border-b-2 border-transparent";
        } else {
            formRegister.classList.replace('hidden', 'block');
            formLogin.classList.replace('block', 'hidden');
            btnReg.className = "flex-1 py-3 text-center font-bold border-b-2 border-brand-900 text-brand-900";
            btnLogin.className = "flex-1 py-3 text-center font-bold text-gray-400 border-b-2 border-transparent";
        }
    },

    processLogin() {
        const btn = document.getElementById('btn-login');
        if(!btn) return;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        setTimeout(() => {
            Store.setLoggedIn('true');
            btn.innerHTML = 'Masuk Akun';
            this.closeAuthModal();
            window.location.href = 'profile.html';
        }, 1500);
    },

    toggleWishlistDrawer() {
        const drawer = document.getElementById('wishlist-drawer');
        const overlay = document.getElementById('wishlist-overlay');
        if(!drawer || !overlay) return;
        if (drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        } else {
            overlay.classList.remove('hidden'); void overlay.offsetWidth;
            overlay.classList.remove('opacity-0');
            drawer.classList.add('open');
        }
    },

    toggleHeart(btnElement, itemName) {
        const added = Store.toggleWishlist(itemName);
        if(added) {
            this.showToast(`${itemName} dimasukkan ke Wishlist ❤️`);
        }
    },

    toggleCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-drawer-overlay');
        if(!drawer || !overlay) return;
        if (drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        } else {
            overlay.classList.remove('hidden'); void overlay.offsetWidth;
            overlay.classList.remove('opacity-0');
            drawer.classList.add('open');
        }
    },

    toggleMobileFilter() {
        const drawer = document.getElementById('mobile-filter-drawer');
        const overlay = document.getElementById('mobile-filter-overlay');
        if(!drawer || !overlay) return;
        if (drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        } else {
            overlay.classList.remove('hidden'); void overlay.offsetWidth;
            overlay.classList.remove('opacity-0');
            drawer.classList.add('open');
        }
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if(menu) menu.classList.toggle('open');
    },

    openSearch() {
        const modal = document.getElementById('search-modal');
        if(!modal) return;
        modal.classList.remove('inactive'); modal.classList.add('active');
        setTimeout(() => modal.querySelector('input').focus(), 100);
    },
    
    closeSearch() {
        const modal = document.getElementById('search-modal');
        if(modal) { modal.classList.remove('active'); modal.classList.add('inactive'); }
    },
    
    executeSearch() {
        const input = document.getElementById('global-search-input');
        if(!input) return;
        const query = input.value.trim();
        this.closeSearch();
        if(query) {
            window.location.href = `category.html?search=${encodeURIComponent(query)}`;
        }
    },

    toggleAIStylist() {
        const modal = document.getElementById('ai-stylist-modal');
        if(!modal) return;
        if (modal.classList.contains('inactive')) {
            modal.classList.remove('inactive'); modal.classList.add('active');
        } else {
            modal.classList.remove('active'); modal.classList.add('inactive');
        }
    },
    
    closeAIStylist() {
        const modal = document.getElementById('ai-stylist-modal');
        if(modal) { modal.classList.remove('active'); modal.classList.add('inactive'); }
    },

    words: ["Kualitas Premium.", "Tren Terbaru.", "Kenyamanan Sehari-hari.", "Rasa Percaya Diri."],
    wordIdx: 0,
    charIdx: 0,
    isDeleting: false,
    
    startTypeEffect() {
        if(!document.getElementById('typing-text')) return;
        this.typeEffect();
    },
    
    typeEffect() {
        let currentWord = this.words[this.wordIdx];
        let textElement = document.getElementById('typing-text');
        if(!textElement) return;
        
        if (this.isDeleting) { 
            textElement.innerText = currentWord.substring(0, this.charIdx - 1); 
            this.charIdx--; 
        } else { 
            textElement.innerText = currentWord.substring(0, this.charIdx + 1); 
            this.charIdx++; 
        }

        let typeSpeed = this.isDeleting ? 50 : 100;
        if (!this.isDeleting && this.charIdx === currentWord.length) { 
            typeSpeed = 2000; this.isDeleting = true; 
        } else if (this.isDeleting && this.charIdx === 0) { 
            this.isDeleting = false; 
            this.wordIdx = (this.wordIdx + 1) % this.words.length; 
            typeSpeed = 500; 
        }
        setTimeout(() => this.typeEffect(), typeSpeed);
    }
};

window.showToast = (msg) => UI.showToast(msg);
window.checkAuthAndNavigate = () => UI.checkAuthAndNavigate();
window.processLogout = () => UI.processLogout();
window.toggleAuthModal = () => UI.toggleAuthModal();
window.closeAuthModal = () => UI.closeAuthModal();
window.switchAuthTab = (tab) => UI.switchAuthTab(tab);
window.processLogin = () => UI.processLogin();
window.toggleWishlistDrawer = () => UI.toggleWishlistDrawer();
window.toggleHeart = (el, name) => {
    // stop propagation if possible
    if(event) event.stopPropagation();
    UI.toggleHeart(el, name);
};
window.toggleCartDrawer = () => UI.toggleCartDrawer();
window.toggleMobileFilter = () => UI.toggleMobileFilter();
window.toggleMobileMenu = () => UI.toggleMobileMenu();
window.openSearch = () => UI.openSearch();
window.closeSearch = () => UI.closeSearch();
window.executeSearch = () => UI.executeSearch();
window.toggleAIStylist = () => UI.toggleAIStylist();
window.closeAIStylist = () => UI.closeAIStylist();
