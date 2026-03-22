import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EMPLOYEE">("EMPLOYEE");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      if (err?.message === "ALREADY_REGISTERED") {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error(err?.message || "Registration failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-background items-center justify-center p-12">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">H</div>
            <span className="text-foreground font-bold text-2xl">Headless CMS</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Join the team<br />and start creating.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Create your account and gain access to a powerful content management platform built for modern teams.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create an account</h2>
          <p className="text-muted-foreground mb-8">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@headless.co.jp"
                className="w-full px-4 py-2.5 rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••"
                  className="w-full px-4 py-2.5 rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Register as</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRole("EMPLOYEE")}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-colors ${
                    role === "EMPLOYEE"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
                  }`}>
                  Employee
                </button>
                <button type="button" onClick={() => setRole("ADMIN")}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-colors ${
                    role === "ADMIN"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
                  }`}>
                  Admin
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-gold-hover transition-colors disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-8">© 2026 Headless Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
