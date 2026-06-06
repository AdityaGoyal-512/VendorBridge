<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Search, Filter, MoreHorizontal, FileText, Loader2 } from 'lucide-react';
import { api, RFQ } from '@/lib/api';
=======
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  FileText,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Lock,
  Globe,
  AlertTriangle,
  MapPin,
  Paperclip,
} from "lucide-react";
>>>>>>> Stashed changes

// Types
interface RFQRecord {
  _id: string;
  title: string;
  productName: string;
  description: string;
  quantity: number;
  estimatedBudget: number;
  category: string;
  priority: "low" | "medium" | "high";
  status: "draft" | "published" | "closed";
  deadline: string;
  attachmentUrl?: string;
  assignedVendors: any[];
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "text-slate-700 bg-slate-50 border-slate-200" },
  published: { label: "Published", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  closed: { label: "Closed", color: "text-rose-700 bg-rose-50 border-rose-200" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-slate-600 bg-slate-50 border-slate-200" },
  medium: { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  high: { label: "High", color: "text-rose-700 bg-rose-50 border-rose-200" },
};

// Dropdown Helper
function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          value ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span>
          {value
            ? options.find((o) => o.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg animate-fade-in max-h-60 overflow-auto">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  value === opt.value
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-popover-foreground"
                }`}
              >
                <Check className={`h-3.5 w-3.5 ${value === opt.value ? "opacity-100" : "opacity-0"}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RFQs() {
<<<<<<< Updated upstream
  const [rfqsList, setRfqsList] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadRFQs() {
      try {
        const data = await api.getRFQs();
        setRfqsList(data || []);
      } catch (err) {
        console.error('Error loading RFQs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRFQs();
  }, []);

  const filteredRFQs = rfqsList.filter(rfq =>
    rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rfq.productName && rfq.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
=======
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState<RFQRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRFQs, setTotalRFQs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Edit Drawer form state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRFQ, setEditingRFQ] = useState<RFQRecord | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    productName: "",
    category: "",
    description: "",
    quantity: 1,
    estimatedBudget: 0,
    priority: "medium" as RFQRecord["priority"],
    deadline: "",
    attachmentUrl: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  // Delete/Action state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchRFQs();
  }, [currentPage, statusFilter, priorityFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchRFQs();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      let url = `http://localhost:8080/api/v1/rfqs?page=${currentPage}&limit=8`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setRfqs(result.data || []);
        setTotalRFQs(result.total || 0);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Error loading RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (rfq: RFQRecord) => {
    setEditingRFQ(rfq);
    setFormData({
      title: rfq.title || "",
      productName: rfq.productName || "",
      category: rfq.category || "",
      description: rfq.description || "",
      quantity: rfq.quantity || 1,
      estimatedBudget: rfq.estimatedBudget || 0,
      priority: rfq.priority || "medium",
      deadline: rfq.deadline ? rfq.deadline.substring(0, 10) : "",
      attachmentUrl: rfq.attachmentUrl || "",
    });
    setFormErrors({});
    setSubmitError("");
    setDrawerOpen(true);
  };

  const handlePublish = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/rfqs/${id}/publish`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchRFQs();
      } else {
        alert(result.message || "Failed to publish RFQ");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseRFQ = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/rfqs/${id}/close`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchRFQs();
      } else {
        alert(result.message || "Failed to close RFQ");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/rfqs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setDeleteConfirmId(null);
        fetchRFQs();
      } else {
        alert(result.message || "Failed to delete RFQ");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "RFQ Title is required";
    if (!formData.productName.trim()) errs.productName = "Product name is required";
    if (!formData.category.trim()) errs.category = "Category is required";
    if (!formData.description.trim()) errs.description = "Specifications is required";
    if (!formData.quantity || formData.quantity <= 0) errs.quantity = "Quantity must be > 0";
    if (!formData.estimatedBudget || formData.estimatedBudget <= 0) errs.estimatedBudget = "Budget must be > 0";
    if (!formData.deadline) errs.deadline = "Deadline is required";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !editingRFQ) return;
    setSubmitError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/rfqs/${editingRFQ._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setDrawerOpen(false);
        fetchRFQs();
      } else {
        setSubmitError(result.message || "Failed to save RFQ updates");
      }
    } catch (error: any) {
      setSubmitError(error.message || "Network connection failure");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCurrentPage(1);
  };
>>>>>>> Stashed changes

  return (
    <div className="space-y-6 animate-fade-in relative min-h-[600px]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
<<<<<<< Updated upstream
          <h1 className="text-2xl font-bold tracking-tight">Requests for Quotation</h1>
          <p className="text-muted-foreground">Manage your RFQs and invite vendors to bid.</p>
        </div>
        <Button>
=======
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Requests for Quotation (RFQs)
          </h1>
          <p className="text-muted-foreground text-sm">
            Launch sourcing events, receive vendor quotes, compare offers, and award purchase contracts.
          </p>
        </div>
        <Button onClick={() => navigate("/rfqs/create")} className="w-full sm:w-auto" id="btn-create-rfq">
>>>>>>> Stashed changes
          <Plus className="mr-2 h-4 w-4" />
          Create RFQ
        </Button>
      </div>

<<<<<<< Updated upstream
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-input rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department / Product</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Bids Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFQs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No RFQs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRFQs.map((rfq) => (
                  <TableRow key={rfq._id}>
                    <TableCell className="font-medium text-primary flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      RFQ-{rfq._id.slice(-5).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{rfq.title}</TableCell>
                    <TableCell>{rfq.productName || 'General'}</TableCell>
                    <TableCell>{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <span className="font-medium">{rfq.assignedVendors ? rfq.assignedVendors.length : 0}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          rfq.status === 'published' ? 'success' :
                          rfq.status === 'closed' ? 'secondary' : 'outline'
                        }
                        className="capitalize"
                      >
                        {rfq.status === 'published' ? 'open' : rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
=======
      {/* RFQ Filters Toolbar */}
      <Card className="border-border shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search RFQs by title or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 gap-3 md:flex md:w-auto">
              <div className="w-full md:w-40">
                <SelectDropdown
                  id="filter-rfq-status"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  placeholder="Status"
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "closed", label: "Closed" },
                  ]}
                />
              </div>

              <div className="w-full md:w-40">
                <SelectDropdown
                  id="filter-rfq-priority"
                  value={priorityFilter}
                  onChange={(val) => setPriorityFilter(val)}
                  placeholder="Priority"
                  options={[
                    { value: "", label: "All Priorities" },
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
              </div>
            </div>

            {(search || statusFilter || priorityFilter) && (
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground h-10 px-3 hover:text-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Data Table */}
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-sm">Loading procurement registers...</p>
            </div>
          ) : rfqs.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold text-lg">No RFQs found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                We couldn't find any procurement matching your query. Create a new RFQ request.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">RFQ Solicit Title</TableHead>
                  <TableHead>Requested Product</TableHead>
                  <TableHead>Target Quantity</TableHead>
                  <TableHead>Est. Budget</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow key={rfq._id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div>
                        <div className="text-foreground font-semibold flex items-center gap-1.5">
                          {rfq.title}
                        </div>
                        <div className="text-muted-foreground text-xs capitalize mt-0.5">
                          Category: {rfq.category.replace("_", " ")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{rfq.productName}</TableCell>

                    <TableCell>{rfq.quantity.toLocaleString()} units</TableCell>

                    <TableCell>₹{rfq.estimatedBudget.toLocaleString()}</TableCell>

                    <TableCell>
                      {rfq.priority ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${PRIORITY_CONFIG[rfq.priority]?.color}`}>
                          {PRIORITY_CONFIG[rfq.priority]?.label}
                        </span>
                      ) : null}
                    </TableCell>

                    <TableCell>
                      {rfq.status ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_CONFIG[rfq.status]?.color}`}>
                          {STATUS_CONFIG[rfq.status]?.label}
                        </span>
                      ) : null}
                    </TableCell>

                    <TableCell className="text-sm">
                      {new Date(rfq.deadline).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1.5">
                        {rfq.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublish(rfq._id)}
                            className="h-8 text-xs font-semibold px-2.5 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                            title="Publish Solicitation"
                          >
                            <Globe className="h-3.5 w-3.5 mr-1" />
                            Publish
                          </Button>
                        )}
                        
                        {rfq.status === "published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCloseRFQ(rfq._id)}
                            className="h-8 text-xs font-semibold px-2.5 bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                            title="Close Submissions"
                          >
                            <Lock className="h-3.5 w-3.5 mr-1" />
                            Close
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(rfq)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Details"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(rfq._id)}
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
>>>>>>> Stashed changes
        </CardContent>

        {/* Server Pagination */}
        {!loading && totalRFQs > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(totalRFQs, (currentPage - 1) * 8 + 1)}</span> to{" "}
              <span className="font-medium">{Math.min(totalRFQs, currentPage * 8)}</span> of{" "}
              <span className="font-medium">{totalRFQs}</span> events
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Drawer Overlay Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Edit RFQ Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l shadow-2xl transition-transform duration-300 transform flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">Update RFQ Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Modify parameters or update timeline goals.</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="edit-rfq-title">RFQ Solicitation Title *</Label>
            <Input
              id="edit-rfq-title"
              placeholder="Aluminum Core Procurement"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={formErrors.title ? "border-rose-500" : ""}
            />
            {formErrors.title && <p className="text-xs text-rose-600">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-product">Product Name *</Label>
              <Input
                id="edit-rfq-product"
                placeholder="Aluminum Billets"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className={formErrors.productName ? "border-rose-500" : ""}
              />
              {formErrors.productName && <p className="text-xs text-rose-600">{formErrors.productName}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-category">Category *</Label>
              <SelectDropdown
                id="edit-rfq-category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                placeholder="Select category"
                options={[
                  { value: "raw_materials", label: "Raw Materials" },
                  { value: "manufacturing", label: "Manufacturing" },
                  { value: "logistics", label: "Logistics" },
                  { value: "it_services", label: "IT Services" },
                  { value: "office_supplies", label: "Office Supplies" },
                ]}
              />
              {formErrors.category && <p className="text-xs text-rose-600">{formErrors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-qty">Quantity Required *</Label>
              <Input
                id="edit-rfq-qty"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className={formErrors.quantity ? "border-rose-500" : ""}
              />
              {formErrors.quantity && <p className="text-xs text-rose-600">{formErrors.quantity}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-budget">Estimated Budget (₹) *</Label>
              <Input
                id="edit-rfq-budget"
                type="number"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                className={formErrors.estimatedBudget ? "border-rose-500" : ""}
              />
              {formErrors.estimatedBudget && <p className="text-xs text-rose-600">{formErrors.estimatedBudget}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-priority">Priority Rank</Label>
              <SelectDropdown
                id="edit-rfq-priority"
                value={formData.priority}
                onChange={(val) => setFormData({ ...formData, priority: val as RFQRecord["priority"] })}
                placeholder="Select priority"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-rfq-deadline">Closing Date *</Label>
              <Input
                id="edit-rfq-deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={formErrors.deadline ? "border-rose-500" : ""}
              />
              {formErrors.deadline && <p className="text-xs text-rose-600">{formErrors.deadline}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-rfq-desc">Specifications & Scope *</Label>
            <textarea
              id="edit-rfq-desc"
              rows={4}
              placeholder="Grade specifications..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                formErrors.description ? "border-rose-500" : ""
              }`}
            />
            {formErrors.description && <p className="text-xs text-rose-600">{formErrors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-rfq-attachment">Attachment URL</Label>
            <Input
              id="edit-rfq-attachment"
              placeholder="https://drive.google.com/..."
              value={formData.attachmentUrl}
              onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
            />
          </div>

          <div className="border-t pt-5 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 w-full max-w-md bg-background rounded-xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Delete RFQ Solicitation?</h3>
                <p className="text-xs text-muted-foreground">This will remove the event permanently.</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete this Request for Quotation? Any bids submitted by vendors under this event will also be deleted.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
                Delete RFQ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
