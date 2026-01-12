# 🏢 NammaPG - Owner Dashboard Design Document

## 📋 Table of Contents
1. [Overview](#overview)
2. [User Persona](#user-persona)
3. [Dashboard Structure](#dashboard-structure)
4. [Page-by-Page Design](#page-by-page-design)
5. [Component Library](#component-library)
6. [UX Flow](#ux-flow)
7. [Data Requirements](#data-requirements)
8. [API Specifications](#api-specifications)
9. [MVP vs Future Features](#mvp-vs-future-features)
10. [Technical Implementation](#technical-implementation)

---

## 🎯 Overview

### **Product Vision**
A clean, data-driven dashboard for PG owners to manage multiple properties, track occupancy, monitor resident satisfaction, and respond to issues efficiently.

### **Key Principles**
- ✅ **Data-First Design** - Every metric tells a story
- ✅ **Mobile-Responsive** - Works on all devices
- ✅ **MVP-Focused** - Launch fast, iterate quickly
- ✅ **Owner-Scoped** - No admin-level access
- ✅ **Action-Oriented** - Easy quick actions
- ✅ **Clean UI** - Minimal, modern design

### **Scope**
- **In Scope:** PG management, resident tracking, issue handling, reviews
- **Out of Scope (MVP):** Financial accounting, payments, booking system

---

## 👤 User Persona

### **Primary User: PG Owner**

**Name:** Rajesh Kumar  
**Age:** 35-50  
**Tech Savvy:** Medium  
**Owns:** 1-10 PGs  
**Location:** Major Indian cities  

**Goals:**
- Monitor all PGs at a glance
- Respond to issues quickly
- Track occupancy and growth
- Improve ratings
- Reduce vacant beds

**Pain Points:**
- Too many phone calls from residents
- Hard to track multiple properties
- Issues get lost
- Can't see which PG needs attention
- No data to make decisions

**Daily Workflow:**
1. Morning: Check dashboard for new issues/reviews
2. Midday: Respond to resident complaints
3. Evening: Review occupancy and bookings
4. Weekly: Compare PG performance
5. Monthly: Analyze trends

---

## 🏗️ Dashboard Structure

### **Navigation Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  NammaPG Owner Dashboard         [Bell] [Profile] [Logout]  │
├───────────┬─────────────────────────────────────────────────┤
│           │                                                 │
│  Sidebar  │             Main Content Area                   │
│           │                                                 │
│  • Home   │                                                 │
│  • My PGs │                                                 │
│  • Analytics│                                               │
│  • Settings│                                                │
│           │                                                 │
│  [+ Add PG]│                                                │
│           │                                                 │
└───────────┴─────────────────────────────────────────────────┘
```

### **Page Hierarchy**

```
Owner Dashboard
├── 1. Dashboard Home (Overview)
│   └── Quick stats + PG cards + graphs
│
├── 2. My PGs
│   ├── PG List View
│   └── PG Detail Page
│       ├── Overview
│       ├── Residents
│       ├── Issues & Complaints
│       └── Reviews & Ratings
│
├── 3. Analytics
│   ├── PG Comparison
│   └── Insights
│
└── 4. Settings
    ├── Profile
    ├── Notifications
    └── Security
```

---

## 📄 Page-by-Page Design

## **PAGE 1: Dashboard Home (Overview)**

### **Purpose**
Give owner a **complete snapshot** of all properties at a glance.

### **Layout**

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard Home                                [Last 30 days]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Total PGs│Residents │Occupancy │ Issues   │ Avg Rating│  │
│  │    5     │   145    │   82%    │    12    │    4.2    │  │
│  │ ──────── │ ──────── │ ──────── │ ──────── │ ──────── │  │
│  │ +2 new   │ +8 new   │ +5%      │ 3 urgent │ +0.3     │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                                                              │
│  Your PGs                                    [View All →]   │
│  ┌────────────────┬────────────────┬────────────────┐      │
│  │ Sunshine PG    │ Moonlight PG   │ StarLight PG   │      │
│  │ Koramangala    │ HSR Layout     │ Indiranagar    │      │
│  │                │                │                │      │
│  │ 28/30 Occupied │ 15/20 Occupied │ 22/25 Occupied │      │
│  │ 93% Occupancy  │ 75% Occupancy  │ 88% Occupancy  │      │
│  │ ⭐ 4.5         │ ⭐ 4.0         │ ⭐ 4.3         │      │
│  │ 🔴 3 Issues    │ 🟢 0 Issues    │ 🟡 1 Issue     │      │
│  │ +5 New (30d)   │ +2 New (30d)   │ +3 New (30d)   │      │
│  └────────────────┴────────────────┴────────────────┘      │
│                                                              │
│  Performance Graphs                                         │
│  ┌────────────────────────────┬────────────────────────────┐│
│  │ Resident Growth            │ Occupancy Trend            ││
│  │ (Monthly)                  │ (Weekly)                   ││
│  │      ▁▂▃▄▅▆█               │      ─────────█            ││
│  │                            │                            ││
│  └────────────────────────────┴────────────────────────────┘│
│  ┌────────────────────────────┬────────────────────────────┐│
│  │ Issues Trend               │ Ratings Trend              ││
│  │ Raised vs Resolved         │ (Monthly Average)          ││
│  │      █ Raised              │      ⭐⭐⭐⭐              ││
│  │      █ Resolved            │                            ││
│  └────────────────────────────┴────────────────────────────┘│
│                                                              │
│  Recent Activity                                            │
│  • New review received for Sunshine PG - 5 mins ago         │
│  • New issue raised at Moonlight PG - 1 hour ago            │
│  • New resident joined StarLight PG - 2 hours ago           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### **Components**

#### **1. Summary Cards (Top Row)**

**Component:** `SummaryCard`

**Props:**
```javascript
{
  title: "Total PGs",
  value: 5,
  change: "+2",
  changeType: "positive", // positive/negative/neutral
  icon: "Building",
  color: "indigo"
}
```

**MVP Features:**
- Display metric value
- Show trend (up/down arrow)
- Color-coded by type

**Future Features:**
- Click to filter
- Compare periods (This month vs Last month)
- Drill-down to details

---

#### **2. PG Quick Cards**

**Component:** `PGQuickCard`

**Props:**
```javascript
{
  pgId: 1,
  pgName: "Sunshine PG",
  location: "Koramangala, Bangalore",
  occupiedBeds: 28,
  totalBeds: 30,
  occupancyRate: 93,
  rating: 4.5,
  issuesCount: 3,
  urgentIssuesCount: 2,
  newResidents30d: 5
}
```

**Design:**
```
┌──────────────────────────┐
│ Sunshine PG              │
│ Koramangala              │
│                          │
│ 28/30 Occupied           │
│ ████████████░░ 93%       │← Progress bar
│                          │
│ ⭐ 4.5  🔴 3 Issues      │
│ +5 New Residents         │
│                          │
│ [View Details →]         │
└──────────────────────────┘
```

**Click Action:** Navigate to PG Detail Page

---

#### **3. Performance Graphs**

**Component:** `PerformanceGraph`

**Types:**
1. **Resident Growth** (Line Chart)
   - Data: Monthly new residents
   - X-axis: Last 6 months
   - Y-axis: Number of residents

2. **Occupancy Trend** (Area Chart)
   - Data: Weekly occupancy %
   - X-axis: Last 8 weeks
   - Y-axis: Occupancy %

3. **Issues Trend** (Stacked Bar Chart)
   - Data: Issues raised vs resolved
   - X-axis: Last 6 months
   - Y-axis: Issue count

4. **Ratings Trend** (Line Chart)
   - Data: Monthly average rating
   - X-axis: Last 6 months
   - Y-axis: Rating (1-5)

**Library:** Recharts (already used in Admin)

---

#### **4. Recent Activity Feed**

**Component:** `ActivityFeed`

**Items:**
- New review
- New issue
- New resident
- Issue resolved
- Resident left

**Design:**
```
Recent Activity
• 🌟 New review received for Sunshine PG - 5 mins ago
• 🚨 New issue raised at Moonlight PG - 1 hour ago
• 👤 New resident joined StarLight PG - 2 hours ago
• ✅ Issue resolved at Sunshine PG - 3 hours ago
```

---

## **PAGE 2: My PGs (List View)**

### **Purpose**
Show all PGs owned by the user in a table/grid format.

### **Layout**

```
┌──────────────────────────────────────────────────────────────┐
│  My PGs                             [+ Add New PG]  [Filter] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Search PGs...]                     [Grid View] [List View]│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │PG Name      │Location    │Occupancy│Rating│Issues│Actions││
│  ├──────────────────────────────────────────────────────────┤│
│  │Sunshine PG  │Koramangala │28/30    │⭐4.5 │🔴 3  │[View] ││
│  │             │            │(93%)    │      │      │[Edit] ││
│  ├──────────────────────────────────────────────────────────┤│
│  │Moonlight PG │HSR Layout  │15/20    │⭐4.0 │🟢 0  │[View] ││
│  │             │            │(75%)    │      │      │[Edit] ││
│  ├──────────────────────────────────────────────────────────┤│
│  │StarLight PG │Indiranagar │22/25    │⭐4.3 │🟡 1  │[View] ││
│  │             │            │(88%)    │      │      │[Edit] ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### **Components**

#### **PG Table**

**Columns:**
1. PG Name + Image
2. Location (Area, City)
3. Occupancy (Occupied/Total + %)
4. Average Rating
5. Open Issues (color-coded)
6. Quick Actions

**Filters:**
- All PGs
- High Occupancy (>80%)
- Low Occupancy (<60%)
- Has Issues
- Low Rated (<4.0)

**Sort By:**
- Name
- Occupancy (high to low)
- Rating (high to low)
- Issues (high to low)

---

## **PAGE 3: PG Detail Page** ⭐ **MOST IMPORTANT**

### **Purpose**
Complete view of a single PG with all metrics, residents, issues, and reviews.

### **Layout**

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to My PGs                       [Edit PG] [Settings] │
├──────────────────────────────────────────────────────────────┤
│  🏢 Sunshine PG                              ⭐ 4.5 (125 reviews)│
│  📍 #42, 1st Cross, Koramangala, Bangalore                   │
│  🏷️ Boys PG  •  Active  •  Last updated: 2 days ago         │
│                                                              │
│  [Overview] [Residents] [Issues] [Reviews]                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  OVERVIEW TAB                                                │
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │Total Beds│ Occupied │ Vacant   │ Revenue  │New (30d) │  │
│  │    30    │    28    │    2     │   ₹84K   │    5     │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                                                              │
│  Room Distribution                                          │
│  ┌────────────────────────────────────────┐                │
│  │ Single Sharing:   5 rooms (10 beds)    │                │
│  │ Double Sharing:   8 rooms (16 beds)    │                │
│  │ Triple Sharing:   2 rooms (6 beds)     │                │
│  └────────────────────────────────────────┘                │
│                                                              │
│  Facilities                                                 │
│  ✅ Food     ✅ Wi-Fi    ✅ Laundry                          │
│  ✅ Parking  ✅ AC       ❌ Gym                              │
│                                                              │
│  Occupancy Trend (Last 6 months)                            │
│  ▁▂▃▄▅▆█                                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### **OVERVIEW TAB**

**Component:** `PGOverview`

**Data Displayed:**

1. **Basic Info**
   - PG Name
   - Full Address
   - PG Type (Boys/Girls/Co-living)
   - Status (Active/Maintenance/Hidden)

2. **Capacity Metrics**
   - Total Beds
   - Occupied Beds
   - Vacant Beds
   - Occupancy Rate (%)

3. **Growth Metrics**
   - New Residents (30 days)
   - Residents Left (30 days)
   - Net Growth

4. **Room Distribution**
   - Single/Double/Triple sharing
   - Rooms and beds breakdown

5. **Facilities List**
   - Food, Wi-Fi, Laundry, etc.
   - Visual checkmarks

6. **Occupancy Trend Graph**
   - Last 6 months
   - Shows seasonal patterns

---

### **RESIDENTS TAB**

```
┌──────────────────────────────────────────────────────────────┐
│  RESIDENTS (28)                      [Search] [+ Add Resident]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Active   │ Pending  │ New (30d)│ Leaving  │             │
│  │   28     │    2     │    5     │    1     │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                              │
│  Resident List                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │Name       │Room    │Joined     │Contact     │Status     ││
│  ├──────────────────────────────────────────────────────────┤│
│  │Amit Kumar │Room 5  │Jan 1,2024 │9876543210  │✅ Active  ││
│  │           │Bed 1   │(15 days)  │            │          ││
│  ├──────────────────────────────────────────────────────────┤│
│  │Ravi Shah  │Room 5  │Dec 15,2023│9123456789  │✅ Active  ││
│  │           │Bed 2   │(1 month)  │            │          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Recent Joinings                                            │
│  • Amit Kumar joined Room 5 - 15 days ago                   │
│  • Priya Sharma joined Room 12 - 20 days ago                │
│                                                              │
│  Upcoming Departures                                        │
│  • John Doe (Room 8) - Checkout in 5 days                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component:** `ResidentsList`

**Features:**

1. **Summary Cards**
   - Active residents
   - Pending move-ins
   - New joinings (30d)
   - Leaving soon

2. **Resident Table**
   - Name
   - Room & Bed number
   - Join date
   - Contact
   - Status

3. **Filters**
   - All
   - New (joined in last 30 days)
   - Leaving soon

4. **Search**
   - By name
   - By room number

5. **Actions**
   - View resident details
   - Contact resident
   - Mark as leaving

**MVP:** Read-only list  
**Future:** Add/Edit residents, room assignment

---

### **ISSUES & COMPLAINTS TAB**

```
┌──────────────────────────────────────────────────────────────┐
│  ISSUES & COMPLAINTS (12)                    [Filter] [Export]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Open     │ Progress │ Resolved │ Urgent   │             │
│  │    8     │    2     │    2     │    3     │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │Issue              │Priority│Status  │Date       │Action ││
│  ├──────────────────────────────────────────────────────────┤│
│  │Water leakage in   │🔴 High │Open    │Jan 10     │[Mark  ││
│  │Room 5             │        │        │           │Resolved│
│  │Reported by: Amit  │        │        │           │Comment]││
│  ├──────────────────────────────────────────────────────────┤│
│  │Wi-Fi not working  │🟡 Med  │Progress│Jan 9      │[Update││
│  │Reported by: Ravi  │        │        │           │Status] ││
│  ├──────────────────────────────────────────────────────────┤│
│  │AC repair needed   │🟢 Low  │Resolved│Jan 5      │[View]  ││
│  │Reported by: John  │        │        │           │        ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Issue Categories Breakdown                                 │
│  • Maintenance: 5 issues                                    │
│  • Food Quality: 3 issues                                   │
│  • Cleanliness: 2 issues                                    │
│  • Others: 2 issues                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component:** `IssuesList`

**Features:**

1. **Summary Cards**
   - Open issues
   - In Progress
   - Resolved
   - Urgent (high priority)

2. **Issue Table**
   - Issue title/description
   - Priority (High/Medium/Low)
   - Status (Open/Progress/Resolved)
   - Reported date
   - Reported by (resident name)
   - Actions

3. **Priority Colors**
   - 🔴 High (Red)
   - 🟡 Medium (Yellow)
   - 🟢 Low (Green)

4. **Status Workflow**
   ```
   Open → In Progress → Resolved
   ```

5. **Owner Actions**
   - Mark as In Progress
   - Mark as Resolved
   - Add comment
   - View full details

6. **Filters**
   - All
   - Open only
   - High priority
   - By category

7. **Category Breakdown**
   - Pie chart or list
   - Shows most common issues

**MVP Features:**
- View all issues
- Change status
- Add simple comment

**Future Features:**
- Assign to staff
- Attach photos
- Set due dates
- Email notifications
- Issue templates

---

### **REVIEWS & RATINGS TAB**

```
┌──────────────────────────────────────────────────────────────┐
│  REVIEWS & RATINGS                        [Filter] [Download]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Overall Rating: 4.5 ⭐⭐⭐⭐⭐     (125 reviews)             │
│                                                              │
│  Category Ratings                                           │
│  ┌────────────────────────────────────────┐                │
│  │ Cleanliness  ████████░░ 4.6 ⭐          │                │
│  │ Food Quality ███████░░░ 4.3 ⭐          │                │
│  │ Safety       █████████░ 4.7 ⭐          │                │
│  │ Maintenance  ███████░░░ 4.2 ⭐          │                │
│  │ Value        ████████░░ 4.5 ⭐          │                │
│  └────────────────────────────────────────┘                │
│                                                              │
│  Rating Distribution                                        │
│  5 ⭐ ████████████████████ 75 (60%)                         │
│  4 ⭐ ██████████ 30 (24%)                                   │
│  3 ⭐ ████ 12 (10%)                                         │
│  2 ⭐ ██ 5 (4%)                                             │
│  1 ⭐ █ 3 (2%)                                              │
│                                                              │
│  Recent Reviews                  [Most Recent] [Highest] [Lowest]│
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ⭐⭐⭐⭐⭐ 5.0                       by Amit K. - Jan 10  ││
│  │ "Excellent PG with all facilities. Food is great!"      ││
│  │ [Reply] [Report]                                         ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ⭐⭐⭐⭐ 4.0                          by Ravi S. - Jan 8  ││
│  │ "Good place but Wi-Fi could be faster"                  ││
│  │ 💬 Owner: "We're upgrading the Wi-Fi this week!"        ││
│  │ [Reply] [Report]                                         ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Ratings Trend (Last 6 months)                              │
│  ▁▂▃▄▅▆█                                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component:** `ReviewsRatings`

**Features:**

1. **Overall Rating**
   - Average rating (1-5)
   - Total review count
   - Star visualization

2. **Category Ratings**
   - Cleanliness
   - Food Quality
   - Safety
   - Maintenance
   - Value for Money
   - Progress bars with scores

3. **Rating Distribution**
   - Horizontal bar chart
   - Shows 5★, 4★, 3★, 2★, 1★ breakdown
   - Percentage and count

4. **Review List**
   - Rating stars
   - Review text
   - Reviewer name (anonymous option)
   - Date posted
   - Owner reply (if exists)

5. **Owner Actions**
   - Reply to review
   - Report inappropriate review
   - Mark as helpful

6. **Filters**
   - Most recent
   - Highest rated
   - Lowest rated
   - By category

7. **Ratings Trend**
   - Line chart showing monthly average
   - Identify improving/declining trends

**MVP Features:**
- View all reviews
- See ratings breakdown
- Simple text reply

**Future Features:**
- Rich text replies
- Review moderation
- Thank reviewer
- Share positive reviews
- Review reminders

---

## **PAGE 4: Analytics**

### **Purpose**
Compare PG performance and get actionable insights.

### **Layout**

```
┌──────────────────────────────────────────────────────────────┐
│  Analytics                               [Last 30 Days ▼]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PG Comparison                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │PG Name    │Occupancy│Rating│Issues│Revenue│Growth(30d) ││
│  ├──────────────────────────────────────────────────────────┤│
│  │Sunshine   │ 93% ↑   │ 4.5  │ 3    │ ₹84K  │ +5         ││
│  │Moonlight  │ 75% ↓   │ 4.0  │ 0    │ ₹60K  │ +2         ││
│  │StarLight  │ 88% ↑   │ 4.3  │ 1    │ ₹66K  │ +3         ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Key Insights                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🏆 Best Performer                                        ││
│  │ Sunshine PG (93% occupancy, 4.5 rating)                 ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ⚠️ Needs Attention                                       ││
│  │ Moonlight PG (Low occupancy: 75%, -5% from last month)  ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ 🚨 High Complaints                                       ││
│  │ Sunshine PG (3 open issues - water and Wi-Fi)           ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ 📈 Highest Growth                                        ││
│  │ Sunshine PG (+5 new residents this month)               ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ 📉 Rating Drop                                           ││
│  │ StarLight PG (4.3 → 4.1, -0.2 from last month)          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Performance Trends                                         │
│  [Charts showing all PGs comparison over time]              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Component:** `Analytics`

**Features:**

1. **PG Comparison Table**
   - Side-by-side metrics
   - Color-coded trends
   - Sortable columns

2. **Automated Insights**
   - Best performing PG
   - PG needing attention
   - Highest complaints
   - Highest growth
   - Rating drops

3. **Performance Trends**
   - Multi-line charts
   - Compare all PGs
   - Identify patterns

4. **Time Period Filters**
   - Last 7 days
   - Last 30 days
   - Last 3 months
   - Last 6 months

**MVP Features:**
- Basic comparison table
- Simple insights

**Future Features:**
- Advanced analytics
- Predictive insights
- Revenue forecasting
- Seasonal analysis
- Export reports

---

## **PAGE 5: Settings**

### **Purpose**
Owner profile and dashboard preferences.

### **Layout**

```
┌──────────────────────────────────────────────────────────────┐
│  Settings                                                    │
├──────────────────────────────────────────────────────────────┤
│  [Profile] [Notifications] [Security] [PG Visibility]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PROFILE TAB                                                │
│                                                              │
│  Personal Information                                       │
│  ┌────────────────────────────────────────┐                │
│  │ Full Name:      [Rajesh Kumar        ] │                │
│  │ Email:          [rajesh@example.com  ] │                │
│  │ Phone:          [+91 9876543210      ] │                │
│  │ Alt Phone:      [+91 9123456789      ] │                │
│  └────────────────────────────────────────┘                │
│                                                              │
│  Business Information                                       │
│  ┌────────────────────────────────────────┐                │
│  │ Company Name:   [Kumar Properties    ] │                │
│  │ GST Number:     [29ABCDE1234F1Z5     ] │                │
│  │ PAN:            [ABCDE1234F          ] │                │
│  └────────────────────────────────────────┘                │
│                                                              │
│  [Save Changes]                                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Tabs:**

### **1. Profile Tab**
- Personal information
- Business details
- Contact preferences

### **2. Notifications Tab**
```
Email Notifications
☑️ New issue raised
☑️ New review received
☑️ New booking
□  Daily summary
□  Weekly report

Push Notifications
☑️ Urgent issues
☑️ Low occupancy alerts
□  New resident
□  Resident leaving
```

### **3. Security Tab**
- Change password
- Two-factor authentication
- Active sessions
- Login history

### **4. PG Visibility Tab**
```
PG Visibility Control

Sunshine PG        [✅ Active - Visible to users]
Moonlight PG       [✅ Active - Visible to users]
StarLight PG       [🔄 Maintenance - Hidden from search]
```

---

## 🧩 Component Library

### **Reusable Components**

1. **SummaryCard**
   - Display metric with trend
   - Color variants
   - Icon support

2. **PGQuickCard**
   - PG snapshot
   - Click to navigate
   - Status indicators

3. **StatCard**
   - Simple stat display
   - No trends

4. **PerformanceGraph**
   - Line/Area/Bar charts
   - Recharts wrapper

5. **DataTable**
   - Sortable
   - Filterable
   - Pagination

6. **StatusBadge**
   - Active/Inactive/Maintenance
   - Open/Progress/Resolved
   - Color-coded

7. **PriorityBadge**
   - High/Medium/Low
   - Color-coded

8. **RatingDisplay**
   - Star visualization
   - Numeric score

9. **ProgressBar**
   - Occupancy indicator
   - Category ratings

10. **ActivityItem**
    - Icon + text + timestamp
    - For activity feeds

11. **IssueCard**
    - Issue display with actions
    - Expandable details

12. **ReviewCard**
    - Rating + text
    - Reply option

---

## 🔄 UX Flow

### **Primary User Journey**

```
1. Login
   ↓
2. Land on Dashboard Home
   ↓
3. See all PG metrics at glance
   ↓
4. Click on PG card (e.g., Sunshine PG)
   ↓
5. PG Detail Page opens
   ↓
6. Check "Issues" tab
   ↓
7. See "Water leakage" issue
   ↓
8. Click "Mark as Resolved"
   ↓
9. Add comment: "Fixed by plumber today"
   ↓
10. Issue status updated
    ↓
11. Go back to Dashboard
    ↓
12. Issue count reduced
```

### **Alternative Flows**

**Flow 2: Review Management**
```
Dashboard → Check notification "New review" 
→ Click notification 
→ PG Detail Page (Reviews tab) 
→ Read review 
→ Reply to review 
→ Saved
```

**Flow 3: Resident Tracking**
```
Dashboard → My PGs 
→ Select PG 
→ Residents tab 
→ See new joinings 
→ Export resident list
```

**Flow 4: Performance Comparison**
```
Dashboard → Analytics 
→ View PG comparison 
→ Identify low-performing PG 
→ Click on PG 
→ Check issues/reviews 
→ Take action
```

---

## 📊 Data Requirements

### **Data Models**

#### **1. Owner**
```javascript
{
  id: 1,
  fullName: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+919876543210",
  companyName: "Kumar Properties",
  gstNumber: "29ABCDE1234F1Z5",
  createdAt: "2023-01-15",
  active: true
}
```

#### **2. PG**
```javascript
{
  id: 1,
  ownerId: 1,
  name: "Sunshine PG",
  area: "Koramangala",
  city: "Bangalore",
  fullAddress: "#42, 1st Cross, Koramangala",
  pgType: "Boys", // Boys/Girls/Co-living
  status: "Active", // Active/Maintenance/Hidden
  totalBeds: 30,
  occupiedBeds: 28,
  singleRooms: 5,
  doubleRooms: 8,
  tripleRooms: 2,
  facilities: ["Food", "Wi-Fi", "Laundry", "Parking", "AC"],
  createdAt: "2023-06-01",
  averageRating: 4.5,
  reviewCount: 125
}
```

#### **3. Resident**
```javascript
{
  id: 1,
  pgId: 1,
  fullName: "Amit Kumar",
  email: "amit@example.com",
  phone: "+919876543210",
  roomNumber: 5,
  bedNumber: 1,
  joinDate: "2024-01-01",
  status: "Active", // Active/Pending/Left
  planType: "Monthly",
  rent: 8000
}
```

#### **4. Issue**
```javascript
{
  id: 1,
  pgId: 1,
  residentId: 1,
  title: "Water leakage in Room 5",
  description: "Water is dripping from ceiling",
  category: "Maintenance",
  priority: "High", // High/Medium/Low
  status: "Open", // Open/InProgress/Resolved
  reportedAt: "2024-01-10T10:30:00",
  resolvedAt: null,
  ownerComment: null
}
```

#### **5. Review**
```javascript
{
  id: 1,
  pgId: 1,
  residentId: 1,
  overallRating: 5,
  cleanlinessRating: 5,
  foodRating: 4,
  safetyRating: 5,
  maintenanceRating: 4,
  valueRating: 5,
  reviewText: "Excellent PG with all facilities",
  ownerReply: null,
  createdAt: "2024-01-10T15:00:00"
}
```

---

## 🔌 API Specifications

### **API Endpoints (Owner Scope)**

#### **Dashboard APIs**

```javascript
// Get owner dashboard summary
GET /api/owner/dashboard/summary
Response: {
  totalPGs: 5,
  totalResidents: 145,
  overallOccupancy: 82,
  activeIssues: 12,
  averageRating: 4.2,
  newResidents30d: 8
}

// Get all PGs for owner
GET /api/owner/pgs
Response: [
  {
    id: 1,
    name: "Sunshine PG",
    location: "Koramangala",
    occupancy: 93,
    rating: 4.5,
    issuesCount: 3,
    newResidents30d: 5
  },
  ...
]

// Get performance graphs data
GET /api/owner/dashboard/graphs
Response: {
  residentGrowth: [...],
  occupancyTrend: [...],
  issuesTrend: [...],
  ratingsTrend: [...]
}
```

#### **PG Detail APIs**

```javascript
// Get single PG details
GET /api/owner/pgs/:id
Response: {
  id: 1,
  name: "Sunshine PG",
  ... (all PG fields)
}

// Get PG residents
GET /api/owner/pgs/:id/residents
Response: [
  {
    id: 1,
    fullName: "Amit Kumar",
    roomNumber: 5,
    joinDate: "2024-01-01",
    ...
  },
  ...
]

// Get PG issues
GET /api/owner/pgs/:id/issues
Query params: ?status=Open&priority=High
Response: [
  {
    id: 1,
    title: "Water leakage",
    priority: "High",
    status: "Open",
    ...
  },
  ...
]

// Update issue status
PUT /api/owner/issues/:id/status
Body: {
  status: "Resolved",
  comment: "Fixed by plumber today"
}

// Get PG reviews
GET /api/owner/pgs/:id/reviews
Query params: ?sort=recent&limit=10
Response: [
  {
    id: 1,
    rating: 5,
    reviewText: "Excellent PG",
    ownerReply: null,
    ...
  },
  ...
]

// Reply to review
POST /api/owner/reviews/:id/reply
Body: {
  replyText: "Thank you for the feedback!"
}
```

#### **Analytics APIs**

```javascript
// Get PG comparison data
GET /api/owner/analytics/comparison
Query params: ?period=30d
Response: [
  {
    pgId: 1,
    pgName: "Sunshine PG",
    occupancy: 93,
    occupancyChange: +5,
    rating: 4.5,
    issuesCount: 3,
    revenue: 84000,
    growth: +5
  },
  ...
]

// Get insights
GET /api/owner/analytics/insights
Response: {
  bestPerformer: {...},
  needsAttention: {...},
  highComplaints: {...},
  highestGrowth: {...},
  ratingDrop: {...}
}
```

---

## 🎯 MVP vs Future Features

### **MVP (Phase 1) - Launch Fast**

#### **Dashboard Home**
- ✅ Summary cards (5 metrics)
- ✅ PG quick cards (max 10 PGs)
- ✅ Basic graphs (4 types)
- ✅ Recent activity feed (last 10)

#### **My PGs**
- ✅ PG list table
- ✅ Basic search
- ✅ Simple filters (All/High Occupancy/Has Issues)

#### **PG Detail Page**
- ✅ Overview tab (all metrics)
- ✅ Residents list (read-only)
- ✅ Issues list with status update
- ✅ Reviews list with simple reply

#### **Analytics**
- ✅ PG comparison table
- ✅ Basic insights (5 types)

#### **Settings**
- ✅ Profile edit
- ✅ Basic notification settings
- ✅ Change password

**MVP Limitations:**
- No financial tracking
- No booking management
- No staff management
- No advanced analytics
- No mobile app
- No email integration

---

### **Future Features (Phase 2+)**

#### **Phase 2: Enhanced Management**
- 🔮 Add/Edit residents
- 🔮 Room assignment
- 🔮 Booking requests
- 🔮 Payment tracking
- 🔮 Expense management
- 🔮 Staff management

#### **Phase 3: Advanced Analytics**
- 🔮 Revenue forecasting
- 🔮 Seasonal trends
- 🔮 Custom reports
- 🔮 Export to Excel/PDF
- 🔮 Email reports
- 🔮 Alerts & notifications

#### **Phase 4: Communication**
- 🔮 In-app messaging
- 🔮 Broadcast messages
- 🔮 Email integration
- 🔮 SMS notifications
- 🔮 WhatsApp integration

#### **Phase 5: Automation**
- 🔮 Auto-reminders for rent
- 🔮 Auto-assign issues
- 🔮 Smart pricing suggestions
- 🔮 Predictive maintenance
- 🔮 AI-powered insights

---

## 💻 Technical Implementation

### **Technology Stack**

**Frontend:**
- React 18
- React Router v6
- Recharts (graphs)
- Tailwind CSS
- Lucide React (icons)
- Axios (API calls)

**Backend:**
- Spring Boot 3
- Spring Security + JWT
- MySQL 8
- JPA/Hibernate

**Design System:**
- Reusable components
- Consistent colors
- Responsive grid
- Mobile-first

---

### **Component Structure**

```
owner-dashboard/
├── pages/
│   ├── DashboardHome.jsx
│   ├── MyPGs.jsx
│   ├── PGDetail.jsx
│   │   ├── tabs/
│   │   │   ├── Overview.jsx
│   │   │   ├── Residents.jsx
│   │   │   ├── Issues.jsx
│   │   │   └── Reviews.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── components/
│   ├── cards/
│   │   ├── SummaryCard.jsx
│   │   ├── PGQuickCard.jsx
│   │   └── StatCard.jsx
│   ├── graphs/
│   │   ├── LineGraph.jsx
│   │   ├── AreaGraph.jsx
│   │   └── BarGraph.jsx
│   ├── tables/
│   │   ├── PGTable.jsx
│   │   ├── ResidentTable.jsx
│   │   ├── IssueTable.jsx
│   │   └── ReviewTable.jsx
│   ├── badges/
│   │   ├── StatusBadge.jsx
│   │   ├── PriorityBadge.jsx
│   │   └── RatingBadge.jsx
│   └── common/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── Footer.jsx
└── services/
    └── owner.service.js
```

---

### **Database Tables (New)**

```sql
-- Residents tracking
CREATE TABLE residents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pg_id BIGINT NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  room_number INT,
  bed_number INT,
  join_date DATE,
  status VARCHAR(50), -- Active/Pending/Left
  FOREIGN KEY (pg_id) REFERENCES pgs(id)
);

-- PG performance tracking (aggregated)
CREATE TABLE pg_metrics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pg_id BIGINT NOT NULL,
  date DATE,
  occupied_beds INT,
  total_beds INT,
  new_residents INT,
  residents_left INT,
  average_rating DECIMAL(3,2),
  FOREIGN KEY (pg_id) REFERENCES pgs(id)
);
```

---

### **Security & Authorization**

```java
// Owner can only access their own PGs
@PreAuthorize("hasRole('OWNER')")
@GetMapping("/owner/pgs")
public List<PgDto> getMyPGs() {
    Long ownerId = getCurrentOwnerId();
    return pgRepository.findByOwnerId(ownerId);
}

// Owner cannot access other owner's data
@PreAuthorize("hasRole('OWNER') and @pgSecurityService.isOwner(#pgId)")
@GetMapping("/owner/pgs/{pgId}")
public PgDto getPGDetails(@PathVariable Long pgId) {
    return pgService.getPgById(pgId);
}
```

---

## 📱 Responsive Design

### **Breakpoints**

```css
/* Mobile: < 768px */
- Single column layout
- Stacked cards
- Simplified graphs
- Bottom navigation

/* Tablet: 768px - 1024px */
- Two column layout
- Grid of 2 PG cards
- Side navigation

/* Desktop: > 1024px */
- Full sidebar always visible
- 3+ PG cards per row
- Large graphs
```

---

## 🎨 Design System

### **Color Palette**

```css
/* Primary */
--primary: #4F46E5;      /* Indigo */
--primary-dark: #3730A3;

/* Status Colors */
--success: #10B981;      /* Green */
--warning: #F59E0B;      /* Yellow */
--danger: #EF4444;       /* Red */
--info: #3B82F6;         /* Blue */

/* Neutral */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;
```

### **Typography**

```css
/* Headings */
h1: 2xl font-bold (Dashboard title)
h2: xl font-semibold (Section titles)
h3: lg font-medium (Card titles)

/* Body */
p: base font-normal (Regular text)
small: sm font-normal (Helper text)
```

---

## 📊 Success Metrics

### **MVP Success Criteria**

1. **Adoption**
   - 80% of owners login within first week
   - Average 3+ sessions per week

2. **Engagement**
   - 70% check dashboard daily
   - 50% respond to issues within 24h
   - 30% reply to reviews

3. **Performance**
   - Page load < 2 seconds
   - No major bugs in first month
   - 95% uptime

4. **Satisfaction**
   - Owner satisfaction score > 4/5
   - < 10% churn in first 3 months

---

## 🚀 Implementation Roadmap

### **Week 1-2: Foundation**
- ✅ Setup project structure
- ✅ Create reusable components
- ✅ Build design system
- ✅ Setup routing

### **Week 3-4: Dashboard Home**
- ✅ Summary cards
- ✅ PG quick cards
- ✅ Performance graphs
- ✅ Activity feed

### **Week 5-6: My PGs & PG Detail**
- ✅ PG list page
- ✅ PG detail Overview tab
- ✅ Residents tab
- ✅ Issues tab
- ✅ Reviews tab

### **Week 7: Analytics**
- ✅ PG comparison
- ✅ Insights generation

### **Week 8: Settings & Polish**
- ✅ Settings pages
- ✅ Responsive design
- ✅ Testing
- ✅ Bug fixes

### **Week 9: Backend Integration**
- ✅ Connect all APIs
- ✅ End-to-end testing
- ✅ Performance optimization

### **Week 10: Launch**
- ✅ Beta testing
- ✅ Feedback iteration
- ✅ Production deployment

---

## 📝 Summary

### **Key Deliverables**

1. **Dashboard Home** - Overview of all PGs
2. **PG Detail Page** - Deep dive into single PG
3. **Analytics** - Performance comparison
4. **Settings** - Owner profile & preferences

### **Core Features**

- ✅ Multi-PG management
- ✅ Occupancy tracking
- ✅ Issue management
- ✅ Review handling
- ✅ Performance analytics
- ✅ Mobile responsive

### **Design Principles**

- **Data-first** - Show metrics that matter
- **Action-oriented** - Easy to take action
- **MVP-focused** - Launch fast, iterate
- **Owner-scoped** - No admin features
- **Clean UI** - Minimal, modern design

---

## 🎯 Next Steps

1. **Review & Approve** this design document
2. **Prioritize** features (confirm MVP scope)
3. **Create wireframes** (Figma mockups)
4. **Backend API design** (detailed spec)
5. **Start development** (frontend + backend parallel)
6. **Iterative testing** (weekly demos)
7. **Beta launch** (select owners)
8. **Full rollout** (all owners)

---

**Ready to build the best PG owner dashboard! 🚀**
