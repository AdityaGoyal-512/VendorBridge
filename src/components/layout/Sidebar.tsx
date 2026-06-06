import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileCheck, 
  CheckSquare, 
  ShoppingCart, 
  Receipt, 
  BarChart3, 
  History 
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', path: '/vendors', icon: Users },
  { name: 'RFQs', path: '/rfqs', icon: FileText },
  { name: 'Quotations', path: '/quotations', icon: FileCheck },
  { name: 'Approvals', path: '/approvals', icon: CheckSquare },
  { name: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart },
  { name: 'Invoices', path: '/invoices', icon: Receipt },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Activity Logs', path: '/activity-logs', icon: History },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">VendorBridge</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">John Doe</span>
            <span className="text-xs text-slate-500">Procurement Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
