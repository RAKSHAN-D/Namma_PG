# 👥 Admin Users Page

## 🎯 Purpose
Shows **all regular users** (PG seekers/tenants) who are looking for or staying in PGs. Admins can view and manage user accounts.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Users.jsx`

### **What It Does:**
1. **Displays Users Table** with columns:
   - User Name
   - Email Address
   - Username
   - Join Date
   - Status Badge (Active/Inactive)

2. **Filtering:**
   - Filter by status (Approved/Pending)
   - URL parameter: ?status=approved

3. **Click Row:**
   - Navigate to User details (ViewUser page)

### **Key Features:**
- ✅ Status badges (Active/Inactive)
- ✅ Formatted join dates
- ✅ Clickable rows
- ✅ Responsive table
- ✅ Status filtering

### **Table View:**
```
User Name    │ Email              │ Username  │ Joined     │ Status
─────────────┼────────────────────┼───────────┼────────────┼─────────
Alice Kumar  │ alice@example.com  │ alicek    │ 2024-01-15 │ ✅ Active
Bob Singh    │ bob@example.com    │ bobsingh  │ 2024-01-20 │ ⏳ Inactive
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/users`

### **Service Method:**
```java
// AdminServiceImpl.java
public List<UserDto> getAllUsers() {
    List<User> users = userRepository.findByRoles_Name("ROLE_PG_USER");
    
    return users.stream()
        .map(user -> new UserDto(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getUsername(),
            user.isActive(),
            user.getCreatedAt()
        ))
        .collect(Collectors.toList());
}
```

### **Response Example:**
```json
[
  {
    "id": 10,
    "fullName": "Alice Kumar",
    "email": "alice@example.com",
    "username": "alicek",
    "active": true,
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 11,
    "fullName": "Bob Singh",
    "email": "bob@example.com",
    "username": "bobsingh",
    "active": false,
    "createdAt": "2024-01-20T14:45:00"
  }
]
```

---

## 💾 DATABASE

### **Tables Used:**

#### **1. `users` Table:**
Stores all user accounts

| Column     | Type         | Description            |
|------------|--------------|------------------------|
| id         | BIGINT       | Primary key            |
| full_name  | VARCHAR(255) | User's full name       |
| email      | VARCHAR(255) | Email (unique)         |
| username   | VARCHAR(50)  | Username (unique)      |
| password   | VARCHAR(255) | Encrypted password     |
| active     | BOOLEAN      | Account active status  |
| created_at | TIMESTAMP    | Registration timestamp |

#### **2. `user_roles` Table:**
Links users to their roles

| Column  | Type   | Description         |
|---------|--------|---------------------|
| user_id | BIGINT | FK to users.id      |
| role_id | BIGINT | FK to roles.id      |

#### **3. `roles` Table:**
Available user roles

| id | name            |
|----|-----------------|
| 1  | ROLE_ADMIN      |
| 2  | ROLE_PG_OWNER   |
| 3  | ROLE_PG_USER    |

### **SQL Query:**
```sql
SELECT u.id, u.full_name, u.email, u.username, u.active, u.created_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_PG_USER'
ORDER BY u.created_at DESC;
```

---

## 🔄 Data Flow

### **Page Load Process:**
```
1. User navigates to /admin/users
2. Check URL for ?status parameter
3. Frontend calls GET /api/admin/users
4. Backend:
   - Queries users table
   - Joins with user_roles
   - Filters by ROLE_PG_USER
   - Returns list
5. Frontend:
   - Receives array of users
   - Applies status filter (if param exists)
   - Renders table
