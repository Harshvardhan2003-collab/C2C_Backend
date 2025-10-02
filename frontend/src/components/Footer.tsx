import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="C2C Portal logo"
                className="h-16 w-16 rounded-lg object-cover"
                loading="lazy"
              />
              <span className="text-xl font-bold">C2C Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students, colleges, and careers through streamlined
              internship management.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/student"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/industry"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Industry Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/faculty"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Faculty Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="font-semibold mb-4">Team</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Anuj%20Shrivastav"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Anuj Shrivastav
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Divyansh%20Agrawal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Divyansh Agrawal
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Bhavya%20Gupta"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Bhavya Gupta
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Anish%20Kumar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Anish Kumar
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Khushi%20Sharma"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Khushi Sharma
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/search/results/people/?keywords=Harshvardhan%20Chadar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Harshvardhan Chadar
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>support@c2cportal.edu</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Campus Address, University Town, ST 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} C2C Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
