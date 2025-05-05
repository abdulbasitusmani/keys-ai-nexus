
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Navbar({ isLoggedIn = false, isAdmin = false, onLoginClick, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-brand-navy">Keys-AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/" className="text-sm font-medium underline-animation">Home</Link>
          <Link to="/services" className="text-sm font-medium underline-animation">Services</Link>
          <Link to="/packages" className="text-sm font-medium underline-animation">Packages</Link>
          <Link to="/about" className="text-sm font-medium underline-animation">About</Link>
          <Link to="/contact" className="text-sm font-medium underline-animation">Contact</Link>
          
          {isLoggedIn && isAdmin && (
            <Link 
              to="/admin/add-agent" 
              className="text-sm font-medium bg-brand-gold text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Admin Panel
            </Link>
          )}
          
          {isLoggedIn ? (
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="text-sm"
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={onLoginClick}
              className="bg-brand-navy hover:bg-opacity-90 text-sm"
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium py-2">Home</Link>
          <Link to="/services" className="block text-sm font-medium py-2">Services</Link>
          <Link to="/packages" className="block text-sm font-medium py-2">Packages</Link>
          <Link to="/about" className="block text-sm font-medium py-2">About</Link>
          <Link to="/contact" className="block text-sm font-medium py-2">Contact</Link>
          
          {isLoggedIn && isAdmin && (
            <Link 
              to="/admin/add-agent" 
              className="block text-sm font-medium py-2 text-brand-gold"
            >
              Admin Panel
            </Link>
          )}
          
          {isLoggedIn ? (
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="w-full justify-start text-sm"
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={onLoginClick}
              className="w-full justify-start bg-brand-navy hover:bg-opacity-90 text-sm"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
