import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShoppingCart, 
  Plus, 
  ArrowLeft, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  CheckSquare, 
  AlertCircle,
  Building,
  Calendar,
  DollarSign,
  Printer
} from 'lucide-react';

interface POItem {
  name: string;
  qty: number;
  price: number;
}

interface PO {
  id: string;
  vendor: string;
  date: string;
  delivery: string;
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'delivered';
  items: POItem[];
}

const initialPOs: PO[] = [
  { 
    id: 'PO-2026-001', 
    vendor: 'TechCorp Supplies', 
    date: '2026-06-05', 
    delivery: '2026-06-15', 
    status: 'pending',
    items: [
      { name: 'Developer Laptops (16GB RAM)', qty: 3, price: 1200.00 },
      { name: 'UltraWide Monitors 34"', qty: 2, price: 450.00 }
    ]
  },
  { 
    id: 'PO-2026-002', 
    vendor: 'Office Essentials', 
    date: '2026-06-04', 
    delivery: '2026-06-10', 
    status: 'approved',
    items: [
      { name: 'Ergonomic Desk Chairs', qty: 5, price: 180.00 },
      { name: 'A4 Printing Paper (Boxes)', qty: 8, price: 15.00 }
    ]
  },
  { 
    id: 'PO-2026-003', 
    vendor: 'Global Logistics', 
    date: '2026-06-03', 
    delivery: '2026-06-08', 
    status: 'shipped',
    items: [
      { name: 'Ocean Freight Shipping Fee', qty: 1, price: 7584.75 }
    ]
  },
  { 
    id: 'PO-2026-004', 
    vendor: 'Delta Systems', 
    date: '2026-06-02', 
    delivery: '2026-06-05', 
    status: 'delivered',
    items: [
      { name: 'Enterprise SaaS License (1 Year)', qty: 1, price: 10508.47 }
    ]
  },
  { 
    id: 'PO-2026-005', 
    vendor: 'Prime Manufacturing', 
    date: '2026-06-06', 
    delivery: '2026-06-25', 
    status: 'draft',
    items: [
      { name: 'Industrial Grade Steel Rods', qty: 25, price: 400.00 },
      { name: 'Coupling Joints (Pack of 50)', qty: 10, price: 271.18 }
    ]
  },
];

const VENDORS = [
  'TechCorp Supplies',
  'Office Essentials',
  'Global Logistics',
  'Delta Systems',
  'Prime Manufacturing'
];

