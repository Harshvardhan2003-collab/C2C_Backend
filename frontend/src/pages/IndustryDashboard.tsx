import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  Eye, 
  UserPlus,
  TrendingUp,
  BarChart3,
  Plus
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";

export default function IndustryDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    if (user?.role !== "industry") {
      navigate(dashboardPathForRole(user?.role), { replace: true });
    }
  }, [loading, isAuthenticated, user?.role, navigate]);
  const stats = [
    { label: "Active Listings", value: "8", icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: "156", icon: Users, color: "text-accent" },
    { label: "Shortlisted", value: "24", icon: UserPlus, color: "text-green-500" },
    { label: "Total Views", value: "892", icon: Eye, color: "text-primary" },
  ];

  const listings = [
    {
      title: "Frontend Developer Intern",
      posted: "Jan 15, 2024",
      applicants: 45,
      shortlisted: 8,
      status: "Active"
    },
    {
      title: "Data Analyst Intern",
      posted: "Jan 10, 2024",
      applicants: 62,
      shortlisted: 12,
      status: "Active"
    },
    {
      title: "Marketing Intern",
      posted: "Jan 5, 2024",
      applicants: 28,
      shortlisted: 4,
      status: "Closed"
    },
  ];

  const recentApplicants = [
    { name: "Sarah Johnson", position: "Frontend Developer", skills: ["React", "TypeScript", "CSS"], gpa: "3.8" },
    { name: "Michael Chen", position: "Data Analyst", skills: ["Python", "SQL", "Tableau"], gpa: "3.9" },
    { name: "Emily Davis", position: "Frontend Developer", skills: ["Vue.js", "JavaScript"], gpa: "3.7" },
    { name: "James Wilson", position: "Marketing Intern", skills: ["SEO", "Content", "Analytics"], gpa: "3.6" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Industry Dashboard</h1>
            <p className="text-muted-foreground">Manage your internship postings and candidates</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Post New Internship
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Listings */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Your Internship Postings</CardTitle>
                <CardDescription>Manage and monitor your listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {listings.map((listing, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-smooth transition-smooth">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">Posted on {listing.posted}</p>
                      </div>
                      <Badge className={listing.status === "Active" ? "gradient-primary text-primary-foreground" : ""}>
                        {listing.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Applicants</p>
                        <p className="text-2xl font-bold">{listing.applicants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Shortlisted</p>
                        <p className="text-2xl font-bold">{listing.shortlisted}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Applicants
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit Listing
                      </Button>
                      {listing.status === "Active" && (
                        <Button variant="destructive" size="sm">
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Applicants */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Recent Applicants</CardTitle>
                <CardDescription>Review candidate profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplicants.map((applicant, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg hover:shadow-smooth transition-smooth">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{applicant.name}</p>
                          <Badge variant="secondary">GPA: {applicant.gpa}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{applicant.position}</p>
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="hero" size="sm" className="ml-4">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Application Analytics</CardTitle>
                <CardDescription>Insights on your postings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Applicants per Post</span>
                  <span className="font-bold text-lg">52</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-lg">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Time to Fill</span>
                  <span className="font-bold text-lg">18 days</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center text-primary mb-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">12% increase this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Most In-Demand Skills</CardTitle>
                <CardDescription>From your applicant pool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["React.js", "Python", "JavaScript", "SQL", "TypeScript"].map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{skill}</span>
                    <Badge variant="secondary">{Math.floor(Math.random() * 30) + 20}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Full Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
