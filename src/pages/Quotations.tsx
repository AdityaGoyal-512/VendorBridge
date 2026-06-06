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
import { Search, Filter, MoreHorizontal, FileCheck, CheckCircle, XCircle } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function Quotations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/v1/quotations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const json = await response.json();
      return json.data;
    }
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
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    }
  });

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const quotes = data || [];

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isVendor = user?.role === 'vendor';
  const isManager = user?.role === 'admin' || user?.role === 'procurement_officer' || user?.role === 'manager';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Review and compare vendor bids.</p>
        </div>
        <div className="flex gap-3">
          {isManager && (
            <Button variant="outline" onClick={() => navigate('/quotations/compare')}>
              Compare Bids
            </Button>
          )}
          {isVendor && (
            <Button onClick={() => navigate('/quotations/submit')} className="bg-primary text-white">
              Submit Quotation
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search quotations..."
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
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading quotations...</div>
          ) : isError ? (
            <div className="p-8 text-center text-danger">Failed to load quotations. Is the backend running?</div>
          ) : quotes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No quotations found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>RFQ Reference</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote: any) => (
                  <TableRow key={quote._id}>
                    <TableCell className="font-medium text-foreground flex items-center">
                      <FileCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                      QT-{quote._id.substring(quote._id.length - 6).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-primary hover:underline cursor-pointer">{quote.rfqId?.title || 'Unknown RFQ'}</TableCell>
                    <TableCell>{quote.vendorId?.name || 'Unknown Vendor'}</TableCell>
                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${quote.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          quote.status === 'accepted' ? 'success' :
                          quote.status === 'rejected' ? 'danger' : 
                          quote.status === 'under_review' ? 'default' : 'warning'
                        }
                        className="capitalize"
                      >
                        {quote.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(quote.status === 'submitted' || quote.status === 'under_review') && isManager ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleUpdateStatus(quote._id, 'accepted')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10"
                            onClick={() => handleUpdateStatus(quote._id, 'rejected')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
