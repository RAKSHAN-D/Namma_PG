# ✅ Admin Approvals Page

## 🎯 Purpose
A **centralized dashboard** showing approval statistics for PGs, Users, and Owners. Provides quick navigation to filtered lists.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Approvals.jsx`

### **What It Does:**
Displays **6 clickable cards** in a 2×3 grid:

**Row 1 - Approved:**
1. Approved PGs
2. Approved Users
3. Approved Owners

**Row 2 - Pending:**
4. Pending PGs
5. Pending Users
6. Pending Owners

Each card shows:
- **Count** (large number)
- **Label** (Approved/Pending X)
- **Icon** (visual indicator)
- **Click** → Navigate to filtered list

### **Visual Layout:**
```
┌──────────────┬──────────────┬──────────────┐
│  Approved PGs│Approved Users│Approved Owner│
│      25      │      150     │      12      │
│   ✅ Green   │   ✅ Green   │   ✅ Green   │
└──────────────┴──────────────┴──────────────┘
┌──────────────┬──────────────┬──────────────┐
│  Pending PGs │Pending Users │Pending Owners│
│       5      │       8      │       3      │
│   ⏳ Yellow  │   ⏳ Yellow  │   ⏳ Yellow  │
└──────────────┴──────────────┴──────────────┘
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/approvals/stats`

### **Service Method:**
```java
// AdminServiceImpl.java
public ApprovalStatsDto getApprovalStats() {
    // Get all data
    List<Pg> allPgs = pgRepository.findAll();
    List<User> allUsers = userRepository.findByRoles_Name("ROLE_PG_USER");
    List<User> allOwners = userRepository.findByRoles_Name("ROLE_PG_OWNER");
    
    // Count approved (active = true)
    long approvedPgs = allPgs.stream().filter(Pg::isActive).count();
    long approvedUsers = allUsers.stream().filter(User::isActive).count();
    long approvedOwners = allOwners.stream().filter(User::isActive).count();
    
    // Calculate pending (total - approved)
    long pendingPgs = allPgs.size() - approvedPgs;
    long pendingUsers = allUsers.size() - approvedUsers;
    long pendingOwners = allOwners.size() - approvedOwners;
    
    return new ApprovalStatsDto(
        approvedPgs, pendingPgs,
        approvedUsers, pendingUsers,
        approvedOwners, pendingOwners
    );
}
```

### **Response Format:**
```json
{
  "approvedPgs": 25,
  "pendingPgs": 5,
  "approvedUsers": 150,
  "pendingUsers": 8,
  "approvedOwners": 12,
  "pendingOwners": 3
}
```

---

## 💾 DATABASE

### **Tables Queried:**

#### **1. `pgs` Table:**
```sql
-- Approved PGs
SELECT COUNT(*) FROM pgs WHERE active = true;

-- Pending PGs
SELECT COUNT(*) FROM pgs WHERE active = false;
```

#### **2. `users` + `user_roles` + `roles`:**
```sql
-- Approved Users
SELECT COUNT(*) FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_PG_USER' AND u.active = true;

-- Pending Users
SELECT COUNT(*) FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_PG_USER' AND u.active = false;

-- Same for Owners with r.name = 'ROLE_PG_OWNER'
```

### **Database Structure:**
```
users
├─ id (PK)
├─ full_name
├─ email
├─ active (BOOLEAN) ← Used for approved/pending
└─ created_at

user_roles
├─ user_id (FK)
└─ role_id (FK)

roles
├─ id (PK)
└─ name ('ROLE_PG_USER', 'ROLE_PG_OWNER', 'ROLE_ADMIN')

pgs
├─ id (PK)
├─ name
├─ active (BOOLEAN) ← Used for approved/pending
└─ owner_id (FK)
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. User navigates to /admin/approvals
2. Frontend calls GET /api/admin/approvals/stats
3. Backend:
   - Queries all PGs
   - Queries all users with ROLE_PG_USER
   - Queries all users with ROLE_PG_OWNER
   - Counts active vs inactive for each
   - Returns 6 numbers
4. Frontend displays in cards
```

### **When Card Clicked:**
```
1. User clicks "Approved PGs" card
2. Navigate to /admin/pgs?status=approved
3. AllPGs page:
   - Reads query parameter
   - Filters pgs.active === true
   - Shows only approved PGs
```

---

## 🎨 UI Design

### **Card Structure:**
```javascript
<div className="card" onClick={() => navigate('/admin/pgs?status=approved')}>
  <Icon /> {/* CheckCircle for approved */}
  <h3>25</h3>
  <p>Approved PGs</p>
