/**
 * Authentication Module for Admin Dashboard
 * Uses Supabase Auth for secure authentication
 */

const Auth = (function () {
    let supabaseClient = null;
    let isInitialized = false;
    const DEBUG = true; // Enable debug logging

    function log(...args) {
        if (DEBUG) console.log('[Auth]', ...args);
    }

    /**
     * Initialize Supabase client for auth
     */
    async function initSupabase() {
        if (isInitialized && supabaseClient) {
            log('Supabase already initialized');
            return supabaseClient;
        }

        try {
            log('Initializing Supabase...');

            // Wait for Supabase library to load if not already loaded
            if (typeof supabase === 'undefined') {
                log('Loading Supabase library...');
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load Supabase library'));
                    document.head.appendChild(script);
                });
            }

            log('Creating Supabase client...');
            supabaseClient = supabase.createClient(
                CONFIG.supabase.url,
                CONFIG.supabase.anonKey
            );
            isInitialized = true;
            log('Supabase initialized successfully');
            return supabaseClient;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    async function isAuthenticated() {
        try {
            log('Checking authentication...');
            const client = await initSupabase();
            if (!client) {
                log('No Supabase client - treating as not authenticated');
                return false;
            }

            const { data: { session }, error } = await client.auth.getSession();
            if (error) {
                console.error('Session check error:', error);
                return false;
            }

            const authenticated = session !== null;
            log('Authenticated:', authenticated);
            return authenticated;
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
            if (!client) return null;

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
            if (!client) return null;

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
            log('Attempting login for:', email);
            const client = await initSupabase();
            if (!client) {
                return { success: false, error: 'Authentication system not available' };
            }

            const { data, error } = await client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error);
                return { success: false, error: error.message };
            }

            log('Login successful');
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
            log('Logging out...');
            const client = await initSupabase();
            if (client) {
                await client.auth.signOut();
            }
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
        try {
            log('Protecting page...');
            const authenticated = await isAuthenticated();

            if (!authenticated) {
                log('Not authenticated - redirecting to login');
                // Remove loading overlay before redirecting
                document.documentElement.classList.remove('auth-checking');
                if (document.body) {
                    document.body.classList.remove('auth-checking');
                }

                // Small delay to prevent redirect loop
                setTimeout(() => {
                    window.location.replace('login.html');
                }, 100);

                return false;
            }

            log('User authenticated - removing loading overlay');
            // Remove loading class to show content
            document.documentElement.classList.remove('auth-checking');
            if (document.body) {
                document.body.classList.remove('auth-checking');
            }
            return true;
        } catch (error) {
            console.error('Page protection error:', error);
            // Remove overlay on error
            document.documentElement.classList.remove('auth-checking');
            if (document.body) {
                document.body.classList.remove('auth-checking');
            }

            setTimeout(() => {
                if (!window.location.href.includes('login.html')) {
                    window.location.replace('login.html');
                }
            }, 100);

            return false;
        }
    }

    /**
     * Initialize authentication on page load
     */
    async function init() {
        try {
            log('Initializing auth system...');
            const currentPath = window.location.pathname;
            log('Current path:', currentPath);

            // CRITICAL: Check admin pages FIRST before anything else
            const isAdminPage = currentPath.includes('admin');
            log('Is admin page:', isAdminPage);

            if (isAdminPage) {
                log('Admin page detected - checking auth immediately');
                // Block immediately and check auth
                await protectPage();
                // If we reach here, user is authenticated
                log('Auth check passed for admin page');
                return; // Exit early for admin pages
            }

            // Initialize Supabase for non-admin pages
            await initSupabase();

            // Check for login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                log('Login form found');

                // REMOVED: Don't check auth on login page - causes redirect loop
                // Just set up the login form handler
                log('Setting up login form handler');
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
                log('Logout button found');
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }

            log('Auth initialization complete');
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    }

    // CRITICAL: Determine page type and initialize appropriately
    const currentPath = window.location.pathname;
    const isAdminPage = currentPath.includes('admin');

    log('Script loaded. Path:', currentPath, 'Is admin:', isAdminPage);

    if (isAdminPage) {
        // Admin page: Add loading class immediately and start auth check
        log('Admin page - adding loading overlay immediately');
        document.documentElement.classList.add('auth-checking');

        // Start auth check immediately (don't wait for DOM)
        init().catch(error => {
            console.error('Admin page init error:', error);
            window.location.replace('login.html');
        });
    } else {
        // Non-admin page: Initialize normally after DOM ready
        log('Non-admin page - waiting for DOM ready');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                log('DOM ready - initializing auth');
                init();
            });
        } else {
            log('DOM already ready - initializing auth');
            init();
        }
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
