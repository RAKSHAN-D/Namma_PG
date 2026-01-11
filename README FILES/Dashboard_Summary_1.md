# Dashboard Summary 1
**Date:** January 10, 2026
**Project:** Namma PG - Admin Module

## 1. Overview
The Admin Dashboard serves as the central command center for the "Namma PG" application. It provides real-time insights into platform growth, user engagement, and operational issues. The dashboard has been engineered with a focus on **visual aesthetics**, **performance**, and **architectural purity**.

## 2. Key Features Implemented

### A. Statistical Overview Cards
Four key metrics are displayed at the top with "click-to-navigate" functionality:
1.  **Total PGs**: Displays total count of PGs in the system. Trends up with `+12% this month` (Mock trend).
    *   *Action*: Clicks to `/admin/pgs`.
2.  **Active Owners**: Count of owners with `active: true` status.
    *   *Action*: Clicks to `/admin/owners`.
3.  **Active Users**: Count of customers (PG Users) with `active: true` status.
    *   *Action*: Clicks to `/admin/users`.
4.  **Pending Issues**: **(CRITICAL UPDATE)** Now displays count of issues with status `OPEN` or `IN_PROGRESS` (previously "Pending Approvals").
    *   *Action*: Clicks to `/admin/issues`.

### B. Analytical Charts (Visualizations)
1.  **PG Growth Over Time** (Line Chart):
    *   Shows the accumulation of PGs over the last 6 months.
    *   *Data Source*: Mock trend logic (frontend) wrapping real total count.
2.  **User Signup Trend** (Area Chart):
    *   Visualizes user acquisition velocity for the current month.
    *   *Data Source*: Mock trend logic (frontend).
3.  **Onboarding Trend** (Grouped Bar Chart) **(NEW)**:
    *   Compares "Users" vs "Owners" joining the platform month-over-month.
    *   *Data Source*: **REAL DATA** fetched from DB (`/api/admin/onboarding-trend`).
    *   *Logic*: Aggregates `User.createdAt` timestamp by month.
4.  **PG Status Listing** (Donut Chart):
    *   Breakdown of PGs by status: `Approved` (Active) vs `Pending` (Inactive).
    *   *Data Source*: **REAL DATA** aggregated from `/api/admin/pgs`.
    *   *UI*: Full-width card in the second row for better visibility.

### C. Layout & UX
*   **Static Sidebar**: The sidebar navigation is fixed (`h-screen`), ensuring it never scrolls while the main content area is independently scrollable.
*   **Responsive Design**: Grid systems adapt from 1 column (Mobile) to 4 columns (Desktop).
*   **Zero-Placeholders**: All sections (except specific trend graphs) reflect actual app state.

---

## 3. Backend Architecture (Spring Boot)
We have enforced a **Strict Layered Architecture** to ensure scalability and maintainability.

### **Flow:** `Controller` → `Service` → `Repository`

1.  **Controller Layer (`AdminController`)**:
    *   **Role**: Extremely "Thin".
    *   **Responsibility**: Only handles HTTP Requests (`@GetMapping`) and Responses (`ResponseEntity`).
    *   **Constraint**: Contains **ZERO** business logic and **NO** direct Repository calls.
2.  **Service Layer (`AdminServiceImpl`)**:
    *   **Role**: The Brain.
    *   **Responsibility**: Contains all business logic, data aggregation, and data transformation.
    *   **Logic**:
        *   Calculates Dashboard Stats.
        *   Groups Users by Month for Onboarding Trend.
3.  **Repository Layer (`UserRepository`, `IssueRepository`, `PgRepository`)**:
    *   **Role**: The Data Access Object.
    *   **Responsibility**: Pure DB interactions.
    *   **Optimization**: custom JPQL/JPA methods added (e.g., `countByStatusIn`, `countByActiveTrueAndRoles_Name`) to push processing to the Database.

---

## 4. Frontend Architecture (React + Vite)
*   **Service Layer (`admin.service.js`)**:
    *   Centralized API calls using `axios`.
    *   Interceptor-based Auth Header injection (`Bearer Token`).
    *   Robust error handling with fallback data to prevent UI crashes.
*   **Component Structure**:
    *   `Dashboard.jsx`: Main view controller. Fetches data in parallel using `Promise.all` for performance.
    *   `Recharts`: Used for all data visualization.

---

## 5. Recent Critical Fixes
1.  **Infinite Recursion Crash**: Fixed a critical bug where `PG` -> `Food` -> `PG` caused a StackOverflowError by adding `@JsonIgnore` to the `Food` entity.
2.  **Data Seeder Resilience**: Added logic to backfill `createdAt` dates for existing mock users, ensuring charts are not empty.
3.  **Chart Crash Protection**: Added array safety checks in `getPgStatusDistribution` to handle cases where the API might return unexpected data during server restarts.

## 6. Pending / Next Steps
*   **Global Search**: The search bar in the header is currently UI-only.
*   **Notifications**: The bell icon is static.
*   **Mock Data Replacement**: `PG Growth` and `User Signup` charts still use mock trend curves (though scaled to real totals). Needs backend historical snapshots to be fully real.
