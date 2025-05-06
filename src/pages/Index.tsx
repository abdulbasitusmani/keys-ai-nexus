
import { useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowToUse } from "@/components/home/HowToUse";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  
  const handleLoginClick = () => {
    setShowAuthForm(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLoginClick={handleLoginClick} 
        onLogout={signOut} 
      />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowToUse />
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

export default Index;
