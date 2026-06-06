import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Clock, Truck, ShieldCheck, Download, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CompareQuotations() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(location.state?.rfqId || null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotations', selectedRfqId],
    queryFn: async () => {
      if (!selectedRfqId) return [];
      const response = await fetch(`http://localhost:8080/api/v1/quotations/rfq/${selectedRfqId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const json = await response.json();
      return json.data;
    },
    enabled: !!selectedRfqId
  });

  const rfqsQuery = useQuery({
    queryKey: ['rfqs_for_comparison'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/v1/rfqs');
      const json = await response.json();
      return json.data;
    },
    enabled: !selectedRfqId
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const response = await fetch(`http://localhost:8080/api/v1/quotations/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', selectedRfqId] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] }); // Also invalidate main table
    }
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const quotes = data || [];

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'admin' || user?.role === 'procurement_officer' || user?.role === 'manager';

  if (user && !isManager) {
    return (
      <div className="p-8 text-center space-y-4 animate-fade-in">
        <p className="text-rose-600 font-semibold">Access Denied: Only procurement officers can compare bids.</p>
        <Button onClick={() => navigate('/rfqs')}>Back to RFQs</Button>
      </div>
    );
  }

  if (!selectedRfqId) {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compare Bids</h1>
            <p className="text-muted-foreground">Select an active RFQ to review and compare its submitted quotations.</p>
          </div>
        </div>

        {rfqsQuery.isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading available RFQs...</div>
        ) : rfqsQuery.isError ? (
          <div className="p-8 text-center text-danger">Failed to load RFQs.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(rfqsQuery.data || []).map((rfq: any) => (
              <Card 
                key={rfq._id} 
                className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md" 
                onClick={() => setSelectedRfqId(rfq._id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{rfq.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-medium">{rfq.productName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{rfq.quantity} Units</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-primary/5 text-primary hover:bg-primary hover:text-white">
                    Select to Compare
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading comparison...</div>;
  if (isError) return <div className="p-8 text-center text-danger">Failed to load comparison data.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 -ml-2" onClick={() => setSelectedRfqId(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            Compare Quotations
          </h1>
          <p className="text-muted-foreground">Viewing bids for selected RFQ.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Comparison
        </Button>
      </div>

      {quotes.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed bg-slate-50">
          No quotations have been submitted for this RFQ yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((quote: any, index: number) => {
            const isLowest = index === 0; // Backend sorts by lowest price first
            return (
              <Card 
                key={quote._id} 
                className={cn(
                  "relative transition-all duration-200 hover:shadow-md",
                  isLowest ? "border-success ring-1 ring-success/20 bg-success/5" : "border-border",
                  quote.status === 'accepted' ? "border-success bg-success/5 opacity-50" : "",
                  quote.status === 'rejected' ? "border-danger bg-danger/5 opacity-50" : ""
                )}
              >
                {isLowest && quote.status !== 'rejected' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <Trophy className="w-3 h-3 mr-1" />
                    LOWEST BID
                  </div>
                )}
                <CardHeader className="pb-4 border-b bg-white rounded-t-xl">
                  <CardTitle className="text-lg flex justify-between items-start">
                    <span className="font-bold">{quote.vendorId?.name || 'Unknown Vendor'}</span>
                    <Badge variant={isLowest ? 'success' : 'secondary'} className="font-mono">
                      QT-{quote._id.substring(quote._id.length - 6).toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Star className="w-4 h-4 text-warning fill-warning mr-1" />
                    <span className="font-medium text-foreground">{quote.vendorId?.rating || '4.5'}</span>
                    <span className="mx-2">•</span>
                    <ShieldCheck className="w-4 h-4 text-success mr-1" />
                    Verified Vendor
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                    <p className={cn("text-3xl font-bold tracking-tight", isLowest ? "text-success" : "text-foreground")}>
                      ${quote.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">${quote.unitPrice?.toFixed(2)} per unit ({quote.quantity} qty)</p>
                  </div>

                  <div className="bg-white rounded-lg border p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Truck className="w-4 h-4 mr-2" />
                        Delivery
                      </div>
                      <span className="font-semibold">{quote.deliveryTime} Days</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Status
                      </div>
                      <span className={cn("capitalize font-medium", quote.status === 'accepted' ? 'text-success' : quote.status === 'rejected' ? 'text-danger' : 'text-warning')}>
                        {quote.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      className={cn("w-full", isLowest ? "bg-success hover:bg-success/90" : "bg-primary")}
                      onClick={() => handleUpdateStatus(quote._id, 'accepted')}
                      disabled={updateStatusMutation.isPending || quote.status === 'accepted' || quote.status === 'rejected'}
                    >
                      {quote.status === 'accepted' ? 'Approved' : 'Approve Quotation'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-2 text-danger hover:text-danger hover:bg-danger/10"
                      onClick={() => handleUpdateStatus(quote._id, 'rejected')}
                      disabled={updateStatusMutation.isPending || quote.status === 'accepted' || quote.status === 'rejected'}
                    >
                      {quote.status === 'rejected' ? 'Rejected' : 'Reject'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
