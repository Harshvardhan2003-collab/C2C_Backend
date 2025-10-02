import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Video, 
  BookOpen, 
  Award,
  Search,
  Play,
  Download,
  ExternalLink
} from "lucide-react";

export default function Resources() {
  const categories = [
    { name: "Resume Building", icon: FileText, count: 12 },
    { name: "Interview Skills", icon: Video, count: 18 },
    { name: "Technical Skills", icon: BookOpen, count: 24 },
    { name: "Soft Skills", icon: Award, count: 15 },
  ];

  const featured = [
    {
      title: "Crafting the Perfect Resume",
      description: "Learn how to create a resume that stands out to employers",
      type: "Video Course",
      duration: "45 min",
      category: "Resume Building"
    },
    {
      title: "Interview Preparation Guide",
      description: "Master common interview questions and techniques",
      type: "PDF Guide",
      pages: "28 pages",
      category: "Interview Skills"
    },
    {
      title: "React.js Fundamentals",
      description: "Build modern web applications with React",
      type: "Video Series",
      duration: "3 hours",
      category: "Technical Skills"
    },
  ];

  const quizzes = [
    { title: "JavaScript Basics", questions: 20, difficulty: "Beginner", category: "Technical" },
    { title: "Communication Skills", questions: 15, difficulty: "Intermediate", category: "Soft Skills" },
    { title: "Problem Solving", questions: 25, difficulty: "Advanced", category: "Technical" },
  ];

  const templates = [
    { name: "Professional Resume Template", format: "DOCX", downloads: 1234 },
    { name: "Cover Letter Template", format: "DOCX", downloads: 892 },
    { name: "Internship Report Template", format: "PDF", downloads: 2156 },
    { name: "Portfolio Website Template", format: "HTML", downloads: 645 },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">Enhance your skills and prepare for success</p>
        </div>

        {/* Search */}
        <Card className="mb-8 animate-fade-in-up">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for resources, tutorials, or guides..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {categories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-smooth transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-3">
                  <category.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} resources</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Resources */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Featured Resources</CardTitle>
                <CardDescription>Curated content to boost your career readiness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featured.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-smooth transition-smooth">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground space-x-3">
                        <span className="flex items-center">
                          {resource.type === "Video Course" || resource.type === "Video Series" ? (
                            <Video className="h-4 w-4 mr-1" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          {resource.type}
                        </span>
                        <span>{"duration" in resource ? resource.duration : resource.pages}</span>
                      </div>
                      <Button variant="hero" size="sm">
                        {resource.type.includes("Video") ? (
                          <>
                            <Play className="mr-2 h-3 w-3" />
                            Watch
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quizzes */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Skill Assessment Quizzes</CardTitle>
                <CardDescription>Test your knowledge and track your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizzes.map((quiz, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center justify-between hover:shadow-smooth transition-smooth">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{quiz.questions} questions</span>
                        <Badge variant="outline" className="text-xs">
                          {quiz.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {quiz.category}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline">
                      Start Quiz
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Templates */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Download Templates</CardTitle>
                <CardDescription>Ready-to-use templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-smooth transition-smooth">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{template.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.format}
                        </Badge>
                        <span>{template.downloads} downloads</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Video Library */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Popular Videos</CardTitle>
                <CardDescription>Trending tutorials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Time Management Tips", "LinkedIn Profile Optimization", "Networking Strategies"].map((video, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-smooth">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{video}</p>
                      <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 20 + 5)} min</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="animate-fade-in-up gradient-primary">
              <CardContent className="p-6 text-center text-primary-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm mb-4 opacity-90">
                  Can't find what you're looking for?
                </p>
                <Button variant="secondary" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
