# 👤 Admin Owners Page

## 🎯 Purpose
This page shows **all PG owners** registered on the platform. Admins can view owner details and manage their accounts.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Owners.jsx`

### **What It Does:**
1. **Shows Owners List Table** with columns:
   - Owner Name
   - Email Address
   - Phone Number
   - PG Count (how many PGs they own)
   - Status Badge (Approved/Pending)

2. **Filtering:**
   - Filter by status (Approved/Pending)
   - Uses URL query parameters (?status=approved)

3. **Click Row:**
   - Navigate to Owner details page (ViewOwner)

### **Key Features:**
- ✅ **Status badges** (Approved/Pending)
- ✅ **PG count** for each owner
- ✅ **Clickable rows** for details
- ✅ **Status filtering** from Approvals page

### **Table Layout:**
```
Owner Name  │ Email             │ Phone        │ PGs │ Status
────────────┼───────────────────┼──────────────┼─────┼──────────
John Doe    │ john@example.com  │ 9876543210   │  3  │ ✅ Approved
Jane Smith  │ jane@example.com  │ 9123456789   │  1  │ ⏳ Pending
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/owners`

### **Service Method:**
```java
// AdminServiceImpl.java
public List<OwnerDto> getAllOwners() {
    List<User> owners = userRepository.findByRoles_Name("ROLE_PG_OWNER");
    
    return owners.stream()
        .map(owner -> {
            long pgCount = pgRepository.countByOwnerId(owner.getId());
            return new OwnerDto(
                owner.getId(),
                owner.getFullName(),
                owner.getEmail(),
                owner.getUsername(),
                owner.isActive(),
                pgCount
            );
        })
        .collect(Collectors.toList());
}
```

### **Response Format:**
```json
[
  {
    "id": 2,
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "active": true,
    "pgCount": 3
  },
  {
    "id": 5,
    "fullName": "Jane Smith",
    "email": "jane@example.com", 
    "username": "janesmith",
    "active": false,
    "pgCount": 1
  }
]
```

---

## 💾 DATABASE

### **Main Tables:**

#### **1. `users` Table:**
Stores all user accounts (including owners)

| Column     | Type         | Description           |
|------------|--------------|----------------------|
| id         | BIGINT       | Primary key          |
| full_name  | VARCHAR(255) | Owner's full name    |
| email      | VARCHAR(255) | Email (unique)       |
| username   | VARCHAR(50)  | Username (unique)    |
| password   | VARCHAR(255) | Encrypted password   |
| active     | BOOLEAN      | Account status       |
| created_at | TIMESTAMP    | Registration date    |

#### **2. `user_roles` Table:**
Maps users to their roles

| Column  | Type   | Description       |
|---------|--------|-------------------|
| user_id | BIGINT | FK to users       |
| role_id | BIGINT | FK to roles       |

#### **3. `roles` Table:**
Defines available roles

| Column | Type         | Description    |
|--------|--------------|----------------|
| id     | BIGINT       | Primary key    |
| name   | VARCHAR(50)  | Role name      |

**Roles:**
- `ROLE_ADMIN`
- `ROLE_PG_OWNER`
- `ROLE_PG_USER`

#### **4. `pgs` Table:**
Used to count PGs per owner

| Column   | Type   | Description      |
|----------|--------|------------------|
| id       | BIGINT | Primary key      |
| owner_id | BIGINT | FK to users      |
| name     | VARCHAR| PG name          |
| active   | BOOLEAN| Approval status  |

### **Query to Get Owners:**
```sql
SELECT u.id, u.full_name, u.email, u.username, u.active,
       (SELECT COUNT(*) FROM pgs WHERE owner_id = u.id) as pg_count
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_PG_OWNER'
ORDER BY u.created_at DESC;
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. Navigate to /admin/owners
2. Check for ?status query parameter
3. Call GET /api/admin/owners
4. Backend:
   - Finds all users with ROLE_PG_OWNER
   - Counts PGs for each owner
   - Returns owner list with pg_count
