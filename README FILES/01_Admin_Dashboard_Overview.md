# 📊 Admin Dashboard Overview Page

## 🎯 Purpose
The Dashboard is the **main landing page** for admins. It shows a quick **overview of the entire platform** with statistics, charts, and a search feature.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Dashboard.jsx`

### **What It Does:**
1. **Shows 4 Statistics Cards:**
   - Total PGs
   - Active Owners
   - Active Users
   - Pending Issues

2. **Global Search Bar:**
   - Search across PGs, Users, and Owners
   - Live search results dropdown
   - Click to navigate to detail pages

3. **Four Charts:**
   - **PG Growth Over Time** - Line chart
   - **User Signup Trend** - Area chart
   - **Onboarding Trend** - Bar chart (Users vs Owners)
   - **PG Status Distribution** - Donut chart

### **Key Features:**
- ✅ All cards are **clickable** - navigate to respective pages
- ✅ Search works in real-time with **300ms debounce**
- ✅ Charts use **Recharts** library for visualization
- ✅ Responsive design - works on mobile and desktop

### **How Search Works:**
1. User types in search box
2. After 300ms, search runs across all data
3. Filters PGs by name/city/area
4. Filters Users by name/email
5. Filters Owners by name/email
6. Shows up to 5 results per category
7. Click result → Navigate to detail page

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoints Used:**
1. `GET /api/admin/dashboard/stats` - Get statistics
2. `GET /api/admin/dashboard/pg-growth` - PG growth data
3. `GET /api/admin/dashboard/user-signup` - User signup trend
4. `GET /api/admin/dashboard/onboarding` - Onboarding data
5. `GET /api/admin/dashboard/pg-status` - PG status distribution
6. `GET /api/admin/pgs` - All PGs (for search)
7. `GET /api/admin/users` - All users (for search)
8. `GET /api/admin/owners` - All owners (for search)

### **Service Methods:**
```java
// AdminServiceImpl.java
getDashboardStats() - Returns totalPGs, activeOwners, activeUsers, pendingIssues
getPgGrowthData() - Returns monthly PG growth data
getUserSignupTrend() - Returns daily user signups
getOnboardingTrend() - Returns monthly users vs owners
getPgStatusDistribution() - Returns approved vs pending PGs
```

### **How Backend Works:**
1. **Stats Calculation:**
   - Counts total PGs from database
   - Counts active owners (where active = true)
   - Counts active users (where active = true)
   - Counts pending issues (where status != RESOLVED)

2. **Chart Data Generation:**
   - Groups data by month/day
   - Creates time-series data
   - Returns as JSON arrays

---

## 💾 DATABASE

### **Tables Used:**
1. **`pgs`** - PG listings
   - Columns: id, name, city, area, active, created_at

2. **`users`** - Platform users
   - Columns: id, full_name, email, active, created_at

3. **`user_roles`** - User role mappings
   - Determines if user is ROLE_PG_USER or ROLE_PG_OWNER

4. **`issues`** - User-reported issues
   - Columns: id, status, priority, created_at

### **SQL Queries (Simplified):**
```sql
-- Get total PGs
SELECT COUNT(*) FROM pgs;

-- Get active owners
SELECT COUNT(*) FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
WHERE r.name = 'ROLE_PG_OWNER' AND u.active = true;

-- Get PG growth by month
SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
FROM pgs 
GROUP BY month;
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. User navigates to /admin/dashboard
2. Frontend calls 5 API endpoints simultaneously
3. Backend queries database
4. Returns JSON data
5. Frontend updates state
6. Charts and cards render with data
```

### **When User Searches:**
```
1. User types in search box
2. Frontend waits 300ms (debounce)
3. Calls getAllPGs(), getAllUsers(), getAllOwners()
4. Filters results locally in browser
5. Shows dropdown with results
6. User clicks → Navigate to detail page
```

---

## 🎨 UI Components

### **Statistics Cards:**
- **Design:** White cards with colored icons
- **Colors:**
  - PGs: Indigo
  - Owners: Purple
  - Users: Blue
  - Issues: Amber
- **Hover Effect:** Border color change, shadow
- **Click:** Navigate to respective list page

### **Search Bar:**
- **Location:** Top-right corner
- **Width:** 384px (w-96)
- **Icon:** Magnifying glass (Search icon)
- **Dropdown:** Shows when results available
- **Categories:** PGs, Users, Owners

### **Charts:**
- **Library:** Recharts (React charting library)
- **Colors:** Consistent with brand (Indigo/Blue)
- **Responsive:** Adapts to screen size
- **Tooltips:** Show data on hover

---

## 🔐 Authentication

**Required:** Admin must be logged in
**Check:** JWT token in Authorization header
**Redirect:** If not authenticated → /login

---

## 📱 Responsive Design

- **Desktop:** 4 cards in row, 2 charts per row
- **Tablet:** 2 cards in row, 1 chart per row
- **Mobile:** 1 card/chart per row, search bar full width

---

## ⚡ Performance

**Optimizations:**
1. ✅ Parallel API calls (Promise.all)
2. ✅ Search debouncing (300ms)
3. ✅ Limited results (5 per category)
4. ✅ Lazy loading charts
5. ✅ Memoized calculations

---

## 🐛 Error Handling

**If API Fails:**
- Stats show 0
- Charts show empty state
- Search shows "No results"
- Console logs error

**User Experience:**
- Loading state: "Loading Dashboard..."
- Error state: Shows in console
- Empty state: Charts display placeholder

---

## 🚀 Tech Stack

**Frontend:**
- React (UI framework)
- Recharts (Charts library)
- Lucide React (Icons)
- React Router (Navigation)

**Backend:**
- Spring Boot (Java framework)
- JPA/Hibernate (Database ORM)
- MySQL (Database)

**Communication:**
- REST APIs
- JSON format
- Axios HTTP client

---

## 📊 Summary

The Dashboard page is the **central hub** that gives admins a **quick snapshot** of the entire platform. It combines:
- **Real-time statistics**
- **Visual charts**
- **Search functionality**
- **Quick navigation**

All designed to help admins **make informed decisions** and **access information quickly**.
