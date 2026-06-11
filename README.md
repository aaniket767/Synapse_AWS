# Synapse AWS — School Management ERP Portal 🚀

A high-performance, mobile-responsive School Enterprise Resource Planning (ERP) web application engineered to manage student directories, automate transactional ledger bookkeeping, and generate dynamic standalone financial invoices. 

Built using **React (Vite)**, styled with an optimized dark-mode utility canvas.

---

## 💎 Core Architectured Features

### 1. Smart Fees Ledger Ledger
* **On-the-Spot Ledger Tracking:** Log student course fees, supplemental lab/extracurricular charges, and custom institutional scholarship concessions or waivers in real-time.
* **Isolated Transactions History:** Maintains a dedicated history grid separate from reporting screens to guarantee data integrity.

### 2. Mobile-Agnostic Reports & Receipt Generator (`Reports.jsx`)
* **Live Directory Autocomplete:** Asynchronous quick-search indexing that fetches matches from the Supabase registry via names or unique Student IDs instantly.
* **Hidden Dynamic `iframe` Injection Engine:** Bypasses aggressive desktop pop-up blockers and mobile layout constraints (iOS Safari & Android Chrome) to isolate only the target invoice graphics context.
* **Strict Black & White High-Fidelity Rendering:** Automatically masks dark interface backgrounds, navigation bars, and buttons when printing, producing a clean, structured financial voucher.

### 3. Bulletproof Production Routing
* Integrates explicit `vercel.json` rewrite overrides to handle single-page application (SPA) runtime mechanics smoothly, preventing `404 Not Found` breaking states upon hard browser reloads.

---

## 🛠️ Technology Stack & Dependencies

* **Frontend Engine:** React.js 18+ powered by Vite (Fast Module Replacement build wrapper)
* **Database Backend:** Supabase (PostgreSQL with built-in Row-Level Security)
* **Icons Toolkit:** `react-icons` (Material Design & Remix Icon sets)
* **Deployment Middleware:** Vercel Hosting Engine

---

## 🚀 Local Development Quickstart

Follow these steps to spin up the management system locally on your workstation:
