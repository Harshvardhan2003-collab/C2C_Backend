import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@c2cportal.edu",
      link: "mailto:support@c2cportal.edu",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Campus Address, University Town, ST 12345",
      link: "#",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday: 9:00 AM - 5:00 PM",
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "How do I apply for an internship?",
      answer:
        "Log in to your student portal, browse available internships, and click 'Apply Now' on positions that interest you. Make sure your profile and resume are up to date before applying.",
    },
    {
      question: "How long does the approval process take?",
      answer:
        "Faculty typically review and approve internship applications within 3-5 business days. You'll receive a notification once your application has been reviewed.",
    },
    {
      question: "Can I apply for multiple internships at once?",
      answer:
        "Yes, you can apply to multiple internships simultaneously. However, we recommend focusing on positions that align with your skills and career goals.",
    },
    {
      question: "What if I need to cancel an approved internship?",
      answer:
        "Contact your faculty coordinator immediately. They will guide you through the proper cancellation process and help you find alternative opportunities if needed.",
    },
    {
      question: "How do I submit my internship reports?",
      answer:
        "Navigate to your student dashboard and access the 'Logbook & Reports' section. You can submit daily/weekly logs and generate NEP-compliant reports from there.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you succeed in
            your internship journey.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-smooth transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-3">
                  <info.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                {info.link !== "#" ? (
                  <a
                    href={info.link}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {info.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="hero">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>FAQ'S</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="animate-fade-in-up">
              <CardContent className="p-0">
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Map Location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
