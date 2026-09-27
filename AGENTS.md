# Gamen Store — Agent Instructions

## 1. Project Overview

Gamen Store is a modern web-based iPhone e-commerce and store management system.

The system has two major areas:

1. Public customer storefront
2. Admin store management system

The customer storefront is used to browse and order iPhone products.

The admin system is used to manage:

* Products
* Product variants
* Orders
* Customers
* Inventory
* IMEI
* Purchases
* Suppliers
* Finance
* Reports
* Store settings

The main business flow is:

```text
Purchase
→ Inventory
→ Customer Order
→ WhatsApp
→ Order Confirmation
→ Inventory Reservation
→ Completed Sale
→ Revenue
→ COGS
→ Profit
```

---

# 2. Technology Stack

Use the existing project stack.

Primary technologies:

* Next.js
* React
* JavaScript
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* Auth.js or the authentication solution already configured in the project

Do not replace the existing framework or architecture unless explicitly requested.

Before implementing Next.js-specific functionality, inspect the current Next.js version and follow the official documentation available in the installed project.

Pay attention to:

```text
node_modules/next/dist/docs/
```

Do not rely on outdated Next.js conventions when the installed version provides different APIs or patterns.

---

# 3. General Development Rules

## Inspect Before Modifying

Before changing code:

1. Inspect the existing project structure.
2. Identify related files.
3. Understand existing patterns.
4. Reuse existing components and utilities.
5. Avoid unnecessary rewrites.

Never assume the project structure is identical to a standard Next.js template.

---

## Preserve Existing Functionality

When implementing a new feature:

* Do not break existing features.
* Do not unnecessarily rewrite working code.
* Do not duplicate existing functionality.
* Reuse existing components.
* Reuse existing services.
* Reuse existing validation.
* Reuse existing database utilities.

If an existing implementation needs to change because of a new feature, modify it carefully and preserve backward compatibility where possible.

---

# 4. Architecture Principles

Use a modular architecture.

Prefer:

```text
UI
↓
Service / Business Logic
↓
Database
```

Do not put complex business logic directly inside UI components.

For example:

Bad:

```text
ProductPage
├── database query
├── price calculation
├── stock calculation
├── order creation
└── UI
```

Prefer:

```text
ProductPage
↓
Product Service
↓
Prisma
```

Business logic should be reusable independently from the UI.

---

# 5. Component Rules

Use reusable components.

Examples:

```text
Button
Input
Select
Modal
Drawer
Badge
Card
Table
Pagination
Tabs
Toast
ConfirmDialog
EmptyState
LoadingState
ErrorState
ProductCard
ProductGallery
OrderStatusBadge
PriceDisplay
```

Before creating a new component, check whether an existing component can be reused.

Do not create multiple components that solve the same problem.

---

# 6. Database Rules

Use Prisma for database access.

Never expose Prisma directly to the browser.

Database operations must happen server-side.

Use proper relations and indexes.

Important unique fields:

```text
Product.slug
ProductVariant.sku
InventoryUnit.imei
Order.orderNumber
Purchase.purchaseNumber
```

IMEI must always be unique.

Never allow duplicate IMEI values.

Do not delete historical records that are required for financial or business reporting.

Prefer:

```text
active = false
```

or archive behavior instead of destructive deletion.

---

# 7. Server-Side Validation

Never trust data sent from the frontend.

Always validate on the server:

* Product ID
* Variant ID
* Quantity
* Price
* Stock
* Order total
* Customer data
* Order status
* Purchase cost
* Finance amount
* User role
* IMEI

The frontend is responsible for user experience.

The server is responsible for correctness.

---

# 8. Price Rules

Never trust prices submitted by the client.

For example, do NOT do:

```text
clientPrice × quantity
```

without verifying the actual price.

Instead:

```text
Client sends variantId
↓
Server retrieves variant
↓
Server retrieves current price
↓
Server calculates subtotal
↓
Server calculates total
```

The same rule applies to:

* Product price
* Purchase price
* Shipping
* Discounts
* Order total
* COGS

---

# 9. Inventory Rules

Inventory is based on physical iPhone units.

Each physical iPhone should be identifiable through:

```text
IMEI
Serial Number
Product Variant
Purchase Price
Condition
Battery Health
Status
```

Inventory statuses:

```text
AVAILABLE
RESERVED
SOLD
RETURNED
DAMAGED
```

Rules:

### New Order

Creating an order does NOT permanently decrease inventory.

```text
Order PENDING
↓
Inventory remains AVAILABLE
```

### Confirmed Order

When an order is confirmed:

```text
Order CONFIRMED
↓
Inventory becomes RESERVED
```

### Completed Order

When an order is completed:

```text
Order COMPLETED
↓
Inventory becomes SOLD
```

### Cancelled Order

