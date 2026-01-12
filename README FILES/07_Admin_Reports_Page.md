# 📊 Admin Reports Page

## 🎯 Purpose
Provides **analytics and historical insights** about the platform. Shows trends, statistics, and distributions through charts and reports.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Reports.jsx`

### **What It Does:**
Displays **4 analytical reports** in a clean grid layout:

1. **User Growth Report**
   - Total Users count
   - Total Owners count
   - Line chart (future: time-series)

2. **PG Status Distribution**
   - Approved vs Pending PGs
   - Donut chart with percentages

3. **Issue Analytics**
   - Open issues count
   - In Progress count
   - Resolved count
   - Bar chart visualization

4. **Location-wise PG Distribution**
   - PG count by city/area
   - Bar chart + data table

### **Page Layout:**
```
┌─────────────────────────────────────────┐
│  Analytics & Reports                     │
├─────────────────────────────────────────┤
│  Filter Section (Date, Entity Type)     │
├─────────────────────────────────────────┤
│  Report Summary (4 key metrics)          │
├──────────────────┬──────────────────────┤
│  User Growth     │  PG Status           │
│  Report          │  Distribution        │
├──────────────────┼──────────────────────┤
│  Issue Analytics │  Location            │
│                  │  Distribution        │
└──────────────────┴──────────────────────┘
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/reports`

### **Service Method:**
```java
// AdminServiceImpl.java
public ReportDataDto getReportData() {
    ReportDataDto report = new ReportDataDto();
    
    // 1. User Growth
    List<User> users = userRepository.findByRoles_Name("ROLE_PG_USER");
    List<User> owners = userRepository.findByRoles_Name("ROLE_PG_OWNER");
    UserGrowthReport userGrowth = new UserGrowthReport();
    userGrowth.setTotalUsers(users.size());
    userGrowth.setTotalOwners(owners.size());
    report.setUserGrowth(userGrowth);
    
    // 2. PG Status
    long approved = pgRepository.countByActiveTrue();
    long total = pgRepository.count();
    long pending = total - approved;
    report.setPgStatus(new PgStatusReport(approved, pending, total));
    
    // 3. Issue Analytics
    long open = issues with status = OPEN;
    long inProgress = issues with status = IN_PROGRESS;
    long resolved = issues with status = RESOLVED/CLOSED;
    report.setIssueAnalytics(new IssueAnalyticsReport(...));
    
    // 4. Location Distribution
    Map<String, Long> locationGroups = pgRepository.findAll()
        .stream()
        .collect(groupingBy(
            pg -> pg.getArea() + ", " + pg.getCity(),
            counting()
        ));
    report.setLocationDistribution(locationGroups);
    
    return report;
}
```

### **Response Format:**
```json
{
  "userGrowth": {
    "totalUsers": 150,
    "totalOwners": 12,
    "data": []  // Future: time-series data
  },
  "pgStatus": {
    "approved": 25,
    "pending": 5,
    "total": 30
  },
  "issueAnalytics": {
    "open": 8,
    "inProgress": 3,
    "resolved": 15,
    "total": 26
  },
  "locationDistribution": [
    {"location": "Koramangala, Bangalore", "count": 12},
    {"location": "HSR Layout, Bangalore", "count": 8},
    {"location": "Indiranagar, Bangalore", "count": 5}
  ]
}
```

---

## 💾 DATABASE

### **Tables Queried:**

#### **1. `users` + `user_roles`**
```sql
-- User Growth
SELECT COUNT(*) FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'ROLE_PG_USER';

-- Owner Growth
WHERE r.name = 'ROLE_PG_OWNER';
```

#### **2. `pgs`**
```sql
-- PG Status Distribution
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as approved,
  SUM(CASE WHEN active = false THEN 1 ELSE 0 END) as pending
FROM pgs;

-- Location Distribution
SELECT 
  CONCAT(area, ', ', city) as location,
  COUNT(*) as count
FROM pgs
GROUP BY area, city
ORDER BY count DESC;
```

#### **3. `issues`**
```sql
-- Issue Analytics
SELECT 
  SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open,
  SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status IN ('RESOLVED', 'CLOSED') THEN 1 ELSE 0 END) as resolved,
  COUNT(*) as total
FROM issues;
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. Navigate to /admin/reports
2. Show loading state
3. Frontend calls GET /api/admin/reports
4. Backend:
   - Queries users for growth data
   - Queries pgs for status & location
   - Queries issues for analytics
   - Aggregates all data
   - Returns single ReportDataDto object
5. Frontend:
   - Receives data
   - Renders 4 report cards
   - Displays charts using Recharts
   - Shows summary metrics
```

---

## 🎨 Report Components

### **1. User Growth Report 📈**
**Displays:**
- Total Users (blue card)
- Total Owners (purple card)
- Placeholder for future time-series chart

**Future Enhancement:**
```javascript
// Timeline data by month
data: [
  {date: "Jan 2024", users: 100, owners: 8},
  {date: "Feb 2024", users: 125, owners: 10},
  {date: "Mar 2024", users: 150, owners: 12}
]
```

### **2. PG Status Distribution 🏢**
**Chart Type:** Donut Chart (Pie with innerRadius)

**Data:**
```javascript
[
  {name: 'Approved', value: 25, color: '#10b981'}, // Green
  {name: 'Pending', value: 5, color: '#f59e0b'}    // Yellow
]
```

**Visual:**
```
     ┌──────┐
     │      │
   ┌─┘  83% │
   │   Approved
   │         │
   └────┐    │
        │ 17%│
        │Pending
        └────┘
