# SP Pani Puri Shop - Management Dashboard Specifications

This document defines the requirements and specifications for the SP Pani Puri Shop Management Dashboard.

## 1. Project Overview
SP Pani Puri Shop sells premium street food and desserts, specifically Pani Puri, Masala Puri, Waffles, and Brownies. We need a highly aesthetic, responsive, and interactive single-page management dashboard that handles all aspects of shop operations.

---

## 2. Branding & Design Guidelines

### Color Palette
- **Background**: Absolute Black (`#000000`) and Deep Dark Gray (`#09090b`) for containers.
- **Accent Color**: Neon Indigo Blue (`#3F4EFF`) - used for primary buttons, active states, charts, highlights, and borders.
- **Secondary Accent**: Translucent Glass Border (`rgba(63, 78, 255, 0.15)`).
- **Text Primary**: White (`#FFFFFF`) with high contrast.
- **Text Secondary**: Muted Silver (`#A1A1AA`).

### Typography
- **Headlines**: Grifter Bold (fallback: `Syne`, `Clash Display`, sans-serif, heavy weight `800` or `900`).
- **Body Text**: Satoshi (fallback: `Plus Jakarta Sans`, `Inter`, sans-serif).

### Design Style
- **Aesthetic**: A premium mix of **Google Material Design** (ripple animations, clear hierarchy, floating action elements) and **Glassmorphism** (backdrops with `blur(20px)`, thin glowing borders, subtle inner shadows, glowing orb overlays).
- **Transitions**: Smooth micro-interactions, springy hover scaling (`1.02`), and fade-in entries for page segments.

---

## 3. Core Modules & Functionalities

### A. Customer Management
- **Customer Directory**: Add, edit, and view customer details (Name, Phone, Email, Status).
- **Loyalty Program**: Track loyalty points (e.g., 1 point per $1 spent). Implement custom rewards tiers.
- **Feedback Loop**: Section to log and view customer ratings and reviews for Pani Puri, Masala Puri, Waffles, and Brownies.
- **Purchase History**: Linked view showing past orders for selected customers.

### B. Finance Management
- **Key Metrics Dashboard**: Gross Revenue, Neeipt Generator**: Simple modal to generate a clean, brand-compliant digital invoice/receipt for customers.

### C. Inventory Management
- **Product & Ingredient Catalog**: Track stock levels of core ingredients (Puri, Masala, Waffle batter, Brownies, Toppings, Mint Water, Sweet Chutney).
- **Low-Stock Alerting**: Visual badges and notification banners for items that drop below a configurable threshold.
- **Stock Control**: Ability to "restock" or "deduct" inventory directly.
- **Supplier Directory**: Keep track of vendors supplying ingredients, with contact details and order logs.

### D. Employees Management
- **Employee Directory**: Track name, role (Chef, Server, Cashier, Manager), hourly wage, and contact details.
- **Shift Scheduling**: Interactive visual calendar/timetable mapping out employee shifts for the week.
- **Wage Tracker & Payroll Calculator**: Auto-calculate weekly payouts based on hours worked and hourly wages.
- **Performance Ratings**: Simple ranking system to identify top-performing staff members.

---t Profit, Operational Costs, and average order value.
- **Sales Analytics**: Interactive charts showing sales trends (daily, weekly, monthly) using Chart.js.
- **Transaction Ledger**: Add new transactions (Income/Expense), categorize them (e.g., Sales, Rent, Raw Materials, Wages), and search/filter through records.
- **Rec

## 4. Technical Architecture
- **Structure**: Single Page Application (SPA) driven by a sleek `index.html` structure.
- **Styling**: `styles.css` containing a custom design system built with CSS variables, modern flex/grid layouts, custom keyframe animations, and beautiful backdrop filters.
- **Logic**: `app.js` utilizing vanilla state management, dynamic DOM rendering, custom event handlers, and data persistence via `localStorage` to allow standard mock operations (like adding a customer, updating inventory, or adding a transaction) to persist across page reloads.
- **Libraries**: Chart.js (loaded via CDN) for clean finance charts, and Lucide Icons (loaded via CDN) for crisp vectors.
