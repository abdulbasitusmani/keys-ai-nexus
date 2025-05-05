
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AddAgentForm } from "@/components/admin/AddAgentForm";
import { useToast } from "@/components/ui/use-toast";

const AdminAddAgentPage = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for demo purposes
  const [isAdmin, setIsAdmin] = useState(true); // Default to true for demo purposes
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  // For a real app, we would check if the user is an admin here
  // and redirect them if they're not
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLoginClick={handleLoginClick} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Admin Panel</h1>
          <p className="text-lg text-gray-600">
            Use this form to add new AI agents to the platform.
          </p>
        </div>
        
        <AddAgentForm />
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

export default AdminAddAgentPage;