</div>
```

### **Color Scheme:**
- **Approved Cards:**
  - Background: Light green (bg-green-50)
  - Border: Green (border-green-200)
  - Icon: Green CheckCircle
  - Text: Dark green

- **Pending Cards:**
  - Background: Light yellow (bg-yellow-50)
  - Border: Yellow (border-yellow-200)
  - Icon: Yellow Clock
  - Text: Dark yellow

### **Hover Effects:**
- Shadow increases
- Border becomes brighter
- Slight scale up
- Cursor: pointer

---

## 🔗 Navigation System

### **Click Actions:**

| Card Clicked        | Navigates To                      | Shows                  |
|---------------------|-----------------------------------|------------------------|
| Approved PGs        | `/admin/pgs?status=approved`      | Active PGs only        |
| Pending PGs         | `/admin/pgs?status=pending`       | Inactive PGs only      |
| Approved Users      | `/admin/users?status=approved`    | Active users only      |
| Pending Users       | `/admin/users?status=pending`     | Inactive users only    |
| Approved Owners     | `/admin/owners?status=approved`   | Active owners only     |
| Pending Owners      | `/admin/owners?status=pending`    | Inactive owners only   |

### **Query Parameter System:**
```javascript
// In Approvals.jsx
onClick={() => navigate('/admin/pgs?status=approved')}

// In AllPGs.jsx
const [searchParams] = useSearchParams();
const statusFilter = searchParams.get('status');
// Use filter to show only approved or pending
```

---

## 🎯 Purpose of Each Stat

### **Approved Counts:**
- **Shows:** How many are active/operational
- **Use:** Monitor active platform inventory
- **Growth:** Track platform expansion

### **Pending Counts:**
- **Shows:** How many await admin action
- **Use:** Workload indicator for admins
- **Priority:** Higher number = more approvals needed

---

## ⚡ Performance

### **Backend Optimization:**
- ✅ Single query per entity type
- ✅ Count operations are fast
- ✅ No pagination needed (just counts)
- ✅ Cached in memory (optional)

### **Frontend Optimization:**
- ✅ Single API call on load
- ✅ No re-renders unless data changes
- ✅ Simple card components

---

## 📊 Admin Workflow

### **Typical Admin Flow:**
```
1. Login → Dashboard
2. Navigate to Approvals page
3. See "Pending PGs: 5" (yellow card)
4. Click card → Navigate to Pending PGs list
5. Review each PG
6. Click row → ViewPG page
7. Click "Approve PG" button
8. PG becomes active
9. Return to Approvals
10. Count updates: Pending PGs: 4, Approved PGs: 26
```

---

## 🔐 Security

### **Access Control:**
- **Required:** Admin authentication
- **Role:** ROLE_ADMIN only
- **Token:** Valid JWT in header

### **Backend Protection:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/approvals/stats")
public ResponseEntity<ApprovalStatsDto> getApprovalStats()
```

---

## 📱 Responsive Design

- **Desktop (> 1024px):**
  - 3 cards per row
  - 2 rows total
  - Large numbers, comfortable spacing

- **Tablet (768px - 1024px):**
  - 2 cards per row
  - 3 rows total
  - Medium-sized cards

- **Mobile (< 768px):**
  - 1 card per row
  - 6 rows total
  - Full-width cards

---

## 💡 Business Logic

### **Approval Status:**
```
active = true  → Approved (can operate)
active = false → Pending (awaiting approval)
```

### **Default States:**
- **Users:** Usually auto-approved (active = true)
- **Owners:** Usually pending (active = false)
- **PGs:** Always pending (active = false)

### **Why Separate Approved vs Pending:**
- Quick workload visibility
- Prioritization (pending = action needed)
- Growth tracking (approved = inventory)

---

## 🔄 Integration

### **Related Pages:**
1. **AllPGs** - Shows filtered PG lists
2. **Users** - Shows filtered user lists
3. **Owners** - Shows filtered owner lists
4. **ViewPG/ViewUser/ViewOwner** - Detail pages with approve/block actions

### **Data Sources:**
- Same data as Dashboard
- Uses approval status (active field)
- Real-time counts (no caching)

---

## 📋 Summary Statistics

### **What This Page Provides:**
- ✅ **Quick overview** of approval status
- ✅ **Workload indicator** (pending counts)
- ✅ **Growth metrics** (approved counts)
- ✅ **Fast navigation** to filtered lists
- ✅ **Visual clarity** (color-coded)

### **Admin Benefits:**
- **Saves time** - No manual counting
- **Clear priorities** - See what needs attention
- **Easy access** - One click to filtered lists
- **Dashboard-style** - All info at a glance

---

## 🎯 Use Cases

### **Daily Admin Routine:**
1. **Check Approvals page** - See pending counts
2. **Click highest number** - Go to that list
3. **Review items** - Check quality/legitimacy
4. **Approve/reject** - Update status
5. **Return to Approvals** - Check next priority

### **Weekly Reporting:**
- Track approved counts over time
- Monitor pending backlog
- Identify approval bottlenecks

---

## 📊 Final Summary

The **Approvals Page** is a **dashboard within a dashboard** that:
- Centralizes approval statistics
- Provides quick navigation to work items
- Shows platform health at a glance
- Streamlines admin workflow

**Key Innovation:** URL-based filtering allows direct links from summary cards to filtered lists!
