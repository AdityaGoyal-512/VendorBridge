# VendorBridge - Enterprise Procurement ERP

VendorBridge is a comprehensive, full-stack Enterprise Resource Planning (ERP) system designed to streamline corporate procurement. It features a complete end-to-end workflow connecting Internal Procurement Managers with External Vendors, utilizing strict Role-Based Access Control (RBAC).

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Secure routing and UI elements tailored specifically for `Admin`, `Procurement Officer`, `Manager`, and `Vendor`.
- **RFQ Management**: Create and publish Requests for Quotation to an open market of registered vendors.
- **Dynamic Bidding & Quotations**: Vendors can submit detailed quotes against open RFQs.
- **Bid Comparisons**: Procurement officers can view automated, side-by-side bid comparisons highlighting the lowest/best bids.
- **Approval Queues**: A centralized dashboard for managers to approve or reject vendor quotes.
- **Invoicing & POs**: Automated GST tax splitting, purchase order tracking, and invoice dispatching.

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite + TypeScript
- TailwindCSS & Shadcn UI (Radix)
- React Router v7 & React Query v5

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) Authentication
- Zod Data Validation

---

## 🚀 Getting Started (Local Development)

The application consists of two separate servers that need to be run concurrently: the Vite frontend and the Node backend.

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (A local instance on `mongodb://127.0.0.1:27017` or an Atlas URI)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory with:
```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/vendorbridge
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h
```
Start the backend:
```bash
npm run dev
# Server will start on http://localhost:8080
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd VendorBridge # (Project Root)
npm install
```
Start the Vite development server:
```bash
npm run dev
# Frontend will start on http://localhost:5173
```

### 4. Default Test Accounts
If you use the backend `/api/v1/seed` endpoint or register manually, you can test different roles:
- **Manager**: `admin@vendorbridge.com` (Has access to Approvals and Comparisons)
- **Vendor**: `supplier@logistics.com` (Has access to Submit Quotes, restricted from internal tools)

---

## 📁 Project Structure

```text
VendorBridge/
├── server/                 # Express Backend
│   ├── controllers/        # Business logic (auth, quotations, rfqs)
│   ├── middleware/         # JWT Auth and RBAC guards
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API routes
│   └── server.js           # Entry point
├── src/                    # React Frontend
│   ├── components/layout/  # Dynamic Sidebar (Role-filtered)
│   ├── pages/              # Application screens
│   ├── lib/api.ts          # Axios/Fetch API client wrappers
│   └── App.tsx             # Routing configuration
└── tailwind.config.js      # Global design tokens
```
