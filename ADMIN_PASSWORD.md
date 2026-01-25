# Admin Password Setup

## Current Password
The default admin password is: **admin123**

## How to Change the Password

1. Generate a SHA-256 hash of your new password:
   - Go to: https://emn178.github.io/online-tools/sha256.html
   - Enter your desired password
   - Copy the hash

2. Update the hash in `js/simple-auth.js`:
   ```javascript
   const PASSWORD_HASH = 'your-new-hash-here';
   ```

3. Commit and push the change

## How It Works

- Password protection uses SHA-256 hash comparison
- Authentication is stored in sessionStorage (cleared when browser closes)
- Wrong password redirects to home page
- Logout button clears session and redirects to home page
- No server-side authentication - simple client-side protection

## Security Note

This is a simple client-side password protection suitable for internal dashboards. For production systems with sensitive data, use proper server-side authentication (like Supabase Auth).
