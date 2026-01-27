// Admin Authentication Check
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await waitForSupabase();

        // Check authentication
        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (error || !user) {
            console.log('Not authenticated, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        console.log('Authenticated user:', user.email);

        // Show logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.addEventListener('click', handleLogout);
        }

    } catch (e) {
        console.error('Auth check error:', e);
        window.location.href = 'login.html';
    }
});

// Handle logout
async function handleLogout() {
    try {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Force redirect anyway
        window.location.href = 'login.html';
    }
}