When a confirmed order is cancelled:

```text
Order CANCELLED
↓
Reserved inventory becomes AVAILABLE
```

Never allow an inventory unit with:

```text
SOLD
```

status to be sold again.

---

# 10. Purchase Rules

When a purchase is confirmed:

```text
Purchase
↓
Inventory Unit Created
↓
Stock Increased
↓
Purchase Expense Recorded
```

Example:

```text
Purchase Cost:
Rp15.000.000
```

Results:

```text
Inventory:
+1 unit

Cash:
-Rp15.000.000
```

Important:

A purchase is a cash outflow but should NOT automatically be treated as a business loss.

The purchased product becomes inventory.

---

# 11. Order Rules

Order statuses:

```text
PENDING
CONTACTED
CONFIRMED
PROCESSING
SHIPPED
COMPLETED
CANCELLED
```

Meaning:

### PENDING

Order has been successfully created.

### CONTACTED

Admin has contacted the customer.

### CONFIRMED

Customer has confirmed the transaction.

### PROCESSING

Order is being prepared.

### SHIPPED

Product has been shipped.

### COMPLETED

Transaction is completed.

### CANCELLED

Transaction has been cancelled.

---

# 12. WhatsApp Rules

Gamen Store uses WhatsApp for customer communication.

The system creates the order BEFORE redirecting to WhatsApp.

Flow:

```text
Checkout
↓
Server Validation
↓
Create Order
↓
Generate Order Number
↓
Generate WhatsApp Message
↓
Return WhatsApp URL
↓
Redirect
```

The system must NOT assume that the customer actually sent the WhatsApp message.

Opening WhatsApp is not the same as sending the message.

Order status should initially remain:

```text
PENDING
```

The WhatsApp number should come from configuration/settings.

Do not hardcode business configuration in UI components.

---

# 13. Finance Rules

Finance must distinguish:

```text
Revenue
Expense
Cash Flow
COGS
Profit
Capital
```

These values must not be treated as interchangeable.

## Revenue

Revenue comes from completed sales.

## Expense

Examples:

```text
Inventory Purchase
Operational
Shipping
Marketing
Rent
Utilities
Salary
Tax
Other Expense
```

## Capital

Capital injection is cash inflow but is NOT sales revenue.

## Cash Flow

```text
Net Cash Flow =
Total Cash In
-
Total Cash Out
```

## Gross Profit

```text
Gross Profit =
Revenue
-
COGS
```

## Net Profit

```text
Net Profit =
Revenue
-
COGS
-
Operating Expenses
```

Do not calculate profit simply as:

```text
Income - Expense
```

without considering inventory and COGS.

---

# 14. COGS Rules

For a completed sale:

```text
Revenue
=
Selling Price

COGS
=
Actual Purchase Cost of Sold Inventory Unit

Gross Profit
=
Revenue - COGS
```

Example:

```text
Purchase:
Rp15.000.000

Selling:
Rp18.000.000

COGS:
Rp15.000.000

Gross Profit:
Rp3.000.000
```

Use the actual purchase cost associated with the physical inventory unit whenever available.

---

# 15. Financial Transaction Rules

Avoid duplicate financial transactions.

Example:

When purchase is confirmed:

```text
Purchase
→ Expense
```

Do not create another manual inventory purchase expense automatically.

When sale is completed:

```text
Completed Order
→ Sales Income
→ COGS
```

Do not create duplicate sales income if the status is updated again.

Operations that modify inventory or finance should use database transactions when multiple records must change together.

---

# 16. Authentication & Authorization

Admin pages must be protected.

Unauthenticated users must not access:

```text
/admin/*
```

Admin APIs must also be protected.

Never trust:

```text
role
userId
permissions
```

from client-side input.

Always verify authorization server-side.

Never store passwords in plaintext.

Never expose authentication secrets to the browser.

---

# 17. API Rules

API endpoints should:

1. Validate authentication when required.
2. Validate authorization.
3. Validate request data.
4. Retrieve authoritative data from database.
5. Execute business logic.
6. Return structured responses.
7. Handle errors consistently.

Use appropriate HTTP status codes.

Examples:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Use:

```text
409 Conflict
```

for situations such as:

* duplicate IMEI
* duplicate SKU
* stock conflict
* duplicate order operation

---

# 18. Error Handling

Every major feature should have:

```text
Loading State
Empty State
Error State
Success State
Not Found State
Unauthorized State
```

Error messages should be understandable to users.

Do not expose raw database errors or sensitive implementation details to customers.

---

# 19. UI/UX Guidelines

Gamen Store should feel:

* Premium
* Modern
* Clean
* Professional
* Minimal
* Trustworthy
* Product-focused

Avoid:

