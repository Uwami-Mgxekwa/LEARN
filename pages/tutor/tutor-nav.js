// ===================================
// Shared Tutor Nav & Sidebar Logic
// ===================================

function initTutorNav(activePage) {
    // Highlight active sidebar link
    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === activePage);
    });

    // Sidebar toggle (mobile)
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    const openSidebar = () => {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    };

    document.getElementById('menuBtn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => logoutUser());
}

function setTutorTopbar(firstName, lastName) {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'T';
    const el = document.getElementById('userAvatar');
    const nameEl = document.getElementById('userName');
    if (el) el.textContent = initials;
    if (nameEl) nameEl.textContent = firstName || 'Tutor';
}
