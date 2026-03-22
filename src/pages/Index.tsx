import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

useEffect(() => {
  if (isLoading) return;

  if (user) {
    navigate("/dashboard");
  } else {
    navigate("/login");
  }
}, [user, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Index;