```

### **Status Filtering:**
```javascript
const filteredUsers = users.filter(user => {
  if (statusFilter === 'approved') {
    return user.active === true;
  }
  if (statusFilter === 'pending') {
    return user.active === false;
  }
  return true;
});
```

---

## 🎨 UI Components

### **Status Badges:**
- **Active:**
  - Background: Light green
  - Text: Dark green
  - Icon: CheckCircle
  - Meaning: User can access platform

- **Inactive:**
  - Background: Light yellow
  - Text: Dark yellow
  - Icon: Clock
  - Meaning: Awaiting approval or blocked

### **Date Display:**
- Format: "MMM DD, YYYY" (Jan 15, 2024)
- Shows registration date
- Helps track growth

### **Row Interaction:**
- **Hover:** Light gray background
- **Cursor:** Pointer
- **Click:** Navigate to `/admin/users/{id}`

---

## 🔗 Navigation

### **To This Page:**
- **Dashboard:** "Active Users" card
- **Sidebar:** "Users" menu item
- **Approvals:** "Approved/Pending Users" cards

### **From This Page:**
- **Click Row:** `/admin/users/{id}` (ViewUser page)
  - View full user details
  - Block/Unblock user
  - See user activity

---

## 📊 Filtering System

### **URL-based Filtering:**

| URL                           | Shows                  |
|-------------------------------|------------------------|
| `/admin/users`                | All users              |
| `/admin/users?status=approved`| Active users only      |
| `/admin/users?status=pending` | Inactive users only    |

### **Filter Trigger:**
From **Approvals page:**
```javascript
<div onClick={() => navigate('/admin/users?status=approved')}>
  <h3>{stats.approvedUsers}</h3>
  <p>Approved Users</p>
</div>
```

---

## 🔐 Security

### **Access Control:**
- **Required:** Admin authentication
- **JWT Token:** Must be valid
- **Role:** ROLE_ADMIN only

### **Backend Protection:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/users")
public ResponseEntity<List<UserDto>> getAllUsers()
```

### **Data Privacy:**
- ⚠️ Passwords NOT included in response
- ✅ Only basic user info shown
- ✅ Sensitive data requires detail page

---

## 📱 Responsive Design

- **Desktop (> 1024px):**
  - Full table with all columns
  - Comfortable spacing

- **Tablet (768px - 1024px):**
  - Horizontal scroll if needed
  - Compact but readable

- **Mobile (< 768px):**
  - Table scrolls horizontally
  - Future: Card-based layout

---

## 🎯 Admin Capabilities

### **On This Page, Admin Can:**
1. ✅ View all registered users
2. ✅ See active vs inactive users
3. ✅ Check registration dates
4. ✅ Filter by approval status
5. ✅ Navigate to user details

### **Admin Cannot (on this page):**
- ❌ Block/Unblock users (must go to ViewUser)
- ❌ Edit user information
- ❌ See user bookings/history
- ❌ Reset user passwords

---

## ⚡ Performance

### **Optimizations:**
1. ✅ Single database query
2. ✅ Indexed role filtering
3. ✅ Client-side filtering (fast)
4. ✅ React key-based rendering
5. ✅ No unnecessary re-renders

### **Future Enhancements:**
- Server-side pagination
- Search by name/email
- Sort by columns
- Export to CSV

---

## 🐛 Error Handling

### **States:**
- **Loading:** "Loading users..."
- **Empty:** "No users found"
- **Filtered Empty:** "No {approved/pending} users"
- **Error:** Logged to console, table shows empty

### **User Experience:**
- Smooth loading transitions
- Clear empty states
- Error messages (if needed)

---

## 🔄 User Lifecycle

```
1. User signs up
   ↓
2. Assigned ROLE_PG_USER
   ↓
3. active = true (usually auto-approved)
   ↓
4. Appears in "Active" list
   ↓
5. Admin can block if needed
   ↓
6. active = false → Appears in "Inactive"
```

### **Auto-Approval:**
Most platforms auto-approve users (owners need approval)
```java
// Default setting
user.setActive(true); // Auto-approved
```

---

## 🔄 Integration

### **Related Pages:**
1. **ViewUser** - Detail view with Block/Unblock
2. **Approvals** - Shows approval counts
3. **Dashboard** - Shows total active users

### **Related Data:**
- Users can have bookings
- Users can report issues
- Users search for PGs

---

## 💡 Key Differences: Users vs Owners

| Aspect          | Users (ROLE_PG_USER)     | Owners (ROLE_PG_OWNER)  |
|-----------------|--------------------------|-------------------------|
| **Purpose**     | Find/book PGs            | List/manage PGs         |
| **Auto-approve**| Usually YES              | Usually NO              |
| **PG Count**    | Not tracked              | Tracked (important)     |
| **Approval**    | Less strict              | More strict             |
| **Activity**    | Bookings, searches       | PG listings, earnings   |

---

## 📊 Summary

The **Users Page** provides:
- **Complete list** of all regular platform users
- **Status management** (active/inactive)
- **Quick filtering** by approval status
- **Easy navigation** to user details

This page helps admins:
- **Monitor user base** growth
- **Identify inactive** accounts
- **Manage user access** efficiently
- **Track registrations** over time

Essential for **user management** and **platform health** monitoring!
