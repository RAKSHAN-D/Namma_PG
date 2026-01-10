# Namma PG - Authentication system

## Overview
This document explains the **Authentication System** implemented in the Namma PG application. The system uses **JWT (JSON Web Tokens)** to secure the application, ensuring that users can securely sign up, log in, and access role-specific dashboards.

---

## 1. What is JWT Authentication?
**JWT (JSON Web Token)** is a standard way to securely transmit information between parties as a JSON object.
*   **Stateless**: The server does not need to keep track of every logged-in user in its memory (Sessions). Instead, the user holds the "key" (token).
*   **The Flow**:
    1.  User sends `Email` + `Password` to the server.
    2.  Server verifies credentials.
    3.  If correct, Server generates a **Token** (a long encrypted string) and sends it back.
    4.  User must send this **Token** in the header of every subsequent request to prove who they are.

---

## 2. Backend Architecture (Spring Boot)

### A. Core Components
1.  **`User` & `Role` Entities**:
    *   `User`: Stores `email`, `password` (encrypted), `username`.
    *   `Role`: Defines permissions (`ROLE_PG_USER`, `ROLE_PG_OWNER`, `ROLE_ADMIN`).
    *   **Relationship**: One User can have One (or Many) Roles.

2.  **`RoleInitializer`**:
    *   A script that runs **automatically** when the server starts.
    *   It checks your database: "Do roles 'PG_USER' and 'PG_OWNER' exist?"
    *   If NO, it creates them. This ensures you never have "Role Not Found" errors.

### B. Security Logic (The "Bouncers")
1.  **`WebSecurityConfig`**:
    *   The main security gatekeeper.
    *   It tells the app: "Allow everyone to visit `/api/auth/**` (Login/Signup), but block everything else unless they have a valid token."
    *   It also disables **CORS** restrictions so your React frontend can talk to the Java backend.

2.  **`AuthTokenFilter`**:
    *   This is a filter that sits in front of every request.
    *   It checks the HTTP Header: `Authorization: Bearer <TOKEN>`.
    *   If a token exists, it asks `JwtUtils` to validate it.
    *   If valid, it lets the request pass and tells Spring Security: "This is User X, and they have Role Y."

3.  **`JwtUtils`**:
    *   **`generateJwtToken()`**: Creates the digital signature.
    *   **`validateJwtToken()`**: Checks if a token is fake or expired.

### C. API Endpoints
*   **POST `/api/auth/signup`**:
    *   Checks if `Username` or `Email` already exists.
    *   Creates a new User.
    *   Assigns the role selected by the user (PG_USER or PG_OWNER).
    *   Saves to Database with **BCrypt Encrypted Password** (so even DB admins can't read passwords).

*   **POST `/api/auth/signin`**:
    *   Checks email/password.
    *   If correct, returns a **JWT Token** + User Details (ID, Email, Roles).

---

## 3. Frontend Architecture (React)

### A. Service Layer (`auth.service.js`)
*   We created a dedicated file to handle all API calls.
*   **`login()`**: Sends credentials -> gets Token -> Saves Token to **LocalStorage** (browser memory).
*   **`logout()`**: Simply removes the Token from LocalStorage.
*   **`getCurrentUser()`**: Reads the user data from LocalStorage.

### B. User Flow
1.  **Signup Page**:
    *   User fills form & selects Role (Radio button).
    *   Sends data to backend.
    *   On success -> Redirects to Login.
    *   On failure -> Shows exact error message from backend (e.g., "Username taken").

2.  **Login Page**:
    *   User enters credentials.
    *   On success -> Checks `user.roles`.
    *   **Redirect Logic**:
        *   If `ROLE_PG_OWNER` -> Go to `/owner-dashboard`.
        *   If `ROLE_PG_USER` -> Go to `/user-dashboard`.

3.  **Protected Routes (Dashboards)**:
    *   Each dashboard (`UserDashboard.jsx` / `OwnerDashboard.jsx`) has a `useEffect` hook.
    *   It checks: "Is there a user logged in? Do they have the right role?"
    *   If **No** -> It kicks them back to the Login page immediately.

---

## 4. How to Run It

1.  **Start Backend**:
    ```bash
    cd backend/backend
    ./mvnw spring-boot:run
    ```
2.  **Start Frontend**:
    ```bash
    cd Frontend
    npm run dev
    ```
3.  **Open Browser**: `http://localhost:5173`

---

## 5. Future Improvements
*   **Refresh Tokens**: Currently, if the token expires, the user must log in again. We can add "Refresh Tokens" to stay logged in longer silently.
*   **Email Verification**: Send a real email to verify the account before letting them log in.
