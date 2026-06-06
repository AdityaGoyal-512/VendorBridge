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
import { Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { api, Vendor, PurchaseOrder } from '@/lib/api';

export default function Vendors() {
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [posList, setPosList] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [vends, pos] = await Promise.all([
          api.getVendors(),
          api.getPurchaseOrders()
        ]);
        setVendorsList(vends || []);
        setPosList(pos || []);
      } catch (err) {
        console.error('Error loading vendors page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getVendorSpend = (vendorId: string) => {
    const total = posList
      .filter(po => {
        const id = typeof po.vendorId === 'object' && po.vendorId ? (po.vendorId as any)._id : po.vendorId;
        return id === vendorId && ['approved', 'shipped', 'delivered'].includes(po.status);
      })
      .reduce((sum, po) => sum + po.totalAmount, 0);

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  };

  const filteredVendors = vendorsList.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No vendors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium text-muted-foreground">
                      VB-{vendor._id.slice(-5).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{vendor.name}</TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          vendor.status === 'active' ? 'success' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{getVendorSpend(vendor._id)}</TableCell>
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
