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

const approvals = [
  { id: 'APP-001', type: 'Purchase Order', reference: 'PO-2026-005', requester: 'Jane Smith', department: 'IT', amount: '$15,000.00', date: '2026-06-06', status: 'pending_my_approval' },
  { id: 'APP-002', type: 'Vendor Registration', reference: 'V-003 (Global Logistics)', requester: 'System', department: 'Procurement', amount: '-', date: '2026-06-05', status: 'pending_my_approval' },
  { id: 'APP-003', type: 'Invoice', reference: 'INV-2026-892', requester: 'Alice Johnson', department: 'Operations', amount: '$4,200.00', date: '2026-06-04', status: 'approved' },
  { id: 'APP-004', type: 'Purchase Order', reference: 'PO-2026-001', requester: 'Bob Wilson', department: 'Marketing', amount: '$8,500.00', date: '2026-06-02', status: 'rejected' },
];

export default function Approvals() {
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
            <div className="text-2xl font-bold text-primary">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Rejected This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
              {approvals.map((approval) => (
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
                        <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-danger border-danger hover:bg-danger/10">
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
        </CardContent>
      </Card>
    </div>
  );
}
