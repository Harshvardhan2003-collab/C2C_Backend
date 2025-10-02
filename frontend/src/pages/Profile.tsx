import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, LogOut, User } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const roleColor = (role?: string) =>
    role === "faculty"
      ? "bg-purple-600"
      : role === "industry"
      ? "bg-emerald-600"
      : "bg-primary";

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Card */}
        <Card className="lg:col-span-1 animate-fade-in-up">
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>Basic information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border shadow-sm">
                {user?.picture ? (
                  <img src={user.picture} alt="Profile" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{user?.name ?? user?.email ?? "User"}</p>
                  <Badge className={`${roleColor(user?.role)} text-white`}> {user?.role ?? "student"} </Badge>
                </div>
                {user?.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={dashboardPathForRole(user?.role)}>
                <Button variant="hero">Go to My Dashboard</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences & Security */}
        <div className="lg:col-span-2 grid gap-6">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Theme and accessibility</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the theme toggle in the header to switch between light and dark modes. Your preference is saved locally.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Signed in with Google</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                <li>OAuth 2.0 via Google</li>
                <li>Role inferred securely from your email domain</li>
                <li>Local session stored in your browser only</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right column extra content */}
      <div className="lg:col-span-2 grid gap-6 mt-6">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Overview of your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg border bg-card/50">
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name ?? "—"}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email ?? "—"}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user?.role ?? "student"}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <p className="text-muted-foreground">Theme</p>
                <p className="font-medium">Use header toggle to switch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Jump to your key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link to="/student">
                <Button variant={(user?.role ?? "student") === "student" ? "hero" : "outline"}>Student Portal</Button>
              </Link>
              <Link to="/industry">
                <Button variant={(user?.role ?? "student") === "industry" ? "hero" : "outline"}>Industry Portal</Button>
              </Link>
              <Link to="/faculty">
                <Button variant={(user?.role ?? "student") === "faculty" ? "hero" : "outline"}>Faculty Portal</Button>
              </Link>
              <Link to={dashboardPathForRole(user?.role)}>
                <Button variant="secondary">Open My Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
