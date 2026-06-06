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
import { Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { api, Vendor, PurchaseOrder } from '@/lib/api';

export default function Vendors() {
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [posList, setPosList] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [vends, pos] = await Promise.all([
          api.getVendors(),
          api.getPurchaseOrders()
        ]);
        setVendorsList(vends || []);
        setPosList(pos || []);
      } catch (err) {
        console.error('Error loading vendors page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getVendorSpend = (vendorId: string) => {
    const total = posList
      .filter(po => {
        const id = typeof po.vendorId === 'object' && po.vendorId ? (po.vendorId as any)._id : po.vendorId;
        return id === vendorId && ['approved', 'shipped', 'delivered'].includes(po.status);
      })
      .reduce((sum, po) => sum + po.totalAmount, 0);

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  };

  const filteredVendors = vendorsList.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
=======
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Check,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

// Types
interface VendorRecord {
  _id: string;
  name: string;
  gstNumber: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  category: string;
  status: "active" | "inactive" | "blacklisted";
  rating?: number;
  createdAt: string;
}

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  inactive: { label: "Inactive", color: "text-amber-700 bg-amber-50 border-amber-200" },
  blacklisted: { label: "Blacklisted", color: "text-rose-700 bg-rose-50 border-rose-200" },
};

// Custom Dropdown
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

export default function Vendors() {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVendors, setTotalVendors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Action Menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Drawer / Form state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    email: "",
    phone: "",
    category: "",
    status: "active" as VendorRecord["status"],
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  // Delete Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, [currentPage, statusFilter, categoryFilter]);

  // Handle search with local debounce or trigger on demand
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchVendors();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      let url = `http://localhost:8080/api/v1/vendors?page=${currentPage}&limit=8`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setVendors(result.data || []);
        setTotalVendors(result.total || 0);
        setTotalPages(result.totalPages || 1);
      } else {
        console.error("Failed to load vendors:", result.message);
      }
    } catch (error) {
      console.error("Error loading vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      gstNumber: "",
      email: "",
      phone: "",
      category: "",
      status: "active",
      street: "",
      city: "",
      state: "",
      pincode: "",
    });
    setFormErrors({});
    setSubmitError("");
    setDrawerOpen(true);
  };

  const handleOpenEdit = (vendor: VendorRecord) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || "",
      gstNumber: vendor.gstNumber || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      category: vendor.category || "",
      status: vendor.status || "active",
      street: vendor.address?.street || "",
      city: vendor.address?.city || "",
      state: vendor.address?.state || "",
      pincode: vendor.address?.pincode || "",
    });
    setFormErrors({});
    setSubmitError("");
    setDrawerOpen(true);
    setActiveMenuId(null);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Vendor name is required";
    if (!formData.gstNumber.trim()) {
      errs.gstNumber = "GST Number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      errs.gstNumber = "Invalid GST format (e.g. 22AAAAA1111A1Z1)";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
      errs.phone = "Provide valid phone number (min 10 digits)";
    }
    if (!formData.category.trim()) errs.category = "Category is required";
    
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitError("");

    const payload = {
      name: formData.name,
      gstNumber: formData.gstNumber,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      status: formData.status,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingVendor
        ? `http://localhost:8080/api/v1/vendors/${editingVendor._id}`
        : "http://localhost:8080/api/v1/vendors";
      const method = editingVendor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && (result.success || result._id)) {
        setDrawerOpen(false);
        fetchVendors();
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          const errMap: Record<string, string> = {};
          result.errors.forEach((e: any) => {
            errMap[e.field] = e.message;
          });
          setFormErrors(errMap);
        } else {
          setSubmitError(result.message || "Something went wrong saving the vendor");
        }
      }
    } catch (error: any) {
      setSubmitError(error.message || "Failed to contact the backend server");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8080/api/v1/vendors/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setDeleteConfirmId(null);
        fetchVendors();
      } else {
        alert(result.message || "Failed to delete vendor");
      }
    } catch (err) {
      console.error("Delete vendor error:", err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setCurrentPage(1);
  };
>>>>>>> Stashed changes

  return (
    <div className="space-y-6 animate-fade-in relative min-h-[600px]">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
<<<<<<< Updated upstream
          <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor directory and performance.</p>
        </div>
        <Button>
=======
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Vendor Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Maintain directories, GST registrations, classifications, and status of suppliers.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto" id="btn-add-vendor">
>>>>>>> Stashed changes
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
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
                placeholder="Search vendors..."
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
                <TableHead>Vendor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">YTD Spend</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No vendors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium text-muted-foreground">
                      VB-{vendor._id.slice(-5).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{vendor.name}</TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          vendor.status === 'active' ? 'success' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{getVendorSpend(vendor._id)}</TableCell>
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
      {/* Main Grid View */}
      <Card className="border-border shadow-sm">
        {/* Table Toolbar Filters */}
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search vendors by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            
            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 gap-3 md:flex md:w-auto">
              <div className="w-full md:w-44">
                <SelectDropdown
                  id="filter-status"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  placeholder="Filter Status"
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "blacklisted", label: "Blacklisted" },
                  ]}
                />
              </div>
              
              <div className="w-full md:w-48">
                <SelectDropdown
                  id="filter-category"
                  value={categoryFilter}
                  onChange={(val) => setCategoryFilter(val)}
                  placeholder="Filter Category"
                  options={[
                    { value: "", label: "All Categories" },
                    { value: "raw_materials", label: "Raw Materials" },
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "logistics", label: "Logistics" },
                    { value: "it_services", label: "IT Services" },
                    { value: "office_supplies", label: "Office Supplies" },
                  ]}
                />
              </div>
            </div>

            {(searchTerm || statusFilter || categoryFilter) && (
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
              <p className="mt-2 text-sm">Loading supply registers...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold text-lg">No vendors found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                We couldn't find any vendor matches. Try modifying your filter conditions or create a new vendor profile.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Vendor Name</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Contact Detail</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor._id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {vendor.name ? vendor.name.substring(0, 2).toUpperCase() : "V"}
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">{vendor.name}</div>
                          {vendor.address?.city && (
                            <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {vendor.address.city}, {vendor.address.state}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-xs px-2 py-0.5 rounded bg-muted border font-mono">
                        {vendor.gstNumber}
                      </code>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm space-y-0.5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{vendor.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize text-sm font-medium px-2.5 py-1 rounded bg-secondary text-secondary-foreground">
                        {vendor.category.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell>
                      {vendor.status ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CONFIG[vendor.status]?.color || ""}`}>
                          {STATUS_CONFIG[vendor.status]?.label || vendor.status}
                        </span>
                      ) : null}
                    </TableCell>

                    <TableCell className="text-right pr-6 relative">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(vendor)}
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit Vendor"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(vendor._id)}
                          className="h-8 w-8 hover:bg-rose-50 text-muted-foreground hover:text-rose-600"
                          title="Delete Vendor"
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
        {!loading && totalVendors > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(totalVendors, (currentPage - 1) * 8 + 1)}</span> to{" "}
              <span className="font-medium">{Math.min(totalVendors, currentPage * 8)}</span> of{" "}
              <span className="font-medium">{totalVendors}</span> vendors
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

      {/* Drawer Overlay backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-over Drawer Form */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l shadow-2xl transition-transform duration-300 transform flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {editingVendor ? "Edit Vendor Profile" : "Register New Vendor"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {editingVendor ? "Update supplier contact and address info." : "Create profile for procurement & RFQ cycles."}
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Basic Fields */}
          <div className="space-y-1.5">
            <Label htmlFor="vendor-name">Vendor Name *</Label>
            <Input
              id="vendor-name"
              placeholder="e.g. Acme Tech Solutions"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={formErrors.name ? "border-rose-500 focus-visible:ring-rose-500" : ""}
            />
            {formErrors.name && <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vendor-gst">GST Number *</Label>
              <Input
                id="vendor-gst"
                placeholder="27AAAAA1111A1Z1"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                className={formErrors.gstNumber ? "border-rose-500 focus-visible:ring-rose-500" : ""}
              />
              {formErrors.gstNumber && <p className="text-xs text-rose-600 mt-1">{formErrors.gstNumber}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vendor-category">Category *</Label>
              <SelectDropdown
                id="vendor-category"
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
              {formErrors.category && <p className="text-xs text-rose-600 mt-1">{formErrors.category}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vendor-email">Email Address *</Label>
            <Input
              id="vendor-email"
              type="email"
              placeholder="billing@acme.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={formErrors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}
            />
            {formErrors.email && <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vendor-phone">Phone Number *</Label>
            <Input
              id="vendor-phone"
              type="tel"
              placeholder="+91 99999 88888"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={formErrors.phone ? "border-rose-500 focus-visible:ring-rose-500" : ""}
            />
            {formErrors.phone && <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>}
          </div>

          {/* Address Section */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Registered Address</h3>
            
            <div className="space-y-1.5">
              <Label htmlFor="vendor-street">Street Address</Label>
              <Input
                id="vendor-street"
                placeholder="Industrial Area, Phase 1"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="vendor-city">City</Label>
                <Input
                  id="vendor-city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vendor-state">State</Label>
                <Input
                  id="vendor-state"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vendor-pincode">Pincode</Label>
              <Input
                id="vendor-pincode"
                placeholder="400001"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* Status field */}
          {editingVendor && (
            <div className="border-t pt-4 space-y-1.5">
              <Label>Account Status</Label>
              <SelectDropdown
                id="vendor-status"
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val as VendorRecord["status"] })}
                placeholder="Select status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "blacklisted", label: "Blacklisted" },
                ]}
              />
            </div>
          )}

          {/* Submit Actions */}
          <div className="border-t pt-5 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingVendor ? "Save Changes" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 w-full max-w-md bg-background rounded-xl border border-border shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Delete Vendor Profile?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deleting this vendor profile will permanently remove their records from active registers. Past RFQs and linked invoices might become orphaned.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
                Delete Vendor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
