/**
 * Authentication Module for Admin Dashboard
 * Uses Supabase Auth for secure authentication
 */

const Auth = (function () {
    let supabaseClient = null;
    let isInitialized = false;

    /**
     * Initialize Supabase client for auth
     */
    async function initSupabase() {
        if (isInitialized && supabaseClient) return supabaseClient;

        // Wait for Supabase library to load if not already loaded
        if (typeof supabase === 'undefined') {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }

        supabaseClient = supabase.createClient(
            CONFIG.supabase.url,
            CONFIG.supabase.anonKey
        );
        isInitialized = true;
        return supabaseClient;
    }

    /**
     * Check if user is authenticated
     */
    async function isAuthenticated() {
        try {
            const client = await initSupabase();
            const { data: { session } } = await client.auth.getSession();
            return session !== null;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }

    /**
     * Get current session
     */
    async function getSession() {
        try {
            const client = await initSupabase();
            const { data: { session } } = await client.auth.getSession();
            return session;
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    }

    /**
     * Get current user
     */
    async function getUser() {
        try {
            const client = await initSupabase();
            const { data: { user } } = await client.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    /**
     * Attempt to login with email and password
     */
    async function login(email, password) {
        // Validate inputs
        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        try {
            const client = await initSupabase();
            const { data, error } = await client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user };
        } catch (err) {
            console.error('Login exception:', err);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    /**
     * Logout the current user
     */
    async function logout() {
        try {
            const client = await initSupabase();
            await client.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even on error
            window.location.href = 'login.html';
        }
    }

    /**
     * Protect a page - redirect to login if not authenticated
     */
    async function protectPage() {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Initialize authentication on page load
     */
    async function init() {
        await initSupabase();

        // Check for login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // If already authenticated, redirect to admin
            const authenticated = await isAuthenticated();
            if (authenticated) {
                window.location.href = 'admin.html';
                return;
            }

            // Handle login form submission
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('username').value;
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
                const result = await login(email, password);

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
            await protectPage();
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
        getUser,
        login,
        logout,
        protectPage
    };
})();
