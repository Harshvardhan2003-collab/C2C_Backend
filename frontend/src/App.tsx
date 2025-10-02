import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import IndustryDashboard from "./pages/IndustryDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { ScrollToTop } from "./components/ScrollToTop";
import Courses from "./pages/Courses";
import Internships from "./pages/Internships";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";

const queryClient = new QueryClient();

const AppContent = () => {
  useSmoothScroll();
  const location = useLocation();

  // Show footer only on landing page
  const showFooter = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/industry" element={<IndustryDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
