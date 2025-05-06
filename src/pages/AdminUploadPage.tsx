
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { AdminUploadPanel } from "@/components/admin/AdminUploadPanel";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminUploadPage = () => {
  const { toast } = useToast();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  
  // If not logged in or not an admin, redirect to home
  if (!isLoggedIn || !isAdmin) {
    toast({
      title: "Access Denied",
      description: "You must be logged in as an admin to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }
  
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
      
      <main className="flex-grow container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Admin Upload</h1>
          <p className="text-lg text-gray-600">
            Use this form to upload new agent configuration files.
          </p>
        </div>
        
        <div className="mt-8">
          <AdminUploadPanel />
        </div>
      </main>
      
      <Footer />
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

export default AdminUploadPage;
