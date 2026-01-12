# ⚙️ Admin Settings Page

## 🎯 Purpose
Allows admins to **configure platform settings** including auto-approvals, notifications, platform information, and maintenance mode.

---

## 🖥️ FRONTEND

### **File Location:**
`Frontend/src/pages/admin/Settings.jsx`

### **What It Does:**
Provides a **tabbed interface** with 4 sections:

1. **General** - Platform information
2. **Approvals** - Auto-approval toggles
3. **Notifications** - Email notification preferences
4. **Maintenance** - Maintenance mode control

### **UI Structure:**
```
┌─────────────────────────────────────────────┐
│  Platform Settings                           │
│  Manage platform configuration              │
├─────────────────────────────────────────────┤
│ [General] [Approvals] [Notifications] [Maintenance] │
├─────────────────────────────────────────────┤
│                                             │
│  Settings Content (based on active tab)     │
│  ↓ Toggle switches                          │
│  ↓ Input fields                             │
│  ↓ Text areas                               │
│                                             │
│  [Save Settings] Button                     │
└─────────────────────────────────────────────┘
```

---

## 🔧 BACKEND

### **Controller:**
`AdminController.java`

### **API Endpoints:**
```java
GET  /api/admin/settings    // Get current settings
PUT  /api/admin/settings    // Update settings
```

### **Service Methods:**
```java
// AdminServiceImpl.java

// GET Settings
public PlatformSettings getSettings() {
    return platformSettingsRepository.findFirstByOrderById()
        .orElseGet(() -> {
            // Create default settings if none exist
            PlatformSettings defaults = new PlatformSettings();
            defaults.setPlatformName("Namma PG");
            defaults.setPlatformEmail("admin@namma.com");
            defaults.setSupportEmail("support@namma.com");
            defaults.setAutoApprovePgs(false);
            defaults.setAutoApproveOwners(false);
            defaults.setAutoApproveUsers(true);  // Default: auto-approve users
            defaults.setNotifyNewPg(true);
            defaults.setNotifyNewOwner(true);
            defaults.setNotifyHighPriorityIssue(true);
            defaults.setMaintenanceMode(false);
            return platformSettingsRepository.save(defaults);
        });
}

// UPDATE Settings
public PlatformSettings updateSettings(PlatformSettings settings) {
    PlatformSettings existing = getSettings();
    
    // Update only provided fields
    if (settings.getPlatformName() != null) 
        existing.setPlatformName(settings.getPlatformName());
    // ... update all fields
    
    existing.setUpdatedAt(LocalDateTime.now());
    return platformSettingsRepository.save(existing);
}
```

---

## 💾 DATABASE

### **Table: `platform_settings`**

| Column                    | Type         | Default | Description                        |
|---------------------------|--------------|---------|------------------------------------|
| id                        | BIGINT       | PK      | Primary key                        |
| platform_name             | VARCHAR(255) | -       | Platform display name              |
| platform_email            | VARCHAR(255) | -       | Main admin email                   |
| platform_phone            | VARCHAR(20)  | -       | Contact phone                      |
| support_email             | VARCHAR(255) | -       | Support email                      |
| auto_approve_pgs          | BOOLEAN      | FALSE   | Auto-approve new PGs               |
| auto_approve_owners       | BOOLEAN      | FALSE   | Auto-approve new owners            |
| auto_approve_users        | BOOLEAN      | TRUE    | Auto-approve new users             |
| notify_new_pg             | BOOLEAN      | TRUE    | Email notification for new PGs     |
| notify_new_owner          | BOOLEAN      | TRUE    | Email notification for new owners  |
| notify_high_priority_issue| BOOLEAN      | TRUE    | Email for high-priority issues     |
| notify_daily_summary      | BOOLEAN      | FALSE   | Daily summary email                |
| maintenance_mode          | BOOLEAN      | FALSE   | Platform maintenance mode          |
| maintenance_message       | TEXT         | -       | Message shown during maintenance   |
| updated_at                | TIMESTAMP    | -       | Last update timestamp              |
| updated_by                | VARCHAR(100) | -       | Who updated (admin email)          |

### **Design:**
- **Single row** in database
- Always has ID = 1
- Created on first access if doesn't exist
- Updated, never deleted

---

## 🔄 Data Flow

### **When Page Loads:**
```
1. Navigate to /admin/settings
2. Frontend calls GET /api/admin/settings
3. Backend:
   - Checks if settings exist
   - If not, creates default settings
   - Returns PlatformSettings object
4. Frontend:
   - Sets state with settings data
   - Renders form with current values
   - Shows active tab (default: General)
```

