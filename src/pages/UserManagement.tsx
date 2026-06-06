import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ChevronDown,
  Mail,
  Phone,
  User,
  Lock,
  AlertTriangle,
  UserX,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Types ───
interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

type UserRole = "admin" | "procurement_officer" | "vendor" | "manager";

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; icon: typeof Shield }
> = {
  admin: { label: "Admin", color: "text-red-600 bg-red-50", icon: ShieldCheck },
  procurement_officer: {
    label: "Procurement Officer",
    color: "text-primary bg-primary/10",
    icon: UserCog,
  },
  vendor: { label: "Vendor", color: "text-amber-600 bg-amber-50", icon: Users },
  manager: {
    label: "Manager",
    color: "text-emerald-600 bg-emerald-50",
    icon: Shield,
  },
};

// ─── Sample Data ───
const MOCK_USERS: UserRecord[] = [
  { id: "USR-001", name: "Aditya Goyal", email: "aditya@vendorbridge.com", phone: "+91 98765 43210", role: "admin", isActive: true, lastLogin: "2026-06-06 10:30 AM", createdAt: "2026-01-15" },
  { id: "USR-002", name: "Priya Sharma", email: "priya.sharma@vendorbridge.com", phone: "+91 87654 32109", role: "procurement_officer", isActive: true, lastLogin: "2026-06-06 09:45 AM", createdAt: "2026-02-01" },
  { id: "USR-003", name: "Rahul Mehta", email: "rahul.mehta@vendorbridge.com", phone: "+91 76543 21098", role: "manager", isActive: true, lastLogin: "2026-06-05 04:20 PM", createdAt: "2026-02-10" },
  { id: "USR-004", name: "Sneha Patel", email: "sneha.patel@techcorp.com", phone: "+91 65432 10987", role: "vendor", isActive: true, lastLogin: "2026-06-05 02:15 PM", createdAt: "2026-03-05" },
  { id: "USR-005", name: "Amit Kumar", email: "amit.kumar@vendorbridge.com", phone: "+91 54321 09876", role: "procurement_officer", isActive: true, lastLogin: "2026-06-04 11:00 AM", createdAt: "2026-03-20" },
  { id: "USR-006", name: "Neha Singh", email: "neha.singh@globallogistics.com", phone: "+91 43210 98765", role: "vendor", isActive: false, lastLogin: "2026-05-20 03:30 PM", createdAt: "2026-04-01" },
  { id: "USR-007", name: "Vikram Joshi", email: "vikram.joshi@vendorbridge.com", phone: "+91 32109 87654", role: "manager", isActive: true, lastLogin: "2026-06-06 08:50 AM", createdAt: "2026-04-15" },
  { id: "USR-008", name: "Ananya Reddy", email: "ananya.reddy@vendorbridge.com", phone: "+91 21098 76543", role: "procurement_officer", isActive: true, lastLogin: "2026-06-03 05:10 PM", createdAt: "2026-05-01" },
  { id: "USR-009", name: "Karan Malhotra", email: "karan.m@deltasys.com", phone: "+91 10987 65432", role: "vendor", isActive: true, lastLogin: "2026-06-06 07:25 AM", createdAt: "2026-05-10" },
  { id: "USR-010", name: "Deepika Nair", email: "deepika.nair@vendorbridge.com", phone: "+91 09876 54321", role: "admin", isActive: true, lastLogin: "2026-06-06 10:00 AM", createdAt: "2026-05-15" },
  { id: "USR-011", name: "Rohan Gupta", email: "rohan.gupta@vendorbridge.com", phone: "+91 98765 11111", role: "procurement_officer", isActive: false, lastLogin: "2026-04-30 01:00 PM", createdAt: "2026-01-20" },
  { id: "USR-012", name: "Meera Iyer", email: "meera.iyer@primemanuf.com", phone: "+91 98765 22222", role: "vendor", isActive: true, lastLogin: "2026-06-05 06:45 PM", createdAt: "2026-02-28" },
];

const ITEMS_PER_PAGE = 8;

// ─── Custom Select Dropdown ───
function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          value ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <span>
          {value
            ? options.find((o) => o.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg animate-fade-in">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  value === opt.value
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-popover-foreground"
                }`}
              >
                <Check
                  className={`h-3.5 w-3.5 ${value === opt.value ? "opacity-100" : "opacity-0"}`}
                />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create User Modal ───
function CreateUserModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<UserRecord, "id" | "lastLogin" | "createdAt">) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "" as string,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email format";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8)
      errs.password = "Min 8 characters";
    if (!formData.role) errs.role = "Role is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      role: formData.role as UserRole,
      isActive: true,
    });
    setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="create-user-modal">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-background rounded-xl border shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Create New User
            </h2>
            <p className="text-sm text-muted-foreground">
              Add a new user to VendorBridge
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-muted transition-colors"
            id="create-user-close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="create-firstName">First name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="create-firstName"
                  placeholder="John"
                  className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-destructive animate-fade-in">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-lastName">Last name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="create-lastName"
                  placeholder="Doe"
                  className={`pl-10 ${errors.lastName ? "border-destructive" : ""}`}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-destructive animate-fade-in">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="create-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="create-email"
                type="email"
                placeholder="name@company.com"
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="create-phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="create-phone"
                type="tel"
                placeholder="+91 98765 43210"
                className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <SelectDropdown
              id="create-role"
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              placeholder="Select a role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "procurement_officer", label: "Procurement Officer" },
                { value: "vendor", label: "Vendor" },
                { value: "manager", label: "Manager" },
              ]}
            />
            {errors.role && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.role}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="create-password">Temporary password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="create-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.password}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              id="create-user-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" id="create-user-submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Deactivate Confirmation Modal ───
function DeactivateModal({
  user,
  onClose,
  onConfirm,
}: {
  user: UserRecord | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="deactivate-modal">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-background rounded-xl border shadow-2xl animate-fade-in">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Deactivate User
              </h3>
              <p className="text-sm text-muted-foreground">
                This action can be reversed later
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-foreground">
              Are you sure you want to deactivate{" "}
              <span className="font-semibold">{user.name}</span>? They will no
              longer be able to sign in to VendorBridge.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} id="deactivate-cancel">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm(user.id);
                onClose();
              }}
              id="deactivate-confirm"
            >
              <UserX className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Change Role Modal ───
function ChangeRoleModal({
  user,
  onClose,
  onConfirm,
}: {
  user: UserRecord | null;
  onClose: () => void;
  onConfirm: (userId: string, newRole: UserRole) => void;
}) {
  const [newRole, setNewRole] = useState<string>(user?.role || "");

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="change-role-modal">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4 bg-background rounded-xl border shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Change Role
            </h3>
            <p className="text-sm text-muted-foreground">
              Update role for {user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Current role display */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current role:</span>
            <RoleBadge role={user.role} />
          </div>

          {/* Role selection grid */}
          <div className="space-y-2">
            <Label>New role</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
                const config = ROLE_CONFIG[role];
                const Icon = config.icon;
                const isSelected = newRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewRole(role)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30 text-foreground hover:bg-muted/50"
                    }`}
                    id={`role-option-${role}`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm(user.id, newRole as UserRole);
                onClose();
              }}
              disabled={newRole === user.role}
              id="change-role-confirm"
            >
              <Shield className="mr-2 h-4 w-4" />
              Update Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Role Badge ───
