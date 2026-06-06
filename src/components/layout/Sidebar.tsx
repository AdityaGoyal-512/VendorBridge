import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  History,
  UserCog,
  LogOut,
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
  { name: 'User Management', path: '/users', icon: UserCog },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load user info from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "John Doe";
  const userRole = user?.role 
    ? user.role.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) 
    : "Procurement Manager";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("accessToken");
      
      // Call backend logout
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Logout request error:", err);
    }
    
    // Clear tokens and localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Redirect to login page
    navigate("/login");
  };

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
      
      <div className="p-4 border-t border-sidebar-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-slate-900 truncate">{userName}</span>
            <span className="text-xs text-slate-500 truncate">{userRole}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-slate-50"
          title="Log Out"
          id="logout-btn"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
