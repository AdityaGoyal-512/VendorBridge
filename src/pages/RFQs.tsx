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

export default function RFQs() {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Requests for Quotation</h1>
          <p className="text-muted-foreground">Manage your RFQs and invite vendors to bid.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create RFQ
        </Button>
      </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
