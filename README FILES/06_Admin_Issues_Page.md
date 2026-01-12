# 🚨 Admin Issues Page

## 🎯 Purpose
Displays **all user-reported issues** (complaints, problems, requests) from the platform. Admins can view, filter, and manage issues.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Issues.jsx`

### **What It Does:**
1. **Shows Issues Table** with columns:
   - Issue ID
   - Title/Subject
   - Reported By (user name)
   - Status (Open/In Progress/Resolved/Closed)
   - Priority (High/Medium/Low)
   - Date Reported

2. **Status Filters:**
   - All Issues
   - Open Only
   - In Progress
   - Resolved/Closed

3. **Priority Indicators:**
   - Color-coded badges
   - Visual hierarchy

4. **Click Row:**
   - Navigate to Issue details (future feature)
   - Or expand inline details

### **Table Layout:**
```
ID │ Title               │ Reported By │ Status      │ Priority │ Date
───┼─────────────────────┼─────────────┼─────────────┼──────────┼──────────
#1 │ Water leakage       │ Alice Kumar │ 🔴 Open     │ 🔴 High  │ Jan 15
#2 │ Wi-Fi not working   │ Bob Singh   │ 🟡 Progress │ 🟡 Med   │ Jan 14
#3 │ AC repair needed    │ Charlie D   │ ✅ Resolved │ 🟢 Low   │ Jan 10
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoint:**
`GET /api/admin/issues`

### **Service Method:**
```java
// AdminServiceImpl.java
public List<IssueDto> getAllIssues() {
    List<Issue> issues = issueRepository.findAll();
    
    return issues.stream()
        .map(issue -> new IssueDto(
            issue.getId(),
            issue.getSubject(),
            issue.getDescription(),
            issue.getStatus(),
            issue.getPriority(),
            issue.getUser().getFullName(),
            issue.getUser().getEmail(),
            issue.getPg() != null ? issue.getPg().getName() : null,
            issue.getCreatedAt()
        ))
        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
        .collect(Collectors.toList());
}
```

### **Response Format:**
```json
[
  {
    "id": 1,
    "subject": "Water leakage in Room 5",
    "description": "There is a water leak from the ceiling...",
    "status": "OPEN",
    "priority": "HIGH",
    "userName": "Alice Kumar",
    "userEmail": "alice@example.com",
    "pgName": "Sunshine PG",
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "subject": "Wi-Fi connection issues",
    "description": "Internet is very slow...",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "userName": "Bob Singh",
    "userEmail": "bob@example.com",
    "pgName": "Moonlight PG",
    "createdAt": "2024-01-14T14:20:00"
  }
]
```

---

## 💾 DATABASE

### **Main Table: `issues`**

| Column       | Type         | Description                    |
|--------------|--------------|--------------------------------|
| id           | BIGINT       | Primary key                    |
| subject      | VARCHAR(255) | Issue title/subject            |
| description  | TEXT         | Detailed description           |
| status       | VARCHAR(50)  | OPEN/IN_PROGRESS/RESOLVED/CLOSED |
| priority     | VARCHAR(20)  | HIGH/MEDIUM/LOW                |
| user_id      | BIGINT       | FK to users (who reported)     |
| pg_id        | BIGINT       | FK to pgs (optional)           |
| created_at   | TIMESTAMP    | When issue was reported        |
| updated_at   | TIMESTAMP    | Last status change             |
| resolved_at  | TIMESTAMP    | When resolved (nullable)       |

### **Related Tables:**

#### **`users` Table:**
Stores user who reported the issue

#### **`pgs` Table:**
If issue is related to a specific PG (optional)

### **SQL Query:**
```sql
SELECT 
  i.id, i.subject, i.description, i.status, i.priority,
  i.created_at, i.updated_at,
  u.full_name as user_name,
  u.email as user_email,
  p.name as pg_name
FROM issues i
LEFT JOIN users u ON i.user_id = u.id
LEFT JOIN pgs p ON i.pg_id = p.id
ORDER BY i.created_at DESC;
```

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. Navigate to /admin/issues
2. Frontend calls GET /api/admin/issues
3. Backend:
   - Queries issues table
   - Joins with users (reporter info)
   - Joins with pgs (if issue has pg_id)
   - Returns sorted by date (newest first)
4. Frontend displays in table
```

### **Status Lifecycle:**
```
OPEN (New issue)
  ↓
IN_PROGRESS (Admin/Owner working on it)
  ↓
RESOLVED (Fixed, awaiting confirmation)
  ↓
