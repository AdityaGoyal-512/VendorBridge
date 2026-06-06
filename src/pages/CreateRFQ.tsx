import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Package,
  Calendar,
  IndianRupee,
  Users,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  AlertTriangle,
  Search,
  Paperclip,
} from "lucide-react";

interface Vendor {
  _id: string;
  name: string;
  category: string;
  email: string;
  status: string;
}

export default function CreateRFQ() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    productName: "",
    description: "",
    category: "",
    quantity: 1,
    estimatedBudget: 0,
    priority: "medium",
    deadline: "",
    attachmentUrl: "",
    assignedVendors: [] as string[],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentStep === 3) {
      fetchVendors();
    }
  }, [currentStep]);

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const token = localStorage.getItem("accessToken");
      // Get active vendors
      const response = await fetch("http://localhost:8080/api/v1/vendors?limit=100&status=active", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setVendors(result.data || []);
      }
    } catch (err) {
      console.error("Error loading vendors:", err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.title.trim()) errors.title = "RFQ Title is required";
      if (!formData.productName.trim()) errors.productName = "Product/Item Name is required";
      if (!formData.category.trim()) errors.category = "Category classification is required";
      if (!formData.description.trim()) errors.description = "Detailed specifications are required";
    } else if (step === 2) {
      if (!formData.quantity || formData.quantity <= 0) {
        errors.quantity = "Quantity must be greater than zero";
      }
      if (!formData.estimatedBudget || formData.estimatedBudget <= 0) {
        errors.estimatedBudget = "Budget must be greater than zero";
      }
      if (!formData.deadline) {
        errors.deadline = "Closing date deadline is required";
      } else {
        const selectedDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          errors.deadline = "Deadline must be in the future";
        }
      }
    } else if (step === 3) {
      if (formData.assignedVendors.length === 0) {
        errors.assignedVendors = "Please select at least one vendor for this RFQ solicitation";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const toggleVendor = (vendorId: string) => {
    const isAssigned = formData.assignedVendors.includes(vendorId);
    let updated: string[];
    if (isAssigned) {
      updated = formData.assignedVendors.filter((id) => id !== vendorId);
    } else {
      updated = [...formData.assignedVendors, vendorId];
    }
    setFormData({
      ...formData,
      assignedVendors: updated,
    });
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/rfqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        navigate("/rfqs");
      } else {
        setSubmitError(result.message || "Failed to create RFQ request");
      }
    } catch (error: any) {
      setSubmitError(error.message || "Failed to connect to server");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Create Request For Quotation
        </h1>
        <p className="text-muted-foreground text-sm">
          Solicit bids from registered suppliers with specific timelines and requirements.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
        
        <div className="relative z-10 flex justify-between">
          {[
            { step: 1, label: "Basic Info" },
            { step: 2, label: "Logistics" },
            { step: 3, label: "Assign Vendors" },
            { step: 4, label: "Review" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border ${
                  currentStep === s.step
                    ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 scale-110"
                    : currentStep > s.step
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-input"
                }`}
              >
                {currentStep > s.step ? <Check className="h-4 w-4" /> : s.step}
              </div>
              <span
                className={`text-xs mt-2 font-medium hidden sm:inline ${
                  currentStep === s.step ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border shadow-md">
        <CardContent className="p-6">
          {submitError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* STEP 1: General Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="rfq-title">RFQ Solicit Title *</Label>
                <Input
                  id="rfq-title"
                  name="title"
                  placeholder="e.g. Annual Raw Aluminum Core Procurement"
                  value={formData.title}
                  onChange={handleTextChange}
                  className={validationErrors.title ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                />
                {validationErrors.title && <p className="text-xs text-rose-600">{validationErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rfq-productName">Item / Product Name *</Label>
                  <Input
                    id="rfq-productName"
                    name="productName"
                    placeholder="e.g. Aluminum Billets 6063"
                    value={formData.productName}
                    onChange={handleTextChange}
                    className={validationErrors.productName ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                  />
                  {validationErrors.productName && <p className="text-xs text-rose-600">{validationErrors.productName}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rfq-category">Product Category *</Label>
                  <select
                    id="rfq-category"
                    name="category"
                    value={formData.category}
                    onChange={handleTextChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      validationErrors.category ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="raw_materials">Raw Materials</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics</option>
                    <option value="it_services">IT Services</option>
                    <option value="office_supplies">Office Supplies</option>
                  </select>
                  {validationErrors.category && <p className="text-xs text-rose-600">{validationErrors.category}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rfq-desc">Detailed Specifications & Scope *</Label>
                <textarea
                  id="rfq-desc"
                  name="description"
                  rows={5}
                  placeholder="Provide grade details, tolerances, delivery schedules, and compliance certifications required..."
                  value={formData.description}
                  onChange={handleTextChange}
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    validationErrors.description ? "border-rose-500 focus-visible:ring-rose-500" : ""
                  }`}
                />
                {validationErrors.description && <p className="text-xs text-rose-600">{validationErrors.description}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Logistics & Budget */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rfq-quantity">Requested Quantity *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="rfq-quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      placeholder="1000"
                      value={formData.quantity}
                      onChange={handleTextChange}
                      className={`pl-10 ${validationErrors.quantity ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                    />
                  </div>
                  {validationErrors.quantity && <p className="text-xs text-rose-600">{validationErrors.quantity}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rfq-budget">Estimated Budget (₹) *</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="rfq-budget"
                      name="estimatedBudget"
                      type="number"
                      min={1}
                      placeholder="150000"
                      value={formData.estimatedBudget}
                      onChange={handleTextChange}
                      className={`pl-10 ${validationErrors.estimatedBudget ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                    />
                  </div>
                  {validationErrors.estimatedBudget && <p className="text-xs text-rose-600">{validationErrors.estimatedBudget}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rfq-priority">Priority Rank</Label>
                  <select
                    id="rfq-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleTextChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rfq-deadline">Closing Submission Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="rfq-deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleTextChange}
                      className={`pl-10 ${validationErrors.deadline ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
                    />
                  </div>
                  {validationErrors.deadline && <p className="text-xs text-rose-600">{validationErrors.deadline}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rfq-attachment">Attachment / Document URL</Label>
                <div className="relative">
                  <Paperclip className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="rfq-attachment"
                    name="attachmentUrl"
                    placeholder="https://drive.google.com/file/d/..."
                    value={formData.attachmentUrl}
                    onChange={handleTextChange}
                    className="pl-10"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Provide reference document or drawing sheet link (PDF, JPG).
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Vendor Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Assign Suppliers</h3>
                  <p className="text-xs text-muted-foreground">Only active vendors registered in matching sectors are eligible.</p>
                </div>
                <Badge variant="secondary" className="px-2.5 py-1">
                  {formData.assignedVendors.length} Selected
                </Badge>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search suppliers by name or category..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {validationErrors.assignedVendors && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100 flex gap-2 items-center">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {validationErrors.assignedVendors}
                </p>
              )}

              {loadingVendors ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Fetching supplier indexes...
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No active suppliers match your query.
                </div>
              ) : (
                <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
                  {filteredVendors.map((vendor) => {
                    const isSelected = formData.assignedVendors.includes(vendor._id);
                    return (
                      <div
                        key={vendor._id}
                        onClick={() => toggleVendor(vendor._id)}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors ${
                          isSelected ? "bg-primary/5" : ""
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm text-foreground">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {vendor.category.replace("_", " ")} &bull; {vendor.email}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/30 border rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{formData.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      Category: {formData.category.replace("_", " ")}
                    </p>
                  </div>
                  <Badge className="px-3 py-1 font-bold capitalize">Priority: {formData.priority}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Target Product / Item</span>
                    <span className="font-semibold text-foreground">{formData.productName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Solicited Volume</span>
                    <span className="font-semibold text-foreground">{formData.quantity} Units</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Estimated Budget Allocation</span>
                    <span className="font-semibold text-foreground">₹{Number(formData.estimatedBudget).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Submission Closing Date</span>
                    <span className="font-semibold text-foreground">
                      {new Date(formData.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <span className="text-xs text-muted-foreground block mb-1">Specifications Sheet / Scope Description</span>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line bg-background p-3 rounded border">
                    {formData.description}
                  </p>
                </div>

                {formData.attachmentUrl && (
                  <div className="border-t pt-3 flex items-center gap-2 text-xs text-primary font-medium">
                    <Paperclip className="h-4 w-4" />
                    <a href={formData.attachmentUrl} target="_blank" rel="noreferrer" className="hover:underline break-all">
                      {formData.attachmentUrl}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase">
                  <span>Targeted Suppliers Solicitation</span>
                  <span>{formData.assignedVendors.length} Suppliers</span>
                </div>
                <div className="border rounded-lg bg-background p-3 max-h-36 overflow-y-auto space-y-1.5">
                  {formData.assignedVendors.map((vendorId) => {
                    const vendObj = vendors.find((v) => v._id === vendorId);
                    return (
                      <div key={vendorId} className="text-xs flex justify-between bg-muted/20 p-2 rounded">
                        <span className="font-semibold text-foreground">{vendObj?.name || "Loading..."}</span>
                        <span className="text-muted-foreground">{vendObj?.email}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between mt-8 border-t pt-4">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={() => navigate("/rfqs")}>
                Cancel
              </Button>
            )}

            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>
                Publish RFQ Request
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}