import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    const path = dashboardPathForRole(user?.role);
    navigate(path, { replace: true });
  }, [loading, isAuthenticated, user?.role, navigate]);

  return (
    <section className="container py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{loading ? "Checking session…" : "Redirecting…"}</h1>
      <p className="text-muted-foreground">{loading ? "Please wait" : "Taking you to your dashboard."}</p>
    </section>
  );
}
