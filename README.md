# 📊 E-Commerce Analytics Dashboard

A responsive, high-performance E-Commerce Analytics Dashboard built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**. 

This application provides mock authentication, interactive dynamic data tables with advanced filtering/sorting, real-time analytics visualization, PDF/Excel export functionalities, and is fully containerized using **Docker**.

---

## 🚀 Live Demo & Walkthrough

* **Live Demo URL:** [Insert Vercel / Live Deployment Link Here]
* **Video Demo:** [Insert YouTube / Loom Link Here] *(A detailed walkthrough covering Auth, Table Operations, Charts, and Docker execution)*

---

## ✨ Features

- **🔐 Mock Authentication:** Protected routes with state managed via Redux Toolkit (`authSlice`).
- **📊 Dynamic Data Table:** Built with TanStack Table featuring:
  - Global Search & Multi-column Sorting.
  - Category & Status Filtering.
  - Server-style Pagination.
- **📈 Analytics & Data Visualization:** Interactive charts using Recharts (Revenue Trends, Category Breakdown, Order Status Distribution).
- **📥 Data Export:** One-click export options for current table data in **PDF** and **Excel (.xlsx)** formats.
- **📱 Fully Responsive UI:** Tailored with Tailwind CSS and `shadcn/ui` components for seamless mobile, tablet, and desktop views.
- **🐳 Dockerized Application:** Optimized multi-stage Docker build for consistent cross-environment deployment.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Data Table:** [TanStack Table v8](https://tanstack.com/table/v8)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Export Libraries:** `jspdf` & `jspdf-autotable` (PDF), `xlsx` (Excel)
- **Containerization:** [Docker](https://www.docker.com/)

---

## 📐 Implementation Approach

1. **State Management & Auth Flow:**
   User authentication state is persisted using Redux Toolkit. Protected routes ensure unauthenticated users are redirected to `/login`. Mock credentials are provided for testing (`admin@dashboard.com` / `admin123`).

2. **Data & Performance Optimization:**
   The dashboard utilizes structured mock data generating rich e-commerce metrics. Table state (sorting, filtering, pagination) is isolated to prevent unnecessary parent re-renders.

3. **Responsive Design:**
   Employed a mobile-first approach using Tailwind utility classes. Data tables support horizontal scroll on touch devices, and side navigation transforms into a mobile drawer menu.

---

## 🌿 Git Flow Branching Strategy

This project strictly follows the **Git Flow** methodology:
- `main`: Production-ready releases.
- `develop`: Integration branch for feature development.
- `feature/*`: Dedicated branches for individual components/features (e.g., `feature/auth-setup`, `feature/data-table`, `feature/dockerization`).

Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Formatting or UI polishing
- `refactor:` Code refactoring

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Docker** (Optional, for containerized run)

### Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
