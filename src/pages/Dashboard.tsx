import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, DollarSign, Package, Users, Activity } from 'lucide-react';

const recentOrders = [
  { id: 'PO-2026-001', vendor: 'TechCorp Supplies', date: '2026-06-05', amount: '$4,500.00', status: 'pending' },
  { id: 'PO-2026-002', vendor: 'Office Essentials', date: '2026-06-04', amount: '$1,200.00', status: 'approved' },
  { id: 'PO-2026-003', vendor: 'Global Logistics', date: '2026-06-03', amount: '$8,950.00', status: 'shipped' },
  { id: 'PO-2026-004', vendor: 'Delta Systems', date: '2026-06-02', amount: '$12,400.00', status: 'delivered' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your procurement activities.</p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500.00</div>
            <p className="text-xs text-success flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +4.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 new vendors this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-warning mt-1">
              Requires immediate action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open RFQs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              14 responses received
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary hover:underline cursor-pointer">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'approved' ? 'success' :
                          order.status === 'pending' ? 'warning' :
                          order.status === 'shipped' ? 'default' :
                          order.status === 'delivered' ? 'outline' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-danger mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Invoice INV-901 Overdue</p>
                  <p className="text-xs text-muted-foreground">Global Logistics - $3,400.00</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              <div className="flex items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-warning mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Pending PO Approval</p>
                  <p className="text-xs text-muted-foreground">PO-2026-005 - $15,000.00</p>
                </div>
                <Button variant="ghost" size="sm">Review</Button>
              </div>
              <div className="flex items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New RFQ Responses</p>
                  <p className="text-xs text-muted-foreground">IT Equipment Q3 - 3 quotes</p>
                </div>
                <Button variant="ghost" size="sm">Compare</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
