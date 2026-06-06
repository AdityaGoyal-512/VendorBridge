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

const quotes = [
  { id: 'QT-2026-104', rfqId: 'RFQ-2026-089', vendor: 'TechCorp Supplies', amount: '$12,500.00', date: '2026-06-08', status: 'pending' },
  { id: 'QT-2026-105', rfqId: 'RFQ-2026-089', vendor: 'Office Essentials', amount: '$11,800.00', date: '2026-06-09', status: 'accepted' },
  { id: 'QT-2026-106', rfqId: 'RFQ-2026-089', vendor: 'Delta Systems', amount: '$14,200.00', date: '2026-06-09', status: 'rejected' },
  { id: 'QT-2026-107', rfqId: 'RFQ-2026-092', vendor: 'Prime Manufacturing', amount: '$8,400.00', date: '2026-06-11', status: 'pending' },
];

export default function Quotations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">Review and compare vendor bids.</p>
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
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium text-foreground flex items-center">
                    <FileCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                    {quote.id}
                  </TableCell>
                  <TableCell className="text-primary hover:underline cursor-pointer">{quote.rfqId}</TableCell>
                  <TableCell>{quote.vendor}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="text-right font-medium">{quote.amount}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        quote.status === 'accepted' ? 'success' :
                        quote.status === 'rejected' ? 'danger' : 'warning'
                      }
                      className="capitalize"
                    >
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {quote.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10">
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
        </CardContent>
      </Card>
    </div>
  );
}
