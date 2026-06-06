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
import { Search, Filter, MoreHorizontal, ShoppingCart, Plus } from 'lucide-react';

const pos = [
  { id: 'PO-2026-001', vendor: 'TechCorp Supplies', amount: '$4,500.00', date: '2026-06-05', delivery: '2026-06-15', status: 'pending' },
  { id: 'PO-2026-002', vendor: 'Office Essentials', amount: '$1,200.00', date: '2026-06-04', delivery: '2026-06-10', status: 'approved' },
  { id: 'PO-2026-003', vendor: 'Global Logistics', amount: '$8,950.00', date: '2026-06-03', delivery: '2026-06-08', status: 'shipped' },
  { id: 'PO-2026-004', vendor: 'Delta Systems', amount: '$12,400.00', date: '2026-06-02', delivery: '2026-06-05', status: 'delivered' },
  { id: 'PO-2026-005', vendor: 'Prime Manufacturing', amount: '$15,000.00', date: '2026-06-06', delivery: '2026-06-25', status: 'draft' },
];

export default function PurchaseOrders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage your purchase orders and track deliveries.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create PO
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search purchase orders..."
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
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date Issued</TableHead>
                <TableHead>Exp. Delivery</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium text-foreground flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2 text-muted-foreground" />
                    {po.id}
                  </TableCell>
                  <TableCell className="text-primary hover:underline cursor-pointer">{po.vendor}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{po.delivery}</TableCell>
                  <TableCell className="text-right font-medium">{po.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        po.status === 'approved' ? 'success' :
                        po.status === 'pending' ? 'warning' :
                        po.status === 'shipped' ? 'default' :
                        po.status === 'delivered' ? 'outline' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {po.status}
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