function RoleBadge({ role }: { role: UserRole }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ─── Action Dropdown ───
function ActionDropdown({
  user,
  onChangeRole,
  onDeactivate,
  onReactivate,
}: {
  user: UserRecord;
  onChangeRole: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(!open)}
        id={`action-${user.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-48 rounded-md border border-border bg-popover shadow-lg animate-fade-in">
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => {
                  onChangeRole();
                  setOpen(false);
                }}
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                Change Role
              </button>
              {user.isActive ? (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => {
                    onDeactivate();
                    setOpen(false);
                  }}
                >
                  <UserX className="h-4 w-4" />
                  Deactivate
                </button>
              ) : (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-success hover:bg-success/10 transition-colors"
                  onClick={() => {
                    onReactivate();
                    setOpen(false);
                  }}
                >
                  <Check className="h-4 w-4" />
                  Reactivate
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ─── Main Page Component ───
// ═══════════════════════════════════════════════
export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deactivateUser, setDeactivateUser] = useState<UserRecord | null>(null);
  const [changeRoleUser, setChangeRoleUser] = useState<UserRecord | null>(null);

  // ─── Filtering & Search ───
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;
    const byRole = {
      admin: users.filter((u) => u.role === "admin").length,
      procurement_officer: users.filter(
        (u) => u.role === "procurement_officer"
      ).length,
      vendor: users.filter((u) => u.role === "vendor").length,
      manager: users.filter((u) => u.role === "manager").length,
    };
    return { total, active, inactive, byRole };
  }, [users]);

  // ─── Handlers ───
  const handleCreateUser = (
    newUser: Omit<UserRecord, "id" | "lastLogin" | "createdAt">
  ) => {
    const id = `USR-${String(users.length + 1).padStart(3, "0")}`;
    setUsers((prev) => [
      {
        ...newUser,
        id,
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const handleDeactivate = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u))
    );
  };

  const handleReactivate = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: true } : u))
    );
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const activeFiltersCount =
    (roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-6 animate-fade-in" id="user-management-page">
      {/* ─── Page Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} id="add-user-btn">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-success flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <UserX className="w-4 h-4 mr-2" />
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.byRole.admin}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Data Table Card ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-background border border-input rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                id="user-search"
              />
            </div>
            {/* Filter toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => setShowFilters(!showFilters)}
              id="filter-toggle"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground"
                onClick={() => {
                  setRoleFilter("all");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                id="clear-filters"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </CardHeader>

        {/* Filter row */}
        {showFilters && (
          <div className="border-b px-4 py-3 bg-muted/30 flex items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Role:
              </Label>
              <select
                value={roleFilter}
                onChange={(e) =>
                  handleFilterChange(setRoleFilter, e.target.value)
                }
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                id="role-filter"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="procurement_officer">Procurement Officer</option>
                <option value="vendor">Vendor</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Status:
              </Label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  handleFilterChange(setStatusFilter, e.target.value)
                }
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                id="status-filter"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-40" />
                      <p className="text-sm font-medium">No users found</p>
                      <p className="text-xs">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={!user.isActive ? "opacity-60" : ""}
                  >
                    {/* User info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                            user.isActive
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {/* Role */}
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    {/* Phone */}
                    <TableCell className="text-muted-foreground text-sm">
                      {user.phone}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "success" : "secondary"}
                        className="capitalize"
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    {/* Last login */}
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    {/* Created */}
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    {/* Actions */}
                    <TableCell>
                      <ActionDropdown
                        user={user}
                        onChangeRole={() => setChangeRoleUser(user)}
                        onDeactivate={() => setDeactivateUser(user)}
                        onReactivate={() => handleReactivate(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredUsers.length}
              </span>{" "}
              users
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                id="page-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(page)}
                    id={`page-${page}`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                id="page-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ─── Modals ─── */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      <DeactivateModal
        user={deactivateUser}
        onClose={() => setDeactivateUser(null)}
        onConfirm={handleDeactivate}
      />
      <ChangeRoleModal
        user={changeRoleUser}
        onClose={() => setChangeRoleUser(null)}
        onConfirm={handleChangeRole}
      />
    </div>
  );
}
