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
import { CheckSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function Approvals() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'admin' || user?.role === 'procurement_officer' || user?.role === 'manager';

  const { data, isLoading } = useQuery({
    queryKey: ['quotations_approval'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/v1/quotations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch quotations');
      const json = await response.json();
      return json.data;
    },
    enabled: isManager
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
      queryClient.invalidateQueries({ queryKey: ['quotations_approval'] });
    }
  });

  if (user && !isManager) {
    return (
      <div className="p-8 text-center space-y-4 animate-fade-in">
        <p className="text-rose-600 font-semibold">Access Denied: Only procurement managers can access the approvals queue.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const quotes = data || [];
  
  // Transform quotes to the approval queue format
  const approvals = quotes
    .filter((q: any) => q.status === 'submitted' || q.status === 'under_review')
    .map((q: any) => ({
      id: q._id,
      type: 'Quotation',
      reference: `QT-${q._id.substring(q._id.length - 6).toUpperCase()} (${q.rfqId?.title || 'Unknown RFQ'})`,
      requester: q.vendorId?.name || 'Unknown Vendor',
      department: 'Procurement',
      amount: `$${q.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      date: new Date(q.createdAt).toLocaleDateString(),
      status: 'pending_my_approval',
      rawId: q._id
    }));

  const approvedThisWeek = quotes.filter((q: any) => q.status === 'accepted').length;
  const rejectedThisWeek = quotes.filter((q: any) => q.status === 'rejected').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">Manage tasks requiring your authorization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Pending My Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{approvals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Total Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedThisWeek}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Total Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{rejectedThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="p-8 text-center text-muted-foreground">Loading queue...</div>
          ) : approvals.length === 0 ? (
             <div className="p-8 text-center text-muted-foreground border-t border-dashed">No items pending your approval right now!</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval: any) => (
                <TableRow key={approval.id} className={approval.status === 'pending_my_approval' ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    {approval.type}
                  </TableCell>
                  <TableCell className="text-primary hover:underline cursor-pointer">{approval.reference}</TableCell>
                  <TableCell>{approval.requester}</TableCell>
                  <TableCell>{approval.department}</TableCell>
                  <TableCell>{approval.date}</TableCell>
                  <TableCell className="text-right font-medium">{approval.amount}</TableCell>
                  <TableCell className="text-right">
                    {approval.status === 'pending_my_approval' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90 text-white"
                          onClick={() => updateStatusMutation.mutate({ id: approval.rawId, status: 'accepted' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-danger border-danger hover:bg-danger/10"
                          onClick={() => updateStatusMutation.mutate({ id: approval.rawId, status: 'rejected' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge 
                        variant={approval.status === 'approved' ? 'success' : 'danger'}
                        className="capitalize"
                      >
                        {approval.status}
                      </Badge>
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