CLOSED (Confirmed fixed, issue closed)
```

---

## 🎨 UI Components

### **Status Badges:**

| Status       | Color   | Icon        | Meaning                  |
|--------------|---------|-------------|--------------------------|
| OPEN         | Red     | AlertCircle | New, needs attention     |
| IN_PROGRESS  | Yellow  | Clock       | Being worked on          |
| RESOLVED     | Blue    | CheckCircle | Fixed, verifying         |
| CLOSED       | Green   | Check       | Completed and confirmed  |

### **Priority Badges:**

| Priority | Color  | Visual              |
|----------|--------|---------------------|
| HIGH     | Red    | 🔴 HIGH (bold)      |
| MEDIUM   | Yellow | 🟡 MEDIUM           |
| LOW      | Green  | 🟢 LOW              |

### **Row Colors:**
- **High Priority:** Light red background
- **Medium:** Light yellow background
- **Low:** White background
- **Resolved/Closed:** Light green tint

---

## 📊 Filtering

### **Frontend Filters:**
```javascript
const [selectedStatus, setSelectedStatus] = useState('ALL');

const filteredIssues = issues.filter(issue => {
  if (selectedStatus === 'ALL') return true;
  return issue.status === selectedStatus;
});
```

### **Filter Options:**
- **All Issues** - Shows everything
- **Open** - Only OPEN status
- **In Progress** - Only IN_PROGRESS
- **Resolved** - RESOLVED + CLOSED

---

## 🔗 Navigation

### **To This Page:**
- **Dashboard:** "Pending Issues" card
- **Sidebar:** "Issues" menu

### **From This Page:**
- Future: Click row → Issue detail page
- Or: Inline expand to show full description

---

## 🎯 Admin Actions

### **What Admin Can See:**
1. ✅ All reported issues
2. ✅ Who reported (user details)
3. ✅ Which PG (if applicable)
4. ✅ Current status
5. ✅ Priority level
6. ✅ Timestamp

### **What Admin Can Do (future):**
- Change issue status
- Assign to owner/staff
- Add admin comments
- Mark as resolved
- Close issue

---

## 🔐 Security

### **Access Control:**
- **Required:** Admin login
- **Role:** ROLE_ADMIN
- **Token:** Valid JWT

### **Backend Protection:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/issues")
public ResponseEntity<List<IssueDto>> getAllIssues()
```

### **Data Privacy:**
- ✅ Admin sees all issues
- ⚠️ Users see only their own issues (different endpoint)
- ✅ PG owners see issues for their PGs

---

## 📱 Responsive Design

- **Desktop:** Full table with all columns
- **Tablet:** Scroll horizontally if needed
- **Mobile:** Stacked cards or scrollable table

---

## ⚡ Performance

### **Optimizations:**
1. ✅ Single query with JOINs
2. ✅ Sorted in database (ORDER BY)
3. ✅ Client-side filtering (fast)
4. ✅ Pagination ready (future)

### **Database Indexes:**
```sql
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_pg_id ON issues(pg_id);
```

---

## 🐛 Error Handling

**States:**
- **Loading:** "Loading issues..."
- **Empty:** "No issues reported yet"
- **Filtered Empty:** "No {status} issues"
- **Error:** Console log, empty table

---

## 💡 Issue Reporting Flow

### **User Side:**
```
1. User logs in
2. Reports an issue (form)
3. Issue saved with:
   - subject
   - description
   - user_id (auto)
   - pg_id (optional)
   - status = OPEN
   - priority = MEDIUM (default)
```

### **Admin Side:**
```
1. Admin opens Issues page
2. Sees new issue (status: OPEN)
3. Reviews details
4. Updates status to IN_PROGRESS
5. Notifies PG owner (future)
6. Marks as RESOLVED when fixed
7. User confirms → status = CLOSED
```

---

## 🔄 Integration

### **Related Pages:**
- **ViewUser** - See all issues by specific user
- **ViewPG** - See all issues for specific PG
- **Dashboard** - Shows total pending count

### **Related Features:**
- Email notifications (future)
- Auto-assignment to PG owner (future)
- SLA tracking (resolution time)

---

## 📊 Analytics Potential

### **Future Metrics:**
- **Resolution Time:** Average time to close
- **Issue Trends:** By type, PG, priority
- **User Satisfaction:** Post-resolution ratings
- **Common Issues:** Most reported problems

---

## 🎨 Example Use Case

### **Scenario:**
User reports water leakage

```
1. User submits:
   Subject: "Water leakage in Room 5"
   Description: "Water dripping from ceiling for 2 days"
   PG: Sunshine PG
   
2. Issue created:
   ID: #15
   Status: OPEN
   Priority: HIGH (auto, based on keywords)
   
3. Admin sees on Issues page:
   #15 | Water leakage | Alice Kumar | OPEN | HIGH | Just now
   
4. Admin updates:
   status → IN_PROGRESS
   Notifies owner
   
5. Owner fixes leak
   Admin updates: status → RESOLVED
   
6. User confirms fix
   System updates: status → CLOSED
```

---

## 📋 Summary

The **Issues Page** is the **ticket management system** for the platform. It:
- ✅ Centralizes all user complaints
- ✅ Tracks issue lifecycle (Open → Closed)
- ✅ Prioritizes urgent problems
- ✅ Provides visibility to admins
- ✅ Links issues to users and PGs

**Essential for:**
- **Quality control**
- **User satisfaction**
- **Problem resolution**
- **Platform maintenance**

This page helps ensure **quick issue resolution** and **happy users**! 🎯
