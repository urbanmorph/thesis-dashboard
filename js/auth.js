/**
 * Authentication Module - TEMPORARILY DISABLED FOR TESTING
 *
 * This version allows access to all pages without authentication.
 * Once we verify pages load correctly, we'll re-enable proper auth.
 */

const Auth = (function () {
    console.log('[Auth] AUTHENTICATION COMPLETELY DISABLED - ALL PAGES ACCESSIBLE');

    // Immediately remove any auth-checking class
    document.documentElement.classList.remove('auth-checking');
    if (document.body) {
        document.body.classList.remove('auth-checking');
    }

    /**
     * Dummy functions - all return true/success
     */
    async function isAuthenticated() {
        console.log('[Auth] isAuthenticated() - returning true (auth disabled)');
        return true;
    }

    async function getSession() {
        console.log('[Auth] getSession() - returning null (auth disabled)');
        return null;
    }

    async function getUser() {
        console.log('[Auth] getUser() - returning null (auth disabled)');
        return null;
    }

    async function login(email, password) {
        console.log('[Auth] login() - simulating success (auth disabled)');
        // Simulate successful login
        return { success: true, user: { email } };
    }

    async function logout() {
        console.log('[Auth] logout() - redirecting to login');
        window.location.href = 'login.html';
    }

    async function protectPage() {
        console.log('[Auth] protectPage() - allowing access (auth disabled)');
        // Remove any loading overlays
        document.documentElement.classList.remove('auth-checking');
        if (document.body) {
            document.body.classList.remove('auth-checking');
        }
        return true;
    }

    /**
     * Initialize - set up login form only, no auth checks
     */
    async function init() {
        console.log('[Auth] init() - setting up without authentication');

        // Check for login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('[Auth] Login form found - setting up handler');

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                console.log('[Auth] Form submitted - redirecting to admin (no auth check)');

                // Just redirect to admin without checking credentials
                window.location.href = 'admin.html';
            });
        }

        // Check for logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            console.log('[Auth] Logout button found');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        console.log('[Auth] Initialization complete - no authentication active');
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
        getUser,
        login,
        logout,
        protectPage
    };
})();
