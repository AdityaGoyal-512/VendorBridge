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
import { Search, Filter, MoreHorizontal, Receipt } from 'lucide-react';

const invoices = [
  { id: 'INV-2026-892', poId: 'PO-2026-004', vendor: 'Delta Systems', amount: '$12,400.00', dueDate: '2026-07-02', status: 'paid' },
  { id: 'INV-2026-893', poId: 'PO-2026-003', vendor: 'Global Logistics', amount: '$8,950.00', dueDate: '2026-06-15', status: 'pending' },
  { id: 'INV-2026-894', poId: 'PO-2026-002', vendor: 'Office Essentials', amount: '$1,200.00', dueDate: '2026-06-01', status: 'overdue' },
  { id: 'INV-2026-895', poId: 'PO-2026-001', vendor: 'TechCorp Supplies', amount: '$4,500.00', dueDate: '2026-07-05', status: 'processing' },
];

export default function Invoices() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Track and manage vendor invoices and payments.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,650.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">$1,200.00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices..."
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
                <TableHead>Invoice ID</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-foreground flex items-center">
                    <Receipt className="w-4 h-4 mr-2 text-muted-foreground" />
                    {inv.id}
                  </TableCell>
                  <TableCell className="text-primary hover:underline cursor-pointer">{inv.poId}</TableCell>
                  <TableCell>{inv.vendor}</TableCell>
                  <TableCell className={inv.status === 'overdue' ? 'text-danger font-medium' : ''}>{inv.dueDate}</TableCell>
                  <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        inv.status === 'paid' ? 'success' :
                        inv.status === 'pending' ? 'warning' :
                        inv.status === 'overdue' ? 'danger' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
