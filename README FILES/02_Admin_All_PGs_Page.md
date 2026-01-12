# 🏢 Admin All PGs Page

## 🎯 Purpose
This page shows **all PG listings** in the platform. Admins can view, filter, and manage PGs from here.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/AllPGs.jsx`

### **What It Does:**
1. **Shows PG List Table** with columns:
   - PG Name
   - Location (Area, City)
   - Rent Amount (₹/month)
   - Number of Rooms
   - Status Badge (Approved/Pending)

2. **Filtering:**
   - Filter by status (Approved/Pending)
   - Uses URL query parameters (?status=approved)

3. **Search:**
   - Local search by PG name or location

4. **Click Row:**
   - Navigate to PG details page (ViewPG)

### **Key Features:**
- ✅ **Color-coded status badges:**
  - Green = Approved (Active)
  - Yellow = Pending (Not Active)
- ✅ **Clickable rows** - Navigate to details
- ✅ **Responsive table** - Scrollable on mobile
- ✅ **Status filtering** from URL parameters

### **Filtering Logic:**
```javascript
// From Approvals page: /admin/pgs?status=approved
const statusFilter = searchParams.get('status');

if (statusFilter === 'approved') {
  // Show only active PGs (pg.active === true)
}
if (statusFilter === 'pending') {
  // Show only pending PGs (pg.active === false)
}
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/pgs`

### **Service Method:**
```java
// AdminServiceImpl.java
public List<PgDto> getAllPGs() {
    List<Pg> pgs = pgRepository.findAll();
    return pgs.stream()
        .map(this::convertToPgDto)
        .collect(Collectors.toList());
}
```

### **Response Format:**
```json
[
  {
    "id": 1,
    "name": "Sunshine PG",
    "city": "Bangalore",
    "area": "Koramangala",
    "rent": 8000,
    "numberOfRooms": 10,
    "active": true,
    "ownerName": "John Doe",
    "ownerEmail": "john@example.com"
  }
]
```

---

## 💾 DATABASE

### **Main Table:**
**`pgs`**

| Column          | Type         | Description                |
|-----------------|--------------|----------------------------|
| id              | BIGINT       | Primary key                |
| name            | VARCHAR(255) | PG name                    |
| city            | VARCHAR(100) | City name                  |
| area            | VARCHAR(100) | Locality/area              |
| address         | TEXT         | Full address               |
| rent            | DECIMAL      | Monthly rent               |
| number_of_rooms | INT          | Total rooms                |
| active          | BOOLEAN      | Approved status            |
| owner_id        | BIGINT       | Foreign key to users table |
| created_at      | TIMESTAMP    | Creation date              |

### **JOIN Query:**
```sql
SELECT 
  p.id, p.name, p.city, p.area, p.rent, 
  p.number_of_rooms, p.active,
  u.full_name as ownerName, 
  u.email as ownerEmail
FROM pgs p
LEFT JOIN users u ON p.owner_id = u.id
ORDER BY p.created_at DESC;
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. Navigate to /admin/pgs
2. Check for ?status query parameter
3. Call GET /api/admin/pgs
4. Backend fetches all PGs from database
5. Returns array of PG objects
6. Frontend filters by status (if parameter exists)
7. Displays table with filtered results
```

### **When Status Filter Applied:**
```
1. User clicks "Approved" card on Approvals page
2. Navigate to /admin/pgs?status=approved
3. Frontend reads query parameter
4. Filters: pg.active === true
5. Table shows only approved PGs
```

---

## 🎨 UI Components

### **Table Structure:**
```
┌─────────────────────────────────────────────────┐
│ PG Name    │ Location      │ Rent  │ Rooms │ Status │
├─────────────────────────────────────────────────┤
│ Sunshine   │ Koramangala,  │ ₹8000 │  10   │ ✅ Approved │
│            │ Bangalore     │       │       │             │
├─────────────────────────────────────────────────┤
│ Moonlight  │ HSR Layout,   │ ₹7500 │   8   │ ⏳ Pending  │
│            │ Bangalore     │       │       │             │
└─────────────────────────────────────────────────┘
```

### **Status Badges:**
- **Approved:**
  - Background: Green (bg-green-100)
  - Text: Dark green (text-green-800)
  - Icon: CheckCircle (green)

- **Pending:**
  - Background: Yellow (bg-yellow-100)
  - Text: Dark yellow (text-yellow-800)
  - Icon: Clock (yellow)

### **Row Hover Effect:**
- Background turns light gray
- Cursor changes to pointer
- Shows it's clickable

---

## 📊 Filtering System

### **URL-based Filtering:**
**Advantage:** Shareable, bookmarkable URLs

**Examples:**
- `/admin/pgs` → All PGs
- `/admin/pgs?status=approved` → Only approved
- `/admin/pgs?status=pending` → Only pending

### **Frontend Filter Logic:**
```javascript
const filteredPgs = pgs.filter(pg => {
  if (statusFilter === 'approved' && !pg.active) return false;
  if (statusFilter === 'pending' && pg.active) return false;
  return true;
});
```

---

## 🔗 Navigation

### **From This Page:**
- Click any row → `/admin/pgs/{id}` (ViewPG page)

### **To This Page:**
- Dashboard card → "Total PGs"
- Sidebar → "All PGs"
- Approvals page → "Approved/Pending PGs" cards

---

## 🔐 Security

**Authentication Required:**
- Must have JWT token
- Must have ROLE_ADMIN

**Authorization Check:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/pgs")
public ResponseEntity<List<PgDto>> getAllPGs()
```

---

## 📱 Responsive Design

- **Desktop:** Full table visible
- **Tablet:** Horizontal scroll enabled
- **Mobile:** Card-based layout (optional)

---

## 🎯 User Actions

### **Admin Can:**
1. ✅ View all PG listings
2. ✅ Filter by approval status
3. ✅ Click to view PG details
4. ✅ See owner information
5. ✅ Navigate to ViewPG page

### **Admin Cannot (on this page):**
- ❌ Edit PG details (must go to ViewPG)
- ❌ Delete PGs
- ❌ Approve/Block (must go to ViewPG)

---

## ⚡ Performance

**Optimizations:**
1. ✅ Single API call to fetch all data
2. ✅ Client-side filtering (fast)
3. ✅ Pagination ready (not implemented yet)
4. ✅ Efficient rendering with React keys

**Future Improvements:**
- Server-side pagination
- Server-side filtering
- Search by owner name
- Sort by columns

---

## 🐛 Error Handling

**Loading State:**
- Shows "Loading PGs..." message

**Empty State:**
- No PGs: "No PGs found"
- No filtered results: "No {approved/pending} PGs"

**API Error:**
- Console error logged
- Empty table shown

---

## 🔄 Integration

### **Related Pages:**
1. **ViewPG** - Click row to view details
2. **Approvals** - Filter links from approval cards
3. **Dashboard** - Total PGs card

### **Related Tables:**
- `pgs` - Main data
- `users` - Owner information
- `food` - PG food details (optional)

---

## 📋 Summary

The **All PGs page** is a **comprehensive list view** of all PG properties in the system. It provides:
- **Quick overview** of all listings
- **Status-based filtering**
- **Easy navigation** to details
- **Owner information** at a glance

This page helps admins **manage and monitor** all PG listings efficiently.