### **When Save Clicked:**
```
1. User modifies settings
2. Clicks "Save Settings"
3. Frontend calls PUT /api/admin/settings
4. Backend:
   - Fetches existing settings (ID = 1)
   - Updates changed fields only
   - Sets updated_at timestamp
   - Saves to database
5. Frontend:
   - Shows success message
   - Updates UI state
```

---

## 📑 Tab 1: General

### **Fields:**
```
Platform Name     [Namma PG                    ]
Platform Email    [admin@namma.com             ]
Support Email     [support@namma.com           ]
Platform Phone    [+91-1234567890              ]
```

### **Purpose:**
- Contact information for platform
- Shown in emails, footers, about page
- Admin/support contact details

---

## 📑 Tab 2: Approvals

### **Toggle Switches:**

```
┌─────────────────────────────────────────────┐
│ Auto-Approve PG Listings                    │
│ New PG submissions will be approved         │
│ automatically                         [OFF] │
├─────────────────────────────────────────────┤
│ Auto-Approve Owners                         │
│ New owner accounts will be approved         │
│ automatically                         [OFF] │
├─────────────────────────────────────────────┤
│ Auto-Approve Users                          │
│ New user accounts will be approved          │
│ automatically                          [ON] │
└─────────────────────────────────────────────┘
```

### **Business Logic:**

**When Auto-Approve PGs = ON:**
```java
// During PG creation
newPg.setActive(true);  // Auto-approved
```

**When Auto-Approve PGs = OFF:**
```java
// During PG creation
newPg.setActive(false);  // Needs manual approval
```

**Same logic for Users and Owners**

---

## 📑 Tab 3: Notifications

### **Email Notification Toggles:**

```
┌─────────────────────────────────────────────┐
│ ✉️  New PG Listing Submitted                │
│ Get notified when a new PG is listed   [ON] │
├─────────────────────────────────────────────┤
│ ✉️  New Owner Registration                  │
│ Get notified when a new owner signs up [ON] │
├─────────────────────────────────────────────┤
│ ✉️  High Priority Issues                    │
│ Get notified for high priority issues  [ON] │
├─────────────────────────────────────────────┤
│ ✉️  Daily Summary Report                    │
│ Receive a daily summary of activity   [OFF]│
└─────────────────────────────────────────────┘
```

### **Future Integration:**
```java
// When new PG is created
if (settings.getNotifyNewPg()) {
    emailService.sendEmail(
        settings.getPlatformEmail(),
        "New PG Listed",
        "A new PG has been submitted for approval..."
    );
}
```

---

## 📑 Tab 4: Maintenance

### **Maintenance Mode Toggle:**

```
┌─────────────────────────────────────────────┐
│ Enable Maintenance Mode                     │
│ Users will see the maintenance message [OFF]│
├─────────────────────────────────────────────┤
│ Maintenance Message:                        │
│ ┌─────────────────────────────────────────┐ │
│ │ We are currently under maintenance.    │ │
│ │ Please check back later.               │ │
│ │                                        │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### **When Maintenance Mode = ON:**

**Shows Warning:**
```
⚠️ Maintenance Mode is Active
Users are currently unable to access the platform.
Remember to disable maintenance mode when work is complete.
```

### **User Experience:**
```java
// In public routes (non-admin)
public String checkAccess() {
    PlatformSettings settings = getSettings();
    if (settings.getMaintenanceMode()) {
        return "maintenance.html";  // Show maintenance page
    }
    return "home.html";  // Normal access
}

// Admins can always access
```

---

## 🎨 UI Components

### **Tab Navigation:**
```javascript
const [activeTab, setActiveTab] = useState('general');

<button onClick={() => setActiveTab('general')} 
        className={activeTab === 'general' ? 'active' : ''}>
  General
</button>
```

### **Toggle Switch:**
Custom Tailwind CSS toggle
```html
<label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" 
         checked={settings.autoApprovePgs}
         onChange={(e) => handleChange('autoApprovePgs', e.target.checked)}
         className="sr-only peer" />
  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-indigo-600 
                  rounded-full peer-checked:after:translate-x-full">
  </div>
</label>
```

### **Save Button:**
```html
<button onClick={handleSave}
        disabled={saving}
        className="bg-indigo-600 text-white px-6 py-3">
  {saving ? 'Saving...' : 'Save Settings'}
</button>
```

---

## 🔐 Security

### **Access Control:**
- **Required:** Admin authentication
- **Role:** ROLE_ADMIN only
- **Token:** Valid JWT

### **Backend Protection:**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/settings")
@PutMapping("/settings")
```

