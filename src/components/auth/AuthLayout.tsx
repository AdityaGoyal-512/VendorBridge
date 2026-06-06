import { Link } from "react-router-dom";
import { Building2, ShieldCheck, BarChart3, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const features = [
  {
    icon: Building2,
    title: "Vendor Management",
    description: "Centralize and streamline all your vendor relationships",
  },
  {
    icon: ShieldCheck,
    title: "Smart Approvals",
    description: "Multi-level approval workflows with complete audit trails",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Actionable insights into procurement spend and performance",
  },
  {
    icon: Zap,
    title: "Automated RFQs",
    description: "Generate, distribute, and compare quotes effortlessly",
  },
];

export default function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" id="auth-layout">
      {/* ─── Left Branding Panel ─── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-[hsl(243,75%,15%)] via-[hsl(243,75%,25%)] to-[hsl(260,70%,35%)]">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/[0.03] rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              VendorBridge
            </span>
          </div>

          {/* Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Procurement,
                <br />
                <span className="bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Simplified.
                </span>
              </h1>
              <p className="text-indigo-200/80 text-lg max-w-md leading-relaxed">
                Streamline your entire procurement lifecycle — from vendor
                onboarding to invoice settlement — in one unified platform.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-4 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm hover:bg-white/[0.10] transition-all duration-300"
                >
                  <feature.icon className="w-5 h-5 text-indigo-300 mb-2.5 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-indigo-200/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-indigo-300/50 text-xs">
            © {new Date().getFullYear()} VendorBridge. Enterprise Procurement
            ERP.
          </p>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              VendorBridge
            </span>
          </div>

          {/* Header */}
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>

          {/* Form content */}
          {children}

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              to={footerLinkTo}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
              id="auth-footer-link"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
