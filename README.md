# VendorBridge - Procurement ERP

VendorBridge is a modern, enterprise-grade Procurement ERP (Enterprise Resource Planning) system built with React, Vite, and TailwindCSS. It features a clean, minimal SaaS design inspired by modern enterprise software.

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Routing**: React Router v7
- **Data Fetching**: React Query v5
- **Icons**: Lucide React

---

## 🚀 Getting Started (For Developers)

In the Node.js ecosystem, we don't use a `requirements.txt` file (which is standard for Python). Instead, all dependencies and their required versions are defined in `package.json`. 

### Prerequisites
- **Node.js**: Version 20.x or higher (An `.nvmrc` file is included)
- **Package Manager**: `npm` v10+

### Standard Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdityaGoyal-512/VendorBridge.git
   cd VendorBridge
   ```

2. Use the correct Node version (if using nvm):
   ```bash
   nvm use
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## ⚠️ Important Note for Windows WSL Users

If you are developing inside Windows Subsystem for Linux (WSL), **do not use the Node.js installation from your Windows host**. Running Windows `npm` inside a WSL directory will fail during post-install scripts (due to UNC path constraints).

**WSL Setup Fix:**
1. Install Node Version Manager (NVM) natively inside your WSL Ubuntu terminal:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```
2. Restart your terminal and install Node native to Linux:
   ```bash
   nvm install 20
   nvm use 20
   ```
3. Remove any broken installations and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

## 📁 Project Structure

```
VendorBridge/
├── public/               # Static assets (favicons, etc.)
├── src/
│   ├── components/
│   │   ├── layout/       # Global layout components (Sidebar, Header)
│   │   └── ui/           # Reusable generic components (Buttons, Cards, Tables)
│   ├── lib/              # Utility functions (Tailwind mergers, etc.)
│   ├── pages/            # Main application screens (Dashboard, RFQs, etc.)
│   ├── App.tsx           # Router configuration and layout wrapping
│   ├── index.css         # Global CSS variables and Tailwind directives
│   └── main.tsx          # Application entry point
├── package.json          # Dependency list ("requirements.txt" equivalent)
├── tailwind.config.js    # Design system tokens and colors
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite bundler configuration
```

## 🎨 Design System

The application strictly follows a predefined design system:
- **Primary**: `#4F46E5` (Indigo)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)
- **Typography**: `Inter` (Google Fonts)

All new components should utilize the `cn()` utility from `@/lib/utils` and Tailwind classes to maintain aesthetic consistency.
