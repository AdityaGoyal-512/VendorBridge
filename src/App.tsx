import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQs from './pages/RFQs';

import Quotations from './pages/Quotations';
import SubmitQuotation from './pages/SubmitQuotation';
import CompareQuotations from './pages/CompareQuotations';

import Approvals from './pages/Approvals';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';

import CreateRFQ from './pages/CreateRFQ';
import CreateVendor from './pages/CreateVendor';

import UserManagement from './pages/UserManagement';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main App */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="vendors" element={<Vendors />} />
          <Route path="vendors/create" element={<CreateVendor />} />

          <Route path="rfqs" element={<RFQs />} />
          <Route path="rfqs/create" element={<CreateRFQ />} />

          <Route path="quotations" element={<Quotations />} />
          <Route path="quotations/submit" element={<SubmitQuotation />} />
          <Route path="quotations/compare" element={<CompareQuotations />} />

          <Route path="approvals" element={<Approvals />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activity-logs" element={<ActivityLogs />} />

          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;