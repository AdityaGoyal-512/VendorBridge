# VendorBridge ERP — MongoDB Schema

> **Freeze Date:** Day 0 — All members must agree on this before writing any code.
> Do NOT modify schemas mid-hackathon without team consensus.

---

## 1. User

```js
{
  _id: ObjectId,
  name: String,               // Full name
  email: String,              // Unique, indexed
  password: String,           // bcrypt hashed
  role: {
    type: String,
    enum: ["admin", "procurement_officer", "vendor", "manager"]
  },
  isActive: Boolean,          // Default: true
  vendorId: ObjectId,         // Ref: Vendor (only if role === "vendor")
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. Vendor

```js
{
  _id: ObjectId,
  name: String,
  gstNumber: String,          // Validated format: 15-char GST
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  category: String,           // e.g. "Electronics", "Office Supplies"
  status: {
    type: String,
    enum: ["active", "inactive", "blacklisted"],
    default: "active"
  },
  rating: Number,             // 0–5, computed from past quotations
  createdBy: ObjectId,        // Ref: User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. RFQ (Request for Quotation)

```js
{
  _id: ObjectId,
  title: String,
  productName: String,
  description: String,
  quantity: Number,
  deadline: Date,
  attachmentUrl: String,      // Uploaded file path
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "draft"
  },
  assignedVendors: [ObjectId], // Ref: Vendor[]
  createdBy: ObjectId,         // Ref: User (Procurement Officer)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. Quotation

```js
{
  _id: ObjectId,
  rfqId: ObjectId,            // Ref: RFQ
  vendorId: ObjectId,         // Ref: Vendor
  unitPrice: Number,
  quantity: Number,
  totalPrice: Number,         // Auto-calculated: unitPrice * quantity
  deliveryTime: Number,       // In days
  notes: String,
  status: {
    type: String,
    enum: ["submitted", "under_review", "accepted", "rejected"],
    default: "submitted"
  },
  submittedAt: Date,
  updatedAt: Date
}
```

---

## 5. Approval

```js
{
  _id: ObjectId,
  quotationId: ObjectId,      // Ref: Quotation
  rfqId: ObjectId,            // Ref: RFQ
  managerId: ObjectId,        // Ref: User (Manager)
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  remarks: String,
  timeline: [
    {
      action: String,         // e.g. "Submitted for Approval", "Approved"
      performedBy: ObjectId,  // Ref: User
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. PurchaseOrder

```js
{
  _id: ObjectId,
  poNumber: String,           // Auto-generated: PO-YYYYMMDD-XXXX
  quotationId: ObjectId,      // Ref: Quotation
  vendorId: ObjectId,         // Ref: Vendor
  items: [
    {
      productName: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }
  ],
  taxPercent: Number,         // e.g. 18 (for 18% GST)
  taxAmount: Number,          // Computed
  subtotal: Number,           // Computed
  totalAmount: Number,        // Computed: subtotal + taxAmount
  status: {
    type: String,
    enum: ["generated", "sent", "acknowledged", "fulfilled"],
    default: "generated"
  },
  pdfUrl: String,             // Path to exported PDF
  createdBy: ObjectId,        // Ref: User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. Invoice

```js
{
  _id: ObjectId,
  invoiceNumber: String,      // Auto-generated: INV-YYYYMMDD-XXXX
  poId: ObjectId,             // Ref: PurchaseOrder
  vendorId: ObjectId,         // Ref: Vendor
  gstBreakdown: {
    cgst: Number,
    sgst: Number,
    igst: Number
  },
  subtotal: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ["generated", "sent", "paid"],
    default: "generated"
  },
  pdfUrl: String,
  emailSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. ActivityLog

```js
{
  _id: ObjectId,
  userId: ObjectId,           // Ref: User — who performed the action
  action: String,             // e.g. "Created RFQ", "Approved Quotation"
  module: {
    type: String,
    enum: ["auth", "vendor", "rfq", "quotation", "approval", "po", "invoice"]
  },
  targetId: ObjectId,         // ID of the affected document
  targetModel: String,        // e.g. "RFQ", "Vendor"
  metadata: Object,           // Any extra context (optional)
  createdAt: Date
}
```

---

## Indexes to Create

| Collection   | Field(s)              | Type   |
|--------------|-----------------------|--------|
| users        | email                 | Unique |
| vendors      | gstNumber             | Unique |
| rfqs         | status, createdBy     | Normal |
| quotations   | rfqId, vendorId       | Normal |
| approvals    | quotationId, status   | Normal |
| purchaseorders | poNumber            | Unique |
| invoices     | invoiceNumber         | Unique |
| activitylogs | userId, createdAt     | Normal |