export default function PurchaseOrders() {
  const [posList, setPosList] = useState<PO[]>(initialPOs);
  const [activeView, setActiveView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New PO Form State
  const [newPoNumber, setNewPoNumber] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(VENDORS[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [formItems, setFormItems] = useState<POItem[]>([{ name: '', qty: 1, price: 0 }]);

  // Calculations helper
  const calculateTotals = (items: POItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * 0.18; // 18% VAT/Tax
    const total = subtotal + tax;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const formatCurrency = (amount: number | string) => {
    const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric);
  };

  // Add Item row in form
  const addFormItem = () => {
    setFormItems([...formItems, { name: '', qty: 1, price: 0 }]);
  };

  // Remove Item row in form
  const removeFormItem = (index: number) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter((_, i) => i !== index));
    }
  };

  // Update Item value
  const handleItemChange = (index: number, field: keyof POItem, value: string | number) => {
    const updated = [...formItems];
    if (field === 'qty') {
      updated[index].qty = Math.max(1, parseInt(value as string) || 1);
    } else if (field === 'price') {
      updated[index].price = Math.max(0, parseFloat(value as string) || 0);
    } else {
      updated[index].name = value as string;
    }
    setFormItems(updated);
  };

  // Initialize New Form
  const startCreatePO = () => {
    const nextNum = `PO-2026-${String(posList.length + 1).padStart(3, '0')}`;
    setNewPoNumber(nextNum);
    setSelectedVendor(VENDORS[0]);
    // Default delivery date to 10 days from now
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 10);
    setDeliveryDate(delivery.toISOString().split('T')[0]);
    setFormItems([{ name: '', qty: 1, price: 0 }]);
    setActiveView('create');
  };

  // Submit/Generate PO
  const handleGeneratePO = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate items
    const validItems = formItems.filter(item => item.name.trim() !== '' && item.price > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid item with name and price.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newPO: PO = {
      id: newPoNumber || `PO-2026-${String(posList.length + 1).padStart(3, '0')}`,
      vendor: selectedVendor,
      date: todayStr,
      delivery: deliveryDate,
      status: 'pending', // Starts as pending for workflow
      items: validItems
    };

    setPosList([newPO, ...posList]);
    setSelectedPO(newPO);
    setActiveView('details');
  };

  // Advance workflow status for tracking
  const advancePOStatus = (poId: string) => {
    const statusWorkflow: PO['status'][] = ['draft', 'pending', 'approved', 'shipped', 'delivered'];
    
    setPosList(prev => prev.map(po => {
      if (po.id === poId) {
        const currentIndex = statusWorkflow.indexOf(po.status);
        const nextIndex = Math.min(currentIndex + 1, statusWorkflow.length - 1);
        const updatedPO = { ...po, status: statusWorkflow[nextIndex] };
        
        // Keep selectedPO synchronized
        if (selectedPO?.id === poId) {
          setSelectedPO(updatedPO);
        }
        return updatedPO;
      }
      return po;
    }));
  };

  // Decline / Revert PO
  const cancelPO = (poId: string) => {
    setPosList(prev => prev.map(po => {
      if (po.id === poId) {
        const updatedPO = { ...po, status: 'draft' as const };
        if (selectedPO?.id === poId) {
          setSelectedPO(updatedPO);
        }
        return updatedPO;
      }
      return po;
    }));
  };

  // Mock PDF Download
  const handleDownloadPDF = (po: PO) => {
    const { subtotal, tax, total } = calculateTotals(po.items);
    
    const voucherText = `
==================================================
              PURCHASE ORDER VOUCHER
==================================================
PO Number     : ${po.id}
Vendor Name   : ${po.vendor}
Date Issued   : ${po.date}
Est. Delivery : ${po.delivery}
Status        : ${po.status.toUpperCase()}
--------------------------------------------------
ITEMS LISTED:
${po.items.map((item, idx) => `${idx + 1}. ${item.name.padEnd(30)} x${String(item.qty).padEnd(3)} @ ${formatCurrency(item.price)}`).join('\n')}
--------------------------------------------------
Subtotal      : ${formatCurrency(subtotal)}
Tax (18% VAT) : ${formatCurrency(tax)}
GRAND TOTAL   : ${formatCurrency(total)}
==================================================
Generated via VendorBridge. All rights reserved.
==================================================
`;

    const element = document.createElement("a");
    const file = new Blob([voucherText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${po.id}_PurchaseOrder.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter list
  const filteredPOs = posList.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchase Orders</h1>
          <p className="text-muted-foreground mt-0.5">Generate procurements, track delivery progress, and export vouchers.</p>
        </div>
        {activeView === 'list' && (
          <Button onClick={startCreatePO} className="h-10 bg-primary text-white shadow-sm shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        )}
        {activeView !== 'list' && (
          <Button variant="ghost" onClick={() => setActiveView('list')} className="h-10 border border-slate-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        )}
      </div>

      {/* -------------------- VIEW 1: PO LIST EXPLORER -------------------- */}
      {activeView === 'list' && (
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by PO number or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-input rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              
              <div className="flex items-center border border-input bg-white rounded-lg px-2 py-1 shadow-sm">
                <Filter className="h-4 w-4 text-slate-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-0 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer pr-4"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground font-medium w-full sm:w-auto text-right">
              Showing {filteredPOs.length} of {posList.length} orders
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="pl-6">PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Exp. Delivery</TableHead>
                  <TableHead className="text-right">Items Count</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead className="pl-8">Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No purchase orders found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => {
                    const { total } = calculateTotals(po.items);
                    const itemsCount = po.items.reduce((acc, it) => acc + it.qty, 0);
                    return (
                      <TableRow key={po.id} className="hover:bg-slate-50/40 transition-colors">
                        <TableCell className="pl-6 font-semibold text-slate-900 flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          {po.id}
                        </TableCell>
                        <TableCell className="font-semibold text-primary hover:underline cursor-pointer" onClick={() => {
                          setSelectedPO(po);
                          setActiveView('details');
                        }}>
                          {po.vendor}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">{po.date}</TableCell>
                        <TableCell className="text-slate-600 text-sm">{po.delivery}</TableCell>
                        <TableCell className="text-right font-medium text-slate-700">{itemsCount} units</TableCell>
                        <TableCell className="text-right font-bold text-slate-950">{formatCurrency(total)}</TableCell>
                        <TableCell className="pl-8">
                          <Badge 
                            variant={
                              po.status === 'approved' ? 'success' :
                              po.status === 'pending' ? 'warning' :
                              po.status === 'shipped' ? 'default' :
                              po.status === 'delivered' ? 'outline' : 'secondary'
                            }
                            className="capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs font-medium text-primary bg-indigo-50/40 hover:bg-indigo-50"
                              onClick={() => {
                                setSelectedPO(po);
                                setActiveView('details');
                              }}
                            >
                              Track & View
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-slate-100"
                              onClick={() => handleDownloadPDF(po)}
                              title="Download Text Voucher"
                            >
                              <Download className="h-4 w-4 text-slate-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* -------------------- VIEW 2: PO GENERATOR FORM -------------------- */}
      {activeView === 'create' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Entry Form */}
          <Card className="lg:col-span-2 border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">PO Generator Details</CardTitle>
              <CardDescription>Enter procurement particulars and item quantities.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleGeneratePO} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">PO Number</label>
                    <input
                      type="text"
                      value={newPoNumber}
                      onChange={(e) => setNewPoNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="PO-2026-000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Select Vendor</label>
                    <select
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    >
                      {VENDORS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Procured Items</h3>
                    <Button type="button" onClick={addFormItem} variant="outline" size="sm" className="h-8 border-slate-200 text-xs font-semibold text-slate-700">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                        <div className="flex-1 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Item description (e.g. Ergonomic Office Chairs)"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center"
                            required
                          />
                        </div>
                        <div className="w-32 relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-semibold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Unit Price"
                            value={item.price || ''}
                            onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md pl-6 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="w-24 text-right text-sm font-bold text-slate-900 pr-1">
                          {formatCurrency(item.qty * item.price)}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-danger hover:bg-danger/10 hover:text-danger"
                          onClick={() => removeFormItem(idx)}
                          disabled={formItems.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 gap-3">
                  <Button type="button" variant="ghost" onClick={() => setActiveView('list')} className="border border-slate-200 text-slate-700">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-white shadow-sm shadow-primary/20">
                    Generate Purchase Order
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Pricing Calculation Summary (Col Span 1) */}
          <Card className="border-slate-100 shadow-sm h-fit">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30">
              <CardTitle className="text-md text-slate-800">PO Cost Summary</CardTitle>
              <CardDescription>Live pricing calculations based on tax codes.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calculateTotals(formItems).subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax / VAT (18%)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calculateTotals(formItems).tax)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-primary text-lg">{formatCurrency(calculateTotals(formItems).total)}</span>
                </div>
              </div>

              <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50 text-xs text-primary/80 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Generating this Purchase Order will set its initial status to <strong>Pending Approval</strong>. It must be approved before shipping.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* -------------------- VIEW 3: PO DETAILS & STATUS TRACKER -------------------- */}
      {activeView === 'details' && selectedPO && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* Main Invoice Voucher details (Col Span 2) */}
          <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
            
            {/* Printable Area Wrapper */}
            <div id="printable-po-voucher" className="p-6 sm:p-8 bg-white">
              
              {/* Voucher Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">V</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900">VendorBridge Corp.</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    100 Innovation Parkway, Suite 500<br />
                    San Francisco, CA 94107<br />
                    procurement@vendorbridge.com
                  </p>
                </div>
                <div className="sm:text-right">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">PURCHASE ORDER</h2>
                  <div className="text-primary text-lg font-bold mt-1">{selectedPO.id}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Date Issued: <strong className="text-slate-700">{selectedPO.date}</strong><br />
                    Est. Delivery: <strong className="text-slate-700">{selectedPO.delivery}</strong>
                  </p>
                </div>
              </div>

              {/* Vendor & Delivery Particulars */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> Vendor Information
                  </h4>
                  <div className="font-bold text-slate-900 text-sm">{selectedPO.vendor}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Registered Vendor ID: VB-{selectedPO.vendor.replace(/\s+/g, '').substring(0, 5).toUpperCase()}<br />
                    Contact: accounts@{selectedPO.vendor.toLowerCase().replace(/\s+/g, '')}.com
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Shipping Destination
                  </h4>
                  <div className="font-semibold text-slate-800 text-sm">VendorBridge Central Warehouse</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Dock 4, 850 Logistics Blvd<br />
                    Oakland, CA 94607<br />
                    Delivery Window: 08:00 AM - 04:00 PM
                  </p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Itemized Procurement</h4>
                <Table className="border rounded-lg overflow-hidden">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item Details</TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">Unit Price</TableHead>
                      <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</TableHead>
                      <TableHead className="pr-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Line Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="pl-4 font-semibold text-slate-900 text-sm">{item.name}</TableCell>
                        <TableCell className="text-right text-slate-600">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-center text-slate-900 font-medium">{item.qty}</TableCell>
                        <TableCell className="pr-4 text-right font-bold text-slate-950">
                          {formatCurrency(item.qty * item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-slate-100 pt-6">
                <div className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  <strong>Standard Agreement:</strong><br />
                  Payment terms are Net 30. Delivery must comply with standard packaging requirements. Vendor is responsible for transportation liabilities until receipt of goods.
                </div>
                <div className="w-full sm:w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateTotals(selectedPO.items).subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (18% Standard)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateTotals(selectedPO.items).tax)}</span>
                  </div>
                  <div className="border-t border-slate-150 pt-2.5 flex justify-between text-base font-bold text-slate-950">
                    <span>Grand Total</span>
                    <span className="text-primary text-lg font-extrabold">{formatCurrency(calculateTotals(selectedPO.items).total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Card Footer */}
            <div className="bg-slate-50/70 border-t border-slate-100 p-4 flex flex-wrap justify-between items-center gap-3">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                ID: {selectedPO.id}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleDownloadPDF(selectedPO)} 
                  variant="outline"
                  size="sm" 
                  className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Download Plain text Voucher
                </Button>
                
                <Button 
                  onClick={() => window.print()} 
                  variant="outline"
                  size="sm" 
                  className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print PO
                </Button>
              </div>
            </div>
          </Card>

          {/* Workflow status tracker sidebar (Col Span 1) */}
          <div className="space-y-6">
            
            {/* Stepper tracking view */}
            <Card className="border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30">
                <CardTitle className="text-md text-slate-900 flex items-center justify-between">
                  <span>Status Tracking</span>
                  <Badge 
                    variant={
                      selectedPO.status === 'approved' ? 'success' :
                      selectedPO.status === 'pending' ? 'warning' :
                      selectedPO.status === 'shipped' ? 'default' :
                      selectedPO.status === 'delivered' ? 'outline' : 'secondary'
                    }
                    className="capitalize text-[10px] px-2"
                  >
                    {selectedPO.status}
                  </Badge>
                </CardTitle>
                <CardDescription>Live fulfillment steps of this procurement.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                
                {/* Visual Steps Stepper */}
                <div className="relative pl-6 space-y-6">
                  
                  {/* Vertical connect line */}
                  <div className="absolute top-2 left-2.5 bottom-2 -ml-px w-0.5 bg-slate-100"></div>

                  {/* Step 1: Draft */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white z-10 text-[10px] font-bold
                      ${['draft', 'pending', 'approved', 'shipped', 'delivered'].includes(selectedPO.status)
                        ? 'bg-success text-white' : 'bg-slate-200 text-slate-600'}
                    `}>
                      {['draft', 'pending', 'approved', 'shipped', 'delivered'].indexOf(selectedPO.status) > 0 ? '✓' : '1'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Draft Created</p>
                      <p className="text-[10px] text-slate-400">PO generated in draft status</p>
                    </div>
                  </div>

                  {/* Step 2: Pending */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white z-10 text-[10px] font-bold
                      ${['pending', 'approved', 'shipped', 'delivered'].includes(selectedPO.status)
                        ? 'bg-success text-white' : 'bg-slate-200 text-slate-600'}
                    `}>
                      {['pending', 'approved', 'shipped', 'delivered'].indexOf(selectedPO.status) > 1 ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Pending Approval</p>
                      <p className="text-[10px] text-slate-400">Awaiting procurement manager review</p>
                    </div>
                  </div>

                  {/* Step 3: Approved */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white z-10 text-[10px] font-bold
                      ${['approved', 'shipped', 'delivered'].includes(selectedPO.status)
                        ? 'bg-success text-white' : 'bg-slate-200 text-slate-600'}
                    `}>
                      {['approved', 'shipped', 'delivered'].indexOf(selectedPO.status) > 2 ? '✓' : '3'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Approved</p>
                      <p className="text-[10px] text-slate-400">Signed off and dispatched to vendor</p>
                    </div>
                  </div>

                  {/* Step 4: Shipped */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white z-10 text-[10px] font-bold
                      ${['shipped', 'delivered'].includes(selectedPO.status)
                        ? 'bg-success text-white' : 'bg-slate-200 text-slate-600'}
                    `}>
                      {['shipped', 'delivered'].indexOf(selectedPO.status) > 3 ? '✓' : '4'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Shipped</p>
                      <p className="text-[10px] text-slate-400">Transit in progress via carrier logistics</p>
                    </div>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="relative flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white z-10 text-[10px] font-bold
                      ${selectedPO.status === 'delivered' ? 'bg-success text-white' : 'bg-slate-200 text-slate-600'}
                    `}>
                      5
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Delivered</p>
                      <p className="text-[10px] text-slate-400">Received and verified at local warehouse</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Action workflows */}
                <div className="border-t border-slate-100 pt-6 mt-6 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Workflow Controls</h4>
                  
                  {selectedPO.status !== 'delivered' ? (
                    <Button 
                      onClick={() => advancePOStatus(selectedPO.id)} 
                      className="w-full bg-primary hover:bg-primary/95 text-white text-xs h-9 font-semibold"
                    >
                      {selectedPO.status === 'draft' && 'Submit for Review'}
                      {selectedPO.status === 'pending' && 'Approve Purchase Order'}
                      {selectedPO.status === 'approved' && 'Mark as Shipped'}
                      {selectedPO.status === 'shipped' && 'Confirm Received / Delivered'}
                    </Button>
                  ) : (
                    <div className="flex gap-1.5 items-center justify-center p-3 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Procurement workflow complete.
                    </div>
                  )}

                  {['pending', 'approved', 'shipped'].includes(selectedPO.status) && (
                    <Button 
                      onClick={() => cancelPO(selectedPO.id)} 
                      variant="ghost"
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-9"
                    >
                      Revert PO to Draft
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
