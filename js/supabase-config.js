// Supabase Configuration for Climate Action Tracker
const SUPABASE_URL = 'https://qvgrydejqvdkwedyixne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2Z3J5ZGVqcXZka3dlZHlpeG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzExMTgsImV4cCI6MjA4MzgwNzExOH0.nb5pmuLVrhr3vHFv1F5Jvpd8bQQSRB7bnhZReSYGMy8';

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (supabaseClient) return supabaseClient;

    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabaseClient;
        console.log('Supabase client initialized');
        return supabaseClient;
    } else {
        console.error('Supabase library not loaded');
        return null;
    }
}

// Wait for Supabase library to load
function waitForSupabase(maxAttempts = 50) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                const client = initSupabase();
                resolve(client);
            } else if (attempts >= maxAttempts) {
                reject(new Error('Supabase library failed to load'));
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Auto-initialize
if (typeof window.supabase !== 'undefined') {
    initSupabase();
}

// Auth helper functions
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

async function getSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

// Check if user is authenticated
async function requireAuth() {
    const session = await getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session.user;
}

// Export for use in other files
window.SupabaseConfig = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    initSupabase,
    waitForSupabase,
    signIn,
    signOut,
    getCurrentUser,
    getSession,
    requireAuth
};

window.waitForSupabase = waitForSupabase;
window.initSupabase = initSupabase;
window.getSession = getSession;