* excessive gradients
* excessive glassmorphism
* excessive shadows
* excessive rounded cards
* unnecessary icons
* random colors
* overly decorative dashboards
* generic AI-generated UI
* childish visual styles

Use:

* strong typography
* clear hierarchy
* high-quality product imagery
* subtle borders
* consistent spacing
* restrained colors
* clear CTA
* responsive layouts

---

# 20. Design Tokens

Use:

```text
Background: #F5F5F7
Surface: #FFFFFF
Primary: #111111
Text: #1D1D1F
Secondary: #6E6E73
Border: #D2D2D7
Success: #16A34A
Warning: #D97706
Danger: #DC2626
```

Use Inter or the existing project font.

Do not introduce another visual system without explicit instruction.

---

# 21. Responsive Design

The application must work on:

```text
360px
375px
390px
768px
1024px
1280px
1440px+
```

Customer experience should prioritize mobile usability.

Admin experience should prioritize desktop but remain usable on smaller screens.

Do not simply shrink desktop layouts.

Create appropriate mobile layouts.

---

# 22. Accessibility

Use semantic HTML.

Ensure:

* keyboard navigation
* visible focus states
* accessible labels
* sufficient contrast
* meaningful button labels
* accessible form errors
* alt text for meaningful images

Do not rely solely on color to communicate status.

---

# 23. Performance

Prefer server rendering where appropriate.

Avoid unnecessary client components.

Use client components only when interactivity requires them.

Optimize images.

Use pagination for large datasets.

Avoid N+1 database queries.

Add appropriate database indexes.

Do not fetch entire tables when only a subset is needed.

---

# 24. Code Quality

Use clear naming.

Prefer:

```text
getProductBySlug()
createOrder()
updateOrderStatus()
reserveInventory()
releaseInventory()
completeSale()
createPurchase()
recordFinanceTransaction()
calculateOrderTotal()
calculateProfit()
```

Avoid vague functions such as:

```text
doThing()
handleStuff()
processData()
```

Keep functions focused.

Avoid unnecessary abstraction.

---

# 25. File Organization

Follow the existing project structure.

Prefer separation between:

```text
components/
services/
lib/
app/
database/
validation/
```

Do not create random folders without a reason.

Before creating a new utility, check whether an existing utility already performs the same function.

---

# 26. Environment Variables

Never commit secrets.

Examples:

```text
DATABASE_URL
AUTH_SECRET
WHATSAPP_NUMBER
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Use environment variables for secrets and deployment-specific configuration.

Never expose server secrets through:

```text
NEXT_PUBLIC_*
```

unless the value is intentionally public.

---

# 27. Testing Expectations

When implementing important business logic, test:

* normal flow
* empty state
* invalid input
* unauthorized access
* duplicate operation
* insufficient stock
* cancelled order
* completed order
* duplicate IMEI
* duplicate SKU
* failed database transaction

Critical flows:

```text
Purchase → Inventory → Expense

Order → Confirmation → Reservation

Completed Order → Sold Inventory → Revenue → COGS → Profit

Cancelled Order → Released Inventory
```

---

# 28. Git / Change Discipline

Make focused changes.

Do not modify unrelated files.

Do not remove working functionality without a clear reason.

Before finishing a task:

1. Review changed files.
2. Check for errors.
3. Run lint if available.
4. Run build when appropriate.
5. Verify affected functionality.

---

# 29. Next.js Specific Rule

The installed Next.js version is the source of truth.

Before using or changing Next.js APIs, inspect the installed documentation:

```text
node_modules/next/dist/docs/
```

Pay attention to:

* deprecated APIs
* changed conventions
* routing behavior
* server/client boundaries
* caching
* data fetching
* configuration
* middleware/proxy behavior
* server actions if applicable

Do not assume examples from older Next.js versions are still valid.

---

# 30. Current Task Discipline

When receiving a task:

1. Understand the requested feature.
2. Inspect the existing implementation.
3. Identify dependencies.
4. Implement only the requested scope.
5. Reuse existing components.
6. Preserve existing functionality.
7. Validate the implementation.
8. Report what was changed.
9. Report any remaining issue.

Do not automatically implement future features.

Do not make architectural changes unrelated to the current task.

---

# 31. Definition of Done

A task is complete only when:

* requested functionality works
* existing functionality remains intact
* UI is responsive
* validation is implemented
* errors are handled
* database relationships are correct
* authorization is respected
* no obvious duplicate logic is introduced
* code is maintainable
* lint/build passes when applicable

For business-critical features, verify the actual database state and business logic, not just the UI.

---

# 32. Project Priority

When making decisions, prioritize:

1. Data correctness
2. Business logic correctness
3. Security
4. Maintainability
5. User experience
6. Visual polish
7. Performance

Never sacrifice financial or inventory correctness merely to make the UI appear functional.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
