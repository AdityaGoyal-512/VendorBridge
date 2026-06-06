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
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';

const vendors = [
  { id: 'V-001', name: 'TechCorp Supplies', category: 'Electronics', contact: 'john@techcorp.com', status: 'active', spend: '$45,000' },
  { id: 'V-002', name: 'Office Essentials', category: 'Stationery', contact: 'sales@officeessentials.com', status: 'active', spend: '$12,400' },
  { id: 'V-003', name: 'Global Logistics', category: 'Shipping', contact: 'support@globallogistics.com', status: 'under_review', spend: '$8,900' },
  { id: 'V-004', name: 'Delta Systems', category: 'Software', contact: 'billing@deltasys.com', status: 'active', spend: '$120,000' },
  { id: 'V-005', name: 'Prime Manufacturing', category: 'Raw Materials', contact: 'info@primemanufacturing.com', status: 'inactive', spend: '$0' },
];

export default function Vendors() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor directory and performance.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendors..."
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
                <TableHead>Vendor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">YTD Spend</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium text-muted-foreground">{vendor.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{vendor.name}</TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell className="text-muted-foreground">{vendor.contact}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        vendor.status === 'active' ? 'success' :
                        vendor.status === 'under_review' ? 'warning' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {vendor.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{vendor.spend}</TableCell>
                  <TableCell>
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
