# Form Builder Platform

A full-stack, drag-and-drop form builder platform built with a modern monorepo architecture. It allows users to create customizable forms, share them publicly, and manage submissions through a dedicated dashboard.

## 🚀 Features

- **Drag-and-Drop Form Builder:** Intuitive interface for creating custom forms with various field types.
- **Authentication System:** Secure user registration, login, email verification, and password reset flows.
- **Form Management Dashboard:** Centralized hub to create, manage, and organize forms (including a trash/recovery system).
- **Form Responses:** View and manage form submissions and data collection in real-time.
- **Public Form Viewer:** Shareable public links for users to easily fill out and submit forms.
- **Customizable Templates:** Pre-built templates for common use cases (e.g., event registration, customer feedback).

## 💻 Tech Stack

**Frontend (Web App)**
- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS 4 & Radix UI (Accessible components)
- **State Management:** Zustand
- **Form Handling:** React Hook Form & Zod
- **Drag & Drop:** `@dnd-kit`
- **Animations:** Framer Motion & Rive Canvas

**Backend (API & Services)**
- **Server:** Node.js & Express
- **API Layer:** tRPC (End-to-end typesafe APIs)
- **Services:** Nodemailer (Emails) & Google OAuth

**Database & Data Modeling**
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Schema includes User and Form models)

**Architecture & Tooling**
- **Monorepo:** Turborepo & pnpm
- **Type Checking:** TypeScript (Strict mode)
- **Linting & Formatting:** ESLint & Prettier