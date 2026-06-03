Use existing project context.

Use Dashboard UI as source of truth.

Task:

Refine Dashboard UX after authentication.

Requirements:

1. When user is NOT authenticated:

Navbar:

* Login
* Signup

Guest can view dashboard UI only.

Protected actions show:
"Please sign in to continue"

2. When user IS authenticated:

Navbar:

* Remove Login button
* Remove Signup button
* Show Logout action/icon instead

Logout UX:

User clicks Logout
→ Remove JWT
→ Update Auth State
→ Return to Guest Dashboard

3. Remove Hero/Sub-header section completely.

Remove:

"DASHBOARD"

"Shorten, manage, and measure links from one clean workspace."

All related descriptive text.

Reason:

The dashboard content below already communicates the product purpose.

After authentication, users should immediately see:

* Create URL
* URL Management
* Analytics

No duplicated information.

UI Requirements:

* Preserve existing color palette
* Preserve spacing system
* Preserve card design
* Preserve responsive behavior
* Preserve dashboard visual quality

Output:

1. UX Analysis
2. Required UI Changes
3. Auth State Mapping
4. Complete Code Changes
