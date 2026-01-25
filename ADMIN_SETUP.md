# Admin Authentication Setup

The dashboard now uses **Supabase Auth** for secure admin authentication.

## Quick Setup (5 minutes)

### 1. Access Your Supabase Project

Go to: https://supabase.com/dashboard/project/qvgrydejqvdkwedyixne

### 2. Create an Admin User

1. In the left sidebar, click **Authentication** → **Users**
2. Click **Add User** (top right)
3. Enter:
   - **Email**: Your admin email (e.g., `admin@yourorg.com`)
   - **Password**: Create a strong password
   - Leave "Auto Confirm User" **checked** ✓
4. Click **Create User**

### 3. Test Login

1. Go to your dashboard: https://thesis-dashboard-mu.vercel.app/login.html
2. Enter the email and password you just created
3. Click **Sign In**

You should be redirected to the admin dashboard!

## Managing Users

### Add More Admin Users

Repeat step 2 above for each admin user.

### Reset a User's Password

1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Send Password Reset Email**
4. User will receive an email with reset link

### Revoke Access

1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Delete User**

## Troubleshooting

### "Invalid login credentials" error

- Double-check email spelling
- Password is case-sensitive
- Make sure "Auto Confirm User" was checked when creating user

### Still getting redirect loops

- Clear browser cache and cookies
- Try in incognito/private window
- Check browser console for errors

### Can't access Supabase dashboard

Your project URL: https://supabase.com/dashboard/project/qvgrydejqvdkwedyixne

If you don't have access, contact the project owner to add you as a collaborator.

## Security Notes

- ✅ Passwords are securely hashed by Supabase
- ✅ Sessions use JWT tokens, not localStorage
- ✅ Automatic token refresh keeps users logged in
- ✅ No credentials stored in code
- ⚠️ Use strong passwords for admin accounts
- ⚠️ Don't share admin credentials

## Next Steps

Once logged in, you can:
- View partner organizations
- Track funding allocation
- Monitor program roadmap
- Export reports

---

**Need help?** Check the Supabase docs: https://supabase.com/docs/guides/auth
