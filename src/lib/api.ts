// Client API library for VendorBridge Mongoose Backend Integration

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'procurement_officer' | 'vendor' | 'manager';
  isActive: boolean;
}

export interface Vendor {
  _id: string;
  name: string;
  gstNumber: string;
  email: string;
  phone: string;
  category: string;
  status: 'active' | 'inactive' | 'blacklisted';
  rating: number;
}

export interface RFQ {
  _id: string;
  title: string;
  productName: string;
  description: string;
  quantity: number;
  deadline: string;
  status: 'draft' | 'published' | 'closed';
  assignedVendors: (string | Vendor)[];
  createdBy: string | User;
  createdAt: string;
}

export interface POItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  quotationId: string;
  vendorId: string | Vendor;
  items: POItem[];
  taxPercent: number;
  taxAmount: number;
  subtotal: number;
  totalAmount: number;
  status: 'generated' | 'sent' | 'acknowledged' | 'fulfilled' | 'draft' | 'pending' | 'approved' | 'shipped' | 'delivered';
  createdBy: string | User;
  createdAt: string;
}

export interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  poId: string | PurchaseOrder;
  vendorId: string | Vendor;
  gstBreakdown: {
    cgst: number;
    sgst: number;
    igst: number;
  };
  subtotal: number;
  totalAmount: number;
  status: 'generated' | 'sent' | 'paid' | 'pending' | 'overdue' | 'processing';
  emailSent: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface ActivityLog {
  _id: string;
  userId: string | User;
  action: string;
  module: 'auth' | 'vendor' | 'rfq' | 'quotation' | 'approval' | 'po' | 'invoice';
  targetId?: string;
  targetModel?: string;
  metadata?: any;
  createdAt: string;
}

const API_BASE = '/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! Status: ${response.status}`);
  }
  const json = await response.json();
  return json.data as T;
}

export const api = {
  // Database Seeding Helper
  async seedDatabase(): Promise<string> {
    const res = await fetch(`${API_BASE}/seed`);
    const json = await res.json();
    return json.message;
  },

  // User Endpoints
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    return handleResponse<User[]>(res);
  },

  // Vendor Endpoints
  async getVendors(): Promise<Vendor[]> {
    const res = await fetch(`${API_BASE}/vendors`);
    return handleResponse<Vendor[]>(res);
  },

  async createVendor(data: Partial<Vendor>): Promise<Vendor> {
    const res = await fetch(`${API_BASE}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Vendor>(res);
  },

  // RFQ Endpoints
  async getRFQs(): Promise<RFQ[]> {
    const res = await fetch(`${API_BASE}/rfqs`);
    return handleResponse<RFQ[]>(res);
  },

  async createRFQ(data: Partial<RFQ>): Promise<RFQ> {
    const res = await fetch(`${API_BASE}/rfqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<RFQ>(res);
  },

  // Purchase Order Endpoints
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const res = await fetch(`${API_BASE}/purchase-orders`);
    return handleResponse<PurchaseOrder[]>(res);
  },

  async createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const res = await fetch(`${API_BASE}/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PurchaseOrder>(res);
  },

  async updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const res = await fetch(`${API_BASE}/purchase-orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PurchaseOrder>(res);
  },

  // Invoice Endpoints
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${API_BASE}/invoices`);
    return handleResponse<Invoice[]>(res);
  },

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Invoice>(res);
  },

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Invoice>(res);
  },

  // Activity Log Endpoints
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch(`${API_BASE}/activity-logs`);
    return handleResponse<ActivityLog[]>(res);
  },

  async createActivityLog(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const res = await fetch(`${API_BASE}/activity-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ActivityLog>(res);
  },
};
