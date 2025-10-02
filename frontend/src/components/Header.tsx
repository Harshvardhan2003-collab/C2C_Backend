import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";
import GoogleSignInButton from "./GoogleSignInButton";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Internships", path: "/internships" },
    { name: "Resources", path: "/resources" },
    { name: "About", path: "/about" },
  ];

  // Landing-only section links for guests (absolute anchors so they work from any route)
  const sectionLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "How it works", path: "/#how-it-works" },
    { name: "Get Started", path: "/#get-started" },
    { name: "FAQ", path: "/#faq" },
  ];

  const roleLink =
    user?.role === "faculty"
      ? { name: "Faculty", path: "/faculty" }
      : user?.role === "industry"
      ? { name: "Industry", path: "/industry" }
      : { name: "Student", path: "/student" };

  const authedLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: dashboardPathForRole(user?.role) },
    { name: "Courses", path: "/courses" },
    { name: "Internships", path: "/internships" },
    { name: "Resources", path: "/resources" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="C2C Portal logo"
            className="h-16 w-16 rounded-lg object-cover"
            loading="eager"
          />
          <span className="text-xl font-bold">C2C Portal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {(isAuthenticated ? authedLinks : sectionLinks).map((link) => {
            const isSection =
              link.path.startsWith("/#") || link.path.startsWith("#");
            if (isSection) {
              return (
                <a
                  key={link.path}
                  href={
                    link.path.startsWith("/#") ? link.path : `/${link.path}`
                  }
                  className={`font-medium transition-smooth hover:text-primary ${
                    location.hash &&
                    link.path.endsWith(location.hash.replace("#", ""))
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-smooth hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  No new notifications
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {isAuthenticated && (
            <button
              className="hidden md:inline-flex h-9 w-9 rounded-full overflow-hidden border hover:ring-2 hover:ring-primary/50 transition-smooth"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs font-medium">
                  {(user?.email?.[0] ?? "U").toUpperCase()}
                </div>
              )}
            </button>
          )}

          {!isAuthenticated ? (
            <div className="hidden md:block">
              <GoogleSignInButton redirectTo="profile" />
            </div>
          ) : (
            <Button
              variant="outline"
              className="hidden md:inline-flex"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col space-y-3">
            {(isAuthenticated ? authedLinks : sectionLinks).map((link) => {
              const isSection =
                link.path.startsWith("/#") || link.path.startsWith("#");
              if (isSection) {
                return (
                  <a
                    key={link.path}
                    href={
                      link.path.startsWith("/#") ? link.path : `/${link.path}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium transition-smooth hover:text-primary ${
                      location.hash &&
                      link.path.endsWith(location.hash.replace("#", ""))
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-smooth hover:text-primary ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAuthenticated && (
              <button
                className="self-start h-9 w-9 rounded-full overflow-hidden border"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/profile");
                }}
                aria-label="Profile"
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center text-xs font-medium">
                    {(user?.email?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </button>
            )}

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            {!isAuthenticated ? (
              <div className="w-full">
                <GoogleSignInButton redirectTo="profile" />
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
