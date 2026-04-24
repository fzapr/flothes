async function loadComponent(id, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
        } else {
            console.error(`Failed to load ${url}: ${response.status}`);
        }
    } catch (e) {
        console.error(`Error loading ${url}:`, e);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Load components in parallel
    const promises = [];
    
    if(document.getElementById('navbar-container')) {
        promises.push(loadComponent('navbar-container', 'components/navbar.html'));
    }
    if(document.getElementById('footer-container')) {
        promises.push(loadComponent('footer-container', 'components/footer.html'));
    }
    if(document.getElementById('modals-container')) {
        promises.push(loadComponent('modals-container', 'components/modals.html'));
    }
    
    await Promise.all(promises);
    
    // Once components are loaded, initialize store and UI
    if (typeof Store !== 'undefined') Store.init();
    if (typeof UI !== 'undefined') UI.init();
});
