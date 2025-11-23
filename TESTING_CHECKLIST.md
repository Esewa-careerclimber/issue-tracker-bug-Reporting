# Testing Checklist ✅

## Pre-Flight Checks

- [ ] Backend server running on port 5001
- [ ] MongoDB connected (check server logs)
- [ ] AI service running on port 5002 (optional but recommended)
- [ ] Frontend dev server running
- [ ] Browser console open for debugging

---

## Authentication Flow

### Signup
- [ ] Navigate to `/signup`
- [ ] Select "Company Admin"
- [ ] Fill all required fields
- [ ] Submit form
- [ ] Should redirect to `/dashboard`
- [ ] Check if user is stored in MongoDB

### Login
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Submit form
- [ ] Should redirect based on role:
  - Admin → `/dashboard`
  - User → `/user`
- [ ] JWT token stored in localStorage
- [ ] User data in localStorage

### Logout
- [ ] Click user avatar in navbar
- [ ] Click "Logout"
- [ ] Should redirect to `/login`
- [ ] localStorage cleared
- [ ] Can't access protected routes

---

## Admin Dashboard (`/dashboard`)

### View Tickets
- [ ] Dashboard loads without errors
- [ ] Stat cards show correct counts
- [ ] Tickets list displays
- [ ] Search functionality works
- [ ] Filter tabs work (All, Open, In Progress, Closed)
- [ ] Issue cards show:
  - [ ] Title
  - [ ] Description
  - [ ] Category badge
  - [ ] Severity badge (color-coded)
  - [ ] Status badge (color-coded)
  - [ ] AI Summary (if available)
  - [ ] Creator username
  - [ ] Date created

### Issue Details Modal
- [ ] Click "View Details" on any issue
- [ ] Modal opens
- [ ] Shows all issue information
- [ ] Shows AI summary (if available)
- [ ] Shows attachment image (if uploaded)
- [ ] Status update buttons work
- [ ] Updating status refreshes data

---

## Report Issue (`/report`)

### Create Ticket
- [ ] Form loads correctly
- [ ] Title field required
- [ ] Description field required
- [ ] Category dropdown works
- [ ] File upload works (optional)
- [ ] Submit button shows "Submitting & Analyzing..." while loading
- [ ] Success message appears
- [ ] AI severity assigned automatically
- [ ] AI summary generated automatically
- [ ] Redirects to `/my-issues` after 2 seconds
- [ ] New ticket appears in My Issues
- [ ] New ticket visible in Dashboard (admin)

### AI Features
- [ ] Create ticket with description: "Critical bug causing crashes"
- [ ] Check if severity is "high" or "critical"
- [ ] Check if summary is generated
- [ ] Verify summary is shorter than description

---

## My Issues (`/my-issues`)

### View Personal Tickets
- [ ] Page loads user's tickets only
- [ ] Filter by category works
- [ ] Filter by status works
- [ ] Filter by severity works
- [ ] Sort options work (Newest, Oldest, Priority)
- [ ] Click "View Details" opens modal
- [ ] Modal shows AI summary
- [ ] Modal shows all ticket details

---

## User Dashboard (`/user`)

### Assigned Tasks
- [ ] Shows tasks assigned to logged-in user
- [ ] Stat cards show correct counts
- [ ] Filter tabs work
- [ ] Search works
- [ ] Click task to view details
- [ ] Status update works:
  - [ ] "Start Working" → changes to in-progress
  - [ ] "Mark as Completed" → changes to closed
  - [ ] "Reopen Task" → changes to open
- [ ] Status updates refresh the list
- [ ] User info displays correctly (avatar, username)
- [ ] Logout button works

---

## UI & Theme

### Colors
- [ ] Primary color is blue (not purple)
- [ ] Secondary color is teal/cyan
- [ ] Status badges have correct colors:
  - [ ] Open: Blue
  - [ ] In Progress: Orange/Amber
  - [ ] Closed: Green
- [ ] Severity badges have correct colors:
  - [ ] Critical: Red
  - [ ] High: Orange
  - [ ] Medium: Yellow
  - [ ] Low: Green

### Dark Mode
- [ ] Click theme toggle (🌙/☀️)
- [ ] Theme switches smoothly
- [ ] Colors adjust properly
- [ ] Text remains readable
- [ ] Gradients work in both modes

### Responsive
- [ ] Desktop view looks good
- [ ] Tablet view works
- [ ] Mobile view usable
- [ ] Navigation accessible on all sizes

---

## Data Verification

### Backend Connection
- [ ] Open browser DevTools → Network tab
- [ ] Look for API calls to `localhost:5001`
- [ ] Verify responses return data (not 404/500)
- [ ] Check response structure matches expectations

### MongoDB
- [ ] Open MongoDB Compass or shell
- [ ] Check `tickets` collection
- [ ] Verify tickets are being created
- [ ] Check `users` collection
- [ ] Verify users are being registered
- [ ] Check fields:
  - [ ] title, description, category
  - [ ] severity (AI-generated)
  - [ ] summary (AI-generated)
  - [ ] createdBy (ObjectId reference)
  - [ ] status, createdAt

### AI Service
- [ ] Check AI service logs
- [ ] Verify severity requests
- [ ] Verify summary requests
- [ ] Test fallback when AI service is down:
  - [ ] Stop AI service
  - [ ] Create ticket
  - [ ] Should still work (severity defaults to "low")

---

## Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] Should show error message
- [ ] Try to create ticket
- [ ] Should show error message
- [ ] Restart server, should work again

### Invalid Credentials
- [ ] Try login with wrong password
- [ ] Should show "Invalid credentials" or similar
- [ ] Try login with non-existent email
- [ ] Should show appropriate error

### Unauthorized Access
- [ ] Logout
- [ ] Try to access `/dashboard` directly
- [ ] Should redirect to `/login`
- [ ] Login as regular user
- [ ] Try to access admin-only features
- [ ] Should be restricted or redirect

---

## Performance

- [ ] Dashboard loads within 2 seconds
- [ ] Ticket creation completes within 3 seconds (with AI)
- [ ] No console errors
- [ ] No console warnings (minor warnings OK)
- [ ] Images load properly
- [ ] Smooth transitions and animations

---

## Browser Compatibility

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Final Checks

- [ ] All static data removed from code
- [ ] All API calls use correct endpoints
- [ ] JWT token included in requests
- [ ] Error states display properly
- [ ] Loading states display properly
- [ ] Success messages display
- [ ] Navigation works between all pages
- [ ] Breadcrumbs/back buttons work
- [ ] Forms reset after submission
- [ ] Modals close properly
- [ ] No memory leaks (check DevTools)

---

## Known Limitations

1. AI service (port 5002) is optional:
   - If not running, severity defaults to "low"
   - Summary falls back to first 100 chars

2. File uploads:
   - Images only
   - Stored in `server/uploads/tickets/`
   - Served via backend static files

3. User assignment:
   - Currently shows all tickets assigned to user ID
   - Admin can assign via PATCH `/admin/tickets/:id/assign`

---

## Bug Report Template

If you find issues:

```
**Issue:** [Brief description]
**Location:** [Page/component]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Console Errors:** [Copy from browser console]
**Backend Logs:** [Copy from server terminal]
```

---

## Success Criteria ✨

All checkboxes above should be ✅ for full integration success!

**Current Status:**
- Backend Integration: ✅ COMPLETE
- Authentication: ✅ COMPLETE
- AI Features: ✅ COMPLETE
- UI Modernization: ✅ COMPLETE
- All Components: ✅ COMPLETE
