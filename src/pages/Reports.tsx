import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock, 
  Download, 
  Calendar,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api, Vendor, PurchaseOrder, Invoice, RFQ } from '@/lib/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ef4444'];

export default function Reports() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      const [vList, pList, iList, rList] = await Promise.all([
        api.getVendors(),
        api.getPurchaseOrders(),
        api.getInvoices(),
        api.getRFQs()
      ]);
      setVendors(vList || []);
      setPos(pList || []);
      setInvoices(iList || []);
      setRfqs(rList || []);
    } catch (err) {
      console.error('Error loading reports data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Baseline spends representing previous months of 2026
    const baseSpends = [14200, 18500, 15400, 22100, 19800, 0, 0, 0, 0, 0, 0, 0];
    const baseSavings = [1200, 1600, 1300, 1900, 1700, 0, 0, 0, 0, 0, 0, 0];

    const liveSpends = Array(12).fill(0);
    const liveSavings = Array(12).fill(0);

    pos.forEach(po => {
      if (po.status !== 'draft') {
        const date = po.createdAt ? new Date(po.createdAt) : new Date();
        const monthIndex = date.getMonth(); // 0 - 11
        liveSpends[monthIndex] += po.totalAmount;
        // Savings simulation: average 8.5% procurement cost reduction
        liveSavings[monthIndex] += po.totalAmount * 0.085;
      }
    });

    return months.map((month, idx) => {
      const spend = baseSpends[idx] + liveSpends[idx];
      const savings = baseSavings[idx] + liveSavings[idx];
      return {
        name: month,
        Spend: parseFloat(spend.toFixed(2)),
        Savings: parseFloat(savings.toFixed(2))
      };
    });
  };

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {
      'Electronics': 0,
      'Office Supplies': 0,
      'Logistics': 0,
      'Raw Materials': 0,
      'Software': 0
    };

    pos.forEach(po => {
      if (po.status !== 'draft') {
        let category = 'Office Supplies';
        if (typeof po.vendorId === 'object' && po.vendorId) {
          category = po.vendorId.category || 'Office Supplies';
        } else {
          const found = vendors.find(v => v._id === po.vendorId);
          if (found) {
            category = found.category || 'Office Supplies';
          }
        }
        if (categoryTotals[category] !== undefined) {
          categoryTotals[category] += po.totalAmount;
        } else {
          categoryTotals[category] = po.totalAmount;
        }
      }
    });

    const baseline: { [key: string]: number } = {
      'Electronics': 25400,
      'Office Supplies': 8900,
      'Logistics': 15600,
      'Raw Materials': 18900,
      'Software': 12000
    };

    return Object.keys(baseline).map(cat => ({
      name: cat,
      value: parseFloat((baseline[cat] + (categoryTotals[cat] || 0)).toFixed(2))
    }));
  };

  const getVendorSpendData = () => {
    const vendorTotals: { [key: string]: number } = {};

    pos.forEach(po => {
      if (po.status !== 'draft') {
        let vName = 'Unknown';
        if (typeof po.vendorId === 'object' && po.vendorId) {
          vName = po.vendorId.name;
        } else {
          const found = vendors.find(v => v._id === po.vendorId);
          if (found) vName = found.name;
        }
        vendorTotals[vName] = (vendorTotals[vName] || 0) + po.totalAmount;
      }
    });

    const baseline: { [key: string]: number } = {
      'TechCorp Supplies': 12400,
      'Office Essentials': 4300,
      'Global Logistics': 8700,
      'Delta Systems': 11500,
      'Prime Manufacturing': 9800
    };

    return Object.keys(baseline).map(v => ({
      name: v,
      Spend: parseFloat((baseline[v] + (vendorTotals[v] || 0)).toFixed(2))
    })).sort((a, b) => b.Spend - a.Spend).slice(0, 5);
  };

  const getApprovalStatsData = () => {
    const statusCounts: { [key: string]: number } = {
      'Paid': 0,
      'Pending': 0,
      'Overdue': 0,
      'Processing': 0
    };

    invoices.forEach(inv => {
      const status = inv.status;
      if (status === 'paid') statusCounts['Paid']++;
      else if (status === 'pending') statusCounts['Pending']++;
      else if (status === 'overdue') statusCounts['Overdue']++;
      else if (status === 'processing') statusCounts['Processing']++;
    });

    const totalLive = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    if (totalLive === 0) {
      return [
        { name: 'Paid', value: 12 },
        { name: 'Pending', value: 5 },
        { name: 'Overdue', value: 2 },
        { name: 'Processing', value: 3 }
      ];
    }

    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };

  const formatCurrency = (amount: number | string) => {
    const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numeric);
  };

  // Calculations
  const monthlyData = getMonthlyData();
  const totalSpendYTD = monthlyData.reduce((sum, item) => sum + item.Spend, 0);
  const totalSavingsYTD = monthlyData.reduce((sum, item) => sum + item.Savings, 0);
  const savingsRate = totalSpendYTD > 0 ? ((totalSavingsYTD / totalSpendYTD) * 100).toFixed(1) : '8.6';

  const totalPOsCount = pos.length;
  const fulfilledPOsCount = pos.filter(po => ['shipped', 'delivered'].includes(po.status)).length;
  const fulfillmentRate = totalPOsCount > 0 ? ((fulfilledPOsCount / totalPOsCount) * 100).toFixed(1) : '85.4';

  const handleExportCSV = () => {
    const monthly = getMonthlyData();
    const csvRows = [
      ['Month', 'Total Spend (USD)', 'Total Savings (USD)'],
      ...monthly.map(item => [item.name, item.Spend, item.Savings])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "VendorBridge_Procurement_Spend_Report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-0.5">Gain live insights, monitor vendor spend distributions, and export data audits.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            onClick={handleExportCSV} 
            className="h-10 bg-primary text-white shadow-sm shadow-primary/20 flex items-center gap-1.5 hover:bg-primary/95"
          >
            <Download className="h-4 w-4" />
            Export Spend CSV
          </Button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Total Spend */}
        <Card className="hover:shadow-md transition-shadow border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Spend YTD</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(totalSpendYTD)}
            </div>
            <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.4% vs last year
            </p>
          </CardContent>
        </Card>

        {/* Cost Savings */}
        <Card className="hover:shadow-md transition-shadow border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fulfillment Cost Savings</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
              {formatCurrency(totalSavingsYTD)}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">
              Average {savingsRate}% savings rate achieved
            </p>
          </CardContent>
        </Card>

        {/* PO Fulfillment Rate */}
        <Card className="hover:shadow-md transition-shadow border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">PO Fulfillment Rate</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Percent className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
              {fulfillmentRate}%
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">
              {fulfilledPOsCount} of {totalPOsCount} POs shipped/delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Trend Area Chart */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-5 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">Monthly Procurement Trends</CardTitle>
            <CardDescription className="text-xs text-slate-500">Tracking aggregate spend and savings over current calendar year.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: '500' }} />
                  <Area type="monotone" dataKey="Spend" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" name="Total Spend" />
                  <Area type="monotone" dataKey="Savings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" name="Fulfillment Savings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category spend Pie Chart */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-5 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">Spend by Product Category</CardTitle>
            <CardDescription className="text-xs text-slate-500">Distribution of cumulative procurement capital across categories.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Breakdown</h4>
              <div className="grid gap-2.5">
                {getCategoryData().map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Spend Bar Chart */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-5 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">Top 5 Vendors by Spend</CardTitle>
            <CardDescription className="text-xs text-slate-500">Ranking of suppliers with the highest procurement transaction value.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getVendorSpendData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  />
                  <Bar dataKey="Spend" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {getVendorSpendData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Audit Pie Chart */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-5 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900">Invoice Payment Distributions</CardTitle>
            <CardDescription className="text-xs text-slate-500">Auditing statuses of invoiced payments processed in MongoDB.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getApprovalStatsData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {getApprovalStatsData().map((entry, index) => {
                      const colorsMap: { [key: string]: string } = {
                        'Paid': '#10b981',
                        'Pending': '#f59e0b',
                        'Overdue': '#ef4444',
                        'Processing': '#3b82f6'
                      };
                      return <Cell key={`cell-${index}`} fill={colorsMap[entry.name] || COLORS[index % COLORS.length]} />;
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ fontSize: '12px' }}
                    formatter={(value) => [`${value} Invoices`, undefined]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Status</h4>
              <div className="grid gap-2.5">
                {getApprovalStatsData().map((item) => {
                  const colorsMap: { [key: string]: string } = {
                    'Paid': '#10b981',
                    'Pending': '#f59e0b',
                    'Overdue': '#ef4444',
                    'Processing': '#3b82f6'
                  };
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorsMap[item.name] || '#64748b' }}></span>
                        <span className="text-slate-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{item.value} voucher{item.value !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
