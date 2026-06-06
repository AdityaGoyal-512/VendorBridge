import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Calculator, AlertCircle, ArrowRight } from 'lucide-react';

export default function SubmitQuotation() {
  const location = useLocation();
  const navigate = useNavigate();
  const rfq = location.state?.rfq;

  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(rfq?.quantity || 1);
  const [deliveryTime, setDeliveryTime] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalPrice = unitPrice * quantity;

  if (!rfq) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Please select an RFQ to submit a quotation.</p>
        <Button onClick={() => navigate('/rfqs')}>Back to RFQs</Button>
      </div>
    );
  }

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isVendor = user?.role === 'vendor';
  const vendorId = user?.vendorId || user?._id || '6661a0e10000000000000001'; 

  if (user && !isVendor) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-rose-600 font-semibold">Access Denied: Only vendors can submit quotations.</p>
        <Button onClick={() => navigate('/rfqs')}>Back to RFQs</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/quotations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          rfqId: rfq._id,
          vendorId: vendorId,
          unitPrice,
          quantity,
          deliveryTime,
          notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        alert('Quotation submitted successfully to the backend!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to connect to the server. Is it running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submit Quotation</h1>
          <p className="text-muted-foreground">Provide your best pricing and timeline for the active RFQ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RFQ Details Panel */}
        <Card className="md:col-span-1 bg-slate-50 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-primary">
              <FileText className="w-5 h-5 mr-2" />
              RFQ Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Reference ID</p>
              <p className="font-semibold">{rfq._id}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Title</p>
              <p className="font-medium">{rfq.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Product</p>
              <p className="font-medium">{rfq.productName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Requested Quantity</p>
              <p className="font-bold text-lg">{rfq.quantity} Units</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Submission Deadline</p>
              <Badge variant="warning">{new Date(rfq.deadline).toLocaleDateString()}</Badge>
            </div>
            <div className="pt-2 border-t mt-4">
              <p className="text-muted-foreground mb-1">Description</p>
              <p className="text-slate-600 leading-relaxed">{rfq.description || 'No description provided.'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Your Quotation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      required
                      value={unitPrice || ''}
                      onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity Available</label>
                  <input 
                    type="number" 
                    min="1" 
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between border border-primary/20">
                <div className="flex items-center text-primary">
                  <Calculator className="w-5 h-5 mr-2" />
                  <span className="font-medium">Total Calculated Value</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Delivery Timeline (Days)</label>
                <div className="relative w-1/2">
                  <input 
                    type="number" 
                    min="1" 
                    required
                    value={deliveryTime || ''}
                    onChange={(e) => setDeliveryTime(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    placeholder="e.g. 14"
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">Days</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes / Terms</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-input focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                  placeholder="Specify warranty, shipping terms, or conditions..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit" disabled={isSubmitting || success} className="bg-primary text-white">
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : success ? 'Submitted!' : 'Submit Quotation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
