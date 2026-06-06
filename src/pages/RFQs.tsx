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
import { Plus, Search, Filter, MoreHorizontal, FileText } from 'lucide-react';

const rfqs = [
  { id: 'RFQ-2026-089', title: 'Q3 Office Equipment', department: 'Operations', deadline: '2026-06-15', status: 'open', bids: 3 },
  { id: 'RFQ-2026-090', title: 'Server Upgrade Components', department: 'IT', deadline: '2026-06-10', status: 'closed', bids: 5 },
  { id: 'RFQ-2026-091', title: 'Marketing Materials', department: 'Marketing', deadline: '2026-06-20', status: 'draft', bids: 0 },
  { id: 'RFQ-2026-092', title: 'Facility Maintenance Services', department: 'Facilities', deadline: '2026-06-12', status: 'open', bids: 1 },
];

export default function RFQs() {
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
                <TableHead>Department</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Bids Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium text-primary flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                    {rfq.id}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{rfq.title}</TableCell>
                  <TableCell>{rfq.department}</TableCell>
                  <TableCell>{rfq.deadline}</TableCell>
                  <TableCell>
                    <span className="font-medium">{rfq.bids}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        rfq.status === 'open' ? 'success' :
                        rfq.status === 'closed' ? 'secondary' : 'outline'
                      }
                      className="capitalize"
                    >
                      {rfq.status}
                    </Badge>
                  </TableCell>
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
