import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Award,
  TrendingUp,
  MapPin,
  DollarSign,
  ExternalLink
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    if (user?.role !== "student") {
      navigate(dashboardPathForRole(user?.role), { replace: true });
    }
  }, [loading, isAuthenticated, user?.role, navigate]);
  const stats = [
    { label: "Applications", value: "12", icon: Briefcase, color: "text-primary" },
    { label: "Ongoing", value: "2", icon: Clock, color: "text-accent" },
    { label: "Completed", value: "5", icon: CheckCircle2, color: "text-green-500" },
    { label: "Credits Earned", value: "15", icon: Award, color: "text-primary" },
  ];

  const opportunities = [
    {
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      location: "Remote",
      type: "Paid",
      duration: "3 months",
      domain: "Web Development",
      salary: "$800/month"
    },
    {
      title: "Data Science Intern",
      company: "Analytics Pro",
      location: "Hybrid - New York",
      type: "Paid",
      duration: "6 months",
      domain: "Data Science",
      salary: "$1200/month"
    },
    {
      title: "UI/UX Design Intern",
      company: "Creative Studios",
      location: "Onsite - San Francisco",
      type: "Unpaid",
      duration: "2 months",
      domain: "Design",
      salary: "Stipend"
    },
  ];

  const applications = [
    { company: "TechCorp", position: "Frontend Developer", status: "Shortlisted", date: "2024-01-15" },
    { company: "DataViz Inc", position: "Data Analyst", status: "Applied", date: "2024-01-20" },
    { company: "CloudSystems", position: "Backend Developer", status: "Selected", date: "2024-01-10" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected": return "bg-green-500";
      case "Shortlisted": return "bg-accent";
      case "Applied": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your internship overview</p>
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
            {/* Internship Opportunities */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Available Opportunities</CardTitle>
                <CardDescription>Find your next internship</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-smooth transition-smooth">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{opp.title}</h3>
                        <p className="text-muted-foreground">{opp.company}</p>
                      </div>
                      <Badge className={opp.type === "Paid" ? "gradient-primary text-primary-foreground" : ""}>
                        {opp.type}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {opp.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {opp.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {opp.salary}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{opp.domain}</Badge>
                      <Button variant="hero" size="sm">
                        Apply Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* My Applications */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your application status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-smooth transition-smooth">
                      <div className="space-y-1">
                        <p className="font-semibold">{app.position}</p>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                        <p className="text-xs text-muted-foreground">{app.date}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to increase visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Basic Information
                  </div>
                  <div className="flex items-center text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Resume Uploaded
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Complete Skill Assessment
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Modules */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
                <CardDescription>Enhance your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Resume Building</span>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Interview Skills</span>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Technical Skills</span>
                  </div>
                  <Badge variant="outline">Not Started</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