### **Update Tracking:**
```java
settings.setUpdatedBy(getCurrentAdmin().getEmail());
settings.setUpdatedAt(LocalDateTime.now());
```

---

## ⚡ Performance

### **Optimizations:**
1. ✅ Single database row (fast reads)
2. ✅ Cached settings (optional)
3. ✅ Only updates changed fields
4. ✅ Client-side state management

### **Caching Strategy (Future):**
```java
@Cacheable("platform-settings")
public PlatformSettings getSettings() {
    // Cache for 5 minutes
}

@CacheEvict("platform-settings")
public PlatformSettings updateSettings() {
    // Invalidate cache on update
}
```

---

## 🎯 Use Cases

### **Use Case 1: Launch Phase**
```
Auto-Approve PGs: OFF
Auto-Approve Owners: OFF
Auto-Approve Users: ON
→ Manual quality control for business entities
→ Easy onboarding for users
```

### **Use Case 2: Growth Phase**
```
Auto-Approve PGs: ON (with validation)
Auto-Approve Owners: ON
Auto-Approve Users: ON
→ Faster onboarding
→ Reduced admin workload
```

### **Use Case 3: Maintenance**
```
Maintenance Mode: ON
Message: "Upgrading database. Back in 2 hours."
→ Users see maintenance page
→ Admin can still access
```

---

## 🐛 Error Handling

**States:**
- **Loading:** "Loading Settings..."
- **Saving:** "Saving..." (button disabled)
- **Success:** "Settings saved successfully!" (green message, 3s)
- **Error:** "Failed to save settings" (console log)

---

## 🔄 Integration

### **Settings Used By:**
1. **User Registration:** Check auto_approve_users
2. **Owner Registration:** Check auto_approve_owners
3. **PG Submission:** Check auto_approve_pgs
4. **Email Service:** Check notification settings
5. **Public Routes:** Check maintenance_mode

### **Example Usage:**
```java
// In PG creation service
PlatformSettings settings = settingsRepository.findFirstByOrderById().get();
newPg.setActive(settings.getAutoApprovePgs());  // Auto or manual approval
```

---

## 📊 Settings Impact

### **Auto-Approval Impact:**

| Setting              | ON                    | OFF                         |
|----------------------|-----------------------|-----------------------------|
| **auto_approve_pgs**  | PG goes live instantly| Admin must approve first    |
| **auto_approve_owners**| Owner can list PGs   | Admin must approve first    |
| **auto_approve_users**| User can search/book | Admin must approve first    |

### **Notification Impact:**
- **notifyNewPg:** Admin gets email for each new PG
- **notifyNewOwner:** Admin gets email for each new owner
- **notifyHighPriorityIssue:** Immediate alert for critical issues
- **notifyDailySummary:** Once-per-day digest

---

## 💡 Best Practices

### **Recommended Defaults:**
```
Auto-Approve PGs:      OFF (quality control)
Auto-Approve Owners:   OFF (business verification)
Auto-Approve Users:    ON  (user-friendly)
Notify New PG:         ON  (stay informed)
Notify New Owner:      ON  (track growth)
Notify High Priority:  ON  (urgent action)
Notify Daily Summary:  OFF (reduce email noise)
Maintenance Mode:      OFF (only when needed)
```

### **Security Tips:**
1. ⚠️ Test maintenance mode in staging first
2. ⚠️ Always set maintenance message before enabling
3. ⚠️ Notify users before scheduled maintenance
4. ✅ Keep notification emails under control
5. ✅ Review auto-approval settings monthly

---

## 📋 Summary

The **Settings Page** provides **centralized configuration** for:
- ✅ **Platform information** (contact details)
- ✅ **Approval automation** (save admin time)
- ✅ **Notification preferences** (stay informed)
- ✅ **Maintenance control** (planned downtime)

**Benefits:**
- No code changes for config updates
- Flexibility to adapt policies
- Better user experience (auto-approvals)
- Reduced admin workload

**Essential for:** **Operational flexibility** and **efficient platform management**! ⚙️

---

## 🎓 Key Takeaway

Settings = **Backend Configuration Without Code Changes**

Instead of:
```java
// Hard-coded
boolean AUTO_APPROVE = true;  // Need to redeploy to change
```

We have:
```java
// Database-driven
boolean autoApprove = settings.getAutoApprovePgs();  // Change anytime!
```

**This makes the platform adaptable and easy to manage!** 🚀