5. Frontend filters by status (if parameter)
6. Display table
```

### **Status Filtering:**
```javascript
const filteredOwners = owners.filter(owner => {
  if (statusFilter === 'approved') {
    return owner.active === true;
  }
  if (statusFilter === 'pending') {
    return owner.active === false;
  }
  return true; // Show all if no filter
});
```

---

## 🎨 UI Components

### **Status Badges:**
- **Approved (Active):**
  - Green background
  - CheckCircle icon
  - Border: green

- **Pending (Inactive):**
  - Yellow background
  - Clock icon
  - Border: yellow

### **PG Count Display:**
- Shows number in badge
- Format: "3 PGs" or "1 PG"
- Helps identify active owners

### **Hover Effects:**
- Row highlights on hover
- Cursor changes to pointer
- Background: light gray

---

## 🔗 Navigation

### **From This Page:**
- Click row → `/admin/owners/{id}` (ViewOwner page)

### **To This Page:**
- Dashboard → "Active Owners" card
- Sidebar → "Owners" menu
- Approvals page → "Approved/Pending Owners" cards

---

## 📊 Filtering System

### **URL Parameters:**
- `/admin/owners` → All owners
- `/admin/owners?status=approved` → Active owners only
- `/admin/owners?status=pending` → Pending approvals

### **Filter Source:**
Usually triggered from **Approvals page**:
```javascript
// Approvals.jsx
<div onClick={() => navigate('/admin/owners?status=approved')}>
  Approved Owners: {stats.approvedOwners}
</div>
```

---

## 🔐 Security

### **Authentication:**
- JWT token required
- Role: ROLE_ADMIN

### **Controller Security:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/owners")
public ResponseEntity<List<OwnerDto>> getAllOwners()
```

---

## 📱 Responsive Design

- **Desktop:** Full table, 5 columns visible
- **Tablet:** Horizontal scroll
- **Mobile:** Stacked cards (optional future enhancement)

---

## 🎯 Admin Actions

### **From This Page, Admin Can:**
1. ✅ View all registered owners
2. ✅ See which owners are approved vs pending
3. ✅ Check how many PGs each owner has
4. ✅ Navigate to owner details
5. ✅ Filter by approval status

### **Admin Cannot (on this page):**
- ❌ Approve/Block owners (must go to ViewOwner)
- ❌ Edit owner information
- ❌ Delete owners
- ❌ See owner's PG details

---

## ⚡ Performance

### **Optimizations:**
1. ✅ Single query with JOIN
2. ✅ PG count calculated in backend
3. ✅ Client-side filtering
4. ✅ Memoized list rendering

### **Database Efficiency:**
- Uses indexed columns (user_id, role_id)
- COUNT query optimized
- No N+1 query problem

---

## 🐛 Error Handling

**States:**
- **Loading:** "Loading owners..."
- **Empty:** "No owners found"
- **Filtered Empty:** "No {approved/pending} owners"
- **Error:** Console log, empty table

---

## 🔄 Integration

### **Related Pages:**
1. **ViewOwner** - Detail page with Block/Unblock
2. **Approvals** - Source of filter navigation
3. **AllPGs** - Shows PGs owned by these owners

### **Related Endpoints:**
- `GET /api/admin/owners/{id}` - Owner details
- `PUT /api/admin/owners/{id}/status` - Update status

---

## 📋 Owner Lifecycle

```
1. Owner signs up → ROLE_PG_OWNER assigned
2. Owner appears in "Pending" list (active = false)
3. Admin approves → active = true
4. Owner can list PGs
5. Owner appears in "Approved" list
6. Admin can block → active = false
```

---

## 💡 Key Insights

### **Why PG Count Matters:**
- Shows owner activity level
- Helps prioritize approvals
- Identifies inactive owners (0 PGs)

### **Why Status Filter:**
- Quick access to pending approvals
- Monitor active owner base
- Track growth (approved count)

---

## 📊 Summary

The **Owners Page** provides a **centralized view** of all PG owners on the platform. It helps admins:
- **Monitor registrations** (approved vs pending)
- **Track owner activity** (PG count)
- **Manage approvals** efficiently
- **Navigate to details** for actions

This page is crucial for **user management** and **platform quality control**.
