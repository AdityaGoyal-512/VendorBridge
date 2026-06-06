import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { 
  Users, 
  FileText, 
  CheckSquare, 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Receipt, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  PlusCircle,
  AlertCircle,
  Shield,
  Activity,
  Server,
  FileCheck,
  Send,
  UserPlus
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // ─── Load Logged-in User Profile ───
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || "procurement_officer"; 
  const userName = user?.name || "John Doe";

  // Role Display Config
  const ROLE_LABELS: Record<string, string> = {
    admin: "System Administrator",
    manager: "Procurement Manager",
    procurement_officer: "Procurement Officer",
    vendor: "Vendor / Supplier"
  };
  const roleLabel = ROLE_LABELS[role] || "User";

  // Mock Data
  const recentRFQs = [
    { id: 'RFQ-2026-089', title: 'Q3 Office Equipment', department: 'Operations', deadline: '2026-06-15', bids: 3, status: 'open' },
    { id: 'RFQ-2026-092', title: 'Facility Maintenance Services', department: 'Facilities', deadline: '2026-06-12', bids: 1, status: 'open' },
    { id: 'RFQ-2026-090', title: 'Server Upgrade Components', department: 'IT', deadline: '2026-06-10', bids: 5, status: 'closed' },
  ];

  const recentInvoices = [
    { id: 'INV-2026-894', poId: 'PO-2026-002', vendor: 'Office Essentials', amount: '$1,200.00', dueDate: '2026-06-01', status: 'overdue' },
    { id: 'INV-2026-893', poId: 'PO-2026-003', vendor: 'Global Logistics', amount: '$8,950.00', dueDate: '2026-06-15', status: 'pending' },
    { id: 'INV-2026-892', poId: 'PO-2026-004', vendor: 'Delta Systems', amount: '$12,400.00', dueDate: '2026-07-02', status: 'paid' },
  ];

  const recentActivity = [
    { id: 1, user: 'Jane Smith', action: 'Approved Purchase Order', target: 'PO-2026-004', time: '10 minutes ago', type: 'success' },
    { id: 2, user: 'John Doe', action: 'Created new RFQ', target: 'RFQ-2026-092', time: '1 hour ago', type: 'create' },
    { id: 3, user: 'System', action: 'Auto-flagged Invoice', target: 'INV-2026-894', time: '2 hours ago', type: 'alert' },
    { id: 4, user: 'Alice Johnson', action: 'Added new Vendor', target: 'Prime Manufacturing', time: 'Yesterday', type: 'create' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Role-Tailored Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Welcome back, {userName} <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Logged in as <span className="font-semibold text-primary">{roleLabel}</span>. Here is your dashboard summary.
          </p>
        </div>
        
        {/* Quick Actions per Role */}
        <div className="flex flex-wrap items-center gap-3">
          {role === 'admin' && (
            <>
              <Button onClick={() => navigate('/users')} size="sm" className="h-10 bg-primary hover:bg-primary/95 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
              <Button onClick={() => navigate('/activity-logs')} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-700">
                <Activity className="mr-2 h-4 w-4" />
                Audit Trail
              </Button>
            </>
          )}
          {role === 'manager' && (
            <>
              <Button onClick={() => navigate('/approvals')} size="sm" className="h-10 bg-primary hover:bg-primary/95 text-white">
                <CheckSquare className="mr-2 h-4 w-4" />
                Approvals Queue
              </Button>
              <Button onClick={() => navigate('/reports')} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-700">
                <DollarSign className="mr-2 h-4 w-4" />
                Spend Analytics
              </Button>
            </>
          )}
          {role === 'procurement_officer' && (
            <>
              <Button onClick={() => navigate('/rfqs')} size="sm" className="h-10 bg-primary hover:bg-primary/95 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create RFQ
              </Button>
              <Button onClick={() => navigate('/vendors')} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-700">
                <Users className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </>
          )}
          {role === 'vendor' && (
            <>
              <Button onClick={() => navigate('/quotations/submit')} size="sm" className="h-10 bg-primary hover:bg-primary/95 text-white">
                <Send className="mr-2 h-4 w-4" />
                Submit Bid
              </Button>
              <Button onClick={() => navigate('/invoices')} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-700">
                <Receipt className="mr-2 h-4 w-4" />
                My Invoices
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ─── Role-Tailored KPI Cards Grid ─── */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        {role === 'admin' ? (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/users')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Users</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-primary"><Users className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold">48</div>
              <p className="text-xs text-muted-foreground mt-2">40 Active | 8 Deactivated</p>
            </CardContent>
          </Card>
        ) : role === 'vendor' ? (
          <Card className="hover:shadow-md border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Bids</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-primary"><Send className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-2">Across 3 open RFQs</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/vendors')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Vendors</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-primary"><Users className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">142</span>
                <span className="text-xs font-semibold text-success flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +8%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">128 Active onboarding profiles</p>
            </CardContent>
          </Card>
        )}

        {/* Card 2 */}
        {role === 'admin' ? (
          <Card className="hover:shadow-md border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Health</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Server className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold text-success">99.9%</div>
              <p className="text-xs text-muted-foreground mt-2">All services online</p>
            </CardContent>
          </Card>
        ) : role === 'vendor' ? (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/rfqs')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invitations to Bid</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold">4</div>
              <p className="text-xs text-danger font-medium mt-2">Closing this week</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/rfqs')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active RFQs</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">12</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">32 Bids</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-danger">4 closing this week</p>
            </CardContent>
          </Card>
        )}

        {/* Card 3 */}
        {role === 'admin' ? (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/activity-logs')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Events</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><Activity className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold">850</div>
              <p className="text-xs text-muted-foreground mt-2">Logged in the last 24h</p>
            </CardContent>
          </Card>
        ) : role === 'vendor' ? (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/invoices')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Paid Invoices</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Receipt className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold text-success">$18,400</div>
              <p className="text-xs text-muted-foreground mt-2">3 Invoices cleared this month</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/approvals')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Approvals</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><CheckSquare className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">8</span>
                <span className="text-xs font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded">Urgent</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">3 POs | 5 Quotations</p>
            </CardContent>
          </Card>
        )}

        {/* Card 4 */}
        {role === 'admin' ? (
          <Card className="hover:shadow-md border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Database Status</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Shield className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground mt-2">Fallback Local DB connected</p>
            </CardContent>
          </Card>
        ) : role === 'vendor' ? (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/invoices')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Payments</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><DollarSign className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold text-warning">$8,950</div>
              <p className="text-xs text-muted-foreground mt-2">1 Invoice awaiting approval</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-md border-slate-100 cursor-pointer" onClick={() => navigate('/reports')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Spend</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><DollarSign className="h-5 w-5" /></div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">$45,200</span>
                <span className="text-xs font-semibold text-success flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                  <TrendingDown className="h-3 w-3 mr-0.5" /> -2.4%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">78% of monthly budget utilized</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Tables and Activity Logs ─── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side Lists (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card A: RFQs */}
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 py-4 px-6 bg-slate-50/50">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {role === 'vendor' ? "Opportunities to Bid" : "Recent RFQs"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {role === 'vendor' ? "Request for Quotations open for bidding" : "Latest requests for quotations"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/rfqs')} className="text-primary hover:text-primary/90 text-xs font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/40">
                  <TableRow>
                    <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">RFQ ID</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Department</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Bids</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                    <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRFQs.map((rfq) => (
                    <TableRow key={rfq.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 font-semibold text-primary hover:underline cursor-pointer" onClick={() => navigate('/rfqs')}>
                        {rfq.id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">{rfq.title}</TableCell>
                      <TableCell className="text-slate-600">{rfq.department}</TableCell>
                      <TableCell className="text-center font-medium text-slate-900">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                          {rfq.bids}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={rfq.status === 'open' ? 'success' : 'secondary'}
                          className="capitalize px-2 py-0.5 font-medium rounded-full text-[10px]"
                        >
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right text-slate-500 text-xs font-medium">{rfq.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Card B: Invoices */}
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 py-4 px-6 bg-slate-50/50">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {role === 'vendor' ? "My Invoices" : "Recent Invoices"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {role === 'vendor' ? "Track submission and clearing of payments" : "Track pending and paid payments"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')} className="text-primary hover:text-primary/90 text-xs font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/40">
                  <TableRow>
                    <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-slate-500">Invoice ID</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Vendor</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Amount</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                    <TableHead className="pr-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 font-semibold text-slate-700 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-slate-400" />
                        {inv.id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{inv.vendor}</TableCell>
                      <TableCell className="text-right font-bold text-slate-900">{inv.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            inv.status === 'paid' ? 'success' :
                            inv.status === 'pending' ? 'warning' : 'danger'
                          }
                          className="capitalize px-2 py-0.5 font-medium rounded-full text-[10px]"
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`pr-6 text-right text-xs font-medium ${inv.status === 'overdue' ? 'text-danger font-semibold' : 'text-slate-500'}`}>
                        {inv.dueDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Timeline */}
        <Card className="border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-4 px-6 bg-slate-50/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {role === 'admin' ? "Audit Logs" : "Recent Activity"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {role === 'admin' ? "System security audit trace" : "Real-time updates of system events"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/activity-logs')} className="text-slate-500 hover:text-slate-900 p-1 rounded">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div className="flow-root h-full">
              <ul className="-mb-8">
                {recentActivity.map((log, logIdx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx !== recentActivity.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3 items-start">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white transition-all
                            ${log.type === 'success' ? 'bg-success/15 text-success' : ''}
                            ${log.type === 'create' ? 'bg-primary/15 text-primary' : ''}
                            ${log.type === 'alert' ? 'bg-danger/15 text-danger' : ''}
                          `}>
                            {log.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {log.type === 'create' && <PlusCircle className="w-4 h-4" />}
                            {log.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-900">{log.user}</span>{' '}
                            {log.action}{' '}
                            <span className="font-bold text-primary hover:underline cursor-pointer">
                              {log.target}
                            </span>
                          </div>
                          <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300" />
                            {log.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
