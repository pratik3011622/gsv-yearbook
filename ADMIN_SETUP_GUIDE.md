# 🛡️ Admin Setup Guide - GSVConnect

## Overview

GSVConnect now includes a comprehensive admin system with user approval workflows, content moderation, and activity logging.

## Admin Features

1. **User Approval System**
   - Review pending registrations
   - Approve or reject users
   - Add rejection reasons
   - Automated notifications

2. **Dashboard Analytics**
   - Total users count
   - Pending approvals
   - Total events
   - Total job postings

3. **Activity Logs**
   - Track all admin actions
   - Audit trail with timestamps
   - Admin attribution

4. **Content Moderation**
   - Monitor platform statistics
   - Review user profiles
   - Manage platform data

## Creating Your First Admin

### Step 1: Register a Regular Account

1. Go to the AlumniVerse homepage
2. Click "Join Now"
3. Fill out the registration form
4. Submit (account will be in pending status)

### Step 2: Manually Approve in Database

Since you're creating the first admin, you'll need database access:

1. Log in to your Supabase Dashboard
2. Navigate to **Table Editor**
3. Open the `profiles` table
4. Find your newly created profile
5. Click to edit the row
6. Update these fields:
   - `approval_status` → Change from `pending` to `approved`
   - `role` → Change from `alumni`/`student` to `admin`
7. Save the changes

### Step 3: Login

1. Return to GSVConnect
2. Click "Sign In"
3. Enter your credentials
4. You should now see an "Admin" link in the navigation

## Using the Admin Dashboard

### Accessing the Dashboard

Once logged in as admin:
- Desktop: Click "Admin" in the top navigation
- Mobile: Open menu → Click "Admin"

### Approving New Users

1. Go to Admin Dashboard
2. Default view shows "Pending Approvals"
3. For each user, you can see:
   - Full name
   - Email address
   - User type (Alumni/Student)
   - Batch year
   - Department
   - Company (if provided)
   - Registration date

4. **To Approve:**
   - Click the green "Approve" button
   - User will be notified (if email is configured)
   - User can now login

5. **To Reject:**
   - Click the red "Reject" button
   - Enter an optional rejection reason
   - User cannot login and will see rejection message

### Viewing Activity Logs

1. Go to Admin Dashboard
2. Click "Activity Logs" tab
3. See chronological list of all admin actions:
   - User approvals
   - User rejections
   - Admin who performed the action
   - Timestamp
   - Rejection reasons (if any)

## User Registration Flow

### For New Users:

1. **Register** → Account created with `pending` status
2. **Cannot Login** → Shows message: "Account pending approval"
3. **Admin Reviews** → Admin sees registration in dashboard
4. **Admin Approves** → Status changes to `approved`
5. **User Can Login** → Full access to platform

### For Rejected Users:

- Cannot login
- See message: "Account registration was rejected"
- Contact support for more information

## Security Features

### Row Level Security (RLS)

All tables have RLS policies:

- **Public Content**: Memories, events, jobs, stories
  - Only approved users can view
  - Only authors can edit/delete

- **User Profiles**:
  - Only approved profiles visible to others
  - Users can edit only their own profile
  - Admins can edit any profile

- **Admin Content**:
  - Only admins can access admin tables
  - Admin logs are admin-only
  - Platform stats can be updated by admins only

### Authentication

- JWT-based token authentication
- Password hashing via Supabase
- Approval check on every login
- Role-based access control

## Database Schema Changes

### New Columns in `profiles` Table:

- `role` (text) - 'student', 'alumni', or 'admin'
- `approval_status` (text) - 'pending', 'approved', or 'rejected'
- `approved_by` (uuid) - Reference to admin who approved
- `approved_at` (timestamp) - When approval happened
- `rejection_reason` (text) - Optional reason for rejection

### New Tables:

- `admin_logs` - Activity audit trail
- `photo_uploads` - Content moderation system (future use)

## Best Practices

### Admin Account Security

1. **Use strong passwords** for admin accounts
2. **Limit admin accounts** to trusted individuals only
3. **Review logs regularly** to monitor admin activity
4. **Don't share admin credentials**

### User Approval

1. **Verify email domains** match your institution
2. **Check batch years** are valid
3. **Look for suspicious patterns**
4. **Provide reasons** when rejecting

### Content Moderation

1. **Monitor new content** regularly
2. **Respond to reports** promptly
3. **Document decisions** in rejection reasons
4. **Be consistent** with policies

## Troubleshooting

### Cannot See Admin Link

**Problem**: Logged in but no Admin link in navigation

**Solutions**:
1. Verify `role` = 'admin' in database
2. Verify `approval_status` = 'approved'
3. Clear browser cache
4. Logout and login again

### Cannot Approve Users

**Problem**: Approve button not working

**Solutions**:
1. Check browser console for errors
2. Verify admin permissions in database
3. Check Supabase project is active
4. Verify RLS policies are correct

### Users Can't Login After Approval

**Problem**: Approved users still see pending message

**Solutions**:
1. Verify `approval_status` changed to 'approved'
2. User needs to logout/login again
3. Check no conflicting RLS policies

## Future Enhancements

Potential features to add:

1. **Email Notifications**
   - Notify users when approved/rejected
   - Send emails through Supabase functions

2. **Batch Approval**
   - Approve multiple users at once
   - Export pending users to CSV

3. **Content Moderation**
   - Photo approval system
   - Flag inappropriate content
   - User reporting system

4. **Advanced Analytics**
   - User growth charts
   - Engagement metrics
   - Event attendance reports

5. **Role Management**
   - Create custom roles
   - Fine-grained permissions
   - Department moderators

## Support

For issues or questions:
1. Check the main README.md
2. Review Supabase documentation
3. Check the browser console for errors
4. Verify database schema is correct

---

**Remember**: With great power comes great responsibility. Use admin privileges wisely and always prioritize user privacy and security.
