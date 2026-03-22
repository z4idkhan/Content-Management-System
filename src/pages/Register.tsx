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

  // =========================
  // VALIDATION HELPERS
  // =========================
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // =========================
  // SUBMIT (FIXED)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await register(trimmedName, trimmedEmail, trimmedPassword, role);

      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      if (message === "ALREADY_REGISTERED") {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false); // ✅ always reset
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-background items-center justify-center p-12">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="font-bold text-2xl">Headless CMS</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Join the team<br />and start creating.
          </h1>

          <p className="text-muted-foreground text-lg max-w-md">
            Create your account and gain access to a powerful CMS.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-muted-foreground mb-8">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* EMAIL */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* ROLE */}
            <div className="flex gap-3">
              {(["EMPLOYEE", "ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-md ${
                    role === r
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-blue-500 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;