```

### **3. Issue Analytics 🚨**
**Chart Type:** Bar Chart

**Data:**
```javascript
[
  {name: 'Open', value: 8, color: '#ef4444'},        // Red
  {name: 'In Progress', value: 3, color: '#f59e0b'}, // Yellow
  {name: 'Resolved', value: 15, color: '#10b981'}    // Green
]
```

**Visual:**
```
15 ┤     ███
   ┤     ███
10 ┤     ███
   ┤ ███ ███
 5 ┤ ███ ███
   ┤ ███ ███ ███
 0 └─┴───┴───┴───
   Open│Prog│Resolved
```

### **4. Location Distribution 🗺️**
**Components:**
- Bar Chart (horizontal)
- Data Table

**Data:**
```
Koramangala, Bangalore    ████████████ 12 PGs
HSR Layout, Bangalore     ████████ 8 PGs
Indiranagar, Bangalore    █████ 5 PGs
Whitefield, Bangalore     ███ 3 PGs
```

---

## 📊 Summary Section

### **Top of Page:**
4 key metrics displayed prominently:

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Platform     │ Active       │ Open         │ Locations    │
│ Users        │ PGs          │ Issues       │ Covered      │
│              │              │              │              │
│    162       │     25       │      8       │      4       │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Calculation:**
- **Platform Users:** totalUsers + totalOwners
- **Active PGs:** approved count
- **Open Issues:** open issues count
- **Locations:** unique area+city combinations

---

## 🎨 UI Features

### **Filter Section (UI Only for MVP):**
- **Date Range Picker** (not functional yet)
- **Entity Type Dropdown** (not functional yet)
- **Apply Filters Button** (not functional yet)

**Future:** Will filter reports by date range

### **Chart Library:**
**Recharts** - React charting library
- Responsive containers
- Interactive tooltips
- Legend support
- Color customization

### **Color Scheme:**
- **Approved/Resolved:** Green (#10b981)
- **Pending/In Progress:** Yellow (#f59e0b)
- **Open/Issues:** Red (#ef4444)
- **Info/General:** Blue/Indigo (#6366f1)

---

## 🔐 Security

### **Access Control:**
- **Required:** Admin authentication
- **Role:** ROLE_ADMIN only

### **Backend Protection:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/reports")
public ResponseEntity<ReportDataDto> getReportData()
```

---

## 📱 Responsive Design

- **Desktop:** 2 columns, 4 cards (2×2 grid)
- **Tablet:** 1 column, 4 cards stacked
- **Mobile:** 1 column, scrollable

---

## ⚡ Performance

### **Optimizations:**
1. ✅ Single API call for all reports
2. ✅ Aggregations done in backend
3. ✅ Charts render client-side
4. ✅ No polling (static data)

### **Future Optimizations:**
- Cache report data (5-minute cache)
- Pagination for location table
- Lazy load charts
- Progressive data loading

---

## 🎯 Use Cases

### **1. Monthly Review:**
Admin checks growth trends:
- How many new users?
- How many PGs approved?
- Issue resolution rate?

### **2. Location Planning:**
Identify underserved areas:
- Which locations have few PGs?
- Where to focus marketing?

### **3. Quality Monitoring:**
Track issue trends:
- Are issues increasing?
- What types are common?
- Resolution time improving?

### **4. Business Intelligence:**
Overall platform health:
- User base growing?
- Owner acquisition?
- Operational efficiency?

---

## 🔄 Integration

### **Related Pages:**
- **Dashboard:** Real-time stats
- **Issues:** Detailed issue list
- **AllPGs:** Detailed PG list
- **Users/Owners:** User lists

### **Data Sources:**
- Same database tables
- Aggregated for analytics
- Historical perspective

---

## 💡 Report vs Dashboard

| Aspect           | Dashboard              | Reports                     |
|------------------|------------------------|-----------------------------|
| **Purpose**      | Real-time overview     | Historical analysis         |
| **Update**       | Always current         | Snapshot in time            |
| **Charts**       | Trends over time       | Distributions & breakdowns  |
| **Detail Level** | High-level             | Aggregate & grouped         |
| **Use Case**     | Daily monitoring       | Strategic decisions         |

---

## 📋 Future Enhancements

### **Phase 2 Features:**
1. **Date Filtering:**
   - Select date ranges
   - Compare periods

2. **Export:**
   - Download as PDF
   - Export to CSV/Excel

3. **Time-Series:**
   - User growth over time
   - PG additions by month
   - Issue trends

4. **Advanced Analytics:**
   - Revenue metrics (if bookings exist)
   - Conversion rates
   - Churn analysis

5. **Scheduled Reports:**
   - Email weekly/monthly reports
   - Automated generation

---

## 📊 Summary

The **Reports Page** provides **actionable insights** through:
- ✅ **Visual charts** (easy to understand)
- ✅ **Key metrics** (at-a-glance summary)
- ✅ **Data distributions** (location, status, issues)
- ✅ **Growth tracking** (users, owners, PGs)

**Benefits:**
- Informed decision-making
- Trend identification
- Performance monitoring
- Strategic planning

**Essential for:** Long-term **platform growth** and **data-driven management**! 📈
