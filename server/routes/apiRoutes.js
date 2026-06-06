import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  User, 
  Vendor, 
  RFQ, 
  PurchaseOrder, 
  Invoice, 
  ActivityLog, 
  Quotation 
} from '../models/index.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbackFilePath = path.join(__dirname, '../database_fallback.json');

// Default Seed Data
const defaultDb = {
  users: [
    { _id: '60d5ec493b8d4f4e7c756b1b', name: 'John Doe', email: 'john@example.com', role: 'admin', isActive: true },
    { _id: '60d5ec493b8d4f4e7c756b1c', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', isActive: true }
  ],
  vendors: [
    { _id: '60d5ec493b8d4f4e7c756b21', name: 'TechCorp Supplies', gstNumber: '22AAAAA0000A1Z5', email: 'contact@techcorp.com', phone: '1234567890', category: 'Electronics', status: 'active', rating: 4.8 },
    { _id: '60d5ec493b8d4f4e7c756b22', name: 'Office Essentials', gstNumber: '29BBBBB1111B2Z4', email: 'billing@officeessentials.com', phone: '9876543210', category: 'Office Supplies', status: 'active', rating: 4.2 },
    { _id: '60d5ec493b8d4f4e7c756b23', name: 'Global Logistics', gstNumber: '33CCCCC2222C3Z3', email: 'freight@globallogistics.com', phone: '5551234567', category: 'Logistics', status: 'active', rating: 4.5 },
    { _id: '60d5ec493b8d4f4e7c756b24', name: 'Delta Systems', gstNumber: '27DDDDD3333D4Z2', email: 'support@deltasystems.com', phone: '4449876543', category: 'Electronics', status: 'active', rating: 4.7 },
    { _id: '60d5ec493b8d4f4e7c756b25', name: 'Prime Manufacturing', gstNumber: '19EEEEE4444E5Z1', email: 'sales@primemfg.com', phone: '8887776666', category: 'Raw Materials', status: 'active', rating: 4.6 }
  ],
  rfqs: [],
  purchaseOrders: [],
  invoices: [],
  activityLogs: []
};

// Seed default RFQs, POs, Invoices, and Logs into target object
function getInitialSeededDb() {
  const db = JSON.parse(JSON.stringify(defaultDb));
  db.rfqs = [
    { _id: '60d5ec493b8d4f4e7c756b31', title: 'Q3 Office Equipment', productName: 'Developer Laptops & Monitors', description: 'Equipment upgrades for Q3 new hires.', quantity: 5, deadline: new Date('2026-06-15').toISOString(), status: 'published', assignedVendors: [db.vendors[0]], createdBy: db.users[0], createdAt: new Date().toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b32', title: 'Facility Maintenance Services', productName: 'HVAC repair and cleaning', description: 'Standard bi-annual warehouse repairs.', quantity: 1, deadline: new Date('2026-06-12').toISOString(), status: 'published', assignedVendors: [db.vendors[1]], createdBy: db.users[0], createdAt: new Date().toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b33', title: 'Server Upgrade Components', productName: 'SSD arrays & RAM kits', description: 'Upgrades for secondary data room.', quantity: 20, deadline: new Date('2026-06-10').toISOString(), status: 'closed', assignedVendors: [db.vendors[3]], createdBy: db.users[0], createdAt: new Date().toISOString() }
  ];

  db.purchaseOrders = [
    {
      _id: '60d5ec493b8d4f4e7c756b41',
      poNumber: 'PO-2026-001',
      quotationId: '60d5ec493b8d4f4e7c756b1a',
      vendorId: db.vendors[0],
      items: [
        { productName: 'Developer Laptops (16GB RAM)', quantity: 3, unitPrice: 1200.00, total: 3600.00 },
        { productName: 'UltraWide Monitors 34"', quantity: 2, unitPrice: 450.00, total: 900.00 }
      ],
      taxPercent: 18,
      taxAmount: 810.00,
      subtotal: 4500.00,
      totalAmount: 5310.00,
      status: 'pending',
      createdBy: db.users[0],
      createdAt: new Date('2026-06-05T10:00:00Z').toISOString()
    },
    {
      _id: '60d5ec493b8d4f4e7c756b42',
      poNumber: 'PO-2026-002',
      quotationId: '60d5ec493b8d4f4e7c756b1a',
      vendorId: db.vendors[1],
      items: [
        { productName: 'Ergonomic Desk Chairs', quantity: 5, unitPrice: 180.00, total: 900.00 },
        { productName: 'A4 Printing Paper (Boxes)', quantity: 8, unitPrice: 15.00, total: 120.00 }
      ],
      taxPercent: 18,
      taxAmount: 183.60,
      subtotal: 1020.00,
      totalAmount: 1203.60,
      status: 'approved',
      createdBy: db.users[0],
      createdAt: new Date('2026-06-04T12:00:00Z').toISOString()
    },
    {
      _id: '60d5ec493b8d4f4e7c756b43',
      poNumber: 'PO-2026-003',
      quotationId: '60d5ec493b8d4f4e7c756b1a',
      vendorId: db.vendors[2],
      items: [
        { productName: 'Ocean Freight Shipping Fee', quantity: 1, unitPrice: 7584.75, total: 7584.75 }
      ],
      taxPercent: 18,
      taxAmount: 1365.26,
      subtotal: 7584.75,
      totalAmount: 8950.01,
      status: 'shipped',
      createdBy: db.users[0],
      createdAt: new Date('2026-06-03T11:00:00Z').toISOString()
    },
    {
      _id: '60d5ec493b8d4f4e7c756b44',
      poNumber: 'PO-2026-004',
      quotationId: '60d5ec493b8d4f4e7c756b1a',
      vendorId: db.vendors[3],
      items: [
        { productName: 'Enterprise SaaS License (1 Year)', quantity: 1, unitPrice: 10508.47, total: 10508.47 }
      ],
      taxPercent: 18,
      taxAmount: 1891.53,
      subtotal: 10508.47,
      totalAmount: 12400.00,
      status: 'delivered',
      createdBy: db.users[0],
      createdAt: new Date('2026-06-02T15:00:00Z').toISOString()
    }
  ];

  db.invoices = [
    {
      _id: '60d5ec493b8d4f4e7c756b51',
      invoiceNumber: 'INV-2026-892',
      poId: db.purchaseOrders[3],
      vendorId: db.vendors[3],
      gstBreakdown: { cgst: 945.76, sgst: 945.76, igst: 0 },
      subtotal: 10508.47,
      totalAmount: 12400.00,
      status: 'paid',
      emailSent: true,
      createdAt: new Date('2026-06-02T16:00:00Z').toISOString(),
      dueDate: '2026-07-02'
    },
    {
      _id: '60d5ec493b8d4f4e7c756b52',
      invoiceNumber: 'INV-2026-893',
      poId: db.purchaseOrders[2],
      vendorId: db.vendors[2],
      gstBreakdown: { cgst: 682.63, sgst: 682.63, igst: 0 },
      subtotal: 7584.75,
      totalAmount: 8950.01,
      status: 'pending',
      emailSent: false,
      createdAt: new Date('2026-06-03T14:00:00Z').toISOString(),
      dueDate: '2026-06-15'
    },
    {
      _id: '60d5ec493b8d4f4e7c756b53',
      invoiceNumber: 'INV-2026-894',
      poId: db.purchaseOrders[1],
      vendorId: db.vendors[1],
      gstBreakdown: { cgst: 91.80, sgst: 91.80, igst: 0 },
      subtotal: 1020.00,
      totalAmount: 1203.60,
      status: 'overdue',
      emailSent: true,
      createdAt: new Date('2026-06-01T09:00:00Z').toISOString(),
      dueDate: '2026-06-01'
    },
    {
      _id: '60d5ec493b8d4f4e7c756b54',
      invoiceNumber: 'INV-2026-895',
      poId: db.purchaseOrders[0],
      vendorId: db.vendors[0],
      gstBreakdown: { cgst: 405.00, sgst: 405.00, igst: 0 },
      subtotal: 4500.00,
      totalAmount: 5310.00,
      status: 'processing',
      emailSent: false,
      createdAt: new Date('2026-06-05T11:00:00Z').toISOString(),
      dueDate: '2026-07-05'
    }
  ];

  db.activityLogs = [
    { _id: '60d5ec493b8d4f4e7c756b61', userId: db.users[0], action: 'Approved Purchase Order', module: 'po', targetId: db.purchaseOrders[3]._id, targetModel: 'PurchaseOrder', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b62', userId: db.users[0], action: 'Created new RFQ', module: 'rfq', targetId: db.rfqs[1]._id, targetModel: 'RFQ', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b63', userId: db.users[0], action: 'Auto-flagged Invoice', module: 'invoice', createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b64', userId: db.users[0], action: 'Added new Vendor Prime Manufacturing', module: 'vendor', targetId: db.vendors[4]._id, targetModel: 'Vendor', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
    { _id: '60d5ec493b8d4f4e7c756b65', userId: db.users[1], action: 'Approved Quotation QT-2026-105', module: 'quotation', createdAt: new Date(Date.now() - 30 * 3600000).toISOString() }
  ];
  return db;
}

// Read and write operations for local file database fallback
function getFallbackDb() {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const fileContent = fs.readFileSync(fallbackFilePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error('Error reading persistent fallback database file:', err);
  }
  
  // Initialize with seed data if file doesn't exist
  const initialDb = getInitialSeededDb();
  saveFallbackDb(initialDb);
  return initialDb;
}

function saveFallbackDb(dbData) {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing persistent fallback database file:', err);
  }
}

// Helper to determine database connection status
const isConnected = () => mongoose.connection.readyState === 1;

// --- SEED DATABASE ENDPOINT ---
router.get('/seed', async (req, res) => {
  console.log('Seed request received.');
  if (!isConnected()) {
    const initialDb = getInitialSeededDb();
    saveFallbackDb(initialDb);
    console.log('Seeded database fallback JSON file.');
    return res.json({ success: true, message: 'Persistent JSON database fallback successfully seeded!' });
  }

  try {
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await RFQ.deleteMany({});
    await Quotation.deleteMany({});
    await PurchaseOrder.deleteMany({});
    await Invoice.deleteMany({});
    await ActivityLog.deleteMany({});

    const johnDoe = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123',
      role: 'admin',
      isActive: true
    });

    const manager = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword123',
      role: 'manager',
      isActive: true
    });

    const dbVendors = await Vendor.create([
      { name: 'TechCorp Supplies', gstNumber: '22AAAAA0000A1Z5', email: 'contact@techcorp.com', phone: '1234567890', category: 'Electronics', status: 'active', rating: 4.8, createdBy: johnDoe._id },
      { name: 'Office Essentials', gstNumber: '29BBBBB1111B2Z4', email: 'billing@officeessentials.com', phone: '9876543210', category: 'Office Supplies', status: 'active', rating: 4.2, createdBy: johnDoe._id },
      { name: 'Global Logistics', gstNumber: '33CCCCC2222C3Z3', email: 'freight@globallogistics.com', phone: '5551234567', category: 'Logistics', status: 'active', rating: 4.5, createdBy: johnDoe._id },
      { name: 'Delta Systems', gstNumber: '27DDDDD3333D4Z2', email: 'support@deltasystems.com', phone: '4449876543', category: 'Electronics', status: 'active', rating: 4.7, createdBy: johnDoe._id },
      { name: 'Prime Manufacturing', gstNumber: '19EEEEE4444E5Z1', email: 'sales@primemfg.com', phone: '8887776666', category: 'Raw Materials', status: 'active', rating: 4.6, createdBy: johnDoe._id }
    ]);

    const vendorMap = {};
    dbVendors.forEach(v => { vendorMap[v.name] = v._id; });

    const dbRfqs = await RFQ.create([
      { title: 'Q3 Office Equipment', productName: 'Developer Laptops & Monitors', description: 'Equipment upgrades for Q3 new hires.', quantity: 5, deadline: new Date('2026-06-15'), status: 'published', assignedVendors: [vendorMap['TechCorp Supplies']], createdBy: johnDoe._id },
      { title: 'Facility Maintenance Services', productName: 'HVAC repair and cleaning', description: 'Standard bi-annual warehouse repairs.', quantity: 1, deadline: new Date('2026-06-12'), status: 'published', assignedVendors: [vendorMap['Office Essentials']], createdBy: johnDoe._id },
      { title: 'Server Upgrade Components', productName: 'SSD arrays & RAM kits', description: 'Upgrades for secondary data room.', quantity: 20, deadline: new Date('2026-06-10'), status: 'closed', assignedVendors: [vendorMap['Delta Systems']], createdBy: johnDoe._id }
    ]);

    const dbPos = await PurchaseOrder.create([
      {
        poNumber: 'PO-2026-001',
        quotationId: new mongoose.Types.ObjectId(),
        vendorId: vendorMap['TechCorp Supplies'],
        items: [
          { productName: 'Developer Laptops (16GB RAM)', quantity: 3, unitPrice: 1200.00, total: 3600.00 },
          { productName: 'UltraWide Monitors 34"', quantity: 2, unitPrice: 450.00, total: 900.00 }
        ],
        taxPercent: 18,
        taxAmount: 810.00,
        subtotal: 4500.00,
        totalAmount: 5310.00,
        status: 'pending',
        createdBy: johnDoe._id,
        createdAt: new Date('2026-06-05')
      },
      {
        poNumber: 'PO-2026-002',
        quotationId: new mongoose.Types.ObjectId(),
        vendorId: vendorMap['Office Essentials'],
        items: [
          { productName: 'Ergonomic Desk Chairs', quantity: 5, unitPrice: 180.00, total: 900.00 },
          { productName: 'A4 Printing Paper (Boxes)', quantity: 8, unitPrice: 15.00, total: 120.00 }
        ],
        taxPercent: 18,
        taxAmount: 183.60,
        subtotal: 1020.00,
        totalAmount: 1203.60,
        status: 'approved',
        createdBy: johnDoe._id,
        createdAt: new Date('2026-06-04')
      },
      {
        poNumber: 'PO-2026-003',
        quotationId: new mongoose.Types.ObjectId(),
        vendorId: vendorMap['Global Logistics'],
        items: [
          { productName: 'Ocean Freight Shipping Fee', quantity: 1, unitPrice: 7584.75, total: 7584.75 }
        ],
        taxPercent: 18,
        taxAmount: 1365.26,
        subtotal: 7584.75,
        totalAmount: 8950.01,
        status: 'shipped',
        createdBy: johnDoe._id,
        createdAt: new Date('2026-06-03')
      },
      {
        poNumber: 'PO-2026-004',
        quotationId: new mongoose.Types.ObjectId(),
        vendorId: vendorMap['Delta Systems'],
        items: [
          { productName: 'Enterprise SaaS License (1 Year)', quantity: 1, unitPrice: 10508.47, total: 10508.47 }
        ],
        taxPercent: 18,
        taxAmount: 1891.53,
        subtotal: 10508.47,
        totalAmount: 12400.00,
        status: 'delivered',
        createdBy: johnDoe._id,
        createdAt: new Date('2026-06-02')
      }
    ]);

    const poMap = {};
    dbPos.forEach(p => { poMap[p.poNumber] = p._id; });

    await Invoice.create([
      {
        invoiceNumber: 'INV-2026-892',
        poId: poMap['PO-2026-004'],
        vendorId: vendorMap['Delta Systems'],
        gstBreakdown: { cgst: 945.76, sgst: 945.76, igst: 0 },
        subtotal: 10508.47,
        totalAmount: 12400.00,
        status: 'paid',
        emailSent: true,
        createdAt: new Date('2026-06-02')
      },
      {
        invoiceNumber: 'INV-2026-893',
        poId: poMap['PO-2026-003'],
        vendorId: vendorMap['Global Logistics'],
        gstBreakdown: { cgst: 682.63, sgst: 682.63, igst: 0 },
        subtotal: 7584.75,
        totalAmount: 8950.01,
        status: 'pending',
        emailSent: false,
        createdAt: new Date('2026-06-03')
      },
      {
        invoiceNumber: 'INV-2026-894',
        poId: poMap['PO-2026-002'],
        vendorId: vendorMap['Office Essentials'],
        gstBreakdown: { cgst: 91.80, sgst: 91.80, igst: 0 },
        subtotal: 1020.00,
        totalAmount: 1203.60,
        status: 'overdue',
        emailSent: true,
        createdAt: new Date('2026-06-01')
      },
      {
        invoiceNumber: 'INV-2026-895',
        poId: poMap['PO-2026-001'],
        vendorId: vendorMap['TechCorp Supplies'],
        gstBreakdown: { cgst: 405.00, sgst: 405.00, igst: 0 },
        subtotal: 4500.00,
        totalAmount: 5310.00,
        status: 'processing',
        emailSent: false,
        createdAt: new Date('2026-06-05')
      }
    ]);

    await ActivityLog.create([
      { userId: johnDoe._id, action: 'Approved Purchase Order', module: 'po', targetId: poMap['PO-2026-004'], targetModel: 'PurchaseOrder', createdAt: new Date(Date.now() - 10 * 60000) },
      { userId: johnDoe._id, action: 'Created new RFQ', module: 'rfq', targetId: dbRfqs[1]._id, targetModel: 'RFQ', createdAt: new Date(Date.now() - 60 * 60000) },
      { userId: johnDoe._id, action: 'Auto-flagged Invoice', module: 'invoice', createdAt: new Date(Date.now() - 120 * 60000) },
      { userId: johnDoe._id, action: 'Added new Vendor Prime Manufacturing', module: 'vendor', targetId: vendorMap['Prime Manufacturing'], targetModel: 'Vendor', createdAt: new Date(Date.now() - 24 * 3600000) },
      { userId: manager._id, action: 'Approved Quotation QT-2026-105', module: 'quotation', createdAt: new Date(Date.now() - 30 * 3600000) }
    ]);

    res.json({ success: true, message: 'Database cleared and successfully seeded initial MongoDB records!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- USERS ROUTES ---
router.get('/users', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.users });
  }
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- VENDORS ROUTES ---
router.get('/vendors', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.vendors });
  }
  try {
    const vendors = await Vendor.find().populate('createdBy', 'name email');
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/vendors', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    const newVendor = {
      _id: new mongoose.Types.ObjectId().toString(),
      rating: 0,
      status: 'active',
      ...req.body
    };
    db.vendors.push(newVendor);
    saveFallbackDb(db);
    console.log(`Fallback file DB saved: added vendor ${newVendor.name}`);
    return res.json({ success: true, data: newVendor });
  }
  try {
    const user = await User.findOne() || { _id: new mongoose.Types.ObjectId() };
    const vendorData = { ...req.body, createdBy: user._id };
    const vendor = await Vendor.create(vendorData);
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- RFQS ROUTES ---
router.get('/rfqs', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.rfqs });
  }
  try {
    const rfqs = await RFQ.find()
      .populate('assignedVendors')
      .populate('createdBy', 'name email');
    res.json({ success: true, data: rfqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/rfqs', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    const newRfq = {
      _id: new mongoose.Types.ObjectId().toString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.rfqs.push(newRfq);
    saveFallbackDb(db);
    console.log(`Fallback file DB saved: created RFQ ${newRfq.title}`);
    return res.json({ success: true, data: newRfq });
  }
  try {
    const user = await User.findOne() || { _id: new mongoose.Types.ObjectId() };
    const rfqData = { ...req.body, createdBy: user._id };
    const rfq = await RFQ.create(rfqData);
    res.json({ success: true, data: rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- PURCHASE ORDERS ROUTES ---
router.get('/purchase-orders', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.purchaseOrders });
  }
  try {
    const pos = await PurchaseOrder.find()
      .populate('vendorId')
      .populate('createdBy', 'name email');
    res.json({ success: true, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/purchase-orders', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    const newPo = {
      _id: new mongoose.Types.ObjectId().toString(),
      status: 'generated',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.purchaseOrders.push(newPo);
    saveFallbackDb(db);
    console.log(`Fallback file DB saved: generated PO ${newPo.poNumber}`);
    return res.json({ success: true, data: newPo });
  }
  try {
    const user = await User.findOne() || { _id: new mongoose.Types.ObjectId() };
    const poData = { ...req.body, createdBy: user._id };
    const po = await PurchaseOrder.create(poData);
    res.json({ success: true, data: po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/purchase-orders/:id', async (req, res) => {
  const { id } = req.params;
  if (!isConnected()) {
    const db = getFallbackDb();
    const idx = db.purchaseOrders.findIndex(p => p._id === id);
    if (idx !== -1) {
      db.purchaseOrders[idx] = { ...db.purchaseOrders[idx], ...req.body };
      saveFallbackDb(db);
      console.log(`Fallback file DB saved: updated PO status for ID ${id}`);
      return res.json({ success: true, data: db.purchaseOrders[idx] });
    }
    return res.status(404).json({ success: false, message: 'Purchase order not found' });
  }
  try {
    const po = await PurchaseOrder.findByIdAndUpdate(id, req.body, { new: true })
      .populate('vendorId')
      .populate('createdBy', 'name email');
    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }
    res.json({ success: true, data: po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- INVOICES ROUTES ---
router.get('/invoices', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.invoices });
  }
  try {
    const invoices = await Invoice.find()
      .populate('poId')
      .populate('vendorId');
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/invoices', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    const newInvoice = {
      _id: new mongoose.Types.ObjectId().toString(),
      status: 'generated',
      emailSent: false,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.invoices.push(newInvoice);
    saveFallbackDb(db);
    console.log(`Fallback file DB saved: created invoice ${newInvoice.invoiceNumber}`);
    return res.json({ success: true, data: newInvoice });
  }
  try {
    const invoice = await Invoice.create(req.body);
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/invoices/:id', async (req, res) => {
  const { id } = req.params;
  if (!isConnected()) {
    const db = getFallbackDb();
    const idx = db.invoices.findIndex(i => i._id === id);
    if (idx !== -1) {
      db.invoices[idx] = { ...db.invoices[idx], ...req.body };
      saveFallbackDb(db);
      console.log(`Fallback file DB saved: updated invoice ID ${id}`);
      return res.json({ success: true, data: db.invoices[idx] });
    }
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }
  try {
    const invoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true })
      .populate('poId')
      .populate('vendorId');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- ACTIVITY LOGS ROUTES ---
router.get('/activity-logs', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    return res.json({ success: true, data: db.activityLogs });
  }
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/activity-logs', async (req, res) => {
  if (!isConnected()) {
    const db = getFallbackDb();
    const newLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.activityLogs.push(newLog);
    saveFallbackDb(db);
    console.log(`Fallback file DB saved: logged activity: ${newLog.action}`);
    return res.json({ success: true, data: newLog });
  }
  try {
    const user = await User.findOne() || { _id: new mongoose.Types.ObjectId() };
    const logData = { ...req.body, userId: req.body.userId || user._id };
    const log = await ActivityLog.create(logData);
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
