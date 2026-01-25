/**
 * Authentication Module for Admin Dashboard
 *
 * Simple client-side authentication for demo purposes.
 * In production, replace with proper server-side authentication.
 */

const Auth = (function () {
    const SESSION_KEY = 'climate_dashboard_session';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Simple hash function for password comparison
     * Note: This is NOT secure for production use
     */
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Check if user is authenticated
     */
    function isAuthenticated() {
        const session = getSession();
        if (!session) return false;

        // Check if session is expired
        if (Date.now() > session.expires) {
            clearSession();
            return false;
        }

        return true;
    }

    /**
     * Get current session
     */
    function getSession() {
        try {
            const sessionData = localStorage.getItem(SESSION_KEY);
            if (!sessionData) return null;
            return JSON.parse(sessionData);
        } catch (e) {
            return null;
        }
    }

    /**
     * Create a new session
     */
    function createSession(username) {
        const session = {
            username,
            created: Date.now(),
            expires: Date.now() + SESSION_DURATION
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    /**
     * Clear the current session
     */
    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    /**
     * Attempt to login
     */
    async function login(username, password) {
        // Validate inputs
        if (!username || !password) {
            return { success: false, error: 'Username and password are required' };
        }

        // Hash the provided password
        const passwordHash = await hashPassword(password);

        // Check credentials
        if (
            username === CONFIG.auth.credentials.username &&
            passwordHash === CONFIG.auth.credentials.passwordHash
        ) {
            createSession(username);
            return { success: true };
        }

        return { success: false, error: 'Invalid username or password' };
    }

    /**
     * Logout the current user
     */
    function logout() {
        clearSession();
        window.location.href = 'login.html';
    }

    /**
     * Protect a page - redirect to login if not authenticated
     */
    function protectPage() {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Initialize authentication on page load
     */
    function init() {
        // Check for login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // If already authenticated, redirect to admin
            if (isAuthenticated()) {
                window.location.href = 'admin.html';
                return;
            }

            // Handle login form submission
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const errorEl = document.getElementById('loginError');
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;

                // Show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing in...';

                // Clear previous errors
                errorEl.classList.remove('show');
                errorEl.textContent = '';

                // Attempt login
                const result = await login(username, password);

                if (result.success) {
                    window.location.href = 'admin.html';
                } else {
                    errorEl.textContent = result.error;
                    errorEl.classList.add('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        }

        // Check for logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        // Check if current page is admin and protect it
        const isAdminPage = window.location.pathname.includes('admin');
        if (isAdminPage) {
            protectPage();
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        isAuthenticated,
        getSession,
        login,
        logout,
        protectPage
    };
})();
