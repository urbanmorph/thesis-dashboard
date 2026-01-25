/**
 * Simple password protection for admin pages
 * Uses SHA-256 hash comparison
 */

(function() {
    // Password hash (SHA-256 of "admin123")
    // Change this by generating a new hash: https://emn178.github.io/online-tools/sha256.html
    const PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
    const SESSION_KEY = 'admin_authenticated';

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function checkAuth() {
        // Check if already authenticated in this session
        if (sessionStorage.getItem(SESSION_KEY) === 'true') {
            return true;
        }

        // Prompt for password
        const password = prompt('Enter admin password:');

        if (!password) {
            alert('Password required to access admin pages');
            window.location.href = '/index.html';
            return false;
        }

        const hash = await hashPassword(password);

        if (hash === PASSWORD_HASH) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            return true;
        } else {
            alert('Incorrect password');
            window.location.href = '/index.html';
            return false;
        }
    }

    // Run auth check immediately
    checkAuth();

    // Logout function
    window.adminLogout = function() {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = '/index.html';
    };
})();
