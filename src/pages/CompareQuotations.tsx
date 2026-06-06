import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Clock, Truck, ShieldCheck, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompareQuotations() {
  // Dummy Data mimicking backend sort logic (lowest price first)
  const quotes = [
    { 
      id: 'QT-2026-104', 
      vendor: 'TechCorp Supplies', 
      rating: 4.8,
      unitPrice: 25.00,
      totalPrice: 12500.00,
      deliveryTime: 10,
      status: 'under_review',
      bestPrice: true 
    },
    { 
      id: 'QT-2026-105', 
      vendor: 'Office Essentials', 
      rating: 4.2,
      unitPrice: 28.50,
      totalPrice: 14250.00,
      deliveryTime: 5,
      status: 'under_review',
      bestPrice: false 
    },
    { 
      id: 'QT-2026-107', 
      vendor: 'Prime Manufacturing', 
      rating: 4.9,
      unitPrice: 26.00,
      totalPrice: 13000.00,
      deliveryTime: 14,
      status: 'under_review',
      bestPrice: false 
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compare Quotations</h1>
          <p className="text-muted-foreground">RFQ-2026-090: Server Upgrade Components</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Comparison
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quotes.map((quote, index) => (
          <Card 
            key={quote.id} 
            className={cn(
              "relative transition-all duration-200 hover:shadow-md",
              quote.bestPrice ? "border-success ring-1 ring-success/20 bg-success/5" : "border-border"
            )}
          >
            {quote.bestPrice && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                <Trophy className="w-3 h-3 mr-1" />
                LOWEST BID
              </div>
            )}
            <CardHeader className="pb-4 border-b bg-white rounded-t-xl">
              <CardTitle className="text-lg flex justify-between items-start">
                <span className="font-bold">{quote.vendor}</span>
                <Badge variant={quote.bestPrice ? 'success' : 'secondary'} className="font-mono">
                  {quote.id}
                </Badge>
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Star className="w-4 h-4 text-warning fill-warning mr-1" />
                <span className="font-medium text-foreground">{quote.rating}</span>
                <span className="mx-2">•</span>
                <ShieldCheck className="w-4 h-4 text-success mr-1" />
                Verified Vendor
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className={cn("text-3xl font-bold tracking-tight", quote.bestPrice ? "text-success" : "text-foreground")}>
                  ${quote.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">${quote.unitPrice.toFixed(2)} per unit</p>
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
                  <span className="capitalize font-medium text-warning">{quote.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className={cn("w-full", quote.bestPrice ? "bg-success hover:bg-success/90" : "bg-primary")}>
                  Approve Quotation
                </Button>
                <Button variant="ghost" className="w-full mt-2 text-danger hover:text-danger hover:bg-danger/10">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
