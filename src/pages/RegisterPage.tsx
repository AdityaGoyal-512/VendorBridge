import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";

// ─── Validation Schema ───
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(?:\+91|0)?[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit number"
      ),
    role: z.string().min(1, "Please select a role"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const roles = [
  { value: "admin", label: "System Administrator" },
  { value: "procurement_officer", label: "Procurement Officer" },
  { value: "vendor", label: "Vendor / Supplier" },
  { value: "manager", label: "Manager" },
];

// ─── Password Strength Indicator ───
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.met).length;

  if (!password) return null;

  const colors = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-success"];
  const barColor = colors[Math.max(0, strength - 1)] ?? "bg-border";

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? barColor : "bg-border"
            }`}
          />
        ))}
      </div>
      {/* Criteria checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              check.met ? "text-success" : "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-3 w-3 transition-all duration-200 ${
                check.met ? "opacity-100 scale-100" : "opacity-30 scale-90"
              }`}
            />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: data.role,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSubmitSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with VendorBridge in just a few steps"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        id="register-form"
        noValidate
      >
        {submitError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="p-3 text-sm text-success bg-success/10 border border-success/20 rounded-md">
            {submitSuccess}
          </div>
        )}
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="register-firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="register-firstName"
                placeholder="John"
                className={`pl-10 ${errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("firstName")}
                autoComplete="given-name"
                autoFocus
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-destructive animate-fade-in" id="register-firstName-error">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-lastName">Last name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="register-lastName"
                placeholder="Doe"
                className={`pl-10 ${errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("lastName")}
                autoComplete="family-name"
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-destructive animate-fade-in" id="register-lastName-error">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="register-email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="register-email"
              type="email"
              placeholder="name@company.com"
              className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("email")}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive animate-fade-in" id="register-email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="register-phone">Phone number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="register-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={`pl-10 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("phone")}
              autoComplete="tel"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive animate-fade-in" id="register-phone-error">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Role Selection — Custom dropdown */}
        <div className="space-y-2">
          <Label htmlFor="register-role">Role</Label>
          <div className="relative">
            <button
              type="button"
              id="register-role"
              onClick={() => setRoleOpen(!roleOpen)}
              className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.role
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-input"
              } ${selectedRole ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span>
                {selectedRole
                  ? roles.find((r) => r.value === selectedRole)?.label
                  : "Select your role"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  roleOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown panel */}
            {roleOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg animate-fade-in">
                <div className="p-1">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setValue("role", role.value, { shouldValidate: true });
                        setRoleOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                        selectedRole === role.value
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-popover-foreground"
                      }`}
                      id={`register-role-${role.value}`}
                    >
                      <Check
                        className={`h-3.5 w-3.5 ${
                          selectedRole === role.value
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {errors.role && (
            <p className="text-xs text-destructive animate-fade-in" id="register-role-error">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className={`pl-10 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("password")}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              id="register-toggle-password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive animate-fade-in" id="register-password-error">
              {errors.password.message}
            </p>
          )}
          <PasswordStrength password={password || ""} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="register-confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="register-confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
              {...register("confirmPassword")}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              id="register-toggle-confirm-password"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive animate-fade-in" id="register-confirmPassword-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms notice */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          By creating an account, you agree to our{" "}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          .
        </p>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          disabled={isSubmitting}
          id="register-submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
