import React, { useState, useEffect } from 'react';
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
  Receipt, 
  Plus, 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  AlertCircle, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { api, Invoice, PurchaseOrder, Vendor } from '@/lib/api';

export default function Invoices() {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [posList, setPosList] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Invoice Form State
  const [newInvNumber, setNewInvNumber] = useState('');
  const [poReferenceId, setPoReferenceId] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [invs, vends, pos] = await Promise.all([
          api.getInvoices(),
          api.getVendors(),
          api.getPurchaseOrders()
        ]);
        setInvoicesList(invs || []);
        setVendorsList(vends || []);
        setPosList(pos || []);
        if (vends && vends.length > 0) {
          setSelectedVendorId(vends[0]._id);
        }
        if (pos && pos.length > 0) {
          setPoReferenceId(pos[0]._id);
        }
      } catch (err) {
        console.error('Error loading Invoices data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getVendorName = (inv: Invoice) => {
    if (typeof inv.vendorId === 'object' && inv.vendorId) {
      return (inv.vendorId as any).name;
    }
    const found = vendorsList.find(v => v._id === inv.vendorId);
    return found ? found.name : 'Unknown Vendor';
  };

  const getPoNumber = (inv: Invoice) => {
    if (typeof inv.poId === 'object' && inv.poId) {
      return (inv.poId as any).poNumber;
    }
    const found = posList.find(p => p._id === inv.poId);
    return found ? found.poNumber : 'Unknown PO';
  };

  const getInvoiceItems = (inv: Invoice) => {
    if (typeof inv.poId === 'object' && inv.poId && (inv.poId as any).items) {
      return (inv.poId as any).items;
    }
    const foundPo = posList.find(p => p._id === (inv.poId as any));
    if (foundPo && foundPo.items) {
      return foundPo.items;
    }
    return [];
  };

  // Calculations helper
  const calculateGSTTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => {
      const q = item.quantity || item.qty || 0;
      const p = item.unitPrice || item.price || 0;
      return sum + (q * p);
    }, 0);
    const cgst = subtotal * 0.09; // 9% CGST
    const sgst = subtotal * 0.09; // 9% SGST
    const totalTax = cgst + sgst;
    const grandTotal = subtotal + totalTax;

    return {
      subtotal: subtotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      totalTax: totalTax.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  };

  const formatCurrency = (amount: number | string) => {
    const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(numeric);
  };

  // Initialize New Form
  const startCreateInvoice = () => {
    const nextNum = `INV-2026-${String(invoicesList.length + 892).padStart(3, '0')}`;
    setNewInvNumber(nextNum);
    if (posList.length > 0) {
      setPoReferenceId(posList[0]._id);
      setSelectedVendorId(posList[0].vendorId as string);
    } else if (vendorsList.length > 0) {
      setSelectedVendorId(vendorsList[0]._id);
    }
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setDueDate(due.toISOString().split('T')[0]);
    setActiveView('create');
  };

  // Submit/Generate Invoice
  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = posList.find(p => p._id === poReferenceId);
    if (!po) {
      alert('Selected Purchase Order not found.');
      return;
    }

    const { subtotal, cgst, sgst, grandTotal } = calculateGSTTotals(po.items);

    const payload = {
      invoiceNumber: newInvNumber || `INV-2026-${String(invoicesList.length + 892).padStart(3, '0')}`,
      poId: po._id,
      vendorId: typeof po.vendorId === 'object' && po.vendorId ? (po.vendorId as any)._id : po.vendorId,
      gstBreakdown: {
        cgst: parseFloat(cgst),
        sgst: parseFloat(sgst),
        igst: 0
      },
      subtotal: parseFloat(subtotal),
      totalAmount: parseFloat(grandTotal),
      status: 'pending' as const,
      emailSent: false,
      dueDate: dueDate
    };

    try {
      const created = await api.createInvoice(payload);
      setInvoicesList([created, ...invoicesList]);
      setSelectedInvoice(created);
      setActiveView('details');

      await api.createActivityLog({
        action: `Generated Invoice ${created.invoiceNumber}`,
        module: 'invoice',
        targetId: created._id,
        targetModel: 'Invoice'
      });
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Failed to generate invoice: ' + err);
    }
  };

  // Set up Email Modal fields
  const triggerEmailModal = (inv: Invoice) => {
    const items = getInvoiceItems(inv);
    const totals = calculateGSTTotals(items);
    const vendorName = getVendorName(inv);
    const poNum = getPoNumber(inv);
    setRecipientEmail(`billing@${vendorName.toLowerCase().replace(/\s+/g, '')}.com`);
    setEmailSubject(`Invoice ${inv.invoiceNumber} payment reminder - VendorBridge`);
    setEmailBody(`Dear accounts team at ${vendorName},\n\nThis is a notification regarding invoice ${inv.invoiceNumber} linked to PO reference ${poNum} which has a due date of ${inv.dueDate || 'N/A'}.\n\nThe total payable amount including CGST (9%) and SGST (9%) calculations is ${formatCurrency(totals.grandTotal)}.\n\nPlease confirm receipt of invoice and initiate payment.\n\nBest regards,\nProcurement Department\nVendorBridge Corp.`);
    setEmailSentSuccess(false);
    setEmailModalOpen(true);
  };

  // Simulate Email Dispatch
  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setEmailSending(true);
    
    try {
      const updated = await api.updateInvoice(selectedInvoice._id, { emailSent: true });
      setInvoicesList(prev => prev.map(inv => inv._id === selectedInvoice._id ? updated : inv));
      setSelectedInvoice(updated);
      
      setEmailSending(false);
      setEmailSentSuccess(true);
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailSentSuccess(false);
      }, 1500);

      await api.createActivityLog({
        action: `Emailed payment reminder for Invoice ${updated.invoiceNumber}`,
        module: 'invoice',
        targetId: updated._id,
        targetModel: 'Invoice'
      });
    } catch (err) {
      console.error('Error sending email:', err);
      setEmailSending(false);
    }
  };

  // Mock plain-text download
  const handleDownloadInvoice = (inv: Invoice) => {
    const items = getInvoiceItems(inv);
    const totals = calculateGSTTotals(items);
    const vendorName = getVendorName(inv);
    const poNum = getPoNumber(inv);
    const dateStr = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A';
    
    const voucherText = `
==================================================
              INVOICE VOUCHER DETAILS
==================================================
Invoice ID    : ${inv.invoiceNumber}
PO Reference  : ${poNum}
Vendor Name   : ${vendorName}
Due Date      : ${inv.dueDate}
Status        : ${inv.status.toUpperCase()}
--------------------------------------------------
TAX CODE GST BREAKDOWN:
Item descriptions and costs:
${items.map((item: any, idx: number) => `${idx + 1}. ${(item.productName || '').padEnd(25)} x${String(item.quantity || 0).padEnd(2)} @ ${formatCurrency(item.unitPrice || 0)}`).join('\n')}
--------------------------------------------------
Subtotal      : ${formatCurrency(totals.subtotal)}
CGST (9.0%)   : ${formatCurrency(totals.cgst)}
SGST (9.0%)   : ${formatCurrency(totals.sgst)}
Total Tax     : ${formatCurrency(totals.totalTax)}
--------------------------------------------------
GRAND TOTAL   : ${formatCurrency(totals.grandTotal)}
==================================================
GST Tax Registration No: GSTIN29AAACB1012C1Z4
Thank you for doing business with VendorBridge.
==================================================
`;

    const element = document.createElement("a");
    const file = new Blob([voucherText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${inv.invoiceNumber}_Invoice.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter List
  const filteredInvoices = invoicesList.filter(inv => {
    const vendorName = getVendorName(inv);
    const poNum = getPoNumber(inv);
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          poNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices</h1>
          <p className="text-muted-foreground mt-0.5">Audit vendor tax invoices, calculate GST splits, print reports, and dispatch notifications.</p>
        </div>
        {activeView === 'list' && (
          <Button onClick={startCreateInvoice} className="h-10 bg-primary text-white shadow-sm shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
        {activeView !== 'list' && (
          <Button variant="ghost" onClick={() => setActiveView('list')} className="h-10 border border-slate-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        )}
      </div>

      {/* -------------------- VIEW 1: INVOICES EXPLORER -------------------- */}
      {activeView === 'list' && (
        <>
          {/* Invoice Summary Metric Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unpaid Invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatCurrency(
                    invoicesList
                      .filter((i) => i.status === 'pending' || i.status === 'overdue')
                      .reduce((sum, i) => sum + parseFloat(calculateGSTTotals(getInvoiceItems(i)).grandTotal), 0)
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-danger">
                  {formatCurrency(
                    invoicesList
                      .filter((i) => i.status === 'overdue')
                      .reduce((sum, i) => sum + parseFloat(calculateGSTTotals(getInvoiceItems(i)).grandTotal), 0)
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Audited (GST)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-primary">
                  {formatCurrency(
                    invoicesList.reduce((sum, i) => sum + parseFloat(calculateGSTTotals(getInvoiceItems(i)).totalTax), 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Invoices Table Card */}
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-5 bg-slate-50/50">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by ID, vendor, or PO Reference..."
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
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground font-medium w-full sm:w-auto text-right">
                Showing {filteredInvoices.length} of {invoicesList.length} invoices
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow>
                    <TableHead className="pl-6">Invoice ID</TableHead>
                    <TableHead>PO Reference</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total Tax (GST)</TableHead>
                    <TableHead className="text-right">Grand Total</TableHead>
                    <TableHead className="pl-8">Status</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No invoices found matching your filter requirements.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const items = getInvoiceItems(inv);
                      const totals = calculateGSTTotals(items);
                      const vendorName = getVendorName(inv);
                      const poNum = getPoNumber(inv);
                      return (
                        <TableRow key={inv._id} className="hover:bg-slate-50/40 transition-colors">
                          <TableCell className="pl-6 font-semibold text-slate-900 flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-slate-400" />
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell className="font-semibold text-primary hover:underline cursor-pointer" onClick={() => {
                            setSelectedInvoice(inv);
                            setActiveView('details');
                          }}>
                            {poNum}
                          </TableCell>
                          <TableCell className="font-medium text-slate-800">{vendorName}</TableCell>
                          <TableCell className={`text-sm ${inv.status === 'overdue' ? 'text-danger font-semibold' : 'text-slate-600'}`}>{inv.dueDate || 'N/A'}</TableCell>
                          <TableCell className="text-right font-semibold text-slate-600">{formatCurrency(totals.totalTax)}</TableCell>
                          <TableCell className="text-right font-extrabold text-slate-950">{formatCurrency(totals.grandTotal)}</TableCell>
                          <TableCell className="pl-8">
                            <Badge 
                              variant={
                                inv.status === 'paid' ? 'success' :
                                inv.status === 'pending' ? 'warning' :
                                inv.status === 'overdue' ? 'danger' : 'secondary'
                              }
                              className="capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs font-medium text-primary bg-indigo-50/40 hover:bg-indigo-50"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setActiveView('details');
                                }}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-slate-100"
                                onClick={() => triggerEmailModal(inv)}
                                title="Email Invoice Link"
                              >
                                <Mail className="h-4 w-4 text-slate-500" />
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
        </>
      )}

      {/* -------------------- VIEW 2: INVOICE GENERATOR FORM -------------------- */}
      {activeView === 'create' && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Form Entries (Col Span 2) */}
          <Card className="lg:col-span-2 border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Invoice Audit Particulars</CardTitle>
              <CardDescription>Select a PO reference and enter the due date.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleGenerateInvoice} className="space-y-6">
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Invoice No</label>
                    <input
                      type="text"
                      value={newInvNumber}
                      onChange={(e) => setNewInvNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="INV-2026-000"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Select Purchase Order</label>
                    <select
                      value={poReferenceId}
                      onChange={(e) => {
                        setPoReferenceId(e.target.value);
                        const po = posList.find(p => p._id === e.target.value);
                        if (po) {
                          setSelectedVendorId(typeof po.vendorId === 'object' && po.vendorId ? (po.vendorId as any)._id : po.vendorId);
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    >
                      {posList.map((po) => (
                        <option key={po._id} value={po._id}>{po.poNumber} - {typeof po.vendorId === 'object' && po.vendorId ? (po.vendorId as any).name : 'Unknown'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Items (Loaded from PO)</h3>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const po = posList.find(p => p._id === poReferenceId);
                      if (!po) return <div className="text-sm text-slate-500">No Purchase Order selected or available.</div>;
                      return po.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                          <div className="flex-1 min-w-[200px]">
                            <input
                              type="text"
                              value={item.productName}
                              className="w-full bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-sm cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <div className="w-20">
                            <input
                              type="number"
                              value={item.quantity}
                              className="w-full bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-sm text-center cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <div className="w-32 relative">
                            <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-semibold">$</span>
                            <input
                              type="number"
                              value={item.unitPrice}
                              className="w-full bg-slate-100 border border-slate-200 rounded-md pl-6 pr-2 py-1.5 text-sm cursor-not-allowed"
                              disabled
                            />
                          </div>
                          <div className="w-24 text-right text-sm font-bold text-slate-900 pr-1">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="flex justify-end pt-4 gap-3">
                  <Button type="button" variant="ghost" onClick={() => setActiveView('list')} className="border border-slate-200 text-slate-700">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-white shadow-sm shadow-primary/20" disabled={posList.length === 0}>
                    Generate Invoice
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* GST Tax Calculation panel (Col Span 1) */}
          <Card className="border-slate-100 shadow-sm h-fit">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30">
              <CardTitle className="text-md text-slate-800">GST Breakdown (18%)</CardTitle>
              <CardDescription>Automatic splitting of Central and State taxes.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {(() => {
                const po = posList.find(p => p._id === poReferenceId);
                const totals = calculateGSTTotals(po ? po.items : []);
                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>CGST (9.0%)</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(totals.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>SGST (9.0%)</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(totals.sgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium border-t border-slate-100 pt-2">
                      <span>Total Tax / GST</span>
                      <span className="text-slate-800">{formatCurrency(totals.totalTax)}</span>
                    </div>
                    <div className="border-t border-slate-150 pt-3 flex justify-between text-base font-bold text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-primary text-lg">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-150 text-[10px] text-slate-500 leading-relaxed">
                <strong>GSTIN Registration:</strong> GSTIN29AAACB1012C1Z4<br />
                Central GST and State GST are split equally for intra-state procurements.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* -------------------- VIEW 3: INVOICE DETAILS & GST VOUCHER -------------------- */}
      {activeView === 'details' && selectedInvoice && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* GST Invoice Voucher Layout (Col Span 2) */}
          <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
            
            {/* Printable Area */}
            <div id="printable-invoice-voucher" className="p-6 sm:p-8 bg-white">
              
              {/* Invoice Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white font-bold text-sm">V</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900">VendorBridge Corp.</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    100 Innovation Parkway, Suite 500<br />
                    San Francisco, CA 94107<br />
                    procurement@vendorbridge.com<br />
                    GSTIN: GSTIN29AAACB1012C1Z4
                  </p>
                </div>
                <div className="sm:text-right">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">TAX INVOICE</h2>
                  <div className="text-primary text-lg font-bold mt-1">{selectedInvoice.invoiceNumber}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    PO Reference: <strong className="text-slate-700">{getPoNumber(selectedInvoice)}</strong><br />
                    Payment Due Date: <strong className="text-slate-700">{selectedInvoice.dueDate || 'N/A'}</strong>
                  </p>
                </div>
              </div>

              {/* Vendor & Dest. details */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> Billed From (Vendor)
                  </h4>
                  <div className="font-bold text-slate-900 text-sm">{getVendorName(selectedInvoice)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Vendor Registration: VB-{getVendorName(selectedInvoice).replace(/\s+/g, '').substring(0, 5).toUpperCase()}<br />
                    Registered Office: Area Road 15, Block B, New Delhi, India
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Consignee (Bill To)
                  </h4>
                  <div className="font-semibold text-slate-800 text-sm">VendorBridge Central Warehouse</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Dock 4, 850 Logistics Blvd<br />
                    Oakland, CA 94607<br />
                    Accounts Email: finance@vendorbridge.com
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Itemized Tax breakdown</h4>
                <Table className="border rounded-lg overflow-hidden">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-4 text-xs font-bold uppercase tracking-wider text-slate-500">Description</TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">Rate</TableHead>
                      <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">Qty</TableHead>
                      <TableHead className="pr-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Net Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getInvoiceItems(selectedInvoice).map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="pl-4 font-semibold text-slate-900 text-sm">{item.productName}</TableCell>
                        <TableCell className="text-right text-slate-600">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-center text-slate-900 font-medium">{item.quantity}</TableCell>
                        <TableCell className="pr-4 text-right font-bold text-slate-950">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* GST Totals splitting summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-slate-100 pt-6">
                <div className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  <strong>Declaration:</strong><br />
                  We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Taxes are calculated as per GST regulations (9% CGST + 9% SGST).
                </div>
                <div className="w-full sm:w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Taxable Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateGSTTotals(getInvoiceItems(selectedInvoice)).subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>CGST (9.0%)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateGSTTotals(getInvoiceItems(selectedInvoice)).cgst)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>SGST (9.0%)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateGSTTotals(getInvoiceItems(selectedInvoice)).sgst)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium border-t border-slate-100 pt-1.5">
                    <span>Total Tax GST</span>
                    <span className="text-slate-900 font-semibold">{formatCurrency(calculateGSTTotals(getInvoiceItems(selectedInvoice)).totalTax)}</span>
                  </div>
                  <div className="border-t border-slate-150 pt-2 flex justify-between text-base font-bold text-slate-955">
                    <span>Grand Total</span>
                    <span className="text-primary text-lg font-extrabold">{formatCurrency(calculateGSTTotals(getInvoiceItems(selectedInvoice)).grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-50/70 border-t border-slate-100 p-4 flex flex-wrap justify-between items-center gap-3">
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                Invoice: {selectedInvoice.invoiceNumber}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => triggerEmailModal(selectedInvoice)} 
                  variant="outline"
                  size="sm" 
                  className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  Send Email
                </Button>
                <Button 
                  onClick={() => handleDownloadInvoice(selectedInvoice)} 
                  variant="outline"
                  size="sm" 
                  className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  Download Plain text
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  variant="outline"
                  size="sm" 
                  className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print Invoice
                </Button>
              </div>
            </div>
          </Card>

          {/* Audit trail sidebar (Col Span 1) */}
          <div className="space-y-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30">
                <CardTitle className="text-md text-slate-900">Payment Audit Status</CardTitle>
                <CardDescription>Track payments and verify approvals.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payment Status</span>
                  <Badge 
                    variant={
                      selectedInvoice.status === 'paid' ? 'success' :
                      selectedInvoice.status === 'pending' ? 'warning' :
                      selectedInvoice.status === 'overdue' ? 'danger' : 'secondary'
                    }
                    className="capitalize"
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
                
                {selectedInvoice.status === 'overdue' && (
                  <div className="flex gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger font-medium leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>This invoice is overdue. Please click <strong>Send Email</strong> to dispatch a notification reminder to {getVendorName(selectedInvoice)}.</span>
                  </div>
                )}
                
                {selectedInvoice.status === 'paid' && (
                  <div className="flex gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-xs text-success font-medium leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>This invoice has been cleared. No further action is required.</span>
                  </div>
                )}

                {selectedInvoice.status === 'pending' && (
                  <div className="flex gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning font-medium leading-relaxed">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Invoice pending audit clearance. Ensure details match PO records.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* -------------------- MOCK SEND EMAIL DIALOG/MODAL -------------------- */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-slate-100 animate-fade-in bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Simulate Invoice dispatch via Email
              </CardTitle>
              <CardDescription>Send tax details to the vendor accounts department.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {emailSentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center text-success animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Email Dispatched Successfully!</h3>
                  <p className="text-xs text-muted-foreground">Notification sent to {recipientEmail}.</p>
                </div>
              ) : (
                <form onSubmit={handleSendEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">To Recipient</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium text-slate-800"
                      required
                      disabled={emailSending}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-slate-800"
                      required
                      disabled={emailSending}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Message Body</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={6}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed text-slate-700 font-medium"
                      required
                      disabled={emailSending}
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setEmailModalOpen(false)}
                      className="border border-slate-200 text-slate-700 text-xs h-9 font-medium"
                      disabled={emailSending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary text-white text-xs h-9 font-semibold flex items-center gap-1.5 shadow-sm shadow-primary/20"
                      disabled={emailSending}
                    >
                      {emailSending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending Notification...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Send Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
