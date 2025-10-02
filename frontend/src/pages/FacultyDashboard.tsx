import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
      return;
    }
    if (user?.role !== "faculty") {
      navigate(dashboardPathForRole(user?.role), { replace: true });
    }
  }, [loading, isAuthenticated, user?.role, navigate]);
  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "text-primary" },
    { label: "Active Internships", value: "42", icon: Briefcase, color: "text-accent" },
    { label: "Pending Approvals", value: "8", icon: AlertCircle, color: "text-orange-500" },
    { label: "Completed", value: "94", icon: CheckCircle2, color: "text-green-500" },
  ];

  const pendingReports = [
    {
      student: "Sarah Johnson",
      internship: "Frontend Developer at TechCorp",
      type: "Weekly Report",
      submitted: "2 hours ago",
      weeks: "Week 4/12"
    },
    {
      student: "Michael Chen",
      internship: "Data Analyst at Analytics Pro",
      type: "Monthly Report",
      submitted: "1 day ago",
      weeks: "Month 2/6"
    },
    {
      student: "Emily Davis",
      internship: "UI Designer at Creative Studios",
      type: "Final Report",
      submitted: "3 days ago",
      weeks: "Final Submission"
    },
  ];

  const studentProgress = [
    { name: "Sarah Johnson", program: "Computer Science", internship: "TechCorp", progress: 75, status: "On Track" },
    { name: "Michael Chen", program: "Data Science", internship: "Analytics Pro", progress: 40, status: "On Track" },
    { name: "Emily Davis", program: "Design", internship: "Creative Studios", progress: 90, status: "Excellent" },
    { name: "James Wilson", program: "Business", internship: "Marketing Inc", progress: 60, status: "On Track" },
  ];

  const pendingApprovals = [
    { student: "Alex Turner", company: "StartupXYZ", position: "Software Engineer Intern", applied: "Jan 20, 2024" },
    { student: "Maria Garcia", company: "FinTech Solutions", position: "Financial Analyst Intern", applied: "Jan 19, 2024" },
    { student: "David Lee", company: "Healthcare Inc", position: "Research Intern", applied: "Jan 18, 2024" },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-accent";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and manage approvals</p>
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
            {/* Pending Reports */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Reports</CardTitle>
                    <CardDescription>Review and approve student submissions</CardDescription>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    {pendingReports.length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-smooth transition-smooth">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{report.student}</h3>
                        <p className="text-sm text-muted-foreground">{report.internship}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <FileCheck className="h-3 w-3 mr-1" />
                            {report.type}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {report.submitted}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{report.weeks}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="hero" size="sm" className="flex-1">
                        Review Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Request Changes
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Student Progress Tracking</CardTitle>
                <CardDescription>Monitor internship completion status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentProgress.map((student, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.program}</p>
                      </div>
                      <Badge className={student.status === "Excellent" ? "gradient-primary text-primary-foreground" : ""}>
                        {student.status}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{student.internship}</span>
                        <span className="font-semibold">{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className={getProgressColor(student.progress)} />
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Internship Approvals</CardTitle>
                <CardDescription>Review and approve student applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApprovals.map((approval, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{approval.student}</p>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{approval.position}</p>
                      <p className="text-sm text-muted-foreground">{approval.company}</p>
                      <p className="text-xs text-muted-foreground">Applied: {approval.applied}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="hero" size="sm" className="flex-1">
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Department Overview */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Current statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Participation Rate</span>
                  <span className="font-bold text-lg">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Completion</span>
                  <span className="font-bold text-lg">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Industry Partners</span>
                  <span className="font-bold text-lg">34</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center text-primary mb-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">8% increase this semester</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p>Approved internship for Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FileCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p>Reviewed weekly report from Michael Chen</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p>Approved MoU with TechCorp Solutions</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Export Student Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
